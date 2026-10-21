/**
 * مترجم برو - ترجمة حقيقية مجانية عبر MyMemory API
 * لا يحتاج مفتاح API | يعمل مباشرة من المتصفح
 */

// === عناصر DOM المركزية ===
const $ = id => document.getElementById(id);
const dom = {
    input: $('inputText'), output: $('outputText'), count: $('charCount'),
    btn: $('translateBtn'), src: $('srcLang'), tgt: $('tgtLang'),
    theme: $('themeBtn'), drop: $('dropZone'), file: $('fileInput'),
    fileInfo: $('fileStatus'), fileName: $('fileName'), removeFile: $('removeFile'),
    startRec: $('startRec'), stopRec: $('stopRec'), recStatus: $('recStatus'),
    voiceOut: $('voiceOutput')
};

// === إشعارات أنيقة ===
function toast(msg, type = 'success') {
    document.querySelectorAll('.toast-msg').forEach(e => e.remove());
    const el = document.createElement('div');
    el.className = 'toast-msg';
    el.textContent = msg;
    el.style.cssText = `position:fixed;top:20px;left:50%;transform:translateX(-50%);
        background:${type === 'success' ? '#8b5cf6' : '#ef4444'};color:#fff;
        padding:14px 32px;border-radius:14px;font-weight:700;z-index:9999;
        box-shadow:0 10px 30px rgba(0,0,0,0.3);animation:tIn .4s ease;font-size:1rem;`;
    document.body.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transition = '.3s'; setTimeout(() => el.remove(), 300); }, 3000);
}
if (!$('toast-css')) {
    const s = document.createElement('style'); s.id = 'toast-css';
    s.textContent = '@keyframes tIn{from{opacity:0;transform:translateX(-50%) translateY(-20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}';
    document.head.appendChild(s);
}

// === الترجمة الحقيقية MyMemory API ===
async function translate(text, from, to) {
    const src = from === 'auto' ? 'ar' : from;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${src}|${to}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
        return data.responseData.translatedText;
    }
    throw new Error(data.responseDetails || 'فشل الترجمة');
}

// زر الترجمة
dom.btn.addEventListener('click', async () => {
    const text = dom.input.value.trim();
    if (!text) return toast('اكتب نصاً أولاً!', 'error');
    const orig = dom.btn.innerHTML;
    dom.btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الترجمة...';
    dom.btn.disabled = true;
    try {
        dom.output.value = await translate(text, dom.src.value, dom.tgt.value);
        toast('تمت الترجمة بنجاح! ✨');
    } catch (e) { toast('خطأ: ' + e.message, 'error'); }
    finally { dom.btn.innerHTML = orig; dom.btn.disabled = false; }
});

// === وظائف أساسية ===
dom.input.addEventListener('input', () => dom.count.textContent = `${dom.input.value.length} / 5000`);
$('clearBtn').addEventListener('click', () => { dom.input.value = ''; dom.output.value = ''; dom.count.textContent = '0 / 5000'; });

$('swapBtn').addEventListener('click', () => {
    if (dom.src.value === 'auto') return toast('لا يمكن تبديل الكشف التلقائي', 'error');
    [dom.src.value, dom.tgt.value] = [dom.tgt.value, dom.src.value];
    [dom.input.value, dom.output.value] = [dom.output.value, dom.input.value];
});

$('copyBtn').addEventListener('click', () => {
    if (!dom.output.value) return;
    navigator.clipboard.writeText(dom.output.value).then(() => toast('تم النسخ! 📋'));
});

// قراءة صوتية
function speak(text, lang) {
    if (!text) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === 'auto' ? 'ar-SA' : lang; u.rate = 0.9;
    speechSynthesis.speak(u);
}
$('speakSrc').addEventListener('click', () => speak(dom.input.value, dom.src.value));
$('speakTgt').addEventListener('click', () => speak(dom.output.value, dom.tgt.value));

// === الوضع الداكن/الفاتح ===
dom.theme.addEventListener('click', () => {
    document.body.classList.toggle('light');
    dom.theme.querySelector('i').className = document.body.classList.contains('light') ? 'fas fa-sun' : 'fas fa-moon';
});

// === استيراد الملفات ===
dom.drop.addEventListener('click', () => dom.file.click());
dom.drop.addEventListener('dragover', e => { e.preventDefault(); dom.drop.style.borderColor = 'var(--accent)'; });
dom.drop.addEventListener('dragleave', () => dom.drop.style.borderColor = 'var(--border)');
dom.drop.addEventListener('drop', e => { e.preventDefault(); dom.drop.style.borderColor = 'var(--border)'; if (e.dataTransfer.files.length) loadFile(e.dataTransfer.files[0]); });
dom.file.addEventListener('change', e => { if (e.target.files.length) loadFile(e.target.files[0]); });

function loadFile(file) {
    dom.fileName.textContent = file.name;
    dom.fileInfo.style.display = 'flex';
    const r = new FileReader();
    r.onload = e => { dom.input.value = e.target.result; dom.count.textContent = `${dom.input.value.length} / 5000`; toast('تم تحميل الملف! 📄'); };
    r.readAsText(file);
}
dom.removeFile.addEventListener('click', () => { dom.fileInfo.style.display = 'none'; dom.file.value = ''; dom.input.value = ''; dom.count.textContent = '0 / 5000'; });

// === الترجمة الصوتية ===
let recognition;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SR(); recognition.lang = 'ar-SA'; recognition.continuous = false;
    recognition.onresult = e => {
        const t = e.results[0][0].transcript;
        dom.voiceOut.textContent = t; dom.voiceOut.style.display = 'block';
        dom.input.value = t; dom.count.textContent = `${t.length} / 5000`;
        stopRec(); toast('تم التعرف على الصوت! 🎙️');
    };
    recognition.onerror = () => { toast('خطأ في التعرف على الصوت', 'error'); stopRec(); };
    recognition.onend = stopRec;
}
dom.startRec.addEventListener('click', () => {
    if (!recognition) return toast('متصفحك لا يدعم الصوت', 'error');
    recognition.start(); dom.startRec.disabled = true; dom.stopRec.disabled = false; dom.recStatus.classList.add('active');
});
dom.stopRec.addEventListener('click', () => { recognition?.stop(); stopRec(); });
function stopRec() { dom.startRec.disabled = false; dom.stopRec.disabled = true; dom.recStatus.classList.remove('active'); }
