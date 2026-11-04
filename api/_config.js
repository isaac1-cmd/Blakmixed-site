/* ------------------------------------------------------------------
   TICKET SETTINGS: edit your event, prices and descriptions HERE.
   Prices are in Naira (₦). The server uses these numbers when it talks
   to Paystack, so nobody can change a price from their browser.
------------------------------------------------------------------- */
module.exports = {
  EVENT_NAME: "Chill Out: 2 Days House Party",
  EVENT_DATE: "3rd - 4th December 2026",
  EVENT_VENUE: "Port Harcourt, Nigeria (venue details sent to ticket holders)",
  CURRENCY: "NGN",
  TICKETS: [
    {
      id: "gents",
      name: "Gents",
      price: 5000, // PLACEHOLDER: set your real price
      tagline: "General admission for gentlemen",
      description:
        "Your pass to Chill Out, the 2-day house party. Relax, enjoy the music and vibe with the crowd across both days.",
      includes: [
        "Entry for one (1) gentleman",
        "Access to the party across both days",
        "Great music and a lively crowd",
        "Full access to the entertainment experience"
      ]
    },
    {
      id: "ladies",
      name: "Ladies",
      price: 3000, // PLACEHOLDER: set your real price
      tagline: "General admission for ladies",
      description:
        "Your pass to Chill Out, the 2-day house party. Bring your girls, unwind and enjoy two days built around good vibes and great music.",
      includes: [
        "Entry for one (1) lady",
        "Access to the party across both days",
        "Great music and a lively crowd",
        "Full access to the entertainment experience"
      ]
    },
    {
      id: "vip",
      name: "VIP",
      price: 100000, // PLACEHOLDER: set your real price
      tagline: "The premium experience",
      description:
        "The best way to experience Chill Out. Skip the queue, enjoy a dedicated VIP area and get closer to everything happening across both days.",
      includes: [
        "Entry for one (1) guest, gents or ladies",
        "Priority entry (skip the queue)",
        "Access to the dedicated VIP section",
        "Reserved VIP seating area",
        "Great music and a lively crowd"
      ]
    }
  ]
};


/* ------------------------------------------------------------------
   BOOK US: SERVICE PRICES. Edit prices and descriptions HERE.

   price: 50000   -> customers pay online with "Pay Now" (Paystack)
   price: null    -> shows "Enquire on WhatsApp" until you set a fixed price
   unit: "cap"    -> shows a quantity box, and total = price x quantity
   priceNote      -> text shown while price is null (e.g. a price range)

   category must be exactly "Media" or "Events". (Fashion has its own store, see below.)
------------------------------------------------------------------- */
const svc = (category, name, price, desc, extra = {}) => ({ category, name, price, desc, ...extra });

const SERVICES = [
  // ---- MEDIA ----
  svc("Media", "Basic Package", 100000, "2 reels • 100 pictures • 1 full coverage video"),
  svc("Media", "Standard Package", 300000, "4 reels • 300 pictures • 1 standard video edit"),
  svc("Media", "Premium Package", 1000000, "Full coverage with our full team • Full video and picture production"),
  svc("Media", "Studio Photoshoot", 50000, "5 clean edited pictures • 3 different outfits"),
  svc("Media", "Single Picture", 10000, "Simple, plain background. Priced per picture.", { unit: "picture" }),
  svc("Media", "Content Creation", 30000, "Each content costs ₦30,000.", { unit: "content" }),

  // ---- EVENTS (ranges can't be charged as one amount: set a fixed price to switch on Pay Now) ----
  svc("Events", "Birthday Party", 200000, "Birthday party planned and hosted for you."),
  svc("Events", "Wedding Event", 1000000, "Wedding event services."),
  svc("Events", "Club Party Hosting", null, "Hosting of club parties.", { priceNote: "₦300,000 – ₦500,000" }),
  svc("Events", "House Party Hosting", null, "Hosting of house parties.", { priceNote: "₦500,000 – ₦1,000,000" }),
  svc("Events", "Outdoor Rave Hosting", null, "Hosting of outdoor raves.", { priceNote: "₦1,000,000 – ₦5,000,000" })
];

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
module.exports.SERVICES = SERVICES.map((s) => ({ ...s, id: slug([s.category, s.group, s.name].filter(Boolean).join("-")) }));
module.exports.MAX_QTY = 100;                 // most a customer can order at once
module.exports.WHATSAPP = "2348136669773";    // where customers are sent after paying


/* ------------------------------------------------------------------
   FASHION STORE (Purchase Now → View Our Catalog)
   *** SAMPLE PRODUCTS AND PRICES: replace with your real ones. ***

   category : the filter name on the shop page (Cap, Hoodie, Shirt, ...)
   price    : in Naira. Use null to show "Price coming soon" (can't be bought yet)
   image    : file name of the picture saved in the main folder, e.g. "cap-1.webp"
   sizes    : optional list, e.g. ["S","M","L"]. Leave out if the product has no sizes.
------------------------------------------------------------------- */
const CATALOG = [
  { category: "Cap",    name: "Sample Cap 1",    price: 8000,  image: "", desc: "Replace with your product description." },
  { category: "Cap",    name: "Sample Cap 2",    price: 9000,  image: "", desc: "Replace with your product description." },
  { category: "Hoodie", name: "Sample Hoodie 1", price: 25000, image: "", sizes: ["S", "M", "L", "XL", "XXL"], desc: "Replace with your product description." },
  { category: "Hoodie", name: "Sample Hoodie 2", price: 28000, image: "", sizes: ["S", "M", "L", "XL", "XXL"], desc: "Replace with your product description." },
  { category: "Shirt",  name: "Sample Shirt 1",  price: 12000, image: "", sizes: ["S", "M", "L", "XL", "XXL"], desc: "Replace with your product description." },
  { category: "Shirt",  name: "Sample Shirt 2",  price: 13000, image: "", sizes: ["S", "M", "L", "XL", "XXL"], desc: "Replace with your product description." }
];

/* ------------------------------------------------------------------
   PERSONALIZED CUSTOMIZATION (Purchase Now → Get Your Personalized Customization)
   *** SAMPLE PRICES: replace with your real ones. ***

   tiers: the price for EACH item depends on how many the customer orders.
          { min: 1, price: 6000 }  = from 1 item, each costs ₦6,000
          { min: 5, price: 5000 }  = from 5 items, each costs ₦5,000
          { min: 7, price: 4500 }  = from 7 items, each costs ₦4,500
   Add or remove tiers as you like. List them from smallest min to largest.
------------------------------------------------------------------- */
const CUSTOMIZATION = [
  { name: "Cap Customization",    unit: "cap",    desc: "Customize your caps with your design, name or logo.", tiers: [{ min: 1, price: 6000 },  { min: 5, price: 5000 },  { min: 7, price: 4500 }] },
  { name: "Shirt Customization",  unit: "shirt",  desc: "Customize shirts with your design, name or logo.",    tiers: [{ min: 1, price: 7000 },  { min: 5, price: 6000 },  { min: 7, price: 5500 }] },
  { name: "Hoodie Customization", unit: "hoodie", desc: "Customize hoodies with your design, name or logo.",   tiers: [{ min: 1, price: 12000 }, { min: 5, price: 10500 }, { min: 7, price: 9500 }] },
  { name: "Pillow Customization", unit: "pillow", desc: "Customize pillows with your design or photo.",        tiers: [{ min: 1, price: 8000 },  { min: 5, price: 7000 },  { min: 7, price: 6500 }] },
  { name: "Jean Customization",   unit: "pair",   desc: "Customize jeans with your design or detailing.",      tiers: [{ min: 1, price: 10000 }, { min: 5, price: 9000 },  { min: 7, price: 8000 }] }
];

module.exports.CATALOG = CATALOG.map((p) => ({ ...p, id: slug(p.category + "-" + p.name) }));
module.exports.CUSTOMIZATION = CUSTOMIZATION.map((p) => ({ ...p, id: slug(p.name) }));
module.exports.MAX_ORDER_QTY = 500; // most of one item in a single order

// Price of ONE item when the customer orders `qty` of it (customization tiers)
module.exports.unitPrice = (item, qty) => {
  const t = [...item.tiers].sort((x, y) => y.min - x.min).find((x) => qty >= x.min);
  return t && t.price > 0 ? t.price : 0;
};
