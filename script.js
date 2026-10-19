// ==================== المتغيرات العامة ====================
let translationHistory = JSON.parse(localStorage.getItem('translationHistory')) || [];
const MAX_HISTORY = 10;
const MAX_CHARS = 5000;

// ==================== عناصر DOM ====================
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const fromLanguage = document.getElementById('fromLanguage');
const toLanguage = document.getElementById('toLanguage');
const translateBtn = document.getElementById('translateBtn');
const swapBtn = document.getElementById('swapBtn');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const charCount = document.getElementById('charCount');
const themeToggle = document.getElementById('themeToggle');
const fileUploadArea = document.getElementById('fileUploadArea');
const fileInput = document.getElementById('fileInput');
const fileStatus = document.getElementById('fileStatus');
const historyList = document.getElementById('historyList');

// ==================== لغات متاحة ====================
const languages = {
    ar: 'العربية',
    en: 'الإنجليزية',
    fr: 'الفرنسية',
    es: 'الإسبانية',
    de: 'الألمانية',
    zh: 'الصينية',
    ja: 'اليابانية',
    ko: 'الكورية',
    pt: 'البرتغالية',
    ru: 'الروسية'
};

// ==================== دالة الترجمة الرئيسية ====================
async function translateText() {
    const text = inputText.value.trim();
    
    if (!text) {
        showNotification('الرجاء إدخال نص للترجمة', 'warning');
        return;
    }

    if (fromLanguage.value === toLanguage.value) {
        showNotification('الرجاء اختيار لغتين مختلفتين', 'warning');
        return;
    }

    translateBtn.disabled = true;
    translateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الترجمة...';

    try {
        // محاكاة API للترجمة (استبدل بـ API حقيقي)
        const translatedText = await performTranslation(
            text,
            fromLanguage.value,
            toLanguage.value
        );

        outputText.value = translatedText;
        
        // إضافة للسجل
        addToHistory(text, translatedText, fromLanguage.value, toLanguage.value);
        
        showNotification('تمت الترجمة بنجاح!', 'success');
    } catch (error) {
        showNotification('حدث خطأ في الترجمة. حاول لاحقاً', 'error');
        console.error(error);
    } finally {
        translateBtn.disabled = false;
        translateBtn.innerHTML = '<i class="fas fa-language"></i> ترجم الآن';
    }
}

// ==================== دالة محاكاة الترجمة ====================
async function performTranslation(text, fromLang, toLang) {
    // في التطبيق الحقيقي، استخدم API مثل Google Translate أو Microsoft Translator
    // هنا سنحاكي عملية الترجمة
    
    return new Promise((resolve) => {
        setTimeout(() => {
            // محاكاة الترجمة بسيطة
            let translated = text;
            
            // قاموس بسيط للترجمة
            const dictionary = {
                'مرحبا': 'Hello',
                'شكراً': 'Thank you',
                'أهلا': 'Hi',
                'وداعاً': 'Goodbye',
                'من فضلك': 'Please',
                'عفواً': 'Sorry',
            };

            // محاولة استبدال الكلمات المعروفة
            Object.keys(dictionary).forEach(word => {
                translated = translated.replace(
                    new RegExp(word, 'g'),
                    `[${dictionary[word]}]`
                );
            });

            // إذا لم تكن هناك ترجمات، أضف علامة توضيحية
            if (translated === text) {
                translated = `[ترجمة ${languages[toLang]} للنص: "${text}"]`;
            }

            resolve(translated);
        }, 1000);
    });
}

// ==================== إضافة للسجل ====================
function addToHistory(original, translated, fromLang, toLang) {
    const historyItem = {
        id: Date.now(),
        original,
        translated,
        fromLang,
        toLang,
        timestamp: new Date().toLocaleString('ar-EG')
    };

    translationHistory.unshift(historyItem);
    
    if (translationHistory.length > MAX_HISTORY) {
        translationHistory.pop();
    }

    localStorage.setItem('translationHistory', JSON.stringify(translationHistory));
    renderHistory();
}

// ==================== عرض السجل ====================
function renderHistory() {
    historyList.innerHTML = '';

    if (translationHistory.length === 0) {
        historyList.innerHTML = '<p class="no-history">لا توجد ترجمات سابقة</p>';
        return;
    }

    translationHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="history-content">
                <div class="history-langs">
                    <span class="lang-badge">${languages[item.fromLang]}</span>
                    <i class="fas fa-arrow-left"></i>
                    <span class="lang-badge">${languages[item.toLang]}</span>
                </div>
                <p class="history-original"><strong>النص الأصلي:</strong> ${item.original.substring(0, 50)}...</p>
                <p class="history-translated"><strong>الترجمة:</strong> ${item.translated.substring(0, 50)}...</p>
                <small class="history-time">${item.timestamp}</small>
            </div>
            <div class="history-actions">
                <button class="icon-btn" onclick="loadFromHistory(${item.id})" title="استخدم هذه الترجمة">
                    <i class="fas fa-redo"></i>
                </button>
                <button class="icon-btn" onclick="deleteFromHistory(${item.id})" title="حذف">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        historyList.appendChild(historyItem);
    });
}

// ==================== تحميل من السجل ====================
function loadFromHistory(id) {
    const item = translationHistory.find(h => h.id === id);
    if (item) {
        inputText.value = item.original;
        fromLanguage.value = item.fromLang;
        toLanguage.value = item.toLang;
        outputText.value = item.translated;
        inputText.focus();
    }
}

// ==================== حذف من السجل ====================
function deleteFromHistory(id) {
    translationHistory = translationHistory.filter(h => h.id !== id);
    localStorage.setItem('translationHistory', JSON.stringify(translationHistory));
    renderHistory();
    showNotification('تم حذف العنصر من السجل', 'success');
}

// ==================== تبديل اللغات ====================
function swapLanguages() {
    const temp = fromLanguage.value;
    fromLanguage.value = toLanguage.value;
    toLanguage.value = temp;

    // تبديل النصوص أيضاً
    const tempText = inputText.value;
    inputText.value = outputText.value;
    outputText.value = tempText;

    updateCharCount();
}

// ==================== حساب عدد الأحرف ====================
function updateCharCount() {
    const count = inputText.value.length;
    const percentage = (count / MAX_CHARS) * 100;
    
    charCount.textContent = `${count} / ${MAX_CHARS}`;
    charCount.style.color = percentage > 80 ? '#ef4444' : 'var(--text-light)';
}

// ==================== مسح النص ====================
function clearInput() {
    if (inputText.value && confirm('هل تريد مسح النص؟')) {
        inputText.value = '';
        outputText.value = '';
        charCount.textContent = '0 / 5000';
        inputText.focus();
    }
}

// ==================== نسخ النص ====================
function copyToClipboard() {
    if (!outputText.value) {
        showNotification('لا يوجد نص للنسخ', 'warning');
        return;
    }

    navigator.clipboard.writeText(outputText.value).then(() => {
        showNotification('تم نسخ النص!', 'success');
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
        }, 2000);
    });
}

// ==================== تحميل النص ====================
function downloadTranslation() {
    if (!outputText.value) {
        showNotification('لا يوجد ترجمة لتحميلها', 'warning');
        return;
    }

    const element = document.createElement('a');
    const text = `النص الأصلي:\n${inputText.value}\n\n${'='.repeat(50)}\n\nالترجمة:\n${outputText.value}`;
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', `ترجمة_${Date.now()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showNotification('تم تحميل الترجمة!', 'success');
}

// ==================== رفع الملفات ====================
function setupFileUpload() {
    fileUploadArea.addEventListener('click', () => fileInput.click());

    fileUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadArea.classList.add('dragover');
    });

    fileUploadArea.addEventListener('dragleave', () => {
        fileUploadArea.classList.remove('dragover');
    });

    fileUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadArea.classList.remove('dragover');
        handleFileUpload(e.dataTransfer.files[0]);
    });

    fileInput.addEventListener('change', (e) => {
        handleFileUpload(e.target.files[0]);
    });
}

// ==================== معالجة الملفات ====================
function handleFileUpload(file) {
    if (!file) return;

    const validTypes = ['text/plain', 'application/pdf', 
                       'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                       'application/vnd.ms-excel'];

    if (!validTypes.includes(file.type)) {
        showNotification('نوع الملف غير مدعوم', 'error');
        return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
        showNotification('حجم الملف كبير جداً (الحد الأقصى: 10MB)', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        inputText.value = e.target.result.substring(0, MAX_CHARS);
        updateCharCount();
        fileStatus.innerHTML = `<span class="success-msg">✓ تم تحميل الملف بنجاح</span>`;
        setTimeout(() => fileStatus.innerHTML = '', 3000);
    };

    reader.onerror = () => {
        showNotification('حدث خطأ في قراءة الملف', 'error');
    };

    reader.readAsText(file);
}

// ==================== نمط مظلم/فاتح ====================
function setupThemeToggle() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme');
        const newTheme = theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    themeToggle.innerHTML = theme === 'light' 
        ? '<i class="fas fa-moon"></i>' 
        : '<i class="fas fa-sun"></i>';
}

// ==================== إشعارات ====================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ==================== الأحداث ====================
translateBtn.addEventListener('click', translateText);
inputText.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        translateText();
    }
});
inputText.addEventListener('input', updateCharCount);
swapBtn.addEventListener('click', swapLanguages);
clearBtn.addEventListener('click', clearInput);
copyBtn.addEventListener('click', copyToClipboard);
downloadBtn.addEventListener('click', downloadTranslation);

// ==================== التهيئة ====================
document.addEventListener('DOMContentLoaded', () => {
    setupThemeToggle();
    setupFileUpload();
    renderHistory();
    updateCharCount();
});

// ==================== تأثيرات الحركة ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
