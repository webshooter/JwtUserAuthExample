import buildHomeController from "./home-controller";
import buildLoginController from "./login-controller";
import buildProfileController from "./profile-controller";
import {
  // homeRoute,
  loginRoute,
  profileRoute,
} from "../routes";

const homeController = buildHomeController({
  loginRoutePath: loginRoute.path,
  profileRoutePath: profileRoute.path,
});

const loginController = buildLoginController({
  loginRoute,
  profileRoutePath: profileRoute.path,
});

const profileController = buildProfileController({
  profileRoute,
  loginRoutePath: loginRoute.path,
});

const controllers = {
  homeController,
  loginController,
  profileController,
};

export default controllers;
export {
  homeController,
  loginController,
  profileController,
};
