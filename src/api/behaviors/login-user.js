import { makeUser } from "../entities";

const buildLoginUser = ({ findUserById, validatePassword }) => async ({ id, password }) => {
  const userInfo = await findUserById({ id });

  if (!userInfo) {
    return null;
  }

  const isValidPassword = await validatePassword({
    password,
    passwordHash: userInfo.password,
  });

  if (isValidPassword) {
    const user = makeUser(userInfo);
    return {
      user: user.serialize(),
      token: "token", // TODO: create valid jwt here
    };
  }

  return null;
};

export default buildLoginUser;
