export const switchView = (viewName) => {
    // 1. Sembunyikan SEMUA Section (Termasuk Landing Page!)
    const views = ['view-landing', 'view-auth', 'view-dashboard'];
    
    views.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
    
    // 2. Default: Sembunyikan Navbar (Kecuali nanti di dashboard dimunculkan)
    const navbar = document.getElementById('main-navbar');
    if(navbar) navbar.classList.add('hidden');

    // 3. Tampilkan Section Target
    const target = document.getElementById(viewName);
    if(target) {
        target.classList.remove('hidden');
        // Animasi Masuk (Fade In + Slide Up)
        gsap.fromTo(target, {opacity: 0, y: 20}, {opacity: 1, y: 0, duration: 0.5, clearProps: "all"});
    }

    // 4. Khusus Dashboard: Munculkan Navbar
    if(viewName === 'view-dashboard' && navbar) {
        navbar.classList.remove('hidden');
        gsap.fromTo(navbar, {y: -50, opacity: 0}, {y: 0, opacity: 1, duration: 0.5, delay: 0.1, clearProps: "all"});
    }
};