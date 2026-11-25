(() => {
  'use strict';

  const body = document.body;
  const menu = document.querySelector('#primary-menu');
  const menuToggle = document.querySelector('.menu-toggle');
  const desktopQuery = window.matchMedia('(min-width: 62.01rem)');
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  function setMenu(open, returnFocus = false) {
    menu.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    body.classList.toggle('menu-open', open && !desktopQuery.matches);
    if (open) menu.querySelector('a')?.focus();
    if (!open && returnFocus) menuToggle.focus();
  }

  menuToggle.addEventListener('click', () => {
    setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
  });

  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false, true);
    }
  });

  document.addEventListener('click', (event) => {
    if (menuToggle.getAttribute('aria-expanded') === 'true' && !event.target.closest('.nav-shell')) {
      setMenu(false);
    }
  });

  desktopQuery.addEventListener('change', (event) => {
    if (event.matches) setMenu(false);
  });

  function initReveals() {
    const elements = document.querySelectorAll('.reveal');
    if (reducedMotionQuery.matches || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

    elements.forEach((element) => observer.observe(element));
  }

  function initActiveNavigation() {
    if (!('IntersectionObserver' in window)) return;
    const links = new Map(
      [...menu.querySelectorAll('a[href^="#"]')].map((link) => [link.hash.slice(1), link])
    );
    const sections = [...links.keys()].map((id) => document.getElementById(id)).filter(Boolean);

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      links.forEach((link, id) => {
        if (id === visible.target.id) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-30% 0px -60% 0px', threshold: [0, 0.2, 0.6] });

    sections.forEach((section) => observer.observe(section));
  }

  document.querySelector('#year').textContent = new Date().getFullYear();
  initReveals();
  initActiveNavigation();
})();
