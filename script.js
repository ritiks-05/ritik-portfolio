(() => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  const header = document.querySelector(".site-header");
  const themeButton = document.querySelector(".theme-toggle");
  const themeIcon = document.querySelector(".theme-icon");
  const savedTheme = (() => { try { return localStorage.getItem("ritik-portfolio-theme"); } catch (_) { return null; } })();
  const applyTheme = theme => {
    document.body.dataset.theme = theme;
    if (themeIcon) themeIcon.textContent = theme === "light" ? "☾" : "☼";
    themeButton?.setAttribute("aria-label", theme === "light" ? "Switch to dark theme" : "Switch to light theme");
    themeButton?.setAttribute("title", theme === "light" ? "Switch to dark theme" : "Switch to light theme");
    try { localStorage.setItem("ritik-portfolio-theme", theme); } catch (_) {}
  };
  applyTheme(savedTheme === "light" ? "light" : "dark");
  themeButton?.addEventListener("click", () => applyTheme(document.body.dataset.theme === "light" ? "dark" : "light"));
  const navLinks = [...(nav?.querySelectorAll('a[href^="#"]') || [])];
  const sectionTargets = navLinks.map(link => ({ link, section: document.querySelector(link.getAttribute("href")) })).filter(item => item.section);
  const updateHeader = () => {
    header?.classList.toggle("scrolled", window.scrollY > 12);
    let current = sectionTargets[0];
    for (const item of sectionTargets) if (item.section.getBoundingClientRect().top <= 140) current = item;
    navLinks.forEach(link => link.classList.toggle("active", link === current?.link));
  };
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();
  menuButton?.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    nav.classList.toggle("open", !isOpen);
  });
  nav?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "Open navigation");
  }));
  document.getElementById("year").textContent = new Date().getFullYear();

  const revealItems = document.querySelectorAll(".project-card, .service-row, .about-stamp, .about-copy, .contact-form");
  revealItems.forEach(item => item.classList.add("reveal"));
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add("visible"));

  // This is a no-backend contact form: it opens the visitor's configured mail app.
  // Replace the placeholder address below with the owner's real email before publishing.
  const CONTACT_EMAIL = "ritikkumar.coder@gmail.com";
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  form?.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const type = String(data.get("projectType") || "").trim();
    const message = String(data.get("message") || "").trim();
    const subject = `Portfolio enquiry: ${type}`;
    const body = `Hi Ritik,\\n\\n${message}\\n\\nProject type: ${type}\\nFrom: ${name}\\nReply to: ${email}`;
    status.textContent = "Opening your email app with the enquiry prepared…";
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.setTimeout(() => {
      status.textContent = "If your email app didn't open, email me directly. Update CONTACT_EMAIL in script.js before publishing.";
    }, 1800);
  });
})();