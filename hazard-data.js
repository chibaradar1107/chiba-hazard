/**
 * 千葉県 市町村別ハザードリスクデータ
 *
 * 各市町村の公式ハザードマップ・千葉県防災ポータル等を参考に
 * 5項目を 0〜5 段階で評価（5 = リスク最大）
 *
 * 項目:
 *   flood     : 洪水（河川氾濫・内水氾濫）
 *   tsunami   : 津波
 *   landslide : 土砂災害（がけ崩れ・土石流・地すべり）
 *   storm     : 高潮
 *   liquefaction : 液状化
 *
 * 出典:
 *   - 国土交通省 ハザードマップポータルサイト
 *   - 千葉県 防災ポータルサイト
 *   - 各市町村 公式ハザードマップ
 */

const CHIBA_HAZARD_DATA = {
  // ===== 千葉市 =====
  '千葉市中央区': {
    flood: 3, tsunami: 2, landslide: 1, storm: 3, liquefaction: 4,
    officialUrl: 'https://www.city.chiba.jp/somu/kikikanri/hazardmap.html'
  },
  '千葉市花見川区': {
    flood: 3, tsunami: 1, landslide: 1, storm: 2, liquefaction: 3,
    officialUrl: 'https://www.city.chiba.jp/somu/kikikanri/hazardmap.html'
  },
  '千葉市稲毛区': {
    flood: 2, tsunami: 1, landslide: 1, storm: 1, liquefaction: 3,
    officialUrl: 'https://www.city.chiba.jp/somu/kikikanri/hazardmap.html'
  },
  '千葉市若葉区': {
    flood: 2, tsunami: 0, landslide: 2, storm: 0, liquefaction: 2,
    officialUrl: 'https://www.city.chiba.jp/somu/kikikanri/hazardmap.html'
  },
  '千葉市緑区': {
    flood: 2, tsunami: 0, landslide: 2, storm: 0, liquefaction: 2,
    officialUrl: 'https://www.city.chiba.jp/somu/kikikanri/hazardmap.html'
  },
  '千葉市美浜区': {
    flood: 2, tsunami: 3, landslide: 0, storm: 4, liquefaction: 5,
    officialUrl: 'https://www.city.chiba.jp/somu/kikikanri/hazardmap.html'
  },

  // ===== 主要市 =====
  '銚子市': {
    flood: 2, tsunami: 4, landslide: 3, storm: 3, liquefaction: 3,
    officialUrl: 'https://www.city.choshi.chiba.jp/simin/bousai/hazardmap.html'
  },
  '市川市': {
    flood: 4, tsunami: 2, landslide: 1, storm: 3, liquefaction: 4,
    officialUrl: 'https://www.city.ichikawa.lg.jp/catpage/cat_00000023.html'
  },
  '船橋市': {
    flood: 3, tsunami: 2, landslide: 1, storm: 3, liquefaction: 4,
    officialUrl: 'https://www.city.funabashi.lg.jp/bousai/hazardmap/index.html'
  },
  '館山市': {
    flood: 2, tsunami: 4, landslide: 3, storm: 3, liquefaction: 2,
    officialUrl: 'https://www.city.tateyama.chiba.jp/bousai/page100034.html'
  },
  '木更津市': {
    flood: 3, tsunami: 3, landslide: 2, storm: 3, liquefaction: 4,
    officialUrl: 'https://www.city.kisarazu.lg.jp/kurashi/bosai/bosai/index.html'
  },
  '松戸市': {
    flood: 4, tsunami: 0, landslide: 1, storm: 0, liquefaction: 3,
    officialUrl: 'https://www.city.matsudo.chiba.jp/kurashi/anzen_anshin/bousaitaisaku/hazardmap.html'
  },
  '野田市': {
    flood: 4, tsunami: 0, landslide: 1, storm: 0, liquefaction: 3,
    officialUrl: 'https://www.city.noda.chiba.jp/kurashi/bousai/bousai/index.html'
  },
  '茂原市': {
    flood: 4, tsunami: 1, landslide: 2, storm: 1, liquefaction: 3,
    officialUrl: 'https://www.city.mobara.chiba.jp/category/8-1-0-0.html'
  },
  '成田市': {
    flood: 3, tsunami: 0, landslide: 2, storm: 0, liquefaction: 2,
    officialUrl: 'https://www.city.narita.chiba.jp/safety/page0140_00001.html'
  },
  '佐倉市': {
    flood: 3, tsunami: 0, landslide: 2, storm: 0, liquefaction: 2,
    officialUrl: 'https://www.city.sakura.lg.jp/soshiki/kikikanri/bosai/hazardmap.html'
  },
  '東金市': {
    flood: 3, tsunami: 1, landslide: 2, storm: 1, liquefaction: 3,
    officialUrl: 'https://www.city.togane.chiba.jp/category/6-1-0-0.html'
  },
  '旭市': {
    flood: 3, tsunami: 4, landslide: 2, storm: 3, liquefaction: 3,
    officialUrl: 'https://www.city.asahi.lg.jp/soshiki/3/bosai.html'
  },
  '習志野市': {
    flood: 3, tsunami: 2, landslide: 0, storm: 3, liquefaction: 5,
    officialUrl: 'https://www.city.narashino.lg.jp/bosai/bosai/hazardmap/index.html'
  },
  '柏市': {
    flood: 3, tsunami: 0, landslide: 1, storm: 0, liquefaction: 2,
    officialUrl: 'https://www.city.kashiwa.lg.jp/bosai/bosai/hazardmap/index.html'
  },
  '勝浦市': {
    flood: 2, tsunami: 4, landslide: 3, storm: 2, liquefaction: 2,
    officialUrl: 'https://www.city.katsuura.lg.jp/category/9-1-0-0.html'
  },
  '市原市': {
    flood: 3, tsunami: 2, landslide: 2, storm: 2, liquefaction: 3,
    officialUrl: 'https://www.city.ichihara.chiba.jp/kurashi/bousai/bousai/hazardmap.html'
  },
  '流山市': {
    flood: 4, tsunami: 0, landslide: 1, storm: 0, liquefaction: 3,
    officialUrl: 'https://www.city.nagareyama.chiba.jp/life/1001515/index.html'
  },
  '八千代市': {
    flood: 3, tsunami: 0, landslide: 1, storm: 0, liquefaction: 2,
    officialUrl: 'https://www.city.yachiyo.lg.jp/soshiki/10/bosai-hazardmap.html'
  },
  '我孫子市': {
    flood: 4, tsunami: 0, landslide: 1, storm: 0, liquefaction: 3,
    officialUrl: 'https://www.city.abiko.chiba.jp/anshin/bousai/hazard/index.html'
  },
  '鴨川市': {
    flood: 2, tsunami: 4, landslide: 3, storm: 2, liquefaction: 2,
    officialUrl: 'https://www.city.kamogawa.lg.jp/category/7-1-0-0.html'
  },
  '鎌ケ谷市': {
    flood: 2, tsunami: 0, landslide: 1, storm: 0, liquefaction: 2,
    officialUrl: 'https://www.city.kamagaya.chiba.jp/kurashi/anzen/bousai/hazardmap/index.html'
  },
  '君津市': {
    flood: 3, tsunami: 2, landslide: 3, storm: 2, liquefaction: 2,
    officialUrl: 'https://www.city.kimitsu.lg.jp/soshiki/5/bousai-hazardmap.html'
  },
  '富津市': {
    flood: 2, tsunami: 3, landslide: 3, storm: 3, liquefaction: 3,
    officialUrl: 'https://www.city.futtsu.lg.jp/category/7-0-0-0.html'
  },
  '浦安市': {
    flood: 2, tsunami: 2, landslide: 0, storm: 3, liquefaction: 5,
    officialUrl: 'https://www.city.urayasu.lg.jp/todokede/anzen/bousai/hazardmap/index.html'
  },
  '四街道市': {
    flood: 2, tsunami: 0, landslide: 1, storm: 0, liquefaction: 2,
    officialUrl: 'https://www.city.yotsukaido.chiba.jp/kurashi/bousai/hazardmap.html'
  },
  '袖ケ浦市': {
    flood: 2, tsunami: 2, landslide: 2, storm: 2, liquefaction: 3,
    officialUrl: 'https://www.city.sodegaura.lg.jp/soshiki/bousai/bousai/hazardmap.html'
  },
  '八街市': {
    flood: 2, tsunami: 0, landslide: 1, storm: 0, liquefaction: 2,
    officialUrl: 'https://www.city.yachimata.lg.jp/category/7-1-0-0.html'
  },
  '印西市': {
    flood: 3, tsunami: 0, landslide: 1, storm: 0, liquefaction: 2,
    officialUrl: 'https://www.city.inzai.lg.jp/category/1-3-0-0.html'
  },
  '白井市': {
    flood: 2, tsunami: 0, landslide: 1, storm: 0, liquefaction: 2,
    officialUrl: 'https://www.city.shiroi.chiba.jp/kurashi/bousai/hazardmap/index.html'
  },
  '富里市': {
    flood: 2, tsunami: 0, landslide: 1, storm: 0, liquefaction: 2,
    officialUrl: 'https://www.city.tomisato.lg.jp/category/7-1-0-0.html'
  },
  '南房総市': {
    flood: 2, tsunami: 4, landslide: 3, storm: 3, liquefaction: 2,
    officialUrl: 'https://www.city.minamiboso.chiba.jp/category/7-1-0-0.html'
  },
  '匝瑳市': {
    flood: 3, tsunami: 3, landslide: 2, storm: 2, liquefaction: 3,
    officialUrl: 'https://www.city.sosa.lg.jp/category/2-1-0-0.html'
  },
  '香取市': {
    flood: 4, tsunami: 1, landslide: 2, storm: 1, liquefaction: 4,
    officialUrl: 'https://www.city.katori.lg.jp/kurashi/bosai/bosai/hazardmap.html'
  },
  '山武市': {
    flood: 3, tsunami: 3, landslide: 2, storm: 2, liquefaction: 3,
    officialUrl: 'https://www.city.sammu.lg.jp/soshiki/8/bousai-hazardmap.html'
  },
  'いすみ市': {
    flood: 3, tsunami: 3, landslide: 2, storm: 2, liquefaction: 2,
    officialUrl: 'https://www.city.isumi.lg.jp/category/6-1-0-0.html'
  },
  '大網白里市': {
    flood: 3, tsunami: 3, landslide: 1, storm: 2, liquefaction: 3,
    officialUrl: 'https://www.city.oamishirasato.lg.jp/category/6-1-0-0.html'
  },

  // ===== 郡部（町村） =====
  '酒々井町': {
    flood: 2, tsunami: 0, landslide: 1, storm: 0, liquefaction: 2,
    officialUrl: 'https://www.town.shisui.chiba.jp/category/6-1-0-0.html'
  },
  '栄町': {
    flood: 4, tsunami: 0, landslide: 1, storm: 0, liquefaction: 3,
    officialUrl: 'https://www.town.sakae.chiba.jp/category/6-1-0-0.html'
  },
  '神崎町': {
    flood: 3, tsunami: 0, landslide: 1, storm: 0, liquefaction: 3,
    officialUrl: 'https://www.town.kozaki.chiba.jp/'
  },
  '多古町': {
    flood: 3, tsunami: 0, landslide: 2, storm: 0, liquefaction: 2,
    officialUrl: 'https://www.town.tako.chiba.jp/'
  },
  '東庄町': {
    flood: 3, tsunami: 2, landslide: 2, storm: 2, liquefaction: 3,
    officialUrl: 'https://www.town.tohnosho.chiba.jp/'
  },
  '九十九里町': {
    flood: 3, tsunami: 4, landslide: 0, storm: 3, liquefaction: 4,
    officialUrl: 'https://www.town.kujukuri.chiba.jp/'
  },
  '芝山町': {
    flood: 2, tsunami: 0, landslide: 1, storm: 0, liquefaction: 2,
    officialUrl: 'https://www.town.shibayama.lg.jp/'
  },
  '横芝光町': {
    flood: 3, tsunami: 3, landslide: 1, storm: 2, liquefaction: 3,
    officialUrl: 'https://www.town.yokoshibahikari.chiba.jp/'
  },
  '一宮町': {
    flood: 2, tsunami: 3, landslide: 1, storm: 2, liquefaction: 2,
    officialUrl: 'https://www.town.ichinomiya.chiba.jp/'
  },
  '睦沢町': {
    flood: 2, tsunami: 1, landslide: 2, storm: 1, liquefaction: 2,
    officialUrl: 'https://www.town.mutsuzawa.chiba.jp/'
  },
  '長生村': {
    flood: 2, tsunami: 3, landslide: 1, storm: 2, liquefaction: 3,
    officialUrl: 'https://www.vill.chosei.chiba.jp/'
  },
  '白子町': {
    flood: 2, tsunami: 3, landslide: 0, storm: 2, liquefaction: 3,
    officialUrl: 'https://www.town.shirako.lg.jp/'
  },
  '長柄町': {
    flood: 2, tsunami: 0, landslide: 2, storm: 0, liquefaction: 2,
    officialUrl: 'https://www.town.nagara.chiba.jp/'
  },
  '長南町': {
    flood: 2, tsunami: 0, landslide: 2, storm: 0, liquefaction: 2,
    officialUrl: 'https://www.town.chonan.chiba.jp/'
  },
  '大多喜町': {
    flood: 2, tsunami: 0, landslide: 3, storm: 0, liquefaction: 1,
    officialUrl: 'https://www.town.otaki.chiba.jp/'
  },
  '御宿町': {
    flood: 2, tsunami: 4, landslide: 2, storm: 2, liquefaction: 2,
    officialUrl: 'https://www.town.onjuku.chiba.jp/'
  },
  '鋸南町': {
    flood: 2, tsunami: 4, landslide: 3, storm: 3, liquefaction: 2,
    officialUrl: 'https://www.town.kyonan.chiba.jp/'
  },
};

/**
 * 住所文字列から市区町村名を抽出
 */
function extractMunicipality(address) {
  // 千葉市の区を先にチェック
  const chibaKuMatch = address.match(/千葉市(中央区|花見川区|稲毛区|若葉区|緑区|美浜区)/);
  if (chibaKuMatch) return '千葉市' + chibaKuMatch[1];

  // 市を検索
  const cityMatch = address.match(/(銚子|市川|船橋|館山|木更津|松戸|野田|茂原|成田|佐倉|東金|旭|習志野|柏|勝浦|市原|流山|八千代|我孫子|鴨川|鎌ケ谷|君津|富津|浦安|四街道|袖ケ浦|八街|印西|白井|富里|南房総|匝瑳|香取|山武|いすみ|大網白里)市/);
  if (cityMatch) return cityMatch[0];

  // 町村を検索
  const townMatch = address.match(/(酒々井|栄|神崎|多古|東庄|九十九里|芝山|横芝光|一宮|睦沢|白子|長柄|長南|大多喜|御宿|鋸南)町/);
  if (townMatch) return townMatch[0];

  const villageMatch = address.match(/長生村/);
  if (villageMatch) return villageMatch[0];

  return null;
}

/**
 * リスクレベルを基にスコアを算出（100点満点: 高いほど安全）
 */
function calculateSafetyScore(hazardInfo) {
  if (!hazardInfo) return null;

  const weights = {
    flood: 25,        // 洪水: 最大25点
    tsunami: 20,      // 津波: 最大20点
    landslide: 15,    // 土砂災害: 最大15点
    storm: 15,        // 高潮: 最大15点
    liquefaction: 25  // 液状化: 最大25点
  };

  let totalScore = 0;
  const breakdown = {};

  for (const [key, maxPoints] of Object.entries(weights)) {
    const riskLevel = hazardInfo[key] || 0;
    // 0〜5のリスクを点数に変換（リスク0 = 満点, リスク5 = 0点）
    const score = Math.round(maxPoints * (1 - riskLevel / 5));
    breakdown[key] = { riskLevel, score, maxPoints };
    totalScore += score;
  }

  return { totalScore, breakdown };
}

/**
 * リスクレベルに対応するラベルを返す
 */
function getRiskLabel(level) {
  const labels = ['リスクなし', '低い', 'やや低い', '中程度', 'やや高い', '高い'];
  return labels[Math.min(level, 5)] || '不明';
}

/**
 * 総合スコアに対する評価ラベルを返す
 */
function getScoreGrade(score) {
  if (score >= 90) return { grade: '非常に安全', color: '#00e676', emoji: '🟢' };
  if (score >= 75) return { grade: '安全', color: '#69f0ae', emoji: '🟢' };
  if (score >= 60) return { grade: 'おおむね安全', color: '#ffeb3b', emoji: '🟡' };
  if (score >= 45) return { grade: '注意が必要', color: '#ffa726', emoji: '🟠' };
  if (score >= 30) return { grade: 'リスクあり', color: '#ff5722', emoji: '🔴' };
  return { grade: '高リスク', color: '#d50000', emoji: '🔴' };
}
