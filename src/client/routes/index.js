const homeRoute = { name: "Home", path: "/" };
const loginRoute = { name: "Login", path: "/login" };
const profileRoute = { name: "Profile", path: "/profile/:id" };

const routes = [
  loginRoute,
];

export default routes;
export {
  homeRoute,
  profileRoute,
  loginRoute,
};
