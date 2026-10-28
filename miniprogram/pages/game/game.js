const SAVE_KEY = "galaxyMarbleMp.save.v1";
const BET = 5;
const COIN_VALUE = 20;
const START_COINS = 20;
const EYE_COUNT = 12;
const VW = 600;
const VH = 720;

const RARITIES = {
  N: { label: "N", weight: 46, refund: 6 },
  R: { label: "R", weight: 30, refund: 12 },
  SR: { label: "SR", weight: 16, refund: 24 },
  SSR: { label: "SSR", weight: 8, refund: 48 }
};

const CARDS = [
  { id: "firefly", no: "001", name: "流萤", en: "FIREFLY", glyph: "萤", rarity: "N", c1: "#8af7d4", c2: "#073e49", line: "从指缝里漏下的一点光，偏偏不肯熄灭。" },
  { id: "pebble", no: "002", name: "石语", en: "PEBBLE", glyph: "石", rarity: "N", c1: "#c2d3ff", c2: "#222f55", line: "它说自己见过银河，只是懒得起身。" },
  { id: "paper-boat", no: "003", name: "纸舟", en: "PAPER SKIFF", glyph: "舟", rarity: "N", c1: "#ffd5a1", c2: "#462912", line: "折了七次，刚好能驶过一小片月光。" },
  { id: "wave-cat", no: "004", name: "波猫", en: "WAVE CAT", glyph: "猫", rarity: "N", c1: "#8fd9ff", c2: "#103150", line: "耳朵一动，远处的信号就变成了呼噜声。" },
  { id: "orbit-hare", no: "005", name: "星轨兔", en: "ORBIT HARE", glyph: "兔", rarity: "R", c1: "#baffd6", c2: "#104a3b", line: "它把每一次弹跳，都记成一颗星。" },
  { id: "neon-jelly", no: "006", name: "霓虹水母", en: "NEON JELLY", glyph: "水", rarity: "R", c1: "#ff9ee9", c2: "#431852", line: "在深海里发光，是它唯一会的语言。" },
  { id: "lunar-rover", no: "007", name: "月面车", en: "LUNAR ROVER", glyph: "车", rarity: "R", c1: "#e6e8ff", c2: "#292c50", line: "跑了九万公里，只为捡一枚安静的石头。" },
  { id: "pulse-fox", no: "008", name: "脉冲狐", en: "PULSE FOX", glyph: "狐", rarity: "R", c1: "#ffb17a", c2: "#521e0d", line: "尾巴扫过的地方，旧电台会突然有了信号。" },
  { id: "comet-knight", no: "009", name: "彗星骑士", en: "COMET KNIGHT", glyph: "骑", rarity: "SR", c1: "#7af0ff", c2: "#11316a", line: "披风是尾焰做的。冲锋之前，他会先把星星擦亮。" },
  { id: "mecha-whale", no: "010", name: "机械鲸", en: "MECHA WHALE", glyph: "鲸", rarity: "SR", c1: "#75c9ff", c2: "#0a2b52", line: "每隔百年浮上海面，换一次星空的电池。" },
  { id: "gravity-mage", no: "011", name: "引力法师", en: "GRAVITY MAGE", glyph: "引", rarity: "SR", c1: "#c39bff", c2: "#2b1357", line: "她从不掷硬币，只让硬币自己决定落下。" },
  { id: "aurora-dragon", no: "012", name: "极光龙", en: "AURORA DRAGON", glyph: "龙", rarity: "SR", c1: "#71ffc9", c2: "#0a3d40", line: "鳞片翻动时，北方的夜会被重新上色。" },
  { id: "galaxy-crown", no: "013", name: "银河王冠", en: "GALAXY CROWN", glyph: "冠", rarity: "SSR", c1: "#ffe79a", c2: "#57330b", line: "没有国王。它只负责在最高处，替所有弹珠发光。" },
  { id: "singularity-diva", no: "014", name: "黑洞歌姬", en: "SINGULARITY DIVA", glyph: "姬", rarity: "SSR", c1: "#d4a4ff", c2: "#1a083c", line: "她的高音能弯曲光线，返场曲目叫《事件视界》。" },
  { id: "nebula-titan", no: "015", name: "星云巨兽", en: "NEBULA TITAN", glyph: "兽", rarity: "SSR", c1: "#ff9a7c", c2: "#4b0f26", line: "它打一个喷嚏，人间就会多一场流星雨。" },
  { id: "eternal-marble", no: "016", name: "永恒弹珠", en: "ETERNAL MARBLE", glyph: "珠", rarity: "SSR", c1: "#a8fbff", c2: "#092f50", line: "传说它从未停下。你听见的每一声落袋，都是它经过。" }
];
const CARD_BY_ID = {};
CARDS.forEach((card) => { CARD_BY_ID[card.id] = card; });

const MULT_TABLE = [
  { value: 2, weight: 30, lit: 6, color: "#52f4c6", key: "mint" },
  { value: 4, weight: 27, lit: 4, color: "#59dfff", key: "cyan" },
  { value: 6, weight: 20, lit: 3, color: "#a98bff", key: "violet" },
  { value: 8, weight: 13, lit: 2, color: "#ff78cc", key: "pink" },
  { value: 10, weight: 8, lit: 1, color: "#ff9d54", key: "orange" },
  { value: 20, weight: 2, lit: 1, color: "#ffe27a", key: "gold" }
];
const MULT_BY_VALUE = {};
MULT_TABLE.forEach((m) => { MULT_BY_VALUE[m.value] = m; });

const BOARD = { left: 54, right: 546 };
const SLOT = {
  left: 58,
  right: 542,
  top: 614,
  bottom: 698,
  count: EYE_COUNT,
  width: (542 - 58) / EYE_COUNT
};

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = out[i];
    out[i] = out[j];
    out[j] = t;
  }
  return out;
};
const fixed = (n, digits = 3) => Number(n).toFixed(digits);

function hexA(hex, alpha) {
  if (typeof hex !== "string" || hex.charAt(0) !== "#") return "rgba(88,233,255," + alpha + ")";
  let h = hex.slice(1);
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const num = parseInt(h, 16);
  if (!num) return "rgba(88,233,255," + alpha + ")";
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
}

function weightedPick(table) {
  const total = table.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < table.length; i++) {
    roll -= table[i].weight;
    if (roll <= 0) return table[i];
  }
  return table[table.length - 1];
}

function chooseLit(count) {
  return shuffle(Array.from({ length: EYE_COUNT }, (_, i) => i)).slice(0, count).sort((a, b) => a - b);
}

function defaultState() {
  return {
    coins: START_COINS,
    marbles: 0,
    cards: {},
    newCards: [],
    cardEnergy: 0,
    stats: { shots: 0, hits: 0, best: 0, pulls: 0, jackpots: 0 },
    streak: 0
  };
}

function sanitizeState(raw) {
  const base = defaultState();
  if (!raw || typeof raw !== "object") return base;
  const num = (v, fallback, min, max) => {
    const n = Number(v);
    return Number.isFinite(n) ? clamp(Math.floor(n), min, max) : fallback;
  };
  base.coins = num(raw.coins, START_COINS, 0, 999999);
  base.marbles = num(raw.marbles, 0, 0, 9999999);
  base.cardEnergy = num(raw.cardEnergy, 0, 0, 100);
  if (raw.cards && typeof raw.cards === "object") {
    Object.keys(raw.cards).forEach((id) => {
      if (CARD_BY_ID[id]) base.cards[id] = num(raw.cards[id], 1, 1, 999);
    });
  }
  if (raw.stats && typeof raw.stats === "object") {
    base.stats.shots = num(raw.stats.shots, 0, 0, 9999999);
    base.stats.hits = num(raw.stats.hits, 0, 0, 9999999);
    base.stats.best = num(raw.stats.best, 0, 0, 20);
    base.stats.pulls = num(raw.stats.pulls, 0, 0, 9999999);
    base.stats.jackpots = num(raw.stats.jackpots, 0, 0, 9999999);
  }
  base.streak = 0;
  return base;
}

let state = defaultState();
try {
  const saved = wx.getStorageSync(SAVE_KEY);
  if (saved) state = sanitizeState(saved);
} catch (e) {}

function saveState() {
  try { wx.setStorageSync(SAVE_KEY, state); } catch (e) {}
}

function ownedCardCount() {
  let n = 0;
  Object.keys(state.cards).forEach((id) => { if (CARD_BY_ID[id]) n += 1; });
  return n;
}

function cardCount() {
  let n = 0;
  Object.keys(state.cards).forEach((id) => { n += state.cards[id] || 0; });
  return n;
}

function getWindowInfo() {
  try {
    if (wx.getWindowInfo) return wx.getWindowInfo();
  } catch (e) {}
  return wx.getSystemInfoSync();
}

function vibrate(type) {
  try {
    if (wx.vibrateShort) wx.vibrateShort({ type: type || "light" });
  } catch (e) {}
}

/* ---------------- board geometry ---------------- */
function catmullRom(points, samples) {
  const out = [];
  const p = [points[0]].concat(points, [points[points.length - 1]]);
  for (let i = 0; i < p.length - 3; i++) {
    const p0 = p[i];
    const p1 = p[i + 1];
    const p2 = p[i + 2];
    const p3 = p[i + 3];
    for (let s = 0; s < samples; s++) {
      const t = s / samples;
      const t2 = t * t;
      const t3 = t2 * t;
      out.push({
        x: 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
        y: 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3)
      });
    }
  }
  out.push({ x: points[points.length - 1].x, y: points[points.length - 1].y });
  return out;
}

const railControl = [
  { x: 528, y: 596 },
  { x: 534, y: 522 },
  { x: 536, y: 310 },
  { x: 534, y: 168 },
  { x: 526, y: 143 },
  { x: 504, y: 132 },
  { x: 472, y: 130 },
  { x: 100, y: 130 }
];
const railSamples = catmullRom(railControl, 14);
const railDistances = [0];
for (let i = 1; i < railSamples.length; i++) {
  railDistances.push(railDistances[i - 1] + Math.hypot(railSamples[i].x - railSamples[i - 1].x, railSamples[i].y - railSamples[i - 1].y));
}

function railIndexForX(x) {
  let best = railSamples.length - 1;
  let delta = Infinity;
  for (let i = 0; i < railSamples.length; i++) {
    const p = railSamples[i];
    if (p.y < 150 && p.x <= 510) {
      const d = Math.abs(p.x - x);
      if (d < delta) { delta = d; best = i; }
    }
  }
  return best;
}

const PEGS = [];
const BUMPERS = [
  { x: 300, y: 332, r: 17.5, hue: "#6cf6ff", pulse: 0 },
  { x: 176, y: 412, r: 14, hue: "#ff6fbd", pulse: 0 },
  { x: 424, y: 412, r: 14, hue: "#ff6fbd", pulse: 0 },
  { x: 300, y: 518, r: 15.5, hue: "#b68cff", pulse: 0 }
];

(function buildPegs() {
  for (let row = 0; row < 8; row++) {
    const odd = row % 2 === 1;
    const count = odd ? 8 : 7;
    const start = odd ? 88 : 120;
    const step = odd ? 60.4 : 63.5;
    for (let i = 0; i < count; i++) {
      const x = start + i * step;
      const y = 244 + row * 39.5;
      let blocked = false;
      for (let b = 0; b < BUMPERS.length; b++) {
        if (Math.hypot(x - BUMPERS[b].x, y - BUMPERS[b].y) < BUMPERS[b].r + 13) { blocked = true; break; }
      }
      if (!blocked) {
        PEGS.push({ x: x, y: y, r: rand(5.1, 6.2), kind: (row + i) % 7 === 0 ? "star" : "peg", pulse: 0 });
      }
    }
  }
  for (let i = 1; i < EYE_COUNT; i++) {
    PEGS.push({ x: SLOT.left + i * SLOT.width, y: 596, r: 3.6, kind: "divider", pulse: 0 });
  }
})();

const STARS = Array.from({ length: 62 }, () => ({
  x: rand(66, 534), y: rand(82, 600), r: rand(0.35, 1.35),
  a: rand(0.14, 0.6), phase: rand(0, Math.PI * 2), speed: rand(0.45, 1.45)
}));
const ORBITS = [
  { x: 300, y: 356, r: 154, rot: -0.22, alpha: 0.13 },
  { x: 300, y: 356, r: 226, rot: 0.18, alpha: 0.09 },
  { x: 300, y: 356, r: 298, rot: -0.08, alpha: 0.06 }
];

function slotCenter(index) { return SLOT.left + (index + 0.5) * SLOT.width; }
function zoneFromPower(power) {
  if (power < 1 / 3) return { key: "right", label: "右路", start: 8, index: 0 };
  if (power < 2 / 3) return { key: "mid", label: "中路", start: 4, index: 1 };
  return { key: "left", label: "左路", start: 0, index: 2 };
}

/* ---------------- canvas runtime ---------------- */
let canvas = null;
let ctx = null;
let pageRef = null;
let scaleX = 1;
let scaleY = 1;
let rafId = null;
let lastFrame = 0;

const game = {
  phase: "boot",
  round: null,
  spin: null,
  ball: null,
  particles: [],
  rings: [],
  shake: 0,
  punch: 0,
  flashSlot: -1,
  flashLife: 0,
  charge: null,
  mood: "#58e9ff",
  overlayOpen: false,
  nextTimer: null,
  cardTimer: null,
  splashTimer: null,
  toastTimer: null,
  spinTimer: null,
  springTimer: null,
  roundId: 0,
  lastPowerSync: 0,
  splashUntil: 0,
  resultUntil: 0,
  resultInfo: null
};

function currentMultiplier() {
  if (game.spin) return game.spin.displayMult;
  return game.round ? game.round.multiplier : 0;
}
function currentLit() {
  if (game.spin) return game.spin.displayLit;
  return game.round ? game.round.lit : [];
}

function setMoodDefault(page) {
  page.setMood({ color: "#59dfff", key: "cyan" });
}
function setMoodConfig(page, config) {
  page.setMood({ color: config.color, key: config.key });
}

function cardBackground(card) {
  return "linear-gradient(155deg," + card.c1 + " 0%," + card.c2 + " 55%,#070b18 100%)";
}

function buildAlbumCards() {
  return CARDS.map((card) => ({
    id: card.id,
    no: card.no,
    name: card.name,
    en: card.en,
    glyph: card.glyph,
    rarity: card.rarity,
    c1: card.c1,
    c2: card.c2,
    c3: card.c3,
    line: card.line,
    owned: Boolean(state.cards[card.id]),
    cardBg: cardBackground(card)
  }));
}

function buildTrayMarbles() {
  const n = Math.min(20, state.marbles);
  const arr = [];
  for (let i = 0; i < n; i++) arr.push(i);
  return arr;
}

function buildConfetti(card) {
  const colors = [card.c1, card.c2, "#ffd166", "#ffffff", "#ff6fbd"];
  const arr = [];
  for (let i = 0; i < 18; i++) {
    arr.push({
      left: Math.round(rand(4, 96)),
      color: pick(colors),
      delay: fixed(rand(0, 0.55), 2),
      dur: fixed(rand(1.8, 3.2), 2),
      rotate: Math.round(rand(0, 360))
    });
  }
  return arr;
}

Page({
  data: {
    safeTop: 20,
    safeBottom: 0,
    boardW: 322,
    boardH: 386,
    phase: "boot",
    bootVisible: true,
    bootTitle: "投币开玩",
    bootCopy: "投入 1 枚代币，获得 20 颗弹珠",
    bootBtnText: "投币开始",
    bootBtnMeta: "×1",
    multDisplay: "--",
    multNote: "等待投币",
    jackpot: false,
    litCount: 0,
    splashVisible: false,
    splashMult: "4",
    splashLit: "4",
    hintVisible: false,
    resultVisible: false,
    resultKicker: "",
    resultMain: "",
    resultSub: "",
    resultClass: "",
    launchLabel: "请先投币",
    launchSub: "INSERT COIN",
    launchClass: "locked",
    powerPct: 0,
    cardEnergy: 0,
    springCoilTop: 40,
    springCoilH: 60,
    springKnobTop: 90,
    springClass: "locked",
    coins: START_COINS,
    marbles: 0,
    uniqueCards: 0,
    pulls: 0,
    trayMarbles: [],
    stats: { shots: 0, hits: 0, best: 0, pulls: 0, jackpots: 0 },
    streak: 0,
    moodKey: "cyan",
    moodColor: "#59dfff",
    showAlbum: false,
    showHelp: false,
    showCard: false,
    albumCards: [],
    revealCardBg: "",
    revealColor: "#ffd166",
    revealRarity: "N",
    revealNo: "001",
    revealName: "",
    revealEn: "",
    revealGlyph: "",
    revealLine: "",
    revealKicker: "",
    revealTitle: "",
    revealDesc: "",
    revealButton: "收下星卡",
    revealStars: "✦",
    confetti: [],
    toastVisible: false,
    toastText: ""
  },

  onLoad() {
    pageRef = this;
    state.streak = 0;
    this.computeLayout();
    const layout = this._layout;
    this.springGeo = {
      trackH: layout.boardH - 76,
      coilTop: Math.round((layout.boardH - 76) * 0.18),
      restCoil: Math.round((layout.boardH - 76) * 0.28),
      travel: Math.round(Math.min(64, (layout.boardH - 76) * 0.22)),
      dragTravel: Math.max(82, Math.round(layout.boardH * 0.26))
    };
    const knobTop = this.springGeo.coilTop + this.springGeo.restCoil - 15;
    this.setData({
      springCoilTop: this.springGeo.coilTop,
      springCoilH: this.springGeo.restCoil,
      springKnobTop: knobTop,
      albumCards: buildAlbumCards(),
      trayMarbles: buildTrayMarbles()
    });
    this.syncHUD();
    this.setData({
      bootVisible: state.marbles < BET,
      bootTitle: state.marbles < BET ? "投币开玩" : "继续开局",
      bootCopy: state.marbles < BET ? "投入 1 枚代币，获得 20 颗弹珠" : "弹珠已就位，拉下弹簧杆开打"
    });
  },

  computeLayout() {
    const info = getWindowInfo();
    const safeArea = info.safeArea || { top: info.statusBarHeight || 20, bottom: info.windowHeight };
    const safeTop = Math.max(info.statusBarHeight || 0, safeArea.top || 0);
    const safeBottom = Math.max(0, (info.screenHeight || info.windowHeight) - (safeArea.bottom || info.windowHeight));
    const machineW = Math.min(info.windowWidth - 12, 520);
    const springW = info.windowWidth <= 350 ? 34 : 38;
    const boardW = Math.max(238, Math.round(machineW - 12 - springW - 6));
    const boardH = Math.round(boardW * 720 / 600);
    this._layout = { safeTop: safeTop, safeBottom: safeBottom, boardW: boardW, boardH: boardH };
    this.setData({ safeTop, safeBottom, boardW, boardH });
  },

  onReady() {
    this.initCanvas();
  },

  onHide() {
    saveState();
    this.cancelCharge(true);
  },

  onUnload() {
    saveState();
    this.clearAllTimers();
    clearTimeout(game.toastTimer);
    game.toastTimer = null;
    if (canvas && rafId !== null && canvas.cancelAnimationFrame) {
      try { canvas.cancelAnimationFrame(rafId); } catch (e) {}
    }
  },

  clearAllTimers() {
    clearInterval(game.spinTimer);
    clearTimeout(game.nextTimer);
    clearTimeout(game.cardTimer);
    clearTimeout(game.splashTimer);
    clearTimeout(game.springTimer);
    game.spinTimer = null;
    game.nextTimer = null;
    game.cardTimer = null;
    game.splashTimer = null;
    game.springTimer = null;
  },

  initCanvas() {
    const query = wx.createSelectorQuery().in(this);
    query.select("#gameCanvas").fields({ node: true, size: true }).exec((res) => {
      if (!res || !res[0] || !res[0].node || !res[0].width || !res[0].height) {
        setTimeout(() => this.initCanvas(), 120);
        return;
      }
      canvas = res[0].node;
      ctx = canvas.getContext("2d");
      const info = getWindowInfo();
      const dpr = Math.min(info.pixelRatio || 2, 2.5);
      canvas.width = Math.round(res[0].width * dpr);
      canvas.height = Math.round(res[0].height * dpr);
      scaleX = canvas.width / VW;
      scaleY = canvas.height / VH;
      lastFrame = 0;
      this.loop();
      if (state.marbles >= BET && !this.bootShown) {
        this.bootShown = true;
        this.startRound();
      } else if (!this.bootShown) {
        this.bootShown = true;
        this.showBoot("投币开玩", "投入 1 枚代币，获得 20 颗弹珠");
      }
    });
  },

  loop() {
    const now = Date.now();
    const dt = lastFrame ? Math.min((now - lastFrame) / 1000, 0.05) : 0.016;
    lastFrame = now;
    this.updateGame(now, dt);
    this.drawGame(now);
    if (canvas && canvas.requestAnimationFrame) {
      rafId = canvas.requestAnimationFrame(() => this.loop());
    } else {
      rafId = setTimeout(() => this.loop(), 16);
    }
  },

  onNoop() {},

  onCanvasTap() {
    if (this.data.bootVisible) this.onInsertCoin();
  },

  /* ---------------- UI state ---------------- */
  syncHUD() {
    const uniqueCards = ownedCardCount();
    this.setData({
      coins: state.coins,
      marbles: state.marbles,
      uniqueCards: uniqueCards,
      pulls: state.stats.pulls,
      stats: Object.assign({}, state.stats),
      streak: state.streak || 0,
      cardEnergy: state.cardEnergy,
      trayMarbles: buildTrayMarbles()
    });
  },

  setMood(config) {
    const cfg = config || { color: "#59dfff", key: "cyan" };
    game.mood = cfg.color;
    this.setData({ moodKey: cfg.key || "cyan", moodColor: cfg.color });
  },

  setPhase(phase) {
    game.phase = phase;
    const copies = {
      boot: ["请先投币", "INSERT COIN", "locked"],
      needCoin: ["请先投币", "INSERT COIN", "locked"],
      spinning: ["倍率锁定中", "LOCKING ODDS", "locked"],
      ready: ["按住蓄力", "HOLD OR PULL", "ready"],
      charging: ["松手发射", "RELEASE TO FIRE", "charging"],
      rail: ["钢珠运行中", "BALL IN PLAY", "locked"],
      fall: ["钢珠运行中", "BALL IN PLAY", "locked"],
      landing: ["读取灯道", "READING EYE", "locked"],
      result: ["本轮结束", "ROUND COMPLETE", "locked"]
    };
    const c = copies[phase] || copies.boot;
    const springLocked = phase !== "ready" && phase !== "charging" && phase !== "needCoin";
    this.setData({
      phase: phase,
      launchLabel: c[0],
      launchSub: c[1],
      launchClass: c[2],
      hintVisible: phase === "ready",
      springClass: springLocked ? "locked" : (phase === "charging" ? "pulling" : "")
    });
  },

  showBoot(title, copy) {
    this.clearAllTimers();
    setMoodDefault(this);
    game.round = null;
    game.spin = null;
    game.ball = null;
    game.charge = null;
    game.phase = "needCoin";
    game.splashUntil = 0;
    game.resultUntil = 0;
    game.resultInfo = null;
    const broke = state.coins < 1;
    this.setData({
      bootVisible: true,
      bootTitle: title || "投币不足",
      bootCopy: copy || "再投 1 枚代币，继续追这一颗。",
      bootBtnText: broke ? "领取补给" : "投币开始",
      bootBtnMeta: broke ? "+5" : "×1",
      splashVisible: false,
      resultVisible: false,
      hintVisible: false,
      launchLabel: "请先投币",
      launchSub: "INSERT COIN",
      launchClass: "locked",
      springClass: "locked",
      phase: "needCoin",
      multDisplay: "--",
      multNote: "等待投币",
      litCount: 0,
      jackpot: false,
      powerPct: 0,
      springCoilH: this.springGeo ? this.springGeo.restCoil : 60,
      springKnobTop: this.springGeo ? this.springGeo.coilTop + this.springGeo.restCoil - 15 : 90
    });
    this.syncHUD();
  },

  startRound() {
    if (["spinning", "charging", "rail", "fall", "landing"].indexOf(game.phase) >= 0) return;
    if (this.data.showAlbum || this.data.showHelp || this.data.showCard) {
      this.pendingNext = true;
      return;
    }
    if (state.marbles < BET) {
      this.pendingNext = false;
      this.showBoot("弹珠不足", "弹珠用完啦。投币续上，下一颗就是你的。");
      return;
    }
    this.clearAllTimers();
    this.pendingNext = false;
    game.roundId += 1;
    const config = weightedPick(MULT_TABLE);
    const lit = chooseLit(config.lit);
    game.round = { multiplier: config.value, config: config, lit: lit, power: 0, released: false, resolved: false };
    game.spin = {
      displayMult: config.value,
      displayLit: lit,
      finalMult: config.value,
      finalLit: lit,
      start: Date.now(),
      lastFlick: 0,
      finalized: false
    };
    game.ball = null;
    game.flashSlot = -1;
    game.flashLife = 0;
    game.phase = "spinning";
    game.splashUntil = 0;
    game.resultUntil = 0;
    game.resultInfo = null;
    setMoodDefault(this);
    this.setData({
      bootVisible: false,
      splashVisible: false,
      resultVisible: false,
      hintVisible: false,
      phase: "spinning",
      multDisplay: config.value,
      multNote: "抽取中…",
      litCount: 0,
      jackpot: false,
      launchLabel: "倍率锁定中",
      launchSub: "LOCKING ODDS",
      launchClass: "locked",
      springClass: "locked",
      powerPct: 0,
      springCoilH: this.springGeo.restCoil,
      springKnobTop: this.springGeo.coilTop + this.springGeo.restCoil - 15
    });
    this.syncHUD();
    const id = game.roundId;
    game.spinTimer = setInterval(() => {
      if (!game.spin || game.spin.finalized || game.roundId !== id) return;
      const elapsed = Date.now() - game.spin.start;
      if (elapsed >= 1050) {
        clearInterval(game.spinTimer);
        game.spinTimer = null;
        this.finalizeSpin();
        return;
      }
      const flick = weightedPick(MULT_TABLE);
      game.spin.displayMult = flick.value;
      game.spin.displayLit = chooseLit(flick.lit);
      this.setData({ multDisplay: flick.value, litCount: flick.lit });
    }, 76);
  },

  finalizeSpin() {
    if (!game.spin || game.spin.finalized) return;
    game.spin.finalized = true;
    const config = MULT_BY_VALUE[game.spin.finalMult];
    setMoodConfig(this, config);
    this.setData({
      multDisplay: config.value,
      litCount: game.round.lit.length,
      jackpot: config.value === 20,
      multNote: (config.value === 20 ? "JACKPOT · 必出星卡" : config.key.toUpperCase()) + " · " + game.round.lit.length + " 轨",
      splashMult: config.value,
      splashLit: game.round.lit.length,
      splashVisible: true,
      phase: "ready",
      launchLabel: "按住蓄力",
      launchSub: "HOLD OR PULL",
      launchClass: "ready",
      hintVisible: true,
      springClass: ""
    });
    game.phase = "ready";
    game.spin = null;
    game.splashUntil = Date.now() + 1650;
    this.addRing(300, 210, config.color, 20, config.value === 20 ? 240 : 160, 0.75);
    game.punch = Math.max(game.punch || 0, 0.5);
    this.vibrateLight();
    clearTimeout(game.splashTimer);
    game.splashTimer = setTimeout(() => {
      this.setData({ splashVisible: false });
    }, 1650);
  },

  setToast(text) {
    clearTimeout(game.toastTimer);
    this.setData({ toastText: text, toastVisible: true });
    game.toastTimer = setTimeout(() => {
      this.setData({ toastVisible: false });
    }, 2400);
  },

  vibrateLight() {
    vibrate("light");
  },

  onInsertCoin() {
    let refill = false;
    if (state.coins < 1) {
      state.coins += 5;
      refill = true;
    }
    state.coins -= 1;
    state.marbles += COIN_VALUE;
    state.stats.coinsIn = (state.stats.coinsIn || 0) + 1;
    saveState();
    this.syncHUD();
    setMoodDefault(this);
    this.setData({ bootVisible: false });
    this.vibrateLight();
    this.setToast(refill ? "补给 5 枚代币 · 投币成功 +20 颗弹珠" : "投币成功 · +20 颗弹珠");
    this.pendingNext = false;
    const wasBoot = game.phase === "needCoin" || game.phase === "boot";
    if (wasBoot) {
      setTimeout(() => this.startRound(), 220);
    }
  },

  /* ---------------- charging ---------------- */
  beginCharge(mode) {
    if (game.phase === "needCoin" || game.phase === "boot") {
      this.setToast("先投币，机器才会亮灯");
      return;
    }
    if (game.phase !== "ready" || this.data.showAlbum || this.data.showHelp || this.data.showCard) return;
    clearTimeout(game.springTimer);
    game.splashUntil = 0;
    game.charge = {
      start: Date.now(),
      mode: mode || "hold",
      power: 0,
      startY: 0
    };
    this.setData({ splashVisible: false });
    this.setPhase("charging");
    this.syncPower(0, true);
    this.vibrateLight();
  },

  syncPower(power, force) {
    const p = clamp(power, 0, 1);
    if (game.round) game.round.power = p;
    const pct = Math.round(p * 100);
    if (!force && Date.now() - game.lastPowerSync < 42) return;
    game.lastPowerSync = Date.now();
    const geo = this.springGeo;
    if (!geo) return;
    const coilH = geo.restCoil + geo.travel * p;
    this.setData({
      powerPct: pct,
      springCoilH: Math.round(coilH),
      springKnobTop: Math.round(geo.coilTop + coilH - 15)
    });
  },

  updateCharge(now) {
    if (!game.charge || game.charge.mode !== "hold") return;
    const p = clamp((now - game.charge.start) / 1680, 0, 1);
    game.charge.power = p;
    this.syncPower(p, false);
  },

  releaseCharge() {
    if (!game.charge) return;
    const p = game.charge.power;
    game.charge = null;
    if (p < 0.035) {
      this.setPhase("ready");
      this.retractSpring(false);
      this.syncPower(0, true);
      this.setToast("力度太小啦，拉深一点");
      return;
    }
    this.fireBall(p);
  },

  cancelCharge(silent) {
    if (!game.charge) return;
    game.charge = null;
    if (game.phase === "charging") {
      this.setPhase("ready");
      this.retractSpring(false);
      this.syncPower(0, true);
      if (!silent) this.setToast("已取消蓄力");
    }
  },

  retractSpring(snap) {
    const geo = this.springGeo;
    if (!geo) return;
    this.setData({
      springCoilH: geo.restCoil,
      springKnobTop: geo.coilTop + geo.restCoil - 15,
      springClass: snap ? "snap" : ""
    });
    clearTimeout(game.springTimer);
    if (snap) this.vibrate("medium");
    game.springTimer = setTimeout(() => {
      if (game.phase !== "charging") {
        this.setData({ springClass: game.phase === "ready" || game.phase === "needCoin" ? "" : "locked" });
      }
    }, 520);
  },

  onLaunchStart(e) {
    if (game.phase === "needCoin" || game.phase === "boot") {
      this.setData({ bootVisible: true });
      return;
    }
    this.beginCharge("hold");
  },

  onLaunchEnd() {
    if (game.charge) this.releaseCharge();
  },

  onLaunchCancel() {
    this.cancelCharge(true);
  },

  onSpringStart(e) {
    if (game.phase === "needCoin" || game.phase === "boot") {
      this.setToast("先投币，弹簧杆才会通电");
      return;
    }
    if (game.phase !== "ready") return;
    const touch = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]);
    this.beginCharge("drag");
    if (game.charge && touch) {
      game.charge.startY = touch.clientY;
      this.setData({ springClass: "pulling" });
    }
  },

  onSpringMove(e) {
    if (!game.charge || game.charge.mode !== "drag" || game.phase !== "charging") return;
    const touch = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]);
    if (!touch) return;
    const p = clamp((touch.clientY - game.charge.startY) / (this.springGeo.dragTravel || 100), 0, 1);
    game.charge.power = p;
    this.syncPower(p, false);
  },

  onSpringEnd() {
    if (game.charge && game.charge.mode === "drag") this.releaseCharge();
  },

  onSpringCancel() {
    if (game.charge) this.cancelCharge(true);
  },

  fireBall(power) {
    if (!game.round || game.round.released) return;
    if (game.phase !== "ready" && game.phase !== "charging") return;
    if (state.marbles < BET) {
      this.showBoot("弹珠不足", "再投 1 枚代币，继续追这一颗。");
      return;
    }
    state.marbles -= BET;
    state.stats.shots += 1;
    game.round.power = power;
    game.round.released = true;
    const dropX = 505 - power * 412 + rand(-7, 7);
    const targetIndex = railIndexForX(dropX);
    game.ball = {
      mode: "rail",
      x: railSamples[0].x,
      y: railSamples[0].y,
      vx: 0,
      vy: 0,
      r: 8.2,
      trail: [],
      railStart: Date.now(),
      railDuration: 520 + power * 330,
      railTargetIndex: targetIndex,
      railTargetDistance: railDistances[targetIndex],
      dropX: dropX,
      fallElapsed: 0,
      landingIndex: -1,
      landingStart: 0,
      landingFrom: null,
      landingTo: null,
      settleDuration: 270
    };
    this.setPhase("rail");
    this.retractSpring(true);
    this.addRing(528, 590, game.mood, 10, 88, 0.5);
    game.punch = Math.max(game.punch || 0, 0.3);
    this.syncHUD();
    saveState();
    this.vibrate("medium");
    const z = zoneFromPower(power);
    this.setToast("发射 · " + z.label + " · 力度 " + Math.round(power * 100) + "%");
  },

  vibrate(type) {
    vibrate(type || "light");
  },

  addRing(x, y, color, startRadius, endRadius, duration) {
    game.rings.push({
      x: x, y: y, color: color,
      radius: startRadius, endRadius: endRadius,
      life: duration, maxLife: duration
    });
  },

  spawnBurst(x, y, color, count, strength) {
    const n = count || 8;
    const s = strength || 1;
    for (let i = 0; i < n; i++) {
      const angle = rand(0, Math.PI * 2);
      const speed = rand(24, 120) * s;
      game.particles.push({
        x: x, y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - rand(0, 30),
        life: rand(0.28, 0.82),
        maxLife: 0.82,
        size: rand(0.7, 2.5),
        color: color,
        gravity: rand(80, 250),
        shape: Math.random() < 0.18 ? "star" : "dot"
      });
    }
  },

  /* ---------------- ball physics ---------------- */
  updateRail(now) {
    const ball = game.ball;
    if (!ball || ball.mode !== "rail") return;
    const t = clamp((now - ball.railStart) / ball.railDuration, 0, 1);
    const eased = 1 - Math.pow(1 - t, 2.4);
    const distance = ball.railTargetDistance * eased;
    let index = 1;
    while (index < ball.railTargetIndex && railDistances[index] < distance) index++;
    const p = railSamples[clamp(index, 0, railSamples.length - 1)];
    ball.x = p.x;
    ball.y = p.y;
    ball.trail.push({ x: ball.x, y: ball.y });
    if (ball.trail.length > 18) ball.trail.shift();
    if (t >= 1) {
      ball.mode = "fall";
      ball.x = ball.dropX;
      ball.y = 138;
      ball.vx = rand(-25, 25) + (0.5 - game.round.power) * 24;
      ball.vy = 62;
      ball.fallElapsed = 0;
      this.spawnBurst(ball.x, 130, "#8df7ff", 10, 0.6);
      this.setPhase("fall");
    }
  },

  collideCircle(cx, cy, cr, restitution, source) {
    const ball = game.ball;
    const dx = ball.x - cx;
    const dy = ball.y - cy;
    const min = ball.r + cr;
    const dist2 = dx * dx + dy * dy;
    if (dist2 >= min * min) return false;
    const dist = Math.sqrt(dist2) || 0.0001;
    const nx = dx / dist;
    const ny = dy / dist;
    ball.x = cx + nx * (min + 0.08);
    ball.y = cy + ny * (min + 0.08);
    const vn = ball.vx * nx + ball.vy * ny;
    if (vn < 0) {
      const j = -(1 + restitution) * vn;
      ball.vx += j * nx;
      ball.vy += j * ny;
      ball.vx += rand(-9, 9);
      ball.vy *= 0.996;
      const impact = Math.min(1, Math.abs(vn) / 480);
      if (source) {
        source.pulse = 1;
        if (impact > 0.08) {
          this.spawnBurst(ball.x, ball.y, source.kind === "star" ? "#ffe08a" : "#75dfff", 3 + Math.round(impact * 6), 0.55 + impact);
        }
      }
    }
    return true;
  },

  collideBumper(bumper) {
    const ball = game.ball;
    const dx = ball.x - bumper.x;
    const dy = ball.y - bumper.y;
    const min = ball.r + bumper.r;
    const dist2 = dx * dx + dy * dy;
    if (dist2 >= min * min) return;
    const dist = Math.sqrt(dist2) || 0.0001;
    const nx = dx / dist;
    const ny = dy / dist;
    ball.x = bumper.x + nx * (min + 0.4);
    ball.y = bumper.y + ny * (min + 0.4);
    const vn = ball.vx * nx + ball.vy * ny;
    if (vn < 0) {
      ball.vx -= 1.92 * vn * nx;
      ball.vy -= 1.92 * vn * ny;
    } else {
      ball.vx += nx * 80;
      ball.vy += ny * 80;
    }
    ball.vx = clamp(ball.vx + nx * 28, -370, 370);
    ball.vy = clamp(ball.vy + ny * 36, -860, 900);
    bumper.pulse = 1;
    game.shake = Math.max(game.shake, 4.5);
    this.spawnBurst(ball.x, ball.y, bumper.hue, 13, 1.1);
    this.vibrate("light");
  },

  beginLanding(index) {
    const ball = game.ball;
    if (!ball || ball.mode === "landing") return;
    const safeIndex = clamp(index, 0, EYE_COUNT - 1);
    ball.mode = "landing";
    ball.landingIndex = safeIndex;
    ball.landingStart = Date.now();
    ball.landingFrom = { x: ball.x, y: ball.y };
    ball.landingTo = { x: slotCenter(safeIndex), y: 661 };
    ball.vx = 0;
    ball.vy = 0;
    game.flashSlot = safeIndex;
    game.flashLife = 1;
    game.shake = Math.max(game.shake, 2.2);
    this.setPhase("landing");
    this.vibrate("light");
  },

  updateLanding(now) {
    const ball = game.ball;
    if (!ball || ball.mode !== "landing") return;
    const t = clamp((now - ball.landingStart) / ball.settleDuration, 0, 1);
    const e = 1 - Math.pow(1 - t, 2.2);
    ball.x = ball.landingFrom.x + (ball.landingTo.x - ball.landingFrom.x) * e;
    ball.y = ball.landingFrom.y + (ball.landingTo.y - ball.landingFrom.y) * e;
    if (t >= 1) this.resolveLanding(ball.landingIndex);
  },

  stepFall(dt, now) {
    const ball = game.ball;
    if (!ball || ball.mode !== "fall") return;
    ball.fallElapsed += dt;
    ball.vy += 790 * dt;
    ball.vx *= 0.9993;
    ball.vy = Math.min(ball.vy, 900);
    ball.vx = clamp(ball.vx, -380, 380);
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;

    if (ball.x - ball.r < 60) {
      ball.x = 60 + ball.r;
      ball.vx = Math.abs(ball.vx) * 0.56 + 6;
      ball.vy *= 0.985;
      if (Math.abs(ball.vx) > 100) this.spawnBurst(ball.x, ball.y, "#5ea9ff", 3, 0.4);
    }
    if (ball.x + ball.r > 540) {
      ball.x = 540 - ball.r;
      ball.vx = -Math.abs(ball.vx) * 0.56 - 6;
      ball.vy *= 0.985;
      if (Math.abs(ball.vx) > 100) this.spawnBurst(ball.x, ball.y, "#5ea9ff", 3, 0.4);
    }

    for (let i = 0; i < PEGS.length; i++) {
      this.collideCircle(PEGS[i].x, PEGS[i].y, PEGS[i].r, 0.48, PEGS[i]);
    }
    for (let i = 0; i < BUMPERS.length; i++) {
      this.collideBumper(BUMPERS[i]);
    }

    ball.trail.push({ x: ball.x, y: ball.y });
    if (ball.trail.length > 12) ball.trail.shift();

    if (ball.y + ball.r > SLOT.top + 1) {
      const index = Math.floor((ball.x - SLOT.left) / SLOT.width);
      this.beginLanding(index);
      return;
    }
    if (ball.fallElapsed > 9) {
      const index = Math.floor((ball.x - SLOT.left) / SLOT.width);
      this.beginLanding(index);
    }
  },

  updateBall(now, dt) {
    if (!game.ball) return;
    if (game.ball.mode === "rail") {
      this.updateRail(now);
      return;
    }
    if (game.ball.mode === "landing") {
      this.updateLanding(now);
      return;
    }
    if (game.ball.mode === "fall") {
      let remaining = Math.min(dt, 0.05);
      const step = 1 / 180;
      while (remaining > 0) {
        const slice = Math.min(step, remaining);
        this.stepFall(slice, now);
        remaining -= slice;
        if (!game.ball || game.ball.mode !== "fall") break;
      }
    }
  },

  /* ---------------- result / cards ---------------- */
  resolveLanding(index) {
    if (!game.round || game.round.resolved) return;
    game.round.resolved = true;
    const hit = game.round.lit.indexOf(index) >= 0;
    const multiplier = game.round.multiplier;
    const config = MULT_BY_VALUE[multiplier];
    const win = hit ? BET * multiplier : 0;
    setMoodConfig(this, config);

    if (hit) {
      state.marbles += win;
      state.stats.hits += 1;
      state.stats.best = Math.max(state.stats.best || 0, multiplier);
      state.streak = (state.streak || 0) + 1;
      state.cardEnergy = clamp(state.cardEnergy + 18 + multiplier * 2, 0, 100);
      if (multiplier === 20) state.stats.jackpots = (state.stats.jackpots || 0) + 1;
    } else {
      state.marbles += 1;
      state.streak = 0;
      state.cardEnergy = clamp(state.cardEnergy + 6, 0, 100);
    }

    const energyFull = state.cardEnergy >= 100;
    const jackpotCard = hit && multiplier === 20;
    let pulled = null;
    if (energyFull || jackpotCard) pulled = this.pullCard();

    if (hit) {
      game.shake = Math.max(game.shake, config.value === 20 ? 10 : 4);
      game.punch = Math.max(game.punch, config.value === 20 ? 1.8 : 0.55 + multiplier * 0.03);
      this.addRing(slotCenter(index), 655, config.color, 10, config.value === 20 ? 230 : 120, 0.8);
      this.spawnBurst(slotCenter(index), 650, config.color, config.value === 20 ? 40 : 18, config.value === 20 ? 1.7 : 1.05);
      this.vibrate(config.value >= 8 ? "heavy" : "medium");
    } else {
      this.addRing(slotCenter(index), 655, "#5f82c4", 8, 64, 0.55);
      this.vibrate("light");
    }

    game.resultInfo = {
      hit: hit,
      multiplier: multiplier,
      win: win,
      color: config.color,
      jackpot: config.value === 20,
      kicker: hit ? (config.value === 20 ? "20× JACKPOT" : "LIGHT HIT") : "MISS",
      main: hit ? "×" + multiplier + " 命中" : "差一点",
      sub: hit
        ? "赢得 " + win + " 颗弹珠" + (pulled ? " · 星卡吐出" : "")
        : (pulled ? "返还 1 颗安慰珠 · 星卡吐出" : "返还 1 颗安慰珠 · 下颗更准")
    };
    game.resultUntil = Date.now() + 2500;
    this.setData({
      resultVisible: true,
      resultKicker: game.resultInfo.kicker,
      resultMain: game.resultInfo.main,
      resultSub: game.resultInfo.sub,
      resultClass: hit ? (config.value === 20 ? "jackpot" : "") : "miss",
      cardEnergy: state.cardEnergy
    });
    this.setPhase("result");
    this.syncHUD();
    saveState();

    if (pulled) {
      this.pendingNext = true;
      this.setToast(config.value === 20 ? "JACKPOT · 必出星卡" : "出卡能量满格 · 星卡吐出");
      this.scheduleCardReveal(pulled, 900);
    } else {
      this.scheduleNext(2500);
    }
  },

  pullRarity() {
    return weightedPick(Object.keys(RARITIES).map((key) => ({ value: key, weight: RARITIES[key].weight }))).value;
  },

  pullCard() {
    const rarity = this.pullRarity();
    const pool = CARDS.filter((card) => card.rarity === rarity);
    const unowned = pool.filter((card) => !state.cards[card.id]);
    let card;
    if (unowned.length && Math.random() < 0.72) card = pick(unowned);
    else card = pick(pool);

    const beforeUnique = ownedCardCount();
    const isNew = !state.cards[card.id];
    state.cards[card.id] = (state.cards[card.id] || 0) + 1;
    state.stats.pulls = (state.stats.pulls || 0) + 1;
    state.cardEnergy = 0;
    let refund = 0;
    let completion = false;
    if (isNew) {
      state.coins += 1;
      state.newCards = state.newCards.concat(card.id);
      if (ownedCardCount() === CARDS.length && beforeUnique < CARDS.length) {
        state.coins += 10;
        completion = true;
      }
    } else {
      refund = RARITIES[card.rarity].refund;
      state.marbles += refund;
    }
    saveState();
    this.setData({ albumCards: buildAlbumCards() });
    return { card: card, isNew: isNew, refund: refund, completion: completion };
  },

  scheduleCardReveal(pulled, delay) {
    clearTimeout(game.cardTimer);
    game.cardTimer = setTimeout(() => {
      if (this.data.showAlbum || this.data.showHelp || this.data.showCard) {
        this.scheduleCardReveal(pulled, 450);
        return;
      }
      this.showCardReveal(pulled);
    }, delay || 900);
  },

  showCardReveal(pulled) {
    const card = pulled.card;
    const isNew = pulled.isNew;
    const stars = { N: "✦", R: "✦✦", SR: "✦✦✦", SSR: "✦✦✦✦" }[card.rarity];
    this.setData({
      showCard: true,
      revealCardBg: cardBackground(card),
      revealColor: card.c1,
      revealRarity: card.rarity,
      revealNo: card.no,
      revealName: card.name,
      revealEn: card.en,
      revealGlyph: card.glyph,
      revealLine: card.line,
      revealStars: stars,
      revealKicker: isNew ? "NEW " + card.rarity + " · NO." + card.no : "DUPLICATE · NO." + card.no,
      revealTitle: card.name,
      revealDesc: isNew
        ? card.line + "　新卡入库，奖励 1 枚代币。" + (pulled.completion ? " 图鉴集齐，额外奖励 10 枚代币！" : "")
        : "这张「" + card.name + "」已经有了，机器自动折算为 " + pulled.refund + " 颗弹珠。",
      revealButton: isNew ? "收下星卡 ✦" : "收下 " + pulled.refund + " 颗弹珠",
      confetti: buildConfetti(card)
    });
    this.vibrate(card.rarity === "SSR" ? "heavy" : "medium");
  },

  scheduleNext(delay) {
    clearTimeout(game.nextTimer);
    game.nextTimer = setTimeout(() => {
      if (this.data.showAlbum || this.data.showHelp || this.data.showCard) {
        this.pendingNext = true;
        return;
      }
      if (state.marbles >= BET) this.startRound();
      else this.showBoot("弹珠不足", "弹珠用完啦。投币续上，下一颗就是你的。");
    }, delay || 2500);
  },

  resumePending() {
    if (!this.pendingNext) return;
    if (this.data.showAlbum || this.data.showHelp || this.data.showCard) return;
    this.pendingNext = false;
    setTimeout(() => {
      if (this.data.showAlbum || this.data.showHelp || this.data.showCard) {
        this.pendingNext = true;
        return;
      }
      if (state.marbles >= BET) this.startRound();
      else this.showBoot("弹珠不足", "弹珠用完啦。投币续上，下一颗就是你的。");
    }, 280);
  },

  onCloseCard() {
    this.setData({ showCard: false });
    this.pendingNext = true;
    this.resumePending();
  },

  onOpenAlbum() {
    this.cancelCharge(true);
    this.setData({ albumCards: buildAlbumCards(), showAlbum: true });
  },

  onCloseAlbum() {
    this.setData({ showAlbum: false });
    this.resumePending();
  },

  onOpenHelp() {
    this.cancelCharge(true);
    this.setData({ showHelp: true });
  },

  onCloseHelp() {
    this.setData({ showHelp: false });
    this.resumePending();
  },

  onReset() {
    wx.showModal({
      title: "清空存档",
      content: "确定清空弹珠、代币和星卡图鉴吗？",
      confirmText: "清空",
      confirmColor: "#ff5da8",
      success: (res) => {
        if (res.confirm) {
          state = defaultState();
          try { wx.removeStorageSync(SAVE_KEY); } catch (e) {}
          wx.reLaunch({ url: "/pages/game/game" });
        }
      }
    });
  },

  updateGame(now, dt) {
    if (game.phase === "charging") this.updateCharge(now);
    this.updateBall(now, dt);
    for (let i = game.particles.length - 1; i >= 0; i--) {
      const p = game.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        game.particles.splice(i, 1);
        continue;
      }
      p.vy += p.gravity * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.985;
    }
    if (game.particles.length > 220) game.particles.splice(0, game.particles.length - 220);
    for (let i = game.rings.length - 1; i >= 0; i--) {
      game.rings[i].life -= dt;
      if (game.rings[i].life <= 0) game.rings.splice(i, 1);
    }
    game.shake *= Math.pow(0.002, dt);
    if (game.shake < 0.15) game.shake = 0;
    game.punch *= Math.pow(0.006, dt);
    if (game.punch < 0.02) game.punch = 0;
    game.flashLife = Math.max(0, game.flashLife - dt * 1.8);
    if (game.flashLife <= 0) game.flashSlot = -1;
    for (let i = 0; i < PEGS.length; i++) PEGS[i].pulse = Math.max(0, (PEGS[i].pulse || 0) - dt * 2.6);
    for (let i = 0; i < BUMPERS.length; i++) BUMPERS[i].pulse = Math.max(0, (BUMPERS[i].pulse || 0) - dt * 1.8);
  },

  /* ---------------- canvas drawing ---------------- */
  roundRectPath(x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  },

  drawBackground(now) {
    const t = now / 1000;
    const mood = game.mood || "#58e9ff";
    const bg = ctx.createLinearGradient(0, 0, 0, VH);
    bg.addColorStop(0, "#0a1330");
    bg.addColorStop(0.28, "#071126");
    bg.addColorStop(0.72, "#080d1e");
    bg.addColorStop(1, "#04070f");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, VW, VH);

    const upper = ctx.createRadialGradient(300, 182, 10, 300, 270, 380);
    upper.addColorStop(0, hexA(mood, 0.21));
    upper.addColorStop(0.45, hexA(mood, 0.065));
    upper.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = upper;
    ctx.fillRect(0, 0, VW, 600);

    const lower = ctx.createRadialGradient(300, 636, 20, 300, 660, 300);
    lower.addColorStop(0, hexA(mood, 0.1));
    lower.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = lower;
    ctx.fillRect(0, 430, VW, 290);

    ctx.save();
    ctx.strokeStyle = "rgba(102, 142, 225, 0.065)";
    ctx.lineWidth = 1;
    for (let x = 60; x <= 540; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 72);
      ctx.lineTo(x, 606);
      ctx.stroke();
    }
    for (let y = 100; y <= 600; y += 40) {
      ctx.beginPath();
      ctx.moveTo(58, y);
      ctx.lineTo(542, y);
      ctx.stroke();
    }

    for (let i = 0; i < ORBITS.length; i++) {
      const orbit = ORBITS[i];
      ctx.save();
      ctx.translate(orbit.x, orbit.y);
      ctx.rotate(orbit.rot + Math.sin(t * 0.08 + i) * 0.01);
      ctx.strokeStyle = hexA(mood, orbit.alpha * 0.72);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(0, 0, orbit.r, orbit.r * 0.42, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([3, 9]);
      ctx.strokeStyle = "rgba(255,115,187," + (orbit.alpha * 0.7) + ")";
      ctx.beginPath();
      ctx.ellipse(0, 0, orbit.r * 0.74, orbit.r * 0.28, 0.55, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    const scanY = 96 + ((now * 0.038) % 520);
    const scan = ctx.createLinearGradient(0, scanY - 34, 0, scanY + 34);
    scan.addColorStop(0, hexA(mood, 0));
    scan.addColorStop(0.48, hexA(mood, 0.045));
    scan.addColorStop(0.52, "rgba(255,255,255,0.018)");
    scan.addColorStop(1, hexA(mood, 0));
    ctx.fillStyle = scan;
    ctx.fillRect(58, scanY - 34, 484, 68);

    for (let i = 0; i < STARS.length; i++) {
      const star = STARS[i];
      const alpha = star.a * (0.5 + 0.5 * Math.sin(t * star.speed + star.phase));
      ctx.fillStyle = "rgba(204,237,255," + alpha + ")";
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    const shade = ctx.createLinearGradient(0, 0, VW, 0);
    shade.addColorStop(0, "rgba(0,4,11,0.62)");
    shade.addColorStop(0.075, "rgba(0,4,11,0)");
    shade.addColorStop(0.925, "rgba(0,4,11,0)");
    shade.addColorStop(1, "rgba(0,4,11,0.62)");
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, VW, VH);
  },

  drawRail(now) {
    ctx.save();
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    for (let i = 0; i < railSamples.length; i++) {
      if (i === 0) ctx.moveTo(railSamples[i].x, railSamples[i].y);
      else ctx.lineTo(railSamples[i].x, railSamples[i].y);
    }
    ctx.strokeStyle = "rgba(2,5,14,0.9)";
    ctx.lineWidth = 19;
    ctx.stroke();
    ctx.strokeStyle = "rgba(43,64,116,0.92)";
    ctx.lineWidth = 14;
    ctx.stroke();
    ctx.strokeStyle = "rgba(6,12,28,0.98)";
    ctx.lineWidth = 9;
    ctx.stroke();
    ctx.strokeStyle = "rgba(82,224,255,0.2)";
    ctx.lineWidth = 1;
    ctx.stroke();
    const pulse = 0.5 + 0.5 * Math.sin(now / 640);
    ctx.setLineDash([3, 16]);
    ctx.lineDashOffset = -(now / 100) % 19;
    ctx.strokeStyle = "rgba(89,231,255," + (0.15 + pulse * 0.1) + ")";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  },

  drawPegs(now) {
    const time = now / 1000;
    for (let i = 0; i < PEGS.length; i++) {
      const peg = PEGS[i];
      const pulse = peg.pulse || 0;
      const radius = peg.r + pulse * 1.2;
      if (peg.kind === "divider") {
        ctx.save();
        ctx.translate(peg.x, peg.y);
        ctx.rotate(Math.PI / 4);
        ctx.fillStyle = "rgba(74,104,160,0.75)";
        ctx.fillRect(-2.2, -2.2, 4.4, 4.4);
        ctx.restore();
        continue;
      }
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 5;
      ctx.shadowOffsetY = 3;
      ctx.fillStyle = peg.kind === "star" ? "#7a6333" : "#182a4d";
      ctx.beginPath();
      ctx.arc(peg.x, peg.y, radius + 1.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      const g = ctx.createRadialGradient(peg.x - radius * 0.35, peg.y - radius * 0.42, 0.3, peg.x, peg.y, radius);
      if (peg.kind === "star") {
        g.addColorStop(0, "#fff8cf");
        g.addColorStop(0.35, "#ffe28a");
        g.addColorStop(0.75, "#ad792b");
        g.addColorStop(1, "#43300e");
      } else {
        g.addColorStop(0, "#e2f8ff");
        g.addColorStop(0.18, "#89c9ef");
        g.addColorStop(0.6, "#3b6d9e");
        g.addColorStop(1, "#122642");
      }
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(peg.x, peg.y, radius, 0, Math.PI * 2);
      ctx.fill();
      if (peg.kind === "star") {
        ctx.strokeStyle = "rgba(255,223,130," + (0.32 + 0.2 * Math.sin(time * 2.3 + peg.x)) + ")";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(peg.x, peg.y, radius + 4, 0, Math.PI * 2);
        ctx.stroke();
      }
      if (pulse > 0.08) {
        ctx.strokeStyle = "rgba(137,231,255," + (pulse * 0.45) + ")";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(peg.x, peg.y, radius + (1 - pulse) * 10, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    for (let i = 0; i < BUMPERS.length; i++) {
      const b = BUMPERS[i];
      const pulse = b.pulse || 0;
      const breathe = 1 + Math.sin(time * 2.1 + i) * 0.035;
      ctx.save();
      const glow = ctx.createRadialGradient(b.x, b.y, b.r * 0.3, b.x, b.y, b.r * 2.6);
      glow.addColorStop(0, hexA(b.hue, 0.34));
      glow.addColorStop(0.45, hexA(b.hue, 0.08));
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r * 2.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.translate(b.x, b.y);
      ctx.rotate(time * 0.2 * (i % 2 ? -1 : 1));
      ctx.strokeStyle = hexA(b.hue, pulse > 0.2 ? 0.65 : 0.32);
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 5]);
      ctx.beginPath();
      ctx.arc(0, 0, b.r + 7 + pulse * 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.rotate(-time * 0.2 * (i % 2 ? -1 : 1));
      const bg = ctx.createRadialGradient(-b.r * 0.3, -b.r * 0.35, 1, 0, 0, b.r * breathe);
      bg.addColorStop(0, "#ffffff");
      bg.addColorStop(0.18, b.hue);
      bg.addColorStop(0.55, "#14365a");
      bg.addColorStop(1, "#07101f");
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.arc(0, 0, b.r * breathe, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.45)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }
  },

  drawSlots(now) {
    const lit = currentLit();
    const multiplier = currentMultiplier();
    const config = MULT_BY_VALUE[multiplier];
    const color = config ? config.color : "#53dfff";
    const pulse = 0.5 + 0.5 * Math.sin(now / 330);
    ctx.save();
    this.roundRectPath(SLOT.left - 4, SLOT.top - 7, SLOT.right - SLOT.left + 8, SLOT.bottom - SLOT.top + 12, 8);
    const plate = ctx.createLinearGradient(0, SLOT.top - 7, 0, SLOT.bottom + 5);
    plate.addColorStop(0, "#0b1428");
    plate.addColorStop(1, "#02050d");
    ctx.fillStyle = plate;
    ctx.fill();
    ctx.strokeStyle = "rgba(100,157,228,0.25)";
    ctx.lineWidth = 1;
    ctx.stroke();

    for (let i = 0; i < EYE_COUNT; i++) {
      const x = SLOT.left + i * SLOT.width;
      const cx = x + SLOT.width / 2;
      const isLit = lit.indexOf(i) >= 0;
      const idle = game.phase === "boot" || game.phase === "needCoin";
      const chase = idle && (Math.floor(now / 360) % EYE_COUNT === i);
      const bright = isLit || chase;
      ctx.save();
      this.roundRectPath(x + 2.4, SLOT.top, SLOT.width - 4.8, SLOT.bottom - SLOT.top, 5);
      const bg = ctx.createLinearGradient(0, SLOT.top, 0, SLOT.bottom);
      if (bright) {
        bg.addColorStop(0, hexA(color, isLit ? 0.42 : 0.13));
        bg.addColorStop(0.45, hexA(color, isLit ? 0.19 : 0.06));
        bg.addColorStop(1, "rgba(4,9,20,0.98)");
      } else {
        bg.addColorStop(0, "#091326");
        bg.addColorStop(1, "#040913");
      }
      ctx.fillStyle = bg;
      ctx.fill();
      if (bright) {
        ctx.shadowColor = color;
        ctx.shadowBlur = isLit ? 12 : 5;
        ctx.strokeStyle = hexA(color, isLit ? 0.66 : 0.25);
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.shadowBlur = 0;
        const sensor = ctx.createRadialGradient(cx, SLOT.top + 9, 0, cx, SLOT.top + 9, 8);
        sensor.addColorStop(0, "#ffffff");
        sensor.addColorStop(0.28, color);
        sensor.addColorStop(1, hexA(color, 0));
        ctx.fillStyle = sensor;
        ctx.beginPath();
        ctx.arc(cx, SLOT.top + 9, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = hexA(color, 0.25 + pulse * 0.25);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx, SLOT.top + 19);
        ctx.lineTo(cx, SLOT.bottom - 17);
        ctx.stroke();
        if (multiplier > 0) {
          ctx.font = "800 12px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#ffffff";
          ctx.fillText("×" + multiplier, cx, SLOT.bottom - 14);
        }
      } else {
        ctx.strokeStyle = "rgba(107,147,209,0.12)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = "rgba(111,143,197,0.2)";
        ctx.beginPath();
        ctx.arc(cx, SLOT.top + 9, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.font = "500 7px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = isLit ? "rgba(255,255,255,0.45)" : "rgba(99,127,177,0.28)";
      ctx.fillText(String(i + 1), cx, SLOT.bottom - 3);
      ctx.restore();
      if (i > 0) {
        ctx.strokeStyle = "rgba(101,145,208,0.18)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, SLOT.top + 2);
        ctx.lineTo(x, SLOT.bottom - 2);
        ctx.stroke();
      }
    }
    if (game.flashSlot >= 0 && game.flashLife > 0) {
      const x = SLOT.left + game.flashSlot * SLOT.width;
      const g = ctx.createLinearGradient(0, SLOT.top, 0, SLOT.bottom);
      g.addColorStop(0, "rgba(255,255,255," + (game.flashLife * 0.5) + ")");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      this.roundRectPath(x + 2.4, SLOT.top, SLOT.width - 4.8, SLOT.bottom - SLOT.top, 5);
      ctx.fill();
    }
    ctx.restore();
  },

  drawAimGuide(now) {
    if (game.phase !== "charging" || !game.round) return;
    const power = game.round.power || 0;
    const zone = zoneFromPower(power);
    const x = SLOT.left + zone.start * SLOT.width;
    const w = SLOT.width * 4;
    const pulse = 0.5 + 0.5 * Math.sin(now / 150);
    const guide = game.mood || "#58e9ff";
    ctx.save();
    ctx.setLineDash([5, 5]);
    ctx.lineDashOffset = -(now / 55) % 10;
    ctx.strokeStyle = hexA(guide, 0.45 + pulse * 0.25);
    ctx.lineWidth = 1.5;
    this.roundRectPath(x + 1, SLOT.top - 12, w - 2, SLOT.bottom - SLOT.top + 7, 8);
    ctx.stroke();
    ctx.setLineDash([]);
    const g = ctx.createLinearGradient(0, SLOT.top - 12, 0, SLOT.bottom);
    g.addColorStop(0, hexA(guide, 0.09));
    g.addColorStop(1, hexA(guide, 0.015));
    ctx.fillStyle = g;
    this.roundRectPath(x + 1, SLOT.top - 12, w - 2, SLOT.bottom - SLOT.top + 7, 8);
    ctx.fill();
    ctx.font = "600 6px monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = hexA(guide, 0.9);
    ctx.fillText("预测落点 · " + zone.label, x + w / 2, SLOT.top - 19);
    for (let i = 0; i < 4; i++) {
      const cx = SLOT.left + (zone.start + i + 0.5) * SLOT.width;
      ctx.fillStyle = hexA(guide, 0.32 + pulse * 0.2);
      ctx.beginPath();
      ctx.moveTo(cx - 3, SLOT.top - 7);
      ctx.lineTo(cx + 3, SLOT.top - 7);
      ctx.lineTo(cx, SLOT.top - 2);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  },

  drawChromeBall(x, y, r, glowColor, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha === undefined ? 1 : alpha;
    if (glowColor) {
      const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 3.2);
      glow.addColorStop(0, hexA(glowColor, 0.4));
      glow.addColorStop(0.5, hexA(glowColor, 0.1));
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, r * 3.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowColor = "rgba(0,0,0,0.6)";
    ctx.shadowBlur = 7;
    ctx.shadowOffsetY = 3;
    const g = ctx.createRadialGradient(x - r * 0.36, y - r * 0.4, 0.4, x, y, r * 1.08);
    g.addColorStop(0, "#ffffff");
    g.addColorStop(0.14, "#e9fbff");
    g.addColorStop(0.36, "#a9c6e4");
    g.addColorStop(0.66, "#5b739b");
    g.addColorStop(0.88, "#263752");
    g.addColorStop(1, "#0b1221");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    ctx.strokeStyle = "rgba(220,248,255,0.58)";
    ctx.lineWidth = 0.7;
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.86)";
    ctx.beginPath();
    ctx.ellipse(x - r * 0.34, y - r * 0.38, r * 0.18, r * 0.1, -0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },

  drawBall(now) {
    const ball = game.ball;
    if (!ball) {
      if (game.phase === "ready" || game.phase === "charging" || game.phase === "spinning") {
        const power = game.phase === "charging" && game.round ? game.round.power : 0;
        this.drawChromeBall(528, 590 + power * 9, 8.2, "#67e7ff", 0.94);
      }
      return;
    }
    for (let i = 0; i < ball.trail.length; i++) {
      const p = ball.trail[i];
      const alpha = (i / ball.trail.length) * 0.16;
      ctx.fillStyle = "rgba(126,230,255," + alpha + ")";
      ctx.beginPath();
      ctx.arc(p.x, p.y, ball.r * (0.28 + i / ball.trail.length * 0.6), 0, Math.PI * 2);
      ctx.fill();
    }
    const color = ball.mode === "rail" ? "#7defff" : ball.mode === "landing" ? "#ffe27a" : "#8edcff";
    this.drawChromeBall(ball.x, ball.y, ball.r, color, 1);
  },

  drawRings() {
    if (!game.rings.length) return;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < game.rings.length; i++) {
      const ring = game.rings[i];
      const progress = 1 - ring.life / ring.maxLife;
      const radius = ring.radius + (ring.endRadius - ring.radius) * (1 - Math.pow(1 - progress, 2));
      const alpha = (1 - progress) * 0.72;
      ctx.strokeStyle = hexA(ring.color, alpha);
      ctx.lineWidth = 2.4 * (1 - progress) + 0.3;
      ctx.shadowColor = ring.color;
      ctx.shadowBlur = 10 * (1 - progress);
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  },

  drawParticles() {
    if (!game.particles.length) return;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < game.particles.length; i++) {
      const p = game.particles[i];
      const alpha = clamp(p.life / p.maxLife, 0, 1);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      if (p.shape === "star") {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(alpha * 3);
        ctx.beginPath();
        for (let j = 0; j < 4; j++) {
          const angle = j * Math.PI / 2;
          ctx.lineTo(Math.cos(angle) * p.size * 2.2, Math.sin(angle) * p.size * 2.2);
          ctx.lineTo(Math.cos(angle + Math.PI / 4) * p.size * 0.7, Math.sin(angle + Math.PI / 4) * p.size * 0.7);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  },

  drawGlass() {
    const vignette = ctx.createRadialGradient(300, 350, 160, 300, 360, 470);
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, "rgba(0,2,8,0.42)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, VW, VH);
    ctx.strokeStyle = "rgba(182,229,255,0.14)";
    ctx.lineWidth = 1;
    this.roundRectPath(48, 68, 504, 638, 18);
    ctx.stroke();
  },

  drawTopline() {
    ctx.save();
    ctx.font = "600 11px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#48f5c5";
    ctx.beginPath();
    ctx.arc(72, 86, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(181,203,255,0.72)";
    ctx.fillText("12 LIGHT EYES", 81, 86);
    ctx.textAlign = "right";
    ctx.fillText("BET 5 MARBLES", 528, 86);
    ctx.restore();
  },

  drawHint() {
    if (game.phase !== "ready") return;
    ctx.save();
    const w = 280;
    const x = 300 - w / 2;
    const y = 545;
    this.roundRectPath(x, y, w, 34, 17);
    ctx.fillStyle = "rgba(5,10,22,0.78)";
    ctx.fill();
    ctx.strokeStyle = "rgba(117,197,255,0.22)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.font = "500 13px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(201,223,255,0.9)";
    ctx.fillText("按住按钮 / 下拉弹簧杆蓄力", 300, y + 18);
    ctx.restore();
  },

  drawSplash(now) {
    if (!game.round || game.phase !== "ready" || now >= game.splashUntil) return;
    const config = game.round.config;
    const w = 230;
    const h = 146;
    const x = 300 - w / 2;
    const y = 136;
    ctx.save();
    this.roundRectPath(x, y, w, h, 17);
    const bg = ctx.createLinearGradient(x, y, x, y + h);
    bg.addColorStop(0, "rgba(13,19,42,0.94)");
    bg.addColorStop(1, "rgba(7,9,20,0.9)");
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.strokeStyle = hexA(config.color, 0.4);
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "600 11px sans-serif";
    ctx.fillStyle = "rgba(140,149,185,0.9)";
    ctx.fillText("本轮倍率", 300, y + 22);
    ctx.font = "900 56px sans-serif";
    ctx.fillStyle = config.color;
    ctx.shadowColor = config.color;
    ctx.shadowBlur = 20;
    ctx.fillText("×" + config.value, 300, y + 70);
    ctx.shadowBlur = 0;
    ctx.font = "500 13px sans-serif";
    ctx.fillStyle = "rgba(185,248,255,0.9)";
    ctx.fillText(game.round.lit.length + " 轨亮灯", 300, y + 118);
    ctx.restore();
  },

  drawResult(now) {
    if (!game.resultInfo || now >= game.resultUntil) return;
    const info = game.resultInfo;
    const w = 300;
    const h = 128;
    const x = 300 - w / 2;
    const y = 245;
    const color = info.hit ? info.color : "#ff7088";
    ctx.save();
    this.roundRectPath(x, y, w, h, 15);
    const bg = ctx.createLinearGradient(x, y, x, y + h);
    if (info.jackpot) {
      bg.addColorStop(0, "rgba(54,41,11,0.96)");
      bg.addColorStop(1, "rgba(21,13,4,0.94)");
    } else if (info.hit) {
      bg.addColorStop(0, "rgba(9,30,34,0.96)");
      bg.addColorStop(1, "rgba(5,9,19,0.94)");
    } else {
      bg.addColorStop(0, "rgba(39,15,28,0.96)");
      bg.addColorStop(1, "rgba(7,8,18,0.94)");
    }
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.strokeStyle = hexA(color, 0.55);
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "700 11px sans-serif";
    ctx.fillStyle = color;
    ctx.fillText(info.kicker, 300, y + 22);
    ctx.font = "900 40px sans-serif";
    ctx.fillStyle = info.jackpot ? "#fff0af" : "#ffffff";
    ctx.fillText(info.main, 300, y + 61);
    ctx.font = "500 13px sans-serif";
    ctx.fillStyle = info.hit ? "#b9d6d1" : "#ffb3c2";
    ctx.fillText(info.sub, 300, y + 96);
    ctx.restore();
  },

  drawBoot() {
    if (!this.data.bootVisible) return;
    ctx.save();
    ctx.fillStyle = "rgba(3,5,12,0.72)";
    ctx.fillRect(0, 0, VW, VH);

    const w = 350;
    const h = 338;
    const x = 300 - w / 2;
    const y = 175;
    this.roundRectPath(x, y, w, h, 19);
    const bg = ctx.createLinearGradient(x, y, x, y + h);
    bg.addColorStop(0, "rgba(18,24,50,0.96)");
    bg.addColorStop(1, "rgba(5,7,16,0.95)");
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.strokeStyle = "rgba(255,209,102,0.3)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "600 11px sans-serif";
    ctx.fillStyle = "#ffd166";
    ctx.fillText("◉  COIN OPERATED  ◉", 300, y + 36);

    ctx.font = "900 40px sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(this.data.bootTitle || "投币开玩", 300, y + 86);

    ctx.font = "500 14px sans-serif";
    ctx.fillStyle = "#a0adcf";
    const copy = this.data.bootCopy || "投入 1 枚代币，获得 20 颗弹珠";
    this.wrapCanvasText(copy, 300, y + 120, 280, 20, 2);

    const bx = 180;
    const by = y + 172;
    const bw = 240;
    const bh = 52;
    this.roundRectPath(bx, by, bw, bh, 12);
    const gold = ctx.createLinearGradient(bx, by, bx, by + bh);
    gold.addColorStop(0, "#ffe89e");
    gold.addColorStop(0.4, "#ffd166");
    gold.addColorStop(1, "#e8a625");
    ctx.fillStyle = gold;
    ctx.fill();
    ctx.font = "800 20px sans-serif";
    ctx.fillStyle = "#1b1304";
    ctx.fillText("◉  " + (this.data.bootBtnText || "投币开始"), 300, by + 26);

    ctx.font = "500 11px sans-serif";
    ctx.fillStyle = "#657096";
    ctx.fillText("每局消耗 5 颗 · 虚拟代币纯娱乐", 300, y + 258);

    ctx.font = "500 13px sans-serif";
    ctx.fillStyle = "rgba(150,210,255,0.84)";
    ctx.fillText("轻触机台任意处投币", 300, y + 296);
    ctx.restore();
  },

  wrapCanvasText(text, cx, startY, maxWidth, lineHeight, maxLines) {
    const chars = String(text).split("");
    let line = "";
    let lineIndex = 0;
    for (let i = 0; i < chars.length; i++) {
      const test = line + chars[i];
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, cx, startY + lineIndex * lineHeight);
        line = chars[i];
        lineIndex++;
        if (lineIndex >= (maxLines || 2)) return;
      } else {
        line = test;
      }
    }
    if (line && lineIndex < (maxLines || 2)) ctx.fillText(line, cx, startY + lineIndex * lineHeight);
  },

  drawHud(now) {
    this.drawTopline();
    if (this.data.bootVisible) {
      this.drawBoot();
      return;
    }
    this.drawHint();
    this.drawSplash(now);
    this.drawResult(now);
  },

  drawGame(now) {
    if (!ctx) return;
    ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);
    ctx.clearRect(0, 0, VW, VH);
    ctx.save();
    const zoom = 1 + (game.punch || 0) * 0.013;
    if (zoom !== 1) {
      ctx.translate(300, 360);
      ctx.scale(zoom, zoom);
      ctx.translate(-300, -360);
    }
    if (game.shake > 0.2) {
      ctx.translate(rand(-game.shake, game.shake), rand(-game.shake, game.shake));
    }
    this.drawBackground(now);
    this.drawRail(now);
    this.drawPegs(now);
    this.drawSlots(now);
    this.drawAimGuide(now);
    this.drawBall(now);
    this.drawRings();
    this.drawParticles();
    this.drawGlass();
    this.drawHud(now);
    ctx.restore();
  },

  onShareAppMessage() {
    return {
      title: "银河弹珠局 · 投币拉杆，出珠出卡",
      path: "/pages/game/game"
    };
  },

  onShareTimeline() {
    return { title: "银河弹珠局 · 投币拉杆，出珠出卡" };
  }
});

