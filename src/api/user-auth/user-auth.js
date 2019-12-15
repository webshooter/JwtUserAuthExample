
const userAuth = ({ dataSource } = {}) => (req, res, next) => {
  const apiKey = req.headers ? req.headers["x-api-key"] : null;
  const adminApiKey = process.env.ADMIN_API_KEY;

  if (dataSource && dataSource.userId) {
    req.user = dataSource.userId;
  } else if (adminApiKey === apiKey) {
    req.user = dataSource.userId;
  } else {
    req.user = null;
  }

  next();
};

export default userAuth;
