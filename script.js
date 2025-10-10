// 打字机效果
(function typeWriter() {
  const text = "This little site is made just for you. 💖";
  const el = document.getElementById("type");
  let i = 0;
  function tick() {
    if (i < text.length) {
      el.textContent += text.charAt(i++);
      setTimeout(tick, 60);
    }
  }
  tick();
})();

// 按钮弹窗
document.getElementById("surprise").addEventListener("click", () => {
  alert("Happy Birthday! 🎉 You are my favorite pig 💝");
});

// 播放音乐（需用户点击触发）
const bgm = document.getElementById("bgm");
document.getElementById("play").addEventListener("click", async () => {
  try {
    await bgm.play();
  } catch (e) {
    console.warn("Autoplay blocked:", e);
  }
});

// 轻量灯箱：点击缩略图 -> 显示大图；点击遮罩 -> 关闭
const gallery = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
const lightImg = document.getElementById("lightbox-img");

gallery.addEventListener("click", (e) => {
  const target = e.target;
  if (target.tagName === "IMG") {
    lightImg.src = target.src;            
    lightbox.classList.add("show");
    lightbox.setAttribute("aria-hidden", "false");
  }
});

lightbox.addEventListener("click", () => {
  lightbox.classList.remove("show");
  lightbox.setAttribute("aria-hidden", "true");
  // 清空 src 以便移动端释放内存（可选）
  setTimeout(() => (lightImg.src = ""), 150);
});
