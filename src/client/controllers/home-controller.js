const buildHomeController = ({ loginRoutePath, profileRoutePath }) => (req, res) => {
  if (!req.user) {
    return res.redirect(loginRoutePath);
  }
  return res.redirect(profileRoutePath);
};

export default buildHomeController;
