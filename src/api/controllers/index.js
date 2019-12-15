import makeGetChonk from "./get-chonk";
import makePostUser from "./post-user";
import { createChonk, addUser } from "../behaviors";

// eslint-disable-next-line import/named
import { adminApiKey } from "../../config";

const getChonk = makeGetChonk({ createChonk });
const postUser = makePostUser({ addUser, adminApiKey });

const controller = Object.freeze({ getChonk, postUser });

export default controller;
export { getChonk, postUser };
