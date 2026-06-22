/* ================================================================
   Coaching Dreams — Navbar & Interaction JS
================================================================ */

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const THEME_KEY = 'cd-theme';

function getTheme() {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  if (themeToggle) {
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    themeToggle.title = theme === 'dark' ? 'Light mode' : 'Dark mode';
  }
}

if (themeToggle) {
  themeToggle.setAttribute('aria-label', getTheme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  themeToggle.addEventListener('click', () => {
    applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
  });
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  if (!localStorage.getItem(THEME_KEY)) {
    applyTheme(e.matches ? 'dark' : 'light');
  }
});

// ===== BOTTOM INFO BAR =====
const bottomBar      = document.getElementById('bottomBar');
const bottomBarClose = document.getElementById('bottomBarClose');

if (bottomBarClose && bottomBar) {
  bottomBarClose.addEventListener('click', () => {
    bottomBar.classList.add('hidden');
    document.body.style.paddingBottom = '0';
    const fab = document.querySelector('.mu-fab');
    if (fab) fab.style.bottom = '28px';
  });
}

// ===== SCROLL: add .scrolled to header =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ===== HAMBURGER — slide-in drawer =====
const hamburger    = document.getElementById('hamburger');
const navLinks     = document.getElementById('navLinks');
const nbBackdrop   = document.getElementById('nbBackdrop');

function openMenu() {
  navLinks.classList.add('open');
  hamburger.classList.add('open');
  nbBackdrop.classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  navLinks.classList.remove('open');
  hamburger.classList.remove('open');
  nbBackdrop.classList.remove('show');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  navLinks.classList.contains('open') ? closeMenu() : openMenu();
});
nbBackdrop.addEventListener('click', closeMenu);
navLinks.querySelectorAll('.nb-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeMenu(); closeSearch(); }
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const y = window.scrollY + 140;
  sections.forEach(sec => {
    const link = navLinks.querySelector(`a[href="#${sec.id}"]`);
    if (!link) return;
    link.classList.toggle('active', y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight);
  });
}, { passive: true });

// ===== SEARCH DRAWER =====
const searchBtn     = document.getElementById('searchBtn');
const searchOverlay = document.getElementById('searchOverlay');
const searchClose   = document.getElementById('searchClose');
const searchInput   = document.getElementById('searchInput');

function openSearch()  {
  searchOverlay.classList.add('open');
  setTimeout(() => searchInput.focus(), 280);
}
function closeSearch() { searchOverlay.classList.remove('open'); }

searchBtn.addEventListener('click', () => {
  searchOverlay.classList.contains('open') ? closeSearch() : openSearch();
});
searchClose.addEventListener('click', closeSearch);

// ===== MUI RIPPLE EFFECT =====
function createRipple(e) {
  const btn  = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x    = e.clientX - rect.left - size / 2;
  const y    = e.clientY - rect.top  - size / 2;

  const ripple = document.createElement('span');
  ripple.style.cssText = `
    position:absolute; border-radius:50%; background:rgba(255,255,255,0.35);
    width:${size}px; height:${size}px;
    left:${x}px; top:${y}px;
    transform:scale(0); animation:ripple .55s linear; pointer-events:none;
  `;
  btn.style.position = 'relative';
  btn.style.overflow = 'hidden';
  btn.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
}

// Inject ripple keyframe
const style = document.createElement('style');
style.textContent = '@keyframes ripple{to{transform:scale(3.5);opacity:0}}';
document.head.appendChild(style);

document.querySelectorAll('.mu-btn, .mu-icon-btn').forEach(btn => {
  btn.addEventListener('click', createRipple);
});

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const dur    = 2000;
  const step   = target / (dur / 16);
  let current  = 0;
  const timer  = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current) >= 1000
      ? Math.floor(current).toLocaleString()
      : Math.floor(current);
  }, 16);
}

// ===== INTERSECTION OBSERVER — counters + progress bars =====
const statsSection = document.querySelector('.mu-section-dark');
if (statsSection) {
  new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.mu-stat-number').forEach(animateCounter);
      entry.target.querySelectorAll('.mu-linear-fill').forEach(bar => {
        const w = bar.style.width; bar.style.width = '0';
        requestAnimationFrame(() => setTimeout(() => bar.style.width = w, 100));
      });
    });
  }, { threshold: 0.3 }).observe(statsSection);
}

// ===== FADE-UP ON SCROLL =====
document.querySelectorAll(
  '.mu-service-card, .mu-testimonial-card, .mu-stat-card, .mu-step, .mu-pillar'
).forEach((el, i) => {
  el.classList.add('mu-fade-up');
  el.style.transitionDelay = `${(i % 3) * 80}ms`;
});

new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 }).observe(document.body);

// Simpler per-element observer
const fadeEls = document.querySelectorAll('.mu-fade-up');
const fadeObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); fadeObs.unobserve(e.target); } });
}, { threshold: 0.08 });
fadeEls.forEach(el => fadeObs.observe(el));

// ===== CONTACT FORM =====
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = '<span class="material-icons" style="animation:mu-spin-icon .8s linear infinite">refresh</span> Sending...';
    btn.disabled = true;

    // Simulate API — replace with: fetch('/api/contact', { method:'POST', ... })
    await new Promise(r => setTimeout(r, 1500));

    btn.innerHTML = orig;
    btn.disabled = false;
    form.reset();
    formSuccess.removeAttribute('hidden');
    setTimeout(() => formSuccess.setAttribute('hidden', ''), 6000);
  });
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ===== SERVICES AUTO SLIDER & DRAG =====
const servicesTrack = document.getElementById('servicesTrack');
if (servicesTrack) {
  let isDown = false;
  let startX;
  let scrollLeft;
  let autoScrollTimer;

  // Clone cards once to create enough length
  const cards = Array.from(servicesTrack.children);
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.classList.remove('mu-fade-up', 'visible');
    servicesTrack.appendChild(clone);
  });

  const startAutoScroll = () => {
    clearInterval(autoScrollTimer);
    autoScrollTimer = setInterval(() => {
      if (isDown) return;
      
      const card = servicesTrack.querySelector('.mu-service-card');
      if (!card) return;
      const cardWidth = card.offsetWidth;
      const gap = parseInt(window.getComputedStyle(servicesTrack).gap) || 24;
      const scrollStep = cardWidth + gap;
      
      const maxScroll = servicesTrack.scrollWidth - servicesTrack.clientWidth;
      
      if (servicesTrack.scrollLeft + scrollStep >= maxScroll - 10) {
        servicesTrack.style.scrollBehavior = 'auto';
        servicesTrack.style.scrollSnapType = 'none';
        servicesTrack.scrollLeft = 0;
        
        setTimeout(() => {
          servicesTrack.style.scrollBehavior = 'smooth';
          servicesTrack.style.scrollSnapType = 'x mandatory';
          servicesTrack.scrollBy({ left: scrollStep, behavior: 'smooth' });
        }, 50);
      } else {
        servicesTrack.scrollBy({ left: scrollStep, behavior: 'smooth' });
      }
    }, 4000);
  };

  const stopAutoScroll = () => clearInterval(autoScrollTimer);

  servicesTrack.addEventListener('mousedown', (e) => {
    isDown = true;
    servicesTrack.classList.add('dragging');
    servicesTrack.style.scrollBehavior = 'auto';
    servicesTrack.style.scrollSnapType = 'none';
    startX = e.pageX - servicesTrack.offsetLeft;
    scrollLeft = servicesTrack.scrollLeft;
    stopAutoScroll();
  });

  const endDrag = () => {
    if (!isDown) return;
    isDown = false;
    servicesTrack.classList.remove('dragging');
    
    servicesTrack.style.scrollBehavior = 'smooth';
    servicesTrack.style.scrollSnapType = 'x mandatory';
    
    const cardWidth = servicesTrack.querySelector('.mu-service-card').offsetWidth;
    const gap = parseInt(window.getComputedStyle(servicesTrack).gap) || 24;
    const scrollStep = cardWidth + gap;
    const nearestSnap = Math.round(servicesTrack.scrollLeft / scrollStep) * scrollStep;
    servicesTrack.scrollTo({ left: nearestSnap, behavior: 'smooth' });
    
    startAutoScroll();
  };

  servicesTrack.addEventListener('mouseleave', endDrag);
  servicesTrack.addEventListener('mouseup', endDrag);

  servicesTrack.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - servicesTrack.offsetLeft;
    const walk = (x - startX) * 1.5;
    servicesTrack.scrollLeft = scrollLeft - walk;
  });

  servicesTrack.addEventListener('touchstart', stopAutoScroll, {passive: true});
  servicesTrack.addEventListener('touchend', startAutoScroll, {passive: true});

  startAutoScroll();
}
