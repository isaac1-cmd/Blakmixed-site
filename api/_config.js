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
      price: 40000, // PLACEHOLDER: set your real price
      tagline: "General admission for gentlemen",
      description:
        "Your pass to Chill Out, the 2-day house party. Relax, enjoy the music and vibe with the crowd across both days.",
      includes: [
        "Entry for one (1) gentleman",
        "Access to the party across both days",
        "Access to food and drink for day 1",
        "Great music and a lively crowd",
        "Full access to the entertainment experience"
      ]
    },
    {
      id: "ladies",
      name: "Ladies",
      price: 30000, // PLACEHOLDER: set your real price
      tagline: "General admission for ladies",
      description:
        "Your pass to Chill Out, the 2-day house party. Bring your girls, unwind and enjoy two days built around good vibes and great music.",
      includes: [
        "Entry for one (1) lady",
        "Access to the party across both days",
        "Access to food and drink for day 1",
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
        "Access to food and drink for day 1",
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

   category must be exactly "Media", "Events" or "Fashion".
   Fashion items also have a group (each group opens its own list).
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
  svc("Events", "Outdoor Rave Hosting", null, "Hosting of outdoor raves.", { priceNote: "₦1,000,000 – ₦5,000,000" }),

  // ---- FASHION (placeholders: set real names and prices) ----
  svc("Fashion", "Option 1", null, "Describe this customization option.", { group: "Cap Customization", unit: "cap" }),
  svc("Fashion", "Option 2", null, "Describe this customization option.", { group: "Cap Customization", unit: "cap" }),
  svc("Fashion", "Option 3", null, "Describe this customization option.", { group: "Cap Customization", unit: "cap" }),
  svc("Fashion", "Option 1", null, "Describe this customization option.", { group: "Shirt & Merch Customization", unit: "item" }),
  svc("Fashion", "Option 2", null, "Describe this customization option.", { group: "Shirt & Merch Customization", unit: "item" }),
  svc("Fashion", "Option 3", null, "Describe this customization option.", { group: "Shirt & Merch Customization", unit: "item" }),
  svc("Fashion", "Option 1", null, "Describe this customization option.", { group: "Jean Customization", unit: "pair" }),
  svc("Fashion", "Option 2", null, "Describe this customization option.", { group: "Jean Customization", unit: "pair" }),
  svc("Fashion", "Option 3", null, "Describe this customization option.", { group: "Jean Customization", unit: "pair" })
];

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
module.exports.SERVICES = SERVICES.map((s) => ({ ...s, id: slug([s.category, s.group, s.name].filter(Boolean).join("-")) }));
module.exports.MAX_QTY = 100;                 // most a customer can order at once
module.exports.WHATSAPP = "2348136669773";    // where customers are sent after paying
