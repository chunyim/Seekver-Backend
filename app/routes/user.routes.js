// To combine middlewares with controller functions 

// Define Routes – In the server side
// When a client sends request for an endpoint using HTTP request (GET, POST, PUT, DELETE), we need to determine 
// how the server will response by setting up the routes.
// We can separate our routes into 2 part: for Authentication and for Authorization (accessing protected resources).

// Authorization:
// •	GET /api/test/all
// •	GET /api/test/user for loggedin users (user/moderator/admin)
// •	GET /api/test/mod for moderator
// •	GET /api/test/admin for admin

const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
 
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });
 
  app.get("/api/test/all", controller.allAccess);
 
  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);
 
  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );
 
  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
};
