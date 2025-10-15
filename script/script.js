// Typing animation
let typingTimeout;

function typeText(element, text, speed = 80) {
    return new Promise((resolve) => {
        element.classList.add('typing');
        element.textContent = '';
        let i = 0;
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                typingTimeout = setTimeout(type, speed);
            } else {
                setTimeout(() => {
                    element.classList.remove('typing');
                    resolve();
                }, 500);
            }
        }
        
        type();
    });
}

function deleteText(element) {
    return new Promise((resolve) => {
        // Add smooth fade out and blur effect
        element.style.transition = 'opacity 0.4s ease, filter 0.4s ease';
        element.style.opacity = '0';
        element.style.filter = 'blur(5px)';
        
        setTimeout(() => {
            element.textContent = '';
            element.style.opacity = '1';
            element.style.filter = 'blur(0px)';
            resolve();
        }, 400);
    });
}

// Particle system
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size between 2-6px
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Random horizontal position
        particle.style.left = Math.random() * 100 + '%';
        
        // Start from bottom
        particle.style.bottom = '-10px';
        
        // Random animation duration (15-30 seconds)
        const duration = Math.random() * 15 + 15;
        particle.style.animation = `particleFloat ${duration}s linear infinite`;
        
        // Random delay
        const delay = Math.random() * 10;
        particle.style.animationDelay = `-${delay}s`;
        
        // Random horizontal drift
        const drift = (Math.random() - 0.5) * 100;
        particle.style.setProperty('--drift', drift + 'px');
        
        particlesContainer.appendChild(particle);
    }
}

createParticles();

// Copy to clipboard function
function copyToClipboard(text, type) {
    navigator.clipboard.writeText(text).then(() => {
        const messages = {
            da: { Email: 'Email', Phone: 'Telefonnummer', Address: 'Adresse' },
            en: { Email: 'Email', Phone: 'Phone', Address: 'Address' },
            de: { Email: 'E-Mail', Phone: 'Telefonnummer', Address: 'Adresse' }
        };
        const copiedText = {
            da: 'kopieret!',
            en: 'copied!',
            de: 'kopiert!'
        };
        showToast(`${messages[currentLang][type]} ${copiedText[currentLang]}`);
        createConfetti();
    });
}

// Create confetti effect
function createConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 1 },
        colors: ['#667eea', '#764ba2', '#ffd700', '#ff6b9d', '#4ecdc4', '#95e1d3'],
        gravity: 0.8,
        ticks: 200,
        startVelocity: 30,
        shapes: ['circle', 'square'],
        scalar: 1.2
    });
}

// Show toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// Highlight today in opening hours
function highlightToday() {
    const days = ['Weekend', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Weekend'];
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    const hoursGrid = document.getElementById('hoursGrid');
    const dayElements = hoursGrid.querySelectorAll('.hours-day');
    const timeElements = hoursGrid.querySelectorAll('.hours-time');
    
    dayElements.forEach((dayEl, index) => {
        const dayName = days[today];
        const currentDayName = dayEl.getAttribute('data-da');
        
        if (currentDayName === dayName) {
            dayEl.classList.add('today');
            timeElements[index].classList.add('today');
        }
    });
}

highlightToday();

// Toggle opening hours popup
function toggleHours() {
    const popup = document.getElementById('hoursPopup');
    popup.classList.toggle('open');
}

// Close popup when clicking outside
document.addEventListener('click', (e) => {
    const popup = document.getElementById('hoursPopup');
    const fab = document.getElementById('hoursFab');
    
    if (!popup.contains(e.target) && !fab.contains(e.target)) {
        popup.classList.remove('open');
    }
});

// Language switcher
const translations = {
    da: {
        tagline: 'Hjemsted for Børnenes Hovedstad',
        website: 'Billund Kommunes hjemmeside',
        contact: 'Kontakt os!',
        footer: 'Lavet med ❤️ af Billund Kommune'
    },
    en: {
        tagline: 'Home of the Capital of Children',
        website: 'Billund Municipality Website',
        contact: 'Contact us!',
        footer: 'Made with ❤️ by Billund Municipality'
    },
    de: {
        tagline: 'Heimat der Hauptstadt der Kinder',
        website: 'Billund Kommune Webseite',
        contact: 'Kontaktieren Sie uns!',
        footer: 'Erstellt mit ❤️ von Billund Kommune'
    }
};

let currentLang = 'da';

async function switchLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;

    // Update active button immediately
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Handle tagline deletion at the same time as other elements blur
    const taglineEl = document.querySelector('.tagline');
    const taglineText = taglineEl.getAttribute(`data-${lang}`);
    
    // Clear any existing typing timeout
    if (typingTimeout) {
        clearTimeout(typingTimeout);
    }

    // Start tagline deletion immediately
    const taglineDeletePromise = deleteText(taglineEl);

    // Animate all other elements with blur effect
    const elementsToBlur = document.querySelectorAll('[data-da]:not(.tagline)');
    
    // Only fade icons for elements that have translatable text (have data-da attribute)
    const iconsToFade = [];
    elementsToBlur.forEach(el => {
        // Find the icon within the same parent link button
        const linkButton = el.closest('.link-button');
        if (linkButton) {
            const icon = linkButton.querySelector('.link-icon');
            if (icon && !iconsToFade.includes(icon)) {
                iconsToFade.push(icon);
            }
        }
    });
    
    // Fade out only the icons that need to change
    iconsToFade.forEach(icon => {
        icon.style.transition = 'opacity 0.5s ease';
        icon.style.opacity = '0';
    });
    
    elementsToBlur.forEach(el => {
        // Add blur and fade out (slower transition)
        el.style.transition = 'filter 0.5s ease, opacity 0.5s ease';
        el.style.filter = 'blur(10px)';
        el.style.opacity = '0';
        
        setTimeout(() => {
            // Change text while blurred - check if element has data attribute for current language
            const newText = el.getAttribute(`data-${lang}`);
            if (newText) {
                el.textContent = newText;
            }
            
            // Blur in and fade in
            el.style.filter = 'blur(0px)';
            el.style.opacity = '1';
        }, 500);
    });

    // Fade icons back in after text changes
    setTimeout(() => {
        iconsToFade.forEach(icon => {
            icon.style.opacity = '1';
        });
    }, 500);

    // Wait for deletion to complete, then type new tagline
    await taglineDeletePromise;
    await typeText(taglineEl, taglineText);
}

// Language switcher event listeners
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        switchLanguage(btn.dataset.lang);
    });
});

// Initial typing animation on page load
window.addEventListener('load', () => {
    const taglineEl = document.querySelector('.tagline');
    const initialText = taglineEl.getAttribute('data-da');
    typeText(taglineEl, initialText);
});