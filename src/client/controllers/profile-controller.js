const buildProfileController = ({ profileRoute, loginRoutePath }) => (req, res) => {
  if (!req.user) {
    return res.redirect(loginRoutePath);
  }
  return res.render("login", {
    title: `Chonker | ${profileRoute.name}`,
    message: `page: ${profileRoute.name}`,
  });
};

export default buildProfileController;
