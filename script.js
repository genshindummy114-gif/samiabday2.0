    // ==========================================
    // CONFETTI ENGINE
    // ==========================================
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let animationId = null;

    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function createParticles(count) {
      const colors = ['#ffb3c6', '#ff6b8a', '#ffd1dc', '#ffa5b9', '#ff8aa8', '#ffc3d0', '#ffe4ec', '#ffd700', '#ffecb3', '#ff69b4'];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: width / 2 + (Math.random() - 0.5) * 150,
          y: height / 2 + (Math.random() - 0.5) * 150,
          vx: (Math.random() - 0.5) * 25,
          vy: -Math.random() * 25 - 8,
          size: Math.random() * 10 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 1,
          decay: Math.random() * 0.012 + 0.005,
          gravity: 0.15
        });
      }
    }

    function updateParticles() {
      ctx.clearRect(0, 0, width, height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.life -= p.decay;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = p.life * 0.4;
        ctx.beginPath();
        ctx.arc(p.x - 3, p.y - 3, p.size * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
      if (particles.length > 0) {
        animationId = requestAnimationFrame(updateParticles);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    }

    function fireConfetti() {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
      particles = [];
      createParticles(200);
      updateParticles();
    }

    // ==========================================
    // CLAPPING EMOJI RAIN
    // ==========================================
    function startClapping() {
      const container = document.getElementById('clapContainer');
      const emojis = ['👏', '👏', '👏', '🎉', '🎊', '✨'];
      
      for (let i = 0; i < 40; i++) {
        const el = document.createElement('div');
        el.classList.add('clap-emoji');
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.left = Math.random() * 100 + '%';
        el.style.fontSize = (Math.random() * 1.5 + 1.5) + 'rem';
        el.style.animationDuration = (Math.random() * 2 + 2) + 's';
        el.style.animationDelay = (Math.random() * 1.5) + 's';
        container.appendChild(el);
        
        setTimeout(() => {
          if (el.parentNode) el.remove();
        }, 5000);
      }
    }

    // ==========================================
    // SURPRISE PAGE LOGIC
    // ==========================================
    const surpriseBtn = document.getElementById('surpriseBtn');
    const firstPage = document.getElementById('firstPage');
    const surprisePage = document.getElementById('surprisePage');
    const resetBtn = document.getElementById('resetSurpriseBtn');
    
    const decorateBtn = document.getElementById('decorateBtn');
    const cutBtn = document.getElementById('cutBtn');
    const messageBtnContainer = document.getElementById('messageBtnContainer');
    const messageBtn = document.getElementById('messageBtn');
    
    const cakeWhole = document.getElementById('cakeWhole');
    const cakeLeft = document.getElementById('cakeLeft');
    const cakeRight = document.getElementById('cakeRight');
    const candleWrapper = document.getElementById('candleWrapper');
    const knifeContainer = document.getElementById('knifeContainer');
    const birthdayMsg = document.getElementById('birthdayMsg');

    // Popups
    const messagePopup = document.getElementById('messagePopup');
    const closePopupBtn = document.getElementById('closePopupBtn');
    const envelopeBtn = document.getElementById('envelopeBtn');
    
    const imageOverlay = document.getElementById('imageOverlay');
    const closeImageBtn = document.getElementById('closeImageBtn');
    const bestWishesImg = document.getElementById('bestWishesImg');

    // Age reveal
    const ageReveal = document.getElementById('ageReveal');
    const ageRevealDays = document.getElementById('ageRevealDays');

    let isCut = false;

    // ==========================================
    // POP SOUND (synthesized, no audio file needed)
    // ==========================================
    let audioCtx = null;
    function playPopSound() {
      try {
        audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
        const now = audioCtx.currentTime;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(700, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.16);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.35, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      } catch (e) {
        // Web Audio not available — fail silently, animation still works
      }
    }

    // ==========================================
    // AGE REVEAL (18 years, counted in days)
    // ==========================================
    function getDaysAsAdult() {
      const today = new Date();
      const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
      const msPerDay = 1000 * 60 * 60 * 24;
      return Math.round((today - eighteenYearsAgo) / msPerDay);
    }

    function revealAge() {
      const target = getDaysAsAdult();
      const duration = 1400;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        ageRevealDays.textContent = Math.round(eased * target).toLocaleString();
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          ageRevealDays.textContent = target.toLocaleString();
        }
      }
      requestAnimationFrame(tick);
      ageReveal.classList.add('show');
    }

    function revealSurprise() {
      firstPage.style.display = 'none';
      surprisePage.classList.add('show');
      document.querySelector('.card').style.boxShadow = '0 20px 50px rgba(255, 105, 135, 0.4)';
      resetCakeState();
    }

    function resetCakeState() {
      isCut = false;
      
      cakeWhole.classList.remove('hidden');
      cakeLeft.classList.remove('show');
      cakeRight.classList.remove('show');
      candleWrapper.classList.remove('hidden');
      knifeContainer.classList.remove('show', 'animate');
      birthdayMsg.classList.remove('show');
      messageBtnContainer.classList.remove('show');
      ageReveal.classList.remove('show');
      ageRevealDays.textContent = '0';
      
      decorateBtn.style.display = 'block';
      decorateBtn.disabled = false;
      decorateBtn.textContent = '🎨 Decorate';
      decorateBtn.classList.add('highlight');
      
      cutBtn.style.display = 'none';
      cutBtn.disabled = false;
      cutBtn.textContent = '🔪 Cut the Cake';
      cutBtn.classList.remove('highlight');
      
      document.getElementById('clapContainer').innerHTML = '';
      
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
      particles = [];
      ctx.clearRect(0, 0, width, height);
    }

    // DECORATE
    decorateBtn.addEventListener('click', function() {
      fireConfetti();
      decorateBtn.style.display = 'none';
      cutBtn.style.display = 'block';
      cutBtn.classList.add('highlight');
    });

    // CUT THE CAKE
    cutBtn.addEventListener('click', function() {
      if (isCut) return;
      isCut = true;
      
      cutBtn.disabled = true;
      cutBtn.classList.remove('highlight');
      cutBtn.textContent = '🎂 Slicing...';
      
      knifeContainer.classList.add('show');
      
      setTimeout(() => {
        knifeContainer.classList.add('animate');
      }, 100);
      
      setTimeout(() => {
        cakeWhole.classList.add('hidden');
        candleWrapper.classList.add('hidden');
        cakeLeft.classList.add('show');
        cakeRight.classList.add('show');
        
        playPopSound();
        fireConfetti();
        birthdayMsg.classList.add('show');
        cutBtn.textContent = '🍰 Cake Cut! 🍰';
        
        setTimeout(() => {
          messageBtnContainer.classList.add('show');
          revealAge();
        }, 500);
        
      }, 700);
      
      setTimeout(() => {
        startClapping();
        setTimeout(() => fireConfetti(), 300);
        setTimeout(() => fireConfetti(), 600);
      }, 1000);
    });

    // ==========================================
    // POPUP LOGIC
    // ==========================================
    
    // Open Message Popup
    messageBtn.addEventListener('click', function() {
      messagePopup.classList.add('show');
    });

    // Close Message Popup (Close button)
    closePopupBtn.addEventListener('click', function() {
      messagePopup.classList.remove('show');
    });

    // Envelope button -> Open Image Lightbox
    envelopeBtn.addEventListener('click', function() {
      messagePopup.classList.remove('show');
      // Small delay to let the text popup close smoothly
      setTimeout(() => {
        imageOverlay.classList.add('show');
      }, 300);
    });

    // Close Image Lightbox
    closeImageBtn.addEventListener('click', function() {
      imageOverlay.classList.remove('show');
    });

    // Close popups when clicking outside
    messagePopup.addEventListener('click', function(e) {
      if (e.target === messagePopup) {
        messagePopup.classList.remove('show');
      }
    });

    imageOverlay.addEventListener('click', function(e) {
      if (e.target === imageOverlay) {
        imageOverlay.classList.remove('show');
      }
    });

    // ==========================================
    // RESET
    // ==========================================
    function resetToFirst() {
      firstPage.style.display = 'flex';
      surprisePage.classList.remove('show');
      surprisePage.style.display = '';
      document.querySelector('.card').style.boxShadow = '';
      firstPage.style.flexDirection = 'column';
      firstPage.style.alignItems = 'center';
      
      resetCakeState();
      document.getElementById('clapContainer').innerHTML = '';
      messagePopup.classList.remove('show');
      imageOverlay.classList.remove('show');
      
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
      particles = [];
      ctx.clearRect(0, 0, width, height);
    }

    surpriseBtn.addEventListener('click', function(e) {
      e.preventDefault();
      revealSurprise();
    });

    resetBtn.addEventListener('click', function(e) {
      e.preventDefault();
      resetToFirst();
    });

    resetToFirst();
    surprisePage.style.display = '';
