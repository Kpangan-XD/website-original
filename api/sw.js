// Service worker registration for Vercel (ensures SW is served from root)
module.exports = async (req, res) => {
  res.setHeader('Service-Worker-Allowed', '/');
  res.setHeader('Cache-Control', 'no-cache');
  res.status(200).send('OK');
};