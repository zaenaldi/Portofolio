document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector("#certificateGrid");
  const modal = document.querySelector("#imageModal");
  const preview = document.querySelector("#certificatePreview");
  const items = window.PORTFOLIO_CERTIFICATES || [];
  const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[char]));
  grid.innerHTML = items.map(item => `
    <article class="certificate-card" tabindex="0" role="button" data-image="${escapeHTML(item.image)}" data-title="${escapeHTML(item.title)}" aria-label="Lihat ${escapeHTML(item.title)}">
      <div class="certificate-thumb"><img src="${escapeHTML(item.image)}" alt="Pratinjau ${escapeHTML(item.title)}" loading="lazy"></div>
      <div class="certificate-info"><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.issuer)} · ${escapeHTML(item.date)}</p><p class="gold-text">${escapeHTML(item.category)}</p></div>
    </article>`).join("");

  function openImage(card) {
    preview.src = card.dataset.image;
    preview.alt = card.dataset.title || "Pratinjau sertifikat";
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }
  function closeImage() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }
  grid.addEventListener("click", event => {
    const card = event.target.closest(".certificate-card");
    if (card) openImage(card);
  });
  grid.addEventListener("keydown", event => {
    if ((event.key === "Enter" || event.key === " ") && event.target.matches(".certificate-card")) {
      event.preventDefault(); openImage(event.target);
    }
  });
  modal.querySelectorAll("[data-close-image]").forEach(button => button.addEventListener("click", closeImage));
  document.addEventListener("keydown", event => { if (event.key === "Escape" && modal.classList.contains("open")) closeImage(); });
  if (window.lucide) window.lucide.createIcons();
});
