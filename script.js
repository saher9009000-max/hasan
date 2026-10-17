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
    const charCount = document.getElementById('charCount');
    const toast = document.getElementById('toast');

    // عداد الحروف
    sourceText.addEventListener('input', () => {
        const length = sourceText.value.length;
        if (charCount) charCount.textContent = `${length} / 5000`;
    });

    // تبديل اللغات
    swapBtn.addEventListener('click', () => {
        if (sourceLang.value === 'auto') return;
        const temp = sourceLang.value;
        sourceLang.value = targetLang.value;
        targetLang.value = temp;
        
        const tempText = sourceText.value;
        sourceText.value = targetText.value;
        targetText.value = tempText;
    });

    // مسح النص
    clearBtn.addEventListener('click', () => {
        sourceText.value = '';
        targetText.value = '';
        if (charCount) charCount.textContent = '0 / 5000';
    });

    // وظيفة الترجمة
    translateBtn.addEventListener('click', async () => {
        const text = sourceText.value.trim();
        if (!text) return;

        targetText.value = 'جاري الترجمة...';

        try {
            const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang.value}|${targetLang.value}`);
            const data = await res.json();
            
            if (data.responseData) {
                targetText.value = data.responseData.translatedText;
            } else {
                targetText.value = 'حدث خطأ في الترجمة، يرجى المحاولة لاحقاً.';
            }
        } catch (error) {
            targetText.value = 'عذراً، فشل الاتصال بخدمة الترجمة.';
        }
    });

    // نسخ النص
    copyBtn.addEventListener('click', () => {
        if (!targetText.value) return;
        navigator.clipboard.writeText(targetText.value);
        showToast('تم النسخ إلى الحافظة بنجاح!');
    });

    // النطق الصوتي
    speakSource.addEventListener('click', () => speak(sourceText.value, sourceLang.value));
    speakTarget.addEventListener('click', () => speak(targetText.value, targetLang.value));

    function speak(text, lang) {
        if (!text) return;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === 'auto' ? 'ar' : lang;
        window.speechSynthesis.speak(utterance);
    }

    function showToast(msg) {
        toast.textContent = msg;
        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }
});
