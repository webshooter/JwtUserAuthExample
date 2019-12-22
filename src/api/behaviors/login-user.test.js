import faker from "faker";
import buildLoginUser from "./login-user";
import Password from "../../Password";
import fakeUserInfo from "../../../__test__/fake-user-info";
import makeDb, { clearDb, closeDb } from "../../../__test__/test-db";
import makeUsersDb, { collectionName } from "../db/users-db";

describe("login-user", () => {
  let db;
  let usersDb;
  let loginUser;

  beforeEach(async () => {
    db = await makeDb();
    usersDb = makeUsersDb({ makeDb });
    loginUser = buildLoginUser({
      findUserById: usersDb.findById,
      validatePassword: Password.validatePassword,
    });

    const existingUsers = await Promise.all([
      fakeUserInfo(),
      fakeUserInfo(),
      fakeUserInfo(),
    ]);

    await db
      .collection(collectionName)
      .insertMany(existingUsers);
  });

  afterEach(async () => {
    await clearDb({ collectionName });
  });

  afterAll(async () => {
    await closeDb();
  });

  describe("when credentials are valid", () => {
    it("returns a user id, email and token in the response", async () => {
      const password = "good-password";
      const userInfo = await fakeUserInfo({ overrides: { password } });
      const user = { _id: userInfo.id, ...userInfo };
      delete user.id;
      await db
        .collection(collectionName)
        .insertOne(user);

      const response = await loginUser({
        id: userInfo.id,
        password,
      });

      expect(response).toMatchObject({
        user: {
          id: userInfo.id,
          email: userInfo.email,
        },
        token: "token",
      });
    });
  });

  // describe("when credentials are not valid", () => {
  //   it("returns null if the password doesn't match", async () => {
  //     const user = await fakeUserInfo({ password: "good-password" });
  //     const inserted = await db
  //       .collection(collectionName)
  //       .insertOne(user);
  //     const response = await loginUser({
  //       id: faker.random.uuid(),
  //       password: faker.random.word(),
  //     });
  //     expect(inserted).not.toBeNull();
  //     expect(response).toBeNull();
  //   });
  //   it("returns null if the user is not found", async () => {
  //     const response = await loginUser({
  //       id: faker.random.uuid(),
  //       password: faker.random.word(),
  //     });
  //     expect(response).toBeNull();
  //   });
  // });
});
