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

// تعبئة القوائم
document.querySelectorAll('.lang-select').forEach(select => {
  languages.forEach(lang => {
    const opt = document.createElement('option');
    opt.value = lang.code; opt.textContent = lang.name;
    select.appendChild(opt);
  });
});
document.getElementById('srcLang').value = 'ar';
document.getElementById('tgtLang').value = 'en';
document.getElementById('tgtFileLang').value = 'en';

// الوضع الداكن
document.getElementById('themeBtn').addEventListener('click', function() {
  const html = document.documentElement;
  if (html.getAttribute('data-theme') === 'dark') {
    html.setAttribute('data-theme', 'light');
    this.textContent = '🌙';
  } else {
    html.setAttribute('data-theme', 'dark');
    this.textContent = '☀️';
  }
});

// تبديل لغة الواجهة
document.getElementById('langBtn').addEventListener('click', function() {
  const isAr = document.documentElement.dir === 'rtl';
  document.documentElement.dir = isAr ? 'ltr' : 'rtl';
  this.textContent = isAr ? 'عربي' : 'English';
});

// التبويبات
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.target).classList.add('active');
  });
});

// استيراد الملفات
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const filePreview = document.getElementById('filePreview');
const fileName = document.getElementById('fileName');
const translateFileBtn = document.getElementById('translateFileBtn');

document.getElementById('browseBtn').addEventListener('click', () => fileInput.click());

dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('drag'); });
dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag'));
dropzone.addEventListener('drop', (e) => {
  e.preventDefault(); dropzone.classList.remove('drag');
  if (e.dataTransfer.files.length) {
    fileName.textContent = e.dataTransfer.files[0].name;
    filePreview.classList.remove('hidden');
    translateFileBtn.disabled = false;
  }
});
fileInput.addEventListener('change', (e) => {
  if (e.target.files.length) {
    fileName.textContent = e.target.files[0].name;
    filePreview.classList.remove('hidden');
    translateFileBtn.disabled = false;
  }
});
document.getElementById('clearFileBtn').addEventListener('click', () => {
  filePreview.classList.add('hidden');
  translateFileBtn.disabled = true;
  fileInput.value = '';
});

// محاكاة الترجمة
function showResult(msg) {
  const box = document.getElementById('resultBox');
  const text = document.getElementById('resultText');
  box.classList.remove('hidden');
  text.textContent = '⏳ جارٍ الترجمة...';
  setTimeout(() => { text.textContent = '✅ ' + msg; }, 1000);
}

document.getElementById('translateBtn').addEventListener('click', () => {
  const txt = document.getElementById('textInput').value;
  if (!txt) return alert('اكتب نصاً أولاً');
  showResult(`تمت ترجمة النص (${txt.length} حرف) بنجاح.`);
});

document.getElementById('translateFileBtn').addEventListener('click', () => {
  showResult(`تمت ترجمة الملف: ${fileName.textContent}`);
});

document.getElementById('copyBtn').addEventListener('click', () => {
  navigator.clipboard.writeText(document.getElementById('resultText').textContent);
  alert('تم النسخ!');
});
