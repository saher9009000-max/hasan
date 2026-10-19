document.addEventListener('DOMContentLoaded', () => {
    const htmlEl = document.documentElement;
    const themeToggleBtn = document.getElementById('themeToggle');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');

    const sourceLangSelect = document.getElementById('sourceLang');
    const targetLangSelect = document.getElementById('targetLang');
    const swapLangsBtn = document.getElementById('swapLangsBtn');
    const sourceText = document.getElementById('sourceText');
    const targetText = document.getElementById('targetText');
    const charCount = document.getElementById('charCount');
    const translateBtn = document.getElementById('translateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const pasteBtn = document.getElementById('pasteBtn');
    const fileInput = document.getElementById('fileInput');
    const copyBtn = document.getElementById('copyBtn');
    const speakTargetBtn = document.getElementById('speakTargetBtn');
    const favoriteBtn = document.getElementById('favoriteBtn');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const translationStatus = document.getElementById('translationStatus');
    const sourceLangTitle = document.getElementById('sourceLangTitle');
    const targetLangTitle = document.getElementById('targetLangTitle');

    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const historyList = document.getElementById('historyList');
    const favoritesList = document.getElementById('favoritesList');
    const historyCount = document.getElementById('historyCount');
    const favCount = document.getElementById('favCount');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');

    let historyData = JSON.parse(localStorage.getItem('lingoflow_history')) || [];
    let favoritesData = JSON.parse(localStorage.getItem('lingoflow_favorites')) || [];
    let currentTranslationResult = { sourceText: '', translatedText: '', sourceLang: '', targetLang: '' };

    const langNames = {
        'auto': 'اكتشاف تلقائي', 'ar': 'العربية', 'en': 'الإنجليزية', 'fr': 'الفرنسية',
        'de': 'الألمانية', 'es': 'الإسبانية', 'it': 'الإيطالية', 'tr': 'التركية',
        'ru': 'الروسية', 'zh': 'الصينية', 'ja': 'اليابانية', 'ko': 'الكورية',
        'pt': 'البرتغالية', 'hi': 'الهندية', 'nl': 'الهولندية', 'fa': 'الفارسية'
    };

    initTheme();
    updatePanelTitles();
    renderHistory();
    renderFavorites();

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
        icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }

    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    sourceText.addEventListener('input', () => {
        charCount.textContent = sourceText.value.length;
        adjustTextDirection(sourceText.value, sourceText);
    });

    function adjustTextDirection(text, element) {
        const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
        if (text.trim().length > 0 && arabicRegex.test(text.trim().charAt(0))) {
            element.style.direction = 'rtl';
            element.style.textAlign = 'right';
        } else if (text.trim().length > 0) {
            element.style.direction = 'ltr';
            element.style.textAlign = 'left';
        }
    }

    function updatePanelTitles() {
        sourceLangTitle.textContent = langNames[sourceLangSelect.value] || 'اللغة الأصلية';
        targetLangTitle.textContent = langNames[targetLangSelect.value] || 'اللغة المستهدفة';
    }

    sourceLangSelect.addEventListener('change', updatePanelTitles);
    targetLangSelect.addEventListener('change', updatePanelTitles);

    // إصلاح زر تبديل اللغات بشكل تفعيلي سليم
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

        const currentSrcText = sourceText.value;
        const currentTgtText = targetText.textContent;

        if (!targetText.classList.contains('placeholder-text') && currentTgtText) {
            sourceText.value = currentTgtText;
            targetText.textContent = currentSrcText;
            charCount.textContent = sourceText.value.length;
            adjustTextDirection(sourceText.value, sourceText);
        }
        showToast('تم تبديل اللغات بنجاح', 'success');
    });

    // زر استيراد الملفات
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            const content = event.target.result;
            sourceText.value = content;
            charCount.textContent = content.length;
            adjustTextDirection(content, sourceText);
            showToast('تم استيراد الملف بنجاح', 'success');
        };
        reader.onerror = function() {
            showToast('حدث خطأ أثناء قراءة الملف', 'error');
        };
        reader.readAsText(file);
        // إعادة تعيين الحقل ليسمح باستيراد نفس الملف مرة أخرى إذا رغب المستخدم
        fileInput.value = '';
    });

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
            showToast('تعذر الوصول إلى الحافظة', 'error');
        }
    });

    sourceText.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            translateBtn.click();
        }
    });

    translateBtn.addEventListener('click', async () => {
        const textToTranslate = sourceText.value.trim();
        const srcLang = sourceLangSelect.value;
        const tgtLang = targetLangSelect.value;

        if (!textToTranslate) {
            showToast('الرجاء إدخال نص للترجمة', 'error');
            return;
        }

        loadingIndicator.classList.remove('hidden');
        translationStatus.textContent = 'جاري ترجمة النص...';
        translateBtn.disabled = true;

        try {
            let queryLang = srcLang === 'auto' ? '' : srcLang;
            const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=${queryLang}|${tgtLang}`;

            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('فشل الاتصال');

            const data = await response.json();
            if (data && data.responseData && data.responseData.translatedText) {
                const translated = data.responseData.translatedText;
                targetText.textContent = translated;
                targetText.classList.remove('placeholder-text');
                adjustTextDirection(translated, targetText);

                copyBtn.disabled = false;
                speakTargetBtn.disabled = false;
                favoriteBtn.disabled = false;
                translationStatus.textContent = 'تمت الترجمة بنجاح';
                showToast('تمت الترجمة بنجاح', 'success');

                currentTranslationResult = {
                    id: Date.now(),
                    sourceText: textToTranslate,
                    translatedText: translated,
                    sourceLang: langNames[srcLang] || srcLang,
                    targetLang: langNames[tgtLang] || tgtLang,
                    date: new Date().toLocaleDateString('ar-SA')
                };
                addToHistory(currentTranslationResult);
            } else {
                throw new Error('خطأ في النتيجة');
            }
        } catch (error) {
            translationStatus.textContent = 'حدث خطأ';
            showToast('تعذر الاتصال بخدمة الترجمة', 'error');
        } finally {
            loadingIndicator.classList.add('hidden');
            translateBtn.disabled = false;
        }
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(targetText.textContent).then(() => {
            showToast('تم النسخ إلى الحافظة', 'success');
        });
    });

    speakTargetBtn.addEventListener('click', () => {
        const text = targetText.textContent;
        if ('speechSynthesis' in window && text) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = targetLangSelect.value === 'ar' ? 'ar-SA' : 'en-US';
            window.speechSynthesis.speak(utterance);
            showToast('جاري تشغيل الصوت...', 'success');
        } else {
            showToast('غير مدعوم في متصفحك', 'error');
        }
    });

    favoriteBtn.addEventListener('click', () => {
        if (!currentTranslationResult.translatedText) return;
        favoritesData.unshift(currentTranslationResult);
        localStorage.setItem('lingoflow_favorites', JSON.stringify(favoritesData));
        renderFavorites();
        showToast('تمت الإضافة للمفضلة', 'success');
    });

    function addToHistory(item) {
        historyData.unshift(item);
        if (historyData.length > 50) historyData.pop();
        localStorage.setItem('lingoflow_history', JSON.stringify(historyData));
        renderHistory();
    }

    function renderHistory() {
        historyCount.textContent = historyData.length;
        if (historyData.length === 0) {
            historyList.innerHTML = `<div class="empty-state"><i class="fa-solid fa-clock-rotate-left"></i><p>لا توجد ترجمات سابقة</p></div>`;
            return;
        }
        historyList.innerHTML = historyData.map((item, index) => `
            <div class="history-item" style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:8px; padding:15px; margin-bottom:10px;">
                <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:8px;"><b>${item.sourceLang} ➔ ${item.targetLang}</b></div>
                <div style="font-size:0.95rem;"><b>الأصل:</b> ${item.sourceText}</div>
                <div style="font-size:0.95rem; margin-top:5px;"><b>الترجمة:</b> ${item.translatedText}</div>
            </div>
        `).join('');
    }

    function renderFavorites() {
        favCount.textContent = favoritesData.length;
        if (favoritesData.length === 0) {
            favoritesList.innerHTML = `<div class="empty-state"><i class="fa-regular fa-star"></i><p>لا توجد مفضلات</p></div>`;
            return;
        }
        favoritesList.innerHTML = favoritesData.map(item => `
            <div class="history-item" style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:8px; padding:15px; margin-bottom:10px;">
                <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:8px;"><b>${item.sourceLang} ➔ ${item.targetLang}</b></div>
                <div style="font-size:0.95rem;"><b>الأصل:</b> ${item.sourceText}</div>
                <div style="font-size:0.95rem; margin-top:5px;"><b>الترجمة:</b> ${item.translatedText}</div>
            </div>
        `).join('');
    }

    clearHistoryBtn.addEventListener('click', () => {
        historyData = [];
        localStorage.removeItem('lingoflow_history');
        renderHistory();
        showToast('تم مسح السجل', 'success');
    });

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.getAttribute('data-tab') + 'Tab').classList.add('active');
        });
    });

    function showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color:#10b981;"></i><span>${message}</span>`;
        toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
});
