import path from "path";
import dotenv from "dotenv";
import merge from "lodash/merge";
import { existsSync } from "fs";


if (process.env.NODE_ENV !== "production") {
  const envConfigFile = path.join(__dirname, `./.env.${process.env.NODE_ENV}`);
  if (!existsSync(envConfigFile)) {
    throw new Error(`Expected config file not found: ${envConfigFile}`);
  }
  dotenv.config({ path: envConfigFile });
}

const config = {
  all: {
    env: process.env.NODE_ENV || "development",
    root: path.join(__dirname, "../.."),
    port: process.env.PORT || 3000,
    ip: process.env.IP || "0.0.0.0",
    apiRoot: process.env.API_ROOT || "/api",
    apiKey: process.env.API_KEY,
    domain: process.env.DOMAIN || "jwtuserauth.rnickerson.com",
    minPasswordLength: process.env.MIN_PWD_LENGTH || 10,
  },
  test: {
    adminApiKey: process.env.ADMIN_API_KEY || "ABCD12345",
    mongo: {
      uri: process.env.MONGO_URI || "mongodb://localhost",
      dbName: process.env.MONGO_DBNAME || "jwt-user-auth-test",
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    },
  },
  development: {
    adminApiKey: process.env.ADMIN_API_KEY || "ABCD12345",
    mongo: {
      uri: process.env.MONGO_URI || "mongodb://localhost",
      dbName: process.env.MONGO_DBNAME || "jwt-user-auth-dev",
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    },
  },
  production: {
    adminApiKey: process.env.ADMIN_API_KEY || undefined,
    apiKey: process.env.API_KEY || undefined,
    ip: process.env.IP || undefined,
    port: process.env.PORT || 8080,
  },
};

module.exports = merge(config.all, config[config.all.env]);
export default module.exports;
