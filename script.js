// عناصر DOM
const sourceText = document.getElementById('sourceText');
const targetText = document.getElementById('targetText');
const sourceLang = document.getElementById('sourceLang');
const targetLang = document.getElementById('targetLang');
const translateBtn = document.getElementById('translateBtn');
const swapBtn = document.getElementById('swapBtn');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const charCount = document.getElementById('charCount');
const loading = document.getElementById('loading');
const themeToggle = document.getElementById('themeToggle');
const toast = document.getElementById('toast');
const historyList = document.getElementById('historyList');

// تبديل الثيم (Dark / Light)
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
});

// عداد الحروف
sourceText.addEventListener('input', () => {
    const len = sourceText.value.length;
    charCount.textContent = len;
    if (len > 5000) {
        sourceText.value = sourceText.value.substring(0, 5000);
        charCount.textContent = 5000;
    }
});

// زر مسح النص
clearBtn.addEventListener('click', () => {
    sourceText.value = '';
    targetText.value = '';
    charCount.textContent = '0';
});

// زر تبديل اللغات
swapBtn.addEventListener('click', () => {
    const tempLang = sourceLang.value;
    sourceLang.value = targetLang.value;
    targetLang.value = tempLang;

    const tempText = sourceText.value;
    sourceText.value = targetText.value;
    targetText.value = tempText;
    charCount.textContent = sourceText.value.length;
});

// محاكاة الترجمة الفورية (يمكن ربطها بأي API حقيقي مثل Google Translate أو MyMemory)
translateBtn.addEventListener('click', async () => {
    const text = sourceText.value.trim();
    if (!text) return;

    loading.style.display = 'flex';
    targetText.value = '';

    // محاكاة تأقلم الشبكة (يمكنك استبدالها بطلب Fetch لـ API حقيقي)
    setTimeout(() => {
        // محاكاة ترجمة ذكية كمثال تجريبي
        targetText.value = `[ترجمة إلى ${targetLang.options[targetLang.selectedIndex].text}]: ${text}`;
        loading.style.display = 'none';
        
        // حفظ في السجل المحلي
        saveToHistory(text, targetText.value);
    }, 800);
});

// نسخ النص المترجم
copyBtn.addEventListener('click', () => {
    if (!targetText.value) return;
    navigator.clipboard.writeText(targetText.value);
    showToast();
});

// إظهار إشعار النسخ
function showToast() {
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// ميزة الاستماع للنص (Text-to-Speech)
document.getElementById('speakSource').addEventListener('click', () => {
    speakText(sourceText.value, sourceLang.value);
});

document.getElementById('speakTarget').addEventListener('click', () => {
    speakText(targetText.value, targetLang.value);
});

function speakText(text, lang) {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'ar' ? 'ar-SA' : (lang === 'en' ? 'en-US' : lang);
    window.speechSynthesis.speak(utterance);
}

// حفظ وعرض السجل (LocalStorage History)
function saveToHistory(src, tgt) {
    let history = JSON.parse(localStorage.getItem('translation_history')) || [];
    history.unshift({ src, tgt, time: new Date().toLocaleTimeString('ar-SA') });
    if (history.length > 5) history.pop(); // الاحتفاظ بآخر 5 ترجمات فقط
    localStorage.setItem('translation_history', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    let history = JSON.parse(localStorage.getItem('translation_history')) || [];
    if (history.length === 0) {
        historyList.innerHTML = '<p class="no-history">لا توجد ترجمات سابقة حتى الآن.</p>';
        return;
    }
    
    historyList.innerHTML = history.map(item => `
        <div class="history-item">
            <span><strong>من:</strong> ${item.src}</span>
            <span><strong>إلى:</strong> ${item.tgt}</span>
        </div>
    `).join('');
}

// تحميل السجل عند فتح الصفحة
renderHistory();
