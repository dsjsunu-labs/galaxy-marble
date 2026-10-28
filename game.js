/* =========================================================
   银河弹珠局 — GALAXY MARBLE CLUB
   12 灯道 / 拉杆控力 / 随机倍率 / 出珠出卡
   ========================================================= */
(() => {
  "use strict";

  /* ---------------------------------------------------------
     utilities
     --------------------------------------------------------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rand = (a, b) => a + Math.random() * (b - a);
  const randInt = (a, b) => Math.floor(rand(a, b + 1));
  const choice = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = (arr) => {
    const out = arr.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  };
  const pad = (n) => String(n).padStart(2, "0");
  const timeLabel = () => {
    const d = new Date();
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const safeStorage = {
    get(key) {
      try { return localStorage.getItem(key); } catch (_) { return null; }
    },
    set(key, value) {
      try { localStorage.setItem(key, value); } catch (_) {}
    },
    remove(key) {
      try { localStorage.removeItem(key); } catch (_) {}
    }
  };

  /* ---------------------------------------------------------
     data
     --------------------------------------------------------- */
  const RARITIES = {
    N:   { label: "N",   stars: 1, weight: 46, refund: 6,  color: "#9fb2dc" },
    R:   { label: "R",   stars: 2, weight: 30, refund: 12, color: "#58e9ff" },
    SR:  { label: "SR",  stars: 3, weight: 16, refund: 24, color: "#bd8bff" },
    SSR: { label: "SSR", stars: 4, weight: 8,  refund: 48, color: "#ffd166" }
  };

  const CARDS = [
    { id: "firefly", no: "001", name: "流萤", en: "FIREFLY", glyph: "萤", rarity: "N",
      c1: "#8af7d4", c2: "#073e49", c3: "#3b7cff", line: "从指缝里漏下的一点光，偏偏不肯熄灭。" },
    { id: "pebble", no: "002", name: "石语", en: "PEBBLE", glyph: "石", rarity: "N",
      c1: "#c2d3ff", c2: "#222f55", c3: "#7b8cff", line: "它说自己见过银河，只是懒得起身。" },
    { id: "paper-boat", no: "003", name: "纸舟", en: "PAPER SKIFF", glyph: "舟", rarity: "N",
      c1: "#ffd5a1", c2: "#462912", c3: "#ff7a59", line: "折了七次，刚好能驶过一小片月光。" },
    { id: "wave-cat", no: "004", name: "波猫", en: "WAVE CAT", glyph: "猫", rarity: "N",
      c1: "#8fd9ff", c2: "#103150", c3: "#7a8bff", line: "耳朵一动，远处的信号就变成了呼噜声。" },

    { id: "orbit-hare", no: "005", name: "星轨兔", en: "ORBIT HARE", glyph: "兔", rarity: "R",
      c1: "#baffd6", c2: "#104a3b", c3: "#48e6ff", line: "它把每一次弹跳，都记成一颗星。" },
    { id: "neon-jelly", no: "006", name: "霓虹水母", en: "NEON JELLY", glyph: "水", rarity: "R",
      c1: "#ff9ee9", c2: "#431852", c3: "#6d69ff", line: "在深海里发光，是它唯一会的语言。" },
    { id: "lunar-rover", no: "007", name: "月面车", en: "LUNAR ROVER", glyph: "车", rarity: "R",
      c1: "#e6e8ff", c2: "#292c50", c3: "#9ea8ff", line: "跑了九万公里，只为捡一枚安静的石头。" },
    { id: "pulse-fox", no: "008", name: "脉冲狐", en: "PULSE FOX", glyph: "狐", rarity: "R",
      c1: "#ffb17a", c2: "#521e0d", c3: "#ff4e8e", line: "尾巴扫过的地方，旧电台会突然有了信号。" },

    { id: "comet-knight", no: "009", name: "彗星骑士", en: "COMET KNIGHT", glyph: "骑", rarity: "SR",
      c1: "#7af0ff", c2: "#11316a", c3: "#ff68c8", line: "披风是尾焰做的。冲锋之前，他会先把星星擦亮。" },
    { id: "mecha-whale", no: "010", name: "机械鲸", en: "MECHA WHALE", glyph: "鲸", rarity: "SR",
      c1: "#75c9ff", c2: "#0a2b52", c3: "#5effda", line: "每隔百年浮上海面，换一次星空的电池。" },
    { id: "gravity-mage", no: "011", name: "引力法师", en: "GRAVITY MAGE", glyph: "引", rarity: "SR",
      c1: "#c39bff", c2: "#2b1357", c3: "#ff7fd4", line: "她从不掷硬币，只让硬币自己决定落下。" },
    { id: "aurora-dragon", no: "012", name: "极光龙", en: "AURORA DRAGON", glyph: "龙", rarity: "SR",
      c1: "#71ffc9", c2: "#0a3d40", c3: "#a47dff", line: "鳞片翻动时，北方的夜会被重新上色。" },

    { id: "galaxy-crown", no: "013", name: "银河王冠", en: "GALAXY CROWN", glyph: "冠", rarity: "SSR",
      c1: "#ffe79a", c2: "#57330b", c3: "#ff6fa7", line: "没有国王。它只负责在最高处，替所有弹珠发光。" },
    { id: "singularity-diva", no: "014", name: "黑洞歌姬", en: "SINGULARITY DIVA", glyph: "姬", rarity: "SSR",
      c1: "#d4a4ff", c2: "#1a083c", c3: "#45e8ff", line: "她的高音能弯曲光线，返场曲目叫《事件视界》。" },
    { id: "nebula-titan", no: "015", name: "星云巨兽", en: "NEBULA TITAN", glyph: "兽", rarity: "SSR",
      c1: "#ff9a7c", c2: "#4b0f26", c3: "#ffd76e", line: "它打一个喷嚏，人间就会多一场流星雨。" },
    { id: "eternal-marble", no: "016", name: "永恒弹珠", en: "ETERNAL MARBLE", glyph: "珠", rarity: "SSR",
      c1: "#a8fbff", c2: "#092f50", c3: "#ff9ce4", line: "传说它从未停下。你听见的每一声落袋，都是它经过。" }
  ];
  const CARD_BY_ID = Object.fromEntries(CARDS.map((card) => [card.id, card]));

  const MULT_TABLE = [
    { value: 2,  weight: 30, lit: 6, color: "#52f4c6", label: "轻倍率" },
    { value: 4,  weight: 27, lit: 4, color: "#59dfff", label: "稳倍率" },
    { value: 6,  weight: 20, lit: 3, color: "#a98bff", label: "进击" },
    { value: 8,  weight: 13, lit: 2, color: "#ff78cc", label: "高倍" },
    { value: 10, weight: 8,  lit: 1, color: "#ff9d54", label: "超倍" },
    { value: 20, weight: 2,  lit: 1, color: "#ffe27a", label: "JACKPOT", jackpot: true }
  ];
  const MULT_BY_VALUE = Object.fromEntries(MULT_TABLE.map((m) => [m.value, m]));
  const BET = 5;
  const COIN_VALUE = 20;
  const START_COINS = 20;
  const SAVE_KEY = "galaxyMarble.save.v1";
  const EYE_COUNT = 12;

  /* ---------------------------------------------------------
     state / save
     --------------------------------------------------------- */
  function defaultSave() {
    return {
      coins: START_COINS,
      marbles: 0,
      cards: {},
      newCards: [],
      cardEnergy: 0,
      muted: false,
      stats: {
        shots: 0,
        hits: 0,
        best: 0,
        pulls: 0,
        jackpots: 0
      },
      seenHelp: false
    };
  }

  function sanitizeSave(raw) {
    const base = defaultSave();
    if (!raw || typeof raw !== "object") return base;
    const num = (v, fallback, min = 0, max = 1e9) => {
      const n = Number(v);
      return Number.isFinite(n) ? clamp(Math.floor(n), min, max) : fallback;
    };
    base.coins = num(raw.coins, START_COINS, 0, 999999);
    base.marbles = num(raw.marbles, 0, 0, 9999999);
    base.cardEnergy = num(raw.cardEnergy, 0, 0, 100);
    base.muted = Boolean(raw.muted);
    base.seenHelp = Boolean(raw.seenHelp);
    if (raw.cards && typeof raw.cards === "object") {
      Object.keys(raw.cards).forEach((id) => {
        if (CARD_BY_ID[id]) base.cards[id] = num(raw.cards[id], 1, 1, 999);
      });
    }
    if (Array.isArray(raw.newCards)) {
      base.newCards = raw.newCards.filter((id) => CARD_BY_ID[id] && base.cards[id]).slice(0, 24);
    }
    if (raw.stats && typeof raw.stats === "object") {
      base.stats.shots = num(raw.stats.shots, 0);
      base.stats.hits = num(raw.stats.hits, 0);
      base.stats.best = num(raw.stats.best, 0);
      base.stats.pulls = num(raw.stats.pulls, 0);
      base.stats.jackpots = num(raw.stats.jackpots, 0);
    }
    return base;
  }

  let state = defaultSave();
  try {
    const saved = safeStorage.get(SAVE_KEY);
    if (saved) state = sanitizeSave(JSON.parse(saved));
  } catch (_) {}

  let saveTimer = null;
  function save(immediate = false) {
    clearTimeout(saveTimer);
    const commit = () => {
      safeStorage.set(SAVE_KEY, JSON.stringify(state));
      saveTimer = null;
    };
    if (immediate) commit();
    else saveTimer = setTimeout(commit, 180);
  }

  function ownedCardCount() {
    return Object.keys(state.cards).filter((id) => CARD_BY_ID[id]).length;
  }
  function totalCardCount() {
    return Object.values(state.cards).reduce((sum, n) => sum + (Number(n) || 0), 0);
  }

  /* ---------------------------------------------------------
     DOM cache
     --------------------------------------------------------- */
  const dom = {
    cabinet: $("#cabinet"),
    cabinetFlash: $("#cabinetFlash"),
    canvas: $("#gameCanvas"),
    glassFrame: $("#glassFrame"),
    plungerAssembly: $("#plungerAssembly"),
    plungerKnob: $("#plungerKnob"),
    plungerSpring: $("#plungerSpring"),
    plungerRod: $("#plungerRod"),
    bootVeil: $("#bootVeil"),
    bootTitle: $("#bootTitle"),
    bootCopy: $("#bootCopy"),
    bootBtnText: $("#bootBtnText"),
    bootCoinBtn: $("#bootCoinBtn"),
    roundSplash: $("#roundSplash"),
    splashMult: $("#splashMult"),
    splashLit: $("#splashLit"),
    resultToast: $("#resultToast"),
    resultKicker: $("#resultKicker"),
    resultMain: $("#resultMain"),
    resultSub: $("#resultSub"),
    chargeHint: $("#chargeHint"),
    phaseText: $("#phaseText"),
    sideMult: $("#sideMult"),
    sideMultLabel: $("#sideMultLabel"),
    sideLit: $("#sideLit"),
    sideStreak: $("#sideStreak"),
    intelNote: $("#intelNote"),
    energyFill: $("#energyFill"),
    energyText: $("#energyText"),
    marbleCount: $("#marbleCount"),
    coinCount: $("#coinCount"),
    cardCount: $("#cardCount"),
    topMarbles: $("#topMarbles"),
    topCoins: $("#topCoins"),
    mobileMarbles: $("#mobileMarbles"),
    mobileCoins: $("#mobileCoins"),
    mobileCards: $("#mobileCards"),
    albumCount: $("#albumCount"),
    albumProgressCount: $("#albumProgressCount"),
    statShots: $("#statShots"),
    statHits: $("#statHits"),
    statRate: $("#statRate"),
    statBest: $("#statBest"),
    multModule: $("#multModule"),
    multValue: $("#multValue"),
    multNote: $("#multNote"),
    powerPercent: $("#powerPercent"),
    powerFill: $("#powerFill"),
    powerKnob: $("#powerKnob"),
    aimZone: $("#aimZone"),
    powerTrack: $("#powerTrack"),
    launchBtn: $("#launchBtn"),
    launchLabel: $("#launchLabel"),
    launchSub: $("#launchSub"),
    sideStreakPill: $("#sideStreak"),
    tray: $("#marbleTray"),
    trayCount: $("#trayCount"),
    cardDispenser: $("#cardDispenser"),
    cardOutCount: $("#cardOutCount"),
    insertCoinBtn: $("#insertCoinBtn"),
    coinSlotBtn: $("#coinSlotBtn"),
    mobileCoinBtn: $("#mobileCoinBtn"),
    mobileAlbumBtn: $("#mobileAlbumBtn"),
    openAlbumBtn: $("#openAlbumBtn"),
    miniGrid: $("#miniGrid"),
    albumGrid: $("#albumGrid"),
    eventLog: $("#eventLog"),
    soundBtn: $("#soundBtn"),
    helpBtn: $("#helpBtn"),
    resetBtn: $("#resetBtn"),
    cardModal: $("#cardModal"),
    albumModal: $("#albumModal"),
    helpModal: $("#helpModal"),
    cardRevealPanel: $("#cardRevealPanel"),
    revealCardMount: $("#revealCardMount"),
    revealKicker: $("#revealKicker"),
    revealTitle: $("#revealTitle"),
    revealDesc: $("#revealDesc"),
    revealCloseBtn: $("#revealCloseBtn"),
    confettiLayer: $("#confettiLayer"),
    toastStack: $("#toastStack")
  };

  /* ---------------------------------------------------------
     audio
     --------------------------------------------------------- */
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.master = null;
      this.muted = state.muted;
      this.charge = null;
      this.noiseBuffer = null;
      this.lastPeg = 0;
      this.lastTick = 0;
    }

    init() {
      if (this.ctx) {
        if (this.ctx.state === "suspended") this.ctx.resume().catch(() => {});
        return;
      }
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      try {
        this.ctx = new AC();
        this.master = this.ctx.createGain();
        this.master.gain.value = this.muted ? 0 : 0.56;
        this.master.connect(this.ctx.destination);
        this.buildNoise();
      } catch (_) {
        this.ctx = null;
      }
    }

    buildNoise() {
      if (!this.ctx) return;
      const len = Math.floor(this.ctx.sampleRate * 0.7);
      const buffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      this.noiseBuffer = buffer;
    }

    setMuted(muted) {
      this.muted = muted;
      state.muted = muted;
      save();
      if (this.master && this.ctx) {
        this.master.gain.cancelScheduledValues(this.ctx.currentTime);
        this.master.gain.setTargetAtTime(muted ? 0 : 0.56, this.ctx.currentTime, 0.03);
      }
      if (muted) this.stopCharge();
    }

    tone(freq, dur = 0.1, type = "sine", gain = 0.15, slide = 0, delay = 0) {
      if (!this.ctx || this.muted) return;
      const t0 = this.ctx.currentTime + delay;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t0);
      if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(24, freq + slide), t0 + dur);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(gain, t0 + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(g);
      g.connect(this.master);
      osc.start(t0);
      osc.stop(t0 + dur + 0.03);
    }

    noise(dur = 0.3, gain = 0.08, freq = 900, q = 1.4, delay = 0) {
      if (!this.ctx || !this.noiseBuffer || this.muted) return;
      const t0 = this.ctx.currentTime + delay;
      const src = this.ctx.createBufferSource();
      src.buffer = this.noiseBuffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(freq, t0);
      filter.frequency.exponentialRampToValueAtTime(Math.max(120, freq * 0.45), t0 + dur);
      filter.Q.value = q;
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      src.connect(filter);
      filter.connect(g);
      g.connect(this.master);
      src.start(t0);
      src.stop(t0 + dur + 0.05);
    }

    coin() {
      this.init();
      this.tone(1046, 0.08, "square", 0.07);
      this.tone(1568, 0.13, "sine", 0.11, 90, 0.035);
      this.noise(0.1, 0.025, 3200, 3);
    }

    tick() {
      if (!this.ctx) return;
      const now = performance.now();
      if (now - this.lastTick < 55) return;
      this.lastTick = now;
      this.tone(rand(900, 1350), 0.035, "square", 0.018);
    }

    startCharge() {
      this.init();
      if (!this.ctx || this.muted || this.charge) return;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const g = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.value = 84;
      filter.type = "lowpass";
      filter.frequency.value = 420;
      filter.Q.value = 4;
      g.gain.value = 0.0001;
      g.gain.exponentialRampToValueAtTime(0.028, this.ctx.currentTime + 0.07);
      osc.connect(filter);
      filter.connect(g);
      g.connect(this.master);
      osc.start();
      this.charge = { osc, filter, gain: g };
    }

    updateCharge(p) {
      if (!this.charge || !this.ctx) return;
      const t = this.ctx.currentTime;
      const freq = 80 + p * 230;
      this.charge.osc.frequency.setTargetAtTime(freq, t, 0.04);
      this.charge.filter.frequency.setTargetAtTime(360 + p * 1500, t, 0.05);
      this.charge.gain.gain.setTargetAtTime(0.02 + p * 0.035, t, 0.05);
    }

    stopCharge() {
      if (!this.charge || !this.ctx) { this.charge = null; return; }
      const { osc, gain } = this.charge;
      const t = this.ctx.currentTime;
      gain.gain.cancelScheduledValues(t);
      gain.gain.setTargetAtTime(0.0001, t, 0.03);
      try { osc.stop(t + 0.18); } catch (_) {}
      this.charge = null;
    }

    launch(power) {
      this.stopCharge();
      this.noise(0.32, 0.06 + power * 0.04, 1900, 1.1);
      this.tone(160 + power * 90, 0.22, "sawtooth", 0.04, -80);
      this.tone(920, 0.08, "sine", 0.02, 380, 0.03);
    }

    spring(power = 1) {
      this.init();
      this.tone(72 + power * 16, 0.26, "sine", 0.09 + power * 0.03, -22);
      this.tone(240, 0.32, "triangle", 0.025, 620);
      this.noise(0.14, 0.03, 720, 2.1);
    }

    peg(strength = 1) {
      if (!this.ctx || this.muted) return;
      const now = performance.now();
      if (now - this.lastPeg < 32) return;
      this.lastPeg = now;
      const f = rand(640, 1450);
      this.tone(f, 0.035 + Math.min(0.04, strength * 0.02), "triangle", 0.012 + Math.min(0.018, strength * 0.01), -f * 0.12);
    }

    bumper() {
      this.tone(210, 0.16, "sine", 0.07, 180);
      this.tone(740, 0.18, "triangle", 0.035, 380);
      this.noise(0.12, 0.025, 1600, 1.8);
    }

    lock() {
      this.tone(523, 0.1, "sine", 0.06);
      this.tone(784, 0.16, "sine", 0.07, 0, 0.05);
      this.tone(1046, 0.2, "sine", 0.055, 0, 0.1);
    }

    land(hit) {
      this.tone(86, 0.15, "sine", 0.13, -30);
      this.noise(0.08, 0.025, 400, 1.2);
      if (!hit) this.tone(220, 0.25, "triangle", 0.035, -70, 0.04);
    }

    win(mult) {
      const base = [523, 659, 784, 1046].map((n) => n * (mult >= 8 ? 1.12 : 1));
      base.forEach((n, i) => this.tone(n, 0.18, "sine", 0.07, 0, i * 0.065));
      this.tone(base[0] / 2, 0.4, "triangle", 0.025, -30, 0.05);
    }

    lose() {
      this.tone(392, 0.22, "triangle", 0.04, -30);
      this.tone(294, 0.4, "triangle", 0.035, -40, 0.12);
    }

    card(rarity = "R") {
      const seq = rarity === "SSR"
        ? [523, 659, 784, 1046, 1318, 1568]
        : rarity === "SR"
          ? [523, 659, 880, 1174]
          : [659, 880, 1046];
      seq.forEach((n, i) => this.tone(n, 0.36, "sine", 0.06, 0, i * 0.085));
      this.noise(0.5, 0.02, 3600, 1.8, 0.1);
    }

    jackpot() {
      const seq = [523, 659, 784, 1046, 1318, 1568, 2093];
      seq.forEach((n, i) => {
        this.tone(n, 0.5, "sine", 0.075, 0, i * 0.11);
        this.tone(n / 2, 0.6, "triangle", 0.025, 0, i * 0.11);
      });
      this.noise(0.8, 0.03, 2400, 2);
    }
  }

  const sound = new SoundEngine();

  /* ---------------------------------------------------------
     canvas / board geometry
     --------------------------------------------------------- */
  const VW = 600;
  const VH = 720;
  const BOARD = { left: 54, right: 546, top: 60, bottom: 700 };
  const SLOT = {
    left: 58,
    right: 542,
    top: 614,
    bottom: 698,
    count: EYE_COUNT,
    width: (542 - 58) / EYE_COUNT
  };

  const canvas = dom.canvas;
  const ctx = canvas.getContext("2d");
  let viewScaleX = 1;
  let viewScaleY = 1;

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.round(rect.width * dpr);
    const height = Math.round(rect.height * dpr);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    viewScaleX = canvas.width / VW;
    viewScaleY = canvas.height / VH;
  }

  function catmullRom(points, samples = 16) {
    if (points.length < 2) return points.slice();
    const out = [];
    const p = [points[0], ...points, points[points.length - 1]];
    for (let i = 0; i < p.length - 3; i++) {
      const p0 = p[i];
      const p1 = p[i + 1];
      const p2 = p[i + 2];
      const p3 = p[i + 3];
      for (let s = 0; s < samples; s++) {
        const t = s / samples;
        const t2 = t * t;
        const t3 = t2 * t;
        const x = 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);
        const y = 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);
        out.push({ x, y });
      }
    }
    out.push({ ...points[points.length - 1] });
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
    const dx = railSamples[i].x - railSamples[i - 1].x;
    const dy = railSamples[i].y - railSamples[i - 1].y;
    railDistances.push(railDistances[i - 1] + Math.hypot(dx, dy));
  }

  function railIndexForX(x) {
    let best = railSamples.length - 1;
    let bestDelta = Infinity;
    for (let i = 0; i < railSamples.length; i++) {
      const p = railSamples[i];
      if (p.y < 150 && p.x <= 510) {
        const delta = Math.abs(p.x - x);
        if (delta < bestDelta) {
          bestDelta = delta;
          best = i;
        }
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
  (() => {
    for (let row = 0; row < 8; row++) {
      const odd = row % 2 === 1;
      const count = odd ? 8 : 7;
      const start = odd ? 88 : 120;
      const step = odd ? 60.4 : 63.5;
      for (let i = 0; i < count; i++) {
        const x = start + i * step;
        const y = 244 + row * 39.5;
        const blocked = BUMPERS.some((b) => Math.hypot(x - b.x, y - b.y) < b.r + 13);
        if (!blocked) {
          PEGS.push({
            x,
            y,
            r: rand(5.1, 6.2),
            kind: (row + i) % 7 === 0 ? "star" : "peg",
            pulse: 0
          });
        }
      }
    }
    SLOT.count = EYE_COUNT;
    for (let i = 1; i < EYE_COUNT; i++) {
      PEGS.push({
        x: SLOT.left + i * SLOT.width,
        y: 596,
        r: 3.6,
        kind: "divider",
        pulse: 0
      });
    }
  })();

  const STARS = Array.from({ length: 66 }, () => ({
    x: rand(66, 534),
    y: rand(82, 600),
    r: rand(0.35, 1.35),
    a: rand(0.14, 0.6),
    phase: rand(0, Math.PI * 2),
    speed: rand(0.45, 1.45)
  }));

  const ORBITS = [
    { x: 300, y: 356, r: 154, rot: -0.22, alpha: 0.13 },
    { x: 300, y: 356, r: 226, rot: 0.18, alpha: 0.09 },
    { x: 300, y: 356, r: 298, rot: -0.08, alpha: 0.06 }
  ];

  function slotCenter(index) {
    return SLOT.left + (index + 0.5) * SLOT.width;
  }

  function zoneFromPower(power) {
    if (power < 1 / 3) return { key: "right", label: "右路", start: 8, end: 11, index: 0 };
    if (power < 2 / 3) return { key: "mid", label: "中路", start: 4, end: 7, index: 1 };
    return { key: "left", label: "左路", start: 0, end: 3, index: 2 };
  }

  /* ---------------------------------------------------------
     transient game state
     --------------------------------------------------------- */
  const game = {
    phase: "boot",
    round: null,
    spin: null,
    ball: null,
    particles: [],
    shake: 0,
    flashSlot: -1,
    flashLife: 0,
    overlays: 0,
    pendingNext: false,
    charge: null,
    lastTime: 0,
    autoTimer: null,
    splashTimer: null,
    roundId: 0,
    trayRendered: 0,
    lastUI: {},
    lastPowerBucket: -1,
    cardTimer: null,
    nextTimer: null,
    bumperFlash: 0,
    plungerTimer: null,
    mood: "#58e9ff",
    rings: [],
    punch: 0
  };

  const launchButton = dom.launchBtn;

  function hexA(hex, alpha = 1) {
    if (typeof hex !== "string" || !hex.startsWith("#")) return `rgba(88, 233, 255, ${alpha})`;
    let h = hex.slice(1);
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    const num = parseInt(h, 16);
    if (!Number.isFinite(num)) return `rgba(88, 233, 255, ${alpha})`;
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function setMood(color, fever = false) {
    const next = color || "#58e9ff";
    game.mood = next;
    document.documentElement.style.setProperty("--mood", next);
    dom.cabinet.classList.toggle("fever", Boolean(fever));
  }

  function flashCabinet(color = "#ffffff") {
    dom.cabinetFlash.style.setProperty("--flash-color", color);
    dom.cabinetFlash.classList.remove("flash");
    void dom.cabinetFlash.offsetWidth;
    dom.cabinetFlash.classList.add("flash");
  }

  /* ---------------------------------------------------------
     round setup
     --------------------------------------------------------- */
  function weightedPick(table) {
    const total = table.reduce((sum, item) => sum + item.weight, 0);
    let roll = Math.random() * total;
    for (const item of table) {
      roll -= item.weight;
      if (roll <= 0) return item;
    }
    return table[table.length - 1];
  }

  function chooseLit(count) {
    return shuffle(Array.from({ length: EYE_COUNT }, (_, i) => i))
      .slice(0, count)
      .sort((a, b) => a - b);
  }

  function currentMultiplier() {
    if (game.spin) return game.spin.displayMult;
    return game.round ? game.round.multiplier : 0;
  }

  function currentLit() {
    if (game.spin) return game.spin.displayLit;
    return game.round ? game.round.lit : [];
  }

  function startRound() {
    if (["spinning", "charging", "rail", "fall", "landing"].includes(game.phase)) return;
    if (game.overlays > 0) {
      game.pendingNext = true;
      return;
    }
    if (state.marbles < BET) {
      game.pendingNext = false;
      showBoot("弹珠不足", "再投 1 枚代币，继续追这一颗。");
      return;
    }
    clearTimeout(game.nextTimer);
    clearTimeout(game.cardTimer);
    clearTimeout(game.splashTimer);
    game.nextTimer = null;
    game.cardTimer = null;
    game.pendingNext = false;
    game.roundId++;
    const multiplier = weightedPick(MULT_TABLE);
    const lit = chooseLit(multiplier.lit);
    game.round = {
      multiplier: multiplier.value,
      lit,
      config: multiplier,
      power: 0,
      released: false,
      resolved: false,
      startedAt: performance.now()
    };
    game.spin = {
      displayMult: multiplier.value,
      displayLit: lit,
      start: performance.now(),
      lastFlick: 0,
      finalized: false,
      finalMult: multiplier.value,
      finalLit: lit
    };
    game.ball = null;
    game.flashSlot = -1;
    game.flashLife = 0;
    setMood("#58e9ff", false);
    dom.roundSplash.classList.remove("show");
    dom.resultToast.classList.remove("show", "miss", "jackpot");
    dom.bootVeil.classList.add("hide");
    dom.multModule.classList.remove("jackpot", "locked");
    dom.multModule.classList.add("spinning");
    dom.sideMult.textContent = "×--";
    dom.sideMultLabel.textContent = "机器正在锁定倍率";
    dom.sideLit.textContent = "-- / 12";
    dom.sideStreak.textContent = state.streak || 0;
    dom.intelNote.textContent = "随机倍率锁定中，落点将由拉杆力度决定";
    dom.multNote.textContent = "抽取中…";
    setPhase("spinning");
    resetPowerUI();
    sound.tick();
    updateHUD();
  }

  function finalizeSpin() {
    if (!game.spin || game.spin.finalized) return;
    game.spin.finalized = true;
    const final = game.spin.finalMult;
    const config = MULT_BY_VALUE[final];
    game.spin.displayMult = final;
    game.spin.displayLit = game.spin.finalLit;
    setMood(config.color, final >= 8);
    dom.multModule.classList.remove("spinning");
    dom.multModule.classList.add("locked");
    dom.multModule.classList.toggle("jackpot", Boolean(config.jackpot));
    dom.multValue.textContent = final;
    dom.sideMult.textContent = `×${final}`;
    dom.sideMultLabel.textContent = config.jackpot ? "JACKPOT · 必出星卡" : config.label;
    dom.sideLit.textContent = `${game.round.lit.length} / 12`;
    dom.multNote.textContent = `${game.round.lit.length} 轨亮灯 · 命中即得 ${BET * final} 珠`;
    dom.splashMult.textContent = `×${final}`;
    dom.splashMult.style.color = config.color;
    dom.splashMult.style.textShadow = `0 0 28px ${hexA(config.color, 0.75)}`;
    dom.splashLit.textContent = `${game.round.lit.length} 轨亮灯`;
    dom.roundSplash.classList.add("show");
    dom.sideStreak.textContent = state.streak || 0;
    dom.intelNote.textContent = config.jackpot
      ? "JACKPOT 已亮起：命中任一灯道必出星卡"
      : `本局 ${game.round.lit.length} 条灯道亮起，选一条有把握的路线`;
    setPhase("ready");
    sound.lock();
    flashCabinet(config.color);
    game.punch = Math.max(game.punch, config.jackpot ? 1 : 0.5);
    addRing(300, 210, config.color, 22, config.jackpot ? 260 : 180, 0.8);
    spawnBurst(300, 196, config.color, config.jackpot ? 30 : 16, config.jackpot ? 1.5 : 0.9);
    clearTimeout(game.splashTimer);
    game.splashTimer = setTimeout(() => {
      dom.roundSplash.classList.remove("show");
    }, 1700);
    if (game.spin.finalized) game.spin = null;
  }

  function showBoot(title = "投币开玩", copy = "投入 1 枚代币，获得 20 颗弹珠") {
    clearTimeout(game.nextTimer);
    setMood("#58e9ff", false);
    setPhase("needCoin");
    dom.bootTitle.textContent = title;
    dom.bootCopy.textContent = copy;
    const broke = state.coins < 1;
    dom.bootBtnText.textContent = broke ? "领取补给" : "投币开始";
    dom.bootCoinBtn.querySelector("em").textContent = broke ? "+5" : "×1";
    dom.bootVeil.classList.remove("hide");
    dom.chargeHint.classList.remove("show");
    dom.roundSplash.classList.remove("show");
    dom.resultToast.classList.remove("show", "miss", "jackpot");
    dom.sideMult.textContent = "×--";
    dom.sideMultLabel.textContent = "等待投币";
    dom.sideLit.textContent = "-- / 12";
    dom.intelNote.textContent = "投币后自动抽取本轮倍率";
    dom.multValue.textContent = "--";
    dom.multNote.textContent = "等待投币";
    dom.splashMult.style.color = "";
    dom.splashMult.style.textShadow = "";
    dom.multModule.classList.remove("jackpot", "spinning", "locked");
    resetPowerUI();
    updateHUD();
  }

  function insertCoin() {
    sound.init();
    let refill = false;
    if (state.coins < 1) {
      state.coins += 5;
      refill = true;
    }
    state.coins -= 1;
    state.marbles += COIN_VALUE;
    state.stats.coinsIn = (state.stats.coinsIn || 0) + 1;
    const wasBoot = game.phase === "needCoin" || game.phase === "boot";
    const wasResult = game.phase === "result";
    hideBoot();
    sound.coin();
    updateHUD(true);
    save();
    toast(refill ? "代币补给 +5 · 投币成功，+20 颗弹珠" : "投币成功 · +20 颗弹珠", "gold");
    logEvent(`投币 · 获得 ${COIN_VALUE} 颗弹珠`, "card");
    if (wasBoot) {
      setTimeout(() => startRound(), 230);
    } else if (wasResult) {
      game.pendingNext = true;
    }
  }

  function hideBoot() {
    dom.bootVeil.classList.add("hide");
  }

  /* ---------------------------------------------------------
     phase / HUD
     --------------------------------------------------------- */
  const PHASE_COPY = {
    boot: ["待投币", "请先投币", "INSERT COIN"],
    needCoin: ["待投币", "请先投币", "INSERT COIN"],
    spinning: ["锁定倍率", "倍率锁定中", "LOCKING ODDS"],
    ready: ["可发射", "按住蓄力", "HOLD TO CHARGE"],
    charging: ["蓄力中", "松手发射", "RELEASE TO FIRE"],
    rail: ["发射", "钢珠运行中", "BALL IN PLAY"],
    fall: ["运行", "钢珠运行中", "BALL IN PLAY"],
    landing: ["落袋", "正在读取灯道", "READING EYE"],
    result: ["已结算", "本轮结束", "ROUND COMPLETE"]
  };

  function setPhase(phase) {
    game.phase = phase;
    const copy = PHASE_COPY[phase] || PHASE_COPY.boot;
    dom.phaseText.textContent = copy[0];
    dom.launchLabel.textContent = copy[1];
    dom.launchSub.textContent = copy[2];
    const chargeable = phase === "ready";
    launchButton.classList.toggle("ready", chargeable);
    launchButton.classList.toggle("disabled", !chargeable && phase !== "charging" && phase !== "needCoin");
    launchButton.classList.toggle("charging", phase === "charging");
    launchButton.setAttribute("aria-disabled", String(!chargeable && phase !== "needCoin"));
    const plungerLocked = !["ready", "charging", "needCoin", "boot"].includes(phase);
    dom.plungerAssembly.classList.toggle("is-locked", plungerLocked);
    dom.plungerAssembly.setAttribute("aria-disabled", String(plungerLocked));
    dom.cabinet.classList.toggle("is-charging", phase === "charging");
    dom.cabinet.classList.toggle("in-play", phase === "rail" || phase === "fall" || phase === "landing");
    dom.chargeHint.classList.toggle("show", chargeable);
    if (phase === "charging") {
      dom.aimZone.classList.add("show");
    } else if (phase !== "ready") {
      dom.aimZone.classList.remove("show");
    }
  }

  function bumpText(el, value) {
    if (!el) return;
    const next = String(value);
    if (el.textContent === next) return;
    el.textContent = next;
    el.classList.remove("bump");
    void el.offsetWidth;
    el.classList.add("bump");
  }

  function updateHUD(animate = false) {
    const unique = ownedCardCount();
    const pulls = state.stats.pulls || 0;
    if (animate) bumpText(dom.marbleCount, state.marbles);
    else dom.marbleCount.textContent = state.marbles;
    dom.coinCount.textContent = state.coins;
    dom.topMarbles.textContent = state.marbles;
    dom.topCoins.textContent = state.coins;
    dom.mobileMarbles.textContent = state.marbles;
    dom.mobileCoins.textContent = state.coins;
    dom.mobileCards.textContent = unique;
    dom.cardCount.textContent = unique;
    dom.albumCount.textContent = `${unique} / ${CARDS.length}`;
    dom.albumProgressCount.textContent = `${unique} / ${CARDS.length}`;
    dom.cardOutCount.textContent = pulls;
    dom.trayCount.textContent = state.marbles;
    dom.statShots.textContent = state.stats.shots;
    dom.statHits.textContent = state.stats.hits;
    dom.statRate.textContent = state.stats.shots ? `${Math.round((state.stats.hits / state.stats.shots) * 100)}%` : "—";
    dom.statBest.textContent = state.stats.best ? `×${state.stats.best}` : "—";
    dom.energyFill.style.width = `${state.cardEnergy}%`;
    dom.energyText.textContent = `${state.cardEnergy}%`;
    dom.insertCoinBtn.classList.toggle("pulse", state.marbles < BET);
    if (dom.sideStreak.textContent !== String(state.streak || 0)) {
      dom.sideStreak.textContent = state.streak || 0;
    }
    renderTray(animate);
    updateSoundButton();
  }

  function updateSoundButton() {
    dom.soundBtn.classList.toggle("muted", sound.muted);
    dom.soundBtn.setAttribute("aria-label", sound.muted ? "打开声音" : "关闭声音");
  }

  function renderTray(animate) {
    const visible = clamp(state.marbles, 0, 28);
    const current = dom.tray.children.length;
    if (visible > current) {
      const add = visible - current;
      for (let i = 0; i < add; i++) {
        const marble = document.createElement("i");
        marble.className = "mini-marble" + (Math.random() < 0.045 ? " gold" : "");
        if (!animate) marble.style.animation = "none";
        dom.tray.appendChild(marble);
      }
    } else if (visible < current) {
      for (let i = current - 1; i >= visible; i--) {
        dom.tray.children[i]?.remove();
      }
    }
    if (dom.tray.children.length > 28) {
      while (dom.tray.children.length > 28) dom.tray.lastElementChild.remove();
    }
    game.trayRendered = visible;
  }

  function setPlungerVisual(power) {
    const p = clamp(power, 0, 1);
    dom.plungerAssembly.style.setProperty("--pull", p.toFixed(3));
    dom.plungerAssembly.setAttribute("aria-valuenow", String(Math.round(p * 100)));
    dom.plungerAssembly.setAttribute("aria-valuetext", `${Math.round(p * 100)}% · ${zoneFromPower(p).label}`);
    dom.plungerAssembly.classList.toggle("charged", p > 0.82);
  }

  function retractPlunger(snap = false, power = 0.7) {
    const assembly = dom.plungerAssembly;
    clearTimeout(game.plungerTimer);
    assembly.classList.remove("dragging", "snap");
    assembly.classList.add("returning");
    setPlungerVisual(0);
    if (snap) {
      void assembly.offsetWidth;
      assembly.classList.add("snap");
      sound.spring(power);
    }
    game.plungerTimer = setTimeout(() => {
      assembly.classList.remove("returning", "snap");
    }, 640);
  }

  function updatePowerUI(power, showGuide) {
    const pct = Math.round(clamp(power, 0, 1) * 100);
    dom.powerFill.style.width = `${pct}%`;
    dom.powerKnob.style.left = `${pct}%`;
    dom.powerPercent.textContent = `${pct}%`;
    const zone = zoneFromPower(power);
    dom.aimZone.style.left = `${zone.index * 33.3333}%`;
    dom.aimZone.classList.toggle("show", Boolean(showGuide));
    setPlungerVisual(power);
    game.lastPowerBucket = pct;
    game.power = power;
  }

  function resetPowerUI() {
    updatePowerUI(0, false);
    dom.aimZone.classList.remove("show");
  }

  function updateMultHUD(value, note) {
    dom.multValue.textContent = value;
    if (note) dom.multNote.textContent = note;
  }

  /* ---------------------------------------------------------
     charging / firing
     --------------------------------------------------------- */
  function canCharge() {
    return game.phase === "ready" && state.marbles >= BET && game.overlays === 0;
  }

  function beginCharge(mode = "hold") {
    sound.init();
    if (game.phase === "needCoin" || game.phase === "boot") {
      dom.bootVeil.classList.remove("hide");
      toast("先投币，机器才会亮灯", "gold");
      return;
    }
    if (!canCharge()) return;
    clearTimeout(game.plungerTimer);
    dom.plungerAssembly.classList.remove("returning", "snap", "dragging");
    game.charge = {
      start: performance.now(),
      active: true,
      power: 0,
      mode,
      startY: 0,
      pointerId: null
    };
    game.round.power = 0;
    dom.roundSplash.classList.remove("show");
    setPhase("charging");
    updatePowerUI(0, true);
    sound.startCharge();
    dom.chargeHint.classList.remove("show");
  }

  function updateCharge(now) {
    if (!game.charge || !game.charge.active || game.charge.mode !== "hold") return;
    const elapsed = now - game.charge.start;
    const power = clamp(elapsed / 1680, 0, 1);
    game.charge.power = power;
    game.round.power = power;
    if (Math.abs(power * 100 - game.lastPowerBucket) >= 1) {
      updatePowerUI(power, true);
      sound.updateCharge(power);
    }
  }

  function cancelCharge(silent = false) {
    if (!game.charge) return;
    game.charge = null;
    sound.stopCharge();
    dom.plungerAssembly.classList.remove("dragging");
    if (game.phase === "charging") {
      setPhase("ready");
      retractPlunger(false);
      updatePowerUI(0, false);
      if (!silent) toast("已取消蓄力", "pink");
    }
  }

  function releaseCharge() {
    if (!game.charge || game.phase !== "charging") return;
    const power = game.charge.power;
    game.charge = null;
    sound.stopCharge();
    dom.plungerAssembly.classList.remove("dragging");
    if (power < 0.035) {
      setPhase("ready");
      retractPlunger(false);
      updatePowerUI(0, false);
      toast("力度太小啦，拉深一点", "pink");
      return;
    }
    fireBall(power);
  }

  function fireBall(power) {
    if (game.overlays > 0) return;
    if (!game.round || game.round.released) return;
    if (game.phase !== "ready" && game.phase !== "charging") return;
    if (state.marbles < BET) {
      showBoot("弹珠不足", "再投 1 枚代币，继续追这一颗。");
      return;
    }
    state.marbles -= BET;
    state.stats.shots += 1;
    state.marbles = Math.max(0, state.marbles);
    game.round.power = power;
    game.round.released = true;
    game.round.fireAt = performance.now();
    const dropX = 505 - power * 412 + rand(-7, 7);
    const targetIndex = railIndexForX(dropX);
    const targetDistance = railDistances[targetIndex];
    game.ball = {
      mode: "rail",
      x: railSamples[0].x,
      y: railSamples[0].y,
      vx: 0,
      vy: 0,
      r: 8.2,
      trail: [],
      railStart: performance.now(),
      railDuration: 520 + power * 330,
      railTargetIndex: targetIndex,
      railTargetDistance: targetDistance,
      dropX,
      fallStart: 0,
      fallElapsed: 0,
      landingStart: 0,
      landingIndex: -1,
      landingFrom: null,
      landingTo: null,
      settleDuration: 270
    };
    setPhase("rail");
    retractPlunger(true, power);
    addRing(528, 590, game.mood, 10, 88, 0.52);
    game.punch = Math.max(game.punch, 0.32);
    dom.aimZone.classList.remove("show");
    dom.powerPercent.textContent = `${Math.round(power * 100)}%`;
    dom.chargeHint.classList.remove("show");
    updateHUD(true);
    save();
    sound.launch(power);
    const zone = zoneFromPower(power);
    toast(`发射 · ${zone.label} · 力度 ${Math.round(power * 100)}%`, power > 0.82 ? "pink" : "green");
    logEvent(`发射 · ${zone.label} · ${Math.round(power * 100)}%`, "lose");
  }

  /* ---------------------------------------------------------
     ball physics
     --------------------------------------------------------- */
  function addRing(x, y, color, startRadius = 12, endRadius = 150, duration = 0.65) {
    game.rings.push({
      x, y, color,
      radius: startRadius,
      endRadius,
      life: duration,
      maxLife: duration
    });
  }

  function spawnBurst(x, y, color, count = 8, strength = 1) {
    for (let i = 0; i < count; i++) {
      const angle = rand(0, Math.PI * 2);
      const speed = rand(25, 125) * strength;
      game.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - rand(0, 35),
        life: rand(0.28, 0.85),
        maxLife: 0.85,
        size: rand(0.7, 2.6),
        color,
        gravity: rand(80, 260),
        shape: Math.random() < 0.2 ? "star" : "dot"
      });
    }
  }

  function railPoint(index) {
    return railSamples[clamp(index, 0, railSamples.length - 1)];
  }

  function updateRail(now) {
    const ball = game.ball;
    if (!ball || ball.mode !== "rail") return;
    const t = clamp((now - ball.railStart) / ball.railDuration, 0, 1);
    const eased = 1 - Math.pow(1 - t, 2.4);
    const distance = ball.railTargetDistance * eased;
    let index = 1;
    while (index < ball.railTargetIndex && railDistances[index] < distance) index++;
    const p = railPoint(index);
    ball.x = p.x;
    ball.y = p.y;
    ball.trail.push({ x: ball.x, y: ball.y, life: 1 });
    if (ball.trail.length > 18) ball.trail.shift();
    if (t >= 1) {
      ball.mode = "fall";
      ball.x = ball.dropX;
      ball.y = 138;
      ball.vx = rand(-25, 25) + (0.5 - game.round.power) * 24;
      ball.vy = 62;
      ball.fallStart = now;
      ball.fallElapsed = 0;
      spawnBurst(ball.x, 130, "#8df7ff", 10, 0.6);
      setPhase("fall");
      sound.tone(1240, 0.08, "sine", 0.025, -240);
    }
  }

  function bounceWall(side) {
    const ball = game.ball;
    if (!ball) return;
    if (side === "left") {
      ball.x = 60 + ball.r;
      ball.vx = Math.abs(ball.vx) * 0.56 + 6;
    } else {
      ball.x = 540 - ball.r;
      ball.vx = -Math.abs(ball.vx) * 0.56 - 6;
    }
    ball.vy *= 0.985;
    if (Math.abs(ball.vx) > 100) spawnBurst(ball.x, ball.y, "#5ea9ff", 3, 0.4);
  }

  function collideCircle(cx, cy, cr, restitution, source) {
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
          spawnBurst(ball.x, ball.y, source.kind === "star" ? "#ffe08a" : "#75dfff", 3 + Math.round(impact * 6), 0.55 + impact);
          sound.peg(impact);
        }
      }
    }
    return true;
  }

  function collideBumper(bumper) {
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
    game.bumperFlash = 1;
    spawnBurst(ball.x, ball.y, bumper.hue, 13, 1.1);
    sound.bumper();
  }

  function beginLanding(index, now) {
    const ball = game.ball;
    if (!ball || ball.mode === "landing") return;
    const safeIndex = clamp(index, 0, EYE_COUNT - 1);
    ball.mode = "landing";
    ball.landingIndex = safeIndex;
    ball.landingStart = now;
    ball.landingFrom = { x: ball.x, y: ball.y };
    ball.landingTo = { x: slotCenter(safeIndex), y: 661 };
    ball.vx = 0;
    ball.vy = 0;
    game.flashSlot = safeIndex;
    game.flashLife = 1;
    game.shake = Math.max(game.shake, 2.2);
    sound.land(game.round.lit.includes(safeIndex));
    spawnBurst(ball.x, SLOT.top + 2, game.round.lit.includes(safeIndex) ? "#ffe078" : "#5473a8", 8, 0.8);
    setPhase("landing");
  }

  function updateLanding(now) {
    const ball = game.ball;
    if (!ball || ball.mode !== "landing") return;
    const t = clamp((now - ball.landingStart) / ball.settleDuration, 0, 1);
    const e = 1 - Math.pow(1 - t, 2.2);
    ball.x = ball.landingFrom.x + (ball.landingTo.x - ball.landingFrom.x) * e;
    ball.y = ball.landingFrom.y + (ball.landingTo.y - ball.landingFrom.y) * e;
    if (t >= 1) resolveLanding(ball.landingIndex);
  }

  function stepFall(dt, now) {
    const ball = game.ball;
    if (!ball || ball.mode !== "fall") return;
    ball.fallElapsed += dt;
    ball.vy += 790 * dt;
    ball.vx *= 0.9993;
    ball.vy = Math.min(ball.vy, 900);
    ball.vx = clamp(ball.vx, -380, 380);
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;

    if (ball.x - ball.r < 60) bounceWall("left");
    if (ball.x + ball.r > 540) bounceWall("right");

    for (let i = 0; i < PEGS.length; i++) {
      collideCircle(PEGS[i].x, PEGS[i].y, PEGS[i].r, 0.48, PEGS[i]);
    }
    for (let i = 0; i < BUMPERS.length; i++) {
      collideBumper(BUMPERS[i]);
    }

    ball.trail.push({ x: ball.x, y: ball.y, life: 1 });
    if (ball.trail.length > 12) ball.trail.shift();

    if (ball.y + ball.r > SLOT.top + 1) {
      const index = Math.floor((ball.x - SLOT.left) / SLOT.width);
      beginLanding(index, now);
      return;
    }
    if (ball.fallElapsed > 9) {
      const index = Math.floor((ball.x - SLOT.left) / SLOT.width);
      beginLanding(index, now);
    }
  }

  function updateBall(now, dt) {
    if (!game.ball) return;
    if (game.ball.mode === "rail") {
      updateRail(now);
      return;
    }
    if (game.ball.mode === "landing") {
      updateLanding(now);
      return;
    }
    if (game.ball.mode === "fall") {
      let remaining = Math.min(dt, 0.05);
      const step = 1 / 180;
      while (remaining > 0) {
        const slice = Math.min(step, remaining);
        stepFall(slice, now);
        remaining -= slice;
        if (!game.ball || game.ball.mode !== "fall") break;
      }
    }
  }

  /* ---------------------------------------------------------
     landing result / economy
     --------------------------------------------------------- */
  function resolveLanding(index) {
    if (!game.round || game.round.resolved) return;
    game.round.resolved = true;
    const hit = game.round.lit.includes(index);
    const multiplier = game.round.multiplier;
    const config = MULT_BY_VALUE[multiplier];
    const win = hit ? BET * multiplier : 0;
    let pulled = null;
    setMood(config.color, multiplier >= 8);
    dom.resultToast.style.setProperty("--hit-color", hit ? config.color : "#ff7088");

    if (hit) {
      state.marbles += win;
      state.stats.hits += 1;
      state.stats.best = Math.max(state.stats.best || 0, multiplier);
      state.streak = (state.streak || 0) + 1;
      state.cardEnergy = clamp(state.cardEnergy + 18 + multiplier * 2, 0, 100);
      if (config.jackpot) state.stats.jackpots = (state.stats.jackpots || 0) + 1;
    } else {
      state.marbles += 1;
      state.streak = 0;
      state.cardEnergy = clamp(state.cardEnergy + 6, 0, 100);
    }

    const energyFull = state.cardEnergy >= 100;
    const jackpotCard = hit && multiplier === 20;
    if (energyFull || jackpotCard) {
      pulled = pullCard();
    }

    dom.resultToast.classList.remove("show", "miss", "jackpot");
    dom.resultKicker.textContent = hit ? (config.jackpot ? "20× JACKPOT" : "LIGHT HIT") : "MISS";
    dom.resultMain.textContent = hit ? `×${multiplier} 命中` : "差一点";
    if (hit) {
      dom.resultSub.textContent = `赢得 ${win} 颗弹珠${pulled ? " · 星卡吐出" : ""}`;
      dom.resultToast.classList.add("show");
      if (config.jackpot) {
        dom.resultToast.classList.add("jackpot");
        sound.jackpot();
        game.shake = Math.max(game.shake, 10);
        game.punch = Math.max(game.punch, 1.8);
        flashCabinet("#ffe27a");
        addRing(slotCenter(index), 655, "#ffe27a", 12, 230, 0.9);
        addRing(slotCenter(index), 655, "#ff76be", 8, 150, 0.7);
        spawnBurst(slotCenter(index), 650, "#ffe27a", 42, 1.8);
      } else {
        sound.win(multiplier);
        game.shake = Math.max(game.shake, 4);
        game.punch = Math.max(game.punch, 0.55 + multiplier * 0.035);
        addRing(slotCenter(index), 655, config.color, 10, 120 + multiplier * 3, 0.72);
        spawnBurst(slotCenter(index), 650, config.color, 18, 1.1);
        if (multiplier >= 8) flashCabinet(config.color);
      }
    } else {
      dom.resultSub.textContent = pulled
        ? "返还 1 颗安慰珠 · 星卡吐出"
        : "返还 1 颗安慰珠 · 下颗更准";
      dom.resultToast.classList.add("show", "miss");
      addRing(slotCenter(index), 655, "#5f82c4", 8, 64, 0.55);
      sound.lose();
    }

    if (pulled) {
      dom.resultSub.textContent += pulled.isNew ? " · NEW!" : " · 重复转珠";
    }
    setPhase("result");
    updateHUD(true);
    save();

    if (hit) {
      logEvent(
        config.jackpot
          ? `JACKPOT ×20 · +${win} 珠`
          : `命中 ×${multiplier} · +${win} 珠`,
        "win"
      );
      if (state.streak >= 3) {
        logEvent(`${state.streak} 连击 · 手感正热`, "win");
      }
    } else {
      logEvent(`未中灯道 · 返还 1 珠`, "lose");
    }

    if (pulled) {
      game.pendingNext = true;
      toast(
        config.jackpot ? "JACKPOT · 必出星卡" : "出卡能量满格 · 星卡吐出",
        "gold"
      );
      scheduleCardReveal(pulled, 900);
    } else {
      scheduleNextRound(2500);
    }
  }

  function scheduleCardReveal(pulled, delay = 900) {
    clearTimeout(game.cardTimer);
    game.cardTimer = setTimeout(() => {
      if (anyOverlayOpen()) {
        scheduleCardReveal(pulled, 450);
        return;
      }
      showCardReveal(pulled);
    }, delay);
  }

  function scheduleNextRound(delay = 2400) {
    clearTimeout(game.nextTimer);
    const id = game.roundId;
    game.nextTimer = setTimeout(() => {
      if (id !== game.roundId) return;
      if (game.overlays > 0) {
        game.pendingNext = true;
        return;
      }
      if (state.marbles >= BET) startRound();
      else showBoot("弹珠不足", "弹珠用完啦。投币续上，下一颗就是你的。");
    }, delay);
  }

  function resumePendingNext() {
    if (!game.pendingNext || game.overlays > 0) return;
    if (game.phase === "result" || game.phase === "needCoin" || game.phase === "boot") {
      game.pendingNext = false;
      setTimeout(() => {
        if (game.overlays > 0) {
          game.pendingNext = true;
          return;
        }
        if (state.marbles >= BET) startRound();
        else showBoot("弹珠不足", "弹珠用完啦。投币续上，下一颗就是你的。");
      }, 380);
    }
  }

  /* ---------------------------------------------------------
     card pull
     --------------------------------------------------------- */
  function pullRarity() {
    return weightedPick(Object.entries(RARITIES).map(([key, value]) => ({
      value: key,
      weight: value.weight
    }))).value;
  }

  function pullCard() {
    const rarity = pullRarity();
    const pool = CARDS.filter((card) => card.rarity === rarity);
    const unowned = pool.filter((card) => !state.cards[card.id]);
    let card;
    if (unowned.length && Math.random() < 0.72) {
      card = choice(unowned);
    } else {
      card = choice(pool);
    }
    const beforeUnique = ownedCardCount();
    const isNew = !state.cards[card.id];
    state.cards[card.id] = (state.cards[card.id] || 0) + 1;
    state.stats.pulls = (state.stats.pulls || 0) + 1;
    state.cardEnergy = 0;
    let refund = 0;
    let completion = false;
    if (isNew) {
      state.newCards = Array.from(new Set([...state.newCards, card.id]));
      state.coins += 1;
      if (ownedCardCount() === CARDS.length && beforeUnique < CARDS.length) {
        state.coins += 10;
        completion = true;
      }
    } else {
      refund = RARITIES[card.rarity].refund;
      state.marbles += refund;
    }
    save();
    return { card, isNew, refund, completion, beforeUnique };
  }

  function showCardReveal(pulled) {
    if (!pulled) return;
    const { card, isNew, refund, completion } = pulled;
    dom.cardRevealPanel.style.setProperty("--card-color", card.c1);
    dom.cardRevealPanel.classList.remove("rarity-N", "rarity-R", "rarity-SR", "rarity-SSR");
    dom.cardRevealPanel.classList.add(`rarity-${card.rarity}`);
    dom.revealCardMount.innerHTML = cardMarkup(card, { animate: true });
    dom.revealKicker.className = "reveal-kicker" + (isNew ? "" : " duplicate");
    dom.revealKicker.textContent = isNew
      ? `NEW ${card.rarity} · NO.${card.no}`
      : `DUPLICATE · NO.${card.no}`;
    dom.revealTitle.textContent = card.name;
    let description;
    if (isNew) {
      description = `${card.line}　新卡入库，奖励 1 枚代币。`;
      if (completion) description += " 图鉴集齐，额外奖励 10 枚代币！";
    } else {
      description = `这张「${card.name}」已经有了，机器自动折算为 ${refund} 颗弹珠。`;
    }
    dom.revealDesc.textContent = description;
    dom.revealCloseBtn.innerHTML = isNew ? "收下星卡 <span>✦</span>" : `收下 ${refund} 颗弹珠 <span>◉</span>`;
    dom.cardDispenser.classList.add("ejecting");
    setTimeout(() => dom.cardDispenser.classList.remove("ejecting"), 1800);
    openOverlay("cardModal");
    game.pendingNext = true;
    sound.card(card.rarity);
    if (card.rarity === "SSR" || card.rarity === "SR") {
      launchConfetti(card.rarity === "SSR" ? 90 : 52, card.rarity);
    } else if (isNew) {
      launchConfetti(24, card.rarity);
    }
    logEvent(
      isNew ? `NEW ${card.rarity} · ${card.name}` : `重复 ${card.rarity} · ${card.name} +${refund} 珠`,
      "card"
    );
    updateHUD();
  }

  /* ---------------------------------------------------------
     canvas rendering
     --------------------------------------------------------- */
  function roundRectPath(context, x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    context.beginPath();
    context.moveTo(x + radius, y);
    context.arcTo(x + w, y, x + w, y + h, radius);
    context.arcTo(x + w, y + h, x, y + h, radius);
    context.arcTo(x, y + h, x, y, radius);
    context.arcTo(x, y, x + w, y, radius);
    context.closePath();
  }

  function drawBackground(now) {
    const t = now / 1000;
    const mood = game.mood || "#58e9ff";
    const bg = ctx.createLinearGradient(0, 0, 0, VH);
    bg.addColorStop(0, "#0a1330");
    bg.addColorStop(0.28, "#071126");
    bg.addColorStop(0.72, "#080d1e");
    bg.addColorStop(1, "#04070f");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, VW, VH);

    const upperGlow = ctx.createRadialGradient(300, 182, 10, 300, 270, 380);
    upperGlow.addColorStop(0, hexA(mood, 0.21));
    upperGlow.addColorStop(0.45, hexA(mood, 0.065));
    upperGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = upperGlow;
    ctx.fillRect(0, 0, VW, 600);

    const lowerGlow = ctx.createRadialGradient(300, 636, 20, 300, 660, 300);
    lowerGlow.addColorStop(0, hexA(mood, 0.1));
    lowerGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = lowerGlow;
    ctx.fillRect(0, 430, VW, 290);

    ctx.save();
    ctx.strokeStyle = "rgba(102, 142, 225, .065)";
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

    ORBITS.forEach((orbit, i) => {
      ctx.save();
      ctx.translate(orbit.x, orbit.y);
      ctx.rotate(orbit.rot + Math.sin(t * 0.08 + i) * 0.01);
      ctx.strokeStyle = hexA(mood, orbit.alpha * 0.72);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(0, 0, orbit.r, orbit.r * 0.42, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([3, 9]);
      ctx.strokeStyle = `rgba(255, 115, 187, ${orbit.alpha * 0.7})`;
      ctx.beginPath();
      ctx.ellipse(0, 0, orbit.r * 0.74, orbit.r * 0.28, 0.55, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });

    const scanY = 96 + ((now * 0.038) % 520);
    const scanBand = ctx.createLinearGradient(0, scanY - 34, 0, scanY + 34);
    scanBand.addColorStop(0, hexA(mood, 0));
    scanBand.addColorStop(0.48, hexA(mood, 0.045));
    scanBand.addColorStop(0.52, hexA("#ffffff", 0.018));
    scanBand.addColorStop(1, hexA(mood, 0));
    ctx.fillStyle = scanBand;
    ctx.fillRect(58, scanY - 34, 484, 68);

    ctx.font = "900 112px Bahnschrift, Arial Black, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(127, 169, 255, .026)";
    ctx.fillText("GALAXY", 300, 404);
    ctx.font = "600 9px Consolas, monospace";
    ctx.fillStyle = "rgba(146, 188, 255, .17)";
    ctx.fillText("GALAXY MARBLE CLUB · GX-12", 300, 604);

    STARS.forEach((star) => {
      const alpha = star.a * (0.5 + 0.5 * Math.sin(t * star.speed + star.phase));
      ctx.fillStyle = `rgba(204, 237, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();

    const sideShade = ctx.createLinearGradient(0, 0, VW, 0);
    sideShade.addColorStop(0, "rgba(0, 4, 11, .65)");
    sideShade.addColorStop(0.075, "rgba(0, 4, 11, 0)");
    sideShade.addColorStop(0.925, "rgba(0, 4, 11, 0)");
    sideShade.addColorStop(1, "rgba(0, 4, 11, .65)");
    ctx.fillStyle = sideShade;
    ctx.fillRect(0, 0, VW, VH);
  }

  function drawRailTrack(now) {
    ctx.save();
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    railSamples.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.strokeStyle = "rgba(2, 5, 14, .9)";
    ctx.lineWidth = 19;
    ctx.stroke();
    ctx.strokeStyle = "rgba(43, 64, 116, .92)";
    ctx.lineWidth = 14;
    ctx.stroke();
    ctx.strokeStyle = "rgba(6, 12, 28, .98)";
    ctx.lineWidth = 9;
    ctx.stroke();
    ctx.strokeStyle = "rgba(82, 224, 255, .2)";
    ctx.lineWidth = 1;
    ctx.stroke();

    const pulse = 0.5 + 0.5 * Math.sin(now / 640);
    ctx.setLineDash([3, 16]);
    ctx.lineDashOffset = -(now / 100) % 19;
    ctx.strokeStyle = `rgba(89, 231, 255, ${0.15 + pulse * 0.1})`;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]);

    for (let i = 3; i < railSamples.length - 5; i += 10) {
      const p = railSamples[i];
      ctx.fillStyle = "rgba(170, 222, 255, .34)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawPegs(now) {
    const pulseTime = now / 1000;
    PEGS.forEach((peg) => {
      const pulse = peg.pulse || 0;
      const radius = peg.r + pulse * 1.2;
      if (peg.kind === "divider") {
        ctx.save();
        ctx.translate(peg.x, peg.y);
        ctx.rotate(Math.PI / 4);
        ctx.fillStyle = "rgba(74, 104, 160, .75)";
        ctx.fillRect(-2.2, -2.2, 4.4, 4.4);
        ctx.restore();
        return;
      }
      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, .5)";
      ctx.shadowBlur = 6;
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
        ctx.strokeStyle = `rgba(255, 223, 130, ${0.32 + 0.2 * Math.sin(pulseTime * 2.3 + peg.x)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(peg.x, peg.y, radius + 4, 0, Math.PI * 2);
        ctx.stroke();
      }
      if (pulse > 0.08) {
        ctx.strokeStyle = `rgba(137, 231, 255, ${pulse * 0.45})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(peg.x, peg.y, radius + (1 - pulse) * 10, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    });

    BUMPERS.forEach((bumper, index) => {
      const pulse = bumper.pulse || 0;
      const breathe = 1 + Math.sin(pulseTime * 2.1 + index) * 0.035;
      ctx.save();
      const glow = ctx.createRadialGradient(bumper.x, bumper.y, bumper.r * 0.3, bumper.x, bumper.y, bumper.r * 2.6);
      glow.addColorStop(0, `${bumper.hue}55`);
      glow.addColorStop(0.45, `${bumper.hue}16`);
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(bumper.x, bumper.y, bumper.r * 2.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.translate(bumper.x, bumper.y);
      ctx.rotate(pulseTime * 0.2 * (index % 2 ? -1 : 1));
      ctx.strokeStyle = `${bumper.hue}${pulse > 0.2 ? "aa" : "55"}`;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 5]);
      ctx.beginPath();
      ctx.arc(0, 0, bumper.r + 7 + pulse * 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.rotate(-pulseTime * 0.2 * (index % 2 ? -1 : 1));

      const bg = ctx.createRadialGradient(-bumper.r * 0.3, -bumper.r * 0.35, 1, 0, 0, bumper.r * breathe);
      bg.addColorStop(0, "#ffffff");
      bg.addColorStop(0.18, bumper.hue);
      bg.addColorStop(0.55, "#14365a");
      bg.addColorStop(1, "#07101f");
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.arc(0, 0, bumper.r * breathe, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,.45)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,.8)";
      ctx.beginPath();
      ctx.arc(-bumper.r * 0.24, -bumper.r * 0.28, bumper.r * 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  function drawSlots(now) {
    const lit = currentLit();
    const multiplier = currentMultiplier();
    const config = MULT_BY_VALUE[multiplier];
    const color = config ? config.color : "#53dfff";
    const pulse = 0.5 + 0.5 * Math.sin(now / 330);

    ctx.save();
    roundRectPath(ctx, SLOT.left - 4, SLOT.top - 7, SLOT.right - SLOT.left + 8, SLOT.bottom - SLOT.top + 12, 8);
    const plate = ctx.createLinearGradient(0, SLOT.top - 7, 0, SLOT.bottom + 5);
    plate.addColorStop(0, "#0b1428");
    plate.addColorStop(1, "#02050d");
    ctx.fillStyle = plate;
    ctx.fill();
    ctx.strokeStyle = "rgba(100, 157, 228, .25)";
    ctx.lineWidth = 1;
    ctx.stroke();

    for (let i = 0; i < EYE_COUNT; i++) {
      const x = SLOT.left + i * SLOT.width;
      const cx = x + SLOT.width / 2;
      const isLit = lit.includes(i);
      const idle = game.phase === "boot" || game.phase === "needCoin";
      const chase = idle && (Math.floor(now / 360) % EYE_COUNT === i);
      const bright = isLit || chase;

      ctx.save();
      roundRectPath(ctx, x + 2.4, SLOT.top, SLOT.width - 4.8, SLOT.bottom - SLOT.top, 5);
      const bg = ctx.createLinearGradient(0, SLOT.top, 0, SLOT.bottom);
      if (bright) {
        bg.addColorStop(0, `${color}${isLit ? "6b" : "22"}`);
        bg.addColorStop(0.45, `${color}${isLit ? "30" : "10"}`);
        bg.addColorStop(1, "rgba(4, 9, 20, .98)");
      } else {
        bg.addColorStop(0, "#091326");
        bg.addColorStop(1, "#040913");
      }
      ctx.fillStyle = bg;
      ctx.fill();

      if (bright) {
        ctx.shadowColor = color;
        ctx.shadowBlur = isLit ? 13 : 6;
        ctx.strokeStyle = `${color}${isLit ? "aa" : "40"}`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.shadowBlur = 0;

        const sensor = ctx.createRadialGradient(cx, SLOT.top + 9, 0, cx, SLOT.top + 9, 8);
        sensor.addColorStop(0, "#ffffff");
        sensor.addColorStop(0.28, color);
        sensor.addColorStop(1, `${color}00`);
        ctx.fillStyle = sensor;
        ctx.beginPath();
        ctx.arc(cx, SLOT.top + 9, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = `${color}${Math.round((0.25 + pulse * 0.25) * 255).toString(16).padStart(2, "0")}`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx, SLOT.top + 19);
        ctx.lineTo(cx, SLOT.bottom - 17);
        ctx.stroke();

        ctx.font = "800 10px Bahnschrift, Arial Black, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = isLit ? "#ffffff" : `${color}88`;
        ctx.fillText(`×${multiplier}`, cx, SLOT.bottom - 13);
      } else {
        ctx.strokeStyle = "rgba(107, 147, 209, .12)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = "rgba(111, 143, 197, .2)";
        ctx.beginPath();
        ctx.arc(cx, SLOT.top + 9, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.font = "500 5px Consolas, monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = isLit ? "rgba(255,255,255,.45)" : "rgba(99, 127, 177, .28)";
      ctx.fillText(String(i + 1).padStart(2, "0"), cx, SLOT.bottom - 3);
      ctx.restore();

      if (i > 0) {
        ctx.strokeStyle = "rgba(101, 145, 208, .18)";
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
      g.addColorStop(0, `rgba(255,255,255,${game.flashLife * 0.5})`);
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      roundRectPath(ctx, x + 2.4, SLOT.top, SLOT.width - 4.8, SLOT.bottom - SLOT.top, 5);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawAimGuide(now) {
    if (game.phase !== "charging" || !game.round) return;
    const power = game.round.power || 0;
    const zone = zoneFromPower(power);
    const x = SLOT.left + zone.start * SLOT.width;
    const w = SLOT.width * 4;
    const pulse = 0.5 + 0.5 * Math.sin(now / 150);
    const guideColor = game.mood || "#58e9ff";
    ctx.save();
    ctx.setLineDash([5, 5]);
    ctx.lineDashOffset = -(now / 55) % 10;
    ctx.strokeStyle = hexA(guideColor, 0.5 + pulse * 0.3);
    ctx.lineWidth = 1.5;
    ctx.shadowColor = guideColor;
    ctx.shadowBlur = 8;
    roundRectPath(ctx, x + 1, SLOT.top - 12, w - 2, SLOT.bottom - SLOT.top + 7, 8);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.shadowBlur = 0;
    const g = ctx.createLinearGradient(0, SLOT.top - 12, 0, SLOT.bottom);
    g.addColorStop(0, hexA(guideColor, 0.1));
    g.addColorStop(1, hexA(guideColor, 0.015));
    ctx.fillStyle = g;
    roundRectPath(ctx, x + 1, SLOT.top - 12, w - 2, SLOT.bottom - SLOT.top + 7, 8);
    ctx.fill();

    ctx.font = "600 6px Consolas, monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = hexA(guideColor, 0.9);
    ctx.fillText(`预测落点 · ${zone.label}`, x + w / 2, SLOT.top - 19);
    for (let i = 0; i < 4; i++) {
      const cx = SLOT.left + (zone.start + i + 0.5) * SLOT.width;
      ctx.fillStyle = hexA(guideColor, 0.34 + pulse * 0.22);
      ctx.beginPath();
      ctx.moveTo(cx - 3, SLOT.top - 7);
      ctx.lineTo(cx + 3, SLOT.top - 7);
      ctx.lineTo(cx, SLOT.top - 2);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  function drawChromeBall(x, y, r, glowColor, alpha = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;
    if (glowColor) {
      const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 3.2);
      glow.addColorStop(0, `${glowColor}66`);
      glow.addColorStop(0.5, `${glowColor}18`);
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, r * 3.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowColor = "rgba(0, 0, 0, .6)";
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
    ctx.strokeStyle = "rgba(220, 248, 255, .58)";
    ctx.lineWidth = 0.7;
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.86)";
    ctx.beginPath();
    ctx.ellipse(x - r * 0.34, y - r * 0.38, r * 0.18, r * 0.1, -0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawBall(now) {
    const ball = game.ball;
    if (!ball) {
      if (game.phase === "ready" || game.phase === "charging" || game.phase === "spinning") {
        const power = game.phase === "charging" ? game.round.power : 0;
        drawChromeBall(528, 590 + power * 9, 8.2, "#67e7ff", 0.94);
      }
      return;
    }
    ctx.save();
    ball.trail.forEach((p, i) => {
      const alpha = (i / ball.trail.length) * 0.16;
      ctx.fillStyle = `rgba(126, 230, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, ball.r * (0.28 + i / ball.trail.length * 0.6), 0, Math.PI * 2);
      ctx.fill();
    });
    const activeColor = ball.mode === "rail" ? "#7defff" : ball.mode === "landing" ? "#ffe27a" : "#8edcff";
    drawChromeBall(ball.x, ball.y, ball.r, activeColor, 1);
    ctx.restore();
  }

  function drawParticles() {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    game.particles.forEach((p) => {
      const alpha = clamp(p.life / p.maxLife, 0, 1);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      if (p.shape === "star") {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(alpha * 3);
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          const angle = i * Math.PI / 2;
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
    });
    ctx.restore();
  }

  function drawRings() {
    if (!game.rings.length) return;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    game.rings.forEach((ring) => {
      const progress = 1 - ring.life / ring.maxLife;
      const radius = ring.radius + (ring.endRadius - ring.radius) * (1 - Math.pow(1 - progress, 2));
      const alpha = (1 - progress) * 0.72;
      ctx.strokeStyle = hexA(ring.color, alpha);
      ctx.lineWidth = 2.4 * (1 - progress) + 0.3;
      ctx.shadowColor = ring.color;
      ctx.shadowBlur = 12 * (1 - progress);
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, radius, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.restore();
  }

  function drawGlassDetails(now) {
    ctx.save();
    const topHighlight = ctx.createLinearGradient(0, 62, 0, 165);
    topHighlight.addColorStop(0, "rgba(213, 245, 255, .09)");
    topHighlight.addColorStop(1, "rgba(213, 245, 255, 0)");
    ctx.fillStyle = topHighlight;
    ctx.fillRect(54, 62, 492, 103);

    ctx.strokeStyle = "rgba(182, 229, 255, .15)";
    ctx.lineWidth = 1;
    roundRectPath(ctx, 48, 68, 504, 638, 18);
    ctx.stroke();

    ctx.strokeStyle = "rgba(255, 255, 255, .06)";
    roundRectPath(ctx, 53, 73, 494, 628, 14);
    ctx.stroke();

    const screws = [[64, 80], [536, 80], [64, 690], [536, 690]];
    screws.forEach(([x, y]) => {
      const g = ctx.createRadialGradient(x - 1, y - 1, 0, x, y, 4);
      g.addColorStop(0, "#9cb1cc");
      g.addColorStop(1, "#22304a");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, 3.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(3, 6, 13, .8)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - 1.8, y);
      ctx.lineTo(x + 1.8, y);
      ctx.stroke();
    });

    const scan = 0.02 + 0.015 * Math.sin(now / 1100);
    const sheen = ctx.createLinearGradient(0, 0, VW, VH);
    sheen.addColorStop(0, `rgba(201, 240, 255, ${scan})`);
    sheen.addColorStop(0.32, "rgba(255,255,255,0)");
    sheen.addColorStop(0.62, "rgba(255, 104, 190, .012)");
    sheen.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = sheen;
    ctx.fillRect(0, 0, VW, VH);

    const edgeGlow = ctx.createLinearGradient(0, 0, VW, 0);
    edgeGlow.addColorStop(0, hexA(game.mood, 0.12));
    edgeGlow.addColorStop(0.05, "rgba(0,0,0,0)");
    edgeGlow.addColorStop(0.95, "rgba(0,0,0,0)");
    edgeGlow.addColorStop(1, hexA(game.mood, 0.12));
    ctx.fillStyle = edgeGlow;
    ctx.fillRect(0, 0, VW, VH);

    const vignette = ctx.createRadialGradient(300, 350, 160, 300, 360, 470);
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, "rgba(0,2,8,.42)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, VW, VH);
    ctx.restore();
  }

  function draw(now) {
    ctx.setTransform(viewScaleX, 0, 0, viewScaleY, 0, 0);
    ctx.clearRect(0, 0, VW, VH);
    ctx.save();
    const punchScale = 1 + (game.punch || 0) * 0.013;
    if (punchScale !== 1) {
      ctx.translate(300, 360);
      ctx.scale(punchScale, punchScale);
      ctx.translate(-300, -360);
    }
    if (game.shake > 0.2) {
      ctx.translate(rand(-game.shake, game.shake), rand(-game.shake, game.shake));
    }
    drawBackground(now);
    drawRailTrack(now);
    drawPegs(now);
    drawSlots(now);
    drawAimGuide(now);
    drawBall(now);
    drawRings();
    drawParticles();
    drawGlassDetails(now);
    ctx.restore();
  }

  /* ---------------------------------------------------------
     frame update
     --------------------------------------------------------- */
  function updateParticles(dt) {
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
    for (let i = game.rings.length - 1; i >= 0; i--) {
      game.rings[i].life -= dt;
      if (game.rings[i].life <= 0) game.rings.splice(i, 1);
    }
    if (game.particles.length > 260) {
      game.particles.splice(0, game.particles.length - 260);
    }
    if (game.rings.length > 14) game.rings.splice(0, game.rings.length - 14);
  }

  function update(now, dt) {
    if (game.spin && !game.spin.finalized) {
      const elapsed = now - game.spin.start;
      if (elapsed >= 1050) {
        finalizeSpin();
      } else if (now - game.spin.lastFlick > 72) {
        game.spin.lastFlick = now;
        const flick = weightedPick(MULT_TABLE);
        game.spin.displayMult = flick.value;
        game.spin.displayLit = chooseLit(flick.lit);
        dom.multValue.textContent = flick.value;
        dom.sideMult.textContent = `×${flick.value}`;
        dom.sideLit.textContent = `${flick.lit} / 12`;
        sound.tick();
      }
    }
    if (game.phase === "charging") updateCharge(now);
    updateBall(now, dt);

    updateParticles(dt);
    game.shake *= Math.pow(0.002, dt);
    if (game.shake < 0.15) game.shake = 0;
    game.punch *= Math.pow(0.006, dt);
    if (game.punch < 0.02) game.punch = 0;
    game.flashLife = Math.max(0, game.flashLife - dt * 1.8);
    if (game.flashLife <= 0) game.flashSlot = -1;
    game.bumperFlash = Math.max(0, game.bumperFlash - dt * 2.5);
    PEGS.forEach((peg) => { peg.pulse = Math.max(0, (peg.pulse || 0) - dt * 2.6); });
    BUMPERS.forEach((bumper) => { bumper.pulse = Math.max(0, (bumper.pulse || 0) - dt * 1.8); });
    game.ball?.trail.forEach((p) => { p.life -= dt * 1.6; });
  }

  function frame(now) {
    const dt = game.lastTime ? Math.min((now - game.lastTime) / 1000, 0.05) : 0.016;
    game.lastTime = now;
    update(now, dt);
    draw(now);
    requestAnimationFrame(frame);
  }

  /* ---------------------------------------------------------
     card markup / collection
     --------------------------------------------------------- */
  function cardMarkup(card, options = {}) {
    const rarity = RARITIES[card.rarity];
    const mini = Boolean(options.mini);
    const animate = Boolean(options.animate);
    const locked = Boolean(options.locked);
    const glyph = locked ? "？" : card.glyph;
    const name = locked ? "？？？" : card.name;
    const en = locked ? "UNKNOWN SIGNAL" : card.en;
    const stars = "✦".repeat(rarity.stars) + "✧".repeat(4 - rarity.stars);
    const dots = Array.from({ length: 9 }, (_, i) => {
      const x = (i * 41 + Number(card.no) * 17) % 88 + 6;
      const y = (i * 67 + Number(card.no) * 11) % 82 + 8;
      const size = 1 + (i % 3) * 0.6;
      return `<i style="left:${x}%;top:${y}%;width:${size}px;height:${size}px"></i>`;
    }).join("");
    return `
      <div class="game-card ${mini ? "mini" : ""} ${animate ? "animate" : ""} ${locked ? "locked" : ""} ${card.rarity === "SSR" ? "card-rainbow" : ""}"
        style="--c1:${card.c1};--c2:${card.c2};--c3:${card.c3}" data-card-id="${card.id}">
        <div class="card-inner">
          <div class="card-topline"><span>NO.${card.no} / 016</span><span class="card-rarity">${card.rarity}</span></div>
          <div class="card-art">
            <div class="card-orbit"></div>
            <div class="card-orbit two"></div>
            <div class="card-starfield">${dots}</div>
            <span class="card-sigil">${glyph}</span>
          </div>
          <div class="card-identity">
            <h3>${name}</h3>
            <p>${en}</p>
          </div>
          <div class="card-footer-line"><span>GALAXY MARBLE CLUB</span><span class="card-stars">${stars}</span></div>
        </div>
        <span class="card-shine"></span>
        <i class="card-corner tl"></i><i class="card-corner tr"></i>
        <i class="card-corner bl"></i><i class="card-corner br"></i>
      </div>`;
  }

  function miniCardMarkup(card) {
    const owned = Boolean(state.cards[card.id]);
    const isNew = state.newCards.includes(card.id);
    if (!owned) {
      return `<div class="mini-card locked" aria-label="未收集"></div>`;
    }
    return `<div class="mini-card ${isNew ? "new" : ""}" style="--c1:${card.c1};--c2:${card.c2};--c3:${card.c3}" title="${card.name} · ${card.rarity}">
      <span class="mini-rarity">${card.rarity}</span>
      <span class="mini-glyph">${card.glyph}</span>
    </div>`;
  }

  function renderMiniGrid() {
    dom.miniGrid.innerHTML = CARDS.map(miniCardMarkup).join("");
  }

  function renderAlbum() {
    const unique = ownedCardCount();
    dom.albumProgressCount.textContent = `${unique} / ${CARDS.length}`;
    dom.albumGrid.innerHTML = CARDS.map((card) => {
      const owned = Boolean(state.cards[card.id]);
      return `<div class="album-slot ${owned ? "" : "locked"}">
        ${cardMarkup(card, { mini: true, locked: !owned })}
        <div class="slot-meta">
          <strong>${owned ? card.name : "未收集"}</strong>
          <span>${owned ? card.en : `NO.${card.no} · ${card.rarity}`}</span>
        </div>
      </div>`;
    }).join("");
  }

  function renderCollection() {
    renderMiniGrid();
    renderAlbum();
  }

  /* ---------------------------------------------------------
     overlays
     --------------------------------------------------------- */
  const overlayIds = ["cardModal", "albumModal", "helpModal"];

  function anyOverlayOpen() {
    return overlayIds.some((id) => {
      const el = document.getElementById(id);
      return el && el.classList.contains("open");
    });
  }

  function syncOverlayCount() {
    game.overlays = overlayIds.filter((id) => document.getElementById(id)?.classList.contains("open")).length;
    document.body.classList.toggle("modal-open", game.overlays > 0);
    if (game.overlays > 0) cancelCharge(true);
  }

  function openOverlay(id) {
    const el = document.getElementById(id);
    if (!el) return;
    overlayIds.forEach((other) => {
      if (other !== id) {
        const otherEl = document.getElementById(other);
        if (otherEl) {
          otherEl.classList.remove("open");
          otherEl.setAttribute("aria-hidden", "true");
        }
      }
    });
    el.classList.add("open");
    el.setAttribute("aria-hidden", "false");
    syncOverlayCount();
    const focusable = el.querySelector("button, [href], input, [tabindex]:not([tabindex='-1'])");
    setTimeout(() => focusable?.focus({ preventScroll: true }), 80);
  }

  function closeOverlay(id) {
    const el = document.getElementById(id);
    if (!el || !el.classList.contains("open")) return;
    el.classList.remove("open");
    el.setAttribute("aria-hidden", "true");
    syncOverlayCount();
    if (game.overlays === 0) {
      setTimeout(() => resumePendingNext(), 180);
    }
  }

  function openAlbum() {
    renderAlbum();
    openOverlay("albumModal");
    if (state.newCards.length) {
      setTimeout(() => {
        state.newCards = [];
        renderMiniGrid();
        save();
      }, 900);
    }
    sound.tick();
  }

  function openHelp() {
    openOverlay("helpModal");
    state.seenHelp = true;
    save();
  }

  function closeCardReveal() {
    closeOverlay("cardModal");
    game.pendingNext = true;
    updateHUD();
  }

  function launchConfetti(count = 40, rarity = "R") {
    if (!dom.confettiLayer) return;
    const palettes = {
      N: ["#b8c8ef", "#7f93c4", "#ffffff"],
      R: ["#58e9ff", "#8c7bff", "#bff7ff", "#ffffff"],
      SR: ["#bd8bff", "#ff77ca", "#68ecff", "#ffe39a"],
      SSR: ["#ffd166", "#ff8a5c", "#fff3b0", "#ff73b9", "#76f7ff"]
    };
    const colors = palettes[rarity] || palettes.R;
    dom.confettiLayer.innerHTML = "";
    const total = Math.min(count, 100);
    for (let i = 0; i < total; i++) {
      const piece = document.createElement("i");
      piece.style.left = `${rand(3, 97)}%`;
      piece.style.background = choice(colors);
      piece.style.setProperty("--dur", `${rand(1.8, 3.4)}s`);
      piece.style.setProperty("--delay", `${rand(0, 0.55)}s`);
      piece.style.setProperty("--drift", `${rand(-150, 150)}px`);
      piece.style.setProperty("--spin", `${rand(-900, 900)}deg`);
      piece.style.width = `${rand(3, 7)}px`;
      piece.style.height = `${rand(7, 15)}px`;
      if (i % 7 === 0) piece.style.borderRadius = "50%";
      dom.confettiLayer.appendChild(piece);
    }
    setTimeout(() => {
      if (dom.confettiLayer) dom.confettiLayer.innerHTML = "";
    }, 4200);
  }

  /* ---------------------------------------------------------
     toast / log
     --------------------------------------------------------- */
  function toast(message, tone = "") {
    if (!dom.toastStack) return;
    const el = document.createElement("div");
    el.className = "toast" + (tone ? ` ${tone}` : "");
    el.innerHTML = `<i></i><span></span>`;
    el.querySelector("span").textContent = message;
    dom.toastStack.appendChild(el);
    while (dom.toastStack.children.length > 3) dom.toastStack.firstElementChild.remove();
    setTimeout(() => {
      el.classList.add("out");
      setTimeout(() => el.remove(), 320);
    }, 3300);
  }

  function logEvent(text, tone = "") {
    const li = document.createElement("li");
    if (tone) li.className = tone;
    const label = document.createElement("span");
    label.textContent = text;
    const time = document.createElement("b");
    time.textContent = timeLabel();
    li.append(label, time);
    dom.eventLog.prepend(li);
    while (dom.eventLog.children.length > 6) dom.eventLog.lastElementChild.remove();
  }

  /* ---------------------------------------------------------
     ambient stars
     --------------------------------------------------------- */
  function buildStarfield() {
    const layer = $("#starfield");
    if (!layer) return;
    const count = window.innerWidth < 700 ? 45 : 82;
    for (let i = 0; i < count; i++) {
      const star = document.createElement("i");
      star.className = "star";
      star.style.left = `${rand(0, 100)}%`;
      star.style.top = `${rand(0, 74)}%`;
      star.style.setProperty("--s", `${rand(0.8, 2.2)}px`);
      star.style.setProperty("--o", rand(0.12, 0.62).toFixed(2));
      star.style.setProperty("--t", `${rand(2.8, 7.5)}s`);
      star.style.setProperty("--d", `${rand(0, 5).toFixed(2)}s`);
      layer.appendChild(star);
    }
  }

  /* ---------------------------------------------------------
     input: spring plunger
     --------------------------------------------------------- */
  function onPlungerPointerDown(event) {
    if (event.button !== undefined && event.button !== 0 && event.pointerType === "mouse") return;
    if (game.phase === "needCoin" || game.phase === "boot") {
      event.preventDefault();
      beginCharge("drag");
      return;
    }
    if (!canCharge()) return;
    event.preventDefault();
    beginCharge("drag");
    if (!game.charge) return;
    game.charge.startY = event.clientY;
    game.charge.pointerId = event.pointerId;
    dom.plungerAssembly.classList.add("dragging");
    try {
      dom.plungerAssembly.setPointerCapture(event.pointerId);
    } catch (_) {}
  }

  function onPlungerPointerMove(event) {
    if (!game.charge || game.charge.mode !== "drag" || game.phase !== "charging") return;
    if (game.charge.pointerId !== null && event.pointerId !== game.charge.pointerId) return;
    if (event.cancelable) event.preventDefault();
    const travel = window.innerWidth <= 560 ? 92 : 124;
    const power = clamp((event.clientY - game.charge.startY) / travel, 0, 1);
    game.charge.power = power;
    game.round.power = power;
    updatePowerUI(power, true);
    sound.updateCharge(power);
  }

  function onPlungerKeyDown(event) {
    if (event.code !== "Space" && event.code !== "Enter") return;
    if (event.repeat) return;
    event.preventDefault();
    event.stopPropagation();
    beginCharge("hold");
  }

  function onPlungerKeyUp(event) {
    if (event.code !== "Space" && event.code !== "Enter") return;
    if (!game.charge) return;
    event.preventDefault();
    event.stopPropagation();
    releaseCharge();
  }

  /* ---------------------------------------------------------
     events
     --------------------------------------------------------- */
  function bindEvents() {
    dom.insertCoinBtn.addEventListener("click", insertCoin);
    dom.coinSlotBtn.addEventListener("click", insertCoin);
    dom.mobileCoinBtn.addEventListener("click", insertCoin);
    dom.bootCoinBtn.addEventListener("click", insertCoin);
    dom.openAlbumBtn.addEventListener("click", openAlbum);
    dom.mobileAlbumBtn.addEventListener("click", openAlbum);
    dom.helpBtn.addEventListener("click", openHelp);
    dom.revealCloseBtn.addEventListener("click", closeCardReveal);
    dom.soundBtn.addEventListener("click", () => {
      sound.init();
      sound.setMuted(!sound.muted);
      updateSoundButton();
      toast(sound.muted ? "声音已关闭" : "声音已开启", sound.muted ? "pink" : "green");
    });
    dom.resetBtn.addEventListener("click", () => {
      const ok = window.confirm("确定要清空弹珠、代币和星卡图鉴吗？此操作无法撤销。");
      if (ok) {
        safeStorage.remove(SAVE_KEY);
        window.location.reload();
      }
    });

    launchButton.addEventListener("pointerdown", (event) => {
      if (event.button !== undefined && event.button !== 0 && event.pointerType === "mouse") return;
      event.preventDefault();
      beginCharge("hold");
    });
    launchButton.addEventListener("contextmenu", (event) => event.preventDefault());

    dom.plungerAssembly.addEventListener("pointerdown", onPlungerPointerDown);
    dom.plungerAssembly.addEventListener("contextmenu", (event) => event.preventDefault());
    dom.plungerAssembly.addEventListener("keydown", onPlungerKeyDown);
    dom.plungerAssembly.addEventListener("keyup", onPlungerKeyUp);
    window.addEventListener("pointermove", onPlungerPointerMove, { passive: false });
    window.addEventListener("pointerup", (event) => {
      if (game.charge?.mode === "drag" && game.charge.pointerId !== null && event.pointerId !== game.charge.pointerId) return;
      dom.plungerAssembly.classList.remove("dragging");
      if (game.charge) releaseCharge();
    });
    window.addEventListener("pointercancel", (event) => {
      if (game.charge?.mode === "drag" && game.charge.pointerId !== null && event.pointerId !== game.charge.pointerId) return;
      dom.plungerAssembly.classList.remove("dragging");
      if (game.charge) cancelCharge(true);
    });
    window.addEventListener("blur", () => {
      dom.plungerAssembly.classList.remove("dragging");
      if (game.charge) cancelCharge(true);
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && game.charge) cancelCharge(true);
    });

    document.addEventListener("keydown", (event) => {
      if (event.code === "Escape") {
        const open = overlayIds.filter((id) => document.getElementById(id)?.classList.contains("open"));
        if (open.length) {
          event.preventDefault();
          closeOverlay(open[open.length - 1]);
          return;
        }
      }
      if (event.code !== "Space" || event.repeat) return;
      if (anyOverlayOpen()) return;
      const tag = (event.target?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      const interactive = event.target?.closest?.("button, a, [role='button']");
      if (interactive && interactive !== launchButton) return;
      event.preventDefault();
      beginCharge("hold");
    });

    document.addEventListener("keyup", (event) => {
      if (event.code !== "Space") return;
      if (!anyOverlayOpen() && game.charge) {
        event.preventDefault();
        releaseCharge();
      }
    });

    document.addEventListener("pointerdown", () => sound.init(), { once: true, passive: true });
    document.addEventListener("keydown", () => sound.init(), { once: true });

    $$("[data-close]").forEach((el) => {
      el.addEventListener("click", () => closeOverlay(el.dataset.close));
    });

    dom.cardModal.addEventListener("click", (event) => {
      if (event.target === dom.cardModal) closeCardReveal();
    });

    // quick-click protection for the reveal button
    dom.revealCloseBtn.addEventListener("dblclick", (event) => event.preventDefault());
  }

  /* ---------------------------------------------------------
     boot / init
     --------------------------------------------------------- */
  function init() {
    buildStarfield();
    resizeCanvas();
    if ("ResizeObserver" in window) {
      new ResizeObserver(resizeCanvas).observe(dom.glassFrame);
    }
    window.addEventListener("resize", resizeCanvas, { passive: true });
    state.streak = 0;
    updateHUD();
    renderCollection();
    renderMiniGrid();
    updateSoundButton();
    resetPowerUI();
    bindEvents();
    requestAnimationFrame(frame);

    logEvent("系统 · 12 灯道自检完成", "win");
    logEvent("欢迎来到银河弹珠局", "card");

    if (state.marbles >= BET) {
      hideBoot();
      setTimeout(() => {
        if (state.marbles >= BET) startRound();
        else showBoot();
      }, 380);
    } else {
      showBoot();
    }

    if (!state.seenHelp) {
      setTimeout(() => {
        if (game.phase === "needCoin" || game.phase === "boot") {
          toast("第一次来？点右上角 ? 看四步玩法", "pink");
        }
      }, 1300);
    }

    // tiny, intentionally read-only debug surface for local testing
    window.GalaxyMarble = {
      get state() { return state; },
      get phase() { return game.phase; },
      get ball() { return game.ball; },
      get round() { return game.round; },
      insertCoin,
      startRound,
      openAlbum,
      openHelp,
      pullCard,
      showCardReveal,
      beginCharge,
      releaseCharge,
      fireBall,
      finalizeSpin,
      closeCardReveal
    };
  }

  init();
})();

