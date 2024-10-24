document.addEventListener('DOMContentLoaded', () => {
    // Select the button using a more specific selector
    const contactButton = document.querySelector('button.bg-primary');

    if (contactButton) {
        console.log('Contact button found');
        contactButton.addEventListener('click', () => {
            alert('Dziękujemy za zainteresowanie! Prosimy o kontakt na adres: info@makowskisad.pl');
        });
    } else {
        console.error('Contact button not found');
    }

    // Add smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
});
