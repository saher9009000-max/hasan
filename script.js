// === 1. إدارة المظهر (Dark/Light) ===
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    const icon = themeToggle.querySelector('i');
    if (body.classList.contains('light-mode')) {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
});

// === 2. منطق الترجمة الأساسي ===
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const charCount = document.getElementById('charCount');
const translateBtn = document.getElementById('translateBtn');

// عداد الأحرف
inputText.addEventListener('input', () => {
    charCount.textContent = `${inputText.value.length}/5000`;
});

// مسح النص
document.getElementById('clearBtn').addEventListener('click', () => {
    inputText.value = '';
    outputText.value = '';
    charCount.textContent = '0/5000';
});

// تبديل اللغات
document.getElementById('swapBtn').addEventListener('click', () => {
    const source = document.getElementById('sourceLang');
    const target = document.getElementById('targetLang');
    [source.value, target.value] = [target.value, source.value];
    
    // تبديل النصوص أيضاً
    [inputText.value, outputText.value] = [outputText.value, inputText.value];
});

// محاكاة الترجمة (استبدل هذا بـ API حقيقي مثل Google Translate)
translateBtn.addEventListener('click', () => {
    if (!inputText.value.trim()) return alert('الرجاء كتابة نص أولاً');
    
    translateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الترجمة...';
    
    setTimeout(() => {
        // محاكاة بسيطة للترجمة
        outputText.value = `[${document.getElementById('targetLang').value.toUpperCase()}] ${inputText.value}`;
        translateBtn.innerHTML = '<i class="fas fa-bolt"></i> ترجم الآن';
    }, 1000);
});

// نسخ النص
document.getElementById('copyBtn').addEventListener('click', () => {
    if (outputText.value) {
        navigator.clipboard.writeText(outputText.value);
        alert('تم نسخ الترجمة!');
    }
});

// قراءة النص صوتياً
function speak(text, lang) {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'auto' ? 'ar-SA' : lang;
    speechSynthesis.speak(utterance);
}

document.getElementById('speakInput').addEventListener('click', () => 
    speak(inputText.value, document.getElementById('sourceLang').value));
    
document.getElementById('speakOutput').addEventListener('click', () => 
    speak(outputText.value, document.getElementById('targetLang').value));

// === 3. استيراد الملفات ===
const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const fileNameSpan = document.getElementById('fileName');

uploadZone.addEventListener('click', () => fileInput.click());

uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.style.borderColor = 'var(--accent)';
});

uploadZone.addEventListener('dragleave', () => {
    uploadZone.style.borderColor = 'var(--border)';
});

uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.style.borderColor = 'var(--border)';
    if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) handleFile(e.target.files[0]);
});

function handleFile(file) {
    fileNameSpan.textContent = file.name;
    fileInfo.style.display = 'flex';
    
    const reader = new FileReader();
    reader.onload = (e) => {
        inputText.value = e.target.result;
        charCount.textContent = `${inputText.value.length}/5000`;
    };
    reader.readAsText(file);
}

document.getElementById('removeFile').addEventListener('click', () => {
    fileInfo.style.display = 'none';
    fileInput.value = '';
    inputText.value = '';
    charCount.textContent = '0/5000';
});

// === 4. الترجمة الصوتية (Speech Recognition) ===
const startRecord = document.getElementById('startRecord');
const stopRecord = document.getElementById('stopRecord');
const recordingIndicator = document.getElementById('recordingIndicator');
const voiceResult = document.getElementById('voiceResult');

let recognition;

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'ar-SA';
    recognition.continuous = false;
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        voiceResult.textContent = transcript;
        voiceResult.style.display = 'block';
        inputText.value = transcript;
        charCount.textContent = `${transcript.length}/5000`;
        stopRecordingUI();
    };
    
    recognition.onerror = () => {
        alert('حدث خطأ في التعرف على الصوت');
        stopRecordingUI();
    };
    
    recognition.onend = stopRecordingUI;
}

startRecord.addEventListener('click', () => {
    if (recognition) {
        recognition.start();
        startRecord.disabled = true;
        stopRecord.disabled = false;
        recordingIndicator.classList.add('active');
    } else {
        alert('متصفحك لا يدعم الترجمة الصوتية');
    }
});

stopRecord.addEventListener('click', () => {
    if (recognition) recognition.stop();
    stopRecordingUI();
});

function stopRecordingUI() {
    startRecord.disabled = false;
    stopRecord.disabled = true;
    recordingIndicator.classList.remove('active');
}
