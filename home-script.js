// ====== Theme Toggle ======
function toggleTheme() {
    const body = document.body;
    const themeBtn = document.querySelector('.theme-toggle');
    
    body.classList.toggle('dark-mode');
    
    // Save preference
    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
    
    // Update button
    themeBtn.textContent = body.classList.contains('dark-mode') ? '☀️' : '🌙';
}

// ====== Load Theme Preference ======
function loadTheme() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        document.querySelector('.theme-toggle').textContent = '☀️';
    }
}

// ====== Mobile Menu Toggle ======
function toggleMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// ====== Smooth Scroll ======
function scrollTo(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        // Close mobile menu
        document.querySelector('.nav-menu').classList.remove('active');
    }
}

// ====== Animate Numbers ======
function animateNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateNumber(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(number => observer.observe(number));
}

function animateNumber(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (element.textContent.includes('%') ? '%' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (element.textContent.includes('%') ? '%' : '');
        }
    }, 30);
}

// ====== Initialize ======
window.addEventListener('load', () => {
    loadTheme();
    animateNumbers();
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    const navMenu = document.querySelector('.nav-menu');
    const menuToggle = document.querySelector('.menu-toggle');
    const navbar = document.querySelector('.navbar');
    
    if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
    }
});
