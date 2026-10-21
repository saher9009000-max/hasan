/* ============================================
   TranslatePro — Main JavaScript
   ============================================ */

'use strict';

// ============ DICTIONARY (Demo) ============
const DICTIONARY = {
    // عربي → إنجليزي
    'مرحبا': 'Hello', 'مرحباً': 'Hello', 'أهلا': 'Welcome', 'أهلاً': 'Welcome',
    'شكرا': 'Thank you', 'شكراً': 'Thank you', 'صباح الخير': 'Good morning',
    'مساء الخير': 'Good evening', 'كيف حالك': 'How are you',
    'اسمي': 'My name is', 'كتاب': 'Book', 'قلم': 'Pen', 'بيت': 'House',
    'سيارة': 'Car', 'ماء': 'Water', 'طعام': 'Food', 'مدرسة': 'School',
    'جامعة': 'University', 'طالب': 'Student', 'معلم': 'Teacher',
    'صديق': 'Friend', 'عائلة': 'Family', 'حب': 'Love', 'سلام': 'Peace',
    'حرب': 'War', 'وقت': 'Time', 'يوم': 'Day', 'ليل': 'Night',
    'شمس': 'Sun', 'قمر': 'Moon', 'نجم': 'Star', 'بحر': 'Sea',
    'جبل': 'Mountain', 'مدينة': 'City', 'قرية': 'Village',
    'طريق': 'Road', 'باب': 'Door', 'نافذة': 'Window', 'كرسي': 'Chair',
    'طاولة': 'Table', 'هاتف': 'Phone', 'حاسوب': 'Computer',
    'إنترنت': 'Internet', 'برمجة': 'Programming', 'موقع': 'Website',
    'تصميم': 'Design', 'تطوير': 'Development', 'ترجمة': 'Translation',
    'لغة': 'Language', 'عالم': 'World', 'دولة': 'Country',
    'مدير': 'Manager', 'شركة': 'Company', 'عمل': 'Work',
    'مال': 'Money', 'سوق': 'Market', 'سعر': 'Price',
    'جيد': 'Good', 'سيئ': 'Bad', 'كبير': 'Big', 'صغير': 'Small',
    'جميل': 'Beautiful', 'سريع': 'Fast', 'بطيء': 'Slow',
    'جديد': 'New', 'قديم': 'Old', 'سهل': 'Easy', 'صعب': 'Difficult',
    'أكل': 'Eat', 'شرب': 'Drink', 'ذهب': 'Go', 'جاء': 'Come',
    'رأى': 'See', 'سمع': 'Hear', 'كتب': 'Write', 'قرأ': 'Read',
    'نعم': 'Yes', 'لا': 'No', 'من فضلك': 'Please', 'آسف': 'Sorry',
    'وداعا': 'Goodbye', 'إلى اللقاء': 'See you later',
    'أنا': 'I', 'أنت': 'You', 'هو': 'He', 'هي': 'She',
    'نحن': 'We', 'هم': 'They', 'هذا': 'This', 'ذلك': 'That',
    'واحد': 'One', 'اثنان': 'Two', 'ثلاثة': 'Three',
    'أربعة': 'Four', 'خمسة': 'Five', 'عشرة': 'Ten',
    // إنجليزي → عربي
    'hello': 'مرحبا', 'hi': 'أهلاً', 'welcome': 'أهلاً وسهلاً',
    'thank you': 'شكراً', 'thanks': 'شكراً', 'good morning': 'صباح الخير',
    'good evening': 'مساء الخير', 'how are you': 'كيف حالك',
    'book': 'كتاب', 'pen': 'قلم', 'house': 'بيت', 'home': 'منزل',
    'car': 'سيارة', 'water': 'ماء', 'food': 'طعام',
    'school': 'مدرسة', 'university': 'جامعة', 'student': 'طالب',
    'teacher': 'معلم', 'friend': 'صديق', 'family': 'عائلة',
    'love': 'حب', 'peace': 'سلام', 'war': 'حرب', 'time': 'وقت',
    'day': 'يوم', 'night': 'ليل', 'sun': 'شمس', 'moon': 'قمر',
    'star': 'نجم', 'sea': 'بحر', 'mountain': 'جبل',
    'city': 'مدينة', 'village': 'قرية', 'road': 'طريق',
    'door': 'باب', 'window': 'نافذة', 'chair': 'كرسي',
    'table': 'طاولة', 'phone': 'هاتف', 'computer': 'حاسوب',
    'internet': 'إنترنت', 'programming': 'برمجة', 'website': 'موقع',
    'design': 'تصميم', 'development': 'تطوير', 'translation': 'ترجمة',
    'language': 'لغة', 'world': 'عالم', 'country': 'دولة',
    'manager': 'مدير', 'company': 'شركة', 'work': 'عمل',
    'money': 'مال', 'market': 'سوق', 'price': 'سعر',
    'good': 'جيد', 'bad': 'سيئ', 'big': 'كبير', 'small': 'صغير',
    'beautiful': 'جميل', 'fast': 'سريع', 'slow': 'بطيء',
    'new': 'جديد', 'old': 'قديم', 'easy': 'سهل', 'difficult': 'صعب',
    'eat': 'يأكل', 'drink': 'يشرب', 'go': 'يذهب', 'come': 'يأتي',
    'see': 'يرى', 'hear': 'يسمع', 'write': 'يكتب', 'read': 'يقرأ',
    'yes': 'نعم', 'no': 'لا', 'please': 'من فضلك', 'sorry': 'آسف',
    'goodbye': 'وداعاً', 'bye': 'إلى اللقاء',
    'i': 'أنا', 'you': 'أنت', 'he': 'هو', 'she': 'هي',
    'we': 'نحن', 'they': 'هم', 'this': 'هذا', 'that': 'ذلك',
    'one': 'واحد', 'two': 'اثنان', 'three': 'ثلاثة',
    'four': 'أربعة', 'five': 'خمسة', 'ten': 'عشرة'
};

const LANG_NAMES = {
    'ar': 'العربية', 'en': 'English', 'fr': 'Français',
    'es': 'Español', 'de': 'Deutsch', 'tr': 'Türkçe',
    'auto': 'تلقائي'
};

const STORAGE_KEYS = {
    THEME: 'tp_theme',
    HISTORY: 'tp_history'
};

const MAX_HISTORY = 20;

// ============ DOM ELEMENTS ============
const el = {
    themeToggle: document.getElementById('themeToggle'),
    sourceLang: document.getElementById('sourceLang'),
    targetLang: document.getElementById('targetLang'),
    swapBtn: document.getElementById('swapBtn'),
    sourceText: document.getElementById('sourceText'),
    targetText: document.getElementById('targetText'),
    sourceCounter: document.getElementById('sourceCounter'),
    resultBadge: document.getElementById('resultBadge'),
    translateBtn: document.getElementById('translateBtn'),
    clearBtn: document.getElementById('clearBtn'),
    copyBtn: document.getElementById('copyBtn'),
    speakSource: document.getElementById('speakSource'),
    speakTarget: document.getElementById('speakTarget'),
    historyList: document.getElementById('historyList'),
    historyEmpty: document.getElementById('historyEmpty'),
    clearHistoryBtn: document.getElementById('clearHistoryBtn'),
    toast: document.getElementById('toast')
};

// ============ STATE ============
let state = {
    theme: localStorage.getItem(STORAGE_KEYS.THEME) || 'light',
    history: JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '[]'),
    isTranslating: false
};

// ============ INIT ============
function init() {
    applyTheme(state.theme);
    renderHistory();
    bindEvents();
}

// ============ THEME ============
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    state.theme = theme;
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
}

function toggleTheme() {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    showToast(newTheme === 'dark' ? '🌙 الوضع الليلي' : '☀️ الوضع النهاري');
}

// ============ EVENTS ============
function bindEvents() {
    el.themeToggle.addEventListener('click', toggleTheme);
    el.translateBtn.addEventListener('click', handleTranslate);
    el.clearBtn.addEventListener('click', handleClear);
    el.copyBtn.addEventListener('click', handleCopy);
    el.swapBtn.addEventListener('click', handleSwap);
    el.speakSource.addEventListener('click', () => speak(el.sourceText.value, el.sourceLang.value));
    el.speakTarget.addEventListener('click', () => speak(el.targetText.textContent, el.targetLang.value));
    el.clearHistoryBtn.addEventListener('click', clearHistory);

    el.sourceText.addEventListener('input', updateCounter);
    el.sourceText.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            handleTranslate();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') handleClear();
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            handleCopy();
        }
    });
}

// ============ COUNTER ============
function updateCounter() {
    const len = el.sourceText.value.length;
    el.sourceCounter.textContent = `${len} / 5000`;
    el.sourceCounter.style.color = len > 4500 ? '#ef4444' : '';
}

// ============ TRANSLATE ============
async function handleTranslate() {
    const text = el.sourceText.value.trim();
    
    if (!text) {
        showToast('⚠️ اكتب نصاً أولاً', 'warning');
        el.sourceText.focus();
        return;
    }

    if (state.isTranslating) return;

    const sourceLang = el.sourceLang.value === 'auto' ? detectLang(text) : el.sourceLang.value;
    const targetLang = el.targetLang.value;

    if (sourceLang === targetLang) {
        showToast('⚠️ اللغتان متطابقتان', 'warning');
        return;
    }

    setLoading(true);

    try {
        const result = await simulateTranslate(text, sourceLang, targetLang);
        renderResult(result);
        addToHistory(text, result, sourceLang, targetLang);
        showToast('✓ تمت الترجمة بنجاح');
    } catch (err) {
        showToast('✗ حدث خطأ، حاول مجدداً', 'error');
    } finally {
        setLoading(false);
    }
}

function setLoading(loading) {
    state.isTranslating = loading;
    el.translateBtn.classList.toggle('is-loading', loading);
    el.resultBadge.textContent = loading ? 'جارٍ...' : 'جاهز';
    el.resultBadge.className = 'panel__badge' + (loading ? ' is-loading' : '');
}

function renderResult(text) {
    el.targetText.textContent = text;
    el.resultBadge.textContent = 'مكتمل';
    el.resultBadge.className = 'panel__badge is-done';
}

// ============ SIMULATE TRANSLATION ============
function simulateTranslate(text, from, to) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(translateText(text, from, to));
        }, 800);
    });
}

function translateText(text, from, to) {
    // Only demo translate ar<->en using dictionary
    if (!['ar', 'en'].includes(from) || !['ar', 'en'].includes(to)) {
        return `[Demo] ${text}`;
    }

    const words = text.split(/(\s+)/);
    const translated = words.map(word => {
        if (/^\s+$/.test(word)) return word;
        const clean = word.replace(/[.,!?؟،؛:]/g, '').toLowerCase();
        const punctuation = word.match(/[.,!?؟،؛:]+$/)?.[0] || '';
        const found = DICTIONARY[clean];
        return (found || `[${word}]`) + punctuation;
    }).join('');

    return translated;
}

// ============ LANGUAGE DETECTION ============
function detectLang(text) {
    const arabicPattern = /[\u0600-\u06FF]/;
    const latinPattern = /[a-zA-Z]/;
    
    if (arabicPattern.test(text)) return 'ar';
    if (latinPattern.test(text)) return 'en';
    return 'en';
}

// ============ SWAP ============
function handleSwap() {
    const sourceVal = el.sourceLang.value;
    const targetVal = el.targetLang.value;

    if (sourceVal === 'auto') {
        showToast('⚠️ اختر لغة محددة للتبديل', 'warning');
        return;
    }

    el.sourceLang.value = targetVal;
    el.targetLang.value = sourceVal;

    // Swap text content
    const sourceText = el.sourceText.value;
    const targetText = el.targetText.textContent;
    const isPlaceholder = el.targetText.querySelector('.panel__placeholder');

    if (!isPlaceholder && targetText.trim()) {
        el.sourceText.value = targetText;
        el.targetText.textContent = sourceText;
        updateCounter();
    }

    el.swapBtn.style.transform = 'rotate(180deg)';
    setTimeout(() => { el.swapBtn.style.transform = ''; }, 400);
}

// ============ CLEAR ============
function handleClear() {
    if (!el.sourceText.value) return;
    el.sourceText.value = '';
    el.targetText.innerHTML = '<span class="panel__placeholder">ستظهر الترجمة هنا...</span>';
    el.resultBadge.textContent = 'جاهز';
    el.resultBadge.className = 'panel__badge';
    updateCounter();
    el.sourceText.focus();
    showToast('✓ تم المسح');
}

// ============ COPY ============
async function handleCopy() {
    const text = el.targetText.textContent;
    const isPlaceholder = el.targetText.querySelector('.panel__placeholder');

    if (isPlaceholder || !text.trim()) {
        showToast('⚠️ لا توجد ترجمة للنسخ', 'warning');
        return;
    }

    try {
        await navigator.clipboard.writeText(text);
        showToast('✓ تم النسخ');
    } catch {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('✓ تم النسخ');
    }
}

// ============ SPEECH ============
function speak(text, lang) {
    if (!text || !text.trim()) {
        showToast('⚠️ لا يوجد نص للنطق', 'warning');
        return;
    }

    if (!('speechSynthesis' in window)) {
        showToast('✗ المتصفح لا يدعم النطق', 'error');
        return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.lang = lang === 'auto' ? 'ar-SA' : 
                      lang === 'ar' ? 'ar-SA' :
                      lang === 'en' ? 'en-US' :
                      lang === 'fr' ? 'fr-FR' :
                      lang === 'es' ? 'es-ES' :
                      lang === 'de' ? 'de-DE' :
                      lang === 'tr' ? 'tr-TR' : 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
}

// ============ HISTORY ============
function addToHistory(source, target, from, to) {
    const item = {
        id: Date.now(),
        source: source.slice(0, 200),
        target: target.slice(0, 200),
        from,
        to,
        time: new Date().toISOString()
    };

    state.history.unshift(item);
    if (state.history.length > MAX_HISTORY) {
        state.history = state.history.slice(0, MAX_HISTORY);
    }
    saveHistory();
    renderHistory();
}

function renderHistory() {
    if (!state.history.length) {
        el.historyList.innerHTML = `
            <div class="history__empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="9" y1="15" x2="15" y2="15"/>
                </svg>
                <p>لا توجد ترجمات سابقة بعد</p>
                <span>ابدأ بترجمة نصك الأول</span>
            </div>`;
        return;
    }

    el.historyList.innerHTML = state.history.map(item => `
        <div class="history-item">
            <div class="history-item__langs">
                <span>${LANG_NAMES[item.from] || item.from}</span>
                <span class="history-item__arrow">←</span>
                <span>${LANG_NAMES[item.to] || item.to}</span>
            </div>
            <div class="history-item__source">${escapeHtml(item.source)}</div>
            <div class="history-item__target">${escapeHtml(item.target)}</div>
            <div class="history-item__time">${formatTime(item.time)}</div>
        </div>
    `).join('');
}

function saveHistory() {
    try {
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(state.history));
    } catch (e) {
        console.warn('Storage error:', e);
    }
}

function clearHistory() {
    if (!state.history.length) {
        showToast('⚠️ السجل فارغ بالفعل', 'warning');
        return;
    }
    state.history = [];
    saveHistory();
    renderHistory();
    showToast('✓ تم حذف السجل');
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function formatTime(iso) {
    const date = new Date(iso);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'الآن';
    if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
    if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
    return date.toLocaleDateString('ar-EG');
}

// ============ TOAST ============
let toastTimer;
function showToast(message, type = 'success') {
    clearTimeout(toastTimer);
    el.toast.textContent = message;
    el.toast.className = 'toast toast--show';
    if (type === 'warning') el.toast.classList.add('toast--warning');
    if (type === 'error') el.toast.classList.add('toast--error');
    
    toastTimer = setTimeout(() => {
        el.toast.classList.remove('toast--show');
    }, 2500);
}

// ============ BOOT ============
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
