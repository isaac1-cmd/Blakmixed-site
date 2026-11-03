const cfg = require("./_config");

// Public ticket info for the website (no secrets in here).
module.exports = (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({
    event: { name: cfg.EVENT_NAME, date: cfg.EVENT_DATE, venue: cfg.EVENT_VENUE },
    tickets: cfg.TICKETS
  });
};
