// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// Stagger delays: cards in grids + trust items + faq items
function stagger(scopeSelector, childSelector, baseDelay, step) {
  document.querySelectorAll(scopeSelector).forEach((scope) => {
    scope.querySelectorAll(childSelector).forEach((el, i) => {
      el.style.transitionDelay = `${baseDelay + i * step}ms`;
    });
  });
}
stagger('.grid--4', '.reveal', 0, 90);
stagger('.grid--3', '.reveal--card', 0, 120);
stagger('.trust-list', '.trust-item', 0, 50);
stagger('.faq', '.faq__item', 0, 60);

// Hero cascade
const heroEls = document.querySelectorAll('.reveal--hero');
heroEls.forEach((el, i) => {
  el.style.transitionDelay = `${i * 110}ms`;
});

// Header border on scroll
const header = document.querySelector('.site-header');
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// FAQ accordion
document.querySelectorAll('.faq__item').forEach((item) => {
  const btn = item.querySelector('.faq__q');
  const answer = item.querySelector('.faq__a');
  btn.addEventListener('click', () => {
    const isOpen = item.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(isOpen));
    answer.style.maxHeight = isOpen ? `${answer.scrollHeight}px` : '0px';
  });
});

// Count-up for reward values
const fmt = (n) => n.toLocaleString('ru-RU').replace(/\u00A0/g, ' ');
function animateCount(el) {
  const text = el.textContent.trim();
  const nums = text.match(/\d[\d ]*?\d|\d/g);
  if (!nums || nums.length === 0) return;
  const targets = nums.map((s) => parseInt(s.replace(/\s/g, ''), 10));
  const suffix = text.slice(text.lastIndexOf(nums[nums.length - 1]) + nums[nums.length - 1].length);
  const prefix = text.slice(0, text.indexOf(nums[0]));
  const mid = nums.length > 1 ? text.slice(text.indexOf(nums[0]) + nums[0].length, text.indexOf(nums[1])) : '';
  const duration = 1100;
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const vals = targets.map((t) => Math.round(t * eased));
    el.textContent = prefix + vals.map(fmt).join(mid) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
const rewardIO = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      rewardIO.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });
document.querySelectorAll('.reward__value').forEach((el) => rewardIO.observe(el));

// Typewriter quote
const quote = document.querySelector('[data-typewriter]');
if (quote) {
  const fullText = quote.textContent.trim();
  quote.textContent = '';
  const caret = document.createElement('span');
  caret.className = 'caret';
  quote.appendChild(caret);
  let i = 0;
  const type = () => {
    if (i < fullText.length) {
      caret.before(document.createTextNode(fullText[i]));
      i++;
      setTimeout(type, 28 + Math.random() * 30);
    } else {
      setTimeout(() => caret.remove(), 1600);
    }
  };
  const quoteIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        type();
        quoteIO.disconnect();
      }
    });
  }, { threshold: 0.5 });
  quoteIO.observe(quote);
}

// CTA glow parallax
const ctaGlow = document.querySelector('.cta__glow');
const ctaSection = document.querySelector('.cta');
if (ctaGlow && ctaSection && matchMedia('(pointer: fine)').matches) {
  ctaSection.addEventListener('mousemove', (e) => {
    const r = ctaSection.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ctaGlow.style.transform = `translate(calc(-50% + ${x * 60}px), calc(-50% + ${y * 60}px))`;
  });
  ctaSection.addEventListener('mouseleave', () => {
    ctaGlow.style.transform = 'translate(-50%, -50%)';
  });
}
