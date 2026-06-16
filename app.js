/**
 * 千葉ハザードマップ 危険度スコアアプリ
 * メインアプリケーションロジック
 */

// ===== 定数 =====
const GSI_GEOCODE_URL = 'https://msearch.gsi.go.jp/address-search/AddressSearch';
const GSI_TILE_URL = 'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png';
const HAZARD_SAMPLE_ZOOM = 14;

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

const CATEGORY_NAMES = {
    flood: '洪水リスク',
    tsunami: '津波リスク',
    landslide: '土砂災害リスク',
    storm: '高潮リスク',
    liquefaction: '液状化リスク'
};

const SCORE_WEIGHTS = {
    flood: 25,
    tsunami: 20,
    landslide: 15,
    storm: 15,
    liquefaction: 25
};

const OFFICIAL_SAMPLE_LAYERS = ['flood', 'tsunami', 'landslide', 'storm'];
const SAMPLE_RADIUS_BY_LAYER = {
    flood: 24,
    tsunami: 32,
    landslide: 16,
    storm: 24
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
    const rawAddress = input.value.trim();
    const address = normalizeChibaAddress(rawAddress);

    if (!rawAddress) {
        showError('住所を入力してください');
        return;
    }

    if (!address) {
        showError('千葉県内の住所を入力してください（例: 浦安市舞浜1）');
        return;
    }

    hideError();
    input.value = address;
    showLoading();
    setSearchBusy(true);

    try {
        // 1. ジオコーディング
        const location = await geocodeAddress(address);
        if (!location) {
            hideLoading();
            setSearchBusy(false);
            showError('住所が見つかりませんでした。もう少し詳しい住所を入力してください。');
            return;
        }

        // 2. 市区町村の抽出とハザードデータ取得
        const municipality = extractMunicipality(address) || extractMunicipality(location.label || '');
        const hazardInfo = municipality ? CHIBA_HAZARD_DATA[municipality] : null;

        if (!hazardInfo) {
            hideLoading();
            setSearchBusy(false);
            showError(`「${municipality || address}」のハザードデータが見つかりませんでした。千葉県内の市区町村名を含む住所を入力してください。`);
            return;
        }

        // 3. 入力地点の公式レイヤーを読んでスコア計算
        const result = await calculateLocationSafetyScore(location, hazardInfo);

        // 4. 表示更新
        updateMap(location.lat, location.lng, choosePreferredMapLayer(result.breakdown));
        displayResults(municipality, address, result, hazardInfo);

        hideLoading();
        setSearchBusy(false);
    } catch (err) {
        hideLoading();
        setSearchBusy(false);
        showError('エラーが発生しました: ' + err.message);
        console.error(err);
    }
}

function normalizeChibaAddress(address) {
    const cleaned = address.replace(/\s+/g, '').trim();
    if (!cleaned) return '';

    const hasOtherPrefecture = /(?:東京都|神奈川県|埼玉県|茨城県|栃木県|群馬県|山梨県|静岡県|北海道|(?:京都|大阪)府|.{2,3}県)/.test(cleaned)
        && !cleaned.includes('千葉県');
    if (hasOtherPrefecture) return '';

    if (cleaned.includes('千葉県')) return cleaned;
    if (cleaned.startsWith('千葉市')) return `千葉県${cleaned}`;
    if (extractMunicipality(cleaned)) return `千葉県${cleaned}`;
    if (cleaned.includes('千葉')) return cleaned;

    return `千葉県${cleaned}`;
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

// ===== 公式レイヤー地点判定 =====
async function calculateLocationSafetyScore(location, municipalityInfo) {
    const breakdown = {};
    let totalScore = 0;

    for (const [key, maxPoints] of Object.entries(SCORE_WEIGHTS)) {
        const result = OFFICIAL_SAMPLE_LAYERS.includes(key)
            ? await sampleOfficialLayerRisk(key, location.lat, location.lng, municipalityInfo)
            : buildReferenceRisk(key, municipalityInfo);

        const riskLevel = Number.isFinite(result.riskLevel) ? result.riskLevel : 0;
        const score = Math.round(maxPoints * (1 - riskLevel / 5));

        breakdown[key] = {
            riskLevel,
            score,
            maxPoints,
            source: result.source,
            sourceLabel: result.sourceLabel,
            sampledPixels: result.sampledPixels || 0
        };
        totalScore += score;
    }

    return {
        totalScore,
        breakdown,
        method: 'official-layer-point-sampling'
    };
}

function buildReferenceRisk(key, municipalityInfo, sourceLabel = '自治体単位の参考指標') {
    return {
        riskLevel: municipalityInfo?.[key] || 0,
        source: 'municipality-reference',
        sourceLabel
    };
}

async function sampleOfficialLayerRisk(layerKey, lat, lng, municipalityInfo) {
    const layer = HAZARD_LAYERS[layerKey];
    if (!layer) return buildReferenceRisk(layerKey, municipalityInfo);

    try {
        const tilePoint = getTilePoint(lat, lng, HAZARD_SAMPLE_ZOOM);
        const url = layer.url
            .replace('{z}', HAZARD_SAMPLE_ZOOM)
            .replace('{x}', tilePoint.tileX)
            .replace('{y}', tilePoint.tileY);
        const tile = await loadTileImageData(url);

        if (!tile.ok && tile.status === 404) {
            return {
                riskLevel: 0,
                source: 'official-layer',
                sourceLabel: '公式レイヤー該当なし'
            };
        }

        if (!tile.ok) {
            return buildReferenceRisk(layerKey, municipalityInfo, '公式レイヤー取得失敗のため自治体参考');
        }

        const sampleRadius = SAMPLE_RADIUS_BY_LAYER[layerKey] || 16;
        const samples = collectNearbyPixels(tile.imageData, tilePoint.pixelX, tilePoint.pixelY, sampleRadius);
        const risks = samples
            .map(pixel => classifyHazardPixel(layerKey, pixel))
            .filter(level => level > 0);
        const riskLevel = risks.length > 0 ? Math.max(...risks) : 0;

        return {
            riskLevel,
            source: 'official-layer',
            sourceLabel: riskLevel > 0 ? '入力地点周辺の公式レイヤー判定' : '地点周辺に公式レイヤー表示なし',
            sampledPixels: risks.length
        };
    } catch (error) {
        console.warn(`公式レイヤー判定に失敗しました: ${layerKey}`, error);
        return buildReferenceRisk(layerKey, municipalityInfo, '公式レイヤー取得失敗のため自治体参考');
    }
}

function getTilePoint(lat, lng, zoom) {
    const latRad = lat * Math.PI / 180;
    const scale = 2 ** zoom;
    const x = (lng + 180) / 360 * scale;
    const y = (1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * scale;

    return {
        tileX: Math.floor(x),
        tileY: Math.floor(y),
        pixelX: Math.floor((x - Math.floor(x)) * 256),
        pixelY: Math.floor((y - Math.floor(y)) * 256)
    };
}

async function loadTileImageData(url) {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) {
        return { ok: false, status: response.status };
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const context = canvas.getContext('2d', { willReadFrequently: true });
            context.drawImage(img, 0, 0);
            URL.revokeObjectURL(objectUrl);
            resolve({
                ok: true,
                status: response.status,
                imageData: context.getImageData(0, 0, canvas.width, canvas.height)
            });
        };
        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            resolve({ ok: false, status: 0 });
        };
        img.src = objectUrl;
    });
}

function collectNearbyPixels(imageData, centerX, centerY, radius) {
    const pixels = [];
    for (let y = centerY - radius; y <= centerY + radius; y += 1) {
        for (let x = centerX - radius; x <= centerX + radius; x += 1) {
            if (x < 0 || y < 0 || x >= imageData.width || y >= imageData.height) continue;
            const index = (y * imageData.width + x) * 4;
            pixels.push({
                r: imageData.data[index],
                g: imageData.data[index + 1],
                b: imageData.data[index + 2],
                a: imageData.data[index + 3]
            });
        }
    }
    return pixels;
}

function classifyHazardPixel(layerKey, pixel) {
    if (pixel.a < 24) return 0;

    if (layerKey === 'landslide') {
        if (pixel.r > 150 && pixel.g < 120 && pixel.b < 150) return 5;
        if (pixel.r > 190 && pixel.g > 120 && pixel.b < 120) return 4;
        if (pixel.r > 170 && pixel.g > 150) return 3;
        return 2;
    }

    if (pixel.r > 150 && pixel.b > 130 && pixel.g < 140) return 5;
    if (pixel.r > 170 && pixel.g < 130) return 4;
    if (pixel.r > 205 && pixel.g >= 120 && pixel.g < 205) return 3;
    if (pixel.b > 145 || pixel.g > 150) return 2;
    return 1;
}

// ===== 地図更新 =====
function updateMap(lat, lng, preferredLayer = 'flood') {
    // コンテナがhidden→visibleに変わった後、サイズを再計算
    setTimeout(() => { map.invalidateSize(); }, 100);
    map.setView([lat, lng], 14);

    if (marker) {
        marker.setLatLng([lat, lng]);
    } else {
        marker = L.marker([lat, lng]).addTo(map);
    }

    marker.bindPopup('入力した地点').openPopup();

    setVisibleHazardLayers([preferredLayer]);
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

function setVisibleHazardLayers(layerKeys) {
    Object.entries(hazardOverlays).forEach(([key, overlay]) => {
        if (map.hasLayer(overlay)) map.removeLayer(overlay);
        activeOverlays.delete(key);
    });

    document.querySelectorAll('.layer-btn').forEach(btn => btn.classList.remove('active'));

    layerKeys.forEach(layerKey => {
        const overlay = hazardOverlays[layerKey];
        if (!overlay) return;
        overlay.addTo(map);
        activeOverlays.add(layerKey);
        document.querySelector(`[data-layer="${layerKey}"]`)?.classList.add('active');
    });
}

function choosePreferredMapLayer(breakdown) {
    const ranked = OFFICIAL_SAMPLE_LAYERS
        .map(key => ({ key, riskLevel: breakdown[key]?.riskLevel || 0 }))
        .sort((a, b) => b.riskLevel - a.riskLevel);

    return ranked[0]?.riskLevel > 0 ? ranked[0].key : 'flood';
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
    gradeEl.textContent = gradeInfo.grade;
    gradeEl.style.color = gradeInfo.color;

    // 説明文
    document.getElementById('scoreDescription').textContent = getScoreDescription(score, result);
    document.getElementById('resultSummary').textContent = buildResultSummary(municipality, result.breakdown);

    // 内訳表示
    displayBreakdown(result.breakdown);

    // 公式リンク
    const linkEl = document.getElementById('officialLink');
    if (hazardInfo.officialUrl) {
        linkEl.innerHTML = `
      <a href="${hazardInfo.officialUrl}" target="_blank" rel="noopener">
        ${municipality}の公式ハザードマップを確認する
      </a>
      <div class="link-note">※ 洪水・津波・土砂災害・高潮は入力地点周辺の公式レイヤーを読み取っています。液状化は自治体単位の参考指標です</div>
    `;
    }

    // スクロール
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function displayBreakdown(breakdown) {
    const grid = document.getElementById('breakdownGrid');
    grid.innerHTML = '';

    const items = [
        { key: 'flood', name: CATEGORY_NAMES.flood },
        { key: 'tsunami', name: CATEGORY_NAMES.tsunami },
        { key: 'landslide', name: CATEGORY_NAMES.landslide },
        { key: 'storm', name: CATEGORY_NAMES.storm },
        { key: 'liquefaction', name: CATEGORY_NAMES.liquefaction }
    ];

    items.forEach(({ key, name }) => {
        const data = breakdown[key];
        const barColor = getBarColor(data.riskLevel);
        const percent = (data.score / data.maxPoints) * 100;

        const el = document.createElement('div');
        el.className = 'breakdown-item';
        el.innerHTML = `
      <div class="item-header">
        <span class="item-name" style="color: ${barColor}">${name}</span>
        <span class="item-score" style="color: ${barColor}">${data.score}/${data.maxPoints}</span>
      </div>
      <div class="bar-track">
        <div class="bar-fill" style="background: ${barColor}"></div>
      </div>
      <div class="risk-label">危険度: ${getRiskLabel(data.riskLevel)} ／ ${data.sourceLabel || '参考指標'}</div>
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
    const colors = ['#2f8a63', '#5f9a6d', '#c7a03a', '#b9773f', '#c25145', '#9f2f2f'];
    return colors[Math.min(riskLevel, 5)];
}

function buildResultSummary(municipality, breakdown) {
    const entries = Object.entries(breakdown)
        .map(([key, data]) => ({
            key,
            name: CATEGORY_NAMES[key],
            riskLevel: data.riskLevel,
            source: data.source
        }))
        .sort((a, b) => b.riskLevel - a.riskLevel);

    const topRisk = entries[0];
    if (!topRisk || topRisk.riskLevel <= 1) {
        return `${municipality}の入力地点周辺では、公式レイヤー上で大きなリスク表示は少なめです。周辺の地図表示もあわせて確認してください。`;
    }

    const secondRisk = entries[1];
    const pairText = secondRisk && secondRisk.riskLevel >= 3
        ? `${topRisk.name}と${secondRisk.name}`
        : topRisk.name;

    return `${municipality}の入力地点周辺では${pairText}を優先して確認すると、現地で見るべきポイントが整理しやすくなります。`;
}

function getScoreDescription(score, result) {
    const hasFallback = Object.values(result.breakdown).some(item => item.source !== 'official-layer');
    const prefix = hasFallback ? '地点周辺の公式レイヤーと一部参考指標では' : '入力地点周辺の公式レイヤー判定では';

    if (score >= 90) return `${prefix}、相対的にリスクは低めです。`;
    if (score >= 75) return `${prefix}、比較的リスクは低めです。`;
    if (score >= 60) return `${prefix}、一部の災害リスクに注意が必要です。`;
    if (score >= 45) return `${prefix}、注意が必要な災害リスクがあります。`;
    if (score >= 30) return `${prefix}、複数の災害リスクがあります。公式マップで地点を確認してください。`;
    return `${prefix}、複数の高い災害リスクがあります。公式マップで地点を確認してください。`;
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

function setSearchBusy(isBusy) {
    const button = document.getElementById('searchBtn');
    const input = document.getElementById('addressInput');
    button.disabled = isBusy;
    input.disabled = isBusy;
    button.textContent = isBusy ? '分析中' : '分析する';
}
