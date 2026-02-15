/**
 * 千葉ハザードマップ 危険度スコアアプリ
 * メインアプリケーションロジック
 */

// ===== 定数 =====
const GSI_GEOCODE_URL = 'https://msearch.gsi.go.jp/address-search/AddressSearch';
const GSI_TILE_URL = 'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png';

const HAZARD_LAYERS = {
    flood: {
        name: '洪水浸水想定',
        url: 'https://disaportaldata.gsi.go.jp/raster/01_flood_l2_shinsuishin_data/{z}/{x}/{y}.png',
        attribution: '国土交通省ハザードマップポータル'
    },
    tsunami: {
        name: '津波浸水想定',
        url: 'https://disaportaldata.gsi.go.jp/raster/04_tsunami_newlegend_data/{z}/{x}/{y}.png',
        attribution: '国土交通省ハザードマップポータル'
    },
    landslide: {
        name: '土砂災害警戒区域',
        url: 'https://disaportaldata.gsi.go.jp/raster/05_dosekiryukeikaikuiki/{z}/{x}/{y}.png',
        attribution: '国土交通省ハザードマップポータル'
    },
    storm: {
        name: '高潮浸水想定',
        url: 'https://disaportaldata.gsi.go.jp/raster/03_hightide_l2_shinsuishin_data/{z}/{x}/{y}.png',
        attribution: '国土交通省ハザードマップポータル'
    }
};

const CATEGORY_EMOJI = {
    flood: '🌊',
    tsunami: '🌊',
    landslide: '⛰️',
    storm: '🌀',
    liquefaction: '💧'
};

const CATEGORY_NAMES = {
    flood: '洪水リスク',
    tsunami: '津波リスク',
    landslide: '土砂災害リスク',
    storm: '高潮リスク',
    liquefaction: '液状化リスク'
};

// ===== 状態管理 =====
let map = null;
let marker = null;
let hazardOverlays = {};
let activeOverlays = new Set();

// ===== 初期化 =====
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    bindEvents();
});

function initMap() {
    // 千葉県の中心で初期化
    map = L.map('map', {
        center: [35.6, 140.1],
        zoom: 9,
        zoomControl: true
    });

    // ベースタイル（地理院地図 淡色地図）
    L.tileLayer(GSI_TILE_URL, {
        attribution: '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>',
        maxZoom: 18
    }).addTo(map);

    // ハザードレイヤーを事前に作成
    Object.entries(HAZARD_LAYERS).forEach(([key, info]) => {
        hazardOverlays[key] = L.tileLayer(info.url, {
            opacity: 0.6,
            maxZoom: 18,
            attribution: info.attribution
        });
    });
}

function bindEvents() {
    const form = document.getElementById('searchForm');
    const input = document.getElementById('addressInput');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        performSearch();
    });

    // ヒント住所クリック
    document.querySelectorAll('.hint-address').forEach(el => {
        el.addEventListener('click', () => {
            input.value = el.textContent;
            performSearch();
        });
    });

    // レイヤー切替ボタン
    document.querySelectorAll('.layer-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            toggleLayer(btn.dataset.layer);
            btn.classList.toggle('active');
        });
    });
}

// ===== 検索処理 =====
async function performSearch() {
    const input = document.getElementById('addressInput');
    const address = input.value.trim();

    if (!address) {
        showError('住所を入力してください');
        return;
    }

    // 千葉県チェック
    if (!address.includes('千葉')) {
        showError('千葉県の住所を入力してください（例: 千葉市中央区...）');
        return;
    }

    hideError();
    showLoading();

    try {
        // 1. ジオコーディング
        const location = await geocodeAddress(address);
        if (!location) {
            hideLoading();
            showError('住所が見つかりませんでした。もう少し詳しい住所を入力してください。');
            return;
        }

        // 2. 市区町村の抽出とハザードデータ取得
        const municipality = extractMunicipality(address) || extractMunicipality(location.label || '');
        const hazardInfo = municipality ? CHIBA_HAZARD_DATA[municipality] : null;

        if (!hazardInfo) {
            hideLoading();
            showError(`「${municipality || address}」のハザードデータが見つかりませんでした。千葉県内の市区町村名を含む住所を入力してください。`);
            return;
        }

        // 3. スコア計算
        const result = calculateSafetyScore(hazardInfo);

        // 4. 表示更新
        updateMap(location.lat, location.lng);
        displayResults(municipality, address, result, hazardInfo);

        hideLoading();
    } catch (err) {
        hideLoading();
        showError('エラーが発生しました: ' + err.message);
        console.error(err);
    }
}

// ===== ジオコーディング（国土地理院 API） =====
async function geocodeAddress(address) {
    const url = `${GSI_GEOCODE_URL}?q=${encodeURIComponent(address)}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data || data.length === 0) return null;

    const first = data[0];
    const coords = first.geometry.coordinates; // [lng, lat]
    return {
        lat: coords[1],
        lng: coords[0],
        label: first.properties.title || ''
    };
}

// ===== 地図更新 =====
function updateMap(lat, lng) {
    // コンテナがhidden→visibleに変わった後、サイズを再計算
    setTimeout(() => { map.invalidateSize(); }, 100);
    map.setView([lat, lng], 14);

    if (marker) {
        marker.setLatLng([lat, lng]);
    } else {
        marker = L.marker([lat, lng]).addTo(map);
    }

    marker.bindPopup('📍 入力した地点').openPopup();

    // デフォルトで洪水レイヤーを表示
    if (activeOverlays.size === 0) {
        toggleLayer('flood');
        document.querySelector('[data-layer="flood"]')?.classList.add('active');
    }
}

function toggleLayer(layerKey) {
    const overlay = hazardOverlays[layerKey];
    if (!overlay) return;

    if (activeOverlays.has(layerKey)) {
        map.removeLayer(overlay);
        activeOverlays.delete(layerKey);
    } else {
        overlay.addTo(map);
        activeOverlays.add(layerKey);
    }
}

// ===== 結果表示 =====
function displayResults(municipality, address, result, hazardInfo) {
    const section = document.getElementById('resultsSection');
    section.classList.add('active');

    // 市区町村名と住所
    document.getElementById('scoreMunicipality').textContent = municipality;
    document.getElementById('scoreAddress').textContent = address;

    // スコアサークルアニメーション
    const score = result.totalScore;
    const gradeInfo = getScoreGrade(score);

    // サークルの塗りつぶし
    const circle = document.getElementById('scoreCircleFill');
    const circumference = 565.48; // 2 * π * 90
    const offset = circumference - (circumference * score / 100);
    circle.style.strokeDashoffset = offset;
    circle.style.stroke = gradeInfo.color;

    // スコアカードのクラス更新
    const card = document.getElementById('scoreCard');
    card.className = 'score-card';
    if (score >= 60) card.classList.add('safe');
    else if (score >= 40) card.classList.add('caution');
    else card.classList.add('danger');

    // 数値アニメーション
    animateNumber('scoreValue', 0, score, 1200);

    // グレード表示
    const gradeEl = document.getElementById('scoreGrade');
    gradeEl.textContent = `${gradeInfo.emoji} ${gradeInfo.grade}`;
    gradeEl.style.color = gradeInfo.color;

    // 説明文
    document.getElementById('scoreDescription').textContent = getScoreDescription(score);

    // 内訳表示
    displayBreakdown(result.breakdown);

    // 公式リンク
    const linkEl = document.getElementById('officialLink');
    if (hazardInfo.officialUrl) {
        linkEl.innerHTML = `
      <a href="${hazardInfo.officialUrl}" target="_blank" rel="noopener">
        🔗 ${municipality}の公式ハザードマップを確認する →
      </a>
      <div class="link-note">※ 詳細なリスク情報は各市町村の公式ハザードマップでご確認ください</div>
    `;
    }

    // スクロール
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function displayBreakdown(breakdown) {
    const grid = document.getElementById('breakdownGrid');
    grid.innerHTML = '';

    const items = [
        { key: 'flood', name: CATEGORY_NAMES.flood, emoji: '🌊' },
        { key: 'tsunami', name: CATEGORY_NAMES.tsunami, emoji: '🏖️' },
        { key: 'landslide', name: CATEGORY_NAMES.landslide, emoji: '⛰️' },
        { key: 'storm', name: CATEGORY_NAMES.storm, emoji: '🌀' },
        { key: 'liquefaction', name: CATEGORY_NAMES.liquefaction, emoji: '💧' }
    ];

    items.forEach(({ key, name, emoji }) => {
        const data = breakdown[key];
        const barColor = getBarColor(data.riskLevel);
        const percent = (data.score / data.maxPoints) * 100;

        const el = document.createElement('div');
        el.className = 'breakdown-item';
        el.innerHTML = `
      <div class="item-header">
        <span class="item-name">${emoji} ${name}</span>
        <span class="item-score" style="color: ${barColor}">${data.score}/${data.maxPoints}</span>
      </div>
      <div class="bar-track">
        <div class="bar-fill" style="background: ${barColor}"></div>
      </div>
      <div class="risk-label">危険度: ${getRiskLabel(data.riskLevel)}</div>
    `;

        grid.appendChild(el);

        // バーのアニメーション（少し遅延）
        requestAnimationFrame(() => {
            setTimeout(() => {
                el.querySelector('.bar-fill').style.width = percent + '%';
            }, 300);
        });
    });
}

// ===== ユーティリティ =====
function animateNumber(elementId, start, end, duration) {
    const el = document.getElementById(elementId);
    const range = end - start;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutQuart
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(start + range * eased);
        el.textContent = current;

        const gradeInfo = getScoreGrade(current);
        el.style.color = gradeInfo.color;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

function getBarColor(riskLevel) {
    const colors = ['#10b981', '#69f0ae', '#ffeb3b', '#ffa726', '#ff5722', '#d50000'];
    return colors[Math.min(riskLevel, 5)];
}

function getScoreDescription(score) {
    if (score >= 90) return 'この地域は自然災害に対して非常に安全性が高いと評価されています。';
    if (score >= 75) return 'この地域は比較的安全ですが、一部のリスク要因にご注意ください。';
    if (score >= 60) return 'この地域はおおむね安全ですが、いくつかの災害リスクが確認されています。';
    if (score >= 45) return 'この地域には注意が必要な災害リスクがあります。詳細をご確認ください。';
    if (score >= 30) return 'この地域には複数の災害リスクがあります。公式ハザードマップで詳細を確認してください。';
    return 'この地域は複数の高い災害リスクが確認されています。防災対策を十分に行ってください。';
}

function showLoading() {
    document.getElementById('loadingOverlay').classList.add('active');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
}

function showError(msg) {
    const el = document.getElementById('errorMessage');
    el.textContent = msg;
    el.style.display = 'block';
}

function hideError() {
    document.getElementById('errorMessage').style.display = 'none';
}
