// ------------------------------ 页面初始化与 DOM 引用 ------------------------------
document.addEventListener("DOMContentLoaded", () => {
  // 基础元素引用，方便后续多处调用
  const typeEl = document.getElementById("type");
  const toggleThemeBtn = document.getElementById("toggle-theme");
  const countdownEl = document.getElementById("countdown");
  const togetherEl = document.getElementById("together-days");
  const letterBtn = document.getElementById("toggle-letter");
  const letterPanel = document.getElementById("secret-letter");
  const letterTextEl = document.getElementById("letter-text");
  const surpriseBtn = document.getElementById("surprise");
  const playBtn = document.getElementById("play");
  const nextMusicBtn = document.getElementById("next-music");
  const musicTitleEl = document.getElementById("music-title");
  const bgm = document.getElementById("bgm");
  const gallery = document.getElementById("gallery");
  const galleryImages = Array.from(gallery.querySelectorAll("img"));
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = lightbox.querySelector(".lightbox-close");
  const lightboxPrev = lightbox.querySelector(".prev");
  const lightboxNext = lightbox.querySelector(".next");
  const downloadBtn = document.getElementById("download-photo");
  const shareBtn = document.getElementById("share-blessing");
  const heartContainer = document.querySelector(".floating-hearts");
  const petalContainer = document.querySelector(".falling-petals");
  const fireworksCanvas = document.getElementById("fireworksCanvas");
  const ctx = fireworksCanvas.getContext("2d");

  // ------------------------------ 打字机效果：营造情感氛围 ------------------------------
  const headerMessage = "This little site is made just for you. 💖";
  let typeIndex = 0;
  const typeInterval = setInterval(() => {
    typeEl.textContent += headerMessage.charAt(typeIndex);
    typeIndex += 1;
    if (typeIndex >= headerMessage.length) {
      clearInterval(typeInterval);
    }
  }, 60);

  // ------------------------------ 倒计时与纪念日计算 ------------------------------
  // 生日日期：若当年已过，则自动计算下一年
  const birthdayMonth = 4; // 五月 -> JS 月份从 0 开始
  const birthdayDate = 20;
  const togetherStart = new Date("2021-09-01T00:00:00");

  function updateTimeBoard() {
    const now = new Date();
    let birthday = new Date(now.getFullYear(), birthdayMonth, birthdayDate, 0, 0, 0);
    if (birthday.getTime() < now.getTime()) {
      birthday = new Date(now.getFullYear() + 1, birthdayMonth, birthdayDate, 0, 0, 0);
    }

    const diffMs = birthday.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    const diffMinutes = Math.floor((diffMs / (1000 * 60)) % 60);
    const diffSeconds = Math.floor((diffMs / 1000) % 60);

    countdownEl.textContent = `${diffDays} 天 ${diffHours.toString().padStart(2, "0")} 小时 ${diffMinutes
      .toString()
      .padStart(2, "0")} 分 ${diffSeconds.toString().padStart(2, "0")} 秒`;

    const togetherMs = now.getTime() - togetherStart.getTime();
    const togetherDays = Math.floor(togetherMs / (1000 * 60 * 60 * 24));
    togetherEl.textContent = `${togetherDays} 天，也就是 ${Math.floor(togetherDays / 30)} 个月又 ${
      togetherDays % 30
    } 天`;
  }

  updateTimeBoard();
  setInterval(updateTimeBoard, 1000);

  // ------------------------------ 隐藏信件与打字显示情书 ------------------------------
  const loveLetter = `亲爱的 Natalie：\n\n在这第 20 个生日，我想把所有温柔的心跳都写进这封信里。我们一起走过的日子像银河一样长，\n那些回忆在我心中闪闪发光。无论是欢笑还是小小的闹脾气，都是我们之间独一无二的情歌。\n\n愿今后的每一年，我都能陪你看日出、看烟火、看漫天星河。生日快乐，我的挚爱，\n愿你永远被世界温柔以待，也被我紧紧拥抱。❤️`;
  let letterTyped = false;

  function typeLetter(text) {
    letterTextEl.textContent = "";
    let idx = 0;
    const render = () => {
      letterTextEl.textContent = text.slice(0, idx);
      idx += 1;
      if (idx <= text.length) {
        setTimeout(render, 26);
      }
    };
    render();
  }

  letterBtn.addEventListener("click", () => {
    const hidden = letterPanel.hasAttribute("hidden");
    if (hidden) {
      letterPanel.removeAttribute("hidden");
      letterBtn.textContent = "💌 收起情书";
      if (!letterTyped) {
        typeLetter(loveLetter);
        letterTyped = true;
      }
    } else {
      letterPanel.setAttribute("hidden", "true");
      letterBtn.textContent = "💌 打开隐藏信件";
    }
  });

  // ------------------------------ 音乐播放与切换 ------------------------------
  const playlist = [
    {
      title: "《Light》 温柔钢琴",
      src: "music/music.mp3",
    },
    {
      title: "《Starry Love》 星空慢舞",
      src: "https://cdn.pixabay.com/download/audio/2022/10/19/audio_0f9f1a5d78.mp3?filename=romantic-ambient-118766.mp3",
    },
  ];
  let currentTrack = 0;
  let isPlaying = false;

  function loadTrack(index, autoPlay = false) {
    const item = playlist[index];
    bgm.src = item.src;
    musicTitleEl.textContent = `当前曲目：${item.title}`;
    if (autoPlay || isPlaying) {
      bgm
        .play()
        .then(() => {
          isPlaying = true;
          playBtn.textContent = "⏸️ 暂停音乐";
        })
        .catch((error) => console.warn("Autoplay blocked:", error));
    }
  }

  loadTrack(currentTrack, false);

  playBtn.addEventListener("click", () => {
    if (bgm.paused) {
      bgm
        .play()
        .then(() => {
          isPlaying = true;
          playBtn.textContent = "⏸️ 暂停音乐";
        })
        .catch((error) => console.warn("播放失败：", error));
    } else {
      bgm.pause();
      isPlaying = false;
      playBtn.textContent = "▶️ 播放音乐";
    }
  });

  nextMusicBtn.addEventListener("click", () => {
    currentTrack = (currentTrack + 1) % playlist.length;
    loadTrack(currentTrack, true);
  });

  bgm.addEventListener("ended", () => {
    // 自动播放下一曲，营造连贯体验
    currentTrack = (currentTrack + 1) % playlist.length;
    loadTrack(currentTrack, true);
  });

  // ------------------------------ 白天 / 夜晚模式切换 ------------------------------
  toggleThemeBtn.addEventListener("click", () => {
    document.body.classList.toggle("night-mode");
    toggleThemeBtn.textContent = document.body.classList.contains("night-mode")
      ? "🌙 切换回白天"
      : "🌞 切换白天 / 夜晚 🌙";
  });

  // ------------------------------ 烟花动画（Canvas） ------------------------------
  let viewWidth = window.innerWidth;
  let viewHeight = window.innerHeight;

  function resizeCanvas() {
    const ratio = window.devicePixelRatio || 1;
    viewWidth = window.innerWidth;
    viewHeight = window.innerHeight;
    fireworksCanvas.width = viewWidth * ratio;
    fireworksCanvas.height = viewHeight * ratio;
    fireworksCanvas.style.width = `${viewWidth}px`;
    fireworksCanvas.style.height = `${viewHeight}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  let particles = [];

  function createFirework(x, y) {
    const count = 36;
    const baseColor = Math.floor(Math.random() * 360);
    for (let i = 0; i < count; i += 1) {
      const angle = (Math.PI * 2 * i) / count;
      particles.push({
        x,
        y,
        angle,
        speed: Math.random() * 4 + 2,
        alpha: 1,
        decay: Math.random() * 0.02 + 0.01,
        color: `hsl(${baseColor + Math.random() * 40}, 80%, 60%)`,
      });
    }
  }

  function renderFireworks() {
    ctx.clearRect(0, 0, viewWidth, viewHeight);
    particles = particles.filter((p) => p.alpha > 0);
    particles.forEach((p) => {
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed + 0.5; // 模拟重力
      p.speed *= 0.96;
      p.alpha -= p.decay;

      ctx.globalAlpha = Math.max(p.alpha, 0);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(renderFireworks);
  }

  renderFireworks();

  function launchCelebration() {
    const width = viewWidth;
    const height = viewHeight;
    for (let i = 0; i < 4; i += 1) {
      setTimeout(() => {
        const x = Math.random() * width;
        const y = Math.random() * (height * 0.6);
        createFirework(x, y);
        spawnHeart();
        spawnPetal();
      }, i * 220);
    }
  }

  surpriseBtn.addEventListener("click", launchCelebration);

  // ------------------------------ 飘心与落花动画 ------------------------------
  function spawnHeart() {
    const heart = document.createElement("span");
    heart.textContent = Math.random() > 0.5 ? "💖" : "❤️";
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.bottom = "-10vh";
    heartContainer.appendChild(heart);
    setTimeout(() => heart.remove(), 6000);
  }

  function spawnPetal() {
    const petal = document.createElement("span");
    petal.textContent = Math.random() > 0.5 ? "🌸" : "🌺";
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.top = "-10vh";
    petalContainer.appendChild(petal);
    setTimeout(() => petal.remove(), 8000);
  }

  setInterval(spawnHeart, 1800);
  setInterval(spawnPetal, 2200);

  // ------------------------------ 灯箱：支持左右切换 ------------------------------
  let currentIndex = 0;
  let lightboxOpen = false;

  function showImage(index) {
    const img = galleryImages[index];
    if (!img) return;
    currentIndex = index;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
  }

  function openLightbox(index) {
    showImage(index);
    lightbox.classList.add("show");
    lightbox.setAttribute("aria-hidden", "false");
    lightboxOpen = true;
  }

  function closeLightbox() {
    lightbox.classList.remove("show");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxOpen = false;
    setTimeout(() => (lightboxImg.src = ""), 180);
  }

  gallery.addEventListener("click", (event) => {
    const target = event.target;
    if (target.tagName === "IMG") {
      const index = Number(target.dataset.index) || galleryImages.indexOf(target);
      openLightbox(index);
    }
  });

  lightboxPrev.addEventListener("click", (event) => {
    event.stopPropagation();
    const nextIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    showImage(nextIndex);
  });

  lightboxNext.addEventListener("click", (event) => {
    event.stopPropagation();
    const nextIndex = (currentIndex + 1) % galleryImages.length;
    showImage(nextIndex);
  });

  lightboxClose.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!lightboxOpen) return;
    if (event.key === "Escape") {
      closeLightbox();
    } else if (event.key === "ArrowLeft") {
      lightboxPrev.click();
    } else if (event.key === "ArrowRight") {
      lightboxNext.click();
    }
  });

  // ------------------------------ 下载照片与分享祝福 ------------------------------
  downloadBtn.addEventListener("click", () => {
    const targetImg = lightboxOpen ? lightboxImg : galleryImages[currentIndex] || galleryImages[0];
    if (!targetImg || !targetImg.src) return;
    const link = document.createElement("a");
    link.href = targetImg.src;
    link.download = `natalie-memory-${currentIndex + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  });

  shareBtn.addEventListener("click", async () => {
    const shareData = {
      title: "Happy 20th Birthday Natalie",
      text: "和我一起为 Natalie 送上最甜蜜的祝福吧！",
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        alert("链接已复制，快去分享给朋友吧！");
      } else {
        prompt("复制下面的祝福链接与文字：", `${shareData.text} ${shareData.url}`);
      }
    } catch (error) {
      console.warn("分享被取消：", error);
    }
  });
});
