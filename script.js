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
      const bgNums = new Set();
      cardFiles.forEach(f => {
        if (!/\.(jpe?g|png|webp)$/i.test(f.name)) return;
        const n = numOf(f.name);
        if (!isNaN(n)) cardMap.set(n, f.name);
      });
      bgFiles.forEach(f => {
        if (!/\.(jpe?g|png|webp)$/i.test(f.name)) return;
        const n = numOf(f.name);
        if (!isNaN(n)) bgNums.add(n);
      });
      const nums = [...cardMap.keys()].filter(n => bgNums.has(n)).sort((a, b) => a - b);
      if (!nums.length) throw new Error("empty");
      return {
        cardUrls: nums.map(n => CARD + cardMap.get(n)),
        bgUrls:   nums.map(n => BGFULL + n + "_color.jpg")
      };
    } catch (e) {
      return {
        cardUrls: FALLBACK_CARDS.map(f => CARD + f),
        bgUrls:   FALLBACK_BGS.map(f => BGFULL + f)
      };
    }
  }

  const gallery = await loadGallery();
  const COUNT     = gallery.cardUrls.length;
  const CARD_URLS = gallery.cardUrls;
  const BG_URLS   = gallery.bgUrls;

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
        ["Ranah", "第六境 · 通天境 — Step 6, Alam Penembus Langit"],
        ["Dao", "时光大道 · Shíguāng Dàdào — Dao Waktu"],
        ["Era", "Zaman Kuno"],
        ["Status", "Tidak diketahui"]
      ],
      subHeading: "Tentang Step 6 — 通天境",
      subParas: [
        "Tongtian Jing (通天境) adalah ranah keenam dalam sistem kultivasi.",
        "Pada tahap ini, seorang kultivator tidak lagi hanya mengandalkan qi spiritual. Ia mulai memahami dan menyentuh hukum dunia serta Dao.",
        "Bagi Gu Xinghe, pencapaiannya pada Step 6 membuat pemahamannya terhadap Dao Waktu mampu memengaruhi aliran waktu dalam ruang terbatas. Ia dapat merasakan jejak masa lalu, melihat kemungkinan masa depan, dan menggunakan hukum waktu dalam pertarungan.",
        "Namun, ia masih belum mencapai ranah tertinggi. Step 6 adalah titik ketika seorang kultivator mulai benar-benar \u201Cmenyentuh Langit\u201D, bukan sekadar mengolah kekuatan dalam tubuhnya."
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

  const lb    = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightboxImg");

  function openLb(i) {
    lbImg.src = BG_URLS[i];
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeLb() {
    lb.classList.remove("open");
    document.body.style.overflow = "";
  }

  cards.forEach((card, i) => card.addEventListener("click", () => openLb(i)));
  document.getElementById("lbClose").addEventListener("click", closeLb);
  lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
  window.addEventListener("keydown", e => { if (e.key === "Escape") closeLb(); });

  measure();
  render();
  requestAnimationFrame(tick);
})();
