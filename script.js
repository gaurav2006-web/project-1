/* =============================================
   BIRTHDAY CARD — script.js
   ============================================= */

/* =============================================
   1. STARDUST CANVAS — floating particles
   ============================================= */
(function initStardust() {
  const canvas = document.getElementById('stardust');
  const ctx    = canvas.getContext('2d');
  let W, H, stars = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const palette = ['#f9c2d4','#c4b5f5','#fcd5b5','#e8d5f5','#fbe4d0'];

  function createStar() {
    return {
      x:    Math.random() * W,
      y:    Math.random() * H,
      r:    Math.random() * 1.8 + 0.3,
      a:    Math.random(),
      da:   (Math.random() * 0.004 + 0.001) * (Math.random() < 0.5 ? 1 : -1),
      color: palette[Math.floor(Math.random() * palette.length)],
      vy:   -(Math.random() * 0.2 + 0.05)
    };
  }

  for (let i = 0; i < 120; i++) stars.push(createStar());

  function draw() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      s.a += s.da;
      if (s.a <= 0 || s.a >= 1) s.da *= -1;
      s.y += s.vy;
      if (s.y < -5) { s.y = H + 5; s.x = Math.random() * W; }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = s.a;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
})();

/* =============================================
   2. SCROLL REVEAL
   ============================================= */
(function initReveal() {
  // Add reveal class to sections
  document.querySelectorAll('.polaroid, .spotlight-layout, .mosaic-tile, .letter-card, .finale-inner, .section-title, .section-label')
    .forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

/* =============================================
   3. POLAROID HOVER — 3D tilt effect
   ============================================= */
(function initTilt() {
  document.querySelectorAll('.polaroid').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width  / 2);
      const dy    = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `rotate(0deg) rotateX(${-dy * 6}deg) rotateY(${dx * 6}deg) scale(1.05) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      // Restore original tilt
      const tilts = { p1: '-3.5deg', p2: '2deg', p3: '-1.5deg', p4: '3deg', p5: '-2deg' };
      const cls   = [...card.classList].find(c => tilts[c]);
      card.style.transform = cls ? `rotate(${tilts[cls]})` : '';
    });
  });
})();

/* =============================================
   4. ANIMATED COUNTERS
   ============================================= */
(function initCounters() {
  const nums = document.querySelectorAll('.stat-num');

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const end = el.dataset.target;
      io.unobserve(el);

      if (end === '∞') {
        let count = 0;
        const t = setInterval(() => {
          count++;
          el.textContent = count < 10 ? count : '∞';
          if (count >= 10) clearInterval(t);
        }, 80);
        return;
      }

      const endNum   = parseInt(end, 10);
      const duration = 1400;
      const step     = 16;
      const steps    = Math.ceil(duration / step);
      let   current  = 0;

      const t = setInterval(() => {
        current++;
        el.textContent = Math.round(easeOut(current / steps) * endNum);
        if (current >= steps) { el.textContent = endNum; clearInterval(t); }
      }, step);
    });
  }, { threshold: 0.5 });

  nums.forEach(n => io.observe(n));

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
})();

/* =============================================
   5. LIGHTBOX — click any filled image slot
   ============================================= */
(function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lightboxImg');
  const lbClose  = document.getElementById('lightboxClose');

  // Open lightbox when clicking an img inside an .img-slot
  document.addEventListener('click', e => {
    const img = e.target.closest('.img-slot')?.querySelector('img');
    if (img) {
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });

  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 400);
  }

  lbClose.addEventListener('click', close);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* =============================================
   6. CONFETTI BURST on Celebrate button
   ============================================= */
(function initConfetti() {
  const btn = document.getElementById('btnCelebrate');

  btn.addEventListener('click', () => {
    burst(btn);
    btn.querySelector('.btn-text').textContent = '🎂 Happy Birthday!';
    setTimeout(() => { btn.querySelector('.btn-text').textContent = '🎉 Celebrate!'; }, 3000);
  });

  function burst(origin) {
    const colors  = ['#f9a8d4','#c4b5fd','#fcd5b5','#fb7185','#fbbf24','#a5f3fc','#86efac','#e879a8'];
    const rect    = origin.getBoundingClientRect();
    const cx      = rect.left + rect.width  / 2;
    const cy      = rect.top  + rect.height / 2;
    const canvas  = document.createElement('canvas');
    const ctx     = canvas.getContext('2d');

    canvas.style.cssText = `
      position:fixed; inset:0; pointer-events:none; z-index:9999;
      width:100vw; height:100vh;
    `;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const pieces = Array.from({ length: 180 }, () => ({
      x:  cx, y: cy,
      vx: (Math.random() - 0.5) * 14,
      vy: Math.random() * -14 - 4,
      w:  Math.random() * 10 + 4,
      h:  Math.random() * 5  + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      angle: Math.random() * 360,
      spin:  (Math.random() - 0.5) * 8,
      alpha: 1,
      gravity: 0.35
    }));

    let frame;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = 0;
      pieces.forEach(p => {
        if (p.alpha <= 0) return;
        alive++;
        p.vy    += p.gravity;
        p.x     += p.vx;
        p.y     += p.vy;
        p.angle += p.spin;
        p.vx    *= 0.99;
        if (p.y > canvas.height * 0.85) p.alpha -= 0.04;

        ctx.save();
        ctx.globalAlpha = Math.max(p.alpha, 0);
        ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
        ctx.rotate(p.angle * Math.PI / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (alive > 0) {
        frame = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(frame);
        canvas.remove();
      }
    }
    animate();
  }
})();

/* =============================================
   7. LETTER DATE
   ============================================= */
(function setDate() {
  const el = document.getElementById('letterDate');
  if (!el) return;
  const now  = new Date();
  const opts = { year: 'numeric', month: 'long', day: 'numeric' };
  el.textContent = now.toLocaleDateString('en-IN', opts);
})();

/* =============================================
   8. HERO PARALLAX (subtle)
   ============================================= */
(function initParallax() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    hero.style.transform = `translateY(${y * 0.35}px)`;
    hero.style.opacity   = Math.max(1 - y / 600, 0);
  }, { passive: true });
})();

/* =============================================
   9. MOSAIC TILE hover particles
   ============================================= */
(function initMosaicSpark() {
  document.querySelectorAll('.mosaic-tile').forEach(tile => {
    tile.addEventListener('mouseenter', () => {
      const spark = document.createElement('span');
      spark.style.cssText = `
        position:absolute; top:12px; right:12px;
        font-size:18px; pointer-events:none; z-index:10;
        animation: sparkPop 0.6s ease forwards;
      `;
      spark.textContent = ['✨','💖','🌸','🦋','⭐'][Math.floor(Math.random()*5)];
      tile.style.position = 'relative';
      tile.appendChild(spark);
      setTimeout(() => spark.remove(), 650);
    });
  });

  // Inject keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes sparkPop {
      0%   { transform: scale(0) translateY(0); opacity: 0; }
      50%  { transform: scale(1.4) translateY(-8px); opacity: 1; }
      100% { transform: scale(1) translateY(-16px); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
})();
