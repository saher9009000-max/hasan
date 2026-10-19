/* ==========================================
   قائمة اللغات المدعومة
   ================================---------- */
const languages = {
    "ar": "العربية",
    "en": "الإنجليزية",
    "fr": "الفرنسية",
    "de": "الألمانية",
    "es": "الإسبانية",
    "it": "الإيطالية",
    "tr": "التركية",
    "ru": "الروسية",
    "zh": "الصينية",
    "ja": "اليابانية",
    "ko": "الكورية",
    "pt": "البرتغالية",
    "hi": "الهندية",
    "nl": "الهولندية",
    "fa": "الفارسية"
};

/* ==========================================
   عناصر DOM الأساسية
   ================================---------- */
const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const sourceLangSelect = document.getElementById('sourceLang');
const targetLangSelect = document.getElementById('targetLang');
const swapLangsBtn = document.getElementById('swapLangs');
const sourceText = document.getElementById('sourceText');
const targetText = document.getElementById('targetText');
const charCount = document.getElementById('charCount');
const translateBtn = document.getElementById('translateBtn');
const clearBtn = document.getElementById('clearBtn');
const pasteBtn = document.getElementById('pasteBtn');
const copyBtn = document.getElementById('copyBtn');
const speakBtn = document.getElementById('speakBtn');
const favoriteBtn = document.getElementById('favoriteBtn');
const loadingIndicator = document.getElementById('loadingIndicator');
const translationStatus = document.getElementById('translationStatus');
const toastContainer = document.getElementById('toastContainer');

const historyList = document.getElementById('historyList');
const favoritesList = document.getElementById('favoritesList');
const historyCount = document.getElementById('historyCount');
const favoriteCount = document.getElementById('favoriteCount');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const faqItems = document.querySelectorAll('.faq-item');

let currentTranslationData = null;
let isTranslating = false;

/* ==========================================
   تهيئة التطبيق عند التحميل
   ================================---------- */
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    populateLanguageSelects();
    loadHistoryAndFavorites();
    setupEventListeners();
});

/* ==========================================
   إدارة الوضع الليلي والنهاري (Dark/Light Mode)
   ================================---------- */
function initTheme() {
    const savedTheme = localStorage.getItem('lingoflow_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('lingoflow_theme', newTheme);
    showToast(`تم التفعيل إلى ${newTheme === 'dark' ? 'الوضع المظلم' : 'الوضع الفاتح'}`, 'success');
});

/* ==========================================
   قائمة الهواتف المحمولة Navbar Mobile
   ================================---------- */
menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

/* ==========================================
   تعبئة قوائم اللغات
   ================================---------- */
function populateLanguageSelects() {
    // تعبئة لغة الهدف (بدون خيار الاكتشاف التلقائي)
    for (const [code, name] of Object.entries(languages)) {
        const optionTarget = document.createElement('option');
        optionTarget.value = code;
        optionTarget.textContent = name;
        if (code === 'en') optionTarget.selected = true; // الافتراضي إلى الإنجليزية
        targetLangSelect.appendChild(optionTarget);

        const optionSource = document.createElement('option');
        optionSource.value = code;
        optionSource.textContent = name;
        sourceLangSelect.appendChild(optionSource);
    }
    // ضبط الافتراضي للغة المصدر على العربية أو الاكتشاف التلقائي
    sourceLangSelect.value = 'auto';
}

/* ==========================================
   مستمعات الأحداث (Event Listeners)
   ================================---------- */
function setupEventListeners() {
    // عداد الأحرف واتجاه النص
    sourceText.addEventListener('input', () => {
        const len = sourceText.value.length;
        charCount.textContent = len;
        updateTextDirection(sourceText.value, sourceText);
    });

    // زر الترجمة
    translateBtn.addEventListener('click', performTranslation);

    // اختصار لوحة المفاتيح Ctrl + Enter
    sourceText.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            performTranslation();
        }
    });

    // زر مسح النص
    clearBtn.addEventListener('click', () => {
        sourceText.value = '';
        charCount.textContent = '0';
        targetText.innerHTML = 'ستظهر الترجمة هنا...';
        targetText.className = 'output-placeholder';
        copyBtn.disabled = true;
        speakBtn.disabled = true;
        favoriteBtn.disabled = true;
        favoriteBtn.innerHTML = '<i class="fa-regular fa-star"></i> المفضلة';
        translationStatus.textContent = 'جاهز للترجمة';
        currentTranslationData = null;
        showToast('تم مسح النص بنجاح', 'success');
    });

    // زر لصق النص
    pasteBtn.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            sourceText.value = text;
            charCount.textContent = text.length;
            updateTextDirection(text, sourceText);
            showToast('تم لصق النص بنجاح', 'success');
        } catch (err) {
            showToast('تعذر الوصول إلى الحافظة', 'error');
        }
    });

    // زر تبديل اللغات
    swapLangsBtn.addEventListener('click', () => {
        const srcVal = sourceLangSelect.value;
        const tgtVal = targetLangSelect.value;

        if (srcVal === 'auto') {
            showToast('لا يمكن التبديل عندما يكون المصدر على وضع الاكتشاف التلقائي', 'error');
            return;
        }

        sourceLangSelect.value = tgtVal;
        targetLangSelect.value = srcVal;

        // تبديل النصوص أيضاً إذا وُجدت
        const tempSrc = sourceText.value;
        const tempTgt = targetText.classList.contains('output-placeholder') ? '' : targetText.textContent;
        
        if (tempTgt) {
            sourceText.value = tempTgt;
            charCount.textContent = tempTgt.length;
            targetText.textContent = tempSrc;
            updateTextDirection(tempTgt, sourceText);
            updateTextDirection(tempSrc, targetText);
        }
        showToast('تم تبديل اللغات', 'success');
    });

    // زر نسخ الترجمة
    copyBtn.addEventListener('click', () => {
        const textToCopy = targetText.textContent;
        if (!textToCopy) return;
        navigator.clipboard.writeText(textToCopy).then(() => {
            showToast('تم نسخ الترجمة إلى الحافظة', 'success');
        });
    });

    // زر النطق الصوتي (Speech Synthesis API)
    speakBtn.addEventListener('click', () => {
        const textToSpeak = targetText.textContent;
        const tgtLang = targetLangSelect.value;
        if (!textToSpeak || !('speechSynthesis' in window)) {
            showToast('خاصية النطق غير مدعومة في متصفحك', 'error');
            return;
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = tgtLang;
        window.speechSynthesis.speak(utterance);
        showToast('جاري تشغيل النطق الصوتي...', 'success');
    });

    // زر المفضلة
    favoriteBtn.addEventListener('click', () => {
        if (!currentTranslationData) return;
        toggleFavorite(currentTranslationData);
    });

    // التبديل بين تبويبات السجل والمفضلة
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            const targetTab = document.getElementById(`${btn.dataset.tab}-tab`);
            if (targetTab) targetTab.classList.add('active');
        });
    });

    // زر مسح السجل
    clearHistoryBtn.addEventListener('click', () => {
        if (confirm('هل أنت متأكد من مسح سجل الترجمات بالكامل؟')) {
            localStorage.removeItem('lingoflow_history');
            loadHistoryAndFavorites();
            showToast('تم مسح السجل بنجاح', 'success');
        }
    });

    // تفعيل الأسئلة الشائعة FAQ Accordion
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            faqItems.forEach(i => i.classList.remove('active'));
            if (!isOpen) {
                item.classList.add('active');
            }
        });
    });
}

/* ==========================================
   اكتشاف اتجاه النص (RTL / LTR)
   ================================---------- */
function updateTextDirection(text, element) {
    const arabicRegex = /[\u0600-\u06FF]/;
    if (arabicRegex.test(text)) {
        element.style.direction = 'rtl';
        element.style.textAlign = 'right';
    } else {
        element.style.direction = 'ltr';
        element.style.textAlign = 'left';
    }
}

/* ==========================================
   نظام الترجمة الفعلي (MyMemory Translation API)
   ================================---------- */
async function performTranslation() {
    const text = sourceText.value.trim();
    const srcLang = sourceLangSelect.value;
    const tgtLang = targetLangSelect.value;

    if (!text) {
        showToast('الرجاء كتابة نص للترجمة', 'error');
        sourceText.focus();
        return;
    }

    if (isTranslating) return;

    isTranslating = true;
    translateBtn.disabled = true;
    loadingIndicator.classList.remove('hidden');
    targetText.textContent = '';
    translationStatus.textContent = 'جاري المعالجة...';

    try {
        let langPair = `${srcLang === 'auto' ? '' : srcLang}|${tgtLang}`;
        const encodedText = encodeURIComponent(text);
        const apiUrl = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${langPair}`;

        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('فشل الاتصال بخدمة الترجمة');
        }

        const data = await response.json();

        if (data && data.responseData && data.responseData.translatedText) {
            const translated = data.responseData.translatedText;
            
            targetText.classList.remove('output-placeholder');
            targetText.textContent = translated;
            updateTextDirection(translated, targetText);

            copyBtn.disabled = false;
            speakBtn.disabled = false;
            favoriteBtn.disabled = false;
            translationStatus.textContent = 'تمت الترجمة بنجاح';

            // تجهيز كائن الترجمة الحالي للحفظ
            currentTranslationData = {
                id: Date.now().toString(),
                sourceText: text,
                targetText: translated,
                sourceLang: srcLang === 'auto' ? 'اكتشاف تلقائي' : languages[srcLang],
                targetLang: languages[tgtLang],
                timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
                isFavorite: false
            };

            saveToHistory(currentTranslationData);
            showToast('تمت الترجمة بنجاح', 'success');
        } else {
            throw new Error('تعذر جلب نتيجة الترجمة');
        }
    } catch (error) {
        console.error(error);
        targetText.classList.add('output-placeholder');
        targetText.textContent = 'حدث خطأ أثناء الاتصال بخدمة الترجمة. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.';
        translationStatus.textContent = 'خطأ في الترجمة';
        showToast('تعذر إتمام الترجمة، حاول مرة أخرى', 'error');
    } finally {
        isTranslating = false;
        translateBtn.disabled = false;
        loadingIndicator.classList.add('hidden');
    }
}

/* ==========================================
   إدارة السجل والمفضلة (LocalStorage)
   ================================---------- */
function getHistory() {
    try {
        return JSON.parse(localStorage.getItem('lingoflow_history')) || [];
    } catch {
        return [];
    }
}

function saveHistory(history) {
    try {
        localStorage.setItem('lingoflow_history', JSON.stringify(history));
    } catch (e) {
        console.error('LocalStorage error:', e);
    }
}

function saveToHistory(item) {
    let history = getHistory();
    // تجنب التكرار المباشر لآخر عنصر مدخل
    if (history.length > 0 && history[0].sourceText === item.sourceText && history[0].targetText === item.targetText) {
        return;
    }
    history.unshift(item);
    if (history.length > 50) history.pop(); // الاحتفاظ بأحدث 50 عنصراً
    saveHistory(history);
    loadHistoryAndFavorites();
}

function loadHistoryAndFavorites() {
    const history = getHistory();
    historyCount.textContent = history.length;
    
    const favorites = history.filter(item => item.isFavorite);
    favoriteCount.textContent = favorites.length;

    renderHistoryList(history);
    renderFavoritesList(favorites);
}

function renderHistoryList(history) {
    if (history.length === 0) {
        historyList.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-clock-rotate-left"></i>
                <p>لا توجد ترجمات سابقة في السجل</p>
            </div>
        `;
        return;
    }

    historyList.innerHTML = '';
    history.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `
            <div class="history-item-header">
                <span>${item.sourceLang} ➔ ${item.targetLang}</span>
                <span>${item.timestamp}</span>
            </div>
            <div class="history-item-body">
                <div class="history-text-box">${escapeHTML(item.sourceText)}</div>
                <div class="history-text-box">${escapeHTML(item.targetText)}</div>
            </div>
            <div class="history-item-footer">
                <button class="tool-btn" onclick="restoreTranslation('${item.id}')" title="استعادة الترجمة"><i class="fa-solid fa-arrow-up"></i> استعادة</button>
                <button class="tool-btn" onclick="toggleFavoriteById('${item.id}')" title="المفضلة"><i class="${item.isFavorite ? 'fa-solid fa-star' : 'fa-regular fa-star'}"></i></button>
                <button class="tool-btn" onclick="deleteHistoryItem('${item.id}')" title="حذف"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        historyList.appendChild(div);
    });
}

function renderFavoritesList(favorites) {
    if (favorites.length === 0) {
        favoritesList.innerHTML = `
            <div class="empty-state">
                <i class="fa-regular fa-star"></i>
                <p>لا توجد عناصر مضافة إلى المفضلة حتى الآن</p>
            </div>
        `;
        return;
    }

    favoritesList.innerHTML = '';
    favorites.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `
            <div class="history-item-header">
                <span>${item.sourceLang} ➔ ${item.targetLang}</span>
                <span>${item.timestamp}</span>
            </div>
            <div class="history-item-body">
                <div class="history-text-box">${escapeHTML(item.sourceText)}</div>
                <div class="history-text-box">${escapeHTML(item.targetText)}</div>
            </div>
            <div class="history-item-footer">
                <button class="tool-btn" onclick="restoreTranslation('${item.id}')" title="استعادة الترجمة"><i class="fa-solid fa-arrow-up"></i> استعادة</button>
                <button class="tool-btn" onclick="toggleFavoriteById('${item.id}')" title="إزالة من المفضلة"><i class="fa-solid fa-star"></i></button>
                <button class="tool-btn" onclick="deleteHistoryItem('${item.id}')" title="حذف"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        favoritesList.appendChild(div);
    });
}

window.restoreTranslation = function(id) {
    const history = getHistory();
    const item = history.find(i => i.id === id);
    if (item) {
        sourceText.value = item.sourceText;
        charCount.textContent = item.sourceText.length;
        targetText.classList.remove('output-placeholder');
        targetText.textContent = item.targetText;
        copyBtn.disabled = false;
        speakBtn.disabled = false;
        favoriteBtn.disabled = false;
        currentTranslationData = item;
        
        if (item.isFavorite) {
            favoriteBtn.innerHTML = '<i class="fa-solid fa-star"></i> المفضلة';
        } else {
            favoriteBtn.innerHTML = '<i class="fa-regular fa-star"></i> المفضلة';
        }

        window.scrollTo({ top: document.getElementById('translator').offsetTop - 80, behavior: 'smooth' });
        showToast('تم استعادة الترجمة بنجاح', 'success');
    }
};

window.toggleFavoriteById = function(id) {
    let history = getHistory();
    const item = history.find(i => i.id === id);
    if (item) {
        item.isFavorite = !item.isFavorite;
        saveHistory(history);
        loadHistoryAndFavorites();
        if (currentTranslationData && currentTranslationData.id === id) {
            currentTranslationData.isFavorite = item.isFavorite;
            if (item.isFavorite) {
                favoriteBtn.innerHTML = '<i class="fa-solid fa-star"></i> المفضلة';
            } else {
                favoriteBtn.innerHTML = '<i class="fa-regular fa-star"></i> المفضلة';
            }
        }
        showToast(item.isFavorite ? 'تمت الإضافة للمفضلة' : 'تمت الإزالة من المفضلة', 'success');
    }
};

function toggleFavorite(item) {
    let history = getHistory();
    const index = history.findIndex(i => i.id === item.id);
    if (index !== -1) {
        history[index].isFavorite = !history[index].isFavorite;
        item.isFavorite = history[index].isFavorite;
        saveHistory(history);
        loadHistoryAndFavorites();
        if (item.isFavorite) {
            favoriteBtn.innerHTML = '<i class="fa-solid fa-star"></i> المفضلة';
            showToast('تمت الإضافة للمفضلة', 'success');
        } else {
            favoriteBtn.innerHTML = '<i class="fa-regular fa-star"></i> المفضلة';
            showToast('تمت الإزالة من المفضلة', 'success');
        }
    }
}

window.deleteHistoryItem = function(id) {
    let history = getHistory();
    history = history.filter(i => i.id !== id);
    saveHistory(history);
    loadHistoryAndFavorites();
    showToast('تم حذف العنصر بنجاح', 'success');
};

/* ==========================================
   نظام الإشعارات Toast Notifications
   ================================---------- */
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = type === 'success' ? '<i class="fa-solid fa-circle-check" style="color: #10b981;"></i>' : '<i class="fa-solid fa-circle-exclamation" style="color: #ef4444;"></i>';
    toast.innerHTML = `${icon} <span>${message}</span>`;
    
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-100%)';
        toast.style.transition = '0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/* ==========================================
   تأمين النصوص ضد ثغرات XSS
   ================================---------- */
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}
