// eslint-disable-next-line import/no-extraneous-dependencies
import faker from "faker";
import crypto from "crypto";

import Id from "../src/Id";
import Password from "../src/Password";

const fakeUserInfo = async ({ overrides = {}, hashPassword = true } = {}) => {
  const passwordCandidate = overrides.password || faker.internet.password(10);
  const password = hashPassword
    // fakeUserInfo to be used as if from the db
    // with a hashed password
    ? await Password.hashPassword({
      password: passwordCandidate,
      salt: 1,
    })
    // or fakeUserInfo will be used to create a new user
    // so don't hash password
    : passwordCandidate;

  // if test provides a "null" password, then don't delete
  // otherwise testing will break
  const modifiedOverrides = { ...overrides };
  if (modifiedOverrides.password !== null) {
    delete modifiedOverrides.password;
  }

  const makeHash = hashText => crypto
    .createHash("md5")
    .update(hashText, "utf-8")
    .digest("hex");

  const userInfo = {
    id: Id.makeId(),
    email: faker.internet.email(),
    password,
    source: {
      ip: faker.internet.ip(),
      browser: faker.internet.userAgent(),
      referrer: faker.internet.url(),
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const {id, email, createdAt, updatedAt} = userInfo;
  const hashText = `${id}${email}${createdAt}${updatedAt}`;

  return {
    hash: makeHash(hashText),
    ...userInfo,
    ...modifiedOverrides,
  };
};

export default fakeUserInfo;
