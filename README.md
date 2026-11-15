# Prikbord website

Eenvoudige statische website (HTML, CSS, een beetje JS) met 4 pagina's: Home, Projecten, Over mij en Contact. De achtergrond is een kurken prikbord; alle inhoud hangt erop als papiertjes, post-its en polaroids.

## Openen

Open `index.html` in je browser. Er is geen build-stap.

## Aanpassen

- **Foto's**: zet je eigen foto's in `img/` en vervang `src="img/placeholder.svg"` door je bestand. Pas ook de `alt`-tekst aan.
- **Tekst**: vervang "Jouw Naam" en de lorem ipsum in de HTML-bestanden.
- **Kleuren en lettertypes**: staan als variabelen bovenaan `css/style.css`.
- **Schuine stand**: elk item heeft `style="--r:-2deg"`; pas de hoek aan of zet op `0deg`.
- **Punaises**: klasse `pinned` (rood), plus `pin-blue`, `pin-green`, `pin-yellow` of `pin-black`. Plakband: klasse `taped`.
- **Projecten**: de detailpagina `project.html?p=<slug>` haalt zijn inhoud uit `js/projects-data.js`. Een nieuw project = een blok toevoegen in dat bestand + een kaart in `projects.html` met `href="project.html?p=<slug>"`.
- **Contactformulier**: is nu een demo. Koppel het aan een dienst zoals Formspree of Netlify Forms via het `action`-attribuut en haal de demo-code uit `js/main.js`.
