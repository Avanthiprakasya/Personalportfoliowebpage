// Global Variables
const typingTexts = [
    "Web Developer",
    "IoT Innovator",
    "ECE",
    "AI Integrator"
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

// DOM Elements
const typingElement = document.querySelector('.typing-text');
const navLinks = document.querySelectorAll('.nav-link');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const progressBar = document.querySelector('.progress-bar');
const circuitCanvas = document.getElementById('circuit-bg');
const contactForm = document.querySelector('.contact-form');

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initCircuitBackground();
    startTypingAnimation();
    setupNavigation();
    setupScrollEffects();
    setupScrollReveal();
    setupProjectInteractions();
    setupForm();
});

// Circuit Background Animation
function initCircuitBackground() {
    const canvas = circuitCanvas;
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // Circuit lines and nodes
    const nodes = [];
    const lines = [];

    // Generate circuit nodes
    for (let i = 0; i < 50; i++) {
        nodes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1,
            glow: Math.random() * 0.5 + 0.5
        });
    }

    // Connect nodes with lines
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
            if (dist < 150) {
                lines.push({
                    start: nodes[i],
                    end: nodes[j],
                    distance: dist
                });
            }
        }
    }

    function animateCircuit() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw lines with glow
        ctx.shadowColor = '#00d4ff';
        ctx.shadowBlur = 10;
        ctx.strokeStyle = 'rgba(0, 213, 255, 0.73)';
        ctx.lineWidth = 1;

        lines.forEach(line => {
            ctx.beginPath();
            ctx.moveTo(line.start.x, line.start.y);
            ctx.lineTo(line.end.x, line.end.y);
            ctx.stroke();
        });

        // Draw nodes with pulse effect
        nodes.forEach((node, index) => {
            const pulse = Math.sin(Date.now() * 0.01 + index) * 0.5 + 0.5;
            
            ctx.save();
            ctx.shadowColor = `rgba(0, 212, 255, ${node.glow})`;
            ctx.shadowBlur = 15 * pulse;
            
            const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 3);
            gradient.addColorStop(0, `rgba(0, 212, 255, ${pulse})`);
            gradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        });

        requestAnimationFrame(animateCircuit);
    }

    animateCircuit();
}

// Typing Animation
function startTypingAnimation() {
    const text = typingTexts[textIndex];
    
    if (isDeleting) {
        typingElement.textContent = text.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = text.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === text.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % typingTexts.length;
        typeSpeed = 500;
    }

    setTimeout(startTypingAnimation, typeSpeed);
}

// Navigation Setup
function setupNavigation() {
    // Smooth scrolling for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });

    // Hamburger menu
    hamburger.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when clicking on a link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            document.body.classList.remove('mobile-menu-open');
        });
    });
}

function smoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    // Close mobile menu
    document.body.classList.remove('mobile-menu-open');
}

function toggleMobileMenu() {
    document.body.classList.toggle('mobile-menu-open');
}

// Scroll Effects
function setupScrollEffects() {
    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(12, 12, 26, 0.98)';
        } else {
            navbar.style.background = 'rgba(12, 12, 26, 0.95)';
        }
    });

    // Scroll progress bar
    window.addEventListener('scroll', updateScrollProgress);
}

function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
}

// Active Nav Highlighting
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Scroll Reveal Animations
function setupScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe all animate elements
    document.querySelectorAll('[data-animate]').forEach(el => {
        observer.observe(el);
    });
}

// Project Card Interactions
function setupProjectInteractions() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            card.style.boxShadow = '0 25px 50px rgba(0, 212, 255, 0.3)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.3)';
        });

        // Staggered entrance
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// Contact Form
function setupForm() {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Add loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            alert('Thank you for your message! I\'ll get back to you soon. 🚀');
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// Cute skill box animations
document.addEventListener('DOMContentLoaded', () => {
    const skillBoxes = document.querySelectorAll('.skill-box');
    
    skillBoxes.forEach((box, index) => {
        box.style.animationDelay = `${index * 0.1}s`;
        box.addEventListener('mouseenter', () => {
            box.style.transform = 'scale(1.1) rotate(5deg)';
            box.style.boxShadow = '0 10px 30px rgba(0, 212, 255, 0.4)';
        });
        
        box.addEventListener('mouseleave', () => {
            box.style.transform = 'scale(1) rotate(0deg)';
            box.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
        });
    });
});

// Mobile responsiveness
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        document.body.classList.remove('mobile-menu-open');
    }
});

// Parallax effect for hero image
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroImage = document.querySelector('.floating-card');
    if (heroImage) {
        heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Intersection Observer for stats animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const stats = entry.target.querySelectorAll('.stat-item h3');
            stats.forEach((stat, index) => {
                setTimeout(() => {
                    stat.style.transform = 'scale(1)';
                    stat.style.opacity = '1';
                }, index * 200);
            });
        }
    });
});

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}
