(async function () {
  const IMG_REPO = "https://api.github.com/repos/28e1o/img/contents/";
  const CARD   = "https://raw.githubusercontent.com/28e1o/img/refs/heads/main/hitam-putih/";
  const BGFULL = "https://raw.githubusercontent.com/28e1o/img/refs/heads/main/color/";

  const FALLBACK_CARDS = ["1_blackwhite.jpg", "2_blackwhite.jpg", "3_blackwhite.jpg", "4_blackwhite.jpg", "5_blackwhite.jpg"];
  const FALLBACK_BGS   = ["1_color.jpg", "2_color.jpg", "3_color.jpg", "4_color.jpg", "5_color.jpg"];

  async function fetchList(folder) {
    const res = await fetch(IMG_REPO + folder);
    if (!res.ok) throw new Error("API " + folder);
    const json = await res.json();
    return Array.isArray(json) ? json : [];
  }

  function numOf(name) {
    const m = name.match(/^(\d+)/);
    return m ? parseInt(m[1], 10) : NaN;
  }

  async function loadGallery() {
    try {
      const [cardFiles, bgFiles] = await Promise.all([
        fetchList("hitam-putih"),
        fetchList("color")
      ]);
      const cardMap = new Map();
      const bgMap   = new Map();
      cardFiles.forEach(f => {
        if (!/\.(jpe?g|png|webp)$/i.test(f.name)) return;
        const n = numOf(f.name);
        if (!isNaN(n)) cardMap.set(n, f.name);
      });
      bgFiles.forEach(f => {
        if (!/\.(jpe?g|png|webp)$/i.test(f.name)) return;
        const n = numOf(f.name);
        if (!isNaN(n)) bgMap.set(n, f.name);
      });
      const nums = [...new Set([...cardMap.keys(), ...bgMap.keys()])].sort((a, b) => a - b);
      if (!nums.length) throw new Error("empty");
      return {
        entries: nums.map(n => ({
          // Always use the real filename returned by the GitHub API for
          // each folder instead of guessing "<n>_color.jpg" — a guessed
          // name that doesn't exactly match what's actually in the color/
          // folder (different extension, casing, etc.) silently loads the
          // wrong file, which looks like a "misaligned" sketch/color pair.
          cardUrl: cardMap.has(n) ? CARD + cardMap.get(n) : (bgMap.has(n) ? BGFULL + bgMap.get(n) : null),
          bgUrl:   bgMap.has(n)   ? BGFULL + bgMap.get(n) : null
        })).filter(e => e.cardUrl)
      };
    } catch (e) {
      return {
        entries: FALLBACK_CARDS.map((f, i) => ({
          cardUrl: CARD + f,
          bgUrl:   BGFULL + FALLBACK_BGS[i]
        }))
      };
    }
  }

  const gallery   = await loadGallery();
  const COUNT     = gallery.entries.length;
  const CARD_URLS = gallery.entries.map(e => e.cardUrl);
  const BG_URLS   = gallery.entries.map(e => e.bgUrl);

  CARD_URLS.forEach(u => new Image().src = u);
  BG_URLS.forEach(u => new Image().src = u);

  const EXPLAIN = [
    {
      name: "顾星河",
      pinyin: "Gù Xīnghé",
      title: "星河公子 · Tuan Muda Sungai Bintang",
      quote: {
        cn: "时间，真是个你们的挣扎，根本好笑易。见证着真正的绝望吧。",
        id: "\u201CWaktu\u2026 perjuangan kalian ini benar-benar lucu. Saksikanlah keputusasaan yang sejati.\u201D"
      },
      paras: [
        "Seorang kultivator misterius dari Zaman Kuno yang sepanjang hidupnya menapaki Dao Waktu. Ia pernah mengembara melewati berbagai wilayah, menyaksikan pergantian zaman dan kehancuran banyak peradaban.",
        "Namanya masih tersisa dalam beberapa peninggalan kuno, namun wajah dan akhir hidupnya telah menjadi misteri. Tidak ada yang mengetahui ke mana sosok di balik legenda Gu Xinghe menghilang."
      ],
      facts: [
        ["Dunia", "玄苍界 · Xuáncāng Jiè"],
        ["Benua", "九州 · Jiǔzhōu"],
        ["Wilayah Asal", "天衡州 · Tiānhéng Zhōu"],
        ["Alamat", "星陨古地 · Xīngyǔn Gǔdì"],
        ["Ranah", "第六阶 · 通天阶 — Step 6, Heaven-Piercing Step"],
        ["Step", "通天境 · Tōngtiān Jìng — Heaven-Piercing Realm"],
        ["Dao", "时光大道 · Shíguāng Dàdào — Dao Waktu"],
        ["Era", "Zaman Kuno"],
        ["Status", "Tidak diketahui"]
      ],
      subHeading: "Tentang Step 6 — 通天阶",
      subParas: [
        "通天阶 (Tōngtiān Jiē) adalah Step keenam dalam sistem kultivasi. Pada tahap ini, seorang kultivator mulai benar-benar menyentuh hukum Langit dan memahami Dao pada tingkat yang jauh lebih tinggi.",
        "Di dalam Step 6 terdapat beberapa ranah. 通天境 (Tōngtiān Jìng) merupakan salah satu ranah di dalamnya dan menjadi tahap yang telah dicapai oleh Gù Xīnghé.",
        "Pada tingkat ini, pemahamannya terhadap 时光大道 · Shíguāng Dàdào — Dao Waktu telah mencapai tingkat yang memungkinkan dirinya memengaruhi aliran waktu dalam ruang terbatas. Ia dapat merasakan jejak masa lalu, melihat kemungkinan masa depan, dan menggunakan hukum waktu dalam pertarungan."
      ]
    },
    {
      name: "童鹤",
      pinyin: "Tóng Hè",
      title: "鹤影 · Bayangan Bangau",
      quote: {
        cn: "一纸一墨，皆可成真。若世间无真，我便以墨造真。",
        id: "\u201CSatu lembar kertas, setetes tinta, semuanya dapat menjadi nyata. Jika dunia tak memiliki kebenaran, maka akan kuciptakan kebenaran dengan tinta.\u201D"
      },
      paras: [
        "Seorang kultivator dari Zaman Kuno yang mengabdikan hidupnya pada seni lukisan dan Dao Lukisan. Tóng Hè dikenal sebagai sosok yang tenang, elegan, namun sulit ditebak. Baginya, tinta bukan sekadar alat untuk melukis, melainkan media untuk memahami hukum dunia.",
        "Konon, Tóng Hè tidak pernah melukis sesuatu tanpa alasan. Setiap goresan tintanya menyimpan makna yang hanya ia sendiri pahami. Tidak ada yang tahu apa yang sebenarnya ia lihat ketika mengangkat kuas, tetapi mereka yang pernah menyaksikan lukisannya mengatakan bahwa tinta di bawah kuasnya seolah memiliki kesadarannya sendiri.",
        "Namun setelah sebuah lukisan terakhir selesai dibuat, Tóng Hè menghilang tanpa meninggalkan jejak. Tidak ada yang mengetahui ke mana ia pergi atau apa yang sebenarnya terjadi pada dirinya."
      ],
      facts: [
        ["Dunia", "玄苍界 · Xuáncāng Jiè"],
        ["Benua", "九州 · Jiǔzhōu"],
        ["Wilayah Asal", "云墨州 · Yúnmò Zhōu"],
        ["Alamat", "墨鹤古城 · Mòhè Gǔchéng"],
        ["Ranah", "第五阶 · 破界阶 — Step 5, World-Breaking Step"],
        ["Step", "道域境 — Dao Domain Realm"],
        ["Dao", "画道 · Huà Dào — Dao Lukisan"],
        ["Era", "Zaman Kuno"],
        ["Status", "Tidak diketahui"]
      ],
      subHeading: "Tentang Step 5 — 破界阶",
      subParas: [
        "World-Breaking Step (破界阶) merupakan Step kelima dalam sistem kultivasi. Pada tahap ini, seorang kultivator mulai mampu memahami hukum dunia secara lebih mendalam dan secara bertahap memperoleh kekuatan untuk melampaui batas-batas dunia fisik.",
        "Dao Domain Realm (道域境) merupakan ranah ketiga dalam Step 5. Pada tingkat ini, seorang kultivator telah mampu membentuk Domain Dao miliknya sendiri. Di dalam domain tersebut, hukum Dao yang ia pahami dapat memengaruhi lingkungan dan lawannya.",
        "Bagi Tóng Hè, Domain Dao miliknya dikenal sebagai 墨界 · Dunia Tinta. Begitu terbuka, tinta dapat memenuhi ruang di sekitarnya dan mengubah kenyataan menjadi seperti sebuah lukisan. Setiap garis yang ia goreskan dapat berubah menjadi bilah, segel, makhluk, atau bahkan ruang kecil yang terpisah dari dunia luar."
      ]
    }
  ];

  const track   = document.getElementById("track");
  const stage   = document.getElementById("stage");
  const bgStack = document.getElementById("bgStack");
  const dotsEl  = document.getElementById("dots");
  const counter = document.getElementById("counter");

  const cards = [], bgs = [], dots = [];

  for (let i = 0; i < COUNT; i++) {
    const card = document.createElement("div");
    card.className = "card";
    const inner = document.createElement("div");
    inner.className = "card-in";
    const img = document.createElement("img");
    img.src = CARD_URLS[i];
    img.alt = "Kartu " + (i + 1);
    img.draggable = false;
    inner.appendChild(img);
    card.appendChild(inner);
    track.appendChild(card);
    cards.push(card);

    const bg = document.createElement("div");
    bg.className = "bg-layer";
    bg.style.backgroundImage = "url('" + BG_URLS[i] + "')";
    bgStack.appendChild(bg);
    bgs.push(bg);

    const dot = document.createElement("button");
    dot.className = "dot";
    dot.setAttribute("aria-label", "Ke kartu " + (i + 1));
    dotsEl.appendChild(dot);
    dots.push(dot);
  }

  let pos = 0;
  let target = 0;
  let step = 0;
  let half = 0;

  function measure() {
    if (!cards[0]) return;
    const w = cards[0].offsetWidth || cards[0].getBoundingClientRect().width;
    if (w <= 0) return;
    const gap = parseFloat(getComputedStyle(track).gap) || 48;
    step = w + gap;
    half = w / 2;
  }

  const pad = n => String(n).padStart(2, "0");

  function render() {
    track.style.transform = "translate3d(" + (-half - pos * step) + "px, -50%, 0)";

    const active = Math.round(clamp(pos, 0, COUNT - 1));

    for (let i = 0; i < COUNT; i++) {
      const d = clamp(pos - i, -1.6, 1.6);
      const a = Math.min(Math.abs(d), 1);
      cards[i].style.transform = "scale(" + (1 - a * 0.14) + ")";
      cards[i].style.opacity = String(1 - a * 0.45);
      dots[i].classList.toggle("active", i === active);
      bgs[i].style.opacity = String(clamp(pos - i + 1, 0, 1));
    }

    counter.textContent = pad(active + 1) + " / " + pad(COUNT);
    renderExplain(active);
  }

  function tick() {
    measure();
    pos += (target - pos) * 0.07;
    if (Math.abs(target - pos) < 0.0008) pos = target;
    render();
    requestAnimationFrame(tick);
  }

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  const explainBox = document.getElementById("explainBox");
  let shownCard = -1;
  let swapTimer = null;

  function h(tag, cls, text) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text != null) el.textContent = text;
    return el;
  }

  function buildExplain(entry, idx) {
    explainBox.textContent = "";
    if (!entry || entry.placeholder) {
      const ph = h("div", "placeholder");
      const ld = h("div", "loader");
      for (let k = 0; k < 3; k++) ld.appendChild(h("span"));
      ph.appendChild(ld);
      ph.appendChild(h("p", "msg", "Karakter ini belum memiliki informasi"));
      explainBox.appendChild(ph);
      return;
    }
    explainBox.appendChild(h("span", "kicker", pad(idx + 1) + " / " + pad(COUNT)));
    explainBox.appendChild(h("div", "name-cn", entry.name));
    if (entry.pinyin) explainBox.appendChild(h("div", "name-py", entry.pinyin));
    if (entry.title) explainBox.appendChild(h("div", "char-title", entry.title));
    explainBox.appendChild(h("hr", "divider"));

    if (entry.quote) {
      const q = document.createElement("blockquote");
      q.className = "quote";
      q.appendChild(h("span", "mark", "\u201C"));
      q.appendChild(h("div", "quote-cn", entry.quote.cn));
      if (entry.quote.id) q.appendChild(h("div", "quote-id", entry.quote.id));
      explainBox.appendChild(q);
    }

    const paras = h("div", "paras");
    (entry.paras || []).forEach(t => paras.appendChild(h("p", null, t)));
    explainBox.appendChild(paras);

    if (entry.facts && entry.facts.length) {
      const facts = h("div", "facts");
      entry.facts.forEach(([k, v]) => {
        const row = h("div", "fact");
        row.appendChild(h("span", "k", k));
        row.appendChild(h("span", "v", v));
        facts.appendChild(row);
      });
      explainBox.appendChild(facts);
    }

    if (entry.subHeading) {
      explainBox.appendChild(h("h3", "sub-h", entry.subHeading));
      const subParas = h("div", "paras");
      (entry.subParas || []).forEach(t => subParas.appendChild(h("p", null, t)));
      explainBox.appendChild(subParas);
    }
  }

  function renderExplain(active) {
    if (active === shownCard) return;
    shownCard = active;
    clearTimeout(swapTimer);
    explainBox.style.opacity = "0";
    swapTimer = setTimeout(() => {
      buildExplain(EXPLAIN[active], active);
      requestAnimationFrame(() => { explainBox.style.opacity = "1"; });
    }, 200);
  }

  document.getElementById("prev").addEventListener("click", () => { target = clamp(target - 1, 0, COUNT - 1); });
  document.getElementById("next").addEventListener("click", () => { target = clamp(target + 1, 0, COUNT - 1); });
  window.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft")  target = clamp(target - 1, 0, COUNT - 1);
    if (e.key === "ArrowRight") target = clamp(target + 1, 0, COUNT - 1);
  });

  dots.forEach((d, i) => d.addEventListener("click", () => { target = i; }));

  const lb        = document.getElementById("lightbox");
  const lbCardBox = document.getElementById("lbCardIn");
  const lbColor   = document.getElementById("lbColorImg");
  const lbHint    = document.getElementById("lbHint");

  const scratchCv    = [];
  const scratchCtx   = [];
  const scratchInit  = [];
  const scratchedFlg = [];
  const scratchBw    = [];
  const scratchDpr   = [];
  const scratchReady = [];

  let openIdx = -1;
  let cv = null, cx = null;
  let brush = 32;
  let drawing = false;
  let lx = 0, ly = 0;
  let cardAnimDone = false;

  function drawCover(c, img, W, H) {
    const ir = img.naturalWidth / img.naturalHeight;
    const cr = W / H;
    let w, h;
    if (ir > cr) { h = H; w = H * ir; } else { w = W; h = W / ir; }
    c.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
  }

  function pointerPos(c, i, e) {
    const r  = c.getBoundingClientRect();
    const kx = r.width  ? c.width  / r.width  : 1;
    const ky = r.height ? c.height / r.height : 1;
    const d  = scratchDpr[i] || 1;
    return [(e.clientX - r.left) * kx / d, (e.clientY - r.top) * ky / d];
  }

  function ensureCanvas(i) {
    if (scratchCv[i]) return;
    const c = document.createElement("canvas");
    c.className = "scratch-canvas";
    lbCardBox.insertBefore(c, lbHint);

    c.addEventListener("pointerdown", e => {
      // Guard: ignore taps that land before the sketch image has finished
      // loading and the canvas has been sized to match the card. Drawing
      // onto an unsized canvas (default 300x150) scales/skews strokes
      // relative to the real artwork, which is what caused scratches to
      // land in the wrong spot.
      if (!scratchReady[i] || !cardAnimDone) return;
      e.preventDefault();
      drawing = true;
      c.setPointerCapture(e.pointerId);
      [lx, ly] = pointerPos(c, i, e);
      strokeTo(lx, ly, lx, ly, true);
      scratchedFlg[i] = true;
      lbHint.classList.add("hide");
    });
    c.addEventListener("pointermove", e => {
      if (!drawing || !scratchReady[i]) return;
      const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
      for (const ev of evs) {
        const [x, y] = pointerPos(c, i, ev);
        strokeTo(lx, ly, x, y, false);
        lx = x; ly = y;
      }
    });
    ["pointerup", "pointercancel"].forEach(ev =>
      c.addEventListener(ev, () => { drawing = false; })
    );

    scratchCv[i]  = c;
    scratchCtx[i] = c.getContext("2d");
  }

  function initScratchLayer(i) {
    const c   = scratchCv[i];
    const ctx = scratchCtx[i];
    const bw  = scratchBw[i];
    if (!c || !bw || !bw.complete || !bw.naturalWidth) return false;
    const w   = lbCardBox.clientWidth;
    const hgt = lbCardBox.clientHeight;
    if (!w || !hgt) return false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width  = Math.round(w * dpr);
    c.height = Math.round(hgt * dpr);
    scratchDpr[i] = dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, w, hgt);
    drawCover(ctx, bw, w, hgt);
    brush = Math.max(24, Math.min(56, Math.min(w, hgt) * 0.08));
    scratchInit[i]   = true;
    scratchedFlg[i]  = false;
    return true;
  }

  function layerMatchesSize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    return cv.width === Math.round(lbCardBox.clientWidth * dpr) &&
           cv.height === Math.round(lbCardBox.clientHeight * dpr);
  }

  // Re-fit an already-drawn scratch layer to a new box size without wiping
  // out the player's progress. The lightbox card keeps a fixed aspect ratio
  // (width is derived from height via calc()), so a uniform rescale of the
  // existing bitmap is safe and won't distort it. This covers cases like a
  // mobile browser's address bar hiding/showing (changes svh mid-session)
  // or rotating the device while the lightbox is open.
  function resyncScratchLayer(i) {
    const c   = scratchCv[i];
    const ctx = scratchCtx[i];
    if (!c || !ctx || !scratchInit[i]) return;
    const w   = lbCardBox.clientWidth;
    const hgt = lbCardBox.clientHeight;
    if (!w || !hgt) return;
    const dpr  = Math.min(window.devicePixelRatio || 1, 2);
    const newW = Math.round(w * dpr);
    const newH = Math.round(hgt * dpr);
    if (c.width === newW && c.height === newH) return;

    const snapshot = document.createElement("canvas");
    snapshot.width  = c.width;
    snapshot.height = c.height;
    snapshot.getContext("2d").drawImage(c, 0, 0);

    c.width  = newW;
    c.height = newH;
    scratchDpr[i] = dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, w, hgt);
    ctx.drawImage(snapshot, 0, 0, w, hgt);
    brush = Math.max(24, Math.min(56, Math.min(w, hgt) * 0.08));
  }

  function strokeTo(x0, y0, x1, y1, dot) {
    if (!cx) return;
    cx.globalCompositeOperation = "destination-out";
    cx.strokeStyle = "#000";
    cx.fillStyle   = "#000";
    cx.lineWidth   = brush;
    cx.lineCap     = "round";
    cx.lineJoin    = "round";
    if (dot) {
      cx.beginPath();
      cx.arc(x0, y0, brush / 2, 0, Math.PI * 2);
      cx.fill();
      return;
    }
    cx.beginPath();
    cx.moveTo(x0, y0);
    cx.lineTo(x1, y1);
    cx.stroke();
  }

  function mountCanvas(i) {
    lbCardBox.querySelectorAll(".scratch-canvas").forEach(el => el.remove());
    if (scratchCv[i]) lbCardBox.insertBefore(scratchCv[i], lbHint);
  }

  function prepareScratch(i) {
    scratchReady[i] = false;
    const bw = new Image();
    bw.onload = () => {
      if (openIdx !== i) return;
      scratchBw[i] = bw;
      if (!scratchInit[i]) {
        initScratchLayer(i);
      } else if (!layerMatchesSize()) {
        // Size changed since this card was last scratched (e.g. viewport
        // shifted while it was closed) — rescale instead of wiping progress.
        resyncScratchLayer(i);
      } else {
        const w   = lbCardBox.clientWidth;
        const hgt = lbCardBox.clientHeight;
        brush = Math.max(24, Math.min(56, Math.min(w, hgt) * 0.08));
      }
      scratchReady[i] = true;
    };
    bw.src = CARD_URLS[i];
  }

  function openLb(i) {
    openIdx = i;
    cv = null; cx = null; drawing = false;
    cardAnimDone = false;
    lbColor.src = BG_URLS[i] || CARD_URLS[i];
    ensureCanvas(i);
    mountCanvas(i);
    cv = scratchCv[i];
    cx = scratchCtx[i];
    prepareScratch(i);
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      if (openIdx === i) lbHint.classList.toggle("hide", !!scratchedFlg[i]);
    }, 400);
    // Fallback in case transitionend never fires (reduced-motion, tab
    // backgrounded during the animation, etc.).
    setTimeout(() => { if (openIdx === i) cardAnimDone = true; }, ANIM_MS + 80);
  }
  function closeLb() {
    openIdx = -1;
    cv = null; cx = null;
    lb.classList.remove("open");
    document.body.style.overflow = "";
  }

  const lbCardEl = document.querySelector(".lb-card");
  lbCardEl.addEventListener("transitionend", e => {
    // The card scales in from 0.8 -> 1 on open. getBoundingClientRect()
    // (used to map touch position -> canvas pixels) reflects that live
    // transform, so a scratch started mid-animation was measured against
    // the wrong box size. Wait for the transform transition to finish
    // before allowing strokes.
    if (e.propertyName === "transform" && lb.classList.contains("open")) {
      cardAnimDone = true;
    }
  });
  // Fallback in case transitionend doesn't fire (e.g. reduced-motion).
  const ANIM_MS = 350;

  // Keep the scratch canvas matched to the card's on-screen size while the
  // lightbox is open (mobile browsers can change viewport height — e.g. an
  // address bar hiding on scroll — independent of user action).
  if (window.ResizeObserver) {
    new ResizeObserver(() => {
      if (openIdx >= 0) resyncScratchLayer(openIdx);
    }).observe(lbCardBox);
  } else {
    window.addEventListener("resize", () => {
      if (openIdx >= 0) resyncScratchLayer(openIdx);
    });
  }

  cards.forEach((card, i) => card.addEventListener("click", () => openLb(i)));
  document.getElementById("lbClose").addEventListener("click", closeLb);
  document.getElementById("lbReset").addEventListener("click", () => {
    if (openIdx < 0) return;
    if (initScratchLayer(openIdx)) lbHint.classList.remove("hide");
  });
  lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
  window.addEventListener("keydown", e => {
    if (e.key === "Escape" && lb.classList.contains("open")) closeLb();
  });

  measure();
  render();
  requestAnimationFrame(tick);
})();
