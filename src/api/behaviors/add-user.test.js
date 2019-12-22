import makeDb, { clearDb, closeDb } from "../../../__test__/test-db";
import fakeUserInfo from "../../../__test__/fake-user-info";
import Password from "../../Password";
import makeUsersDb, { collectionName } from "../db/users-db";
import buildAddUser from "./add-user";

describe("add-user", () => {
  let db;
  let usersDb;
  let addUser;

  beforeEach(async () => {
    db = await makeDb();
    usersDb = makeUsersDb({ makeDb });
    addUser = buildAddUser({
      findUserById: usersDb.findById,
      findUserByEmail: usersDb.findByEmail,
      insertUser: usersDb.insert,
    });
  });

  afterEach(async () => {
    await clearDb({ collectionName });
  });

  afterAll(async () => {
    await closeDb();
  });

  it("adds a user to the database", async () => {
    const userInfo = await fakeUserInfo({ hashPassword: false });
    const added = await addUser(userInfo);

    const isValidPaswordHash = await Password.validatePassword({
      password: userInfo.password,
      passwordHash: added.password,
    });
    expect(isValidPaswordHash).toBe(true);

    delete userInfo.password;
    delete added.password;
    expect(added).toMatchObject(userInfo);
  });

  it("returns existing user with matching id", async () => {
    const userInfoExisting = await fakeUserInfo();

    const insertData = { ...userInfoExisting };
    // eslint-disable-next-line no-underscore-dangle
    insertData._id = insertData.id;
    delete insertData.id;
    await db.collection(collectionName).insertOne(insertData);

    const userInfo = await fakeUserInfo({
      overrides: {
        id: userInfoExisting.id,
      },
    });
    const added = await addUser(userInfo);
    delete userInfoExisting.password;
    delete added.password;
    expect(added).toMatchObject(userInfoExisting);
  });

  it("returns existing user with matching email", async () => {
    const userInfoExisting = await fakeUserInfo();

    const insertData = { ...userInfoExisting };
    // eslint-disable-next-line no-underscore-dangle
    insertData._id = insertData.id;
    delete insertData.id;
    await db.collection(collectionName).insertOne(insertData);

    const userInfo = await fakeUserInfo({
      overrides: {
        email: userInfoExisting.email,
      },
    });
    const added = await addUser(userInfo);
    delete userInfoExisting.password;
    delete added.password;
    expect(added).toMatchObject(userInfoExisting);
  });
});
