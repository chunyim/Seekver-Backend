const dbConfig = require("../config/db.config.js");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.user = require("./user.model");
db.role = require("./role.model");
db.ROLES = ["user", "admin", "moderator"];

db.url = dbConfig.url;

db.problems = require("./problem.model.js")(mongoose);
db.categories = require("./category.model.js")(mongoose);
db.applications = require("./application.model.js")(mongoose);
db.refreshToken = require("./refreshToken.model");

module.exports = db;