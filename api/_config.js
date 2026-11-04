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
      price:  100000, // PLACEHOLDER: set your real price
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
