import faker from "faker";
import uuidv4 from "uuid/v4";
import makeDb, { clearDb } from "../../../__test__/test-db-mem";
import fakeUserInfo from "../../../__test__/fake-user-info";
import makeUsersDb from "./users-db";


describe("users-db", () => {
  let existingUsers;
  let usersDb;
  let db;

  const collectionName = "users";

  beforeEach(async () => {
    existingUsers = (await Promise.all([
      fakeUserInfo(),
      fakeUserInfo(),
      fakeUserInfo(),
      fakeUserInfo(),
      fakeUserInfo(),
      fakeUserInfo(),
      fakeUserInfo(),
    ]));

    // insert seed users for tests
    db = await makeDb();
    await db
      .collection(collectionName)
      .insertMany(existingUsers
        // remap id to _id for mongodb
        .map(({ id, ...rest }) => ({ _id: id, ...rest })));

    usersDb = makeUsersDb({ makeDb });
  });

  afterEach(async () => {
    await clearDb({ collectionName });
  });

  describe("findAll", () => {
    it("returns an array of all users", async () => {
      const users = await usersDb.findAll();
      expect(users).toMatchObject(existingUsers);
    });
    it("returns an empty array if there are no users", async () => {
      // first, drop existing users
      await db.collection(collectionName).deleteMany({});
      const users = await usersDb.findAll();
      expect(users).toHaveLength(0);
    });
  });

  describe("findById", () => {
    it("returns the user with the matching id", async () => {
      const target = existingUsers[Math.floor(Math.random() * (existingUsers.length))];
      const user = await usersDb.findById({ id: target.id });
      expect(user).toMatchObject(target);
    });
    it("returns null if there is no user with that id", async () => {
      const user = await usersDb.findById({ id: uuidv4() });
      expect(user).toBeNull();
    });
  });

  describe("findByEmail", () => {
    it("returns the user with the matching email", async () => {
      const target = existingUsers[Math.floor(Math.random() * (existingUsers.length))];
      const user = await usersDb.findByEmail({ email: target.email });
      expect(user).toMatchObject(target);
    });
    it("returns null if there is no user with that email", async () => {
      const user = await usersDb.findByEmail({ email: faker.internet.email() });
      expect(user).toBeNull();
    });
  });

  describe("findByHash", () => {
    it("returns the user with the matching email", async () => {
      const target = existingUsers[Math.floor(Math.random() * (existingUsers.length))];
      const user = await usersDb.findByHash({ hash: target.hash });
      expect(user).toMatchObject(target);
    });
    it("returns null if there is no user with that email", async () => {
      const user = await usersDb.findByHash({ hash: uuidv4() });
      expect(user).toBeNull();
    });
  });

  describe("insert", () => {
    it("inserts the user info into the database", async () => {
      const userInfo = await fakeUserInfo();
      const inserted = await usersDb.insert(userInfo);
      const f = await db.collection(collectionName).findOne({ _id: userInfo.id });
      // eslint-disable-next-line no-underscore-dangle
      const found = { id: f._id, ...f };
      expect(inserted).toMatchObject(userInfo);
      expect(found).toMatchObject(userInfo);
    });
  });

  describe("update", () => {
    it("updates an existing user in the database", async () => {
      const userInfo = existingUsers[Math.floor(Math.random() * (existingUsers.length))];
      const newEmail = faker.internet.email();
      userInfo.email = newEmail;
      const updated = await usersDb.update(userInfo);
      const f = await db.collection(collectionName).findOne({ _id: userInfo.id });

      // eslint-disable-next-line no-underscore-dangle
      const found = { id: f._id, ...f };

      expect(updated.email).toBe(userInfo.email);
      expect(found.email).toBe(userInfo.email);
    });
    it("returns null if the user was not updated (not found)", async () => {
      const userInfo = await fakeUserInfo();
      const updated = await usersDb.update(userInfo);
      expect(updated).toBeNull();
    });
  });

  describe("remove", () => {
    it("removes the user from the database", async () => {
      const target = existingUsers[Math.floor(Math.random() * (existingUsers.length))];
      const query = { id: target.id };
      const count = await usersDb.remove(query);
      const user = await db.collection(collectionName).findOne(query);

      expect(count).toBe(1);
      expect(user).toBeNull();
    });
    it("does not remove any users if id is not found", async () => {
      const usersBefore = await db.collection(collectionName).find({});
      const count = await usersDb.remove({ id: uuidv4() });
      const usersAfter = await db.collection(collectionName).find({});
      expect(count).toBe(0);
      expect(usersAfter).toMatchObject(usersBefore);
    });
  });
});
