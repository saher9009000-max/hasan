/* ==========================================================
   ملاحظة هامة حول التكامل مع الذكاء الاصطناعي:
   الاتصال الحقيقي بواجهات الـ API الخاصة بالذكاء الاصطناعي 
   (مثل OpenAI أو Claude أو Google Gemini) يتطلب خادمًا وسيطًا 
   (Backend Proxy) لحماية مفتاح الـ API من السرقة والاستخدام غير المصرح به.
   لا تقم أبداً بوضع المفتاح السري داخل الكود البرمجي الذي يعمل في المتصفح.
   النقطة أدناه (/api/translate) تمثل المسار التجريبي للوسيط.
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // عناصر DOM
    const themeToggleBtn = document.getElementById('theme-toggle');
    const sourceLangSelect = document.getElementById('source-lang');
    const targetLangSelect = document.getElementById('target-lang');
    const swapLangBtn = document.getElementById('swap-lang');
    const sourceTextarea = document.getElementById('source-text');
    const targetTextarea = document.getElementById('target-text');
    const translateBtn = document.getElementById('translate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const pasteBtn = document.getElementById('paste-btn');
    const copySourceBtn = document.getElementById('copy-source');
    const copyTargetBtn = document.getElementById('copy-target');
    const charCounter = document.getElementById('char-counter');
    const loadingOverlay = document.getElementById('loading-overlay');
    const errorOverlay = document.getElementById('error-overlay');
    const errorMessage = document.getElementById('error-message');
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history');
    const toastContainer = document.getElementById('toast-container');

    const MAX_CHARS = 5000;

    // --- 1. إدارة الوضع الفاتح والداكن ---
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });

    function setTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        const icon = themeToggleBtn.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fa-solid fa-sun';
        } else {
            icon.className = 'fa-solid fa-moon';
        }
    }

    // --- 2. عدّاد الأحرف ---
    sourceTextarea.addEventListener('input', () => {
        const length = sourceTextarea.value.length;
        if (length > MAX_CHARS) {
            sourceTextarea.value = sourceTextarea.value.substring(0, MAX_CHARS);
        }
        charCounter.textContent = sourceTextarea.value.length;
    });

    // --- 3. أزرار التحكم بالنصوص ---
    clearBtn.addEventListener('click', () => {
        sourceTextarea.value = '';
        targetTextarea.value = '';
        charCounter.textContent = '0';
        hideError();
        showToast('تم مسح النص', 'success');
    });

    pasteBtn.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            sourceTextarea.value = text;
            sourceTextarea.dispatchEvent(new Event('input'));
            showToast('تم لصق النص بنجاح', 'success');
        } catch (err) {
            showToast('تعذر الوصول إلى الحافظة', 'error');
        }
    });

    copySourceBtn.addEventListener('click', () => {
        copyToClipboard(sourceTextarea.value, 'تم نسخ النص الأصلي');
    });

    copyTargetBtn.addEventListener('click', () => {
        copyToClipboard(targetTextarea.value, 'تم نسخ الترجمة');
    });

    function copyToClipboard(text, successMsg) {
        if (!text.trim()) {
            showToast('لا يوجد نص لنسخه', 'error');
            return;
        }
        navigator.clipboard.writeText(text).then(() => {
            showToast(successMsg, 'success');
        }).catch(() => {
            showToast('فشل النسخ', 'error');
        });
    }

    // --- 4. تبديل اللغات ---
    swapLangBtn.addEventListener('click', () => {
        const sourceVal = sourceLangSelect.value;
        const targetVal = targetLangSelect.value;

        if (sourceVal === 'auto') {
            showToast('لا يمكن التبديل عندما يكون الاكتشاف تلقائياً', 'error');
            return;
        }

        sourceLangSelect.value = targetVal;
        targetLangSelect.value = sourceVal;

        // تبديل النصوص أيضاً إذا وجدت
        const tempText = sourceTextarea.value;
        sourceTextarea.value = targetTextarea.value;
        targetTextarea.value = tempText;
        sourceTextarea.dispatchEvent(new Event('input'));
    });

    // --- 5. عملية الترجمة والاتصال بالذكاء الاصطناعي ---
    translateBtn.addEventListener('click', performTranslation);

    // اختصار لوحة المفاتيح Ctrl + Enter
    sourceTextarea.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            performTranslation();
        }
    });

    async function performTranslation() {
        const text = sourceTextarea.value.trim();
        if (!text) {
            showToast('الرجاء إدخال نص للترجمة', 'error');
            sourceTextarea.focus();
            return;
        }

        const sourceLang = sourceLangSelect.value;
        const targetLang = targetLangSelect.value;

        // إظهار حالة التحميل وإخفاء أي أخطاء سابقة
        showLoading(true);
        hideError();
        targetTextarea.value = '';

        try {
            // الاتصال بنقطة النهاية للخادم الوسيط
            const response = await fetch('/api/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: text,
                    sourceLang: sourceLang,
                    targetLang: targetLang
                })
            });

            if (!response.ok) {
                throw new Error('فشل الخادم في الرد بشكل صحيح.');
            }

            const data = await response.json();
            
            if (data && data.translatedText) {
                targetTextarea.value = data.translatedText;
                addToHistory(text, data.translatedText, sourceLang, targetLang);
                showToast('تمت الترجمة بنجاح', 'success');
            } else {
                throw new Error('استجابة غير صالحة من خدمة الترجمة.');
            }

        } catch (error) {
            // عرض رسالة واضحة للمستخدم بدل ترجمة وهمية
            showError('تعذر الاتصال بخدمة الذكاء الاصطناعي. تأكد من إعداد الخادم الوسيط (Backend Proxy) بشكل صحيح.');
        } finally {
            showLoading(false);
        }
    }

    // --- 6. إدارة حالات واجهة المستخدم (Loading & Error) ---
    function showLoading(show) {
        if (show) {
            loadingOverlay.classList.remove('hidden');
        } else {
            loadingOverlay.classList.add('hidden');
        }
    }

    function showError(msg) {
        errorMessage.textContent = msg;
        errorOverlay.classList.remove('hidden');
    }

    function hideError() {
        errorOverlay.classList.add('hidden');
    }

    // --- 7. نظام السجل (History) ---
    let translationHistory = JSON.parse(localStorage.getItem('translation_history')) || [];
    renderHistory();

    function addToHistory(source, target, sLang, tLang) {
        const newItem = {
            id: Date.now(),
            source,
            target,
            sLang,
            tLang
        };

        // إزالة التكرارات المتطابقة وإضافة الجديد في البداية
        translationHistory = [newItem, ...translationHistory.filter(item => item.source !== source)].slice(0, 10);
        localStorage.setItem('translation_history', JSON.stringify(translationHistory));
        renderHistory();
    }

    function renderHistory() {
        if (translationHistory.length === 0) {
            historyList.innerHTML = '<div class="empty-history">لا توجد ترجمات سابقة حتى الآن.</div>';
            return;
        }

        historyList.innerHTML = '';
        translationHistory.forEach(item => {
            const div = document.createElement('div');
            div.className = 'history-item';
            div.innerHTML = `
                <div class="history-content" title="انقر للاستعادة">
                    <span class="history-langs">${item.sLang.toUpperCase()} ➔ ${item.tLang.toUpperCase()}</span>
                    <span class="history-texts">${escapeHtml(item.source)}</span>
                </div>
                <button class="history-delete" title="حذف من السجل"><i class="fa-solid fa-xmark"></i></button>
            `;

            // النقر للاستعادة
            div.querySelector('.history-content').addEventListener('click', () => {
                sourceLangSelect.value = item.sLang;
                targetLangSelect.value = item.tLang;
                sourceTextarea.value = item.source;
                targetTextarea.value = item.target;
                sourceTextarea.dispatchEvent(new Event('input'));
                window.scrollTo({ top: 0, behavior: 'smooth' });
                showToast('تم استعادة الترجمة', 'success');
            });

            // حذف عنصر محدد
            div.querySelector('.history-delete').addEventListener('click', (e) => {
                e.stopPropagation();
                translationHistory = translationHistory.filter(h => h.id !== item.id);
                localStorage.setItem('translation_history', JSON.stringify(translationHistory));
                renderHistory();
                showToast('تم حذف العنصر من السجل', 'success');
            });

            historyList.appendChild(div);
        });
    }

    clearHistoryBtn.addEventListener('click', () => {
        translationHistory = [];
        localStorage.removeItem('translation_history');
        renderHistory();
        showToast('تم مسح السجل بالكامل', 'success');
    });

    // --- 8. إشعارات Toast اللطيفة ---
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? '<i class="fa-solid fa-circle-check" style="color: #22c55e;"></i>' : '<i class="fa-solid fa-circle-exclamation" style="color: #ef4444;"></i>';
        toast.innerHTML = `${icon} <span>${message}</span>`;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // دالة مساعدة لتنظيف النصوص ضد XSS
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }
});
