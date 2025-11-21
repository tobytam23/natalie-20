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
  let galleryImages = [];
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = lightbox.querySelector(".lightbox-close");
  const lightboxPrev = lightbox.querySelector(".prev");
  const lightboxNext = lightbox.querySelector(".next");
  const quizForm = document.getElementById("quiz-form");
  const quizQuestionsWrap = document.getElementById("quiz-questions");
  const submitQuizBtn = document.getElementById("submit-quiz");
  const quizImage = document.getElementById("quiz-image");
  const quizMessage = document.getElementById("quiz-message");
  const heartContainer = document.querySelector(".floating-hearts");
  const petalContainer = document.querySelector(".falling-petals");
  const photoContainer = document.querySelector(".photo-container");
  const fireworksCanvas = document.getElementById("fireworksCanvas");
  const ctx = fireworksCanvas.getContext("2d");
  const visualizerCanvas = document.getElementById("music-visualizer");
  const visualizerShell = document.querySelector(".visualizer-shell");
  const visualizerCtx = visualizerCanvas ? visualizerCanvas.getContext("2d") : null;
  const passwordOverlay = document.getElementById("password-overlay");
  const passwordInput = document.getElementById("password-input");
  const passwordSubmit = document.getElementById("password-submit");
  const passwordError = document.getElementById("password-error");
  const passwordPanel = passwordOverlay ? passwordOverlay.querySelector(".password-panel") : null;

  let audioCtx;
  let analyser;
  let sourceNode;
  let frequencyData;
  let visualizerAnimationId = null;
  const visualizerParticles = [];
  let siteUnlocked = false;

  const floatingHeartEmojis = ["💖", "❤️", "💘", "💗", "💕", "💝","🎂","🧁"];
  const petalEmojis = ["🌸", "🌺", "🌷", "🌼", "🌻", "💐", "🌹"];
  const photoEmojis = ["images/click/a.jpg","images/click/b.jpg","images/click/c.jpg","images/click/d.jpg"];
  const clickHeartColors = ["#ff4d88", "#f472b6", "#fb7185", "#facc15", "#34d399", "#60a5fa", "#c084fc"];
  // const clickHeartSymbols = ["❤", "💖", "💗", "💘", "💕", "💝"];
  const clickHeartSymbols = ["images/click/a.jpg", "images/click/b.jpg","images/click/c.jpg", "images/click/d.jpg"];

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
  const birthdayMonth = 10; // 11 月 -> JS 月份从 0 开始
  const birthdayDate = 24;
  const togetherStart = new Date("2025-04-05T00:00:00");

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
  const loveLetter = `亲爱的 Natalie：\n\n在这第 20 个生日，我想把所有温柔的心跳都写进这封信里。我们一起走过的日子像银河一样长，\n那些回忆在我心中闪闪发光。无论是欢笑还是小小的闹脾气，都是我们之间独一无二的情歌。\n\n愿今后的每一年，我都能陪你庆祝 11 月 24 日的生日，数着从 2025 年 4 月 5 日开始的每一份陪伴，看日出、看烟火、看漫天星河。生日快乐，我的挚爱，\n愿你永远被世界温柔以待，也被我紧紧拥抱。❤️`;
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
      letterBtn.textContent = "💌 收起信件";
      if (!letterTyped) {
        typeLetter(loveLetter);
        letterTyped = true;
      }
    } else {
      letterPanel.setAttribute("hidden", "true");
      letterBtn.textContent = "💌 打開隱藏信件";
    }
  });

  // ------------------------------ 音乐播放与切换 ------------------------------
  const playlist = [
    {
      title: "《Hold my hand》 IU",
      src: "music/Hold my hand.mp3",
    },
    {
      title: "《Blueming》 IU",
      src: "music/Blueming.mp3",
    },
    {
      title: "《Strawberry moon》 IU",
      src: "music/Strawberry moon.mp3",
    },
  ];
  let currentTrack = 0;
  let isPlaying = false;

  function ensureAudioGraph() {
    if (!visualizerCanvas) return;
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      sourceNode = audioCtx.createMediaElementSource(bgm);
      sourceNode.connect(analyser);
      analyser.connect(audioCtx.destination);
      frequencyData = new Uint8Array(analyser.frequencyBinCount);
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  }

  function startVisualizer() {
    if (!analyser || visualizerAnimationId) return;
    const render = () => {
      visualizerAnimationId = requestAnimationFrame(render);
      drawVisualizerFrame();
    };
    render();
  }

  function stopVisualizer() {
    if (visualizerAnimationId) {
      cancelAnimationFrame(visualizerAnimationId);
      visualizerAnimationId = null;
    }
    if (visualizerCtx && visualizerCanvas) {
      visualizerCtx.clearRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);
    }
  }

  function drawVisualizerFrame() {
    if (!analyser || !frequencyData || !visualizerCtx || !visualizerCanvas) return;
    analyser.getByteFrequencyData(frequencyData);
    const width = visualizerCanvas.width;
    const height = visualizerCanvas.height;
    visualizerCtx.clearRect(0, 0, width, height);

    const barCount = 48;
    const step = Math.floor(frequencyData.length / barCount);
    let total = 0;

    for (let i = 0; i < barCount; i += 1) {
      let sum = 0;
      for (let j = 0; j < step; j += 1) {
        sum += frequencyData[i * step + j] || 0;
      }
      const value = sum / step;
      total += value;
      const normalized = value / 255;
      const barHeight = normalized * height * 0.9 + 10;
      const x = (i / barCount) * width;
      const barWidth = width / barCount - 4;
      const gradient = visualizerCtx.createLinearGradient(x, height - barHeight, x, height);
      gradient.addColorStop(0, `hsla(${320 - normalized * 120}, 90%, 70%, 0.95)`);
      gradient.addColorStop(1, `rgba(255, 255, 255, 0.45)`);
      visualizerCtx.fillStyle = gradient;
      visualizerCtx.fillRect(x, height - barHeight, barWidth, barHeight);
    }

    const intensity = total / barCount / 255;
    if (visualizerShell) {
      visualizerShell.style.setProperty("--breath", (0.35 + intensity * 0.9).toFixed(3));
    }
    drawVisualizerParticles(intensity, width, height);
  }

  function drawVisualizerParticles(intensity, width, height) {
    const spawnCount = Math.ceil(intensity * 16);
    for (let i = 0; i < spawnCount; i += 1) {
      visualizerParticles.push({
        x: Math.random() * width,
        y: height + Math.random() * 30,
        size: Math.random() * 3 + 1,
        speed: (Math.random() * 0.8 + 0.4) + intensity * 2.2,
        alpha: 0.5 + intensity * 0.5,
        hue: 280 - intensity * 80 + Math.random() * 30,
      });
    }

    for (let i = visualizerParticles.length - 1; i >= 0; i -= 1) {
      const particle = visualizerParticles[i];
      particle.y -= particle.speed;
      particle.x += Math.sin(particle.y / 50) * 0.5;
      particle.alpha -= 0.008;
      if (particle.alpha <= 0 || particle.y < -20) {
        visualizerParticles.splice(i, 1);
        continue;
      }
      visualizerCtx.beginPath();
      visualizerCtx.fillStyle = `hsla(${particle.hue}, 90%, 75%, ${particle.alpha})`;
      visualizerCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      visualizerCtx.fill();
    }
  }

  function loadTrack(index, autoPlay = false) {
    const item = playlist[index];
    bgm.src = item.src;
    musicTitleEl.textContent = `當前曲目：${item.title}`;
    if (autoPlay || isPlaying) {
      ensureAudioGraph();
      bgm
        .play()
        .then(() => {
          isPlaying = true;
          playBtn.textContent = "⏸️ 暫停音樂";
        })
        .catch((error) => console.warn("Autoplay blocked:", error));
    }
  }

  loadTrack(currentTrack, false);

  playBtn.addEventListener("click", () => {
    if (bgm.paused) {
      ensureAudioGraph();
      bgm
        .play()
        .then(() => {
          isPlaying = true;
          playBtn.textContent = "⏸️ 暫停音樂";
        })
        .catch((error) => console.warn("播放失敗：", error));
    } else {
      bgm.pause();
      isPlaying = false;
      playBtn.textContent = "▶️ 播放音樂";
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

  bgm.addEventListener("play", () => {
    ensureAudioGraph();
    startVisualizer();
  });

  bgm.addEventListener("pause", () => {
    if (audioCtx && audioCtx.state === "running") {
      audioCtx.suspend();
    }
    stopVisualizer();
  });

  // ------------------------------ 白天 / 夜晚模式切换 ------------------------------
  toggleThemeBtn.addEventListener("click", () => {
    document.body.classList.toggle("night-mode");
    toggleThemeBtn.textContent = document.body.classList.contains("night-mode")
      ? "🌙 切換回白天"
      : "🌞 切換白天 / 夜晚 🌙";
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

  function resizeVisualizerCanvas() {
    if (!visualizerCanvas || !visualizerCtx) return;
    const ratio = window.devicePixelRatio || 1;
    const width = visualizerCanvas.clientWidth;
    const height = visualizerCanvas.clientHeight;
    visualizerCanvas.width = width * ratio;
    visualizerCanvas.height = height * ratio;
    visualizerCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  resizeCanvas();
  resizeVisualizerCanvas();
  window.addEventListener("resize", () => {
    resizeCanvas();
    resizeVisualizerCanvas();
  });

  let particles = [];

  function createFirework(x, y) {
    const count = 64;
    const baseColor = Math.floor(Math.random() * 360);
    for (let i = 0; i < count; i += 1) {
      const angle = (Math.PI * 2 * i) / count;
      particles.push({
        x,
        y,
        angle,
        speed: Math.random() * 4 + 4.5,
        alpha: 1,
        decay: Math.random() * 0.015 + 0.008,
        color: `hsl(${baseColor + Math.random() * 40}, 92%, 68%)`,
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
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(renderFireworks);
  }

  renderFireworks();

  function launchCelebration() {
    const width = viewWidth;
    const height = viewHeight;
    for (let i = 0; i < 7; i += 1) {
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

  // ------------------------------ 密码遮罩层 ------------------------------
  function unlockSite() {
    if (siteUnlocked) return;
    siteUnlocked = true;
    document.body.classList.remove("locked");
    if (passwordOverlay) {
      passwordOverlay.classList.add("fade-out");
      setTimeout(() => passwordOverlay.remove(), 600);
    }
    burstHearts(40);
    launchCelebration();
  }

  function handlePasswordSubmit() {
    if (!passwordInput) return;
    if (passwordInput.value.trim() === "233") {
      if (passwordError) {
        passwordError.textContent = "";
      }
      unlockSite();
    } else if (passwordError) {
      passwordError.textContent = "嗚嗚嗚嗚嗚嗚嗚~";
      if (passwordPanel) {
        passwordPanel.classList.remove("shake");
        // 强制重绘以重新触发动画
        void passwordPanel.offsetWidth;
        passwordPanel.classList.add("shake");
      }
    }
  }

  if (passwordSubmit) {
    passwordSubmit.addEventListener("click", handlePasswordSubmit);
  }

  if (passwordInput) {
    passwordInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handlePasswordSubmit();
      }
    });
    passwordInput.focus();
  }

  // ------------------------------ 飘心与落花动画 ------------------------------
  function spawnHeart() {
    const heart = document.createElement("span");
    heart.textContent = floatingHeartEmojis[Math.floor(Math.random() * floatingHeartEmojis.length)];
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.bottom = "-10vh";
    heartContainer.appendChild(heart);
    setTimeout(() => heart.remove(), 6000);
  }

  function spawnPetal() {
    const petal = document.createElement("span");
    petal.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.top = "-10vh";
    petalContainer.appendChild(petal);
    setTimeout(() => petal.remove(), 8000);
  }

  function spawnPhoto() {
    const photo = document.createElement("img");
    photo.src = photoEmojis[Math.floor(Math.random() * photoEmojis.length)];
    photo.classList.add("fall-photo");

    // 随机水平位置
    photo.style.left = `${Math.random() * 100}%`;
    photo.style.top = "-10vh";

    photoContainer.appendChild(photo);

    // 8 秒后移除
    setTimeout(() => photo.remove(), 8000);
  }

  setInterval(spawnHeart, 1800);
  setInterval(spawnPetal, 2100);
  setInterval(spawnPhoto, 1500); // 每 1.2 秒掉一张

  function burstHearts(count = 28) {
    // 连续制造多颗爱心，营造满屏心动的惊喜
    for (let i = 0; i < count; i += 1) {
      setTimeout(spawnHeart, i * 90);
    }
  }

  function createClickHearts(event) {
    if (!heartContainer) return;
    const { clientX, clientY } = event;
    const count = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i += 1) {
      const heart = document.createElement("span");
      heart.classList.add("click-heart");
      // heart.textContent = clickHeartSymbols[Math.floor(Math.random() * clickHeartSymbols.length)];
      heart.innerHTML = `<img src="${clickHeartSymbols[Math.floor(Math.random() * clickHeartSymbols.length)]}" class="click-heart-img">`;
      heart.style.left = `${clientX}px`;
      heart.style.top = `${clientY}px`;
      heart.style.color = clickHeartColors[Math.floor(Math.random() * clickHeartColors.length)];
      heart.style.fontSize = `${1.2 + Math.random() * 0.8}rem`;
      heart.style.setProperty("--dx", `${(Math.random() - 0.5) * 120}px`);
      heart.style.setProperty("--dy", `${-80 - Math.random() * 120}px`);
      heartContainer.appendChild(heart);
      setTimeout(() => heart.remove(), 1600);
    }
  }

  document.addEventListener("click", (event) => {
    if (document.body.classList.contains("locked")) return;
    createClickHearts(event);
  });

  // ------------------------------ 相册拍立得增强 ------------------------------
  function enhanceGallery() {
    const images = Array.from(gallery.querySelectorAll("img"));
    images.forEach((img) => {
      if (img.closest("figure")) return;
      const wrapper = document.createElement("figure");
      wrapper.className = "polaroid";
      wrapper.style.setProperty("--tilt", `${(Math.random() * 15 - 7.5).toFixed(2)}deg`);
      gallery.insertBefore(wrapper, img);
      wrapper.appendChild(img);
    });
    galleryImages = images;
  }

  enhanceGallery();

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
    lightboxImg.classList.add("enter");
    lightboxOpen = true;
  }

  function closeLightbox() {
    lightbox.classList.remove("show");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxOpen = false;
    setTimeout(() => (lightboxImg.src = ""), 180);
  }

  gallery.addEventListener("click", (event) => {
    const targetImg = event.target.closest("img");
    if (!targetImg || !gallery.contains(targetImg)) return;
    const index = Number(targetImg.dataset.index) || galleryImages.indexOf(targetImg);
    openLightbox(index);
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

  lightboxImg.addEventListener("animationend", () => {
    lightboxImg.classList.remove("enter");
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

  // ------------------------------ 心动值小测：五道题判断默契程度 ------------------------------
  const quizData = [
    {
      question: "我地係邊日係一齊嘅😽",
      options: ["2025 年 4 月 5 日", "2024 年 11 月 24 日", "2025 年 5 月 20 日"],
      answer: 0,
    },
    {
      question: "大豬豬就讀嘅科系係😎",
      options: ["計算機科學與技術", "女朋友需求理解與回應科學", "女朋友情緒工程學系"],
      answer: 0,
    },
    {
      question: "以下情況中，大豬豬最爆計（開心）🤯的是",
      options: ["女朋友說沒事了", "女朋友說訓吾著", "當你在激烈打機時候女朋友同你講佢訓吾著"],
      answer: 2,
    },
    {
      question: "我最喜歡嘅姿勢（唔好唸歪）",
      options: ["女上男下😏", "自拍", "和豬豬一起頭向下壓影雙下巴"],
      answer: 2,
    },
    {
      question: "(5×10+2)×105+(32+4)×102+2×(3!+1)",
      options: ["5201314🥰", "0", "1"],
      answer: 0,
    },
  ];

  function renderQuiz() {
    quizQuestionsWrap.innerHTML = "";
    quizData.forEach((item, index) => {
      const block = document.createElement("div");
      block.className = "quiz-question";
      block.setAttribute("role", "group");
      const questionId = `question-${index}`;
      block.setAttribute("aria-labelledby", questionId);

      const optionsHtml = item.options
        .map(
          (option, optionIndex) => `
              <label>
                <input type="radio" name="question-${index}" value="${optionIndex}" required />
                <span>${option}</span>
              </label>`
        )
        .join("");

      block.innerHTML = `
        <p id="${questionId}" class="quiz-question-title">Q${index + 1}. ${item.question}</p>
        <div class="quiz-options">${optionsHtml}</div>
      `;

      quizQuestionsWrap.appendChild(block);
    });
  }

  renderQuiz();

  function resetResultDisplay() {
    quizImage.hidden = true;
    quizImage.classList.remove("fade-out");
    quizImage.src = "";
    quizMessage.textContent = "";
  }

  submitQuizBtn.addEventListener("click", () => {
    if (!quizForm.checkValidity()) {
      quizForm.reportValidity();
      return;
    }

    const formData = new FormData(quizForm);
    let score = 0;
    const wrongQuestions = [];
    quizData.forEach((item, index) => {
      const choice = Number(formData.get(`question-${index}`));
      if (choice === item.answer) {
        score += 1;
      } else {
        wrongQuestions.push(index + 1);
      }
    });

    resetResultDisplay();

    // 情况 1：满分
    if (score === 5) {
      quizImage.src = "images/b.png";   // 你要的满分图
      quizMessage.textContent = "滿分！我豬豬好聰明呀 簡直就係我的靈魂伴侶！";
      quizImage.hidden = false;
      burstHearts(36);
      return;
    }

    // 情况 2：不是满分
    quizImage.src = "images/a.jpg";      // 非满分用一张统一的图
    quizImage.hidden = false;

    // 哪些题错了，用頓號连接
    const wrongList = wrongQuestions.join("、");

    quizMessage.textContent = 
      `得分是 ${score}/5，
      答错了這些題目：${wrongList}\n`;
    });
});
