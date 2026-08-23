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
      const nums = [...new Set([...cardMap.keys(), ...bgNums])].sort((a, b) => a - b);
      if (!nums.length) throw new Error("empty");
      return {
        entries: nums.map(n => ({
          cardUrl: cardMap.has(n) ? CARD + cardMap.get(n) : BGFULL + n + "_color.jpg",
          bgUrl:   bgNums.has(n) ? BGFULL + n + "_color.jpg" : null
        }))
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

  const lb    = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightboxImg");

  function openLb(i) {
    if (!BG_URLS[i]) return;
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
