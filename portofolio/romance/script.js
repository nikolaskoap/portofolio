/* ===================================================
   OUR MOMEN - CLEAN INTERACTIVE GALLERY SCRIPT
   Features: Likes, User Comments, Slideshow, Ambience
   Anniversary: 11 November 2024
   =================================================== */

// 1. DATA FOTO BERSIH (HANYA FOTO, LIKE & KOMENTAR)
let photoItems = [
  { id: 1, src: "images/photo1.jpg", likes: 14 },
  { id: 2, src: "images/photo2.jpg", likes: 26 },
  { id: 3, src: "images/photo3.jpg", likes: 19 },
  { id: 4, src: "images/photo4.jpg", likes: 28 },
  { id: 5, src: "images/photo5.jpg", likes: 33 },
  { id: 6, src: "images/photo6.jpg", likes: 21 },
  { id: 7, src: "images/photo7.jpg", likes: 39 },
  { id: 8, src: "images/photo8.jpg", likes: 24 },
  { id: 9, src: "images/photo9.jpg", likes: 30 },
  { id: 10, src: "images/photo10.jpg", likes: 45 },
  { id: 11, src: "images/photo11.jpg", likes: 52 }
];

// 2. SISTEM KOMENTAR (LOCALSTORAGE PERSISTENCE)
function getPhotoComments(photoId) {
  try {
    const saved = localStorage.getItem(`our_momen_comments_${photoId}`);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}

function savePhotoComment(photoId, commentText) {
  const comments = getPhotoComments(photoId);
  const newComment = {
    id: Date.now(),
    text: commentText,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  };
  comments.push(newComment);
  try {
    localStorage.setItem(`our_momen_comments_${photoId}`, JSON.stringify(comments));
  } catch (e) {}
  return comments;
}

// 3. ELEMENT SELECTORS
const galleryGrid = document.getElementById("gallery-grid");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxFigure = document.getElementById("lightbox-figure");
const lightboxCounter = document.getElementById("lightbox-counter");
const lightboxClose = document.getElementById("lightbox-close");
const lightboxPrev = document.getElementById("lightbox-prev");
const lightboxNext = document.getElementById("lightbox-next");
const lightboxLikeBtn = document.getElementById("lightbox-like-btn");
const lightboxLikeCount = document.getElementById("lightbox-like-count");
const lightboxCommentBtn = document.getElementById("lightbox-comment-btn");
const lightboxCommentCount = document.getElementById("lightbox-comment-count");
const lightboxPlayBtn = document.getElementById("lightbox-slideshow-toggle");
const lightboxPlayIcon = document.getElementById("lightbox-play-icon");
const lightboxZoomBtn = document.getElementById("lightbox-zoom-toggle");
const lightboxThumbnailBar = document.getElementById("lightbox-thumbnail-bar");

// Comments Panel Elements
const commentsPanel = document.getElementById("lightbox-comments-panel");
const commentsPanelClose = document.getElementById("comments-panel-close");
const commentsList = document.getElementById("comments-list");
const commentForm = document.getElementById("comment-form");
const commentInput = document.getElementById("comment-input");

// Toolbar Elements
const counterPill = document.getElementById("counter-pill");
const liveTimeTicker = document.getElementById("live-time-ticker");
const toolbarSlideshowBtn = document.getElementById("toolbar-slideshow-btn");
const toolbarShuffleBtn = document.getElementById("toolbar-shuffle-btn");
const toolbarMusicBtn = document.getElementById("toolbar-music-btn");
const musicIcon = document.getElementById("music-icon");
const musicLabel = document.getElementById("music-label");
const musicUploadInput = document.getElementById("music-upload-input");

let activeIndex = 0;
let isSlideshowActive = false;
let slideshowTimer = null;
let isZoomed = false;

// ===================================================
// 4. LIVE ANNIVERSARY COUNTER (11 November 2024)
// ===================================================
const anniversaryDate = new Date(2024, 10, 11, 0, 0, 0); // Month 10 = November

function updateLiveTicker() {
  const now = new Date();
  const diff = now - anniversaryDate;
  if (diff < 0) return;

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  liveTimeTicker.textContent = `${days} Hari • ${hours}j ${minutes}m ${seconds}s Bersama`;
}

setInterval(updateLiveTicker, 1000);
updateLiveTicker();

counterPill.addEventListener("click", () => {
  launchHeartConfetti();
});

// ===================================================
// 5. RENDER GALLERY (BERSIH, HANYA FOTO & MICRO-INTERACTIONS)
// ===================================================
function renderGallery() {
  galleryGrid.innerHTML = "";

  photoItems.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "gallery-card";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `Buka foto ${index + 1}`);

    const formattedIndex = String(index + 1).padStart(2, "0");
    const commentsCount = getPhotoComments(item.id).length;

    card.innerHTML = `
      <img src="${item.src}" alt="Our Momen ${index + 1}" loading="lazy" decoding="async">
      <div class="card-overlay">
        <div class="card-top-info">
          <button class="card-like-btn" type="button" title="Sukai foto" aria-label="Sukai foto">
            ♥
          </button>
        </div>
        <div class="card-bottom-info">
          <span class="card-index">${formattedIndex}</span>
          <div class="card-stats">
            <span>♥ ${item.likes}</span>
            <span>💬 ${commentsCount}</span>
          </div>
        </div>
      </div>
    `;

    // 3D Tilt Effect on mouse movement
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xPercent = (x / rect.width - 0.5) * 8;
      const yPercent = (y / rect.height - 0.5) * -8;
      card.style.transform = `perspective(700px) rotateX(${yPercent}deg) rotateY(${xPercent}deg) scale(1.02)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)";
    });

    // Card Like Button
    const likeBtn = card.querySelector(".card-like-btn");
    likeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      item.likes += 1;
      likeBtn.classList.add("liked");
      spawnFloatingHeart(e.clientX, e.clientY);
      updateLightboxState();
      card.querySelector(".card-stats span:first-child").textContent = `♥ ${item.likes}`;
    });

    // Open Lightbox
    card.addEventListener("click", () => openLightbox(index));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(index);
      }
    });

    galleryGrid.appendChild(card);
  });

  renderThumbnails();
}

// ===================================================
// 6. LIGHTBOX & INTERACTIVE COMMENTS
// ===================================================
function renderThumbnails() {
  lightboxThumbnailBar.innerHTML = "";
  photoItems.forEach((item, index) => {
    const thumb = document.createElement("div");
    thumb.className = `thumb-item ${index === activeIndex ? "active" : ""}`;
    thumb.innerHTML = `<img src="${item.src}" alt="Thumbnail ${index + 1}">`;
    thumb.addEventListener("click", () => {
      showPhoto(index);
    });
    lightboxThumbnailBar.appendChild(thumb);
  });
}

function updateThumbnailActive() {
  const thumbs = lightboxThumbnailBar.querySelectorAll(".thumb-item");
  thumbs.forEach((thumb, idx) => {
    thumb.classList.toggle("active", idx === activeIndex);
  });
  const activeThumb = thumbs[activeIndex];
  if (activeThumb) {
    activeThumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }
}

function showPhoto(index) {
  activeIndex = (index + photoItems.length) % photoItems.length;
  const current = photoItems[activeIndex];

  // Reset zoom state
  isZoomed = false;
  lightboxFigure.classList.remove("is-zoomed");
  lightboxZoomBtn.querySelector("#lightbox-zoom-icon").textContent = "🔍";

  lightboxImage.src = current.src;
  lightboxCounter.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(photoItems.length).padStart(2, "0")}`;

  updateLightboxState();
  updateThumbnailActive();
  renderCommentsList(current.id);
}

function updateLightboxState() {
  const current = photoItems[activeIndex];
  lightboxLikeCount.textContent = current.likes;
  const comments = getPhotoComments(current.id);
  lightboxCommentCount.textContent = comments.length;
}

function renderCommentsList(photoId) {
  const comments = getPhotoComments(photoId);
  commentsList.innerHTML = "";

  if (comments.length === 0) {
    commentsList.innerHTML = `<p class="comment-empty-msg">Belum ada komentar. Tulis sesuatu yang manis... 💬</p>`;
    return;
  }

  comments.forEach(c => {
    const item = document.createElement("div");
    item.className = "comment-item";
    item.innerHTML = `
      <div class="comment-meta">
        <span class="comment-author">Kamu ♥</span>
        <span>${c.date || ""} ${c.time || ""}</span>
      </div>
      <div class="comment-text">${escapeHtml(c.text)}</div>
    `;
    commentsList.appendChild(item);
  });

  commentsList.scrollTop = commentsList.scrollHeight;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Add comment form submit
commentForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = commentInput.value.trim();
  if (!text) return;

  const current = photoItems[activeIndex];
  savePhotoComment(current.id, text);
  commentInput.value = "";
  renderCommentsList(current.id);
  updateLightboxState();
  launchHeartConfetti();
  renderGallery(); // update card comments count
});

// Toggle Comments Panel
lightboxCommentBtn.addEventListener("click", () => {
  commentsPanel.classList.toggle("is-open");
  lightboxCommentBtn.classList.toggle("active", commentsPanel.classList.contains("is-open"));
  if (commentsPanel.classList.contains("is-open")) {
    commentInput.focus();
  }
});

commentsPanelClose.addEventListener("click", () => {
  commentsPanel.classList.remove("is-open");
  lightboxCommentBtn.classList.remove("active");
});

function openLightbox(index) {
  showPhoto(index);
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
}

function closeLightbox() {
  stopSlideshow();
  commentsPanel.classList.remove("is-open");
  lightboxCommentBtn.classList.remove("active");
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
}

// Lightbox Like Button
lightboxLikeBtn.addEventListener("click", (e) => {
  const current = photoItems[activeIndex];
  current.likes += 1;
  updateLightboxState();
  spawnFloatingHeart(e.clientX, e.clientY);
  renderGallery();
});

// Lightbox Zoom Toggle
lightboxZoomBtn.addEventListener("click", () => {
  isZoomed = !isZoomed;
  lightboxFigure.classList.toggle("is-zoomed", isZoomed);
  lightboxZoomBtn.querySelector("#lightbox-zoom-icon").textContent = isZoomed ? "➖" : "🔍";
});

// Double click on photo zooms in/out
lightboxFigure.addEventListener("dblclick", () => {
  lightboxZoomBtn.click();
});

// Lightbox Navigation
lightboxClose.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", () => showPhoto(activeIndex - 1));
lightboxNext.addEventListener("click", () => showPhoto(activeIndex + 1));

// Close on backdrop click (outside image and comments panel)
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox || e.target === lightboxFigure) {
    closeLightbox();
  }
});

// Keyboard controls
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("is-open")) return;
  // If typing in comment input, don't trigger hotkeys
  if (document.activeElement === commentInput) {
    if (e.key === "Escape") commentInput.blur();
    return;
  }
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") showPhoto(activeIndex - 1);
  if (e.key === "ArrowRight") showPhoto(activeIndex + 1);
  if (e.key === "c" || e.key === "C") lightboxCommentBtn.click();
  if (e.key === " ") {
    e.preventDefault();
    toggleSlideshow();
  }
});

// Touch Swipe Gesture on Lightbox
let touchStartX = 0;
let touchEndX = 0;

lightbox.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

lightbox.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  const diff = touchEndX - touchStartX;
  if (Math.abs(diff) > 45) {
    if (diff > 0) {
      showPhoto(activeIndex - 1);
    } else {
      showPhoto(activeIndex + 1);
    }
  }
}, { passive: true });

// ===================================================
// 7. SLIDESHOW MODE
// ===================================================
function startSlideshow() {
  isSlideshowActive = true;
  lightboxPlayIcon.textContent = "⏸";
  toolbarSlideshowBtn.classList.add("active");
  toolbarSlideshowBtn.querySelector("span:last-child").textContent = "Jeda";

  slideshowTimer = setInterval(() => {
    showPhoto(activeIndex + 1);
  }, 3200);
}

function stopSlideshow() {
  isSlideshowActive = false;
  lightboxPlayIcon.textContent = "▶";
  toolbarSlideshowBtn.classList.remove("active");
  toolbarSlideshowBtn.querySelector("span:last-child").textContent = "Slideshow";
  if (slideshowTimer) {
    clearInterval(slideshowTimer);
    slideshowTimer = null;
  }
}

function toggleSlideshow() {
  if (isSlideshowActive) {
    stopSlideshow();
  } else {
    if (!lightbox.classList.contains("is-open")) {
      openLightbox(activeIndex);
    }
    startSlideshow();
  }
}

toolbarSlideshowBtn.addEventListener("click", toggleSlideshow);
lightboxPlayBtn.addEventListener("click", toggleSlideshow);

// ===================================================
// 8. SHUFFLE PHOTOS
// ===================================================
toolbarShuffleBtn.addEventListener("click", () => {
  toolbarShuffleBtn.style.transform = "rotate(180deg)";
  setTimeout(() => { toolbarShuffleBtn.style.transform = "none"; }, 300);

  for (let i = photoItems.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [photoItems[i], photoItems[j]] = [photoItems[j], photoItems[i]];
  }

  galleryGrid.style.opacity = "0";
  setTimeout(() => {
    renderGallery();
    galleryGrid.style.opacity = "1";
    launchHeartConfetti();
  }, 200);
});

// ===================================================
// 9. SPOTIFY PLAYLIST PLAYER INTEGRATION
// Playlist: https://open.spotify.com/playlist/7eMzks9Gv2x2F3uk5p7e3s
// ===================================================
const spotifyWidget = document.getElementById("spotify-widget");
const spotifyToggleBtn = document.getElementById("spotify-toggle-btn");
const spotifyCard = document.getElementById("spotify-card");
const spotifyDismissBtn = document.getElementById("spotify-dismiss-btn");
const spotifyCardClose = document.getElementById("spotify-card-close");

function toggleSpotifyPlayer() {
  if (!spotifyCard || !spotifyWidget) return;

  // If widget was hidden, unhide it first
  if (spotifyWidget.classList.contains("is-hidden")) {
    spotifyWidget.classList.remove("is-hidden");
  }

  const isOpen = spotifyCard.classList.toggle("is-open");
  if (spotifyToggleBtn) {
    spotifyToggleBtn.classList.toggle("active", isOpen);
    spotifyToggleBtn.setAttribute("aria-expanded", String(isOpen));
  }
  if (toolbarMusicBtn) {
    toolbarMusicBtn.classList.toggle("active", isOpen);
  }

  if (isOpen) {
    launchHeartConfetti();
  }
}

if (spotifyToggleBtn) {
  spotifyToggleBtn.addEventListener("click", toggleSpotifyPlayer);
}

if (toolbarMusicBtn) {
  toolbarMusicBtn.addEventListener("click", toggleSpotifyPlayer);
}

// Close button on the open player card
if (spotifyCardClose) {
  spotifyCardClose.addEventListener("click", () => {
    spotifyCard.classList.remove("is-open");
    if (spotifyToggleBtn) spotifyToggleBtn.classList.remove("active");
    if (toolbarMusicBtn) toolbarMusicBtn.classList.remove("active");
  });
}

// Dismiss floating button completely so it doesn't obstruct the view
if (spotifyDismissBtn) {
  spotifyDismissBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    spotifyCard.classList.remove("is-open");
    if (spotifyToggleBtn) spotifyToggleBtn.classList.remove("active");
    if (toolbarMusicBtn) toolbarMusicBtn.classList.remove("active");
    spotifyWidget.classList.add("is-hidden");
  });
}

// ===================================================
// 10. INTERACTIVE PARTICLES & FLOATING HEARTS
// ===================================================
function spawnFloatingHeart(x, y) {
  const heart = document.createElement("div");
  heart.textContent = "♥";
  heart.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    font-size: 1.4rem;
    color: #c97b84;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%) scale(0.6);
    transition: transform 0.8s ease-out, opacity 0.8s ease-out;
  `;
  document.body.appendChild(heart);

  requestAnimationFrame(() => {
    const randomX = (Math.random() - 0.5) * 50;
    heart.style.transform = `translate(calc(-50% + ${randomX}px), -70px) scale(1.3)`;
    heart.style.opacity = "0";
  });

  setTimeout(() => {
    heart.remove();
  }, 850);
}

document.addEventListener("click", (e) => {
  if (!e.target.closest("button") && !e.target.closest(".gallery-card") && !e.target.closest(".lightbox") && !e.target.closest("input")) {
    spawnFloatingHeart(e.clientX, e.clientY);
  }
});

function launchHeartConfetti() {
  if (typeof confetti === "function") {
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#c97b84', '#a37d74', '#e8c2c8', '#f7f5f2', '#292623']
    });
  }
}

// Ambient Canvas Hearts
const canvas = document.getElementById("ambient-canvas");
const ctx = canvas.getContext("2d");

let ambientParticles = [];
function resizeAmbient() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeAmbient);
resizeAmbient();

class AmbientParticle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + Math.random() * 40;
    this.size = Math.random() * 8 + 6;
    this.speed = Math.random() * 0.4 + 0.2;
    this.opacity = Math.random() * 0.22 + 0.08;
    this.angle = 0;
    this.angularSpeed = Math.random() * 0.02 + 0.01;
  }
  update() {
    this.y -= this.speed;
    this.angle += this.angularSpeed;
    this.x += Math.sin(this.angle) * 0.4;
    if (this.y < -20) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = "#c97b84";
    ctx.translate(this.x, this.y);
    const d = this.size;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-d / 2, -d / 2, -d, d / 3, 0, d);
    ctx.bezierCurveTo(d, d / 3, d / 2, -d / 2, 0, 0);
    ctx.fill();
    ctx.restore();
  }
}

for (let i = 0; i < 16; i++) {
  ambientParticles.push(new AmbientParticle());
}

function animateAmbient() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ambientParticles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateAmbient);
}
animateAmbient();

// INITIALIZE
renderGallery();
