import faker from "faker";
import fakeUserInfo from "../../../__test__/fake-user-info";
import makeApiAuth from "./post-api-auth";

describe("api-auth", () => {
  describe("when login is successful", () => {
    it("returns the user in the response", async () => {
      const password = faker.random.alphaNumeric(12);
      const fakeUser = fakeUserInfo({ password });
      const httpRequest = {
        body: {
          password,
          id: fakeUser.id,
        },
      };
      const mockResponse = {
        user: {
          id: fakeUser.id,
          email: (await fakeUser).email,
        },
        token: "token",
      };
      const loginUser = jest.fn();
      loginUser.mockReturnValueOnce(Promise.resolve(mockResponse));

      const apiAuth = makeApiAuth({ loginUser });
      const { body } = await apiAuth(httpRequest);
      expect(body).toMatchObject(mockResponse);
    });
  });
  describe("when the login fails", () => {
    it("returns a 401 status code and an error message", async () => {
      const httpRequest = {
        body: {
          id: faker.random.uuid(),
          password: faker.random.word(),
        },
      };

      const loginUser = jest.fn();
      loginUser.mockReturnValueOnce(Promise.resolve(null));
      const apiAuth = makeApiAuth({ loginUser });
      const response = await apiAuth(httpRequest);

      expect(response).toMatchObject({
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 401,
        body: {
          error: "Please check credentials",
        },
      });
    });
  });
});
