/* ============================================================
   WEDDING INVITATION — script.js
   Fitur: Audio Player, Open Invitation, Countdown,
          Fade-In on Scroll, Gift Toggle, Copy Account,
          Hero Particles, URL Guest Name
   ============================================================ */

/* ============================================================
   1. BACA NAMA TAMU DARI URL PARAMETER
   Contoh URL: index.html?to=Budi+Santoso
   ============================================================ */
(function readGuestName() {
  const params = new URLSearchParams(window.location.search);
  const guestParam = params.get('to');
  const el = document.getElementById('guestName');
  if (el && guestParam) {
    el.textContent = decodeURIComponent(guestParam.replace(/\+/g, ' '));
  }
})();

/* ============================================================
   2. HERO PARTICLES — Titik-titik emas mengambang
   ============================================================ */
(function initParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  const count = 28;
  for (let i = 0; i < count; i++) {
    const span = document.createElement('span');
    const size = Math.random() * 4 + 1.5;        // px
    const left = Math.random() * 100;             // %
    const startTop = Math.random() * 100 + 20;   // % (mulai dari bawah)
    const dur = (Math.random() * 9 + 7).toFixed(1); // 7s – 16s
    const delay = (Math.random() * 10).toFixed(1);   // 0s – 10s

    span.style.cssText = `
      width:${size}px; height:${size}px;
      left:${left}%; top:${startTop}%;
      --dur:${dur}s; --delay:${delay}s;
    `;
    container.appendChild(span);
  }
})();

/* ============================================================
   3. BUKA UNDANGAN — scroll & tampilkan konten utama
   ============================================================ */
function openInvitation() {
  const main = document.getElementById('mainContent');
  if (!main) return;

  // Tampilkan konten
  main.classList.remove('hidden');

  // Coba play musik otomatis setelah user gesture
  tryAutoplay();

  // Scroll smooth ke main content
  setTimeout(() => {
    main.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 120);
}

/* ============================================================
   4. COUNTDOWN TIMER
   [GANTI] Sesuaikan targetDate dengan tanggal pernikahan Anda
   ============================================================ */
(function initCountdown() {
  // [GANTI] Format: 'YYYY-MM-DDTHH:MM:SS'
  const targetDate = new Date('2026-02-14T08:00:00');

  function updateCountdown() {
    const now  = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      // Hari H telah tiba!
      ['cntDays','cntHours','cntMins','cntSecs'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '00';
      });
      const label = document.querySelector('.countdown-label');
      if (label) label.textContent = '🎉 Hari Bahagia Telah Tiba!';
      return;
    }

    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000)  / 60000);
    const secs  = Math.floor((diff % 60000)    / 1000);

    const pad = n => String(n).padStart(2, '0');

    setEl('cntDays',  pad(days));
    setEl('cntHours', pad(hours));
    setEl('cntMins',  pad(mins));
    setEl('cntSecs',  pad(secs));
  }

  function setEl(id, val) {
    const el = document.getElementById(id);
    if (el && el.textContent !== val) {
      el.textContent = val;
      // Animasi flip kecil
      el.classList.remove('flip');
      void el.offsetWidth; // reflow
      el.classList.add('flip');
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
})();

/* ============================================================
   5. FADE-IN ON SCROLL (Intersection Observer)
   ============================================================ */
(function initFadeIn() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Sedikit delay per elemen untuk efek stagger
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay * 1000);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  // Tambahkan stagger delay ke setiap elemen .fade-in dalam kontainer
  document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach((el, i) => {
    // Hanya beri stagger di dalam kelompok yang sama
    const siblingIdx = Array.from(el.parentElement.children).indexOf(el);
    el.dataset.delay = (siblingIdx * 0.08).toFixed(2);
    observer.observe(el);
  });
})();

/* ============================================================
   6. TOGGLE GIFT / AMPLOP DIGITAL
   ============================================================ */
function toggleGiftSection() {
  const section = document.getElementById('giftAccounts');
  const btn     = document.getElementById('btnRevealGift');
  if (!section || !btn) return;

  const isHidden = section.style.display === 'none' || section.style.display === '';

  if (isHidden) {
    section.style.display = 'flex';
    // Trigger reflow untuk animasi
    void section.offsetWidth;
    section.style.animation = 'fadeUp 0.55s ease forwards';

    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      Tutup
    `;

    // Scroll ke section rekening
    setTimeout(() => {
      section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 200);

  } else {
    section.style.display = 'none';
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Beri Hadiah
    `;
  }
}

/* ============================================================
   7. SALIN NOMOR REKENING
   ============================================================ */
function copyAccount(elementId, btn) {
  const el = document.getElementById(elementId);
  if (!el) return;

  // Ambil teks, bersihkan spasi
  const text = el.textContent.replace(/\s+/g, '');

  navigator.clipboard.writeText(text).then(() => {
    const original = btn.innerHTML;
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Tersalin!
    `;
    btn.classList.add('copied');
    setTimeout(() => {
      btn.innerHTML = original;
      btn.classList.remove('copied');
    }, 2500);
  }).catch(() => {
    // Fallback untuk browser lama
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0;';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);

    const original = btn.innerHTML;
    btn.innerHTML = `✓ Tersalin!`;
    btn.classList.add('copied');
    setTimeout(() => {
      btn.innerHTML = original;
      btn.classList.remove('copied');
    }, 2500);
  });
}

/* ============================================================
   8. FLOATING AUDIO PLAYER
   ============================================================ */
const music   = document.getElementById('bgMusic');
const audioBtn = document.getElementById('audioBtn');
let isPlaying  = false;

function toggleMusic() {
  if (!music) return;

  if (isPlaying) {
    music.pause();
    setAudioIcon(false);
  } else {
    music.play().catch(err => {
      console.warn('Autoplay diblokir browser:', err);
    });
    setAudioIcon(true);
  }
  isPlaying = !isPlaying;
}

function setAudioIcon(playing) {
  if (!audioBtn) return;
  const iconPlay  = audioBtn.querySelector('.icon-play');
  const iconPause = audioBtn.querySelector('.icon-pause');
  if (!iconPlay || !iconPause) return;

  if (playing) {
    iconPlay.classList.add('hidden');
    iconPause.classList.remove('hidden');
    audioBtn.title = 'Pause Musik';
  } else {
    iconPause.classList.add('hidden');
    iconPlay.classList.remove('hidden');
    audioBtn.title = 'Play Musik';
  }
}

// Coba autoplay setelah user gesture (buka undangan)
function tryAutoplay() {
  if (!music || isPlaying) return;
  music.volume = 0.7;
  music.play().then(() => {
    isPlaying = true;
    setAudioIcon(true);
  }).catch(() => {
    // Diam-diam gagal; user bisa klik tombol manual
  });
}

/* ============================================================
   9. SMOOTH SCROLLING untuk anchor link
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ============================================================
   10. CSS ANIMASI FLIP untuk countdown (inject via JS)
   ============================================================ */
(function injectFlipStyle() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes flipNum {
      0%   { transform: rotateX(0deg); opacity: 1; }
      50%  { transform: rotateX(-90deg); opacity: 0; }
      51%  { transform: rotateX(90deg); opacity: 0; }
      100% { transform: rotateX(0deg); opacity: 1; }
    }
    .flip {
      animation: flipNum 0.36s ease;
      display: inline-block;
    }
  `;
  document.head.appendChild(style);
})();

/* ============================================================
   CATATAN PENGEMBANG
   ============================================================
   - Untuk mengubah tanggal target countdown, cari baris:
       const targetDate = new Date('2026-02-14T08:00:00');
     dan ganti dengan tanggal pernikahan Anda.

   - Untuk musik, ganti src pada elemen <audio id="bgMusic">
     di index.html dengan URL file mp3 Anda.

   - Nama tamu dapat diisi lewat URL:
       index.html?to=Budi+Santoso
     Ini berguna saat mengirim link personal via WhatsApp.
   ============================================================ */
