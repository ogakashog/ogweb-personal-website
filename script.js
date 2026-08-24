const slides = document.querySelectorAll(".slide");
let current = 0;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove("active");
    if (i === index) slide.classList.add("active");
  });
}

document.querySelector(".prev").addEventListener("click", () => {
  current = (current - 1 + slides.length) % slides.length;
  showSlide(current);
});

document.querySelector(".next").addEventListener("click", () => {
  current = (current + 1) % slides.length;
  showSlide(current);
});

// Auto-play every 5s
setInterval(() => {
  current = (current + 1) % slides.length;
  showSlide(current);
}, 5000);
const music = document.getElementById("bg-music");
const musicBtn = document.getElementById("music-btn");

musicBtn.addEventListener("click", () => {
  if (music.paused) {
    music.play();
    musicBtn.textContent = "🔊 ";
  } else {
    music.pause();
    musicBtn.textContent = "🔇 ";
  }
});
