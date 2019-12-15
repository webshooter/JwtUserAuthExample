import buildAdminApi from "./api-admin";

import { adminApiKey } from "../../config";

const adminApi = buildAdminApi({ adminApiKey });

export default adminApi;