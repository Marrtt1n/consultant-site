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

// Stagger hero elements
const heroEls = document.querySelectorAll('.reveal--hero');
heroEls.forEach((el, i) => {
  el.style.transitionDelay = `${i * 90}ms`;
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
