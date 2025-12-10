export const switchView = (viewName) => {
    // Hide all
    document.getElementById('view-auth').classList.add('hidden');
    document.getElementById('view-dashboard').classList.add('hidden');
    
    // Hide navbar default
    const navbar = document.getElementById('main-navbar');
    if(navbar) navbar.classList.add('hidden');

    // Show target
    const target = document.getElementById(viewName);
    if(target) {
        target.classList.remove('hidden');
        gsap.fromTo(target, {opacity: 0, y: 10}, {opacity: 1, y: 0, duration: 0.5});
    }

    // Show navbar only on dashboard
    if(viewName === 'view-dashboard' && navbar) {
        navbar.classList.remove('hidden');
        gsap.fromTo(navbar, {y: -50, opacity: 0}, {y: 0, opacity: 1, duration: 0.5, delay: 0.1});
    }
};