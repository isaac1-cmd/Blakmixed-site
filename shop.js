/* ==================================================================
   FASHION STORE: catalog (e-commerce) + personalized customization
   Products, tiers and prices come from the server (api/_config.js).
================================================================== */
const S = { mode: "catalog", data: {}, filter: "All", cart: [], maxQty: 500, open: false };

const mkEl = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
};
const plural = (unit, n) => (n === 1 ? unit : unit + "s");
const items = () => S.data[S.mode] || [];
const findItem = (id) => items().find((i) => i.id === id);
const cartKey = () => "bme_cart_" + S.mode;

/* ---------- Pricing (display only: the server recalculates at checkout) ---------- */
function tierPrice(item, qty) {
  const t = [...item.tiers].sort((a, b) => b.min - a.min).find((x) => qty >= x.min);
  return t && t.price > 0 ? t.price : 0;
}
const unitOf = (item, qty) => (S.mode === "catalog" ? item.price || 0 : tierPrice(item, qty));
function tierRows(item) {
  const t = [...item.tiers].sort((a, b) => a.min - b.min);
  return t.map((x, i) => {
    const next = t[i + 1];
    const range = !next
      ? `${x.min}+ ${plural(item.unit, 2)}`
      : next.min - 1 === x.min ? `${x.min} ${plural(item.unit, x.min)}` : `${x.min}–${next.min - 1} ${plural(item.unit, 2)}`;
    return { range, price: x.price };
  });
}

/* ---------- Cart storage ---------- */
function loadCart() {
  try {
    const a = JSON.parse(localStorage.getItem(cartKey()) || "[]");
    S.cart = Array.isArray(a) ? a.filter((l) => l && typeof l.id === "string" && l.qty > 0) : [];
  } catch { S.cart = []; }
}
function saveCart() { try { localStorage.setItem(cartKey(), JSON.stringify(S.cart)); } catch { /* storage blocked: cart still works this visit */ } }

function cartLines() {
  return S.cart.map((l) => {
    const item = findItem(l.id);
    if (!item) return null;
    const unit = unitOf(item, l.qty);
    return { l, item, unit, total: unit * l.qty };
  }).filter(Boolean);
}

function addToCart(id, qty, size) {
  const ex = S.cart.find((l) => l.id === id && (l.size || "") === (size || ""));
  if (ex) ex.qty = Math.min(S.maxQty, ex.qty + qty);
  else S.cart.push({ id, qty: Math.min(S.maxQty, qty), size: size || "" });
  saveCart(); renderCart(); toast("Added to cart ✓");
}

let toastTimer;
function toast(msg) {
  const t = $("shopToast");
  t.textContent = msg; t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 1600);
}

/* ---------- Product grid ---------- */
function renderFilter() {
  const f = $("shopFilter");
  f.innerHTML = "";
  const show = S.mode === "catalog";
  f.hidden = !show;
  $("shopBody").classList.toggle("nofilter", !show);
  if (!show) return;
  f.appendChild(mkEl("h4", "", "FILTER"));
  ["All", ...new Set(items().map((p) => p.category))].forEach((cat) => {
    const b = mkEl("button", "filterbtn" + (S.filter === cat ? " active" : ""), cat);
    b.type = "button";
    b.addEventListener("click", () => { S.filter = cat; renderFilter(); renderGrid(); });
    f.appendChild(b);
  });
}

function picture(p) {
  const box = mkEl("div", "pimg");
  const fallback = () => { box.innerHTML = ""; box.classList.add("noimg"); box.appendChild(mkEl("span", "", (p.category || p.name).toUpperCase())); };
  if (p.image) {
    const img = new Image();
    img.src = p.image; img.alt = p.name; img.loading = "lazy";
    img.onerror = fallback;
    box.appendChild(img);
  } else fallback();
  return box;
}

function catalogCard(p) {
  const card = mkEl("article", "pcard");
  card.appendChild(picture(p));
  const info = mkEl("div", "pinfo");
  info.appendChild(mkEl("small", "", p.category.toUpperCase()));
  info.appendChild(mkEl("h3", "", p.name));
  if (p.desc) info.appendChild(mkEl("p", "pdesc", p.desc));
  info.appendChild(mkEl("div", "pprice", p.price > 0 ? naira(p.price) : "Price coming soon"));

  let sel = null;
  if (p.sizes && p.sizes.length) {
    sel = mkEl("select", "psize");
    sel.setAttribute("aria-label", `Size for ${p.name}`);
    sel.appendChild(new Option("Select size", ""));
    p.sizes.forEach((s) => sel.appendChild(new Option(s, s)));
    info.appendChild(sel);
  }
  const btn = mkEl("button", "btn white addbtn", p.price > 0 ? "Add to Cart" : "Unavailable");
  btn.type = "button";
  btn.disabled = !(p.price > 0);
  btn.addEventListener("click", () => {
    if (sel && !sel.value) { sel.classList.add("err"); sel.focus(); toast("Please choose a size"); return; }
    addToCart(p.id, 1, sel ? sel.value : "");
    if (sel) { sel.value = ""; sel.classList.remove("err"); }
  });
  info.appendChild(btn);
  card.appendChild(info);
  return card;
}

function customCard(p) {
  const card = mkEl("article", "pcard ccard");
  const info = mkEl("div", "pinfo");
  info.appendChild(mkEl("small", "", "CUSTOMIZATION"));
  info.appendChild(mkEl("h3", "", p.name));
  if (p.desc) info.appendChild(mkEl("p", "pdesc", p.desc));

  const tiers = mkEl("div", "tiers");
  tierRows(p).forEach((t) => {
    const r = mkEl("div", "tier");
    r.appendChild(mkEl("span", "", t.range));
    r.appendChild(mkEl("b", "", `${naira(t.price)} each`));
    tiers.appendChild(r);
  });
  info.appendChild(tiers);

  let qty = 1;
  const qtyIn = mkEl("input"); qtyIn.type = "number"; qtyIn.min = 1; qtyIn.value = 1; qtyIn.inputMode = "numeric";
  qtyIn.setAttribute("aria-label", `Quantity of ${p.name}`);
  const minus = mkEl("button", "", "−"), plus = mkEl("button", "", "+");
  minus.type = plus.type = "button";
  const sum = mkEl("div", "pprice");
  const sync = () => {
    qty = Math.min(S.maxQty, Math.max(1, parseInt(qtyIn.value, 10) || 1));
    const u = tierPrice(p, qty);
    sum.textContent = `${qty} × ${naira(u)} = ${naira(u * qty)}`;
  };
  minus.addEventListener("click", () => { qtyIn.value = Math.max(1, qty - 1); sync(); });
  plus.addEventListener("click", () => { qtyIn.value = Math.min(S.maxQty, qty + 1); sync(); });
  qtyIn.addEventListener("input", () => { if (qtyIn.value !== "") sync(); });
  qtyIn.addEventListener("blur", () => { qtyIn.value = qty; sync(); });
  const row = mkEl("div", "qtyrow cqty");
  row.appendChild(mkEl("span", "", "Quantity"));
  const st = mkEl("div", "stepper"); st.append(minus, qtyIn, plus);
  row.appendChild(st);
  info.append(row, sum);
  sync();

  const btn = mkEl("button", "btn white addbtn", "Add to Cart");
  btn.type = "button";
  btn.addEventListener("click", () => { addToCart(p.id, qty, ""); qtyIn.value = 1; sync(); });
  info.appendChild(btn);
  card.appendChild(info);
  return card;
}

function renderGrid() {
  const g = $("shopGrid");
  g.innerHTML = "";
  const list = items().filter((p) => S.mode === "custom" || S.filter === "All" || p.category === S.filter);
  if (!list.length) { g.appendChild(mkEl("p", "formstatus", "Nothing here yet. Check back soon.")); return; }
  g.className = "shopgrid" + (S.mode === "custom" ? " customgrid" : "");
  list.forEach((p) => g.appendChild(S.mode === "catalog" ? catalogCard(p) : customCard(p)));
}

/* ---------- Cart drawer ---------- */
function renderCart() {
  const lines = cartLines();
  const count = lines.reduce((a, x) => a + x.l.qty, 0);
  const total = lines.reduce((a, x) => a + x.total, 0);
  $("cartCount").textContent = count;
  $("cartTotal").textContent = naira(total);
  $("goCheckout").disabled = !lines.length || !total;
  $("coPay").textContent = `Pay Now ${naira(total)}`;

  const box = $("cartLines");
  box.innerHTML = "";
  if (!lines.length) { box.appendChild(mkEl("p", "cartempty", "Your cart is empty.")); return; }

  lines.forEach(({ l, item, unit, total: lt }) => {
    const row = mkEl("div", "cline");
    const left = mkEl("div", "cinfo");
    left.appendChild(mkEl("b", "", item.name));
    const meta = [l.size ? `Size ${l.size}` : "", `${naira(unit)} each`].filter(Boolean).join(" • ");
    left.appendChild(mkEl("small", "", meta));

    const st = mkEl("div", "stepper small");
    const minus = mkEl("button", "", "−"), plus = mkEl("button", "", "+");
    const q = mkEl("input"); q.type = "number"; q.min = 1; q.value = l.qty; q.inputMode = "numeric";
    q.setAttribute("aria-label", `Quantity of ${item.name}`);
    minus.type = plus.type = "button";
    const set = (n) => { l.qty = Math.min(S.maxQty, Math.max(1, n || 1)); saveCart(); renderCart(); };
    minus.addEventListener("click", () => set(l.qty - 1));
    plus.addEventListener("click", () => set(l.qty + 1));
    q.addEventListener("change", () => set(parseInt(q.value, 10)));
    st.append(minus, q, plus);
    left.appendChild(st);

    const right = mkEl("div", "cright");
    right.appendChild(mkEl("b", "", naira(lt)));
    const rm = mkEl("button", "crm", "Remove");
    rm.type = "button";
    rm.addEventListener("click", () => { S.cart = S.cart.filter((x) => x !== l); saveCart(); renderCart(); });
    right.appendChild(rm);

    row.append(left, right);
    box.appendChild(row);
  });
}

function cartView(v) {
  $("cartView").hidden = v !== "cart";
  $("checkoutForm").hidden = v !== "checkout";
  $("cartTitle").textContent = v === "cart" ? "Your cart" : "Checkout";
}
function openCart() {
  cartView("cart"); renderCart();
  $("cartDrawer").classList.add("open"); $("cartShade").classList.add("open");
  $("cartDrawer").setAttribute("aria-hidden", "false");
}
function closeCart() {
  $("cartDrawer").classList.remove("open"); $("cartShade").classList.remove("open");
  $("cartDrawer").setAttribute("aria-hidden", "true");
}

/* ---------- Checkout -> Paystack ---------- */
$("goCheckout").addEventListener("click", () => {
  const custom = S.mode === "custom";
  $("coAddress").placeholder = custom ? "Delivery address (optional)" : "Delivery address (or write 'pickup')";
  $("coNotes").placeholder = custom ? "Tell us about your design idea (optional)" : "Notes (optional)";
  $("coStatus").textContent = ""; $("coStatus").className = "formstatus";
  $("coPay").disabled = false;
  renderCart(); cartView("checkout");
});
$("coBack").addEventListener("click", () => cartView("cart"));

$("checkoutForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = e.currentTarget, status = $("coStatus"), btn = $("coPay");
  const v = (n) => f.elements[n].value.trim();
  const fail = (m) => { status.className = "formstatus error"; status.textContent = m; };
  if (v("name").length < 2) return fail("Please enter your full name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v("email"))) return fail("Please enter a valid email address.");
  if (v("phone").replace(/\D/g, "").length < 7) return fail("Please enter a valid phone number.");
  if (S.mode === "catalog" && v("address").length < 5) return fail("Please enter your delivery address (or write 'pickup').");

  const label = btn.textContent;
  btn.disabled = true; btn.textContent = "Taking you to Paystack…"; status.className = "formstatus"; status.textContent = "";
  try {
    const r = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: S.mode,
        items: cartLines().map(({ l }) => ({ id: l.id, qty: l.qty, size: l.size || "" })),
        name: v("name"), email: v("email"), phone: v("phone"), address: v("address"), notes: v("notes")
      })
    });
    const d = await r.json();
    if (!r.ok || !d.url) throw new Error(d.error || "Could not start payment.");
    window.location.href = d.url; // straight to Paystack (cart is cleared after a successful payment)
  } catch (err) {
    fail(err.message || "Something went wrong. Please try again.");
    btn.disabled = false; btn.textContent = label;
  }
});

/* ---------- Open / close the store ---------- */
async function fetchItems(mode) {
  if (S.data[mode]) return true;
  try {
    const r = await fetch("/api/shop?mode=" + mode);
    if (!r.ok) throw new Error();
    const d = await r.json();
    S.data[mode] = d.items; S.maxQty = d.maxQty || 500;
    return true;
  } catch { return false; }
}

async function openShop(mode) {
  S.mode = mode; S.filter = "All"; loadCart();
  const custom = mode === "custom";
  $("shopTitle").textContent = custom ? "Personalized Customization" : "Fashion Catalog";
  $("shopIntro").hidden = !custom;
  $("shopIntro").textContent = "Choose what you want customized. The more you order, the less each one costs.";
  $("shopFilter").hidden = true;
  $("shopGrid").className = "shopgrid";
  $("shopGrid").innerHTML = "";
  $("shopGrid").appendChild(mkEl("p", "formstatus", "Loading…"));
  $("shop").hidden = false; S.open = true;
  document.body.style.overflow = "hidden";
  $("shop").scrollTop = 0;
  renderCart();

  if (!(await fetchItems(mode))) {
    const local = location.protocol === "file:";
    $("shopGrid").innerHTML = "";
    $("shopGrid").appendChild(mkEl("p", "formstatus error", local
      ? "The store only works on your live website, not when this page is opened from your computer. Open your Vercel link to test."
      : "The store is unavailable right now. Please try again shortly or message us on WhatsApp."));
    return;
  }
  S.cart = S.cart.filter((l) => findItem(l.id)); // drop anything that no longer exists
  saveCart();
  renderFilter(); renderGrid(); renderCart();
}

function closeShop() {
  closeCart();
  $("shop").hidden = true; S.open = false;
  document.body.style.overflow = "";
}

function openPurchase() { openModal($("purchaseModal")); }

$("shopClose").addEventListener("click", closeShop);
$("cartBtn").addEventListener("click", openCart);
$("cartClose").addEventListener("click", closeCart);
$("cartShade").addEventListener("click", closeCart);
$("optCatalog").addEventListener("click", () => { closeModal($("purchaseModal")); openShop("catalog"); });
$("optCustom").addEventListener("click", () => { closeModal($("purchaseModal")); openShop("custom"); });
document.querySelectorAll(".js-purchase").forEach((b) => b.addEventListener("click", openPurchase));
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape" || !S.open) return;
  if ($("cartDrawer").classList.contains("open")) closeCart(); else closeShop();
});
