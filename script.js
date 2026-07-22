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
  const video = document.getElementById('opening-video');
  const skipBtn = document.getElementById('skip-btn');
  const openInvitationBtn = document.getElementById('open-invitation-btn');
  const music = document.getElementById('bg-music');
  const musicFab = document.getElementById('music-fab');

  let openingDone = false;
  let musicStarted = false;
  let videoStarted = false;

  // Start both music and video
  function startExperience() {
    if (videoStarted) return;
    videoStarted = true;

    // Hide the open invitation button
    if (openInvitationBtn) {
      openInvitationBtn.classList.add('hidden');
    }

    // Show skip button
    if (skipBtn) {
      skipBtn.classList.add('visible');
    }

    // Start music
    if (music && !musicStarted) {
      music.currentTime = 0;
      music.volume = 0.55;
      music.play().then(() => {
        musicStarted = true;
        if (musicFab) { 
          musicFab.classList.add('playing'); 
          musicFab.classList.remove('needs-tap'); 
        }
      }).catch(() => {
        console.log('Music autoplay blocked');
      });
    }

    // Start video
    if (video) {
      video.play().catch(() => {
        console.log('Video autoplay blocked');
      });
    }
  }

  function finishOpening(){
    if (openingDone) return;
    openingDone = true;
    gsap.to(openingEl, {
      opacity:0, duration:.9, ease:'power2.inOut',
      onComplete: () => {
        openingEl.style.display = 'none';
        document.body.style.overflow = 'auto';
        introReveal();
        if (window.ScrollTrigger) ScrollTrigger.refresh();
      }
    });
  }

  document.body.style.overflow = 'hidden';
  
  // Open Invitation button click handler
  if (openInvitationBtn) {
    openInvitationBtn.addEventListener('click', startExperience);
  }

  // Video ended handler
  if (video) {
    video.addEventListener('ended', finishOpening);
  }

  // Fallback timeout
  setTimeout(() => {
    if (!videoStarted) {
      // If user hasn't clicked yet, just finish opening
      finishOpening();
    }
  }, 30000); // 30s timeout if user doesn't interact

  // Skip button handler
  if (skipBtn) {
    skipBtn.addEventListener('click', finishOpening);
  }

  function introReveal(){
    gsap.fromTo('#hero .reveal',
      { opacity:0, y:50, filter:'blur(6px)' },
      { opacity:1, y:0, filter:'blur(0px)', duration:1.2, stagger:.15, ease:'power3.out' }
    );
  }

  /* ---------------- Nav ---------------- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.getElementById('nav-links');
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
    if (el.closest('#hero')) return; // handled by intro
    gsap.fromTo(el, { opacity:0, y:44, filter:'blur(4px)' }, {
      opacity:1, y:0, filter:'blur(0px)', duration:1.1, ease:'power3.out',
      scrollTrigger:{ trigger: el, start:'top 90%' }
    });
  });

  gsap.utils.toArray('.stagger-group').forEach(group => {
    gsap.fromTo(group.children, { opacity:0, y:50 }, {
      opacity:1, y:0, duration:.9, stagger:.15, ease:'power3.out',
      scrollTrigger:{ trigger: group, start:'top 90%' }
    });
  });

  /* ---------------- Floating particles (hero) ---------------- */
  const particleWrap = document.querySelector('.particles');
  if (particleWrap && !reducedMotion){
    for (let i=0;i<26;i++){
      const p = document.createElement('div');
      p.className = 'particle';
      const size = 2 + Math.random()*4;
      p.style.width = p.style.height = size+'px';
      p.style.left = Math.random()*100+'%';
      p.style.top = Math.random()*100+'%';
      particleWrap.appendChild(p);
      gsap.to(p, {
        y: -80 - Math.random()*120,
        x: (Math.random()-0.5)*60,
        opacity:0,
        duration: 6+Math.random()*6,
        repeat:-1,
        delay: Math.random()*6,
        ease:'sine.inOut'
      });
    }
  }

  /* ---------------- Countdown ---------------- */
  const weddingDate = new Date('2026-08-21T14:30:00+05:30').getTime();
  const dEl=document.getElementById('cd-days'), hEl=document.getElementById('cd-hours'),
        mEl=document.getElementById('cd-mins'), sEl=document.getElementById('cd-secs');
  if (dEl && hEl && mEl && sEl) {
    function tick(){
      const now = Date.now();
      let diff = Math.max(0, weddingDate - now);
      const d = Math.floor(diff/86400000);
      const h = Math.floor((diff%86400000)/3600000);
      const m = Math.floor((diff%3600000)/60000);
      const s = Math.floor((diff%60000)/1000);
      dEl.textContent = String(d).padStart(2,'0');
      hEl.textContent = String(h).padStart(2,'0');
      mEl.textContent = String(m).padStart(2,'0');
      sEl.textContent = String(s).padStart(2,'0');
    }
    tick(); setInterval(tick,1000);
  }

  /* ---------------- Floating controls ---------------- */
  const fabs = document.querySelectorAll('.fab');
  window.addEventListener('scroll', () => {
    fabs.forEach(f => { if (f !== musicFab) f.classList.toggle('visible', window.scrollY > 200); });
  });
  if (musicFab) musicFab.classList.add('visible', 'needs-tap');

  if (musicFab && music) {
    musicFab.addEventListener('click', () => {
      if (music.paused){
        music.play(); musicStarted = true; musicFab.classList.add('playing'); musicFab.classList.remove('needs-tap'); musicFab.textContent = '♫';
      } else {
        music.pause(); musicFab.classList.remove('playing');
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
      if (lenis) lenis.scrollTo(0); else window.scrollTo({top:0,behavior:'smooth'});
    });
  }

  /* First user interaction unlocks audio if autoplay was blocked */
  const unlockAudio = () => {
    if (!musicStarted && music) {
      music.play().then(() => {
        musicStarted = true;
        if (musicFab) { 
          musicFab.classList.add('playing'); 
          musicFab.classList.remove('needs-tap'); 
        }
      }).catch(() => {});
    }
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
    window.removeEventListener('touchend', unlockAudio);
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };
  window.addEventListener('click', unlockAudio);
  window.addEventListener('touchstart', unlockAudio, { passive:true });
  window.addEventListener('touchend', unlockAudio, { passive:true });
  window.addEventListener('pointerdown', unlockAudio);
  window.addEventListener('keydown', unlockAudio);

});
