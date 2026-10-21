/**
 * مترجم برو - نسخة MyMemory API المضمونة
 * يعمل مباشرة من المتصفح بدون CORS
 */

// === عناصر DOM ===
const els = {
    input: document.getElementById('inputText'),
    output: document.getElementById('outputText'),
    charCount: document.getElementById('charCount'),
    translateBtn: document.getElementById('translateBtn'),
    sourceLang: document.getElementById('sourceLang'),
    targetLang: document.getElementById('targetLang'),
    themeToggle: document.getElementById('themeToggle'),
    uploadZone: document.getElementById('uploadZone'),
    fileInput: document.getElementById('fileInput'),
    fileInfo: document.getElementById('fileInfo'),
    fileName: document.getElementById('fileName'),
    startRecord: document.getElementById('startRecord'),
    stopRecord: document.getElementById('stopRecord'),
    recordingIndicator: document.getElementById('recordingIndicator'),
    voiceResult: document.getElementById('voiceResult')
};

// === 1. نظام الإشعارات ===
function notify(msg, type = 'success') {
    document.querySelectorAll('.toast').forEach(t => t.remove());
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    toast.style.cssText = `
        position:fixed; top:20px; left:50%; transform:translateX(-50%);
        background:${type === 'success' ? '#6366f1' : '#ef4444'};
        color:#fff; padding:14px 32px; border-radius:12px;
        font-weight:700; z-index:9999; box-shadow:0 10px 30px rgba(0,0,0,0.3);
        animation: toastIn 0.4s ease; font-size:1rem;
    `;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = '0.3s'; setTimeout(() => toast.remove(), 300); }, 3000);
}

// إضافة أنيميشن
if (!document.getElementById('toast-style')) {
    const s = document.createElement('style');
    s.id = 'toast-style';
    s.textContent = '@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(-20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}';
    document.head.appendChild(s);
}

// === 2. الترجمة الحقيقية عبر MyMemory API ===
async function translateText(text, from, to) {
    // تحويل 'auto' إلى لغة افتراضية
    const source = from === 'auto' ? 'ar' : from;
    
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${to}`;
    
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.responseStatus === 200 && data.responseData.translatedText) {
        return data.responseData.translatedText;
    }
    
    throw new Error(data.responseDetails || 'فشل الترجمة');
}

// زر الترجمة
els.translateBtn.addEventListener('click', async () => {
    const text = els.input.value.trim();
    if (!text) return notify('اكتب نصاً أولاً!', 'error');
    
    const originalHTML = els.translateBtn.innerHTML;
    els.translateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الترجمة...';
    els.translateBtn.disabled = true;
    
    try {
        const result = await translateText(text, els.sourceLang.value, els.targetLang.value);
        els.output.value = result;
        notify('تمت الترجمة بنجاح! ✨');
    } catch (err) {
        console.error(err);
        notify('خطأ: ' + err.message, 'error');
    } finally {
        els.translateBtn.innerHTML = originalHTML;
        els.translateBtn.disabled = false;
    }
});

// === 3. الوظائف الأساسية ===
// عداد الأحرف
els.input.addEventListener('input', () => {
    els.charCount.textContent = `${els.input.value.length}/5000`;
});

// مسح
document.getElementById('clearBtn').addEventListener('click', () => {
    els.input.value = '';
    els.output.value = '';
    els.charCount.textContent = '0/5000';
});

// تبديل اللغات
document.getElementById('swapBtn').addEventListener('click', () => {
    if (els.sourceLang.value === 'auto') return notify('لا يمكن تبديل الكشف التلقائي', 'error');
    [els.sourceLang.value, els.targetLang.value] = [els.targetLang.value, els.sourceLang.value];
    [els.input.value, els.output.value] = [els.output.value, els.input.value];
});

// نسخ
document.getElementById('copyBtn').addEventListener('click', () => {
    if (!els.output.value) return;
    navigator.clipboard.writeText(els.output.value).then(() => notify('تم النسخ! 📋'));
});

// قراءة صوتية
function speak(text, lang) {
    if (!text) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === 'auto' ? 'ar-SA' : lang;
    u.rate = 0.9;
    speechSynthesis.speak(u);
}
document.getElementById('speakInput').addEventListener('click', () => speak(els.input.value, els.sourceLang.value));
document.getElementById('speakOutput').addEventListener('click', () => speak(els.output.value, els.targetLang.value));

// === 4. المظهر الداكن/الفاتح ===
els.themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    els.themeToggle.querySelector('i').className = 
        document.body.classList.contains('light-mode') ? 'fas fa-sun' : 'fas fa-moon';
});

// === 5. استيراد الملفات ===
els.uploadZone.addEventListener('click', () => els.fileInput.click());
els.uploadZone.addEventListener('dragover', e => { e.preventDefault(); els.uploadZone.style.borderColor = 'var(--accent)'; });
els.uploadZone.addEventListener('dragleave', () => { els.uploadZone.style.borderColor = 'var(--border)'; });
els.uploadZone.addEventListener('drop', e => {
    e.preventDefault();
    els.uploadZone.style.borderColor = 'var(--border)';
    if (e.dataTransfer.files.length) loadFile(e.dataTransfer.files[0]);
});
els.fileInput.addEventListener('change', e => { if (e.target.files.length) loadFile(e.target.files[0]); });

function loadFile(file) {
    els.fileName.textContent = file.name;
    els.fileInfo.style.display = 'flex';
    const reader = new FileReader();
    reader.onload = e => {
        els.input.value = e.target.result;
        els.charCount.textContent = `${els.input.value.length}/5000`;
        notify('تم تحميل الملف! 📄');
    };
    reader.readAsText(file);
}

document.getElementById('removeFile').addEventListener('click', () => {
    els.fileInfo.style.display = 'none';
    els.fileInput.value = '';
    els.input.value = '';
    els.charCount.textContent = '0/5000';
});

// === 6. الترجمة الصوتية ===
let recognition;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SR();
    recognition.lang = 'ar-SA';
    recognition.continuous = false;
    
    recognition.onresult = e => {
        const text = e.results[0][0].transcript;
        els.voiceResult.textContent = text;
        els.voiceResult.style.display = 'block';
        els.input.value = text;
        els.charCount.textContent = `${text.length}/5000`;
        stopRec();
        notify('تم التعرف على الصوت! 🎙️');
    };
    recognition.onerror = () => { notify('خطأ في التعرف على الصوت', 'error'); stopRec(); };
    recognition.onend = stopRec;
}

els.startRecord.addEventListener('click', () => {
    if (!recognition) return notify('متصفحك لا يدعم الصوت', 'error');
    recognition.start();
    els.startRecord.disabled = true;
    els.stopRecord.disabled = false;
    els.recordingIndicator.classList.add('active');
});

els.stopRecord.addEventListener('click', () => { recognition?.stop(); stopRec(); });

function stopRec() {
    els.startRecord.disabled = false;
    els.stopRecord.disabled = true;
    els.recordingIndicator.classList.remove('active');
}
