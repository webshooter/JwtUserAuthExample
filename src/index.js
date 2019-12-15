import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import logger from "./logger";
import makeCallback from "./express-callback";
import userAuth from "./api/user-auth";
import { getChonk, postUser } from "./api/controllers";

// eslint-disable-next-line import/named
import { port, apiRoot } from "./config";


const app = express();
app.disable("x-powered-by");

// parse application/json
app.use(bodyParser.json());

// use morgan for request logging
app.use(morgan("dev"));

// routing
app.get("/", userAuth, (req, res) => res.send("JWTUserAuth Example App!"));

app.get(`${apiRoot}`, userAuth, (req, res) => res.send("JWTUserAuth Example App API!"));
app.post(`${apiRoot}`, userAuth, (req, res) => res.send("JWTUserAuth Example App API!"));
app.post(`${apiRoot}/chonk`, userAuth, makeCallback(getChonk));

app.post(`${apiRoot}/users`, userAuth, makeCallback(postUser));

app.listen(port, () => logger.info(`JWTUserAuth app listening on port ${port}!`));
