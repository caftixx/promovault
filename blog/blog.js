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
var isTranslating = false;
var idCounter = 0;

function saveOriginalTexts() {
    var elements = document.querySelectorAll('h1, h2, h3, p, li, th, td, .tag, .code-desc, .code-label');
    elements.forEach(function (el) {
        if (!el.dataset.tid) {
            el.dataset.tid = 'tid_' + idCounter++;
            originalTexts[el.dataset.tid] = el.innerHTML;
        }
    });
}

async function translateText(text, targetLang) {
    if (!text || text.trim().length < 3) return text;
    try {
        var url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=' + targetLang + '&dt=t&q=' + encodeURIComponent(text);
        var resp = await fetch(url);
        var data = await resp.json();
        return data[0].map(function (item) { return item[0]; }).join('');
    } catch (e) {
        return text;
    }
}

async function translatePage(targetLang) {
    if (isTranslating) return;
    isTranslating = true;

    var btn = document.getElementById('lang-btn');
    if (btn) btn.textContent = '...';

    var elements = document.querySelectorAll('h1, h2, h3, p, li, th, td, .tag, .code-desc, .code-label');

    if (targetLang === 'fr') {
        elements.forEach(function (el) {
            var original = originalTexts[el.dataset.tid];
            if (original) el.innerHTML = original;
        });
    } else {
        for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            var originalHtml = originalTexts[el.dataset.tid];
            if (!originalHtml) continue;
            var temp = document.createElement('div');
            temp.innerHTML = originalHtml;
            var text = temp.textContent.trim();
            if (!text || text.length < 3) continue;
            var translated = await translateText(text, targetLang);
            el.innerHTML = originalHtml.replace(temp.textContent, translated);
            // Petite pause toutes les 10 elements
            if (i % 10 === 0) await new Promise(function (r) { setTimeout(r, 100); });
        }
    }

    if (btn) btn.textContent = targetLang === 'fr' ? 'EN' : 'FR';
    isTranslating = false;
}

function toggleLang() {
    var next = currentLang === 'fr' ? 'en' : 'fr';
    currentLang = next;
    localStorage.setItem('lang', next);
    translatePage(next);
}

document.addEventListener('DOMContentLoaded', function () {
    saveOriginalTexts();
    var btn = document.getElementById('lang-btn');
    if (btn) btn.textContent = currentLang === 'fr' ? 'EN' : 'FR';
    if (currentLang === 'en') {
        translatePage('en');
    }
});