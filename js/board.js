// Prikbord-magie: items landen op het bord, rood touw, slepen, wiebelen, lamp en papiersnippers.
// Alles is een extraatje bovenop gewone HTML: zonder JS of met reduced motion blijft de site werken.
(() => {
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const animate = root.classList.contains("anim");
  const cssVar = (name, fallback) => getComputedStyle(root).getPropertyValue(name).trim() || fallback;
  const ACCENT = cssVar("--accent", "#b7473a");
  const BRAND_BLUE = cssVar("--brand-blue", "#536c78");

  const ITEMS = ".note, .sticky, .polaroid, .index-card, .biz-card, .label, .logo, .nav a";
  const items = [...document.querySelectorAll(`.wrap :is(${ITEMS})`)];
  const draggables = items.filter((el) => !el.closest(".site-header"));
  const storeKey = `board:${location.pathname}${location.search}`;
  const deg = (v) => `${v.toFixed(2)}deg`;
  const rand = (min, max) => min + Math.random() * (max - min);

  // ---------- Posities (versleepbaar, onthouden per pagina) ----------

  const offsets = new Map();
  const getOffset = (el) => offsets.get(el) || { x: 0, y: 0 };
  const setOffset = (el, x, y) => {
    offsets.set(el, { x, y });
    el.style.setProperty("--dx", `${x}px`);
    el.style.setProperty("--dy", `${y}px`);
  };
  const hasMoved = () => draggables.some((el) => getOffset(el).x || getOffset(el).y);

  const store = {
    read() {
      try { return JSON.parse(localStorage.getItem(storeKey)) || {}; } catch { return {}; }
    },
    write() {
      const data = {};
      draggables.forEach((el, i) => {
        const { x, y } = getOffset(el);
        if (x || y) data[i] = [Math.round(x), Math.round(y)];
      });
      try {
        if (Object.keys(data).length) localStorage.setItem(storeKey, JSON.stringify(data));
        else localStorage.removeItem(storeKey);
      } catch { /* privémodus: dan maar niet onthouden */ }
      updateTools();
    },
  };

  if (finePointer) {
    const saved = store.read();
    draggables.forEach((el, i) => saved[i] && setOffset(el, saved[i][0], saved[i][1]));
  }

  // ---------- Rood touw tussen [data-yarn] items ----------
  // data-yarn="2" = volgorde, data-yarn-group="b" = apart touwtje (standaard "a")

  const SVG = "http://www.w3.org/2000/svg";
  const yarnItems = [...document.querySelectorAll("[data-yarn]")];
  const yarnGroups = {};
  yarnItems.forEach((el) => (yarnGroups[el.dataset.yarnGroup || "a"] ||= []).push(el));
  const yarnPairs = Object.values(yarnGroups).flatMap((list) => {
    list.sort((a, b) => a.dataset.yarn - b.dataset.yarn);
    return list.slice(1).map((el, i) => [yarnItems.indexOf(list[i]), yarnItems.indexOf(el)]);
  });
  let yarn = null;

  const shade = (hex, f) => {
    const n = parseInt(hex.replace("#", ""), 16);
    const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.round(v * f));
    return `rgb(${c.join(",")})`;
  };

  function buildYarn() {
    if (!yarnPairs.length) return;
    const svg = document.createElementNS(SVG, "svg");
    svg.setAttribute("class", "yarn");
    svg.setAttribute("aria-hidden", "true");
    const defs = document.createElementNS(SVG, "defs");
    svg.append(defs);

    const segments = yarnPairs.map(([from, to]) => {
      const strand = document.createElementNS(SVG, "path");
      const twist = document.createElementNS(SVG, "path");
      strand.setAttribute("class", "strand is-waiting");
      twist.setAttribute("class", "twist is-waiting");
      svg.append(strand, twist);
      return { strand, twist, from, to };
    });

    // Punaisekoppen bovenop het touw, in dezelfde kleur als de echte punaise eronder
    const heads = yarnItems.map((el, i) => {
      const anchor = document.createElement("span");
      anchor.className = "pin-anchor";
      anchor.setAttribute("aria-hidden", "true");
      el.append(anchor);
      el._anchor = anchor;

      const color = getComputedStyle(el).getPropertyValue("--pin").trim() || ACCENT;
      const grad = document.createElementNS(SVG, "radialGradient");
      grad.id = `pinhead-${i}`;
      grad.setAttribute("cx", "35%");
      grad.setAttribute("cy", "30%");
      grad.innerHTML = `<stop offset="12%" stop-color="rgba(255,255,255,.85)"/><stop offset="38%" stop-color="${color}"/><stop offset="100%" stop-color="${shade(color, 0.55)}"/>`;
      defs.append(grad);

      const head = document.createElementNS(SVG, "circle");
      head.setAttribute("class", "head is-waiting");
      head.setAttribute("r", "11");
      head.setAttribute("fill", `url(#pinhead-${i})`);
      svg.append(head);
      return head;
    });

    document.body.append(svg);
    yarn = { svg, segments, heads, ready: false, shown: new Set() };
  }

  // Plek in de layout (zonder slepen/draaien): offsetTop negeert translate en rotate
  function layoutBox(el) {
    let top = 0;
    for (let node = el; node; node = node.offsetParent) top += node.offsetTop;
    return { top, bottom: top + el.offsetHeight };
  }

  function drawYarn() {
    if (!yarn) return;
    yarn.svg.style.height = "0px";
    yarn.svg.style.height = `${root.scrollHeight}px`;

    const pts = yarnItems.map((el) => {
      const r = el._anchor.getBoundingClientRect();
      return { x: r.left + scrollX, y: r.top + scrollY };
    });

    // Alleen touw tussen items die naast elkaar staan; onder elkaar (bv. op mobiel) geen touw.
    // Gemeten op de plek in de layout, dus slepen laat het touw niet aan- en uitspringen.
    const boxes = yarnItems.map(layoutBox);
    const tied = new Set();

    yarn.segments.forEach(({ strand, twist, from, to }) => {
      const sideBySide = boxes[from].top < boxes[to].bottom && boxes[to].top < boxes[from].bottom;
      strand.classList.toggle("is-off", !sideBySide);
      twist.classList.toggle("is-off", !sideBySide);
      if (!sideBySide) return;
      tied.add(from).add(to);

      const a = pts[from];
      const b = pts[to];
      const sag = Math.min(110, Math.hypot(b.x - a.x, b.y - a.y) * 0.16);
      const d = `M${a.x} ${a.y} Q${(a.x + b.x) / 2} ${Math.max(a.y, b.y) + sag} ${b.x} ${b.y}`;
      strand.setAttribute("d", d);
      twist.setAttribute("d", d);
    });

    yarn.heads.forEach((head, i) => {
      head.classList.toggle("is-off", !tied.has(i));
      head.setAttribute("cx", pts[i].x);
      head.setAttribute("cy", pts[i].y);
    });
  }

  // Elk stuk touw wordt gespannen zodra de items aan beide uiteinden geland zijn
  function revealYarn() {
    if (!yarn) return;
    if (!yarn.ready) {
      yarn.ready = true;
      yarn.svg.classList.add("is-ready");
    }
    drawYarn();

    let wait = 0;
    yarn.segments.forEach(({ strand, twist, from, to }, i) => {
      if (yarn.shown.has(i) || !yarnItems[from]._landed || !yarnItems[to]._landed) return;
      yarn.shown.add(i);
      const heads = [yarn.heads[from], yarn.heads[to]];
      const show = () => {
        [strand, twist, ...heads].forEach((el) => el.classList.remove("is-waiting"));
      };
      if (reduce || !animate) return show();

      const len = strand.getTotalLength();
      const delay = wait;
      wait += 450;
      setTimeout(() => {
        heads[0].classList.remove("is-waiting");
        strand.classList.remove("is-waiting");
        strand.style.strokeDasharray = len;
        strand
          .animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 560, easing: "cubic-bezier(0.5, 0, 0.3, 1)" })
          .finished.then(() => {
            strand.style.strokeDasharray = "";
            show();
          });
      }, delay);
    });
  }

  // Touw opnieuw tekenen zolang er iets beweegt
  let loopUntil = 0;
  let looping = false;
  function kick(ms = 450) {
    if (!yarn || !yarn.ready) return;
    loopUntil = Math.max(loopUntil, performance.now() + ms);
    if (looping) return;
    looping = true;
    const tick = () => {
      drawYarn();
      if (performance.now() < loopUntil) requestAnimationFrame(tick);
      else looping = false;
    };
    requestAnimationFrame(tick);
  }

  buildYarn();
  document.addEventListener("transitionrun", () => kick(700));
  window.addEventListener("resize", () => kick(150));
  document.fonts?.ready.then(() => kick(100));

  // ---------- Binnenkomst: items vallen op het bord ----------

  const LAND_MS = 640;

  function land(el, delay) {
    if (el.classList.contains("landed")) return;
    el.style.setProperty("--land-delay", `${delay}ms`);
    el.classList.add("landed");

    let fall = null;
    if (animate) {
      const { x, y } = getOffset(el);
      const shadow = getComputedStyle(el).boxShadow;
      fall = el.animate(
        [
          { opacity: 0, translate: `${x + rand(-30, 30)}px ${y - 110}px`, scale: 1.28, rotate: deg(rand(-10, 10)), boxShadow: "0 60px 60px -20px rgba(0,0,0,0.3)" },
          { opacity: 1, translate: `${x}px ${y + 5}px`, scale: 0.97, rotate: "0deg", boxShadow: shadow, offset: 0.62 },
          { opacity: 1, translate: `${x}px ${y}px`, scale: 1, rotate: "0deg", boxShadow: shadow },
        ],
        { duration: LAND_MS, delay, easing: "cubic-bezier(0.3, 0.7, 0.3, 1)", fill: "backwards" }
      );
    }

    const landed = () => {
      el._landed = true;
      if (el.matches(".polaroid")) el.classList.add("developed");
      if (yarnItems.includes(el)) setTimeout(revealYarn, animate ? 200 : 0);
      kick(100);
    };
    if (fall) fall.finished.then(landed, landed);
    else landed();
  }

  if (animate) {
    let firstBatch = true;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).map((e) => e.target);
        visible.forEach((el, i) => {
          io.unobserve(el);
          land(el, Math.min(i * (firstBatch ? 75 : 110), 1300) + (firstBatch ? 120 : 0));
        });
        if (visible.length) firstBatch = false;
      },
      { rootMargin: "0px 0px -6% 0px" }
    );
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => land(el, 0));
  }

  window.boardReady = true;

  // ---------- Slepen (muis/pen; touch blijft gewoon scrollen) ----------

  let zTop = 20;

  function startDrag(e, el) {
    if (e.button !== 0 || e.pointerType === "touch") return;
    if (e.target.closest("input, textarea, select, button, label, video")) return;

    const start = { px: e.clientX, py: e.clientY, ...getOffset(el) };
    let moved = false;
    let lastX = e.clientX;
    let lastT = e.timeStamp;
    let swing = 0;

    const onMove = (ev) => {
      const dx = ev.clientX - start.px;
      const dy = ev.clientY - start.py;
      if (!moved) {
        if (Math.hypot(dx, dy) < 6) return;
        moved = true;
        el.setPointerCapture(ev.pointerId);
        el.getAnimations().forEach((a) => a.finish());
        el.classList.add("dragging");
        el.style.zIndex = ++zTop;
        document.body.classList.add("is-dragging");
      }
      setOffset(el, start.x + dx, start.y + dy);

      // Het papier hangt aan de punaise en zwaait achter je muis aan
      const dt = Math.max(8, ev.timeStamp - lastT);
      const vx = (ev.clientX - lastX) / dt;
      lastX = ev.clientX;
      lastT = ev.timeStamp;
      swing += (Math.max(-16, Math.min(16, vx * 12)) - swing) * 0.3;
      if (!reduce) el.style.rotate = deg(swing);
      kick(150);
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      if (!moved) return;

      el.classList.remove("dragging");
      document.body.classList.remove("is-dragging");
      el.style.rotate = "";
      if (!reduce) {
        el.animate({ rotate: [swing, -swing * 0.6, swing * 0.32, -swing * 0.12, 0].map(deg) }, { duration: 1000, easing: "ease-out" });
        el.animate({ scale: [1.05, 0.97, 1] }, { duration: 280, easing: "ease-out" });
      }

      // Na slepen geen klik doorlaten (anders open je per ongeluk een project)
      const block = (ev) => { ev.preventDefault(); ev.stopPropagation(); };
      el.addEventListener("click", block, { capture: true, once: true });
      setTimeout(() => el.removeEventListener("click", block, { capture: true }), 0);

      store.write();
      kick(1100);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  }

  if (finePointer) {
    draggables.forEach((el) => {
      el.classList.add("draggable");
      el.addEventListener("dragstart", (e) => e.preventDefault());
      el.addEventListener("pointerdown", (e) => startDrag(e, el));
    });
  }

  // ---------- Zachtjes zwaaien als je over iets vastgeprikt beweegt ----------

  function swingOnce(el, amp, delay = 0, duration = 1200) {
    return el.animate({ rotate: [0, amp, -amp * 0.68, amp * 0.38, -amp * 0.15, 0].map(deg) }, { duration, delay, easing: "ease-out" });
  }

  if (finePointer && !reduce) {
    items
      .filter((el) => el.matches(".pinned, .nav a"))
      .forEach((el) => {
        el.addEventListener("pointerenter", () => {
          if (el._swinging || el.classList.contains("dragging") || document.body.classList.contains("is-dragging")) return;
          el._swinging = true;
          const end = () => (el._swinging = false);
          swingOnce(el, rand(1.6, 2.6) * (Math.random() < 0.5 ? -1 : 1)).finished.then(end, end);
        });
      });
  }

  // ---------- Dubbelklik op het kurk: schokgolf over het bord ----------

  if (!reduce) {
    document.addEventListener("dblclick", (e) => {
      if (e.target.closest(`${ITEMS}, a, button, input, textarea, select, label, .board-tools`)) return;
      getSelection()?.removeAllRanges();

      document.querySelector(".wrap").animate({ translate: ["0 0", "0 5px", "0 -2px", "0 1px", "0 0"] }, { duration: 320, easing: "ease-out" });
      items.forEach((el) => {
        const r = el.getBoundingClientRect();
        const dist = Math.hypot(r.left + r.width / 2 - e.clientX, r.top + r.height / 2 - e.clientY);
        const amp = Math.max(1.5, 10 - dist / 110) * (Math.random() < 0.5 ? -1 : 1);
        swingOnce(el, amp, dist * 0.55, 1300);
      });
      kick(400);
    });
  }

  // ---------- Lamp die je muis volgt ----------

  if (finePointer && !reduce) {
    const lamp = document.createElement("div");
    lamp.className = "lamp";
    lamp.setAttribute("aria-hidden", "true");
    document.body.append(lamp);
    let frame = 0;
    window.addEventListener(
      "pointermove",
      (e) => {
        if (frame) return;
        frame = requestAnimationFrame(() => {
          lamp.style.setProperty("--mx", `${e.clientX}px`);
          lamp.style.setProperty("--my", `${e.clientY}px`);
          frame = 0;
        });
      },
      { passive: true }
    );
  }

  // ---------- Tip + "bord opruimen" ----------

  let resetBtn = null;

  function updateTools() {
    if (resetBtn) resetBtn.hidden = !hasMoved();
  }

  function resetBoard() {
    draggables.forEach((el) => {
      el.classList.add("returning");
      setOffset(el, 0, 0);
    });
    store.write();
    kick(900);
    setTimeout(() => draggables.forEach((el) => el.classList.remove("returning")), 750);
  }

  if (finePointer && draggables.length) {
    const tools = document.createElement("div");
    tools.className = "board-tools";

    resetBtn = document.createElement("button");
    resetBtn.type = "button";
    resetBtn.className = "btn btn--paper btn--small";
    resetBtn.textContent = "Let's tidy up!";
    resetBtn.addEventListener("click", resetBoard);
    tools.append(resetBtn);

    let dismissed = false;
    try { dismissed = localStorage.getItem("board:hint") === "weg"; } catch { /* negeren */ }
    if (!dismissed) {
      const hint = document.createElement("aside");
      hint.className = "hint";
      hint.setAttribute("aria-label", "Tip");
      hint.setAttribute("lang", "en");
      hint.innerHTML = `
        <h3>Psst!</h3>
        <p>This pinboard is interactive! Move things around to add your own touch!</p>
        <button class="hint__close" type="button" aria-label="Close tip">&times;</button>`;
      hint.querySelector("button").addEventListener("click", () => {
        try { localStorage.setItem("board:hint", "weg"); } catch { /* negeren */ }
        if (reduce) return hint.remove();
        hint.animate({ translate: ["0 0", "0 140%"], rotate: ["2deg", "18deg"], opacity: [1, 0] }, { duration: 380, easing: "ease-in" }).finished.then(() => hint.remove());
      });
      tools.prepend(hint);
      if (animate) {
        hint.animate(
          [
            { opacity: 0, translate: "0 -80px", scale: 1.3, rotate: "-8deg" },
            { opacity: 1, translate: "0 4px", scale: 0.97, rotate: "2deg", offset: 0.65 },
            { opacity: 1, translate: "0 0", scale: 1, rotate: "2deg" },
          ],
          { duration: 640, delay: 1900, easing: "cubic-bezier(0.3, 0.7, 0.3, 1)", fill: "backwards" }
        );
      }
    }

    document.body.append(tools);
    updateTools();
  }

  // ---------- Papiersnippers (gebruikt door het contactformulier) ----------

  window.paperConfetti = (origin) => {
    if (reduce) return;
    const box = origin.getBoundingClientRect();
    const ox = box.left + box.width / 2;
    const oy = box.top;
    const colors = ["#fff1a1", "#ffd3dc", "#cfe6ff", "#d7f2c8", "#fffdf6", "#ffffff"];
    const pins = [ACCENT, BRAND_BLUE, "#2e9b57", "#e8b21c"];

    const layer = document.createElement("div");
    layer.className = "confetti";
    layer.setAttribute("aria-hidden", "true");
    document.body.append(layer);

    const bits = Array.from({ length: 110 }, (_, i) => {
      const el = document.createElement("i");
      const isPin = i % 10 === 0;
      const w = isPin ? 12 : rand(7, 16);
      const h = isPin ? 12 : rand(6, 14);
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
      el.style.background = isPin ? pins[i % pins.length] : colors[i % colors.length];
      if (isPin) el.className = "pin-bit";
      layer.append(el);
      const angle = -Math.PI / 2 + rand(-0.9, 0.9);
      const speed = rand(9, 20);
      return { el, x: ox, y: oy, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, r: rand(0, 360), vr: rand(-14, 14), flip: rand(0, 6), isPin };
    });

    const t0 = performance.now();
    const step = (t) => {
      const age = t - t0;
      bits.forEach((b) => {
        b.vy = Math.min(b.vy + 0.42, b.isPin ? 9 : 3.6); // papier dwarrelt, punaises vallen
        b.vx *= 0.975;
        b.x += b.vx + (b.isPin ? 0 : Math.sin(age / 170 + b.flip) * 1.4);
        b.y += b.vy;
        b.r += b.vr;
        b.el.style.transform = `translate(${b.x}px, ${b.y}px) rotate(${b.r}deg) rotateX(${age * 0.5 + b.flip * 60}deg)`;
      });
      layer.style.opacity = age > 2200 ? Math.max(0, 1 - (age - 2200) / 700) : 1;
      if (age < 2900) requestAnimationFrame(step);
      else layer.remove();
    };
    requestAnimationFrame(step);
  };
})();
