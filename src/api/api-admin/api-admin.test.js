import buildAdminApi from "./api-admin";

const expect401Response = ({ next, send }) => {
  expect(next.mock.calls).toHaveLength(0);
  expect(send.mock.calls).toHaveLength(1);
  expect(send.mock.calls[0][0]).toBe(401);
  expect(send.mock.calls[0][1])
    .toMatchObject({ error: "Requires authorization" });
};

describe("api-admin", () => {
  let adminApiKey;
  let apiAdmin;
  let next;
  let send;
  let res;

  beforeEach(() => {
    adminApiKey = "ABCD1234";
    apiAdmin = buildAdminApi({ adminApiKey });

    next = jest.fn();
    send = jest.fn();
    res = { send };
  });

  it("calls next if the apiKey matches the adminApiKey", () => {
    const get = jest.fn();
    get.mockReturnValueOnce(adminApiKey);
    const req = { get };

    apiAdmin(req, res, next);

    expect(get.mock.calls).toHaveLength(1);
    expect(get.mock.calls[0][0]).toBe("x-api-key");
    expect(next.mock.calls).toHaveLength(1);
  });

  it("returns a 401 if the apiKey does not match the adminApiKey", () => {
    const get = jest.fn();
    get.mockReturnValueOnce("invalid-key");
    const req = { get };

    apiAdmin(req, res, next);

    return expect401Response({ next, send });
  });

  it("returns a 401 is the x-api-key header is missing", () => {
    const get = jest.fn();
    get.mockReturnValueOnce(undefined);
    const req = { get };

    apiAdmin(req, res, next);

    expect(next.mock.calls).toHaveLength(0);
    expect(send.mock.calls).toHaveLength(1);
    expect(send.mock.calls[0][0]).toBe(401);
    expect(send.mock.calls[0][1])
      .toMatchObject({ error: "Requires authorization" });
  });

  it("returns a 401 if the adminApiKey is missing", () => {
    const get = jest.fn();
    get.mockReturnValueOnce(adminApiKey);
    const req = { get };

    const newApiAdmin = buildAdminApi();
    newApiAdmin(req, res, next);

    expect(next.mock.calls).toHaveLength(0);
    expect(send.mock.calls).toHaveLength(1);
    expect(send.mock.calls[0][0]).toBe(401);
    expect(send.mock.calls[0][1])
      .toMatchObject({ error: "Requires authorization" });
  });
});
