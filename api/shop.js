const cfg = require("./_config");

// Product / customization lists for the Fashion store pages.
module.exports = (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const mode = req.query.mode;
  if (mode === "catalog") {
    return res.status(200).json({
      maxQty: cfg.MAX_ORDER_QTY,
      items: cfg.CATALOG.map(({ id, category, name, desc, price, image, sizes }) => ({ id, category, name, desc, price, image, sizes }))
    });
  }
  if (mode === "custom") {
    return res.status(200).json({
      maxQty: cfg.MAX_ORDER_QTY,
      items: cfg.CUSTOMIZATION.map(({ id, name, desc, unit, tiers }) => ({ id, name, desc, unit, tiers }))
    });
  }
  return res.status(400).json({ error: "Unknown mode" });
};
