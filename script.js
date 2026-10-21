// 1. بيانات أكثر من 140 لغة
const languages = [
  { code: 'ar', name: 'العربية' }, { code: 'en', name: 'English' }, { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' }, { code: 'de', name: 'Deutsch' }, { code: 'tr', name: 'Türkçe' },
  { code: 'it', name: 'Italiano' }, { code: 'pt', name: 'Português' }, { code: 'ru', name: 'Русский' },
  { code: 'zh', name: '中文' }, { code: 'ja', name: '日本語' }, { code: 'ko', name: '한국어' },
  { code: 'hi', name: 'हिन्दी' }, { code: 'ur', name: 'اردو' }, { code: 'fa', name: 'فارسی' },
  { code: 'he', name: 'עברית' }, { code: 'nl', name: 'Nederlands' }, { code: 'pl', name: 'Polski' },
  { code: 'sv', name: 'Svenska' }, { code: 'no', name: 'Norsk' }, { code: 'da', name: 'Dansk' },
  { code: 'fi', name: 'Suomi' }, { code: 'el', name: 'Ελληνικά' }, { code: 'cs', name: 'Čeština' },
  { code: 'ro', name: 'Română' }, { code: 'hu', name: 'Magyar' }, { code: 'uk', name: 'Українська' },
  { code: 'id', name: 'Bahasa Indonesia' }, { code: 'ms', name: 'Bahasa Melayu' }, { code: 'th', name: 'ไทย' },
  { code: 'vi', name: 'Tiếng Việt' }, { code: 'bn', name: 'বাংলা' }, { code: 'ta', name: 'தமிழ்' },
  { code: 'te', name: 'తెలుగు' }, { code: 'mr', name: 'मराठी' }, { code: 'gu', name: 'ગુજરાતી' },
  { code: 'kn', name: 'ಕನ್ನಡ' }, { code: 'ml', name: 'മലയാളം' }, { code: 'pa', name: 'ਪੰਜਾਬੀ' },
  { code: 'sw', name: 'Kiswahili' }, { code: 'am', name: 'አማርኛ' }, { code: 'ha', name: 'Hausa' },
  { code: 'yo', name: 'Yorùbá' }, { code: 'ig', name: 'Igbo' }, { code: 'zu', name: 'isiZulu' },
  { code: 'af', name: 'Afrikaans' }, { code: 'bg', name: 'Български' }, { code: 'hr', name: 'Hrvatski' },
  { code: 'sk', name: 'Slovenčina' }, { code: 'sl', name: 'Slovenščina' }, { code: 'sr', name: 'Српски' },
  { code: 'lt', name: 'Lietuvių' }, { code: 'lv', name: 'Latviešu' }, { code: 'et', name: 'Eesti' },
  { code: 'ka', name: 'ქართული' }, { code: 'hy', name: 'Հայերեն' }, { code: 'az', name: 'Azərbaycan' },
  { code: 'kk', name: 'Қазақ' }, { code: 'uz', name: 'Oʻzbek' }, { code: 'ky', name: 'Кыргызча' },
  { code: 'tg', name: 'Тоҷикӣ' }, { code: 'mn', name: 'Монгол' }, { code: 'ne', name: 'नेपाली' },
  { code: 'si', name: 'සිංහල' }, { code: 'my', name: 'မြန်မာ' }, { code: 'km', name: 'ខ្មែរ' },
  { code: 'lo', name: 'ລາວ' }, { code: 'tl', name: 'Filipino' }, { code: 'jv', name: 'Basa Jawa' },
  { code: 'su', name: 'Basa Sunda' }, { code: 'ceb', name: 'Cebuano' }, { code: 'eu', name: 'Euskara' },
  { code: 'ca', name: 'Català' }, { code: 'gl', name: 'Galego' }, { code: 'cy', name: 'Cymraeg' },
  { code: 'ga', name: 'Gaeilge' }, { code: 'gd', name: 'Gàidhlig' }, { code: 'is', name: 'Íslenska' },
  { code: 'mt', name: 'Malti' }, { code: 'sq', name: 'Shqip' }, { code: 'mk', name: 'Македонски' },
  { code: 'bs', name: 'Bosanski' }, { code: 'be', name: 'Беларуская' }, { code: 'lb', name: 'Lëtzebuergesch' },
  { code: 'fo', name: 'Føroyskt' }, { code: 'yi', name: 'ייִדיש' }, { code: 'ps', name: 'پښتو' },
  { code: 'ku', name: 'Kurdî' }, { code: 'sd', name: 'سنڌي' }, { code: 'ug', name: 'ئۇيغۇرچە' },
  { code: 'ckb', name: 'کوردی' }, { code: 'dv', name: 'ދިވެހި' }, { code: 'so', name: 'Soomaali' },
  { code: 'mg', name: 'Malagasy' }, { code: 'ny', name: 'Chichewa' }, { code: 'sn', name: 'chiShona' },
  { code: 'st', name: 'Sesotho' }, { code: 'xh', name: 'isiXhosa' }, { code: 'rw', name: 'Kinyarwanda' },
  { code: 'ti', name: 'ትግርኛ' }, { code: 'om', name: 'Afaan Oromoo' }, { code: 'ht', name: 'Kreyòl Ayisyen' },
  { code: 'la', name: 'Latina' }, { code: 'eo', name: 'Esperanto' }, { code: 'haw', name: 'ʻŌlelo Hawaiʻi' },
  { code: 'mi', name: 'Te Reo Māori' }, { code: 'sm', name: 'Gagana Samoa' }, { code: 'to', name: 'Lea Fakatonga' },
  { code: 'fj', name: 'Vosa Vakaviti' }, { code: 'qu', name: 'Runasimi' }, { code: 'ay', name: 'Aymar aru' },
  { code: 'gn', name: "Avañe'ẽ" }, { code: 'nah', name: 'Nāhuatl' }, { code: 'iu', name: 'ᐃᓄᒃᑎᑐᑦ' },
  { code: 'kl', name: 'Kalaallisut' }, { code: 'bo', name: 'བོད་སྐད' }, { code: 'dz', name: 'རྫོང་ཁ' },
  { code: 'tt', name: 'Татарча' }, { code: 'ba', name: 'Башҡорт' }, { code: 'cv', name: 'Чӑвашла' },
  { code: 'ce', name: 'Нохчийн' }, { code: 'os', name: 'Ирон' }, { code: 'ab', name: 'Аҧсуа' },
  { code: 'av', name: 'Авар' }, { code: 'kab', name: 'Taqbaylit' }, { code: 'tzm', name: 'ⵜⴰⵎⴰⵣⵉⵖⵜ' },
  { code: 'ber', name: 'ⵜⴰⵎⴰⵣⵉⵖⵜ' }, { code: 'wo', name: 'Wolof' }, { code: 'ff', name: 'Fulfulde' },
  { code: 'bm', name: 'Bamanankan' }, { code: 'tw', name: 'Twi' }, { code: 'ee', name: 'Eʋegbe' },
  { code: 'lg', name: 'Luganda' }, { code: 'ak', name: 'Akan' }, { code: 'ln', name: 'Lingála' },
  { code: 'kg', name: 'Kikongo' }, { code: 'lu', name: 'Kiluba' }, { code: 'nso', name: 'Sepedi' },
  { code: 'ts', name: 'Xitsonga' }, { code: 've', name: 'Tshivenda' }, { code: 'tn', name: 'Setswana' },
  { code: 'ss', name: 'siSwati' }, { code: 'nr', name: 'isiNdebele' }
];

// 2. ترجمات الواجهة (عربي / إنجليزي)
const uiTranslations = {
  ar: {
    title: 'LinguaPro - ترجمة احترافية',
    heroTitle: 'ترجم أي شيء بدقة احترافية',
    heroSub: 'ترجمة فورية بالذكاء الاصطناعي تدعم أكثر من 140 لغة — نصوص، ملفات، صور وصوت.',
    tabText: '📝 نص', tabFile: '📁 ملفات', tabAudio: '🎤 صوت',
    translateNow: 'ترجم الآن ✨', translateFile: 'ترجم الملف 🚀', translateAudio: 'ترجم الصوت ✨',
    dropTitle: 'اسحب وأفلت ملفك هنا', dropHint: 'PDF, DOCX, TXT, PNG, JPG, MP3, WAV',
    browse: 'اختر ملفاً', recordPrompt: 'اضغط للتسجيل الصوتي', recording: 'جارٍ التسجيل... اضغط للإيقاف',
    recorded: 'تم التسجيل بنجاح!', resultTitle: 'النتيجة', copy: 'نسخ 📋',
    footerVersion: 'الإصدار 1.0.0', copyright: 'جميع الحقوق محفوظة', langBtn: 'EN'
  },
  en: {
    title: 'LinguaPro - Professional Translation',
    heroTitle: 'Translate Anything with Professional Accuracy',
    heroSub: 'Instant AI translation supporting 140+ languages — text, files, images and audio.',
    tabText: '📝 Text', tabFile: '📁 Files', tabAudio: '🎤 Audio',
    translateNow: 'Translate Now ✨', translateFile: 'Translate File 🚀', translateAudio: 'Translate Audio ✨',
    dropTitle: 'Drag & drop your file here', dropHint: 'PDF, DOCX, TXT, PNG, JPG, MP3, WAV',
    browse: 'Browse File', recordPrompt: 'Click to record audio', recording: 'Recording... click to stop',
    recorded: 'Recorded successfully!', resultTitle: 'Result', copy: 'Copy 📋',
    footerVersion: 'Version 1.0.0', copyright: 'All rights reserved', langBtn: 'عربي'
  }
};

let currentUILang = 'ar';

// 3. تعبئة قوائم اللغات
function populateLanguages() {
  const selects = document.querySelectorAll('.lang-select');
  selects.forEach(select => {
    select.innerHTML = '';
    languages.forEach(lang => {
      const option = document.createElement('option');
      option.value = lang.code;
      option.textContent = lang.name;
      select.appendChild(option);
    });
  });
  // تعيين العربية والإنجليزية كقيم افتراضية
  document.getElementById('srcLangText').value = 'ar';
  document.getElementById('tgtLangText').value = 'en';
  document.getElementById('tgtLangFile').value = 'en';
  document.getElementById('tgtLangAudio').value = 'en';
}

// 4. تغيير لغة الواجهة
function switchUILanguage() {
  currentUILang = currentUILang === 'ar' ? 'en' : 'ar';
  const dir = currentUILang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = currentUILang;
  document.body.dir = dir;
  
  const t = uiTranslations[currentUILang];
  document.title = t.title;
  document.getElementById('heroTitle').textContent = t.heroTitle;
  document.getElementById('heroSub').textContent = t.heroSub;
  document.getElementById('tabText').textContent = t.tabText;
  document.getElementById('tabFile').textContent = t.tabFile;
  document.getElementById('tabAudio').textContent = t.tabAudio;
  document.getElementById('translateTextBtn').textContent = t.translateNow;
  document.getElementById('translateFileBtn').textContent = t.translateFile;
  document.getElementById('translateAudioBtn').textContent = t.translateAudio;
  document.querySelector('.drop-title').textContent = t.dropTitle;
  document.querySelector('.drop-hint').textContent = t.dropHint;
  document.getElementById('browseBtn').textContent = t.browse;
  document.getElementById('recordStatus').textContent = t.recordPrompt;
  document.getElementById('resultTitle').textContent = t.resultTitle;
  document.getElementById('copyBtn').textContent = t.copy;
  document.getElementById('footerVersion').textContent = t.footerVersion;
  document.getElementById('uiLangBtn').textContent = t.langBtn;
}

// 5. الوضع الداكن والفاتح
const themeBtn = document.getElementById('themeBtn');
const html = document.documentElement;
themeBtn.addEventListener('click', () => {
  if (html.getAttribute('data-theme') === 'dark') {
    html.setAttribute('data-theme', 'light');
    themeBtn.textContent = '🌙';
    localStorage.setItem('theme', 'light');
  } else {
    html.setAttribute('data-theme', 'dark');
    themeBtn.textContent = '☀️';
    localStorage.setItem('theme', 'dark');
  }
});
// استعادة الوضع المحفوظ
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  html.setAttribute('data-theme', 'dark');
  themeBtn.textContent = '☀️';
}

// 6. التبويبات
document.querySelectorAll('.tab-btn').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.target).classList.add('active');
  });
});

// 7. تبديل اللغات (النص)
document.getElementById('swapTextLangs').addEventListener('click', () => {
  const src = document.getElementById('srcLangText');
  const tgt = document.getElementById('tgtLangText');
  const temp = src.value;
  src.value = tgt.value;
  tgt.value = temp;
});

// 8. التعامل مع الملفات
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const filePreview = document.getElementById('filePreview');
const fileName = document.getElementById('fileName');
const translateFileBtn = document.getElementById('translateFileBtn');
const clearFileBtn = document.getElementById('clearFileBtn');

document.getElementById('browseBtn').addEventListener('click', () => fileInput.click());

dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('drag'); });
dropzone.addEventListener('dragleave', () => { dropzone.classList.remove('drag'); });
dropzone.addEventListener('drop', (e) => {
  e.preventDefault(); dropzone.classList.remove('drag');
  if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
});
fileInput.addEventListener('change', (e) => {
  if (e.target.files.length) handleFile(e.target.files[0]);
});

function handleFile(file) {
  fileName.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
  filePreview.classList.remove('hidden');
  translateFileBtn.disabled = false;
}
clearFileBtn.addEventListener('click', () => {
  filePreview.classList.add('hidden');
  translateFileBtn.disabled = true;
  fileInput.value = '';
});

// 9. تسجيل الصوت
let isRecording = false;
let mediaRecorder;
const recordBtn = document.getElementById('recordBtn');
const recordStatus = document.getElementById('recordStatus');

recordBtn.addEventListener('click', async () => {
  const t = uiTranslations[currentUILang];
  if (!isRecording) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      isRecording = true;
      recordBtn.classList.add('recording');
      recordStatus.textContent = t.recording;
      recordStatus.style.color = '#ef4444';
    } catch (err) {
      alert(currentUILang === 'ar' ? 'يرجى السماح بالوصول إلى الميكروفون.' : 'Please allow microphone access.');
    }
  } else {
    mediaRecorder.stop();
    isRecording = false;
    recordBtn.classList.remove('recording');
    recordStatus.textContent = t.recorded;
    recordStatus.style.color = 'var(--primary)';
    mediaRecorder.stream.getTracks().forEach(track => track.stop());
  }
