// eslint-disable-next-line import/no-extraneous-dependencies
import faker from "faker";
import crypto from "crypto";

import Id from "../src/Id";
import Password from "../src/Password";

const fakeUserInfo = async (overrides = {}) => {
  const password = await Password.hashPassword({
    password: faker.internet.password(10),
    salt: 1,
  });

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
    ...overrides,
  };
};

export default fakeUserInfo;
