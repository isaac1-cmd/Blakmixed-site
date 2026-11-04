/* ==================================================================
   BLAKMIXED ENTERTAINMENT: site script
   Edit your website content in the DATA block below.
================================================================== */
const DATA = {
  whatsapp: "2348136669773",

  // "View Our Work" on the Book Us pop-up: each service goes to its own place.
  // Media and Events open a link. Fashion shows a photo gallery: add your picture file names to images.
  work: {
    Media:   { url: "https://tiktok.com/@blakmixed_ent",    label: "Watch on TikTok" },
    Events:  { url: "https://instagram.com/blakmixed_ent",  label: "See on Instagram" },
    Fashion: { images: [], label: "View photos" }   // e.g. images: ["fashion-1.webp", "fashion-2.webp"]
  },

  // RATE CARDS: edit names, prices and descriptions here. category must be exactly "Media", "Events" or "Fashion".
  // When someone taps a package, WhatsApp opens with that package already written in the message.
  rateCards: [
    { category: "Media", name: "Basic Package", price: "₦100,000", desc: "2 reels • 100 pictures • 1 full coverage video" },
    { category: "Media", name: "Standard Package", price: "₦300,000", desc: "4 reels • 300 pictures • 1 standard video edit" },
    { category: "Media", name: "Premium Package", price: "₦1,000,000", desc: "Full coverage with our full team • Full video and picture production" },
    { category: "Media", name: "Studio Photoshoot", price: "₦50,000", desc: "5 clean edited pictures • 3 different outfits" },
    { category: "Media", name: "Single Picture", price: "₦10,000", desc: "Simple, plain background. Priced per picture." },
    { category: "Media", name: "Content Creation", price: "From ₦30,000", desc: "Starting rate. Each content costs ₦30,000." },
    { category: "Events", name: "Birthday Party", price: "₦200,000", desc: "Birthday party planned and hosted for you." },
    { category: "Events", name: "Wedding Event", price: "₦1,000,000", desc: "Wedding event services." },
    { category: "Events", name: "Club Party Hosting", price: "₦300,000 – ₦500,000", desc: "Hosting of club parties." },
    { category: "Events", name: "House Party Hosting", price: "₦500,000 – ₦1,000,000", desc: "Hosting of house parties." },
    { category: "Events", name: "Outdoor Rave Hosting", price: "₦1,000,000 – ₦5,000,000", desc: "Hosting of outdoor raves." },
    { category: "Fashion", name: "Basic Package", price: "₦00,000", desc: "Describe what is included in this package." },
    { category: "Fashion", name: "Standard Package", price: "₦00,000", desc: "Describe what is included in this package." },
    { category: "Fashion", name: "Premium Package", price: "₦00,000", desc: "Describe what is included in this package." }
  ],

  ads: [
    ["CHILL OUT • 2 DAYS HOUSE PARTY • 3RD DEC", "#upcoming"],
    ["TICKETS • PARTNERSHIPS • VENDOR SPACE", "#upcoming"],
    ["BLAKMIXED ENTERTAINMENT • MEDIA • EVENTS • FASHION", "#services"]
  ],
  aboutGallery: ["asset-24.webp", "image-3.webp", "event-127.webp", "asset-26.webp", "asset-21.webp", "event-1.webp", "event-3.webp", "asset-8.webp"],
  pastEvents: [
    { title: "BOOKS CLOSED", category: "#Party as a Graduate", date: "PAST EVENT", image: "books-closed.webp", pos: "center 12%", desc: "A graduates' party at De Boombox Club, Uniport. Energy, style and unforgettable moments." },
    { title: "NightLifer", category: "All Black Affair", date: "PAST EVENT", image: "nightlifer.webp", desc: "A nightlife experience built around energy, style and unforgettable moments." },
    { title: "Wave of Romance", category: "Entertainment", date: "PAST EVENT", image: "wave-of-romance.webp", desc: "Music, people and atmosphere brought together under one roof." },
    { title: "D'BOLD STEP", category: "Events & Culture", date: "PAST EVENT", image: "bold-step.webp", desc: "A creative experience connecting entertainment and culture." }
  ],
  upcoming: {
    title: "CHILL OUT",
    tag: "2 DAYS HOUSE PARTY",
    desc: "Two days. One house. Pure good vibes. Chill Out is a laid-back house party made for good music, good food, good company and zero stress. Come with your people, unwind, dance, meet new faces and make memories that last well beyond the weekend.",
    date: "3RD - 4TH DEC 2026",
    // Countdown target (Nigeria time, WAT = +01:00). Change the time here if the party starts later in the day.
    eventISO: "2026-12-03T00:00:00+01:00",
    location: "PORT HARCOURT, NIGERIA (VENUE REVEALED TO TICKET HOLDERS)",
    // When your flyer is ready, save it in this folder with THIS exact name. No code change needed.
    image: "chill-out.jpeg"
  },
  gallery: ["asset-24.webp", "asset-23.webp", "event-127.webp", "asset-26.webp", "asset-28.webp", "image-2.webp", "event-3.webp", "image-4.webp", "event-2.webp", "event-57.webp", "event-68.webp", "okay.webp", "asset-16.webp", "part.webp", "asset-27.webp", "image-1.webp"]
};

const $ = (id) => document.getElementById(id);
// Opens WhatsApp with a ready-written message
const waLink = (text) => `https://wa.me/${DATA.whatsapp}?text=${encodeURIComponent(text)}`;
const vendorMessage = () =>
  `Hello, my name is [your name]. I would like to make an enquiry about the vendor space for ${DATA.upcoming.title.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())} (${DATA.upcoming.date.replace("3RD - 4TH DEC 2026", "3rd - 4th December 2026")}). What I'd like to bring: [your product/service].`;
const naira = (n) => "₦" + Number(n).toLocaleString("en-NG");

/* ---------- Page content ---------- */
function render() {
  $("adTrack").innerHTML = [...DATA.ads, ...DATA.ads].map((x) => `<a href="${x[1]}">${x[0]}</a>`).join("");
  $("aboutGallery").innerHTML = DATA.aboutGallery.map((x) => `<img src="${x}" alt="BLAKMIXED event moment" loading="lazy" decoding="async">`).join("");
  $("pastEvents").innerHTML = DATA.pastEvents.map((e) =>
    `<article class="event"><div class="eventimg" style="background-image:url('${e.image}');background-position:${e.pos || "center"}"></div><div class="eventinfo"><small>${e.date}</small><h3>${e.title}</h3><p>${e.category}: ${e.desc}</p></div></article>`
  ).join("");
  const u = DATA.upcoming;
  $("upTitle").textContent = u.title;
  $("upDesc").textContent = u.desc;
  $("upTag").textContent = u.tag;
  $("cdTitle").textContent = `Countdown to ${u.title.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}`;
  $("upDate").textContent = u.date;
  $("upLocation").textContent = u.location;
  // Show the flyer if the file exists, otherwise a "coming soon" placeholder.
  const probe = new Image();
  probe.onload = () => { $("upImage").style.backgroundImage = `url('${u.image}')`; };
  probe.onerror = () => { $("upImage").classList.add("placeholder"); $("upImage").innerHTML = "<span>FLYER<br>COMING SOON</span>"; };
  probe.src = u.image;
  $("album").innerHTML = DATA.gallery.map((x) => `<img src="${x}" alt="BLAKMIXED archive photo" loading="lazy" decoding="async">`).join("");
  const vl = $("vendorLink");
  vl.href = waLink(vendorMessage()); vl.target = "_blank"; vl.rel = "noopener noreferrer";
  $("year").textContent = new Date().getFullYear();
}

/* ---------- Countdown ---------- */
function startCountdown() {
  const target = new Date(DATA.upcoming.eventISO).getTime();
  const box = $("countdown");
  const pad = (n) => String(n).padStart(2, "0");
  const tick = () => {
    const d = target - Date.now();
    if (d <= 0) {
      clearInterval(timer);
      box.innerHTML = "<h3 class=\"countdown-done\">The countdown has ended. Follow us for the next date!</h3>";
      return;
    }
    $("days").textContent = pad(Math.floor(d / 864e5));
    $("hours").textContent = pad(Math.floor((d % 864e5) / 36e5));
    $("minutes").textContent = pad(Math.floor((d % 36e5) / 6e4));
    $("seconds").textContent = pad(Math.floor((d % 6e4) / 1e3));
  };
  const timer = setInterval(tick, 1000);
  tick();
}

/* ---------- Modals ---------- */
function openModal(el) { el.classList.add("open"); document.body.style.overflow = "hidden"; }
function closeModal(el) { el.classList.remove("open"); if (!document.querySelector(".modal.open")) document.body.style.overflow = ""; }
document.querySelectorAll(".modal").forEach((m) => {
  m.addEventListener("click", (e) => { if (e.target === m || e.target.closest("[data-close],#close")) closeModal(m); });
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape") document.querySelectorAll(".modal.open").forEach(closeModal); });

/* ---------- Mobile menu ---------- */
const nav = $("nav"), burger = $("hamburger");
function setMenu(open) { nav.classList.toggle("open", open); burger.setAttribute("aria-expanded", open); burger.textContent = open ? "✕" : "☰"; }
burger.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });

/* ---------- Forms (Formspree) ---------- */
async function sendForm(form, okMsg) {
  const status = form.querySelector(".formstatus"), btn = form.querySelector("button[type=submit]");
  const label = btn.textContent;
  btn.disabled = true; btn.textContent = "Sending…"; status.className = "formstatus"; status.textContent = "";
  try {
    const r = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
    if (!r.ok) throw new Error();
    form.reset();
    status.className = "formstatus ok"; status.textContent = okMsg;
  } catch {
    status.className = "formstatus error"; status.textContent = "Something went wrong. Please try again or message us on WhatsApp.";
  } finally {
    btn.disabled = false; btn.textContent = label;
  }
}
$("contactForm").addEventListener("submit", (e) => { e.preventDefault(); sendForm(e.currentTarget, "Message sent. We'll get back to you soon."); });
$("joinForm").addEventListener("submit", (e) => { e.preventDefault(); sendForm(e.currentTarget, "Submitted. We'll be in touch."); });
document.querySelectorAll(".joinlist button").forEach((b) => b.addEventListener("click", () => {
  if (b.dataset.role === "Vendor") { window.open(waLink(vendorMessage()), "_blank", "noopener"); return; }
  $("role").value = b.dataset.role;
  $("modalTitle").textContent = b.dataset.role === "Contact" ? "Let's connect." : `Join as a ${b.dataset.role}.`;
  $("joinForm").querySelector(".formstatus").textContent = "";
  openModal($("modal"));
}));

/* ---------- Tickets & Paystack ---------- */
const tm = $("ticketModal");
let tickets = [], selected = null, loaded = false;

function showStep(step) {
  $("stepChoose").hidden = step !== "choose";
  $("stepDetails").hidden = step !== "details";
  tm.querySelector(".modalbox").scrollTop = 0;
}

async function loadTickets() {
  if (loaded) return;
  try {
    const r = await fetch("/api/tickets");
    if (!r.ok) throw new Error();
    const d = await r.json();
    tickets = d.tickets;
    $("ticketEvent").textContent = `${d.event.name} • ${d.event.date} • ${d.event.venue}`;
    $("tdEvent").textContent = d.event.name.toUpperCase();
    $("ticketList").innerHTML = "";
    tickets.forEach((t) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "ticketopt" + (t.id === "vip" ? " vip" : "");
      b.innerHTML = `<span><b></b><small></small></span><span class="price"></span>`;
      b.querySelector("b").textContent = t.name;
      b.querySelector("small").textContent = t.tagline;
      b.querySelector(".price").textContent = naira(t.price);
      b.addEventListener("click", () => selectTicket(t));
      $("ticketList").appendChild(b);
    });
    loaded = true;
  } catch {
    const local = location.protocol === "file:";
    $("ticketList").innerHTML = `<p class="formstatus error">${local
      ? "Tickets only work on your live website, not when this page is opened from your computer. Open your Vercel link to test them."
      : "Tickets are unavailable right now. Please try again shortly or message us on WhatsApp."}</p>`;
  }
}

function selectTicket(t) {
  selected = t;
  $("tdName").textContent = `${t.name} Ticket`;
  $("tdPrice").textContent = naira(t.price);
  $("tdDesc").textContent = t.description;
  $("tdIncludes").innerHTML = "";
  t.includes.forEach((i) => { const li = document.createElement("li"); li.textContent = i; $("tdIncludes").appendChild(li); });
  $("ticketStatus").textContent = ""; $("ticketStatus").className = "formstatus";
  $("payBtn").textContent = `Pay Now ${naira(t.price)}`;
  showStep("details");
}

function openTickets(e) {
  if (e) e.preventDefault();
  showStep("choose");
  openModal(tm);
  loadTickets();
}
document.querySelectorAll(".js-tickets").forEach((el) => el.addEventListener("click", openTickets));
$("ticketBack").addEventListener("click", () => showStep("choose"));

$("ticketForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = e.currentTarget, status = $("ticketStatus"), btn = $("payBtn");
  const v = (n) => f.elements[n].value.trim();
  const fail = (m) => { status.className = "formstatus error"; status.textContent = m; };

  if (v("name").length < 2) return fail("Please enter your full name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v("email"))) return fail("Please enter a valid email address.");
  if (v("phone").replace(/\D/g, "").length < 7) return fail("Please enter a valid phone number.");

  const label = btn.textContent;
  btn.disabled = true; btn.textContent = "Taking you to Paystack…"; status.className = "formstatus"; status.textContent = "";
  try {
    const r = await fetch("/api/initialize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticket: selected.id, name: v("name"), email: v("email"), phone: v("phone") })
    });
    const d = await r.json();
    if (!r.ok || !d.url) throw new Error(d.error || "Could not start payment.");
    window.location.href = d.url; // straight to Paystack
  } catch (err) {
    fail(err.message || "Something went wrong. Please try again.");
    btn.disabled = false; btn.textContent = label;
  }
});

/* ---------- Book Us ---------- */
const bm = $("bookModal");
let lockedCat = "";  // set when opened from a category's "Book Us Now" button
let bookCat = "";    // the category being shown
let ratesView = "";  // "cats-rates" | "cats-work" | "pkgs" | "gallery"

function showBook(step) {
  $("bookStepChoose").hidden = step !== "choose";
  $("bookStepRates").hidden = step !== "rates";
  bm.querySelector(".modalbox").scrollTop = 0;
}

function setHead(label, title, hint) {
  $("rateCat").textContent = label;
  $("rateTitle").textContent = title;
  $("rateHint").textContent = hint;
  $("rateHint").hidden = !hint;
  $("rateList").innerHTML = "";
  $("rateList").className = "ticketlist";
}

// One row (a link or a button) in the pop-up lists
function row(tag, name, small, right) {
  const el = document.createElement(tag);
  el.className = "ticketopt";
  el.innerHTML = '<span><b></b><small></small></span><span class="price"></span>';
  el.querySelector("b").textContent = name;
  el.querySelector("small").textContent = small;
  el.querySelector(".price").textContent = right;
  $("rateList").appendChild(el);
  return el;
}

const rateMessage = (c) =>
  `Hello BLAKMIXED ENTERTAINMENT, my name is [your name]. I would like to book your ${c.category} service: "${c.name}" (${c.price}). Details of my event/project: [tell us a little about it].`;

// Choose a service (only when opened from the hero "Book Us" button)
function drawCategories(mode) {
  ratesView = "cats-" + mode;
  setHead(mode === "rates" ? "RATE CARD" : "OUR WORK", "Choose a service.",
    mode === "rates" ? "Pick a service to see its packages." : "Pick a service to see our work.");
  [...new Set(DATA.rateCards.map((c) => c.category))].forEach((cat) => {
    if (mode === "rates") {
      const n = DATA.rateCards.filter((c) => c.category === cat).length;
      const b = row("button", cat, `${n} package${n === 1 ? "" : "s"}`, "→");
      b.type = "button";
      b.addEventListener("click", () => { bookCat = cat; drawRates(); });
    } else {
      const w = DATA.work[cat] || {};
      if (w.url) {
        const a = row("a", cat, w.label || "View our work", "→");
        a.href = w.url; a.target = "_blank"; a.rel = "noopener noreferrer";
      } else {
        const b = row("button", cat, w.label || "View photos", "→");
        b.type = "button";
        b.addEventListener("click", () => { bookCat = cat; drawGallery(); });
      }
    }
  });
}

// Packages for ONE service; each opens WhatsApp
function drawRates() {
  ratesView = "pkgs";
  setHead(`${bookCat.toUpperCase()} RATE CARD`, "Choose a package.", "Tap a package and WhatsApp opens with your choice ready to send.");
  DATA.rateCards.filter((c) => c.category === bookCat).forEach((c) => {
    const a = row("a", c.name, c.desc, c.price);
    a.href = waLink(rateMessage(c));
    a.target = "_blank"; a.rel = "noopener noreferrer";
  });
}

// Photo gallery (used by Fashion)
function drawGallery() {
  ratesView = "gallery";
  const imgs = (DATA.work[bookCat] || {}).images || [];
  setHead(`${bookCat.toUpperCase()} WORK`, "Our work.", "");
  if (!imgs.length) {
    const p = document.createElement("p");
    p.className = "formstatus";
    p.textContent = `Our ${bookCat.toLowerCase()} portfolio is coming soon. Message us on WhatsApp to see more.`;
    $("rateList").appendChild(p);
    return;
  }
  $("rateList").className = "workgrid";
  imgs.forEach((src) => {
    const i = new Image();
    i.src = src; i.alt = `${bookCat} work by BLAKMIXED`; i.loading = "lazy";
    $("rateList").appendChild(i);
  });
}

document.querySelectorAll(".js-book").forEach((el) => el.addEventListener("click", () => {
  lockedCat = el.dataset.cat || "";
  bookCat = lockedCat;
  const w = DATA.work[lockedCat] || {};
  $("bookWork").href = w.url || "#";
  $("bookWork").target = w.url ? "_blank" : "_self";
  showBook("choose");
  openModal(bm);
}));
$("bookWork").addEventListener("click", (e) => {
  if (lockedCat && (DATA.work[lockedCat] || {}).url) return; // opens its link
  e.preventDefault();
  lockedCat ? drawGallery() : drawCategories("work");
  showBook("rates");
});
$("bookRates").addEventListener("click", () => { lockedCat ? drawRates() : drawCategories("rates"); showBook("rates"); });
$("bookBack").addEventListener("click", () => {
  if (!lockedCat && ratesView === "pkgs") drawCategories("rates");
  else if (!lockedCat && ratesView === "gallery") drawCategories("work");
  else showBook("choose");
});

/* ---------- Start ---------- */
render();
startCountdown();
