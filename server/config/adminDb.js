const mongoose = require("mongoose");

const ADMIN_DB_NAME = process.env.ADMIN_DB_NAME || "cleanstreet_admins";

let adminConnection = null;
let adminMongoUri = null;
let hasLoggedAdminDbError = false;

function buildAdminMongoUri() {
  if (process.env.ADMIN_MONGO_URI) {
    return process.env.ADMIN_MONGO_URI;
  }

  const baseUri = process.env.MONGO_URI;
  if (!baseUri) {
    throw new Error("MONGO_URI is not configured");
  }

  try {
    const parsed = new URL(baseUri);
    parsed.pathname = `/${ADMIN_DB_NAME}`;
    return parsed.toString();
  } catch (err) {
    const replaced = baseUri.replace(/\/([^/?]+)(\?|$)/, `/${ADMIN_DB_NAME}$2`);
    return replaced === baseUri ? `${baseUri}/${ADMIN_DB_NAME}` : replaced;
  }
}

function getAdminMongoUri() {
  if (!adminMongoUri) {
    adminMongoUri = buildAdminMongoUri();
  }
  return adminMongoUri;
}

function getAdminConnection() {
  if (adminConnection) {
    return adminConnection;
  }

  const uri = getAdminMongoUri();
  adminConnection = mongoose.createConnection(uri);

  adminConnection.on("error", (error) => {
    if (!hasLoggedAdminDbError) {
      hasLoggedAdminDbError = true;
      console.error("Admin MongoDB connection error:", error.message);
    }
  });

  return adminConnection;
}

function initAdminDb() {
  const connection = getAdminConnection();
  connection
    .asPromise()
    .then(() => {
      console.log("Admin MongoDB connected");
    })
    .catch((error) => {
      console.error("Admin MongoDB connection failed:", error.message);
    });
}

module.exports = {
  getAdminConnection,
  getAdminMongoUri,
  initAdminDb,
};
