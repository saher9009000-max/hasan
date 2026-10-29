const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const LS_KEY = "qibla_app_state_v1";
const KAABA = { lat: 21.4225, lng: 39.8262 };

const defaultState = {
  lang: "ar",
  theme: "light",
  method: "3",
  adhanUrl: "https://www.islamcan.com/audio/adhan/azan1.mp3",
  customAdhanData: null,
  compassDesign: "classic",
  primaryColor: "#0e7490",
  manualPrayers: null,
  coords: { lat: 21.4225, lng: 39.8262 },
  hijriOffset: 0,
  declination: 0,
  alarms: [],
  athkar: {},
  favorites: [],
  sleep: "22:30"
};

let state = { ...defaultState, ...(JSON.parse(localStorage.getItem(LS_KEY)) || {}) };
state.coords = { ...defaultState.coords, ...(state.coords || {}) };
state.athkar = state.athkar || {};
state.alarms = state.alarms || [];
state.favorites = state.favorites || [];

const saveState = () => localStorage.setItem(LS_KEY, JSON.stringify(state));

const I18N = {
  ar: {
    appName: "قِبلة",
    tabCompass: "القبلة والصلاة",
    tabCalendar: "التقويم والأذكار",
    tabTools: "الأدوات والإعدادات",
    sectionCompass: "البوصلة ومواقيت الصلاة",
    sectionCalendar: "التقويم والأذكار والقرآن",
    sectionTools: "الأدوات والإعدادات",
    heading: "اتجاه الجهاز",
    qiblaBearing: "اتجاه القبلة",
    confidence: "الثقة",
    sensorHint: "فعّل المستشعرات لبدء البوصلة",
    enableSensors: "تفعيل المستشعرات",
    calibrate: "معايرة (وجّه للشمال)",
    location: "الموقع",
    locate: "تحديد موقعي",
    prayerTimes: "مواقيت الصلاة",
    testAdhan: "تجربة الأذان",
    today: "اليوم",
    ageCalc: "حاسبة العمر",
    athkar: "أذكار",
    reset: "تصفير",
    quran: "القرآن",
    play: "تشغيل",
    favorite: "مفضلة",
    alarms: "المنبهات",
    alarmName: "اسم المنبه",
    add: "إضافة",
    settings: "الإعدادات",
    language: "اللغة",
    method: "طريقة حساب المواقيت",
    hijriOffset: "فارق التاريخ الهجري (أيام)",
    declination: "تعويض الانحراف المغناطيسي (درجات)",
    save: "حفظ",
    clear: "حذف البيانات المحلية",
    ux: "تجربة المستخدم",
    ux1: "بوصلة حية مع معايرة تلقائية ومرشح تنعيم.",
    ux2: "مواقيت محسوبة عبر Aladhan مع تخزين مؤقت للعمل دون اتصال جزئي.",
    ux3: "تقويم هجري/ميلادي، أذكار، قرآن، منبهات، وحاسبة عمر.",
    ux4: "وضع ليلي، لغة عربي/إنجليزي، وزر عائم سريع.",
    privacy: "الخصوصية: تُعالج المستشعرات والموقع محليًا، ولا تُرسل إلا إحداثياتك إلى API المواقيت عند الحاجة.",
    next: "الصلاة القادمة",
    remaining: "المتبقي",
    sleepReminder: "تذكير النوم",
    dailyDhikr: "ذكرك اليومي",
    noAlarms: "لا توجد منبهات.",
    ageYears: "سنة",
    ageMonths: "شهر",
    ageDays: "يوم",
    saved: "تم الحفظ",
    located: "تم تحديد الموقع",
    locationError: "تعذر تحديد الموقع",
    prayerError: "تعذر جلب المواقيت",
    notifDenied: "الإشعارات غير مفعلة",
    qibla: "القبلة",
    favorites: "المفضلة",
    delete: "حذف"
  },
  en: {
    appName: "Qibla",
    tabCompass: "Qibla & Prayer",
    tabCalendar: "Calendar & Athkar",
    tabTools: "Tools & Settings",
    sectionCompass: "Compass & Prayer Times",
    sectionCalendar: "Calendar, Athkar & Quran",
    sectionTools: "Tools & Settings",
    heading: "Device heading",
    qiblaBearing: "Qibla bearing",
    confidence: "Confidence",
    sensorHint: "Enable sensors to start the compass",
    enableSensors: "Enable sensors",
    calibrate: "Calibrate (point North)",
    location: "Location",
    locate: "Locate me",
    prayerTimes: "Prayer times",
    testAdhan: "Test Adhan",
    today: "Today",
    ageCalc: "Age calculator",
    athkar: "Athkar",
    reset: "Reset",
    quran: "Quran",
    play: "Play",
    favorite: "Favorite",
    alarms: "Alarms",
    alarmName: "Alarm name",
    add: "Add",
    settings: "Settings",
    language: "Language",
    method: "Prayer calculation method",
    hijriOffset: "Hijri date offset (days)",
    declination: "Magnetic declination offset (deg)",
    save: "Save",
    clear: "Clear local data",
    ux: "User experience",
    ux1: "Live compass with auto-calibration and smoothing filter.",
    ux2: "Prayer times via Aladhan with local cache for partial offline use.",
    ux3: "Hijri/Gregorian calendar, athkar, Quran, alarms, age calculator.",
    ux4: "Dark mode, Arabic/English, and quick floating button.",
    privacy: "Privacy: sensors and location are processed locally; only coordinates are sent to the prayer API when needed.",
    next: "Next prayer",
    remaining: "Remaining",
    sleepReminder: "Sleep reminder",
    dailyDhikr: "Daily dhikr",
    noAlarms: "No alarms.",
    ageYears: "years",
    ageMonths: "months",
    ageDays: "days",
    saved: "Saved",
    located: "Location set",
    locationError: "Could not get location",
    prayerError: "Could not load prayer times",
    notifDenied: "Notifications are disabled",
    qibla: "Qibla",
    favorites: "Favorites",
    delete: "Delete"
  }
};

const t = (k) => (I18N[state.lang] && I18N[state.lang][k]) || k;

function applyLang() {
  document.documentElement.lang = state.lang;
  document.documentElement.dir = state.lang === "ar" ? "rtl" : "ltr";
  $("#langBtn").textContent = state.lang === "ar" ? "AR" : "EN";
  $$("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (I18N[state.lang] && I18N[state.lang][key]) el.textContent = I18N[state.lang][key];
  });
  $$("[data-i18n-ph]").forEach((el) => {
    const key = el.dataset.i18nPh;
    if (I18N[state.lang] && I18N[state.lang][key]) el.placeholder = I18N[state.lang][key];
  });
  renderPrayer();
  renderCalendar();
  renderAthkar();
  renderAlarms();
  renderFavorites();
  updateFab();
}

function applyTheme() {
  document.documentElement.dataset.theme = state.theme;
  $("#themeBtn").textContent = state.theme === "dark" ? "☀️" : "🌙";
}

function applyCompassDesign() {
  const dial = $("#compassDial");
  if (dial) {
    dial.className = `compass-dial ${state.compassDesign || "classic"}`;
  }
}

function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.remove("hidden");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.add("hidden"), 2400);
}

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.frequency.value = 880;
    g.gain.value = 0.08;
    o.start();
    setTimeout(() => { o.stop(); ctx.close(); }, 700);
  } catch (e) {}
}

/* ========== Tabs & Theme ========== */
$$(".tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    $$(".tab").forEach((b) => b.classList.remove("active"));
    $$(".tab-panel").forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    $("#tab-" + btn.dataset.tab).classList.add("active");
  });
});

$("#settingsBtn").addEventListener("click", () => {
  $$(".tab").forEach((b) => b.classList.remove("active"));
  $$(".tab-panel").forEach((p) => p.classList.remove("active"));
  $('.tab[data-tab="tools"]').classList.add("active");
  $("#tab-tools").classList.add("active");
});

$("#themeBtn").addEventListener("click", () => {
  state.theme = state.theme === "dark" ? "light" : "dark";
  saveState();
  applyTheme();
});

$("#langBtn").addEventListener("click", () => {
  state.lang = state.lang === "ar" ? "en" : "ar";
  saveState();
  applyLang();
});

/* ========== Compass ========== */
let rawHeading = 0;
let filteredHeading = 0;
let headingOffset = 0;
let sensorSamples = [];
let sensorsOn = false;

const shortestDelta = (a, b) => ((a - b + 540) % 360) - 180;

function qiblaBearing(lat, lng) {
  const φ1 = (lat * Math.PI) / 180;
  const φ2 = (KAABA.lat * Math.PI) / 180;
  const Δλ = ((KAABA.lng - lng) * Math.PI) / 180;
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

function updateCompass() {
  const q = qiblaBearing(state.coords.lat, state.coords.lng);
  const trueHeading = (filteredHeading + headingOffset + Number(state.declination || 0) + 360) % 360;
  const relative = (q - trueHeading + 360) % 360;

  $("#compassNeedle").style.transform = `rotate(${relative}deg)`;
  $("#headingVal").textContent = Math.round(trueHeading) + "°";
  $("#qiblaVal").textContent = Math.round(q) + "°";

  const recent = sensorSamples.slice(-20);
  let variance = 0;
  if (recent.length > 2) {
    const mean = recent.reduce((a, b) => a + b, 0) / recent.length;
    variance = recent.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / recent.length;
  }
  const confidence = Math.max(0, Math.min(100, Math.round(100 - variance * 1.5)));
  $("#confidenceVal").textContent = confidence + "%";
}

function onOrientation(e) {
  if (!sensorsOn) return;
  let h = null;
  if (typeof e.webkitCompassHeading === "number") h = e.webkitCompassHeading;
  else if (typeof e.alpha === "number") h = (360 - e.alpha + 360) % 360;
  if (h == null) return;

  rawHeading = h;
  if (!sensorSamples.length) filteredHeading = h;
  filteredHeading = (filteredHeading + shortestDelta(h, filteredHeading) * 0.18 + 360) % 360;
  sensorSamples.push(h);
  if (sensorSamples.length > 40) sensorSamples.shift();
  updateCompass();
}

async function enableSensors() {
  try {
    if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
      const p = await DeviceOrientationEvent.requestPermission();
      if (p !== "granted") throw new Error("permission");
    }
    if (!sensorsOn) {
      window.addEventListener("deviceorientation", onOrientation, true);
      window.addEventListener("deviceorientationabsolute", onOrientation, true);
      sensorsOn = true;
    }
    $("#sensorStatus").textContent = t("sensorHint");
    toast(t("sensorHint"));
  } catch (e) {
    toast("المستشعرات غير متاحة / Sensors unavailable");
  }
}

$("#enableSensors").addEventListener("click", enableSensors);

$("#calibrateBtn").addEventListener("click", () => {
  headingOffset = (-filteredHeading + 360) % 360;
  sensorSamples = [];
  updateCompass();
  toast(state.lang === "ar" ? "تمت المعايرة" : "Calibrated");
});

$("#locateBtn").addEventListener("click", () => {
  if (!navigator.geolocation) return toast(t("locationError"));
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      state.coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      saveState();
      $("#coords").textContent = `${state.coords.lat.toFixed(4)}, ${state.coords.lng.toFixed(4)}`;
      updateCompass();
      loadPrayerTimes();
      toast(t("located"));
    },
    () => toast(t("locationError")),
    { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
  );
});

/* ========== Prayer times ========== */
let prayerData = null;
let nextPrayerObj = null;
let adhanTimer = null;

const prayerNames = {
  Fajr: { ar: "الفجر", en: "Fajr" },
  Dhuhr: { ar: "الظهر", en: "Dhuhr" },
  Asr: { ar: "العصر", en: "Asr" },
  Maghrib: { ar: "المغرب", en: "Maghrib" },
  Isha: { ar: "العشاء", en: "Isha" }
};

const pName = (k) => (prayerNames[k] && prayerNames[k][state.lang]) || k;
const todayKey = (d = new Date()) => {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
};

async function loadPrayerTimes() {
  if (state.manualPrayers) {
    prayerData = state.manualPrayers;
    renderPrayer();
    scheduleNextAdhan();
    return;
  }
  const { lat, lng } = state.coords;
  const cacheKey = `prayer_${todayKey()}_${lat.toFixed(3)}_${lng.toFixed(3)}_${state.method}`;
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    try {
      prayerData = JSON.parse(cached);
      renderPrayer();
      scheduleNextAdhan();
      return;
    } catch (e) {}
  }

  try {
    const url = `https://api.aladhan.com/v1/timings/${todayKey()}?latitude=${lat}&longitude=${lng}&method=${state.method}`;
    const res = await fetch(url);
    const json = await res.json();
    if (!json || !json.data || !json.data.timings) throw new Error("bad");
    prayerData = json.data.timings;
    localStorage.setItem(cacheKey, JSON.stringify(prayerData));
    renderPrayer();
    scheduleNextAdhan();
  } catch (e) {
    if (cached) return;
    toast(t("prayerError"));
  }
}

function renderPrayer() {
  if (!prayerData) return;
  const df = new Intl.DateTimeFormat(state.lang === "ar" ? "ar" : "en", { dateStyle: "full" });
  $("#prayerDate").textContent = df.format(new Date());

  const now = new Date();
  let next = null;
  const order = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  const list = $("#prayerList");
  list.innerHTML = "";

  order.forEach((key) => {
    const val = prayerData[key];
    if (!val) return;
    const [h, m] = val.split(":").map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);

    const li = document.createElement("li");
    li.innerHTML = `<span>${pName(key)}</span><strong>${val}</strong>`;
    list.appendChild(li);

    if (d > now && (!next || d < next.date)) next = { key, date: d };
  });

  if (!next && prayerData.Fajr) {
    const [h, m] = prayerData.Fajr.split(":").map(Number);
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(h, m, 0, 0);
    next = { key: "Fajr", date: d };
  }

  nextPrayerObj = next;
  if (next) {
    const timeStr = next.date.toLocaleTimeString(state.lang === "ar" ? "ar" : "en", { hour: "2-digit", minute: "2-digit" });
    $("#nextPrayer").textContent = `${t("next")}: ${pName(next.key)} — ${timeStr}`;
    updateCountdown();
    updateFab();
  }
}

function updateCountdown() {
  if (!nextPrayerObj) return;
  const diff = nextPrayerObj.date - new Date();
  if (diff <= 0) {
    $("#countdown").textContent = t("remaining") + ": 00:00:00";
    return;
  }
  const s = Math.floor(diff / 1000);
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  $("#countdown").textContent = `${t("remaining")}: ${hh}:${mm}:${ss}`;
}

function scheduleNextAdhan() {
  if (adhanTimer) clearTimeout(adhanTimer);
  if (!nextPrayerObj) return;
  const diff = nextPrayerObj.date - new Date();
  if (diff <= 0 || diff > 24 * 3600 * 1000) return;
  adhanTimer = setTimeout(() => {
    playAdhan();
    notify(pName(nextPrayerObj.key), state.lang === "ar" ? "حان الآن وقت الصلاة" : "It is prayer time");
    loadPrayerTimes();
  }, diff);
}

function playAdhan() {
  const audio = $("#adhanAudio");
  audio.src = state.adhanUrl;
  audio.play().catch(() => beep());
}

$("#testAdhan").addEventListener("click", playAdhan);

$("#adhanSelect").addEventListener("change", (e) => {
  state.adhanUrl = e.target.value;
  saveState();
});

/* ========== Notifications ========== */
async function notify(title, body) {
  if (!("Notification" in window)) return;
  if (Notification.permission === "default") {
    try { await Notification.requestPermission(); } catch (e) {}
  }
  if (Notification.permission === "granted") {
    new Notification(title, { body, icon: "" });
  } else {
    toast(t("notifDenied"));
  }
}

/* ========== Calendar & Age ========== */
const events = [
  { m: 1, d: 1, ar: "رأس السنة الهجرية", en: "Islamic New Year" },
  { m: 1, d: 10, ar: "عاشوراء", en: "Ashura" },
  { m: 3, d: 12, ar: "المولد النبوي", en: "Mawlid" },
  { m: 7, d: 27, ar: "الإسراء والمعراج", en: "Isra & Mi'raj" },
  { m: 8, d: 15, ar: "النصف من شعبان", en: "Mid-Sha'ban" },
  { m: 9, d: 1, ar: "بداية رمضان", en: "Ramadan begins" },
  { m: 9, d: 27, ar: "ليلة القدر (تقديرية)", en: "Laylat al-Qadr (est.)" },
  { m: 10, d: 1, ar: "عيد الفطر", en: "Eid al-Fitr" },
  { m: 12, d: 10, ar: "عيد الأضحى", en: "Eid al-Adha" }
];

function hijriParts(date) {
  const d = new Date(date.getTime() + Number(state.hijriOffset || 0) * 86400000);
  const fmt = new Intl.DateTimeFormat("en-US-u-ca-islamic", { day: "numeric", month: "numeric", year: "numeric" });
  const parts = fmt.formatToParts(d);
  const get = (type) => Number((parts.find((p) => p.type === type) || {}).value);
  return { day: get("day"), month: get("month"), year: get("year") };
}

function renderCalendar() {
  const now = new Date();
  const g = new Intl.DateTimeFormat(state.lang === "ar" ? "ar" : "en", { dateStyle: "full" }).format(now);
  $("#gregorianDate").textContent = g;

  const hAdj = new Date(now.getTime() + Number(state.hijriOffset || 0) * 86400000);
  const h = new Intl.DateTimeFormat(state.lang === "ar" ? "ar-SA-u-ca-islamic" : "en-US-u-ca-islamic", { dateStyle: "full" }).format(hAdj);
  $("#hijriDate").textContent = h;

  const hp = hijriParts(now);
  const ev = events.find((e) => e.m === hp.month && e.d === hp.day);
  $("#eventToday").textContent = ev ? (state.lang === "ar" ? ev.ar : ev.en) : "";
}

$("#birthDate").addEventListener("change", () => {
  const val = $("#birthDate").value;
  if (!val) return;
  const b = new Date(val + "T00:00:00");
  const now = new Date();
  if (isNaN(b.getTime()) || b > now) {
    $("#ageResult").textContent = "—";
    return;
  }
  let y = now.getFullYear() - b.getFullYear();
  let m = now.getMonth() - b.getMonth();
  let d = now.getDate() - b.getDate();
  if (d < 0) {
    m--;
    d += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (m < 0) {
    y--;
    m += 12;
  }
  const hb = new Intl.DateTimeFormat(state.lang === "ar" ? "ar-SA-u-ca-islamic" : "en-US-u-ca-islamic", { dateStyle: "full" }).format(b);
  $("#ageResult").innerHTML = `${y} ${t("ageYears")}، ${m} ${t("ageMonths")}، ${d} ${t("ageDays")}<br><span class="muted">${hb}</span>`;
});

/* ========== Athkar ========== */
const ATHKAR = [
  { id: "subhan", ar: "سبحان الله وبحمده", en: "Subhan Allah wa bihamdih", target: 33 },
  { id: "hamd", ar: "الحمد لله", en: "Alhamdulillah", target: 33 },
  { id: "akbar", ar: "الله أكبر", en: "Allahu Akbar", target: 34 },
  { id: "istighfar", ar: "أستغفر الله", en: "Astaghfirullah", target: 100 },
  { id: "tawhid", ar: "لا إله إلا الله وحده لا شريك له", en: "La ilaha illa Allah wahdahu la sharika lah", target: 10 }
];

function renderAthkar() {
  const box = $("#athkarList");
  if (!box) return;
  box.innerHTML = "";
  ATHKAR.forEach((a) => {
    const count = Number(state.athkar[a.id] || 0);
    const div = document.createElement("div");
    div.className = "athkar-item";
    div.innerHTML = `
      <div class="text">${state.lang === "ar" ? a.ar : a.en}</div>
      <button class="btn small" data-id="${a.id}">${count} / ${a.target}</button>
    `;
    div.querySelector("button").addEventListener("click", () => {
      state.athkar[a.id] = (Number(state.athkar[a.id] || 0) + 1) % (a.target + 1);
      saveState();
      renderAthkar();
    });
    box.appendChild(div);
  });
}

$("#resetAthkar").addEventListener("click", () => {
  state.athkar = {};
  saveState();
  renderAthkar();
  toast(t("saved"));
});

/* ========== Quran ========== */
function renderFavorites() {
  const box = $("#favList");
  if (!box) return;
  if (!state.favorites.length) {
    box.textContent = "";
    return;
  }
  box.textContent = `${t("favorites")}: ${state.favorites.join(", ")}`;
}

$("#playSurah").addEventListener("click", () => {
  const n = Number($("#surahSelect").value);
  const audio = $("#quranAudio");
  audio.src = `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${n}.mp3`;
  audio.play().catch(() => toast("تعذر تشغيل الصوت"));
});

$("#favSurah").addEventListener("click", () => {
  const n = Number($("#surahSelect").value);
  if (state.favorites.includes(n)) {
    state.favorites = state.favorites.filter((x) => x !== n);
  } else {
    state.favorites.push(n);
  }
  saveState();
  renderFavorites();
});

/* ========== Alarms ========== */
function renderAlarms() {
  const list = $("#alarmList");
  if (!list) return;
  list.innerHTML = "";
  if (!state.alarms.length) {
    list.innerHTML = `<li class="muted">${t("noAlarms")}</li>`;
    return;
  }
  state.alarms.forEach((a) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${a.time} — ${a.name || t("alarms")}</span><button class="btn small danger">${t("delete")}</button>`;
    li.querySelector("button").addEventListener("click", () => {
      state.alarms = state.alarms.filter((x) => x.id !== a.id);
      saveState();
      renderAlarms();
    });
    list.appendChild(li);
  });
}

$("#addAlarm").addEventListener("click", () => {
  const time = $("#alarmTime").value;
  if (!time) return;
  const name = $("#alarmName").value.trim() || t("alarms");
  state.alarms.push({ id: Date.now(), time, name, lastFired: "" });
  saveState();
  renderAlarms();
  $("#alarmTime").value = "";
  $("#alarmName").value = "";
  toast(t("saved"));
});

function checkAlarms() {
  const now = new Date();
  const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const day = todayKey(now);
  let changed = false;
  state.alarms.forEach((a) => {
    if (a.time === hhmm && a.lastFired !== day) {
      a.lastFired = day;
      changed = true;
      beep();
      notify(a.name || t("alarms"), state.lang === "ar" ? "حان موعد المنبه" : "Alarm time");
    }
  });
  if (changed) saveState();
}

/* ========== Settings ========== */
function loadSettingsUI() {
  $("#langSelect").value = state.lang;
  $("#methodSelect").value = state.method;
  $("#hijriOffset").value = state.hijriOffset;
  $("#declination").value = state.declination;
  $("#adhanSelect").value = state.adhanUrl;
  if ($("#compassDesign")) $("#compassDesign").value = state.compassDesign || "classic";
  if ($("#alarmSoundSelect")) $("#alarmSoundSelect").value = state.alarmSound || "beep";
}

$("#saveSettings").addEventListener("click", () => {
  state.lang = $("#langSelect").value;
  state.method = $("#methodSelect").value;
  state.hijriOffset = Number($("#hijriOffset").value || 0);
  state.declination = Number($("#declination").value || 0);
  state.adhanUrl = $("#adhanSelect").value;
  if ($("#compassDesign")) state.compassDesign = $("#compassDesign").value;
  if ($("#alarmSoundSelect")) state.alarmSound = $("#alarmSoundSelect").value || "beep";
  saveState();
  applyLang();
  applyTheme();
  applyCompassDesign();
  loadPrayerTimes();
  updateCompass();
  toast(t("saved"));
});

$("#clearData").addEventListener("click", () => {
  if (!confirm(state.lang === "ar" ? "حذف كل البيانات المحلية؟" : "Clear all local data?")) return;
  localStorage.removeItem(LS_KEY);
  location.reload();
});

/* ========== FAB ========== */
$("#fab").addEventListener("click", () => {
  $("#fabPanel").classList.toggle("hidden");
});// زر تنزيل القرآن كاملاً (114 سورة)
$("#downloadFullQuranBtn")?.addEventListener("click", () => {
  window.open("https://www.mp3quran.net/afs", "_blank");
  toast("جاري فتح صفحة المصحف المرتل كاملاً للتحميل...");
});


function updateFab() {
  const panel = $("#fabPanel");
  if (!panel) return;
  if (nextPrayerObj) {
    const diff = Math.max(0, nextPrayerObj.date - new Date());
    const mins = Math.floor(diff / 60000);
    $("#fabNext").textContent = `${t("next")}: ${pName(nextPrayerObj.key)} — ${mins} د`;
  } else {
    $("#fabNext").textContent = `${t("next")}: —`;
  }
  $("#fabSleep").textContent = `${t("sleepReminder")}: ${state.sleep}`;
  $("#fabDhikr").textContent = `${t("dailyDhikr")}: ${state.lang === "ar" ? "سبحان الله وبحمده" : "Subhan Allah wa bihamdih"}`;
}
// زر تعديل أوقات الصلاة يدوياً
const manualBtn = document.createElement("button");
manualBtn.className = "btn small";
manualBtn.textContent = "تعديل المواقيت يدوياً";
document.querySelector("#tab-compass .card:nth-of-type(3) .card-head")?.appendChild(manualBtn);

manualBtn.addEventListener("click", () => {
  const f = prompt("أدخل وقت الفجر (HH:MM):", prayerData?.Fajr || "05:00");
  const d = prompt("أدخل وقت الظهر (HH:MM):", prayerData?.Dhuhr || "12:00");
  const a = prompt("أدخل وقت العصر (HH:MM):", prayerData?.Asr || "15:30");
  const m = prompt("أدخل وقت المغرب (HH:MM):", prayerData?.Maghrib || "18:00");
  const i = prompt("أدخل وقت العشاء (HH:MM):", prayerData?.Isha || "19:30");
  if (f && d && a && m && i) {
    state.manualPrayers = { Fajr: f, Dhuhr: d, Asr: a, Maghrib: m, Isha: i };
    saveState();
    loadPrayerTimes();
    toast("تم تحديث المواقيت يدوياً");
  }
});

// زر تنزيل القرآن الكريم (تخزين مؤقت للسورة الحالية)
const downloadQuranBtn = document.createElement("button");
downloadQuranBtn.className = "btn";
downloadQuranBtn.textContent = "تنزيل السورة (ملف صوتي)";
document.querySelector("#surahSelect")?.parentNode.appendChild(downloadQuranBtn);

downloadQuranBtn.addEventListener("click", async () => {
  const n = Number($("#surahSelect").value);
  const url = `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${n}.mp3`;
  toast("جاري تجهيز وتنزيل السورة...");
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `surah_${n}.mp3`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast("تم تنزيل السورة بنجاح");
  } catch (e) {
    toast("تعذر تنزيل السورة");
  }
});

/* ========== Init ========== */
function init() {
  applyTheme();
  loadSettingsUI();
  applyLang();
  applyCompassDesign();
  $("#coords").textContent = `${state.coords.lat.toFixed(4)}, ${state.coords.lng.toFixed(4)}`;
  updateCompass();
  loadPrayerTimes();
  initSurahSelect();
  renderAlarms();
  renderFavorites();
  updateFab();

  setInterval(updateCountdown, 1000);
  setInterval(updateFab, 30000);
  setInterval(checkAlarms, 30000);
  setInterval(renderCalendar, 60000);
}

init();function applyCompassDesign() {
  const dial = $("#compassDial");
  if (!dial) return;
  dial.className = "compass-dial " + state.compassDesign;
}

function applyPrimaryColor() {
  if (!state.primaryColor) return;
  document.documentElement.style.setProperty("--teal", state.primaryColor);
  document.documentElement.style.setProperty("--teal-2", state.primaryColor);
}

// معالجة ملف الأذان المحلي من الوسائط
$("#customAdhanFile")?.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(evt) {
    state.customAdhanData = evt.target.result;
    saveState();
    toast("تم تحميل صوت الأذان من الوسائط بنجاح");
  };
  reader.readAsDataURL(file);
});

// تشغيل الأذان (سواء محلي أو من الإنترنت)
function playAdhan() {
  const audio = $("#adhanAudio");
  if (state.customAdhanData) {
    audio.src = state.customAdhanData;
  } else {
    audio.src = state.adhanUrl;
  }
  audio.play().catch(() => beep());
}

// حفظ المواقيت اليدوية
$("#saveManualPrayer")?.addEventListener("click", () => {
  const f = $("#mFajr").value;
  const dh = $("#mDhuhr").value;
  const a = $("#mAsr").value;
  const mg = $("#mMaghrib").value;
  const ish = $("#mIsha").value;
  
  if (f || dh || a || mg || ish) {
    state.manualPrayers = {
      Fajr: f || (prayerData && prayerData.Fajr),
      Dhuhr: dh || (prayerData && prayerData.Dhuhr),
      Asr: a || (prayerData && prayerData.Asr),
      Maghrib: mg || (prayerData && prayerData.Maghrib),
      Isha: ish || (prayerData && prayerData.Isha)
    };
    saveState();
    renderPrayer();
    toast("تم تحديث المواقيت يدوياً");
  }
});

$("#compassDesign")?.addEventListener("change", (e) => {
  state.compassDesign = e.target.value;
  saveState();
  applyCompassDesign();
});

$("#primaryColorPicker")?.addEventListener("input", (e) => {
  state.primaryColor = e.target.value;
  applyPrimaryColor();
});
// تعبئة قائمة السور الـ 114 للقرآن الكريم كاملاً
const allSurahs = [
  "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس",
  "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه",
  "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم",
  "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر",
  "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق",
  "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "حديد", "المجادلة", "الحشر", "الممتحنة",
  "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج",
  "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس",
  "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد",
  "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات",
  "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر",
  "المسد", "الإخلاص", "الفلق", "الناس"
];

function initSurahSelect() {
  const select = $("#surahSelect");
  if (!select) return;
  select.innerHTML = "";
  allSurahs.forEach((name, index) => {
    const opt = document.createElement("option");
    opt.value = index + 1;
    opt.textContent = `${index + 1}. ${name}`;
    select.appendChild(opt);
  });
}

// التحكم في عرض صندوق تعديل المواقيت يدوياً
$("#toggleManualPrayer")?.addEventListener("click", () => {
  $("#manualPrayerBox").classList.toggle("hidden");
});

// حفظ المواقيت اليدوية
$("#saveManualPrayer")?.addEventListener("click", () => {
  const f = $("#mFajr").value;
  const dh = $("#mDhuhr").value;
  const a = $("#mAsr").value;
  const mg = $("#mMaghrib").value;
  const ish = $("#mIsha").value;

  if (f || dh || a || mg || ish) {
    state.manualPrayers = {
      Fajr: f || (prayerData && prayerData.Fajr),
      Dhuhr: dh || (prayerData && prayerData.Dhuhr),
      Asr: a || (prayerData && prayerData.Asr),
      Maghrib: mg || (prayerData && prayerData.Maghrib),
      Isha: ish || (prayerData && prayerData.Isha)
    };
    saveState();
    renderPrayer();
    toast("تم تحديث وحفظ المواقيت يدوياً");
  } else {
    toast("يرجى إدخال وقت واحد على الأقل");
  }
});

// زر تنزيل السورة الحالية من القرآن الكريم
$("#downloadSurahBtn")?.addEventListener("click", () => {
  const n = Number($("#surahSelect").value);
  const url = `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${n}.mp3`;
  const a = document.createElement("a");
  a.href = url;
  a.download = `surah_${n}_${allSurahs[n - 1]}.mp3`;
  a.target = "_blank";
  document.body.appendChild(a);
  a.click();
  a.remove();
  toast("جاري بدء تنزيل السورة...");
});
// تنزيل القرآن كاملاً (جميع السور الـ 114 تباعاً)
$("#downloadFullQuranBtn")?.addEventListener("click", async () => {
  if (!confirm("هل تريد تنزيل جميع سور القرآن الكريم (114 سورة)؟ قد يقوم المتصفح بحظر التحميلات المتعددة، يرجى السماح بها.")) return;
  toast("جاري بدء تنزيل القرآن كاملاً...");
  
  for (let i = 1; i <= 114; i++) {
    const url = `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${i}.mp3`;
    const a = document.createElement("a");
    a.href = url;
    a.download = `surah_${i}_${allSurahs[i - 1]}.mp3`;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    a.remove();
    
    await new Promise(r => setTimeout(r, 400));
  }
  
  toast("تم إرسال طلبات تنزيل السور");
});
// تحديث أزرار التنزيل لتعمل بشكل مباشر
$("#downloadSurahBtn")?.replaceWith($("#downloadSurahBtn").clone(true));
$("#downloadFullQuranBtn")?.replaceWith($("#downloadFullQuranBtn").clone(true));

$("#downloadSurahBtn")?.addEventListener("click", () => {
  const n = Number($("#surahSelect").value);
  const url = `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${n}.mp3`;
  window.open(url, "_blank");
  toast("جاري فتح السورة...");
});

$("#downloadFullQuranBtn")?.addEventListener("click", () => {
  alert("عذراً، تمنع متصفحات الهواتف المحمولة تنزيل 114 ملفاً دفعة واحدة تلقائياً حمايةً للجهاز. يمكنك تنزيل كل سورة تحتاجها عبر زر (تنزيل السورة الحالية).");
});
// زر تنزيل القرآن كاملاً من مصدر موثوق يناسب المتصفحات والهواتف
$("#downloadFullQuranBtn")?.addEventListener("click", () => {
  window.open("https://www.mp3quran.net/afs", "_blank");
  toast("جاري فتح صفحة المصحف المرتل كاملاً للتحميل...");
});
