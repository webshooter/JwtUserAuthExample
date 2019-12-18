const buildLoginController = ({ loginRoute, profileRoutePath }) => (req, res) => {
  return res.render("login", {
    title: `Chonker | ${loginRoute.name}`,
    message: `page: ${loginRoute.name}`,
  });
};

export default buildLoginController;
