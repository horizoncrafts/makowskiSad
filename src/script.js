document.addEventListener("DOMContentLoaded", () => {
  // Select the button using a more specific selector
  const contactButton = document.querySelector("button.bg-primary");

  if (contactButton) {
    contactButton.addEventListener("click", () => {
      alert(
        "Dziękujemy za zainteresowanie! Prosimy o kontakt na adres: info@makowskisad.pl",
      );
    });
  }

  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  // Smooth-scroll only when the link targets a section on this page.
  // Links to another page are left to the browser.
  const menuLinks = document.querySelectorAll("#menu a, #mobile-menu a");
  menuLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const url = new URL(link.href);
      const samePage = url.pathname === window.location.pathname;
      if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
        mobileMenu.classList.add("hidden");
      }
      if (!samePage || !url.hash) return;

      const targetElement = document.getElementById(url.hash.slice(1));
      if (!targetElement) return;

      e.preventDefault();
      targetElement.scrollIntoView({ behavior: "smooth" });
    });
  });

  menuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
});
