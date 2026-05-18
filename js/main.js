/* ========================================
   EFFEX STUDIOS & EFFEX ACADEMY
   Main JavaScript
   ======================================== */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initMobileMenu();
  initCustomCursor();
  initScrollReveal();
  initAccordion();
  initSmoothScroll();
});

/* ----------------------------------------
   NAVIGATION
   ---------------------------------------- */
function initNavigation() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  let lastScroll = 0;
  const scrollThreshold = 50;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add/remove scrolled class
    if (currentScroll > scrollThreshold) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });
}

/* ----------------------------------------
   MOBILE MENU
   ---------------------------------------- */
function initMobileMenu() {
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu-link');

  if (!hamburger || !mobileMenu) return;

  // Toggle menu
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu when clicking a link
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/* ----------------------------------------
   CUSTOM CURSOR
   ---------------------------------------- */
function initCustomCursor() {
  // Only enable on devices with fine pointer (mouse)
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    return;
  }

  // Create cursor elements
  const cursorDot = document.createElement('div');
  cursorDot.className = 'cursor cursor-dot';
  document.body.appendChild(cursorDot);

  const cursorRing = document.createElement('div');
  cursorRing.className = 'cursor-ring';
  document.body.appendChild(cursorRing);

  // Enable custom cursor
  document.body.classList.add('custom-cursor-active');

  // Cursor position
  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;

  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Update dot position immediately
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });

  // Animate ring with lag
  function animateRing() {
    // Lerp (linear interpolation) for smooth following
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;

    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';

    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effect on interactive elements
  const interactiveElements = document.querySelectorAll('a, button, [data-cursor-hover], input, textarea, select');

  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorRing.classList.add('hover');
    });

    el.addEventListener('mouseleave', () => {
      cursorRing.classList.remove('hover');
    });
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0';
    cursorRing.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity = '1';
    cursorRing.style.opacity = '1';
  });
}

/* ----------------------------------------
   SCROLL REVEAL
   ---------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');

  if (revealElements.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '-100px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Optional: stop observing after reveal
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    observer.observe(el);
  });
}

/* ----------------------------------------
   ACCORDION
   ---------------------------------------- */
function initAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all items (optional: for single-open behavior)
      // accordionItems.forEach(i => i.classList.remove('active'));

      // Toggle current item
      item.classList.toggle('active', !isActive);
    });
  });
}

/* ----------------------------------------
   SMOOTH SCROLL
   ---------------------------------------- */
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      // Skip if it's just "#"
      if (href === '#') return;

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();

        const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ----------------------------------------
   HERO TEXT ANIMATION
   ---------------------------------------- */
function animateHeroText() {
  const heroHeadline = document.querySelector('.hero-headline');
  if (!heroHeadline) return;

  const text = heroHeadline.textContent;
  const words = text.split(' ');

  heroHeadline.innerHTML = words.map(word =>
    `<span class="word">${word}</span>`
  ).join(' ');

  heroHeadline.classList.add('hero-text-animate');
}

// Run hero animation after page load
window.addEventListener('load', animateHeroText);

/* ----------------------------------------
   FORM HANDLING
   ---------------------------------------- */
function initForms() {
  const forms = document.querySelectorAll('[data-form]');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormSubmit(form);
    });
  });
}

function handleFormSubmit(form) {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  // Show loading state
  const submitBtn = form.querySelector('[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  // Simulate form submission (replace with actual API call)
  setTimeout(() => {
    console.log('Form submitted:', data);

    // Show success message
    submitBtn.textContent = 'Sent!';

    // Reset form
    setTimeout(() => {
      form.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 2000);
  }, 1500);
}

/* ----------------------------------------
   UTILITY FUNCTIONS
   ---------------------------------------- */

// Debounce function
function debounce(func, wait = 100) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function
function throttle(func, limit = 100) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Get current page name
function getCurrentPage() {
  const path = window.location.pathname;
  const page = path.split('/').pop().replace('.html', '') || 'index';
  return page;
}

// Set active navigation link
function setActiveNavLink() {
  const currentPage = getCurrentPage();
  const navLinks = document.querySelectorAll('.nav-link, .mobile-menu-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    const linkPage = href.split('/').pop().replace('.html', '') || 'index';

    if (linkPage === currentPage ||
        (currentPage.includes('academy') && href.includes('academy'))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Run on page load
window.addEventListener('load', setActiveNavLink);
