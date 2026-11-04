const cfg = require("./_config");

// Public service list + prices for the Book Us pop-up.
module.exports = (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({
    whatsapp: cfg.WHATSAPP,
    maxQty: cfg.MAX_QTY,
    services: cfg.SERVICES.map(({ id, category, group, name, desc, price, priceNote, unit }) => ({ id, category, group, name, desc, price, priceNote, unit }))
  });
};
