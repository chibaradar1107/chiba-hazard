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
    officialUrl: 'https://www.city.chiba.jp/sogoseisaku/kikikanri/bosai/2019jisinfusuigaihazardmap.html'
  },
  '千葉市花見川区': {
    flood: 3, tsunami: 1, landslide: 1, storm: 2, liquefaction: 3,
    officialUrl: 'https://www.city.chiba.jp/sogoseisaku/kikikanri/bosai/2019jisinfusuigaihazardmap.html'
  },
  '千葉市稲毛区': {
    flood: 2, tsunami: 1, landslide: 1, storm: 1, liquefaction: 3,
    officialUrl: 'https://www.city.chiba.jp/sogoseisaku/kikikanri/bosai/2019jisinfusuigaihazardmap.html'
  },
  '千葉市若葉区': {
    flood: 2, tsunami: 0, landslide: 2, storm: 0, liquefaction: 2,
    officialUrl: 'https://www.city.chiba.jp/sogoseisaku/kikikanri/bosai/2019jisinfusuigaihazardmap.html'
  },
  '千葉市緑区': {
    flood: 2, tsunami: 0, landslide: 2, storm: 0, liquefaction: 2,
    officialUrl: 'https://www.city.chiba.jp/sogoseisaku/kikikanri/bosai/2019jisinfusuigaihazardmap.html'
  },
  '千葉市美浜区': {
    flood: 2, tsunami: 3, landslide: 0, storm: 4, liquefaction: 5,
    officialUrl: 'https://www.city.chiba.jp/sogoseisaku/kikikanri/bosai/2019jisinfusuigaihazardmap.html'
  },

  // ===== 主要市 =====
  '銚子市': {
    flood: 2, tsunami: 4, landslide: 3, storm: 3, liquefaction: 3,
    officialUrl: 'https://www.city.choshi.chiba.jp/kurashi/page040050.html'
  },
  '市川市': {
    flood: 4, tsunami: 2, landslide: 1, storm: 3, liquefaction: 4,
    officialUrl: 'https://www.city.ichikawa.lg.jp/gen06/1511000002.html'
  },
  '船橋市': {
    flood: 3, tsunami: 2, landslide: 1, storm: 3, liquefaction: 4,
    officialUrl: 'https://www.city.funabashi.lg.jp/bousai/map/p009037.html'
  },
  '館山市': {
    flood: 2, tsunami: 4, landslide: 3, storm: 3, liquefaction: 2,
    officialUrl: 'https://www.city.tateyama.chiba.jp/anzen/hazardmap/index.html'
  },
  '木更津市': {
    flood: 3, tsunami: 3, landslide: 2, storm: 3, liquefaction: 4,
    officialUrl: 'https://www.city.kisarazu.lg.jp/kurashi/bosai/hinanjo_bosaimap/bosaimap/9297.html'
  },
  '松戸市': {
    flood: 4, tsunami: 0, landslide: 1, storm: 0, liquefaction: 3,
    officialUrl: 'https://www.city.matsudo.chiba.jp/kurashi/anzen_anshin/sonae/bousai_taisaku/20183.html'
  },
  '野田市': {
    flood: 4, tsunami: 0, landslide: 1, storm: 0, liquefaction: 3,
    officialUrl: 'https://www.city.noda.chiba.jp/kurashi/anzen/bousai/1009077/1009078.html'
  },
  '茂原市': {
    flood: 4, tsunami: 1, landslide: 2, storm: 1, liquefaction: 3,
    officialUrl: 'https://www.city.mobara.chiba.jp/0000005890.html'
  },
  '成田市': {
    flood: 3, tsunami: 0, landslide: 2, storm: 0, liquefaction: 2,
    officialUrl: 'https://www.city.narita.chiba.jp/anshin/page073300.html'
  },
  '佐倉市': {
    flood: 3, tsunami: 0, landslide: 2, storm: 0, liquefaction: 2,
    officialUrl: 'https://www.city.sakura.lg.jp/soshiki/kikikanrika/112/hazardmap/5703.html'
  },
  '東金市': {
    flood: 3, tsunami: 1, landslide: 2, storm: 1, liquefaction: 3,
    officialUrl: 'https://www.city.togane.chiba.jp/0000013179.html'
  },
  '旭市': {
    flood: 3, tsunami: 4, landslide: 2, storm: 3, liquefaction: 3,
    officialUrl: 'https://www.city.asahi.lg.jp/site/hazard-map/#5kouzui'
  },
  '習志野市': {
    flood: 3, tsunami: 2, landslide: 0, storm: 3, liquefaction: 5,
    officialUrl: 'https://www.city.narashino.lg.jp/kurashi/bosaibohan/hazard_map/narashino_city_cc0501.html'
  },
  '柏市': {
    flood: 3, tsunami: 0, landslide: 1, storm: 0, liquefaction: 2,
    officialUrl: 'https://www.city.kashiwa.lg.jp/bosaianzen/anshinanzen/disaster/disaster_ready/bosaimap/hazardmap.html'
  },
  '勝浦市': {
    flood: 2, tsunami: 4, landslide: 3, storm: 2, liquefaction: 2,
    officialUrl: 'https://www.city.katsuura.lg.jp/site/bousai/1592.html'
  },
  '市原市': {
    flood: 3, tsunami: 2, landslide: 2, storm: 2, liquefaction: 3,
    officialUrl: 'https://www.city.ichihara.chiba.jp/article?articleId=62cf5a34958ba07588af5e58'
  },
  '流山市': {
    flood: 4, tsunami: 0, landslide: 1, storm: 0, liquefaction: 3,
    officialUrl: 'https://www.city.nagareyama.chiba.jp/life/1003604/1003691/1003692/1003697.html'
  },
  '八千代市': {
    flood: 3, tsunami: 0, landslide: 1, storm: 0, liquefaction: 2,
    officialUrl: 'https://www.city.yachiyo.lg.jp/soshiki/11/2171.html'
  },
  '我孫子市': {
    flood: 4, tsunami: 0, landslide: 1, storm: 0, liquefaction: 3,
    officialUrl: 'https://www.city.abiko.chiba.jp/anshin/bousai/bousai_info/abikohazard_map.html'
  },
  '鴨川市': {
    flood: 2, tsunami: 4, landslide: 3, storm: 2, liquefaction: 2,
    officialUrl: 'https://www.city.kamogawa.lg.jp/site/bousai/265.html'
  },
  '鎌ケ谷市': {
    flood: 2, tsunami: 0, landslide: 1, storm: 0, liquefaction: 2,
    officialUrl: 'https://www.city.kamagaya.chiba.jp/anzen_anshin/bousai/haza-domappukankei/guidmap.html'
  },
  '君津市': {
    flood: 3, tsunami: 2, landslide: 3, storm: 2, liquefaction: 2,
    officialUrl: 'https://www.city.kimitsu.lg.jp/soshiki/29/41675.html'
  },
  '富津市': {
    flood: 2, tsunami: 3, landslide: 3, storm: 3, liquefaction: 3,
    officialUrl: 'https://www.city.futtsu.lg.jp/0000006977.html'
  },
  '浦安市': {
    flood: 2, tsunami: 2, landslide: 0, storm: 3, liquefaction: 5,
    officialUrl: 'https://www.city.urayasu.lg.jp/todokede/anzen/bousai/1030669/1002110.html'
  },
  '四街道市': {
    flood: 2, tsunami: 0, landslide: 1, storm: 0, liquefaction: 2,
    officialUrl: 'https://www.city.yotsukaido.chiba.jp/kurashi/bohan/bosai/hazardmap/hzmap.html'
  },
  '袖ケ浦市': {
    flood: 2, tsunami: 2, landslide: 2, storm: 2, liquefaction: 3,
    officialUrl: 'https://www.city.sodegaura.lg.jp/soshiki/bousai/hazardmap.html'
  },
  '八街市': {
    flood: 2, tsunami: 0, landslide: 1, storm: 0, liquefaction: 2,
    officialUrl: 'https://www.city.yachimata.lg.jp/soshiki/8/24210.html'
  },
  '印西市': {
    flood: 3, tsunami: 0, landslide: 1, storm: 0, liquefaction: 2,
    officialUrl: 'https://www.city.inzai.lg.jp/bousaiportal/0000008837.html'
  },
  '白井市': {
    flood: 2, tsunami: 0, landslide: 1, storm: 0, liquefaction: 2,
    officialUrl: 'https://www.city.shiroi.chiba.jp/kurashi/bosai/b05/1421600157233.html'
  },
  '富里市': {
    flood: 2, tsunami: 0, landslide: 1, storm: 0, liquefaction: 2,
    officialUrl: 'https://www.city.tomisato.lg.jp/0000007583.html'
  },
  '南房総市': {
    flood: 2, tsunami: 4, landslide: 3, storm: 3, liquefaction: 2,
    officialUrl: 'https://www.city.minamiboso.chiba.jp/hazardmap/index.html'
  },
  '匝瑳市': {
    flood: 3, tsunami: 3, landslide: 2, storm: 2, liquefaction: 3,
    officialUrl: 'https://www.city.sosa.lg.jp/page/page000410.html'
  },
  '香取市': {
    flood: 4, tsunami: 1, landslide: 2, storm: 1, liquefaction: 4,
    officialUrl: 'https://www.city.katori.lg.jp/living/anzen_anshin/sonaete/hazard-map.html'
  },
  '山武市': {
    flood: 3, tsunami: 3, landslide: 2, storm: 2, liquefaction: 3,
    officialUrl: 'https://www.city.sammu.lg.jp/bousai-syobo/bousai/page006801.html'
  },
  'いすみ市': {
    flood: 3, tsunami: 3, landslide: 2, storm: 2, liquefaction: 2,
    officialUrl: 'https://www.city.isumi.lg.jp/gyosei/in_case/3682.html'
  },
  '大網白里市': {
    flood: 3, tsunami: 3, landslide: 1, storm: 2, liquefaction: 3,
    officialUrl: 'https://www.city.oamishirasato.lg.jp/0000011942.html'
  },

  // ===== 郡部（町村） =====
  '酒々井町': {
    flood: 2, tsunami: 0, landslide: 1, storm: 0, liquefaction: 2,
    officialUrl: 'https://www.town.shisui.chiba.jp/docs/2014021806778/'
  },
  '栄町': {
    flood: 4, tsunami: 0, landslide: 1, storm: 0, liquefaction: 3,
    officialUrl: 'https://www.town.sakae.chiba.jp/bousai-saigai/page007986.html'
  },
  '神崎町': {
    flood: 3, tsunami: 0, landslide: 1, storm: 0, liquefaction: 3,
    officialUrl: 'https://www.town.kozaki.chiba.jp/kurashi/living_bosai/bosai/map.html'
  },
  '多古町': {
    flood: 3, tsunami: 0, landslide: 2, storm: 0, liquefaction: 2,
    officialUrl: 'https://www.town.tako.chiba.jp/docs/2017121503004/'
  },
  '東庄町': {
    flood: 3, tsunami: 2, landslide: 2, storm: 2, liquefaction: 3,
    officialUrl: 'https://www.town.tohnosho.chiba.jp/kurashi_tetsuzuki/anzen_anshin/bosai/1/1966.html'
  },
  '九十九里町': {
    flood: 3, tsunami: 4, landslide: 0, storm: 3, liquefaction: 4,
    officialUrl: 'https://www.hazard-map-kujukuri.jp/'
  },
  '芝山町': {
    flood: 2, tsunami: 0, landslide: 1, storm: 0, liquefaction: 2,
    officialUrl: 'https://www.town.shibayama.lg.jp/0000001251.html'
  },
  '横芝光町': {
    flood: 3, tsunami: 3, landslide: 1, storm: 2, liquefaction: 3,
    officialUrl: 'https://www.town.yokoshibahikari.chiba.jp/soshiki/5/1040.html'
  },
  '一宮町': {
    flood: 2, tsunami: 3, landslide: 1, storm: 2, liquefaction: 2,
    officialUrl: 'https://www.town.ichinomiya.chiba.jp/kinkyu/bohanbosai/508.html'
  },
  '睦沢町': {
    flood: 2, tsunami: 1, landslide: 2, storm: 1, liquefaction: 2,
    officialUrl: 'https://www.town.mutsuzawa.chiba.jp/kurashi/bousai/bousai.html'
  },
  '長生村': {
    flood: 2, tsunami: 3, landslide: 1, storm: 2, liquefaction: 3,
    officialUrl: 'https://www.vill.chosei.chiba.jp/0000000359.html'
  },
  '白子町': {
    flood: 2, tsunami: 3, landslide: 0, storm: 2, liquefaction: 3,
    officialUrl: 'https://www.town.shirako.lg.jp/0000004607.html'
  },
  '長柄町': {
    flood: 2, tsunami: 0, landslide: 2, storm: 0, liquefaction: 2,
    officialUrl: 'https://www.town.nagara.chiba.jp/soshiki/1/5890.html'
  },
  '長南町': {
    flood: 2, tsunami: 0, landslide: 2, storm: 0, liquefaction: 2,
    officialUrl: 'https://www.town.chonan.chiba.jp/kurashi/kinkyuu/145/'
  },
  '大多喜町': {
    flood: 2, tsunami: 0, landslide: 3, storm: 0, liquefaction: 1,
    officialUrl: 'https://www.town.otaki.chiba.jp/kurashi/anshin/1/990.html'
  },
  '御宿町': {
    flood: 2, tsunami: 4, landslide: 2, storm: 2, liquefaction: 2,
    officialUrl: 'https://www.town.onjuku.chiba.jp/soumuka/newbousai/index.html'
  },
  '鋸南町': {
    flood: 2, tsunami: 4, landslide: 3, storm: 3, liquefaction: 2,
    officialUrl: 'https://www.town.kyonan.chiba.jp/site/bousai/7525.html'
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
