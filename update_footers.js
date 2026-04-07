const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/ariel/Desktop/promosite/frontend/blog/';
const newFooter = `<footer>
  <p>
    <a href="../index.html">Accueil</a>
    <a href="code-promo-amazon.html">Amazon</a>
    <a href="code-promo-amazon-prime.html">Amazon Prime</a>
    <a href="code-promo-nike.html">Nike</a>
    <a href="code-promo-nike-soldes.html">Nike Soldes</a>
    <a href="code-promo-aliexpress.html">AliExpress</a>
    <a href="code-promo-aliexpress-anniversaire-2026.html">AliExpress Anniversaire</a>
    <a href="code-promo-shein.html">SHEIN</a>
    <a href="code-promo-shein-nouveaux-clients.html">SHEIN Nouveaux Clients</a>
    <a href="code-promo-zalando.html">Zalando</a>
    <a href="code-promo-zalando-nouveaux-clients.html">Zalando Nouveaux Clients</a>
    <a href="code-promo-ubereats.html">Uber Eats</a>
    <a href="code-promo-uber-eats-nouveaux-clients.html">Uber Eats Nouveaux Clients</a>
    <a href="code-promo-samsung.html">Samsung</a>
    <a href="code-promo-samsung-galaxy.html">Samsung Galaxy</a>
    <a href="code-promo-sephora.html">Sephora</a>
    <a href="code-promo-sephora-beauty-club.html">Sephora Beauty Club</a>
    <a href="code-promo-adidas.html">Adidas</a>
    <a href="code-promo-booking.html">Booking</a>
    <a href="code-promo-steam.html">Steam</a>
    <a href="code-promo-udemy.html">Udemy</a>
    <a href="code-promo-airbnb.html">Airbnb</a>
    <a href="code-promo-cdiscount.html">Cdiscount</a>
    <a href="code-promo-fnac.html">Fnac</a>
    <a href="code-promo-decathlon.html">Decathlon</a>
    <a href="code-promo-h-and-m.html">H&M</a>
    <a href="code-promo-zara.html">Zara</a>
    <a href="code-promo-asos.html">ASOS</a>
    <a href="code-promo-apple.html">Apple</a>
    <a href="code-promo-vinted.html">Vinted</a>
    <a href="code-promo-leboncoin.html">Leboncoin</a>
    <a href="meilleurs-codes-promos-mars-2026.html">Top Mars 2026</a>
    <a href="meilleurs-codes-promos-avril-2026.html">Top Avril 2026</a>
    <a href="meilleurs-codes-promos-mai-2026.html">Top Mai 2026</a>
    <a href="meilleurs-codes-promos-high-tech-2026.html">Top High-Tech</a>
    <a href="meilleurs-codes-promos-mode-2026.html">Top Mode</a>
    <a href="meilleurs-codes-promos-beaute-2026.html">Top Beauté</a>
    <a href="meilleurs-codes-promos-sport-2026.html">Top Sport</a>
    <a href="comment-ne-plus-payer-livraison.html">Livraison Gratuite</a>
    <a href="black-friday-codes-promos.html">Black Friday</a>
    <a href="economiser-en-ligne.html">Économiser en ligne</a>
    <a href="comment-utiliser-code-promo.html">Comment utiliser un code</a>
    <a href="../privacy.html">Confidentialité</a>
    <a href="../contact.html">Contact</a>
  </p>
  <p style="margin-top:10px">© 2026 PromosVault — Tous droits réservés</p>
</footer>`;

fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.html')) {
        let content = fs.readFileSync(path.join(dir, file), 'utf8');
        content = content.replace(/<footer>[\s\S]*?<\/footer>/, newFooter);
        fs.writeFileSync(path.join(dir, file), content);
    }
});
console.log("All footers updated in " + dir);
