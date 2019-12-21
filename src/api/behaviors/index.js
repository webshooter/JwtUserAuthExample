import Password from "../../Password";
import buildCreateChonk from "./create-chonk";
import buildAddUser from "./add-user";
import buildLoginUser from "./login-user";
import { usersDb } from "../db";


const createChonk = buildCreateChonk();
const addUser = buildAddUser({
  findUserById: usersDb.findById,
  findUserByEmail: usersDb.findByEmail,
  insertUser: usersDb.insert,
});
const loginUser = buildLoginUser({
  findUserById: usersDb.findById,
  validatePassword: Password.validatePassword,
});

const behaviors = Object.freeze({
  createChonk,
  addUser,
  loginUser,
});

export default behaviors;
export {
  createChonk,
  addUser,
  loginUser,
};
