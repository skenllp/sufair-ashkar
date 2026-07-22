/* ============================================================
   Sufair & Jugunu · Ashkar & Nasiba — site script
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  gsap.registerPlugin(ScrollTrigger);

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Lenis smooth scroll ---------------- */
  let lenis;
  if (!reducedMotion && window.Lenis){
    lenis = new Lenis({ lerp:0.1, smoothWheel:true });
    function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time)=>{ lenis.raf(time*1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* ---------------- Opening sequence ---------------- */
  const openingEl = document.getElementById('opening');
  const video     = document.getElementById('opening-video');
  const skipBtn   = document.getElementById('skip-btn');
  const playBtn   = document.getElementById('play-btn');
  const music     = document.getElementById('bg-music');
  const musicFab  = document.getElementById('music-fab');

  let openingDone  = false;
  let musicStarted = false;

  /* Start video + music together when Play is clicked */
  function startExperience() {
    // Play video (with sound allowed now — user gesture)
    if (video) {
      video.muted = false;
      video.currentTime = 0;
      video.play().catch(() => {
        video.muted = true;
        video.play().catch(() => {});
      });
    }

    // Play music from start
    if (music && !musicStarted) {
      music.currentTime = 0;
      music.volume = 0.55;
      music.play().then(() => {
        musicStarted = true;
        if (musicFab) musicFab.classList.add('playing');
      }).catch(() => {});
    }

    // Hide play button
    if (playBtn) playBtn.classList.add('hide');
  }

  if (playBtn) {
    playBtn.addEventListener('click', startExperience);
  }

  function finishOpening() {
    if (openingDone) return;
    openingDone = true;
    gsap.to(openingEl, {
      opacity: 0, duration: .9, ease: 'power2.inOut',
      onComplete: () => {
        openingEl.style.display = 'none';
        document.body.style.overflow = 'auto';
        introReveal();
        if (window.ScrollTrigger) ScrollTrigger.refresh();
        // Keep music going after opening ends
        if (music && !musicStarted) {
          music.volume = 0.55;
          music.play().then(() => {
            musicStarted = true;
            if (musicFab) musicFab.classList.add('playing');
          }).catch(() => {});
        }
      }
    });
  }

  document.body.style.overflow = 'hidden';
  if (video) {
    video.addEventListener('ended', finishOpening);
  }
  // Fallback: auto-close after 10s even if play wasn't pressed
  setTimeout(finishOpening, 10000);
  if (skipBtn) skipBtn.addEventListener('click', finishOpening);

  function introReveal() {
    gsap.fromTo('#hero .reveal',
      { opacity: 0, y: 50, filter: 'blur(6px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, stagger: .15, ease: 'power3.out' }
    );
  }

  /* ---------------- Nav ---------------- */
  const navbar    = document.getElementById('navbar');
  const navLinks  = document.getElementById('nav-links');
  const navToggle = document.getElementById('nav-toggle');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    });
  }
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
  }

  /* ---------------- Scroll reveals ---------------- */
  gsap.utils.toArray('.reveal').forEach(el => {
    if (el.closest('#hero')) return; // handled by introReveal
    gsap.fromTo(el, { opacity: 0, y: 44, filter: 'blur(4px)' }, {
      opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%' }
    });
  });

  gsap.utils.toArray('.stagger-group').forEach(group => {
    gsap.fromTo(group.children, { opacity: 0, y: 50 }, {
      opacity: 1, y: 0, duration: .9, stagger: .15, ease: 'power3.out',
      scrollTrigger: { trigger: group, start: 'top 90%' }
    });
  });

  /* ---------------- Floating particles (hero) ---------------- */
  const particleWrap = document.querySelector('.particles');
  if (particleWrap && !reducedMotion) {
    for (let i = 0; i < 26; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = 2 + Math.random() * 4;
      p.style.width = p.style.height = size + 'px';
      p.style.left  = Math.random() * 100 + '%';
      p.style.top   = Math.random() * 100 + '%';
      particleWrap.appendChild(p);
      gsap.to(p, {
        y: -80 - Math.random() * 120,
        x: (Math.random() - 0.5) * 60,
        opacity: 0,
        duration: 6 + Math.random() * 6,
        repeat: -1,
        delay: Math.random() * 6,
        ease: 'sine.inOut'
      });
    }
  }

  /* ---------------- Countdown ---------------- */
  const weddingDate = new Date('2026-08-21T14:30:00+05:30').getTime();
  const dEl = document.getElementById('cd-days'),
        hEl = document.getElementById('cd-hours'),
        mEl = document.getElementById('cd-mins'),
        sEl = document.getElementById('cd-secs');
  if (dEl && hEl && mEl && sEl) {
    function tick() {
      const now  = Date.now();
      let diff   = Math.max(0, weddingDate - now);
      const d    = Math.floor(diff / 86400000);
      const h    = Math.floor((diff % 86400000) / 3600000);
      const m    = Math.floor((diff % 3600000) / 60000);
      const s    = Math.floor((diff % 60000) / 1000);
      dEl.textContent = String(d).padStart(2, '0');
      hEl.textContent = String(h).padStart(2, '0');
      mEl.textContent = String(m).padStart(2, '0');
      sEl.textContent = String(s).padStart(2, '0');
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------------- Floating controls ---------------- */
  const fabs = document.querySelectorAll('.fab');
  window.addEventListener('scroll', () => {
    fabs.forEach(f => f.classList.toggle('visible', window.scrollY > 200));
  });

  if (musicFab && music) {
    musicFab.addEventListener('click', () => {
      if (music.paused) {
        music.play();
        musicFab.classList.add('playing');
        musicFab.textContent = '♫';
      } else {
        music.pause();
        musicFab.classList.remove('playing');
        musicFab.textContent = '♪';
      }
    });
  }

  const waFab = document.getElementById('whatsapp-fab');
  if (waFab) {
    waFab.addEventListener('click', () => {
      const text = encodeURIComponent('You are invited! Sufair & Jugunu / Ashkar & Nasiba — 21–22 August 2026. ' + window.location.href);
      window.open(`https://wa.me/?text=${text}`, '_blank');
    });
  }

  const topFab = document.getElementById('top-fab');
  if (topFab) {
    topFab.addEventListener('click', () => {
      if (lenis) lenis.scrollTo(0);
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});
