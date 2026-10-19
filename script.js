/**
 * LingoFlow - Frontend Application Logic
 * Professional UI/UX Translation Web App
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const htmlEl = document.documentElement;
    const themeToggleBtn = document.getElementById('themeToggle');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');

    // Translator Elements
    const sourceLangSelect = document.getElementById('sourceLang');
    const targetLangSelect = document.getElementById('targetLang');
    const swapLangsBtn = document.getElementById('swapLangsBtn');
    const sourceText = document.getElementById('sourceText');
    const targetText = document.getElementById('targetText');
    const charCount = document.getElementById('charCount');
    const translateBtn = document.getElementById('translateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const pasteBtn = document.getElementById('pasteBtn');
    const copyBtn = document.getElementById('copyBtn');
    const speakTargetBtn = document.getElementById('speakTargetBtn');
    const favoriteBtn = document.getElementById('favoriteBtn');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const translationStatus = document.getElementById('translationStatus');
    const sourceLangTitle = document.getElementById('sourceLangTitle');
    const targetLangTitle = document.getElementById('targetLangTitle');

    // History & Favorites Elements
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const historyList = document.getElementById('historyList');
    const favoritesList = document.getElementById('favoritesList');
    const historyCount = document.getElementById('historyCount');
    const favCount = document.getElementById('favCount');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');

    // FAQ Elements
    const faqItems = document.querySelectorAll('.faq-item');

    // --- State Variables ---
    let historyData = JSON.parse(localStorage.getItem('lingoflow_history')) || [];
    let favoritesData = JSON.parse(localStorage.getItem('lingoflow_favorites')) || [];
    let currentTranslationResult = {
        sourceText: '',
        translatedText: '',
        sourceLang: '',
        targetLang: ''
    };

    // Language Mapping Names for UI
    const langNames = {
        'auto': 'اكتشاف تلقائي',
        'ar': 'العربية',
        'en': 'الإنجليزية',
        'fr': 'الفرنسية',
        'de': 'الألمانية',
        'es': 'الإسبانية',
        'it': 'الإيطالية',
        'tr': 'التركية',
        'ru': 'الروسية',
        'zh': 'الصينية',
        'ja': 'اليابانية',
        'ko': 'الكورية',
        'pt': 'البرتغالية',
        'hi': 'الهندية',
        'nl': 'الهولندية',
        'fa': 'الفارسية'
    };

    // --- Initialization ---
    initTheme();
    updatePanelTitles();
    renderHistory();
    renderFavorites();

    // --- Theme Management ---
    function initTheme() {
        const savedTheme = localStorage.getItem('lingoflow_theme') || 'light';
        htmlEl.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlEl.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        htmlEl.setAttribute('data-theme', newTheme);
        localStorage.setItem('lingoflow_theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        const icon = themeToggleBtn.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fa-solid fa-sun';
            themeToggleBtn.setAttribute('title', 'تبديل الوضع الفاتح');
        } else {
            icon.className = 'fa-solid fa-moon';
            themeToggleBtn.setAttribute('title', 'تبديل الوضع المظلم');
        }
    }

    // --- Mobile Menu Toggle ---
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.className = navMenu.classList.contains('active') ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuBtn.querySelector('i').className = 'fa-solid fa-bars';
        });
    });

    // --- Character Counter & RTL Direction ---
    sourceText.addEventListener('input', () => {
        const len = sourceText.value.length;
        charCount.textContent = len;
        adjustTextDirection(sourceText.value, sourceText);
    });

    function adjustTextDirection(text, element) {
        // Simple heuristic: if first characters are Arabic/Persian, set RTL
        const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
        if (text.trim().length > 0 && arabicRegex.test(text.trim().charAt(0))) {
            element.style.direction = 'rtl';
            element.style.textAlign = 'right';
        } else if (text.trim().length > 0) {
            element.style.direction = 'ltr';
            element.style.textAlign = 'left';
        }
    }

    // --- Panel Titles Update ---
    function updatePanelTitles() {
        const srcVal = sourceLangSelect.value;
        const tgtVal = targetLangSelect.value;
        sourceLangTitle.textContent = langNames[srcVal] || 'اللغة الأصلية';
        targetLangTitle.textContent = langNames[tgtVal] || 'اللغة المستهدفة';
    }

    sourceLangSelect.addEventListener('change', updatePanelTitles);
    targetLangSelect.addEventListener('change', updatePanelTitles);

    // --- Swap Languages ---
    swapLangsBtn.addEventListener('click', () => {
        const srcVal = sourceLangSelect.value;
        const tgtVal = targetLangSelect.value;

        if (srcVal === 'auto') {
            showToast('لا يمكن التبديل عندما يكون المصدر على وضع الاكتشاف التلقائي', 'error');
            return;
        }

        sourceLangSelect.value = tgtVal;
        targetLangSelect.value = srcVal;
        updatePanelTitles();

        // Swap texts if result exists
        const currentSrcText = sourceText.value;
        const currentTgtText = targetText.textContent;

        if (!targetText.classList.contains('placeholder-text') && currentTgtText) {
            sourceText.value = currentTgtText;
            targetText.textContent = currentSrcText;
            charCount.textContent = sourceText.value.length;
            adjustTextDirection(sourceText.value, sourceText);
            adjustTextDirection(currentSrcText, targetText);
        }
        showToast('تم تبديل اللغات بنجاح', 'success');
    });

    // --- Clear & Paste Actions ---
    clearBtn.addEventListener('click', () => {
        sourceText.value = '';
        charCount.textContent = '0';
        targetText.textContent = 'ستظهر الترجمة هنا...';
        targetText.classList.add('placeholder-text');
        copyBtn.disabled = true;
        speakTargetBtn.disabled = true;
        favoriteBtn.disabled = true;
        translationStatus.textContent = 'جاهز للترجمة';
        showToast('تم مسح النص', 'success');
    });

    pasteBtn.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            sourceText.value = text;
            charCount.textContent = text.length;
            adjustTextDirection(text, sourceText);
            showToast('تم لصق النص بنجاح', 'success');
        } catch (err) {
            showToast('تعذر الوصول إلى الحافظة، يرجى اللصق يدوياً', 'error');
        }
    });

    // --- Keyboard Shortcut: Ctrl + Enter ---
    sourceText.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            translateBtn.click();
        }
    });

    // --- Actual Translation Logic (Integration Ready) ---
    translateBtn.addEventListener('click', async () => {
        const textToTranslate = sourceText.value.trim();
        const srcLang = sourceLangSelect.value;
        const tgtLang = targetLangSelect.value;

        if (!textToTranslate) {
            showToast('الرجاء إدخال نص للترجمة', 'error');
            return;
        }

        if (srcLang === tgtLang && srcLang !== 'auto') {
            showToast('لا يمكن الترجمة بين نفس اللغة', 'error');
            return;
        }

        // Show Loading State
        loadingIndicator.classList.remove('hidden');
        translationStatus.textContent = 'جاري ترجمة النص...';
        translateBtn.disabled = true;

        try {
            // تنفيذ الترجمة الفعلية باستخدام MyMemory Public Translation API (مجاني ولا يتطلب مفتاح سري بالمتصفح)
            // ملاحظة إنتاجية: للمشاريع الكبيرة يُفضل استخدام خادم وسيط (Backend Proxy) لحماية مفاتيح API الخاصة بـ Google/DeepL.
            let queryLang = srcLang === 'auto' ? '' : srcLang;
            const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=${queryLang}|${tgtLang}`;

            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('فشل الاتصال بخدمة الترجمة');
            }

            const data = await response.json();

            if (data && data.responseData && data.responseData.translatedText) {
                const translated = data.responseData.translatedText;
                
                targetText.textContent = translated;
                targetText.classList.remove('placeholder-text');
                adjustTextDirection(translated, targetText);

                // Enable action buttons
                copyBtn.disabled = false;
                speakTargetBtn.disabled = false;
                favoriteBtn.disabled = false;
                translationStatus.textContent = 'تمت الترجمة بنجاح';
                showToast('تمت ترجمة النص بنجاح', 'success');

                // Save result state
                currentTranslationResult = {
                    id: Date.now(),
                    sourceText: textToTranslate,
                    translatedText: translated,
                    sourceLang: langNames[srcLang] || srcLang,
                    targetLang: langNames[tgtLang] || tgtLang,
                    date: new Date().toLocaleDateString('ar-SA')
                };

                // Add to History automatically (avoiding duplicates of exact last item)
                addToHistory(currentTranslationResult);

            } else {
                throw new Error('لم يتم استلام نتيجة صحيحة من الخادم');
            }

        } catch (error) {
            console.error('Translation error:', error);
            translationStatus.textContent = 'حدث خطأ أثناء الترجمة';
            showToast('تعذر الاتصال بخدمة الترجمة، يرجى المحاولة لاحقاً', 'error');
        } finally {
            loadingIndicator.classList.add('hidden');
            translateBtn.disabled = false;
        }
    });

    // --- Copy & Speech Synthesis ---
    copyBtn.addEventListener('click', () => {
        const text = targetText.textContent;
        navigator.clipboard.writeText(text).then(() => {
            showToast('تم نسخ الترجمة إلى الحافظة', 'success');
        }).catch(() => {
            showToast('فشل نسخ النص', 'error');
        });
    });

    speakTargetBtn.addEventListener('click', () => {
        const text = targetText.textContent;
        const tgtLang = targetLangSelect.value;

        if ('speechSynthesis' in window && text) {
            window.speechSynthesis.cancel(); // Stop any ongoing speech
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = tgtLang === 'ar' ? 'ar-SA' : (tgtLang === 'en' ? 'en-US' : tgtLang);
            window.speechSynthesis.speak(utterance);
            showToast('جاري تشغيل الصوت...', 'success');
        } else {
            showToast('متصفحك لا يدعم خاصية الاستماع الصوتي', 'error');
        }
    });

    // --- Favorites Toggle ---
    favoriteBtn.addEventListener('click', () => {
        if (!currentTranslationResult.translatedText) return;

        const existsIndex = favoritesData.findIndex(item => 
            item.sourceText === currentTranslationResult.sourceText && 
            item.translatedText === currentTranslationResult.translatedText
        );

        const icon = favoriteBtn.querySelector('i');

        if (existsIndex > -1) {
            favoritesData.splice(existsIndex, 1);
            icon.className = 'fa-regular fa-star';
            showToast('تمت الإزالة من المفضلة', 'success');
        } else {
            favoritesData.unshift(currentTranslationResult);
            icon.className = 'fa-solid fa-star';
            showToast('تمت الإضافة إلى المفضلة بنجاح', 'success');
        }

        localStorage.setItem('lingoflow_favorites', JSON.stringify(favoritesData));
        renderFavorites();
    });

    // --- History & Favorites Management ---
    function addToHistory(item) {
        // Prevent duplicate consecutive items
        if (historyData.length > 0 && historyData[0].sourceText === item.sourceText && historyData[0].translatedText === item.translatedText) {
            return;
        }
        historyData.unshift(item);
        if (historyData.length > 50) historyData.pop(); // limit to 50 items
        localStorage.setItem('lingoflow_history', JSON.stringify(historyData));
        renderHistory();
    }

    function renderHistory() {
        historyCount.textContent = historyData.length;
        if (historyData.length === 0) {
            historyList.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-clock-rotate-left"></i>
                    <p>لا توجد ترجمات سابقة حتى الآن</p>
                </div>
            `;
            return;
        }

        historyList.innerHTML = historyData.map(item => `
            <div class="history-item" data-id="${item.id}">
                <div class="history-item-header">
                    <span class="history-langs">${item.sourceLang} ➔ ${item.targetLang}</span>
                    <span>${item.date}</span>
                </div>
                <div class="history-content-grid">
                    <div class="history-text-box"><strong>الأصل:</strong> ${escapeHtml(item.sourceText)}</div>
                    <div class="history-text-box"><strong>الترجمة:</strong> ${escapeHtml(item.translatedText)}</div>
                </div>
                <div class="history-item-footer">
                    <button class="action-btn reuse-item" title="استخدام الترجمة">
                        <i class="fa-solid fa-arrow-up"></i> <span>استخدام</span>
                    </button>
                    <button class="action-btn copy-item" title="نسخ الترجمة">
                        <i class="fa-solid fa-copy"></i> <span>نسخ</span>
                    </button>
                    <button class="action-btn delete-history-item" title="حذف">
                        <i class="fa-solid fa-trash"></i> <span>حذف</span>
                    </button>
                </div>
            </div>
        `).join('');

        // Attach event listeners for history actions
        document.querySelectorAll('.delete-history-item').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                historyData.splice(index, 1);
                localStorage.setItem('lingoflow_history', JSON.stringify(historyData));
                renderHistory();
                showToast('تم حذف العنصر من السجل', 'success');
            });
        });

        document.querySelectorAll('.history-item .copy-item').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                navigator.clipboard.writeText(historyData[index].translatedText);
                showToast('تم نسخ النص المترجم', 'success');
            });
        });

        document.querySelectorAll('.reuse-item').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                sourceText.value = historyData[index].sourceText;
                targetText.textContent = historyData[index].translatedText;
                targetText.classList.remove('placeholder-text');
                charCount.textContent = sourceText.value.length;
                copyBtn.disabled = false;
                speakTargetBtn.disabled = false;
                favoriteBtn.disabled = false;
                window.scrollTo({ top: document.getElementById('translator').offsetTop - 80, behavior: 'smooth' });
                showToast('تم استرجاع الترجمة بنجاح', 'success');
            });
        });
    }

    function renderFavorites() {
        favCount.textContent = favoritesData.length;
        if (favoritesData.length === 0) {
            favoritesList.innerHTML = `
                <div class="empty-state">
                    <i class="fa-regular fa-star"></i>
                    <p>لم تقم بإضافة أي ترجمات إلى المفضلة بعد</p>
                </div>
            `;
            return;
        }

        favoritesList.innerHTML = favoritesData.map((item, index) => `
            <div class="history-item">
                <div class="history-item-header">
                    <span class="history-langs">${item.sourceLang} ➔ ${item.targetLang}</span>
                    <span>${item.date}</span>
                </div>
                <div class="history-content-grid">
                    <div class="history-text-box"><strong>الأصل:</strong> ${escapeHtml(item.sourceText)}</div>
                    <div class="history-text-box"><strong>الترجمة:</strong> ${escapeHtml(item.translatedText)}</div>
                </div>
                <div class="history-item-footer">
                    <button class="action-btn remove-fav-item" data-index="${index}" title="إزالة من المفضلة">
                        <i class="fa-solid fa-trash"></i> <span>إزالة</span>
                    </button>
                </div>
            </div>
        `).join('');

        document.querySelectorAll('.remove-fav-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.currentTarget.getAttribute('data-index');
                favoritesData.splice(idx, 1);
                localStorage.setItem('lingoflow_favorites', JSON.stringify(favoritesData));
                renderFavorites();
                showToast('تمت الإزالة من المفضلة', 'success');
            });
        });
    }

    clearHistoryBtn.addEventListener('click', () => {
        if (confirm('هل أنت متأكد من مسح جميع سجل الترجمات؟')) {
            historyData = [];
            localStorage.removeItem('lingoflow_history');
            renderHistory();
            showToast('تم مسح سجل الترجمات بالكامل', 'success');
        }
    });

    // --- Tabs Switching ---
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const targetTab = btn.getAttribute('data-tab');
            if (targetTab === 'history') {
                document.getElementById('historyTab').classList.add('active');
            } else {
                document.getElementById('favoritesTab').classList.add('active');
            }
        });
    });

    // --- FAQ Accordion ---
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(i => i.classList.remove('active'));
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // --- Toast Notification System ---
    function showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const iconClass = type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation';
        toast.innerHTML = `
            <i class="${iconClass}"></i>
            <span>${escapeHtml(message)}</span>
        `;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // --- Security Helper ---
    function escapeHtml(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }
});
