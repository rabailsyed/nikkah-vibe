// No YouTube API needed anymore

document.addEventListener('DOMContentLoaded', () => {
  // --- Dreamy Opening Scene Handler ---
  const envelopeScreen = document.getElementById('envelope-screen');
  const invitationCard = document.getElementById('invitationCard');
  const musicBtn = document.getElementById('musicBtn');
  const bgMusic = document.getElementById('bgMusic');
  let hasScrolled = false;

  function tryPlayMusic() {
    if (!bgMusic || !bgMusic.src) return;
    bgMusic.volume = 0.5;
    bgMusic.play().then(() => {
      musicBtn.classList.add('playing');
    }).catch(() => {
      console.log('Autoplay prevented or audio unavailable.');
    });
  }

  // Allow scrolling immediately for dreamy opening
  document.body.classList.remove('no-scroll');

  const beginScrollTransition = () => {
    if (!hasScrolled) {
      hasScrolled = true;
      tryPlayMusic();
      handleTransition();
    }
  };

  // Detect scroll to transition
  envelopeScreen.addEventListener('wheel', (e) => {
    if (e.deltaY > 10) {
      beginScrollTransition();
    }
  }, { passive: true });

  envelopeScreen.addEventListener('touchstart', beginScrollTransition, { passive: true });
  envelopeScreen.addEventListener('pointerdown', beginScrollTransition, { passive: true });
  envelopeScreen.addEventListener('click', beginScrollTransition);

  window.addEventListener('wheel', (e) => {
    if (e.deltaY > 10) {
      beginScrollTransition();
    }
  }, { passive: true });

  window.addEventListener('touchmove', beginScrollTransition, { passive: true });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      beginScrollTransition();
    }
    
    // Parallax effect for opening screen
    const envelopeScreen = document.getElementById('envelope-screen');
    if (envelopeScreen && envelopeScreen.style.display !== 'none') {
      const scrollY = window.scrollY;
      const parallaxValue = scrollY * 0.5; // Subtle parallax (50% of scroll speed)
      
      // Apply parallax to pseudo elements via transform
      if (envelopeScreen.classList.contains('minimalist-opening')) {
        envelopeScreen.style.backgroundPosition = `center ${parallaxValue}px`;
      }
    }
    
    // Parallax for full page background
    const parallaxBg = scrollY * 0.3; // Very subtle (30% of scroll speed)
    document.body.style.backgroundPosition = `0 ${parallaxBg}px`;
  });

  function handleTransition() {
    // Fade out opening scene
    envelopeScreen.classList.add('opened');
    
    // Wait a bit then show main invitation card
    setTimeout(() => {
      invitationCard.classList.remove('hidden');
      musicBtn.classList.remove('hidden');
      
      // Start playing background music automatically
      if (bgMusic && bgMusic.src) {
        bgMusic.volume = 0.5; // Set volume to 50%
        bgMusic.play().then(() => {
          musicBtn.classList.add('playing');
          musicBtn.textContent = '⏸';
        }).catch(e => {
          // Auto-play was prevented by browser
          console.log('Autoplay prevented or audio file missing.');
          musicBtn.textContent = '▶';
        });
      } else {
        console.log('Audio file not found or not available.');
        musicBtn.textContent = '▶';
      }
      
      // Trigger initial reveal
      handleScrollReveal();
      
      // Hide opening scene from DOM
      setTimeout(() => {
        envelopeScreen.style.display = 'none';
      }, 1000);
    }, 500);
  }

  // --- Music Button Toggle Logic ---
  musicBtn.addEventListener('click', () => {
    if (!bgMusic) return;
    if (bgMusic.paused) {
      bgMusic.play();
      musicBtn.classList.add('playing');
      musicBtn.textContent = '⏸';
    } else {
      bgMusic.pause();
      musicBtn.classList.remove('playing');
      musicBtn.textContent = '▶';
    }
  });

  bgMusic.addEventListener('play', () => {
    musicBtn.classList.add('playing');
    musicBtn.textContent = '⏸';
  });

  bgMusic.addEventListener('pause', () => {
    musicBtn.classList.remove('playing');
    musicBtn.textContent = '▶';
  });

  bgMusic.addEventListener('error', () => {
    console.log('Audio load error: make sure the file exists and the path is correct.');
    musicBtn.textContent = '🎵';
  });

  // --- Scroll Reveal Animation ---
  const reveals = document.querySelectorAll('.reveal');
  
  function handleScrollReveal() {
    const windowHeight = window.innerHeight;
    const elementVisible = 100;

    reveals.forEach((reveal) => {
      const elementTop = reveal.getBoundingClientRect().top;
      if (elementTop < windowHeight - elementVisible) {
        reveal.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleScrollReveal);


  // --- Countdown Timer ---
  // Target date: 9th August 2026, 7:00 PM (using local time for simplicity)
  const targetDate = new Date("August 9, 2026 19:00:00").getTime();

  const countdownBoxes = document.querySelectorAll('.countdown-box');
  const blessingTemplates = {
    DAYS: (value) => `As the countdown reaches ${value} days, may Allah fill your marriage with patience, joy, and endless blessings.`,
    HOURS: (value) => `At ${value} hours before the celebration, may peace and love surround your new journey together.`,
    MINUTES: (value) => `With ${value} minutes left, may your hearts remain united and your home blessed with mercy.`,
    SECONDS: (value) => `In ${value} seconds, may Allah protect your union and grant you a lifetime of happiness.`
  };

  function sendBlessingEmail(label, message) {
    const subject = encodeURIComponent(`A Blessing for the Couple (${label})`);
    const body = encodeURIComponent(message + '\n\nMay Allah accept these prayers.');
    window.location.href = `mailto:rabailsyed@gmail.com?subject=${subject}&body=${body}`;
  }

  countdownBoxes.forEach((box) => {
    box.addEventListener('click', () => {
      const label = box.querySelector('.countdown-label')?.textContent?.trim() || 'Blessing';
      const value = box.querySelector('.countdown-number')?.textContent?.trim() || '';
      const template = blessingTemplates[label.toUpperCase()] || ((val) => `Sending warm blessings at ${val} ${label.toLowerCase()}.`);
      const blessing = template(value);
      sendBlessingEmail(label, blessing);
    });
  });

  const updateCountdown = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      clearInterval(updateCountdown);
      document.getElementById("cd-days").innerText = "00";
      document.getElementById("cd-hours").innerText = "00";
      document.getElementById("cd-minutes").innerText = "00";
      document.getElementById("cd-seconds").innerText = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("cd-days").innerText = days.toString().padStart(2, '0');
    document.getElementById("cd-hours").innerText = hours.toString().padStart(2, '0');
    document.getElementById("cd-minutes").innerText = minutes.toString().padStart(2, '0');
    document.getElementById("cd-seconds").innerText = seconds.toString().padStart(2, '0');
  }, 1000);


  // --- Wishes Database Simulation & Email Submission ---
  const wishesForm = document.getElementById('wishesForm');
  const wishesDisplay = document.getElementById('wishesDisplay');
  const STORAGE_KEY = 'nikah_wishes_db';

  // Load existing wishes
  function loadWishes() {
    wishesDisplay.innerHTML = '';
    const wishes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    wishes.forEach(wish => {
      addWishToDOM(wish.name, wish.message);
    });
  }

  function addWishToDOM(name, message) {
    const wishDiv = document.createElement('div');
    wishDiv.className = 'wish-entry';
    wishDiv.innerHTML = `
      <div class="wish-entry-name">${escapeHTML(name)}</div>
      <div class="wish-entry-msg">${escapeHTML(message)}</div>
    `;
    wishesDisplay.prepend(wishDiv);
  }

  // Simple HTML escaper
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
      }[tag] || tag)
    );
  }

  loadWishes();

  wishesForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('wishName').value;
    const email = document.getElementById('wishEmail').value;
    const message = document.getElementById('wishMessage').value;

    // 1. Save to Local "Database" (localStorage)
    const wishes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    wishes.push({ name, email, message, date: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));

    // 2. Add to DOM visually
    addWishToDOM(name, message);

    // 3. Trigger Email Client to send the message to the owner
    const subject = encodeURIComponent(`Nikah Wish from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.location.href = `mailto:rabailsyed@gmail.com?subject=${subject}&body=${body}`;

    // Reset form
    wishesForm.reset();
  });


  // --- Background Particles Canvas (Baby's Breath style) ---
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  
  let particlesArray = [];
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    initParticles();
  });

  class Particle {
    constructor() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = Math.random() * 0.5 - 0.25;
      this.speedY = Math.random() * -0.5 - 0.1; // Float upwards slightly
      this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      
      // Reset if off screen
      if (this.y < 0) {
        this.y = h;
        this.x = Math.random() * w;
      }
      if (this.x < 0 || this.x > w) {
        this.speedX = -this.speedX;
      }
    }
    draw() {
      ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`; // Gold-ish particles
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particlesArray = [];
    const numParticles = Math.floor((w * h) / 10000); // Responsive particle count
    for (let i = 0; i < numParticles; i++) {
      particlesArray.push(new Particle());
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }
    requestAnimationFrame(animateParticles);
  }

  initParticles();
  animateParticles();

});
