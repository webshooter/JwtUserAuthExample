import faker from "faker";
import crypto from "crypto";
import ipRegex from "ip-regex";
import fakeUserInfo from "../../../../__test__/fake-user-info";
import buildMakeUser from "./user";
import buildmakeSource from "../../../make-source";
import Id from "../../../Id";
import Email from "../../../Email";
import Key from "../../../Key";
import Password from "../../../Password";

const makeHash = hashText => crypto
  .createHash("md5")
  .update(hashText, "utf-8")
  .digest("hex");

const isValidIp = ip => ipRegex({ exact: true }).test(ip);

describe("user", () => {
  let makeUser;
  let makeSource;

  beforeEach(() => {
    makeSource = buildmakeSource({ isValidIp });
    makeUser = buildMakeUser({
      Id,
      Email,
      Key,
      Password,
      makeHash,
      makeSource,
    });
  });

  it("creates a user", async () => {
    const userInfo = await fakeUserInfo();
    const {
      getId,
      getEmail,
      getPassword,
      getSource,
      getCreatedAt,
      getUpdatedAt,
      getHash,
    } = await makeUser(userInfo);

    const hashText = `${userInfo.id}${userInfo.email}${userInfo.updatedAt}${userInfo.createdAt}`;
    const source = getSource();

    expect(Id.isValid(getId())).toBe(true);
    expect(getEmail()).toBe(userInfo.email);
    expect(getPassword()).toBe(userInfo.password);
    expect(source.getIp()).toBe(userInfo.source.ip);
    expect(source.getBrowser()).toBe(userInfo.source.browser);
    expect(source.getReferrer()).toBe(userInfo.source.referrer);
    expect(getCreatedAt()).toBeLessThanOrEqual(Date.now());
    expect(getUpdatedAt()).toBeLessThanOrEqual(Date.now());
    expect(getHash()).toBe(makeHash(hashText));
  });

  it("adds createdAt when user is created", async () => {
    const userInfo = await fakeUserInfo({ createdAt: undefined });
    const { getCreatedAt } = await makeUser(userInfo);
    expect(getCreatedAt()).toBeLessThanOrEqual(Date.now());
  });

  it("adds updatedAt when user is created", async () => {
    const userInfo = await fakeUserInfo({ updatedAt: undefined });
    const { getUpdatedAt } = await makeUser(userInfo);
    expect(getUpdatedAt()).toBeLessThanOrEqual(Date.now());
  });

  it("throws an error if email is invalid", async () => {
    const userInfo = await fakeUserInfo({ email: null });
    expect(() => makeUser(userInfo))
      .toThrowError(new Error("User requires a valid email"));
  });

  it("throws an error if password is invalid", async () => {
    const userInfo = await fakeUserInfo({ password: null });
    expect(() => makeUser(userInfo))
      .toThrowError(new Error("User requires a valid password"));
  });

  it("throws an error if source.ip is missing", async () => {
    const userInfo = await fakeUserInfo({
      source: {
        browser: faker.internet.userAgent(),
        referrer: faker.internet.url(),
      },
    });
    expect(() => makeUser(userInfo))
      .toThrowError(new Error("User source must contain an ip"));
  });

  it("throws an error if source.ip is invalid", async () => {
    const userInfo = await fakeUserInfo({
      source: {
        ip: "not an ip",
        browser: faker.internet.userAgent(),
        referrer: faker.internet.url(),
      },
    });
    expect(() => makeUser(userInfo))
      .toThrowError(new Error("User source must contain a valid ip"));
  });

  describe("serialize", () => {
    it("returns the id and email fields by default", async () => {
      const userInfo = await fakeUserInfo();
      const { serialize } = await makeUser(userInfo);
      expect(serialize()).toMatchObject({
        id: userInfo.id,
        email: userInfo.email,
      });
    });
    it("returns specified fields only", async () => {
      const userInfo = await fakeUserInfo();
      const { serialize } = await makeUser(userInfo);
      expect(serialize([
        "email",
        "createdAt",
        "updatedAt",
      ])).toMatchObject({
        email: userInfo.email,
        createdAt: userInfo.createdAt,
        updatedAt: userInfo.updatedAt,
      });
    });
    it("never returns the password", async () => {
      const userInfo = await fakeUserInfo();
      const { serialize } = await makeUser(userInfo);
      expect(serialize([
        "password",
        "createdAt",
        "updatedAt",
      ])).toMatchObject({
        createdAt: userInfo.createdAt,
        updatedAt: userInfo.updatedAt,
      });
    });
  });
});
