// ===== SHARED JS: Cart, Canvas, Cursor, Toast, Navbar =====

// ===== TOAST =====
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}

// ===== CART (localStorage) =====
function getCart() {
  try { return JSON.parse(localStorage.getItem('cafeluma_cart') || '[]'); } catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem('cafeluma_cart', JSON.stringify(cart));
}
function getCartCount() {
  return getCart().reduce((s, i) => s + i.qty, 0);
}
function addToCart(item) {
  // item: {id, name, price, emoji}
  const cart = getCart();
  const existing = cart.find(c => c.id === item.id);
  if (existing) { existing.qty += 1; }
  else { cart.push({ ...item, qty: 1 }); }
  saveCart(cart);
  updateNavCartCount();
  showToast(`${item.name} added to your cart! ☕`);
  // Animate cart button
  const cartBadge = document.getElementById('navCartCount');
  if (cartBadge) {
    cartBadge.classList.add('bump');
    setTimeout(() => cartBadge.classList.remove('bump'), 400);
  }
}
function updateCartQty(id, change) {
  const cart = getCart();
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += change;
  if (item.qty <= 0) cart.splice(cart.indexOf(item), 1);
  saveCart(cart);
  if (typeof renderCartPage === 'function') renderCartPage();
  updateNavCartCount();
}
function clearCart() {
  saveCart([]);
  if (typeof renderCartPage === 'function') renderCartPage();
  updateNavCartCount();
  showToast('Cart cleared.');
}
function placeOrder() {
  const cart = getCart();
  if (!cart.length) { showToast('Add at least one item first!'); return; }
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);
  saveCart([]);
  updateNavCartCount();
  if (typeof renderCartPage === 'function') renderCartPage();
  // Show success modal
  const modal = document.getElementById('orderSuccessModal');
  if (modal) {
    document.getElementById('orderSuccessCount').textContent = count;
    document.getElementById('orderSuccessTotal').textContent = `Rs. ${total}`;
    modal.classList.add('show');
  } else {
    showToast(`🎉 Order placed! ${count} item${count !== 1 ? 's' : ''} · Rs. ${total}`);
  }
}
function updateNavCartCount() {
  const el = document.getElementById('navCartCount');
  if (el) el.textContent = getCartCount();
}

// ===== NAVBAR SCROLL =====
function initNavbar() {
  updateNavCartCount();
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.style.background = window.scrollY > 50
      ? 'rgba(255,248,240,0.97)'
      : 'rgba(255,248,240,0.85)';
  });
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
  }
}

// ===== SLOW DIAMOND CANVAS (background, all pages) =====
function initDiamondCanvas() {
  const canvas = document.getElementById('global-3d-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;
  let objects = [];

  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  // Slow, aesthetic diamonds — light mode palette
  for (let i = 0; i < 35; i++) {
    objects.push({
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random() * 900 + 150,
      radius: Math.random() * 22 + 8,
      vx: (Math.random() - 0.5) * 0.18, // very slow
      vy: (Math.random() - 0.5) * 0.18, // very slow
      vz: (Math.random() - 0.5) * 0.4,  // very slow depth
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.003 // very slow rotation
    });
  }

  let scrollY = 0;
  let mouseX = w / 2, mouseY = h / 2;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; });
  window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

  function draw() {
    ctx.clearRect(0, 0, w, h);
    objects.forEach(obj => {
      obj.x += obj.vx;
      obj.y += obj.vy;
      obj.z += obj.vz;
      obj.rotation += obj.rotSpeed;

      if (obj.x < -80) obj.x = w + 80;
      if (obj.x > w + 80) obj.x = -80;
      if (obj.y < -80) obj.y = h + 80;
      if (obj.y > h + 80) obj.y = -80;
      if (obj.z < 100) obj.z = 1050;
      if (obj.z > 1050) obj.z = 100;

      const fov = 380;
      const scale = fov / obj.z;
      let yWS = (obj.y - scrollY * 0.25 * scale) % h;
      if (yWS < 0) yWS += h;

      const px = (obj.x - w / 2) * scale + w / 2;
      const py = (yWS - h / 2) * scale + h / 2;
      const pr = obj.radius * scale;

      const opacity = Math.min(0.7, scale * 0.85);

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(obj.rotation);

      // Outer diamond shape
      ctx.beginPath();
      ctx.moveTo(0, -pr);
      ctx.lineTo(pr * 0.62, 0);
      ctx.lineTo(0, pr);
      ctx.lineTo(-pr * 0.62, 0);
      ctx.closePath();
      ctx.strokeStyle = `rgba(180,130,80,${opacity})`;
      ctx.lineWidth = Math.max(0.5, scale * 1.4);
      ctx.stroke();

      // Inner glow fill
      ctx.fillStyle = `rgba(212,168,83,${opacity * 0.18})`;
      ctx.fill();

      // Inner cross lines for gem effect
      ctx.beginPath();
      ctx.moveTo(0, -pr * 0.55);
      ctx.lineTo(0, pr * 0.55);
      ctx.moveTo(-pr * 0.42, 0);
      ctx.lineTo(pr * 0.42, 0);
      ctx.strokeStyle = `rgba(212,168,83,${opacity * 0.55})`;
      ctx.lineWidth = Math.max(0.3, scale * 0.6);
      ctx.stroke();

      ctx.restore();

      // Gentle mouse repel (subtle)
      const dist = Math.hypot(mouseX - px, mouseY - py);
      if (dist < 80) {
        const f = (80 - dist) / 80;
        obj.x -= (mouseX - px) * 0.01 * f;
        obj.y -= (mouseY - py) * 0.01 * f;
      }
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ===== CUSTOM CURSOR =====
function initCursor() {
  const cursor = document.getElementById('custom-cursor');
  if (!cursor) return;
  document.body.classList.add('custom-cursor-active');
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let cx = mx, cy = my;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  function animate() {
    cx += (mx - cx) * 0.35;
    cy += (my - cy) * 0.35;
    cursor.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(animate);
  }
  animate();
  document.querySelectorAll('a, button, .menu-card, .gallery-item, .table-card, input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
  });
}

// ===== SCROLL REVEAL =====
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  setTimeout(() => document.querySelectorAll('.reveal').forEach(el => obs.observe(el)), 500);
}

// ===== PRELOADER =====
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  const eqWaves = document.getElementById('eq-waves');
  if (eqWaves) {
    for (let i = 0; i < 18; i++) {
      const bar = document.createElement('div');
      bar.className = 'eq-bar';
      eqWaves.appendChild(bar);
    }
    function animEQ() {
      if (!preloader || preloader.style.opacity === '0') return;
      document.querySelectorAll('.eq-bar').forEach(b => { b.style.height = `${15 + Math.random() * 85}%`; });
      setTimeout(animEQ, 120);
    }
    animEQ();
  }
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
      setTimeout(() => preloader.remove(), 800);
    }, 2000);
  });
}

// ===== 3D TILT =====
function initTilt() {
  document.querySelectorAll('.menu-card, .bestseller-card, .review-card, .stat-card, .event-card, .tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const cx = rect.width / 2, cy = rect.height / 2;
      const rX = ((y - cy) / cy) * -7;
      const rY = ((x - cx) / cx) * 7;
      card.style.transform = `perspective(1000px) rotateX(${rX}deg) rotateY(${rY}deg) scale3d(1.02,1.02,1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)`;
    });
  });
}

// ===== INIT ALL SHARED =====
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initNavbar();
  initDiamondCanvas();
  initCursor();
  initReveal();
  setTimeout(initTilt, 300); // after dynamic content renders
});
