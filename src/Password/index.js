import bcrypt from "bcryptjs";
import generator from "generate-password";

// eslint-disable-next-line import/named
import { minPasswordLength } from "../config";

const makePassword = ({
  length = minPasswordLength,
  numbers = false,
  symbols = false,
  uppercase = false,
  exclude = "",
  excludeSimilarCharacters = false,
}) => generator.generate({
  length,
  numbers,
  symbols,
  uppercase,
  exclude,
  excludeSimilarCharacters,
});

const hashPassword = async ({ password, salt = 10 }) => {
  if (minPasswordLength > password.length) {
    throw new Error(`Password must be at least ${minPasswordLength} characters long`);
  }
  return bcrypt.hash(password, salt);
};

const validatePassword = async ({
  password,
  passwordHash,
}) => bcrypt.compare(password, passwordHash);

const Password = Object.freeze({
  makePassword,
  hashPassword,
  validatePassword,
});

export default Password;
