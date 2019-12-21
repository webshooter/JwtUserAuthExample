import faker from "faker";
import makePostUser from "./post-user";
import { addUser } from "../behaviors";

// eslint-disable-next-line import/named
import { apiKey } from "../../config";

describe("post-user", () => {
  let postUser;
  let httpRequest;

  beforeEach(() => {
    postUser = makePostUser({ addUser, adminApiKey: apiKey });
    httpRequest = {
      ip: faker.internet.ip(),
      headers: {
        "x-api-key": apiKey,
        "User-Agent": faker.internet.userAgent(),
        Referrer: faker.internet.url(),
      },
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    };
  });

  it("adds a new user", async () => {
    const { headers, statusCode, body } = await postUser(httpRequest);
    const { id, email } = body.user;

    expect(headers).toMatchObject({ "Content-Type": "application/json" });
    expect(statusCode).toBe(200);
    expect(id).not.toBeNull();
    expect(email).toBe(httpRequest.body.email);
  });
  it("returns 401 is api key is missing", async () => {
    delete httpRequest.headers["x-api-key"];
    const { headers, statusCode, body } = await postUser(httpRequest);
    expect(statusCode).toBe(401);
    expect(body).toMatchObject({ error: "Requires authentication" });
    expect(headers).toMatchObject({ "Content-Type": "application/json" });
  });
  it("returns 403 is api key is incorrect", async () => {
    httpRequest.headers["x-api-key"] = "12345";
    const { headers, statusCode, body } = await postUser(httpRequest);
    expect(statusCode).toBe(403);
    expect(body).toMatchObject({ error: "Unauthorized operation" });
    expect(headers).toMatchObject({ "Content-Type": "application/json" });
  });
});