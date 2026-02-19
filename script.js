// Mobile menu
const menuBtn = document.getElementById('menuBtn');
const mobileNav = document.getElementById('mobileNav');

menuBtn?.addEventListener('click', () => {
  const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
  menuBtn.setAttribute('aria-expanded', String(!expanded));
  mobileNav.hidden = expanded;
});

// Smooth anchor close on click (mobile)
mobileNav?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    menuBtn.setAttribute('aria-expanded', 'false');
    mobileNav.hidden = true;
  });
});

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('is-visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Count-up stats
function animateCount(el, to, suffix = '') {
  const start = performance.now();
  const from = 0;
  const dur = 900;

  function tick(t){
    const p = Math.min(1, (t - start) / dur);
    const val = Math.floor(from + (to - from) * (1 - Math.pow(1 - p, 3)));
    el.textContent = `${val}${suffix}`;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const to = Number(el.dataset.count || 0);
    const suffix = el.dataset.suffix || (el.dataset.count === "98" ? "%" : "");
    animateCount(el, to, suffix);
    statObserver.unobserve(el);
  });
}, { threshold: 0.6 });

document.querySelectorAll('.stat__num').forEach(el => statObserver.observe(el));

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Sparkles canvas (subtle particles)
const canvas = document.getElementById('sparkles');
const ctx = canvas.getContext('2d');

let w, h, dpr;
function resize(){
  dpr = Math.min(2, window.devicePixelRatio || 1);
  w = canvas.clientWidth = window.innerWidth;
  h = canvas.clientHeight = window.innerHeight;
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  ctx.setTransform(dpr,0,0,dpr,0,0);
}
window.addEventListener('resize', resize);
resize();

const particles = Array.from({length: 70}, () => ({
  x: Math.random() * w,
  y: Math.random() * h,
  r: 0.6 + Math.random() * 1.6,
  vx: (-0.15 + Math.random() * 0.3),
  vy: (-0.10 + Math.random() * 0.25),
  a: 0.12 + Math.random() * 0.25
}));

function loop(){
  ctx.clearRect(0,0,w,h);

  // vignette glow
  const g = ctx.createRadialGradient(w*0.5, h*0.25, 0, w*0.5, h*0.25, Math.max(w,h)*0.7);
  g.addColorStop(0, 'rgba(34,211,238,0.06)');
  g.addColorStop(0.5, 'rgba(124,58,237,0.05)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0,0,w,h);

  for (const p of particles){
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < -20) p.x = w + 20;
    if (p.x > w + 20) p.x = -20;
    if (p.y < -20) p.y = h + 20;
    if (p.y > h + 20) p.y = -20;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(255,255,255,${p.a})`;
    ctx.fill();
  }

  requestAnimationFrame(loop);
}
loop();
