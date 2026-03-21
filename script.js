/* ============================================
   HARDIK OPTICAL & RUBBER STAMP — script.js
   Navigation · Filters · Forms · Animations
============================================ */

// =============================================
// 1. SPA NAVIGATION (Single Page App routing)
// =============================================

const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link');
const navMenu = document.getElementById('navMenu');
const hamburger = document.getElementById('hamburger');
const navbar = document.getElementById('navbar');

/**
 * Show a specific page by ID
 * @param {string} pageId - 'home' | 'about' | 'optical' | 'stamps' | 'contact'
 */
function showPage(pageId) {
  // Hide all pages
  pages.forEach(p => p.classList.remove('active'));

  // Show target page
  const target = document.getElementById(pageId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update active nav link
  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.page === pageId);
  });

  // Close mobile menu if open
  closeMobileMenu();

  // Trigger reveal animations on the new page
  setTimeout(triggerReveal, 100);
}

/** Navigate to a page (called from onclick attributes in HTML) */
function navigateTo(pageId) {
  showPage(pageId);
}

// Intercept all [data-page] link clicks
document.addEventListener('click', function (e) {
  const link = e.target.closest('[data-page]');
  if (link) {
    e.preventDefault();
    const pageId = link.dataset.page;
    showPage(pageId);
  }
});

// =============================================
// 2. MOBILE HAMBURGER MENU
// =============================================

function closeMobileMenu() {
  hamburger.classList.remove('open');
  navMenu.classList.remove('open');
}

hamburger.addEventListener('click', function () {
  const isOpen = hamburger.classList.toggle('open');
  navMenu.classList.toggle('open', isOpen);
});

// Close menu when clicking outside
document.addEventListener('click', function (e) {
  if (!navbar.contains(e.target)) {
    closeMobileMenu();
  }
});

// =============================================
// 3. STICKY NAVBAR SCROLL EFFECT
// =============================================

window.addEventListener('scroll', function () {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// =============================================
// 4. PRODUCT FILTER — OPTICAL PAGE
// =============================================

/**
 * Sets up filter buttons for a given page
 * @param {string} pageId - ID of the parent <section> element
 */
function initFilters(pageId) {
  const page = document.getElementById(pageId);
  if (!page) return;

  const filterBtns = page.querySelectorAll('.filter-btn');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const filter = this.dataset.filter;

      // Toggle active class on buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      if (pageId === 'optical') {
        // For optical: show/hide category sections
        const categorySections = page.querySelectorAll('.category-section');
        categorySections.forEach(section => {
          if (filter === 'all' || section.dataset.category === filter) {
            section.style.display = '';
            animateCards(section);
          } else {
            section.style.display = 'none';
          }
        });
      } else if (pageId === 'stamps') {
        // For stamps: show/hide individual product cards
        const cards = page.querySelectorAll('.product-card[data-cat]');
        cards.forEach(card => {
          if (filter === 'all' || card.dataset.cat === filter) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });

        // Show all cards with animation
        setTimeout(() => {
          const visibleCards = page.querySelectorAll('.product-card:not([style*="display: none"])');
          visibleCards.forEach((card, i) => {
            card.style.animation = 'none';
            card.offsetHeight; // reflow
            card.style.animation = `fadeInUp 0.4s ${i * 0.06}s ease both`;
          });
        }, 10);
      }
    });
  });
}

function animateCards(container) {
  const cards = container.querySelectorAll('.product-card');
  cards.forEach((card, i) => {
    card.style.animation = 'none';
    card.offsetHeight;
    card.style.animation = `fadeInUp 0.4s ${i * 0.07}s ease both`;
  });
}

// =============================================
// 5. CONTACT FORM — WhatsApp submit
// =============================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name');
    const phone = document.getElementById('phone');
    const message = document.getElementById('message');

    let valid = true;

    // Basic validation
    [name, phone, message].forEach(field => {
      field.classList.remove('error');
      if (!field.value.trim()) {
        field.classList.add('error');
        valid = false;
      }
    });

    if (!valid) {
      showToast('⚠️ Please fill in all required fields.');
      return;
    }

    // Phone number basic check
    const phoneVal = phone.value.replace(/\s/g, '');
    if (!/^\+?[\d]{7,15}$/.test(phoneVal)) {
      phone.classList.add('error');
      showToast('⚠️ Please enter a valid phone number.');
      return;
    }

    // Build WhatsApp message
    const waMessage = encodeURIComponent(
      `Hello Hardik Optical!\n\n` +
      `👤 Name: ${name.value.trim()}\n` +
      `📞 Phone: ${phone.value.trim()}\n\n` +
      `💬 Message:\n${message.value.trim()}`
    );

    // Open WhatsApp
    // ⚠️ CHANGE THIS PHONE NUMBER to your actual WhatsApp number
    const waNumber = '919414548423';
    window.open(`https://wa.me/${waNumber}?text=${waMessage}`, '_blank');

    // Reset form
    contactForm.reset();
    showToast('✅ Opening WhatsApp...');
  });

  // Remove error class on input
  contactForm.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => field.classList.remove('error'));
  });
}

// =============================================
// 6. TOAST NOTIFICATION
// =============================================

function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// =============================================
// 7. SCROLL REVEAL ANIMATION
// =============================================

function triggerReveal() {
  const revealEls = document.querySelectorAll('.page.active .reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => observer.observe(el));
}

// =============================================
// 8. ADD REVEAL CLASS TO KEY ELEMENTS
// =============================================

function addRevealClasses() {
  const selectors = [
    '.product-card',
    '.why-card',
    '.service-card',
    '.team-card',
    '.gallery-item',
    '.ci-item',
    '.value-item',
    '.stat'
  ];

  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    });
  });
}

// =============================================
// 9. SMOOTH IMAGE LOAD HANDLING
// =============================================

function handleImageLoading() {
  document.querySelectorAll('.product-img img').forEach(img => {
    img.addEventListener('load', function () {
      this.style.opacity = '1';
    });
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease';
    if (img.complete) img.style.opacity = '1';
  });
}

// =============================================
// 10. KEYBOARD NAVIGATION SUPPORT
// =============================================

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    closeMobileMenu();
  }
});

// =============================================
// 11. WHATSAPP ORDER — Dynamic product orders
// =============================================

/**
 * Build WhatsApp order URL dynamically
 * @param {string} productName
 * @param {string} price
 */
function orderOnWhatsApp(productName, price) {
  const message = encodeURIComponent(
    `Hello! I'd like to order:\n\n` +
    `🛒 Product: ${productName}\n` +
    `💰 Price: ${price}\n\n` +
    `Please confirm availability and delivery details.`
  );
  const waNumber = '919414548423'; // ⚠️ Change to your number
  window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank');
}

// =============================================
// 12. ACTIVE SECTION HIGHLIGHT (scroll spy)
// =============================================

// Since we use SPA navigation (not anchors), scroll spy isn't needed.
// But we keep the navbar state clean on scroll.

// =============================================
// 13. INIT — Run everything on DOMContentLoaded
// =============================================

document.addEventListener('DOMContentLoaded', function () {
  // Show home page by default
  showPage('home');

  // Setup filters
  initFilters('optical');
  initFilters('stamps');

  // Add animation classes
  addRevealClasses();

  // Handle images
  handleImageLoading();

  // Initial reveal trigger
  setTimeout(triggerReveal, 300);

  console.log('✅ Hardik Optical website loaded successfully!');
});

// =============================================
// HOW TO ADD NEW PRODUCTS
// =============================================
/*
  TO ADD A NEW PRODUCT:
  1. Open index.html
  2. Find the section you want to add the product in (optical or stamps)
  3. Copy this template and paste it inside the .products-grid div:

  <div class="product-card" data-cat="CATEGORY">
    <!-- Optional badge: <div class="product-badge">Bestseller</div> -->
    <div class="product-img">
      <img src="images/products/YOUR_IMAGE.jpg" alt="Product Name">
      <!-- OR use emoji placeholder: <div class="product-img-placeholder">👓</div> -->
    </div>
    <div class="product-info">
      <div class="product-category">Category · Type</div>
      <h4 class="product-name">Product Name Here</h4>
      <p class="product-desc">Short description of the product goes here.</p>
      <div class="product-footer">
        <span class="product-price">₹999</span>
        <a href="https://wa.me/919414548423?text=I%20want%20to%20order%20PRODUCT_NAME" target="_blank" class="btn-whatsapp">
          Order
        </a>
      </div>
    </div>
  </div>

  CATEGORY values for filters:
  - Optical page: frames | sunglasses | lens
  - Stamps page: self-ink | office | date | custom

  PRODUCT IMAGES:
  - Create a folder: images/products/
  - Place your images there (recommended size: 400x400px, JPG/WebP)
  - Use: <img src="images/products/filename.jpg" alt="Product Name">
*/
