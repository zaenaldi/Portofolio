document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector("#portfolioGrid");
  const filters = document.querySelector("#portfolioFilters");
  const count = document.querySelector("#projectCount");
  const modal = document.querySelector("#projectModal");
  const modalContent = document.querySelector("#modalContent");
  let activeFilter = "all";
  let activeProjectIndex = 0;
  let visibleProjects = [...(window.PORTFOLIO_PROJECTS || [])];

  const escapeHTML = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char],
    );

  function renderProjects() {
    window.PORTFOLIO_PROJECTS.sort(
      (a, b) => Number(b.year) - Number(a.year) || b.id - a.id,
    );
    const projects = window.PORTFOLIO_PROJECTS || [];
    visibleProjects =
      activeFilter === "all"
        ? [...projects]
        : projects.filter((project) => project.category === activeFilter);
    count.textContent = `${String(visibleProjects.length).padStart(2, "0")} KARYA`;
    if (!visibleProjects.length) {
      grid.innerHTML =
        '<div class="empty-state">Belum ada karya pada kategori ini. Tambahkan proyek melalui data/projects.js.</div>';
      return;
    }
    grid.innerHTML = visibleProjects
      .map(
        (project, index) => `
      <article class="project-card" data-project-index="${index}" tabindex="0" role="button" aria-label="Lihat detail ${escapeHTML(project.title)}">
        <div class="project-image-wrap">
          <img class="project-image" src="${escapeHTML(project.thumbnail)}" alt="${escapeHTML(project.title)}" loading="lazy">
          <div class="project-overlay"><span>LIHAT DETAIL — ${escapeHTML(project.title)}</span></div>
          <span class="project-open"><i data-lucide="arrow-up-right"></i></span>
        </div>
        <div class="project-info"><h3>${escapeHTML(project.title)}</h3><span>${escapeHTML(project.year)}</span></div>
        <p class="project-category">${escapeHTML(project.categoryLabel)}</p>
      </article>`,
      )
      .join("");
    if (window.lucide) window.lucide.createIcons();
    if (
      window.anime &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      anime({
        targets: ".project-card",
        opacity: [0, 1],
        translateY: [18, 0],
        delay: anime.stagger(65),
        duration: 500,
        easing: "easeOutCubic",
      });
    }
  }

  filters?.addEventListener("click", (event) => {
    const button = event.target.closest(".filter-btn");
    if (!button) return;
    filters
      .querySelectorAll(".filter-btn")
      .forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    renderProjects();
  });

  function openProject(index) {
    activeProjectIndex = index;
    const project = visibleProjects[index];
    if (!project) return;
    modalContent.innerHTML = `
      <span class="modal-category">${escapeHTML(project.categoryLabel)} / ${escapeHTML(project.year)}</span>
      <h2 id="modalTitle">${escapeHTML(project.title)}</h2>
      <div class="modal-meta"><span>TAHUN: ${escapeHTML(project.year)}</span><span>SOFTWARE: ${escapeHTML((project.software || []).join(", "))}</span></div>
      <img class="modal-hero-image" src="${escapeHTML((project.gallery || [project.thumbnail])[0])}" alt="${escapeHTML(project.title)}">
      <div class="modal-description-grid">
        <div><h3>GAMBARAN PROYEK</h3><p>${escapeHTML(project.description)}</p></div>
        <div><h3>TUJUAN DESAIN</h3><p>${escapeHTML(project.objective)}</p></div>
        <div><h3>KONSEP</h3><p>${escapeHTML(project.concept)}</p></div>
        <div><h3>PROSES</h3><p>${escapeHTML(project.process)}</p></div>
      </div>
      ${
        (project.gallery || []).length > 1
          ? `<div class="modal-gallery">${project.gallery
              .slice(1)
              .map(
                (image, i) =>
                  `<img src="${escapeHTML(image)}" alt="${escapeHTML(project.title)} — gambar ${i + 2}" loading="lazy">`,
              )
              .join("")}</div>`
          : ""
      }
    `;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    if (
      window.anime &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      anime({
        targets: ".modal-panel",
        opacity: [0, 1],
        translateY: [25, 0],
        duration: 350,
        easing: "easeOutCubic",
      });
    }
    if (window.lucide) window.lucide.createIcons();
  }

  function closeProject() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  grid?.addEventListener("click", (event) => {
    const card = event.target.closest(".project-card");
    if (card) openProject(Number(card.dataset.projectIndex));
  });
  grid?.addEventListener("keydown", (event) => {
    if (
      (event.key === "Enter" || event.key === " ") &&
      event.target.matches(".project-card")
    ) {
      event.preventDefault();
      openProject(Number(event.target.dataset.projectIndex));
    }
  });
  modal
    ?.querySelectorAll("[data-close-modal]")
    .forEach((button) => button.addEventListener("click", closeProject));
  document
    .querySelector("#prevProject")
    ?.addEventListener("click", () =>
      openProject(
        (activeProjectIndex - 1 + visibleProjects.length) %
          visibleProjects.length,
      ),
    );
  document
    .querySelector("#nextProject")
    ?.addEventListener("click", () =>
      openProject((activeProjectIndex + 1) % visibleProjects.length),
    );
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("open"))
      closeProject();
  });

  renderProjects();
});
