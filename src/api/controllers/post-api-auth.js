import logger from "../../logger";

const makeApiAuth = ({ loginUser }) => async httpRequest => {
  const headers = {
    "Content-Type": "application/json",
  };

  let statusCode = 401;
  let responseBody = { error: "Please check credentials" };

  try {
    const { id, password } = httpRequest.body;
    const user = await loginUser({ id, password });

    if (user) {
      const token = "token"; // TODO: need real jwts at some point...
      statusCode = 200;
      responseBody = { ...user, token };
    }
  } catch (e) {
    logger.error(e.message);
  }

  return {
    headers,
    statusCode,
    body: responseBody,
  };
};

export default makeApiAuth;
