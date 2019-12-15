const buildApiAdmin = ({ apiAdminKey } = {}) => (req, res, next) => {
  const apiKey = req.get("x-api-key");
  const isAdmin = apiAdminKey && apiKey && apiAdminKey === apiKey;
  if (isAdmin) {
    next();
  } else {
    res.send(401, { error: "Requires authorization" });
  }
};

export default buildApiAdmin;
