export const switchView = (viewName) => {
    const views = ['view-auth', 'view-dashboard'];
    
    views.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
    
    // Default: Sembunyikan Navbar
    const navbar = document.getElementById('main-navbar');
    if(navbar) navbar.classList.add('hidden');

    // Tampilkan Section Target
    const target = document.getElementById(viewName);
    if(target) {
        target.classList.remove('hidden');
        gsap.fromTo(target, {opacity: 0, y: 10}, {opacity: 1, y: 0, duration: 0.4, clearProps: "all"});
    }

    if(viewName === 'view-dashboard' && navbar) {
        navbar.classList.remove('hidden');
        gsap.fromTo(navbar, {y: -50, opacity: 0}, {y: 0, opacity: 1, duration: 0.5, delay: 0.1, clearProps: "all"});
    }
};