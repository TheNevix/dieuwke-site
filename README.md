# Prikbord website

Eenvoudige statische website (HTML, CSS, een beetje JS) met 4 pagina's: Home, Projecten, Over mij en Contact. De achtergrond is een kurken prikbord; alle inhoud hangt erop als papiertjes, post-its en polaroids.

## Openen

Open `index.html` in je browser. Er is geen build-stap.

## Aanpassen

- **Foto's**: zet je eigen foto's in `img/` en vervang `src="img/placeholder.svg"` door je bestand. Pas ook de `alt`-tekst aan.
- **Tekst**: vervang de lorem ipsum in de HTML-bestanden.
- **Kleuren en lettertypes**: staan als variabelen bovenaan `css/style.css`. Huisstijl: Fredoka voor titels, Atkinson Hyperlegible voor tekst, knoppen en navigatie; blauw `#536C78` voor knoppen. De accentkleur (punaises, rood touw, viltstift) is `--accent`: zet die op `var(--brand-red)` of `var(--brand-orange)`.
- **Schuine stand**: elk item heeft `style="--r:-2deg"`; pas de hoek aan of zet op `0deg`.
- **Punaises**: klasse `pinned` (rood), plus `pin-blue`, `pin-green`, `pin-yellow` of `pin-black`. Plakband: klasse `taped`.
- **Projecten**: elk project heeft een eigen pagina (`dressed-to-impress.html`, `limo.html`, `ander-spoor.html`) met foto's in `img/<project>/`. Een nieuw project = kopieer een van die pagina's, pas tekst en foto's aan, en voeg een kaart toe in `projects.html` (en eventueel `index.html`). Pas ook de vorige/volgende-knoppen onderaan aan.
- **Contactformulier**: is nu een demo. Koppel het aan een dienst zoals Formspree of Netlify Forms via het `action`-attribuut en haal de demo-code uit `js/main.js`.
