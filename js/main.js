// Jaartal in de footer
document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

// Contactformulier: demo zonder backend. Koppel later aan bv. Formspree of Netlify Forms.
const form = document.querySelector("[data-contact-form]");

if (form) {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const note = form.closest(".note");
  const thanks = note.querySelector("[data-thanks]");
  const status = note.querySelector(".form-status");

  const swap = (showThanks) => {
    form.hidden = showThanks;
    thanks.hidden = !showThanks;
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = form.elements.name.value.trim();
    thanks.querySelector("[data-thanks-name]").textContent = name;

    if (!reduce) {
      window.paperConfetti?.(form.querySelector("[type=submit]"));
      // Het briefje vliegt weg...
      const away = note.animate([{ translate: "60vw -95vh", rotate: "38deg", scale: 0.25, opacity: 0 }], {
        duration: 750,
        easing: "cubic-bezier(0.55, 0, 0.8, 0.2)",
        fill: "forwards",
      });
      await away.finished;
      swap(true);
      away.cancel();
      // ...en een nieuw briefje wordt vastgeprikt
      note.animate(
        [
          { opacity: 0, translate: "0 -120px", scale: 1.25, rotate: "-7deg" },
          { opacity: 1, translate: "0 5px", scale: 0.97, rotate: "0deg", offset: 0.62 },
          { opacity: 1, translate: "0 0", scale: 1, rotate: "0deg" },
        ],
        { duration: 640, easing: "cubic-bezier(0.3, 0.7, 0.3, 1)", composite: "add" }
      );
    } else {
      swap(true);
    }

    status.textContent = `Bedankt ${name}! Dit is een demo, je bericht is nog niet echt verzonden.`;
    form.reset();
    thanks.focus();
  });

  thanks.querySelector("button").addEventListener("click", () => {
    swap(false);
    status.textContent = "";
    form.elements.name.focus();
  });
}
