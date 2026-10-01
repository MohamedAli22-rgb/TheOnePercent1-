/**
 * THE ONE PERCENT 1% — PREMIUM ARABIC EDUCATIONAL PLATFORM
 * Main JavaScript Controller
 * Clean, modular, and dependency-free Vanilla JS
 */

'use strict';

// -----------------------------------------------------------------------------
// 1. Centralized Configuration for WhatsApp & Brand Info
// -----------------------------------------------------------------------------
const BRAND_CONFIG = {
  // Egyptian WhatsApp number normalized (no leading zero, country code 20)
  whatsappPhone: '201095193192',

  // Pre-filled message templates for each call-to-action
  messages: {
    // Waiting List / General Inquiry CTA
    waitingList: 'السلام عليكم، حابب أسجل في قائمة انتظار The One Percent وأعرف تفاصيل الكورسات والعروض المتاحة.',
    
    // Individual Courses
    hairCourse: 'السلام عليكم، مهتم بكورس Hair Course.',
    dermaCourse: 'السلام عليكم، مهتم بكورس Derma Course.',
    skinCourse: 'السلام عليكم، مهتم بكورس Skin Course.',
    
    // Launch Offers
    coursesOnly: 'السلام عليكم، مهتم بعرض Courses Only بسعر 399 SAR للكورسات الثلاثة. ممكن أعرف تفاصيل التسجيل؟',
    fullExperience: 'السلام عليكم، مهتم بعرض Full Experience بسعر 499 SAR، بما يشمل الكورسات الثلاثة وجروب WhatsApp والحالات الأسبوعية. ممكن أعرف تفاصيل التسجيل؟',
    
    // Free Lectures Request
    freeLectures: 'السلام عليكم، حابب أطلب المحاضرات المجانية عشان أتعرف على أسلوب الشرح قبل الاشتراك.',
    
    // Floating Button General Message
    general: 'السلام عليكم، حابب أسجل في قائمة انتظار The One Percent وأعرف تفاصيل الكورسات والعروض المتاحة.'
  }
};

/**
 * Builds a standardized WhatsApp URL with encoded message
 * @param {string} messageText 
 * @returns {string} Fully formatted WhatsApp URL
 */
function getWhatsAppUrl(messageText) {
  const encodedText = encodeURIComponent(messageText);
  return `https://wa.me/${BRAND_CONFIG.whatsappPhone}?text=${encodedText}`;
}

// -----------------------------------------------------------------------------
// 2. Initialize and Bind WhatsApp Links
// -----------------------------------------------------------------------------
function initWhatsAppLinks() {
  const waButtons = document.querySelectorAll('[data-wa-type]');
  
  waButtons.forEach(button => {
    const type = button.getAttribute('data-wa-type');
    const message = BRAND_CONFIG.messages[type] || BRAND_CONFIG.messages.general;
    const url = getWhatsAppUrl(message);
    
    // Set href attribute
    button.setAttribute('href', url);
    button.setAttribute('target', '_blank');
    button.setAttribute('rel', 'noopener noreferrer');
  });
}

// -----------------------------------------------------------------------------
// 3. Mobile Navigation Drawer
// -----------------------------------------------------------------------------
function initMobileNavigation() {
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (!mobileToggle || !mobileDrawer) return;

  function openDrawer() {
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    mobileToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  mobileToggle.addEventListener('click', () => {
    const isOpen = mobileDrawer.classList.contains('open');
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (drawerClose) {
    drawerClose.addEventListener('click', closeDrawer);
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', closeDrawer);
  }

  // Close drawer on link click
  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Close drawer with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

// -----------------------------------------------------------------------------
// 4. Sticky Header & Active Navigation Highlighting
// -----------------------------------------------------------------------------
function initHeaderAndNav() {
  const siteHeader = document.getElementById('siteHeader');
  const sections = document.querySelectorAll('main > section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header shadow toggle on scroll
  function handleHeaderScroll() {
    if (window.scrollY > 40) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // Active section indicator via IntersectionObserver
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -65% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const activeId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${activeId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));
  }
}

// -----------------------------------------------------------------------------
// 5. Back to Top Button
// -----------------------------------------------------------------------------
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  function toggleBackToTop() {
    if (window.scrollY > 350) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', toggleBackToTop, { passive: true });
  toggleBackToTop();

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// -----------------------------------------------------------------------------
// 6. Scroll Reveal Animations (Intersection Observer)
// -----------------------------------------------------------------------------
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  // If user prefers reduced motion, reveal everything immediately
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target); // Reveal only once for performance
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

// -----------------------------------------------------------------------------
// 7. Smooth Scroll Offset Correction for In-Page Anchor Links
// -----------------------------------------------------------------------------
function initSmoothScrollLinks() {
  const internalLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  
  internalLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update URL hash without jumping
        history.pushState(null, '', targetId);
      }
    });
  });
}

// -----------------------------------------------------------------------------
// DOM Ready Entry Point
// -----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initWhatsAppLinks();
  initMobileNavigation();
  initHeaderAndNav();
  initBackToTop();
  initScrollReveal();
  initSmoothScrollLinks();
});
