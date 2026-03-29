// Afficher le body seulement quand tout est prêt
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.visibility = 'visible';
});

// ── CURSEUR CUSTOM ──
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  setTimeout(() => {
    ring.style.left = e.clientX + 'px';
    ring.style.top = e.clientY + 'px';
  }, 80);
});

document.querySelectorAll('a, button, input, select, textarea, .ccard, .plat-pill, .cat, .fbtn, .cbtn, .nav-btn, .mclose, .theme-toggle, [onclick], label, [role="button"]').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '20px';
    cursor.style.height = '20px';
    ring.style.width = '50px';
    ring.style.height = '50px';
    ring.style.borderColor = 'rgba(212,175,55,0.8)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '12px';
    cursor.style.height = '12px';
    ring.style.width = '36px';
    ring.style.height = '36px';
    ring.style.borderColor = 'rgba(212,175,55,0.5)';
  });
});

// ── PARTICULES DORÉES ──
const canvas = document.getElementById('particles-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.3,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -Math.random() * 0.4 - 0.1,
      opacity: Math.random() * 0.6 + 0.1,
      life: 1,
    };
  }

  for (let i = 0; i < 80; i++) particles.push(createParticle());

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.life -= 0.003;
      if (p.life <= 0 || p.y < -10) particles[i] = createParticle();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 175, 55, ${p.opacity * p.life})`;
      ctx.fill();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

// ── FORMES GÉOMÉTRIQUES FLOTTANTES ──
function createFloatingShapes() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const shapes = [
    { width: 600, height: 140, rotate: 12, top: '20%', left: '-5%', delay: 0.3, color: 'rgba(212,175,55,0.08)' },
    { width: 500, height: 120, rotate: -15, top: '75%', right: '0%', delay: 0.5, color: 'rgba(212,175,55,0.06)' },
    { width: 300, height: 80, rotate: -8, bottom: '10%', left: '10%', delay: 0.4, color: 'rgba(212,175,55,0.07)' },
    { width: 200, height: 60, rotate: 20, top: '15%', right: '20%', delay: 0.6, color: 'rgba(212,175,55,0.05)' },
    { width: 150, height: 40, rotate: -25, top: '10%', left: '25%', delay: 0.7, color: 'rgba(212,175,55,0.04)' },
  ];

  shapes.forEach(s => {
    const el = document.createElement('div');
    el.style.cssText = `
      position: absolute;
      width: ${s.width}px;
      height: ${s.height}px;
      border-radius: 50%;
      border: 1.5px solid rgba(212,175,55,0.15);
      background: linear-gradient(135deg, ${s.color}, transparent);
      backdrop-filter: blur(2px);
      transform: rotate(${s.rotate}deg) translateY(-150px);
      opacity: 0;
      pointer-events: none;
      z-index: 0;
      ${s.top ? 'top:' + s.top + ';' : ''}
      ${s.bottom ? 'bottom:' + s.bottom + ';' : ''}
      ${s.left ? 'left:' + s.left + ';' : ''}
      ${s.right ? 'right:' + s.right + ';' : ''}
      transition: opacity 1.2s ease, transform 2.4s cubic-bezier(0.23,0.86,0.39,0.96);
      transition-delay: ${s.delay}s;
    `;
    hero.appendChild(el);

    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = `rotate(${s.rotate}deg) translateY(0)`;
    }, 100);

    let start = null;
    const amplitude = 15;
    const duration = 12000;
    const offset = s.delay * 1000;

    function floatAnim(timestamp) {
      if (!start) start = timestamp;
      const elapsed = (timestamp - start + offset) % duration;
      const progress = elapsed / duration;
      const y = Math.sin(progress * Math.PI * 2) * amplitude;
      el.style.transform = `rotate(${s.rotate}deg) translateY(${y}px)`;
      requestAnimationFrame(floatAnim);
    }

    setTimeout(() => requestAnimationFrame(floatAnim), (s.delay + 2.4) * 1000);
  });
}

createFloatingShapes();

// ── THEME TOGGLE ──
function initTheme() {
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeBtn(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeBtn(next);
}

function updateThemeBtn(theme) {
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.innerHTML = theme === 'dark' ? 'Mode Clair' : 'Mode Sombre';
}

initTheme();

// ─── CONFIG ──────────────────────────────────────
const API = 'https://promovault-backend.onrender.com/api/v1';

const platformUrls = {
  amazon: 'https://www.amazon.fr',
  aliexpress: 'https://www.aliexpress.com',
  nike: 'https://www.nike.com/fr',
  booking: 'https://www.booking.com',
  udemy: 'https://www.udemy.com',
  sephora: 'https://www.sephora.fr',
  samsung: 'https://www.samsung.com/fr',
  ubereats: 'https://www.ubereats.com/fr',
  steam: 'https://store.steampowered.com',
  coursera: 'https://www.coursera.org',
  adidas: 'https://www.adidas.fr',
};

// ─── TRADUCTIONS ─────────────────────────────────
const TRANSLATIONS = {
  fr: {
    'meta.title': 'PromoVault — Codes Promos Vérifiés par IA',
    'meta.desc': "Codes promos vérifiés par IA toutes les 6h. Amazon, Nike, Udemy, Booking et plus. Économisez jusqu'à 90% sur vos achats.",
    'nav.codes': 'Codes promos',
    'nav.platforms': 'Plateformes',
    'nav.categories': 'Catégories',
    'nav.how': 'Comment ça marche',
    'nav.live': 'IA active',
    'nav.submit': 'Soumettre un code',
    'nav.alert': "M'alerter",
    'drawer.codes': 'Codes promos',
    'drawer.platforms': 'Plateformes',
    'drawer.categories': 'Catégories',
    'drawer.how': 'Comment ça marche',
    'drawer.submit': 'Soumettre un code',
    'drawer.alert': "M'alerter",
    'drawer.lang': 'Switch to English',
    'hero.h1a': 'Les meilleurs codes promos,',
    'hero.h1b': 'vérifiés toutes les 6h',
    'hero.sub': "PromoVault scrute automatiquement des centaines de plateformes mondiales pour vous trouver les meilleures réductions du moment. Fini les codes expirés.",
    'hero.btn1': 'Voir les codes du jour',
    'hero.btn2': 'Comment ça marche',
    'stat.codes': 'Codes actifs',
    'stat.platforms': 'Plateformes',
    'stat.rate': 'Taux de validité',
    'stat.cycle': 'Cycle de mise à jour',
    'ai.title': 'Statut en temps réel',
    'ai.cycle': 'Cycle automatique toutes les 6 heures',
    'ai.lbl1': 'Codes actifs en base',
    'ai.sub1': 'Mise à jour automatique',
    'ai.lbl2': 'Score de validité moyen',
    'ai.sub2': 'Codes publiés automatiquement',
    'ai.lbl3': 'Prochain cycle dans',
    'ai.sub3': 'GitHub Actions toutes les 6h',
    'platforms.title': 'Plateformes <em>populaires</em>',
    'platforms.meta': 'Cliquez pour filtrer les codes',
    'platform.code': 'code',
    'platform.codes': 'codes',
    'cats.title': 'Par <em>catégorie</em>',
    'cats.all': 'Toutes',
    'filter.search': 'Rechercher un code, une marque...',
    'filter.all': 'Tous',
    'filter.hot': 'Tendances',
    'filter.expiring': 'Expire bientôt',
    'filter.free': 'Livraison offerte',
    'codes.title': 'Codes promos <em>du jour</em>',
    'codes.loading': 'Chargement...',
    'codes.connecting': 'Connexion en cours...',
    'codes.count.singular': 'code trouvé',
    'codes.count.plural': 'codes trouvés',
    'codes.loadmore': 'Charger plus de codes ↓',
    'codes.none': 'Aucun code trouvé pour ces critères.',
    'codes.reset': 'Réinitialiser les filtres',
    'codes.copy': 'Copier',
    'codes.copied': 'Copié !',
    'codes.active': 'Code actif',
    'codes.expires': 'Expire le',
    'codes.locale': 'fr-FR',
    'submit.title': 'Vous avez un code promo ?',
    'submit.desc': "Partagez-le avec la communauté. Notre agent IA le vérifiera et le publiera automatiquement s'il est valide.",
    'submit.btn': 'Soumettre un code gratuit',
    'submit.soon': 'Fonctionnalité disponible prochainement !',
    'about.title': 'À propos de PromoVault : Votre chasseur de codes promos',
    'about.p1': "Bienvenue sur PromoVault, votre plateforme ultime pour trouver les meilleurs <strong>codes promos vérifiés</strong> et réductions exclusives. Notre intelligence artificielle scanne en permanence le web pour vous offrir des bons de réduction testés sur des plateformes incontournables telles qu'<strong>Amazon, Nike, Udemy, Booking.com</strong> et de nombreuses boutiques en ligne.",
    'about.p2': "Économisez un maximum sur vos achats en ligne grâce à notre base de données mise à jour toutes les 6 heures, vous assurant de ne rater aucune offre tendance ou livraison offerte. Parcourez nos nombreuses offres par catégories (Tech, Mode, Voyage, etc.) pour réaliser des économies au quotidien.",
    'footer.desc': "Le premier agrégateur de codes promos vérifiés par intelligence artificielle. Mise à jour automatique toutes les 6h sur 500+ plateformes mondiales — Amazon, Nike, Udemy, Booking et bien plus.",
    'footer.platforms': 'Plateformes',
    'footer.categories': 'Catégories',
    'footer.info': 'Informations',
    'footer.cat.mode': 'Mode & Beauté',
    'footer.cat.tech': 'Tech & High-Tech',
    'footer.cat.formations': 'Formations en ligne',
    'footer.cat.voyage': 'Voyage & Hôtels',
    'footer.cat.food': 'Food & Livraison',
    'footer.cat.gaming': 'Gaming',
    'footer.blog': 'Blog & Conseils',
    'footer.blog.amazon': 'Code promo Amazon',
    'footer.blog.nike': 'Code promo Nike',
    'footer.blog.economiser': 'Économiser en ligne',
    'footer.how': 'Comment ça marche',
    'footer.submit': 'Soumettre un code',
    'footer.cgv': 'CGV',
    'footer.privacy': 'Confidentialité',
    'footer.legal': 'Mentions légales',
    'footer.copyright': '© 2025 PromoVault — Tous droits réservés. Codes promos vérifiés automatiquement par IA.',
    'footer.agent': 'Agent IA actif',
    'modal.copy': 'Copier & aller sur le site',
    'modal.desc_label': 'Description :',
    'modal.conditions_label': 'Conditions :',
    'modal.expires_label': 'Expire le :',
    'modal.status_label': 'Statut :',
    'modal.status_val': 'Code actif',
    'modal.details_default': 'Consultez le site marchand pour les conditions complètes.',
    'alert.title': 'Recevoir les alertes',
    'alert.desc': "Recevez un email dès que de nouveaux codes promos sont ajoutés sur PromoVault. Aucun spam — uniquement les nouvelles offres.",
    'alert.placeholder': 'votre@email.com',
    'alert.btn': "Je veux être alerté(e)",
    'alert.success_title': 'Inscription confirmée !',
    'alert.success_sub': "Vous serez alerté(e) dès qu'un nouveau code promo arrive.",
    'alert.unsub': 'Désinscription possible à tout moment. Aucune donnée partagée.',
    'alert.invalid_email': 'Email invalide !',
    'toast.copied_suffix': 'copié !',
    'toast.sub': 'Collez-le à la caisse pour économiser',
    'legal.privacy_title': 'Politique de confidentialité',
    'legal.privacy_text': "PromoVault collecte uniquement les données nécessaires au bon fonctionnement du service (données de navigation anonymisées). Aucune donnée personnelle n'est vendue à des tiers. Les codes promos sont collectés depuis des sources publiques et des partenaires affiliés. Conformément au RGPD, vous pouvez exercer vos droits en nous contactant.",
    'legal.mentions_title': 'Mentions légales',
    'legal.mentions_text': "PromoVault est un service d'agrégation de codes promos vérifiés par intelligence artificielle. Les codes sont fournis à titre indicatif. PromoVault n'est pas responsable de la validité des offres chez les marchands partenaires. Certains liens sont des liens d'affiliation pouvant générer une commission sans coût supplémentaire pour l'utilisateur.",
    'legal.cgv_title': 'Conditions générales',
    'legal.cgv_text': "L'utilisation de PromoVault est entièrement gratuite. Les codes promos sont vérifiés automatiquement toutes les 6 heures par notre agent IA. PromoVault peut percevoir des commissions d'affiliation sur les achats effectués via les liens du site, sans coût supplémentaire pour l'utilisateur.",
    'legal.close': 'Fermer',
    'page.ad': 'Publicité',
  },
  en: {
    'meta.title': 'PromoVault — AI-Verified Promo Codes',
    'meta.desc': 'AI-verified promo codes updated every 6h. Amazon, Nike, Udemy, Booking and more. Save up to 90% on your purchases.',
    'nav.codes': 'Promo codes',
    'nav.platforms': 'Platforms',
    'nav.categories': 'Categories',
    'nav.how': 'How it works',
    'nav.live': 'AI active',
    'nav.submit': 'Submit a code',
    'nav.alert': 'Alert me',
    'drawer.codes': 'Promo codes',
    'drawer.platforms': 'Platforms',
    'drawer.categories': 'Categories',
    'drawer.how': 'How it works',
    'drawer.submit': 'Submit a code',
    'drawer.alert': 'Alert me',
    'drawer.lang': 'Passer en français',
    'hero.h1a': 'The best promo codes,',
    'hero.h1b': 'verified every 6 hours',
    'hero.sub': 'PromoVault automatically scans hundreds of global platforms to find you the best deals of the moment. No more expired codes.',
    'hero.btn1': "See today's codes",
    'hero.btn2': 'How it works',
    'stat.codes': 'Active codes',
    'stat.platforms': 'Platforms',
    'stat.rate': 'Validity rate',
    'stat.cycle': 'Update cycle',
    'ai.title': 'Real-time status',
    'ai.cycle': 'Automatic cycle every 6 hours',
    'ai.lbl1': 'Active codes in database',
    'ai.sub1': 'Automatic update',
    'ai.lbl2': 'Average validity score',
    'ai.sub2': 'Codes published automatically',
    'ai.lbl3': 'Next cycle in',
    'ai.sub3': 'GitHub Actions every 6h',
    'platforms.title': 'Popular <em>platforms</em>',
    'platforms.meta': 'Click to filter codes',
    'platform.code': 'code',
    'platform.codes': 'codes',
    'cats.title': 'By <em>category</em>',
    'cats.all': 'All',
    'filter.search': 'Search for a code, brand...',
    'filter.all': 'All',
    'filter.hot': 'Trending',
    'filter.expiring': 'Expiring soon',
    'filter.free': 'Free shipping',
    'codes.title': "Today's <em>promo codes</em>",
    'codes.loading': 'Loading...',
    'codes.connecting': 'Connecting...',
    'codes.count.singular': 'code found',
    'codes.count.plural': 'codes found',
    'codes.loadmore': 'Load more codes ↓',
    'codes.none': 'No codes found for these criteria.',
    'codes.reset': 'Reset filters',
    'codes.copy': 'Copy',
    'codes.copied': 'Copied!',
    'codes.active': 'Active code',
    'codes.expires': 'Expires on',
    'codes.locale': 'en-GB',
    'submit.title': 'Have a promo code?',
    'submit.desc': "Share it with the community. Our AI agent will verify it and publish it automatically if it's valid.",
    'submit.btn': 'Submit a free code',
    'submit.soon': 'Feature coming soon!',
    'about.title': 'About PromoVault: Your promo code hunter',
    'about.p1': 'Welcome to PromoVault, your ultimate platform for finding the best <strong>verified promo codes</strong> and exclusive discounts. Our artificial intelligence continuously scans the web to offer you tested discount codes on major platforms such as <strong>Amazon, Nike, Udemy, Booking.com</strong> and many online stores.',
    'about.p2': 'Maximize your savings on online purchases with our database updated every 6 hours, ensuring you never miss a trending deal or free shipping offer. Browse our many offers by category (Tech, Fashion, Travel, etc.) to save money every day.',
    'footer.desc': 'The first AI-verified promo code aggregator. Automatic update every 6h on 500+ global platforms — Amazon, Nike, Udemy, Booking and much more.',
    'footer.platforms': 'Platforms',
    'footer.categories': 'Categories',
    'footer.info': 'Information',
    'footer.cat.mode': 'Fashion & Beauty',
    'footer.cat.tech': 'Tech & Electronics',
    'footer.cat.formations': 'Online courses',
    'footer.cat.voyage': 'Travel & Hotels',
    'footer.cat.food': 'Food & Delivery',
    'footer.cat.gaming': 'Gaming',
    'footer.blog': 'Blog & Tips',
    'footer.blog.amazon': 'Amazon promo code',
    'footer.blog.nike': 'Nike promo code',
    'footer.blog.economiser': 'Save money online',
    'footer.how': 'How it works',
    'footer.submit': 'Submit a code',
    'footer.cgv': 'Terms',
    'footer.privacy': 'Privacy',
    'footer.legal': 'Legal notice',
    'footer.copyright': '© 2025 PromoVault — All rights reserved. Promo codes automatically verified by AI.',
    'footer.agent': 'AI agent active',
    'modal.copy': 'Copy & go to site',
    'modal.desc_label': 'Description:',
    'modal.conditions_label': 'Conditions:',
    'modal.expires_label': 'Expires on:',
    'modal.status_label': 'Status:',
    'modal.status_val': 'Active code',
    'modal.details_default': "Check the merchant's website for full conditions.",
    'alert.title': 'Receive alerts',
    'alert.desc': 'Receive an email as soon as new promo codes are added to PromoVault. No spam — only new deals.',
    'alert.placeholder': 'your@email.com',
    'alert.btn': 'Alert me',
    'alert.success_title': 'Subscription confirmed!',
    'alert.success_sub': "You'll be notified as soon as a new promo code arrives.",
    'alert.unsub': 'Unsubscribe at any time. No data shared.',
    'alert.invalid_email': 'Invalid email!',
    'toast.copied_suffix': 'copied!',
    'toast.sub': 'Paste it at checkout to save',
    'legal.privacy_title': 'Privacy Policy',
    'legal.privacy_text': 'PromoVault only collects data necessary for the service to function properly (anonymized browsing data). No personal data is sold to third parties. Promo codes are collected from public sources and affiliate partners. In accordance with GDPR, you can exercise your rights by contacting us.',
    'legal.mentions_title': 'Legal Notice',
    'legal.mentions_text': "PromoVault is an AI-verified promo code aggregation service. Codes are provided for informational purposes. PromoVault is not responsible for the validity of offers at partner merchants. Some links are affiliate links that may generate a commission at no additional cost to the user.",
    'legal.cgv_title': 'Terms of Use',
    'legal.cgv_text': 'Using PromoVault is completely free. Promo codes are automatically verified every 6 hours by our AI agent. PromoVault may receive affiliate commissions on purchases made through site links, at no additional cost to the user.',
    'legal.close': 'Close',
    'page.ad': 'Advertisement',
  }
};

// ─── LANGUE ──────────────────────────────────────
let activeLang = localStorage.getItem('lang') || 'fr';

// Descriptions originales en FR (sauvegardées au chargement)
let CODES_DESC_FR = {};

function t(key) {
  return (TRANSLATIONS[activeLang] && TRANSLATIONS[activeLang][key]) ||
    (TRANSLATIONS['fr'] && TRANSLATIONS['fr'][key]) ||
    key;
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
}



function setLanguage(lang) {
  activeLang = lang;
  localStorage.setItem('lang', lang);
  document.getElementById('html-root').lang = lang;
  document.title = t('meta.title');
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.content = t('meta.desc');
  applyTranslations();
  const langBtn = document.getElementById('lang-btn');
  if (langBtn) langBtn.textContent = lang === 'fr' ? 'EN' : 'FR';
  const drawerBtn = document.getElementById('drawer-lang-btn');
  if (drawerBtn) drawerBtn.textContent = t('drawer.lang');

  renderPlatforms();

  if (lang === 'en') {
    renderCodes();
  } else {
    renderCodes();
  }
}

// Initialiser le label du bouton au chargement
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('lang-btn');
  if (btn) btn.textContent = activeLang === 'fr' ? 'EN' : 'FR';
});

function toggleLang() {
  const isBlog = window.location.pathname.includes('/blog/');
  if (isBlog) {
    activeLang = activeLang === 'fr' ? 'en' : 'fr';
    localStorage.setItem('lang', activeLang);
    window.location.href = '../index.html?lang=' + activeLang;
  } else {
    setLanguage(activeLang === 'fr' ? 'en' : 'fr');
  }
}

// ─── STATE ───────────────────────────────────────
let PLATFORMS = [];
let CATEGORIES = [];
let CODES = [];
let TICKER = [];

let activeFilter = 'all';
let activePlatform = null;
let activeCategory = null;
let searchQuery = '';
let visibleCount = 12;
let currentModalCode = '';
let currentModalUrl = '';

// ─── MENU MOBILE ─────────────────────────────────
function toggleDrawer() {
  document.getElementById('drawer').classList.toggle('open');
}

function closeDrawer() {
  document.getElementById('drawer').classList.remove('open');
}

document.addEventListener('click', e => {
  if (!e.target.closest('nav') && !e.target.closest('.drawer')) closeDrawer();
});

// ─── TICKER ──────────────────────────────────────
function renderTicker() {
  if (!TICKER.length) return;
  const items = [...TICKER, ...TICKER];
  document.getElementById('ticker').innerHTML = items.map(i => `
    <div class="ti">
      <b>${i.brand}</b>
      <code style="font-family:'Syne',sans-serif;font-size:.78rem;background:rgba(108,92,231,.12);padding:2px 8px;border-radius:4px;color:var(--accent-l)">${i.code}</code>
      <span class="pct">${i.discount}</span>
    </div>`
  ).join('');
}

// ─── PLATEFORMES ─────────────────────────────────
function renderPlatforms() {
  const el = document.getElementById('plat-grid');
  if (!el) return;
  el.innerHTML = PLATFORMS.map(p =>
    `<div class="plat-pill ${activePlatform === p.id ? 'active' : ''} ${p.count === 0 ? 'disabled' : ''}"
          onclick="${p.count > 0 ? `filterPlatform('${p.id}')` : ''}">
      <div class="pn">${p.name}</div>
      <div class="pc">${p.count} ${p.count > 1 ? t('platform.codes') : t('platform.code')}</div>
    </div>`
  ).join('');
}

// ─── CATÉGORIES ──────────────────────────────────
function renderCategories() {
  const el = document.getElementById('cats-row');
  if (!el) return;
  el.innerHTML =
    `<div class="cat ${!activeCategory ? 'active' : ''}" onclick="filterCategory(null)">${t('cats.all')}</div>` +
    CATEGORIES.map(c => `
      <div class="cat ${activeCategory === c.id ? 'active' : ''}" onclick="filterCategory('${c.id}')">
        ${c.label}
      </div>`
    ).join('');
}

// ─── FILTRAGE ────────────────────────────────────
function getFiltered() {
  return CODES.filter(c => {
    if (activeFilter === 'hot' && !c.type.includes('hot')) return false;
    if (activeFilter === 'expiring' && !c.expiring) return false;
    if (activeFilter === 'free' && !c.type.includes('free')) return false;
    if (activePlatform && c.platform !== activePlatform) return false;
    if (activeCategory && c.category !== activeCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!c.brand.toLowerCase().includes(q) &&
        !c.code.toLowerCase().includes(q) &&
        !c.desc.toLowerCase().includes(q)) return false;
    }
    return true;
  });
}

// ─── AFFICHAGE DES CODES (synchrone — plus de await) ─────────────────────────
function renderCodes() {
  const grid = document.getElementById('codes-grid');
  if (!grid) return;
  const all = getFiltered();
  const slice = all.slice(0, visibleCount);

  const count = all.length;
  const countEl = document.getElementById('codes-count');
  if (countEl) {
    countEl.textContent = `${count} ${count > 1 ? t('codes.count.plural') : t('codes.count.singular')}`;
  }

  if (!slice.length) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:56px;color:var(--text3)">
        <div>${t('codes.none')}</div>
        <button class="btn-g" onclick="resetFilters()" style="margin-top:16px;display:inline-flex">
          ${t('codes.reset')}
        </button>
      </div>`;
    document.getElementById('load-more').style.display = 'none';
    return;
  }

  const locale = t('codes.locale');

  const cardsHtml = slice.map((c, i) => {
    const adSlot = (i === 5 || i === 11) ? `
      <div class="ccard" style="display:flex;align-items:center;justify-content:center;min-height:260px;border-style:dashed">
        <div style="text-align:center">
          <span class="ad-lbl" style="display:block;margin-bottom:8px">${t('page.ad')}</span>
          <ins class="adsbygoogle"
               style="display:inline-block;width:280px;height:250px;max-width:100%"
               data-ad-client="ca-pub-8294263820749243"
               data-ad-slot="XXXXXXXXXX"></ins>
          <script>(adsbygoogle = window.adsbygoogle || []).push({});<\/script>
        </div>
      </div>` : '';

    const desc = activeLang === 'en' ? (c.desc_en || c.desc) : c.desc;

    let card;
    if (c.featured) {
      card = `
        <div class="feat" onclick="openModal(${c.id})">
          <div class="feat-disc">${c.discount}</div>
          <div class="feat-info">
            <div class="feat-brand">${c.brand}</div>
            <div class="feat-desc">${desc}</div>
            <div class="cbox" onclick="event.stopPropagation()">
              <div class="ccode">${c.code}</div>
              <button class="cbtn" id="cb-${c.id}" onclick="copyCode('${c.code}',${c.id})">${t('codes.copy')}</button>
            </div>
          </div>
        </div>`;
    } else {
      card = `
        <div class="ccard ${c.type.includes('hot') ? 'hot' : ''}" onclick="openModal(${c.id})">
          <div class="ctop">
            <div class="clogo"></div>
            <div class="cinfo">
              <div class="cname">${c.brand}</div>
              <div class="ccat">${c.category.charAt(0).toUpperCase() + c.category.slice(1)}</div>
            </div>
            <div class="cdiscount">${c.discount}</div>
          </div>
          <div class="cdesc">${desc}</div>
          <div class="cbox" onclick="event.stopPropagation()">
            <div class="ccode">${c.code}</div>
            <button class="cbtn" id="cb-${c.id}" onclick="copyCode('${c.code}',${c.id})">${t('codes.copy')}</button>
          </div>
          <div class="cfoot">
            <span class="ctag">${t('codes.active')}</span>
            <span class="cexp ${c.expiring ? 'urgent' : ''}">
              ${t('codes.expires')} ${new Date(c.expiry).toLocaleDateString(locale)}
            </span>
          </div>
        </div>`;
    }

    return adSlot + card;
  });

  grid.innerHTML = cardsHtml.join('');
  document.getElementById('load-more').style.display =
    all.length > visibleCount ? 'inline-flex' : 'none';
}

// ─── COPIER UN CODE ──────────────────────────────
function copyCode(code, id) {
  navigator.clipboard.writeText(code).then(() => {
    const btn = document.getElementById(`cb-${id}`);
    if (btn) {
      btn.textContent = t('codes.copied');
      btn.classList.add('copied');
      setTimeout(() => { btn.textContent = t('codes.copy'); btn.classList.remove('copied'); }, 2000);
    }
    showToast(code);
    fetch(`${API}/codes/${id}/use`, { method: 'POST' }).catch(() => { });
  });
}

function showToast(code) {
  const toastEl = document.getElementById('toast');
  document.getElementById('toast-title').textContent = `"${code}" ${t('toast.copied_suffix')}`;
  document.getElementById('toast-sub').textContent = t('toast.sub');
  toastEl.classList.add('show');
  setTimeout(() => toastEl.classList.remove('show'), 3200);
}

// ─── MODAL ───────────────────────────────────────
async function openModal(id) {
  const c = CODES.find(x => x.id === id);
  if (!c) return;
  currentModalCode = c.code;
  currentModalUrl = c.url || platformUrls[c.platform] || '#';
  document.getElementById('modal-brand').textContent = `${c.brand} — ${c.discount}`;
  document.getElementById('modal-code').textContent = c.code;
  const locale = t('codes.locale');
  const desc = activeLang === 'en' ? (c.desc_en || c.desc) : c.desc;
  document.getElementById('modal-details').innerHTML = `
    <strong>${t('modal.desc_label')}</strong> ${desc}<br><br>
    <strong>${t('modal.conditions_label')}</strong> ${c.details || t('modal.details_default')}<br><br>
    <strong>${t('modal.expires_label')}</strong> ${new Date(c.expiry).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}<br>
    <strong>${t('modal.status_label')}</strong> ${t('modal.status_val')}
  `;
  document.getElementById('modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
  document.body.style.overflow = '';
}

function copyFromModal() {
  navigator.clipboard.writeText(currentModalCode).then(() => {
    showToast(currentModalCode);
    closeModal();
    if (currentModalUrl) window.open(currentModalUrl, '_blank');
  });
}

const modalEl = document.getElementById('modal');
if (modalEl) {
  modalEl.addEventListener('click', e => {
    if (e.target === modalEl) closeModal();
  });
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(); closeAlertModal(); }
});

// ─── SOUMETTRE ───────────────────────────────────
function openSubmitModal() {
  alert(t('submit.soon'));
}

// ─── FILTRES ─────────────────────────────────────
function filterPlatform(id) {
  activePlatform = activePlatform === id ? null : id;
  visibleCount = 12;
  renderPlatforms();
  renderCodes();
  document.getElementById('codes').scrollIntoView({ behavior: 'smooth' });
}

function filterCategory(id) {
  activeCategory = id;
  visibleCount = 12;
  renderCategories();
  renderCodes();
}

function resetFilters() {
  activeFilter = 'all';
  activePlatform = null;
  activeCategory = null;
  searchQuery = '';
  visibleCount = 12;
  document.getElementById('search-input').value = '';
  document.querySelectorAll('.fbtn').forEach(b => {
    b.classList.toggle('active', b.dataset.filter === 'all');
  });
  renderPlatforms();
  renderCategories();
  renderCodes();
}

document.querySelectorAll('.fbtn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.fbtn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    visibleCount = 12;
    renderCodes();
  });
});

document.getElementById('search-input').addEventListener('input', e => {
  searchQuery = e.target.value.trim();
  visibleCount = 12;
  renderCodes();
});

function loadMore() {
  visibleCount += 12;
  renderCodes();
}

// ─── ANIMATION COMPTEURS ─────────────────────────
function animCount(id, target, suffix = '', dur = 2000) {
  const el = document.getElementById(id);
  if (!el) return;
  const start = Date.now();
  const locale = t('codes.locale');
  const tick = () => {
    const p = Math.min((Date.now() - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(ease * target).toLocaleString(locale) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// ─── COUNTDOWN ───────────────────────────────────
function updateCountdown() {
  const now = new Date();
  const next = new Date(now);
  next.setHours(Math.ceil(now.getHours() / 6) * 6, 0, 0, 0);
  if (next <= now) next.setHours(next.getHours() + 6);
  const d = next - now;
  const h = Math.floor(d / 3600000);
  const m = Math.floor((d % 3600000) / 60000);
  const s = Math.floor((d % 60000) / 1000);
  const el = document.getElementById('countdown');
  if (el) el.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

setInterval(updateCountdown, 1000);
updateCountdown();

// ─── PROGRESS BARS ───────────────────────────────
function animBars() {
  document.querySelectorAll('.pfill[data-w]').forEach(b => {
    setTimeout(() => { b.style.width = b.dataset.w; }, 400);
  });
}

// ─── SCROLL REVEAL ───────────────────────────────
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      ro.unobserve(e.target);
    }
  });
}, { threshold: .08 });

document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

// ─── PAGES LÉGALES ───────────────────────────────
function showPage(type) {
  const map = {
    confidentialite: ['legal.privacy_title', 'legal.privacy_text'],
    mentions: ['legal.mentions_title', 'legal.mentions_text'],
    cgv: ['legal.cgv_title', 'legal.cgv_text'],
  };
  const keys = map[type];
  if (!keys) return;
  const div = document.createElement('div');
  div.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:600;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(8px)';
  div.innerHTML = `
    <div style="background:var(--bg2);border:1px solid var(--border-b);border-radius:18px;padding:32px;max-width:520px;width:100%">
      <h3 style="font-family:'Syne',sans-serif;margin-bottom:14px">${t(keys[0])}</h3>
      <p style="color:var(--text2);line-height:1.8">${t(keys[1])}</p>
      <button class="btn-p" onclick="this.closest('div[style]').remove()" style="margin-top:20px">${t('legal.close')}</button>
    </div>`;
  div.addEventListener('click', e => { if (e.target === div) div.remove(); });
  document.body.appendChild(div);
}

// ─── CHARGEMENT DEPUIS L'API ─────────────────────
async function loadFromAPI() {
  try {
    const [plRes, catRes, codesRes, statsRes] = await Promise.all([
      fetch(`${API}/platforms/`),
      fetch(`${API}/categories/`),
      fetch(`${API}/codes?per_page=500`),
      fetch(`${API}/stats`),
    ]);

    const plats = await plRes.json();
    const cats = await catRes.json();
    const codesData = await codesRes.json();

    CATEGORIES = cats.map(c => ({
      id: c.slug,
      label: c.name,
      emoji: c.emoji,
    }));

    PLATFORMS = plats.map(p => ({
      id: p.slug,
      name: p.name,
      emoji: p.emoji,
      count: codesData.items.filter(c => c.platform.slug === p.slug).length,
    }));

    CODES = codesData.items.map(c => {
      const expiry = c.expires_at ? new Date(c.expires_at) : null;
      const daysLeft = expiry ? (expiry - new Date()) / 86400000 : 999;
      return {
        id: c.id,
        featured: c.is_featured,
        brand: c.platform.name,
        emoji: c.platform.emoji,
        category: c.category?.slug || 'autre',
        platform: c.platform.slug,
        discount: c.discount_label || 'Offre spéciale',
        code: c.code,
        desc: c.description || '',
        desc_en: c.description_en || c.description || '',
        details: c.details || '',
        type: [
          c.status === 'active' ? 'verified' : '',
          c.is_hot ? 'hot' : '',
          c.discount_type === 'free_shipping' ? 'free' : '',
        ].filter(Boolean),
        expiry: expiry ? expiry.toISOString().split('T')[0] : '2099-12-31',
        expiring: daysLeft < 14,
      };
    });



    TICKER = CODES.slice(0, 10).map(c => ({
      brand: c.brand,
      code: c.code,
      discount: c.discount,
    }));

    const stats = await statsRes.json();
    animCount('cnt-codes', stats.total_active_codes || CODES.length, '');
    animCount('cnt-brands', stats.total_platforms || PLATFORMS.length, '');
    animCount('cnt-rate', Math.round(stats.avg_ai_score || 75), '%');

    const e1 = document.getElementById('ai-checked');
    if (e1) e1.textContent = (stats.total_active_codes || CODES.length).toLocaleString(t('codes.locale'));
    const e2 = document.getElementById('ai-score');
    if (e2) e2.textContent = Math.round(stats.avg_ai_score || 75) + '/100';



  } catch (err) {
    console.warn('API inaccessible :', err);
    document.getElementById('codes-count').textContent = t('codes.connecting');
  }
}

// ─── INITIALISATION ──────────────────────────────
async function init() {
  setLanguage(activeLang);
  document.getElementById('codes-count').textContent = t('codes.loading');
  await loadFromAPI();
  renderTicker();
  renderPlatforms();
  renderCodes();
  animBars();
}

// ─── MODAL ALERTES EMAIL ─────────────────────────
function openAlertModal() {
  document.getElementById('alert-modal').classList.add('open');
  document.getElementById('alert-form').style.display = 'block';
  document.getElementById('alert-success').style.display = 'none';
  document.getElementById('alert-email').value = '';
  document.body.style.overflow = 'hidden';
}

function closeAlertModal() {
  document.getElementById('alert-modal').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('alert-modal').addEventListener('click', e => {
  if (e.target === document.getElementById('alert-modal')) closeAlertModal();
});

async function subscribeAlert() {
  const emailInput = document.getElementById('alert-email');
  const email = emailInput.value.trim();
  if (!email || !email.includes('@')) {
    emailInput.style.borderColor = 'var(--orange)';
    emailInput.placeholder = t('alert.invalid_email');
    return;
  }
  try {
    const resp = await fetch(`${API}/subscribe-alert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (resp.ok) {
      document.getElementById('alert-form').style.display = 'none';
      document.getElementById('alert-success').style.display = 'block';
      setTimeout(() => closeAlertModal(), 3000);
    }
  } catch (err) {
    document.getElementById('alert-form').style.display = 'none';
    document.getElementById('alert-success').style.display = 'block';
    setTimeout(() => closeAlertModal(), 3000);
  }
}

init();

// ── KEEP ALIVE ──
function keepAlive() {
  fetch(`${API}/stats`).catch(() => { });
}
setInterval(keepAlive, 10 * 60 * 1000);
keepAlive();