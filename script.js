// Mobile menu: the hamburger button shows/hides the nav links on small screens.
// Smooth scrolling to #sections is handled in CSS (scroll-behavior).
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');

if (menuToggle && menu) {
  const setMenuOpen = (open) => {
    menu.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
  };

  menuToggle.addEventListener('click', () => {
    setMenuOpen(!menu.classList.contains('is-open'));
  });

  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenuOpen(false);
  });
}
