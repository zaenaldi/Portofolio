document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!window.anime || reduceMotion) {
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("is-visible"));
    return;
  }

  anime({
    targets: ".hero-eyebrow, .hero-title, .hero-tagline, .hero-description, .hero-actions, .hero-socials",
    opacity: [0, 1], translateY: [22, 0], delay: anime.stagger(110, { start: 150 }),
    duration: 850, easing: "easeOutExpo"
  });
  anime({
    targets: ".hero-image-wrap", opacity: [0, 1], translateX: [35, 0], scale: [.97, 1],
    delay: 350, duration: 1100, easing: "easeOutExpo"
  });
  anime({
    targets: ".hero-stamp", scale: [.75, 1], rotate: [-24, -13],
    delay: 900, duration: 800, easing: "easeOutBack"
  });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      anime({ targets: entry.target, opacity: [0, 1], translateY: [24, 0], duration: 700, easing: "easeOutCubic" });
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: .12, rootMargin: "0px 0px -35px 0px" });
  document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

  const workflow = document.querySelector(".workflow-section");
  const workflowObserver = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    anime({ targets: ".workflow-line-fill", width: ["0%", "100%"], duration: 1500, easing: "easeInOutSine" });
    anime({ targets: ".workflow-step", opacity: [0, 1], translateY: [20, 0], delay: anime.stagger(150), duration: 650, easing: "easeOutCubic" });
    workflowObserver.disconnect();
  }, { threshold: .25 });
  if (workflow) workflowObserver.observe(workflow);
});
