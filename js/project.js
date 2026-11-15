// Bouwt project.html op uit window.PROJECTS (js/projects-data.js) op basis van ?p=<slug>.
const root = document.querySelector("[data-project]");

const esc = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const backLink = `<a class="btn btn--paper back" href="projects.html">&larr; Alle projecten</a>`;

function renderNotFound() {
  document.title = "Project niet gevonden | Jouw Naam";
  root.innerHTML = `
    ${backLink}
    <div class="note pinned" style="--r:-1deg;max-width:560px">
      <h1>Oeps!</h1>
      <p class="lead">Dit project hangt (nog) niet op het prikbord.</p>
      <a class="btn" href="projects.html">Bekijk alle projecten</a>
    </div>`;
}

function renderProject(project, prev, next) {
  document.title = `${project.title} | Jouw Naam`;
  const tilts = ["2deg", "-2.5deg", "1deg", "-1.5deg"];
  const pins = ["", "pin-blue", "pin-green", "pin-yellow"];

  root.innerHTML = `
    ${backLink}

    <article aria-labelledby="project-title">
      <section class="project-hero">
        <figure class="polaroid taped" style="--r:-2deg">
          <img src="${esc(project.cover.src)}" alt="${esc(project.cover.alt)}" width="800" height="600">
          <figcaption>${esc(project.title.toLowerCase())}</figcaption>
        </figure>

        <div class="project-hero__info">
          <div class="note pinned ${esc(project.pin)}" style="--r:1deg">
            <h1 id="project-title">${esc(project.title)}</h1>
            <p class="lead">${esc(project.intro)}</p>
            <ul class="tags" aria-label="Tags">${project.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
          </div>

          <div class="index-card facts pinned pin-black" style="--r:-1.5deg">
            <span class="year">${esc(project.year)}</span>
            <dl>
              <dt>Rol</dt><dd>${esc(project.role)}</dd>
              <dt>Klant</dt><dd>${esc(project.client)}</dd>
              <dt>Tools</dt><dd>${esc(project.tools)}</dd>
            </dl>
          </div>
        </div>
      </section>

      <section class="project-story" aria-labelledby="story-title">
        <div class="note note--lined pinned pin-blue" style="--r:-0.5deg">
          <h2 id="story-title">Het verhaal</h2>
          ${project.story.map((p) => `<p>${esc(p)}</p>`).join("")}
        </div>
        <div class="sticky" style="--r:3deg;background-color:var(--note-green)">
          <h3>Resultaat</h3>
          <p>${esc(project.result)}</p>
        </div>
      </section>

      <section aria-labelledby="photos-title">
        <h2 id="photos-title" class="label taped">Foto's</h2>
        <div class="grid grid--3">
          ${project.photos
            .map(
              (photo, i) => `
            <figure class="polaroid pinned ${pins[i % pins.length]}" data-yarn="${i + 1}" style="--r:${tilts[i % tilts.length]}">
              <img src="${esc(photo.src)}" alt="${esc(photo.alt)}" width="800" height="600" loading="lazy">
              <figcaption>${esc(photo.caption)}</figcaption>
            </figure>`
            )
            .join("")}
        </div>
      </section>
    </article>

    <nav class="pager" aria-label="Andere projecten">
      <a class="btn btn--paper" href="project.html?p=${esc(prev.slug)}" rel="prev">&larr; ${esc(prev.title)}</a>
      <a class="btn btn--paper" href="project.html?p=${esc(next.slug)}" rel="next">${esc(next.title)} &rarr;</a>
    </nav>`;
}

if (root) {
  const projects = window.PROJECTS || [];
  const slug = new URLSearchParams(window.location.search).get("p");
  const index = projects.findIndex((p) => p.slug === slug);

  if (index === -1) {
    renderNotFound();
  } else {
    const prev = projects[(index - 1 + projects.length) % projects.length];
    const next = projects[(index + 1) % projects.length];
    renderProject(projects[index], prev, next);
  }
}
