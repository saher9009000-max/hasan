/* ==========================================
   LingoFlow Application Logic
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --- DOM Elements --- */
    const themeToggle = document.getElementById('themeToggle');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    
    const sourceLang = document.getElementById('sourceLang');
    const targetLang = document.getElementById('targetLang');
    const swapLangsBtn = document.getElementById('swapLangsBtn');
    
    const sourceText = document.getElementById('sourceText');
    const targetText = document.getElementById('targetText');
    const charCount = document.getElementById('charCount');
    
    const clearSourceBtn = document.getElementById('clearSourceBtn');
    const pasteBtn = document.getElementById('pasteBtn');
    const speakSourceBtn = document.getElementById('speakSourceBtn');
    
    const copyTargetBtn = document.getElementById('copyTargetBtn');
    const speakTargetBtn = document.getElementById('speakTargetBtn');
    const favoriteBtn = document.getElementById('favoriteBtn');
    const clearTargetBtn = document.getElementById('clearTargetBtn');
    
    const translateBtn = document.getElementById('translateBtn');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    const historyList = document.getElementById('historyList');
    const favoritesList = document.getElementById('favoritesList');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    const clearFavoritesBtn = document.getElementById('clearFavoritesBtn');
    const favCount = document.getElementById('favCount');
    
    const toastContainer = document.getElementById('toastContainer');
    const faqItems = document.querySelectorAll('.faq-item');

    /* --- State Management --- */
    let history = JSON.parse(localStorage.getItem('lingoflow_history')) || [];
    let favorites = JSON.parse(localStorage.getItem('lingoflow_favorites')) || [];
    let currentTranslatedResult = "";

    /* --- Initialization --- */
    initTheme();
    renderHistory();
    renderFavorites();

    /* ==========================================
       Theme Toggle
       ========================================== */
    function initTheme() {
        const savedTheme = localStorage.getItem('lingoflow_theme') || 
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('lingoflow_theme', newTheme);
    });

    /* --- Mobile Menu --- */
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => navMenu.classList.remove('active'));
    });

    /* ==========================================
       Character Counter & Textarea Actions
       ========================================== */
    sourceText.addEventListener('input', () => {
        const len = sourceText.value.length;
        charCount.textContent = len;
    });

    clearSourceBtn.addEventListener('click', () => {
        sourceText.value = '';
        charCount.textContent = '0';
        sourceText.focus();
    });

    pasteBtn.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            sourceText.value = text;
            charCount.textContent = text.length;
            showToast('تم لصق النص بنجاح', 'success');
        } catch (err) {
            showToast('تعذر الوصول إلى الحافظة', 'error');
        }
    });

    clearTargetBtn.addEventListener('click', () => {
        targetText.innerHTML = '<span class="placeholder-text">ستظهر الترجمة هنا فوراً...</span>';
        currentTranslatedResult = "";
        copyTargetBtn.disabled = true;
        speakTargetBtn.disabled = true;
        favoriteBtn.disabled = true;
        favoriteBtn.querySelector('i').className = "fa-regular fa-star";
    });

    /* ==========================================
       Language Swap
       ========================================== */
    swapLangsBtn.addEventListener('click', () => {
        const sVal = sourceLang.value;
        const tVal = targetLang.value;
        
        if (sVal === 'auto') {
            showToast('لا يمكن التبديل عندما يكون مصدر اللغة "اكتشاف تلقائي"', 'info');
            return;
        }
        
        sourceLang.value = tVal;
        targetLang.value = sVal;
        
        // Swap text if translation exists
        if (currentTranslatedResult && sourceText.value) {
            const temp = sourceText.value;
            sourceText.value = currentTranslatedResult;
            charCount.textContent = sourceText.value.length;
            targetText.textContent = temp;
            currentTranslatedResult = temp;
        }
    });

    /* ==========================================
       Translation Engine (MyMemory Real API)
       ========================================== */
    async function translateText(text, src, tgt) {
        if (!text.trim()) return "";
        
        // Handle auto-detect for MyMemory API (uses 'autodetect' or omits)
        let langPair = `${src === 'auto' ? '' : src}|${tgt}`;
        if (src === 'auto') {
            langPair = `en|${tgt}`; // Fallback default source if auto
        }

        const encodedText = encodeURIComponent(text);
        const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${langPair}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('حدث خطأ في الاتصال بخدمة الترجمة.');
        }

        const data = await response.json();
        if (data && data.responseData && data.responseData.translatedText) {
            return data.responseData.translatedText;
        } else {
            throw new Error('فشل معالجة الترجمة من الخادم.');
        }
    }

    translateBtn.addEventListener('click', handleTranslationProcess);

    sourceText.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            handleTranslationProcess();
        }
    });

    async function handleTranslationProcess() {
        const text = sourceText.value.trim();
        if (!text) {
            showToast('الرجاء إدخال نص للترجمة أولاً', 'error');
            sourceText.focus();
            return;
        }

        const src = sourceLang.value;
        const tgt = targetLang.value;

        if (src === tgt && src !== 'auto') {
            showToast('اللغة الأصلية واللغة المستهدفة متطابقتان', 'error');
            return;
        }

        // Show loading state
        loadingOverlay.classList.remove('hidden');
        translateBtn.disabled = true;

        try {
            const result = await translateText(text, src, tgt);
            currentTranslatedResult = result;
            
            targetText.textContent = result;
            copyTargetBtn.disabled = false;
            speakTargetBtn.disabled = false;
            favoriteBtn.disabled = false;
            
            // Check if already in favorites
            updateFavoriteButtonState();

            // Save to history
            saveToHistory(text, result, src, tgt);
            showToast('تمت الترجمة بنجاح', 'success');

        } catch (error) {
            showToast(error.message || 'تعذر إتمام الترجمة، تأكد من الاتصال بالإنترنت', 'error');
        } finally {
            loadingOverlay.classList.add('hidden');
            translateBtn.disabled = false;
        }
    }

    /* ==========================================
       Clipboard & Speech Synthesis
       ========================================== */
    copyTargetBtn.addEventListener('click', async () => {
        if (!currentTranslatedResult) return;
        try {
            await navigator.clipboard.writeText(currentTranslatedResult);
            showToast('تم نسخ الترجمة إلى الحافظة', 'success');
        } catch (err) {
            showToast('تعذر النسخ إلى الحافظة', 'error');
        }
    });

    speakSourceBtn.addEventListener('click', () => {
        speakText(sourceText.value, sourceLang.value);
    });

    speakTargetBtn.addEventListener('click', () => {
        speakText(currentTranslatedResult, targetLang.value);
    });

    function speakText(text, langCode) {
        if (!text) return;
        if (!('speechSynthesis' in window)) {
            showToast('خاصية القراءة الصوتية غير مدعومة في متصفحك', 'error');
            return;
        }

        window.speechSynthesis.cancel(); // Stop any ongoing speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = langCode === 'auto' ? 'en-US' : langCode;
        utterance.rate = 1.0;
        
        utterance.onerror = () => {
            showToast('حدث خطأ أثناء تشغيل الصوت', 'error');
        };

        window.speechSynthesis.speak(utterance);
    }

    /* ==========================================
       History & Favorites Management (localStorage)
       ========================================== */
    function saveToHistory(orig, trans, src, tgt) {
        const record = {
            id: Date.now(),
            original: orig,
            translated: trans,
            sourceLang: src,
            targetLang: tgt,
            date: new Date().toLocaleDateString('ar-SA')
        };

        history.unshift(record);
        if (history.length > 30) history.pop(); // Max 30 items
        localStorage.setItem('lingoflow_history', JSON.stringify(history));
        renderHistory();
    }

    function renderHistory() {
        if (history.length === 0) {
            historyList.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-box-open"></i>
                    <p>لا توجد ترجمات سابقة في السجل بعد.</p>
                </div>
            `;
            return;
        }

        historyList.innerHTML = history.map(item => `
            <div class="record-card" data-id="${item.id}">
                <div class="record-header">
                    <span class="record-langs">${item.sourceLang.toUpperCase()} → ${item.targetLang.toUpperCase()}</span>
                    <span>${item.date}</span>
                </div>
                <div class="record-body">
                    <div class="record-text-item">${escapeHTML(item.original)}</div>
                    <div class="record-text-item target">${escapeHTML(item.translated)}</div>
                </div>
                <div class="record-footer">
                    <button class="tool-btn reuse-record" title="استخدام هذه الترجمة" aria-label="استخدام">
                        <i class="fa-solid fa-arrow-turn-up"></i>
                    </button>
                    <button class="tool-btn copy-record" title="نسخ النتيجة" aria-label="نسخ">
                        <i class="fa-solid fa-copy"></i>
                    </button>
                    <button class="tool-btn delete-record text-danger" title="حذف" aria-label="حذف">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>
        `).join('');

        attachHistoryListeners();
    }

    function attachHistoryListeners() {
        document.querySelectorAll('.reuse-record').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.record-card');
                const id = Number(card.dataset.id);
                const item = history.find(h => h.id === id);
                if (item) {
                    sourceText.value = item.original;
                    charCount.textContent = item.original.length;
                    sourceLang.value = item.sourceLang;
                    targetLang.value = item.targetLang;
                    targetText.textContent = item.translated;
                    currentTranslatedResult = item.translated;
                    copyTargetBtn.disabled = false;
                    speakTargetBtn.disabled = false;
                    favoriteBtn.disabled = false;
                    updateFavoriteButtonState();
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                    showToast('تم استرجاع الترجمة بنجاح', 'info');
                }
            });
        });

        document.querySelectorAll('.copy-record').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const card = e.target.closest('.record-card');
                const id = Number(card.dataset.id);
                const item = history.find(h => h.id === id);
                if (item) {
                    await navigator.clipboard.writeText(item.translated);
                    showToast('تم نسخ الترجمة إلى الحافظة', 'success');
                }
            });
        });

        document.querySelectorAll('.delete-record').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.record-card');
                const id = Number(card.dataset.id);
                history = history.filter(h => h.id !== id);
                localStorage.setItem('lingoflow_history', JSON.stringify(history));
                renderHistory();
                showToast('تم حذف العنصر من السجل', 'info');
            });
        });
    }

    clearHistoryBtn.addEventListener('click', () => {
        if (confirm('هل أنت متأكد من مسح جميع سجل الترجمات؟')) {
            history = [];
            localStorage.removeItem('lingoflow_history');
            renderHistory();
            showToast('تم مسح السجل بالكامل', 'success');
        }
    });

    /* --- Favorites Logic --- */
    favoriteBtn.addEventListener('click', () => {
        if (!currentTranslatedResult) return;
        
        const currentRecord = {
            id: Date.now(),
            original: sourceText.value,
            translated: currentTranslatedResult,
            sourceLang: sourceLang.value,
            targetLang: targetLang.value
        };

        const index = favorites.findIndex(f => f.translated === currentTranslatedResult && f.original === sourceText.value);
        if (index > -1) {
            favorites.splice(index, 1);
            showToast('تمت الإزالة من المفضلة', 'info');
        } else {
            favorites.unshift(currentRecord);
            showToast('تمت الإضافة إلى المفضلة', 'success');
        }

        localStorage.setItem('lingoflow_favorites', JSON.stringify(favorites));
        renderFavorites();
        updateFavoriteButtonState();
    });

    function updateFavoriteButtonState() {
        const isFav = favorites.some(f => f.translated === currentTranslatedResult && f.original === sourceText.value);
        const icon = favoriteBtn.querySelector('i');
        if (isFav) {
            icon.className = "fa-solid fa-star";
            favoriteBtn.style.color = "var(--warning)";
        } else {
            icon.className = "fa-regular fa-star";
            favoriteBtn.style.color = "inherit";
        }
    }

    function renderFavorites() {
        favCount.textContent = favorites.length;
        if (favorites.length === 0) {
            favoritesList.innerHTML = `
                <div class="empty-state">
                    <i class="fa-regular fa-star"></i>
                    <p>لم تقم بحفظ أي ترجمات في المفضلة بعد.</p>
                </div>
            `;
            return;
        }

        favoritesList.innerHTML = favorites.map(item => `
            <div class="record-card fav-card" data-id="${item.id}">
                <div class="record-header">
                    <span class="record-langs">${item.sourceLang.toUpperCase()} → ${item.targetLang.toUpperCase()}</span>
                    <button class="tool-btn remove-fav text-danger" title="إزالة من المفضلة"><i class="fa-solid fa-star"></i></button>
                </div>
                <div class="record-body">
                    <div class="record-text-item">${escapeHTML(item.original)}</div>
                    <div class="record-text-item target">${escapeHTML(item.translated)}</div>
                </div>
                <div class="record-footer">
                    <button class="tool-btn reuse-fav" title="استخدام"><i class="fa-solid fa-arrow-turn-up"></i></button>
                    <button class="tool-btn copy-fav" title="نسخ"><i class="fa-solid fa-copy"></i></button>
                </div>
            </div>
        `).join('');

        attachFavoritesListeners();
    }

    function attachFavoritesListeners() {
        document.querySelectorAll('.remove-fav').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.fav-card');
                const id = Number(card.dataset.id);
                favorites = favorites.filter(f => f.id !== id);
                localStorage.setItem('lingoflow_favorites', JSON.stringify(favorites));
                renderFavorites();
                updateFavoriteButtonState();
                showToast('تمت الإزالة من المفضلة', 'info');
            });
        });

        document.querySelectorAll('.reuse-fav').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.fav-card');
                const id = Number(card.dataset.id);
                const item = favorites.find(f => f.id === id);
                if (item) {
                    sourceText.value = item.original;
                    charCount.textContent = item.original.length;
                    sourceLang.value = item.sourceLang;
                    targetLang.value = item.targetLang;
                    targetText.textContent = item.translated;
                    currentTranslatedResult = item.translated;
                    copyTargetBtn.disabled = false;
                    speakTargetBtn.disabled = false;
                    favoriteBtn.disabled = false;
                    updateFavoriteButtonState();
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                    showToast('تم استرجاع الترجمة من المفضلة', 'info');
                }
            });
        });

        document.querySelectorAll('.copy-fav').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const card = e.target.closest('.fav-card');
                const id = Number(card.dataset.id);
                const item = favorites.find(f => f.id === id);
                if (item) {
                    await navigator.clipboard.writeText(item.translated);
                    showToast('تم نسخ الترجمة إلى الحافظة', 'success');
                }
            });
        });
    }

    clearFavoritesBtn.addEventListener('click', () => {
        if (confirm('هل أنت متأكد من إفراغ قائمة المفضلة؟')) {
            favorites = [];
            localStorage.removeItem('lingoflow_favorites');
            renderFavorites();
            updateFavoriteButtonState();
            showToast('تم إفراغ المفضلة بالكامل', 'success');
        }
    });

    /* ==========================================
       Tabs Navigation (History / Favorites)
       ========================================== */
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            const targetTab = document.getElementById(btn.dataset.tab);
            targetTab.classList.add('active');
        });
    });

    /* ==========================================
       FAQ Accordion
       ========================================== */
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        questionBtn.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            faqItems.forEach(i => i.classList.remove('active'));
            if (!isOpen) {
                item.classList.add('active');
            }
        });
    });

    /* ==========================================
       Toast Notification System
       ========================================== */
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let iconClass = 'fa-solid fa-circle-info';
        if (type === 'success') iconClass = 'fa-solid fa-circle-check';
        if (type === 'error') iconClass = 'fa-solid fa-triangle-exclamation';

        toast.innerHTML = `
            <i class="${iconClass}"></i>
            <span>${escapeHTML(message)}</span>
        `;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    /* --- Security Helper --- */
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

});
