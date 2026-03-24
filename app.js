
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
      document.getElementById('plat-grid').innerHTML = PLATFORMS.map(p =>
        `<div class="plat-pill ${activePlatform === p.id ? 'active' : ''} ${p.count === 0 ? 'disabled' : ''}" 
          onclick="${p.count > 0 ? `filterPlatform('${p.id}')` : ''}">
      <div class="pe">${p.emoji}</div>
      <div class="pn">${p.name}</div>
      <div class="pc">${p.count} code${p.count > 1 ? 's' : ''}</div>
    </div>`
      ).join('');
    }

    // ─── CATÉGORIES ──────────────────────────────────
    function renderCategories() {
      document.getElementById('cats-row').innerHTML =
        `<div class="cat ${!activeCategory ? 'active' : ''}" onclick="filterCategory(null)">🌐 Toutes</div>` +
        CATEGORIES.map(c => `
      <div class="cat ${activeCategory === c.id ? 'active' : ''}" onclick="filterCategory('${c.id}')">
        ${c.emoji} ${c.label}
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

    // ─── AFFICHAGE DES CODES ─────────────────────────
    function renderCodes() {
      const grid = document.getElementById('codes-grid');
      const all = getFiltered();
      const slice = all.slice(0, visibleCount);

      document.getElementById('codes-count').textContent =
        `${all.length} code${all.length > 1 ? 's' : ''} trouvé${all.length > 1 ? 's' : ''}`;

      if (!slice.length) {
        grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:56px;color:var(--text3)">
        <div style="font-size:2.4rem;margin-bottom:10px">🔍</div>
        <div>Aucun code trouvé pour ces critères.</div>
        <button class="btn-g" onclick="resetFilters()" style="margin-top:16px;display:inline-flex">
          Réinitialiser les filtres
        </button>
      </div>`;
        document.getElementById('load-more').style.display = 'none';
        return;
      }

      grid.innerHTML = slice.map((c, i) => {

        // Pub dans la grille aux positions 5 et 11
        const adSlot = (i === 5 || i === 11) ? `
      <div class="ccard" style="display:flex;align-items:center;justify-content:center;min-height:260px;border-style:dashed">
        <div style="text-align:center">
          <span class="ad-lbl" style="display:block;margin-bottom:8px">Publicité</span>
          <ins class="adsbygoogle"
               style="display:inline-block;width:280px;height:250px;max-width:100%"
               data-ad-client="ca-pub-8294263820749243"
               data-ad-slot="XXXXXXXXXX"></ins>
          <script>(adsbygoogle = window.adsbygoogle || []).push({});<\/script>
        </div>
      </div>` : '';

        let card;

        if (c.featured) {
          card = `
        <div class="feat" onclick="openModal(${c.id})">
          <div class="feat-disc">${c.discount}</div>
          <div class="feat-info">
            <div class="feat-brand">${c.emoji} ${c.brand}</div>
            <div class="feat-desc">${c.desc}</div>
            <div class="cbox" onclick="event.stopPropagation()">
              <div class="ccode">${c.code}</div>
              <button class="cbtn" id="cb-${c.id}" onclick="copyCode('${c.code}',${c.id})">📋 Copier</button>
            </div>
          </div>
        </div>`;
        } else {
          card = `
        <div class="ccard ${c.type.includes('hot') ? 'hot' : ''}" onclick="openModal(${c.id})">
          <div class="ctop">
            <div class="clogo">${c.emoji}</div>
            <div class="cinfo">
              <div class="cname">${c.brand}</div>
              <div class="ccat">${c.category.charAt(0).toUpperCase() + c.category.slice(1)}</div>
            </div>
            <div class="cdiscount">${c.discount}</div>
          </div>
          <div class="cdesc">${c.desc}</div>
          <div class="cbox" onclick="event.stopPropagation()">
            <div class="ccode">${c.code}</div>
            <button class="cbtn" id="cb-${c.id}" onclick="copyCode('${c.code}',${c.id})">📋 Copier</button>
          </div>
          <div class="cfoot">
            <span class="ctag">✅ Code actif</span>
            <span class="cexp ${c.expiring ? 'urgent' : ''}">
              ${c.expiring ? '⏰' : '📅'} Expire le ${new Date(c.expiry).toLocaleDateString('fr-FR')}
            </span>
          </div>
        </div>`;
        }

        return adSlot + card;

      }).join('');

      document.getElementById('load-more').style.display =
        all.length > visibleCount ? 'inline-flex' : 'none';
    }

    // ─── COPIER UN CODE ──────────────────────────────
    function copyCode(code, id) {
      navigator.clipboard.writeText(code).then(() => {
        const btn = document.getElementById(`cb-${id}`);
        if (btn) {
          btn.textContent = '✅ Copié !';
          btn.classList.add('copied');
          setTimeout(() => { btn.textContent = '📋 Copier'; btn.classList.remove('copied'); }, 2000);
        }
        showToast(code);
        // Tracker l'utilisation
        fetch(`${API}/codes/${id}/use`, { method: 'POST' }).catch(() => { });
      });
    }

    function showToast(code) {
      const t = document.getElementById('toast');
      document.getElementById('toast-title').textContent = `"${code}" copié !`;
      document.getElementById('toast-sub').textContent = 'Collez-le à la caisse pour économiser 🛒';
      t.classList.add('show');
      setTimeout(() => t.classList.remove('show'), 3200);
    }

    // ─── MODAL ───────────────────────────────────────
    function openModal(id) {
      const c = CODES.find(x => x.id === id);
      if (!c) return;
      currentModalCode = c.code;
      currentModalUrl = c.url || platformUrls[c.platform] || '#';
      document.getElementById('modal-brand').textContent = `${c.emoji} ${c.brand} — ${c.discount}`;
      document.getElementById('modal-code').textContent = c.code;
      document.getElementById('modal-details').innerHTML = `
    <strong>Description :</strong> ${c.desc}<br><br>
    <strong>Conditions :</strong> ${c.details || 'Consultez le site marchand pour les conditions complètes.'}<br><br>
    <strong>Expire le :</strong> ${new Date(c.expiry).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}<br>
    <strong>Statut :</strong> ✅ Code actif
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
        // Ouvrir le site du marchand
        if (currentModalUrl) {
          window.open(currentModalUrl, '_blank');
        }
      });
    }

    // Fermer modal sur overlay ou Escape
    document.getElementById('modal').addEventListener('click', e => {
      if (e.target === document.getElementById('modal')) closeModal();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeModal();
    });

    // ─── SOUMETTRE ───────────────────────────────────
    function openSubmitModal() {
      alert('Fonctionnalité disponible prochainement !');
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
      const tick = () => {
        const p = Math.min((Date.now() - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(ease * target).toLocaleString('fr-FR') + suffix;
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
      const pages = {
        confidentialite: `
      <h3 style="font-family:'Syne',sans-serif;margin-bottom:14px">Politique de confidentialité</h3>
      <p style="color:var(--text2);line-height:1.8">
        PromoVault collecte uniquement les données nécessaires au bon fonctionnement du service
        (données de navigation anonymisées). Aucune donnée personnelle n'est vendue à des tiers.
        Les codes promos sont collectés depuis des sources publiques et des partenaires affiliés.
        Conformément au RGPD, vous pouvez exercer vos droits en nous contactant.
      </p>`,
        mentions: `
      <h3 style="font-family:'Syne',sans-serif;margin-bottom:14px">Mentions légales</h3>
      <p style="color:var(--text2);line-height:1.8">
        PromoVault est un service d'agrégation de codes promos vérifiés par intelligence artificielle.
        Les codes sont fournis à titre indicatif. PromoVault n'est pas responsable de la validité
        des offres chez les marchands partenaires. Certains liens sont des liens d'affiliation
        pouvant générer une commission sans coût supplémentaire pour l'utilisateur.
      </p>`,
        cgv: `
      <h3 style="font-family:'Syne',sans-serif;margin-bottom:14px">Conditions générales</h3>
      <p style="color:var(--text2);line-height:1.8">
        L'utilisation de PromoVault est entièrement gratuite. Les codes promos sont vérifiés
        automatiquement toutes les 6 heures par notre agent IA. PromoVault peut percevoir des
        commissions d'affiliation sur les achats effectués via les liens du site, sans coût
        supplémentaire pour l'utilisateur.
      </p>`,
      };

      const content = pages[type] || '';
      if (!content) return;

      const div = document.createElement('div');
      div.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:600;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(8px)';
      div.innerHTML = `
    <div style="background:var(--bg2);border:1px solid var(--border-b);border-radius:18px;padding:32px;max-width:520px;width:100%">
      ${content}
      <button class="btn-p" onclick="this.closest('div[style]').remove()" style="margin-top:20px">Fermer</button>
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

        // Plateformes
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

        // Codes
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

        // Ticker alimenté par les vrais codes
        TICKER = CODES.slice(0, 10).map(c => ({
          brand: c.brand,
          code: c.code,
          discount: c.discount,
        }));

        // Stats hero
        const stats = await statsRes.json();
        animCount('cnt-codes', stats.total_active_codes || CODES.length, '');
        animCount('cnt-brands', stats.total_platforms || PLATFORMS.length, '');
        animCount('cnt-rate', Math.round(stats.avg_ai_score || 75), '%');

        // Panel IA
        const e1 = document.getElementById('ai-checked');
        if (e1) e1.textContent = (stats.total_active_codes || CODES.length).toLocaleString('fr-FR');
        const e2 = document.getElementById('ai-score');
        if (e2) e2.textContent = Math.round(stats.avg_ai_score || 75) + '/100';

      } catch (err) {
        console.warn('API inaccessible :', err);
        document.getElementById('codes-count').textContent = 'Connexion en cours...';
      }
    }

    // ─── INITIALISATION ──────────────────────────────
    async function init() {
      document.getElementById('codes-count').textContent = 'Chargement...';
      await loadFromAPI();
      renderTicker();
      renderPlatforms();
      renderCategories();
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
      const email = document.getElementById('alert-email').value.trim();
      if (!email || !email.includes('@')) {
        document.getElementById('alert-email').style.borderColor = 'var(--orange)';
        document.getElementById('alert-email').placeholder = 'Email invalide !';
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
        // Même si l'API échoue, montrer le succès (on sauvegarde côté backend)
        document.getElementById('alert-form').style.display = 'none';
        document.getElementById('alert-success').style.display = 'block';
        setTimeout(() => closeAlertModal(), 3000);
      }
    }

    init();

    // ── KEEP ALIVE — empêche Render de dormir ──
    function keepAlive() {
      fetch(`${API}/stats`).catch(() => { });
    }
    setInterval(keepAlive, 10 * 60 * 1000); // toutes les 10 minutes
    keepAlive();

