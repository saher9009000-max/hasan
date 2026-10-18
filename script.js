
/**
 * ترجمتي - موقع الترجمة الشامل
 * ملف البرمجة الرئيسي (script.js)
 */

document.addEventListener('DOMContentLoaded', () => {
    // عناصر DOM
    const themeToggleBtn = document.getElementById('theme-toggle');
    const sourceTextarea = document.getElementById('source-text');
    const targetTextDiv = document.getElementById('target-text');
    const sourceLangSelect = document.getElementById('source-lang');
    const targetLangSelect = document.getElementById('target-lang');
    const swapLangsBtn = document.getElementById('swap-langs');
    const translateBtn = document.getElementById('translate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const charCountSpan = document.getElementById('char-count');
    const welcomeHint = document.getElementById('welcome-hint');
    const loadingSpinner = document.getElementById('loading-spinner');
    const errorMessage = document.getElementById('error-message');
    const speakSourceBtn = document.getElementById('speak-source');
    const speakTargetBtn = document.getElementById('speak-target');
    const copySourceBtn = document.getElementById('copy-source');
    const copyTargetBtn = document.getElementById('copy-target');
    const dirToggleBtn = document.getElementById('dir-toggle');
    const fileUploadInput = document.getElementById('file-upload');
    const clearHistoryBtn = document.getElementById('clear-history');
    const historyListContainer = document.getElementById('history-list');
    const toast = document.getElementById('toast');

    // تهيئة الوضع الليلي/النهاري
    const savedTheme = localStorage.getItem('tarjamati_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('tarjamati_theme', newTheme);
    });

    // تحديث عدد الأحرف وتلميح الترحيب
    function updateSourceState() {
        const text = sourceTextarea.value;
        const length = text.length;
        charCountSpan.textContent = `${length} / 5000`;

        if (length > 0) {
            welcomeHint.classList.add('hidden');
        } else {
            welcomeHint.classList.remove('hidden');
        }
    }

    sourceTextarea.addEventListener('input', updateSourceState);

    // زر مسح الكل
    clearBtn.addEventListener('click', () => {
        sourceTextarea.value = '';
        targetTextDiv.textContent = '';
        targetTextDiv.removeAttribute('dir');
        speakTargetBtn.disabled = true;
        copyTargetBtn.disabled = true;
        errorMessage.classList.add('hidden');
        updateSourceState();
    });

    // رفع واستيراد الملفات النصية
    fileUploadInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            sourceTextarea.value = event.target.result;
            updateSourceState();
            showToast('تم استيراد الملف بنجاح');
            fileUploadInput.value = '';
        };
        reader.onerror = () => {
            showError('فشل قراءة الملف المختار.');
        };
        reader.readAsText(file);
    });

    // تبديل اللغات والنصوص
    swapLangsBtn.addEventListener('click', () => {
        const srcVal = sourceLangSelect.value;
        const tgtVal = targetLangSelect.value;

        if (srcVal === 'auto') {
            showToast('اختر لغة محددة للتبديل بدلاً من التلقائي');
            return;
        }

        sourceLangSelect.value = tgtVal;
        targetLangSelect.value = srcVal;

        const srcText = sourceTextarea.value;
        const tgtText = targetTextDiv.textContent;

        if (tgtText) {
            sourceTextarea.value = tgtText;
            targetTextDiv.textContent = srcText;
            updateSourceState();
        }
    });

    // دالة تنفيذ الترجمة المستقرة مجاناً مع MyMemory API
    async function translateText() {
        const text = sourceTextarea.value.trim();
        if (!text) {
            showError('الرجاء كتابة أو لصق نص لترجمته.');
            return;
        }

        if (text.length > 5000) {
            showError('النص طويل جداً. الحد الأقصى هو 5000 حرف.');
            return;
        }

        let sourceLang = sourceLangSelect.value;
        const targetLang = targetLangSelect.value;

        if (sourceLang === targetLang && sourceLang !== 'auto') {
            showError('اللغة المصدر واللغة الهدف متطابقتان.');
            return;
        }

        if (sourceLang === 'auto') {
            sourceLang = 'autodetect';
        }

        errorMessage.classList.add('hidden');
        loadingSpinner.classList.remove('hidden');
        targetTextDiv.textContent = '';

        try {
            const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error('فشل الاتصال بخدمة الترجمة.');
            }

            const data = await response.json();
            
            if (data && data.responseData && data.responseData.translatedText) {
                const translated = data.responseData.translatedText;
                targetTextDiv.textContent = translated;
                speakTargetBtn.disabled = false;
                copyTargetBtn.disabled = false;

                if (targetLang === 'ar') {
                    targetTextDiv.setAttribute('dir', 'rtl');
                } else {
                    targetTextDiv.setAttribute('dir', 'ltr');
                }

                saveToHistory(text, translated, sourceLangSelect.value, targetLang);
            } else {
                throw new Error('لم يتم استلام نتيجة ترجمة صالحة.');
            }
        } catch (err) {
            console.error(err);
            showError('تعذّر إجراء الترجمة حالياً. تحقق من اتصالك بالإنترنت أو أعد المحاولة.');
        } finally {
            loadingSpinner.classList.add('hidden');
        }
    }

    translateBtn.addEventListener('click', translateText);

    // تغيير اتجاه النص
    dirToggleBtn.addEventListener('click', () => {
        const currentDir = targetTextDiv.getAttribute('dir');
        if (currentDir === 'rtl') {
            targetTextDiv.setAttribute('dir', 'ltr');
            showToast('تم التغيير إلى اليسار LTR');
        } else {
            targetTextDiv.setAttribute('dir', 'rtl');
            showToast('تم التغيير إلى اليمين RTL');
        }
    });

    // الصوت والاستماع
    function speakText(text, lang) {
        if (!('speechSynthesis' in window)) {
            showToast('خاصية الصوت غير مدعومة في متصفحك.');
            return;
        }

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === 'auto' ? 'ar' : lang;
        window.speechSynthesis.speak(utterance);
    }

    speakSourceBtn.addEventListener('click', () => {
        const text = sourceTextarea.value.trim();
        if (text) speakText(text, sourceLangSelect.value);
    });

    speakTargetBtn.addEventListener('click', () => {
        const text = targetTextDiv.textContent.trim();
        if (text) speakText(text, targetLangSelect.value);
    });

    // النسخ إلى الحافظة
    function copyToClipboard(text, message) {
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            showToast(message);
        }).catch(() => {
            showToast('فشل النسخ.');
        });
    }

    copySourceBtn.addEventListener('click', () => {
        copyToClipboard(sourceTextarea.value, 'تم نسخ النص الأصلي');
    });

    copyTargetBtn.addEventListener('click', () => {
        copyToClipboard(targetTextDiv.textContent, 'تم نسخ الترجمة');
    });

    function showError(msg) {
        errorMessage.textContent = msg;
        errorMessage.classList.remove('hidden');
    }

    function showToast(msg) {
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // سجل الترجمة المحلي
    function getHistory() {
        try {
            return JSON.parse(localStorage.getItem('tarjamati_history')) || [];
        } catch {
            return [];
        }
    }

    function saveToHistory(src, tgt, srcLang, tgtLang) {
        let history = getHistory();
        history = history.filter(item => item.src !== src);
        
        const newItem = {
            id: Date.now(),
            src,
            tgt,
            srcLang,
            tgtLang,
            time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
        };

        history.unshift(newItem);
        if (history.length > 20) history.pop();
        localStorage.setItem('tarjamati_history', JSON.stringify(history));
        renderHistory();
    }

    function renderHistory() {
        const history = getHistory();
        if (history.length === 0) {
            historyListContainer.innerHTML = '<p class="empty-history">لا توجد ترجمات سابقة في السجل.</p>';
            return;
        }

        historyListContainer.innerHTML = '';
        history.forEach(item => {
            const el = document.createElement('div');
            el.className = 'history-item';
            el.innerHTML = `
                <div class="history-content">
                    <div class="history-text-pair">
                        <span class="history-src">${escapeHtml(item.src)}</span>
                        <span>➔</span>
                        <span class="history-tgt">${escapeHtml(item.tgt)}</span>
                    </div>
                    <span class="history-meta">${item.srcLang.toUpperCase()} إلى ${item.tgtLang.toUpperCase()} • ${item.time}</span>
                </div>
                <div class="history-actions">
                    <button class="icon-btn sm restore-btn" title="استعادة">
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
                    </button>
                    <button class="icon-btn sm delete-item-btn" title="حذف">
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
            `;

            el.querySelector('.restore-btn').addEventListener('click', () => {
                sourceTextarea.value = item.src;
                targetTextDiv.textContent = item.tgt;
                sourceLangSelect.value = item.srcLang;
                targetLangSelect.value = item.tgtLang;
                speakTargetBtn.disabled = false;
                copyTargetBtn.disabled = false;
                updateSourceState();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            el.querySelector('.delete-item-btn').addEventListener('click', () => {
                deleteHistoryItem(item.id);
            });

            historyListContainer.appendChild(el);
        });
    }

    function deleteHistoryItem(id) {
        let history = getHistory();
        history = history.filter(item => item.id !== id);
        localStorage.setItem('tarjamati_history', JSON.stringify(history));
        renderHistory();
    }

    clearHistoryBtn.addEventListener('click', () => {
        localStorage.removeItem('tarjamati_history');
        renderHistory();
        showToast('تم مسح السجل');
    });

    function escapeHtml(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    renderHistory();
});
