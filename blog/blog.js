// ── CURSEUR CUSTOM ──
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');

document.body.style.cursor = 'none';

document.addEventListener('mousemove', function (e) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    setTimeout(function () {
        ring.style.left = e.clientX + 'px';
        ring.style.top = e.clientY + 'px';
    }, 80);
});

document.querySelectorAll('a, button').forEach(function (el) {
    el.style.cursor = 'none';
    el.addEventListener('mouseenter', function () {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        ring.style.width = '50px';
        ring.style.height = '50px';
        ring.style.borderColor = 'rgba(212,175,55,0.8)';
    });
    el.addEventListener('mouseleave', function () {
        cursor.style.width = '12px';
        cursor.style.height = '12px';
        ring.style.width = '36px';
        ring.style.height = '36px';
        ring.style.borderColor = 'rgba(212,175,55,0.5)';
    });
});

// ── TRADUCTION ──
var currentLang = localStorage.getItem('lang') || 'fr';
var originalTexts = {};
var translationCache = {};
var idCounter = 0;
var isTranslating = false;

function saveOriginalTexts() {
    var elements = document.querySelectorAll('h1, h2, h3, p, li, .tag, .code-desc, .code-label, .back-btn');
    elements.forEach(function (el) {
        if (!el.dataset.tid) {
            el.dataset.tid = 'tid_' + idCounter++;
            originalTexts[el.dataset.tid] = el.innerText.trim();
        }
    });
}

async function translateOne(text) {
    if (!text || text.length < 3) return text;
    if (translationCache[text]) return translationCache[text];
    try {
        var resp = await fetch('https://api.mymemory.translated.net/get?q=' + encodeURIComponent(text) + '&langpair=fr|en&de=contact@promosvault.com');
        var data = await resp.json();
        if (data.responseStatus === 200) {
            var translated = data.responseData.translatedText;
            translationCache[text] = translated;
            return translated;
        }
        return text;
    } catch (e) {
        return text;
    }
}

async function translatePage(targetLang) {
    if (isTranslating) return;
    isTranslating = true;

    var btn = document.getElementById('lang-btn');
    if (btn) btn.textContent = '...';

    var elements = document.querySelectorAll('h1, h2, h3, p, li, .tag, .code-desc, .code-label');

    if (targetLang === 'fr') {
        elements.forEach(function (el) {
            var original = originalTexts[el.dataset.tid];
            if (original) el.innerText = original;
        });
    } else {
        for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            var original = originalTexts[el.dataset.tid];
            if (!original) continue;
            var translated = await translateOne(original);
            el.innerText = translated;
            // Pause tous les 5 elements pour eviter le rate limit
            if (i % 5 === 0 && i > 0) {
                await new Promise(function (r) { setTimeout(r, 300); });
            }
        }
    }

    if (btn) btn.textContent = targetLang === 'fr' ? 'EN' : 'FR';
    isTranslating = false;
}

function toggleLang() {
    if (isTranslating) return;
    var next = currentLang === 'fr' ? 'en' : 'fr';
    currentLang = next;
    localStorage.setItem('lang', next);
    translatePage(next);
}

document.addEventListener('DOMContentLoaded', function () {
    saveOriginalTexts();
    var btn = document.getElementById('lang-btn');
    if (btn) {
        btn.textContent = currentLang === 'fr' ? 'EN' : 'FR';
        btn.style.cursor = 'pointer';
        btn.onclick = toggleLang;
    }
    if (currentLang === 'en') {
        setTimeout(function () { translatePage('en'); }, 500);
    }
});