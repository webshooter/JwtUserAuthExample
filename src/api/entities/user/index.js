import crypto from "crypto";
import ipRegex from "ip-regex";
import buildMakeUser from "./user";
import buildMakeSource from "../../../make-source";
import Id from "../../../Id";
import Email from "../../../Email";
import Password from "../../../Password";

const makeHash = hashText => crypto
  .createHash("md5")
  .update(hashText, "utf-8")
  .digest("hex");

const isValidIp = ip => ipRegex({ exact: true }).test(ip);

const makeSource = buildMakeSource({ isValidIp });

const makeUser = buildMakeUser({ Id, Email, Password, makeHash, makeSource });

export default makeUser;
