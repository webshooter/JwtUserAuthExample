import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import logger from "./logger";
import makeCallback from "./express-callback";
import userAuth from "./api/user-auth";
import adminApi from "./api/api-admin";
import { getChonk, postUser } from "./api/controllers";
import {
  homeController,
  loginController,
  profileController,
} from "./client/controllers";
import {
  homeRoute,
  loginRoute,
  profileRoute,
} from "./client/routes";

// eslint-disable-next-line import/named
import { port, apiRoot } from "./config";


const app = express();
app.disable("x-powered-by");

// use Pug as view engine
app.set("view engine", "pug");
app.set("views", "./src/client/views");

// parse application/json
app.use(bodyParser.json());

// use morgan for request logging
app.use(morgan("dev"));

// client routing
app.get(homeRoute.path, homeController);
app.get(loginRoute.path, loginController);
app.get(profileRoute.path, profileController);

// api routing
app.get(`${apiRoot}`, userAuth, (req, res) => res.send("JWTUserAuth Example App API!"));
app.post(`${apiRoot}`, userAuth, (req, res) => res.send("JWTUserAuth Example App API!"));
app.post(`${apiRoot}/chonk`, userAuth, makeCallback(getChonk));
app.post(`${apiRoot}/users`, adminApi, userAuth, makeCallback(postUser));

// start server
app.listen(port, () => logger.info(`JWTUserAuth app listening on port ${port}!`));
