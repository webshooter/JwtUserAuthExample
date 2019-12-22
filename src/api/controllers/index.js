import makeGetChonk from "./get-chonk";
import makePostUser from "./post-user";
import makePostApiAuth from "./post-api-auth";
import { createChonk, addUser, loginUser } from "../behaviors";

// eslint-disable-next-line import/named
import { adminApiKey } from "../../config";

const getChonk = makeGetChonk({ createChonk });
const postUser = makePostUser({ addUser, adminApiKey });
const postApiAuth = makePostApiAuth({ loginUser });

const controller = Object.freeze({
  getChonk,
  postUser,
  postApiAuth,
});

export default controller;
export { getChonk, postUser, postApiAuth };
