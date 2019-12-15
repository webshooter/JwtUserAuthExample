const buildAdminApi = ({ adminApiKey } = {}) => (req, res, next) => {
  const apiKey = req.get("x-api-key");
  const isAdmin = adminApiKey && apiKey && adminApiKey === apiKey;
  if (isAdmin) {
    next();
  } else {
    res.send(401, { error: "Requires authorization" });
  }
};

export default buildAdminApi;
