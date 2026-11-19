document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = [...document.querySelectorAll(".nav-link")];
  const progress = document.querySelector(".scroll-progress");

  const updateScrollUI = () => {
    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progress.style.width = `${percent}%`;
    header.classList.toggle("scrolled", window.scrollY > 24);
  };
  updateScrollUI();
  window.addEventListener("scroll", updateScrollUI, { passive: true });

  menuToggle?.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    navMenu.classList.toggle("open", !isOpen);
  });

  navLinks.forEach((link) =>
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
    }),
  );

  const sections = [...document.querySelectorAll("main section[id]")];
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) =>
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`,
          ),
        );
      });
    },
    { rootMargin: "-35% 0px -55% 0px" },
  );
  sections.forEach((section) => sectionObserver.observe(section));

  document.querySelector("#currentYear").textContent = new Date().getFullYear();

  const contactForm = document.querySelector("#contactForm");
  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const data = new FormData(contactForm);
    const recipient = "designza13@gmail.com"; // GANTI dengan email tujuan Anda.
    const subject = encodeURIComponent(data.get("subject"));
    const body = encodeURIComponent(
      `Nama: ${data.get("name")}\nEmail: ${data.get("email")}\n\nPesan:\n${data.get("message")}`,
    );
    document.querySelector("#formStatus").textContent =
      "Aplikasi email akan dibuka. Periksa kembali pesan sebelum mengirim.";
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  });

  document.addEventListener("click", (event) => {
    const anchor = event.target.closest('a[href^="#"]');
    if (!anchor) return;
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  if (window.lucide) window.lucide.createIcons();
});
