// Set current year in footer
document.addEventListener('DOMContentLoaded', () => {
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Initialize Dark Mode from localStorage
    if (localStorage.getItem('dark-mode') === 'enabled') {
        document.body.classList.add('dark-mode');
        updateDarkModeIcon(true);
    }

    // Scroll Reveal Initialization
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Unobserve if you only want it once
                // observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.1
    });

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Add staggered delay to list items if parent has 'reveal'
    document.querySelectorAll('.reveal .mission-list li, .reveal .pill-row .pill, .reveal .programs-grid article, .reveal .stats-row .stat-card, .reveal .help-step, .reveal .testimonials-grid .testimonial-card').forEach(item => {
        item.classList.add('stagger-item');
    });
});

// Mobile menu toggle
function toggleMobileMenu() {
    const menu = document.getElementById("mobileMenu");
    if (menu.style.display === "block") {
        menu.style.display = "none";
    } else {
        menu.style.display = "block";
    }
}

function closeMobileMenu() {
    const menu = document.getElementById("mobileMenu");
    if (menu) {
        menu.style.display = "none";
    }
}

// Dark Mode Toggle
function toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('dark-mode', isDark ? 'enabled' : 'disabled');
    updateDarkModeIcon(isDark);
}

function updateDarkModeIcon(isDark) {
    const icon = document.getElementById('darkModeIcon');
    if (icon) {
        icon.textContent = isDark ? '☀️' : '🌙';
    }
}

// Simple form handler
// Advanced form handler with fetch and premium feedback
async function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const btn = form.querySelector('.btn-send');
    const originalBtnText = btn.innerHTML;

    // Set loading state
    btn.classList.add('loading');
    btn.innerHTML = `<span class="loader"></span> Sending...`;

    try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // Success
            showSuccessOverlay();
            form.reset();
        } else {
            // Error handling
            const data = await response.json();
            if (Object.hasOwn(data, 'errors')) {
                alert(data["errors"].map(error => error["message"]).join(", "));
            } else {
                alert("Oops! There was a problem submitting your form. Please try again.");
            }
        }
    } catch (error) {
        alert("Oops! Connection error. Please check your data and try again.");
    } finally {
        // Reset button state
        btn.classList.remove('loading');
        btn.innerHTML = originalBtnText;
    }
}

function showSuccessOverlay() {
    // Create overlay if it doesn't exist
    let overlay = document.getElementById('successOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'successOverlay';
        overlay.className = 'success-overlay';
        document.body.appendChild(overlay);

        // Click outside to close
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeSuccessOverlay();
        });
    }

    // Update content with current language
    const title = translations[currentLang]['success-title'] || 'Message Sent!';
    const message = translations[currentLang]['success-message'] || 'Thank you for reaching out.';
    const btnText = translations[currentLang]['success-btn'] || 'Done';

    overlay.innerHTML = `
        <div class="success-card">
            <div class="success-icon">✓</div>
            <h3 class="success-title">${title}</h3>
            <p class="success-message">${message}</p>
            <button class="btn-success-close" onclick="closeSuccessOverlay()">${btnText}</button>
        </div>
    `;

    // Show overlay
    requestAnimationFrame(() => {
        overlay.classList.add('active');
    });
}

function closeSuccessOverlay() {
    const overlay = document.getElementById('successOverlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}
