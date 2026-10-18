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

    if (sourceLang === 'auto') sourceLang = 'autodetect';

    errorMessage.classList.add('hidden');
    loadingSpinner.classList.remove('hidden');
    targetTextDiv.textContent = '';

    try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;
        const response = await fetch(url);

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
            throw new Error('استجابة غير صالحة من خادم الترجمة.');
        }
    } catch (err) {
        console.error(err);
        showError('تعذّر إجراء الترجمة حالياً. تحقق من الاتصال بالإنترنت أو تأكد من توفر خدمة الترجمة.');
    } finally {
        loadingSpinner.classList.add('hidden');
    }
}
