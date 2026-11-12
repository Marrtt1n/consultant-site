// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal, .proof-card');
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

// Stagger delays: cards in grids + trust items + faq items + proof cards
function stagger(scopeSelector, childSelector, baseDelay, step) {
  document.querySelectorAll(scopeSelector).forEach((scope) => {
    scope.querySelectorAll(childSelector).forEach((el, i) => {
      el.style.transitionDelay = `${baseDelay + i * step}ms`;
    });
  });
}
stagger('.grid--4', '.reveal', 0, 90);
stagger('.grid--3', '.reveal--card', 0, 120);
stagger('.fit-grid', '.fit-card', 0, 120);
stagger('.trust-list', '.trust-item', 0, 50);
stagger('.faq', '.faq__item', 0, 60);
stagger('.proof-grid', '.proof-card', 0, 140);

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
const fmt = (n) => String(n);
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
document.querySelectorAll('.reward__value:not(.reward__value--static)').forEach((el) => rewardIO.observe(el));

// Count-up for proof payout amounts
function animateProofAmount(el) {
  const target = parseInt(el.dataset.count, 10);
  if (!target) return;
  const duration = 1100;
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = Math.round(target * eased);
    el.textContent = `+${val.toLocaleString('ru-RU')} ₽`;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
const proofIO = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateProofAmount(entry.target);
      proofIO.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });
document.querySelectorAll('.proof-amount[data-count]').forEach((el) => proofIO.observe(el));

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

// Proof lightbox
const lightbox = document.createElement('div');
lightbox.className = 'proof-lightbox';
lightbox.innerHTML = '<button class="proof-lightbox__close" type="button" aria-label="Закрыть">&times;</button><img alt="">';
document.body.appendChild(lightbox);
const lbImg = lightbox.querySelector('img');
const lbClose = lightbox.querySelector('.proof-lightbox__close');
function openLightbox(src, alt) {
  lbImg.src = src;
  lbImg.alt = alt || '';
  lightbox.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.remove('is-open');
  document.body.style.overflow = '';
}
document.querySelectorAll('.proof-shot img').forEach((img) => {
  img.addEventListener('click', () => openLightbox(img.currentSrc || img.src, img.alt));
});
lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// Hero TG card tilt + chips parallax
const heroVisual = document.getElementById('heroVisual');
const tgCard = document.getElementById('phone');
if (heroVisual && tgCard && matchMedia('(pointer: fine)').matches) {
  heroVisual.addEventListener('mousemove', (e) => {
    const r = heroVisual.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    tgCard.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 8}deg)`;
    heroVisual.querySelectorAll('.float-chip').forEach((chip, i) => {
      const depth = i === 0 ? 18 : -22;
      chip.style.translate = `${x * depth}px ${y * depth * 0.6}px`;
    });
  });
  heroVisual.addEventListener('mouseleave', () => {
    tgCard.style.transform = '';
    heroVisual.querySelectorAll('.float-chip').forEach((chip) => {
      chip.style.translate = '';
    });
  });
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

// Ambient particles (hero + CTA)
document.querySelectorAll('[data-particles]').forEach((box) => {
  const palette = ['183,110,121', '201,168,106', '142,124,195'];
  for (let i = 0; i < 14; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    const size = 3 + Math.random() * 4;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    const c = palette[Math.floor(Math.random() * palette.length)];
    p.style.background = `radial-gradient(circle, rgba(${c},0.55), rgba(${c},0) 70%)`;
    p.style.left = `${Math.random() * 100}%`;
    p.style.setProperty('--dx', `${(Math.random() - 0.5) * 60}px`);
    p.style.animationDuration = `${11 + Math.random() * 14}s`;
    p.style.animationDelay = `${-Math.random() * 20}s`;
    box.appendChild(p);
  }
});

// Global cursor glow
if (matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.id = 'cursorGlow';
  document.body.appendChild(glow);
  let gx = window.innerWidth / 2;
  let gy = window.innerHeight / 2;
  let tx = gx;
  let ty = gy;
  window.addEventListener('mousemove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
  }, { passive: true });
  (function loop() {
    gx += (tx - gx) * 0.12;
    gy += (ty - gy) * 0.12;
    glow.style.transform = `translate3d(${gx - 350}px, ${gy - 350}px, 0)`;
    requestAnimationFrame(loop);
  })();
}

// Phone chat loop
const phoneMsgs = document.getElementById('phoneMsgs');
const chatScenario = [
  { t: 'in', x: 'Здравствуйте! Хочу оставить отзыв за деньги' },
  { t: 'typing' },
  { t: 'out', x: 'Привет! Вам 14+ и вы ещё не оформляли эту карту?' },
  { t: 'in', x: 'Да, всё верно' },
  { t: 'typing' },
  { t: 'out', x: 'Отправляю ссылку — оформляете по ней, пару покупок и отзыв на banki.ru' },
  { t: 'in', x: 'Готово, отзыв отправил' },
  { t: 'typing' },
  { t: 'out', x: 'Вижу, перевожу оплату' },
  { t: 'pay', x: '+6 000 ₽' },
];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
function scrollPhoneMsgs() {
  if (phoneMsgs) phoneMsgs.scrollTop = phoneMsgs.scrollHeight;
}
function renderStaticChat() {
  chatScenario.forEach((item) => {
    if (item.t === 'typing') return;
    const m = document.createElement('div');
    m.className = `msg msg--${item.t === 'pay' ? 'pay' : item.t === 'out' ? 'out' : 'in'}`;
    m.textContent = item.x;
    phoneMsgs.appendChild(m);
  });
  scrollPhoneMsgs();
}
async function runChatLoop() {
  while (true) {
    phoneMsgs.innerHTML = '';
    for (const item of chatScenario) {
      if (item.t === 'typing') {
        const tp = document.createElement('div');
        tp.className = 'msg msg--typing';
        tp.innerHTML = '<span></span><span></span><span></span>';
        phoneMsgs.appendChild(tp);
        scrollPhoneMsgs();
        await sleep(1400);
        tp.remove();
      } else {
        const m = document.createElement('div');
        m.className = `msg msg--${item.t === 'pay' ? 'pay' : item.t === 'out' ? 'out' : 'in'}`;
        m.textContent = item.x;
        m.style.animationDelay = '0s';
        phoneMsgs.appendChild(m);
        scrollPhoneMsgs();
        await sleep(item.t === 'pay' ? 2600 : 1500);
      }
    }
    await sleep(4200);
  }
}
if (phoneMsgs) {
  if (reducedMotion) {
    renderStaticChat();
  } else {
    runChatLoop();
  }
}

// Scroll progress bar
const scrollProgress = document.getElementById('scrollProgress');
let spTicking = false;
function updateScrollProgress() {
  spTicking = false;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const p = total > 0 ? Math.min(Math.max(window.scrollY / total, 0), 1) : 0;
  if (scrollProgress) scrollProgress.style.transform = `scaleX(${p})`;
}
window.addEventListener('scroll', () => {
  if (!spTicking) {
    spTicking = true;
    requestAnimationFrame(updateScrollProgress);
  }
}, { passive: true });
window.addEventListener('resize', updateScrollProgress);
updateScrollProgress();
