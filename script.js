document.addEventListener('DOMContentLoaded', () => {
    const sourceText = document.getElementById('sourceText');
    const targetText = document.getElementById('targetText');
    const translateBtn = document.getElementById('translateBtn');
    const sourceLang = document.getElementById('sourceLang');
    const targetLang = document.getElementById('targetLang');
    const swapBtn = document.getElementById('swapBtn');
    const copyBtn = document.getElementById('copyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const speakSource = document.getElementById('speakSource');
    const speakTarget = document.getElementById('speakTarget');
    const themeToggle = document.getElementById('themeToggle');
    const charCount = document.getElementById('charCount');
    const toast = document.getElementById('toast');

    // 1. تفعيل الوضع الداكن (Dark Mode)
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const icon = themeToggle.querySelector('i');
            if (document.body.classList.contains('dark-mode')) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        });
    }

    // 2. عداد الحروف
    if (sourceText && charCount) {
        sourceText.addEventListener('input', () => {
            charCount.textContent = `${sourceText.value.length} / 5000`;
        });
    }

    // 3. تبديل اللغات
    if (swapBtn) {
        swapBtn.addEventListener('click', () => {
            if (sourceLang.value === 'auto') return;
            const temp = sourceLang.value;
            sourceLang.value = targetLang.value;
            targetLang.value = temp;
            
            const tempText = sourceText.value;
            sourceText.value = targetText.value;
            targetText.value = tempText;
        });
    }

    // 4. مسح النص
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            sourceText.value = '';
            targetText.value = '';
            if (charCount) charCount.textContent = '0 / 5000';
        });
    }

    // 5. زر الترجمة الفورية
    if (translateBtn) {
        translateBtn.addEventListener('click', async () => {
            const text = sourceText.value.trim();
            if (!text) {
                alert('الرجاء إدخال نص أو رفع ملف للترجمة!');
                return;
            }

            targetText.value = 'جاري الترجمة...';

            try {
                const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang.value}|${targetLang.value}`);
                const data = await res.json();
                
                if (data && data.responseData) {
                    targetText.value = data.responseData.translatedText;
                } else {
                    targetText.value = 'عذراً، لم يتم العثور على ترجمة.';
                }
            } catch (error) {
                targetText.value = 'حدث خطأ في الاتصال بخدمة الترجمة.';
            }
        });
    }

    // 6. نسخ النص المترجم
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            if (!targetText.value) return;
            navigator.clipboard.writeText(targetText.value);
            showToast('تم النسخ إلى الحافظة بنجاح!');
        });
    }

    // 7. النطق الصوتي
    if (speakSource) speakSource.addEventListener('click', () => speak(sourceText.value, sourceLang.value));
    if (speakTarget) speakTarget.addEventListener('click', () => speak(targetText.value, targetLang.value));

    function speak(text, lang) {
        if (!text) return;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === 'auto' ? 'ar' : lang;
        window.speechSynthesis.speak(utterance);
    }

    function showToast(msg) {
        if (!toast) return;
        toast.textContent = msg;
        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }
});
