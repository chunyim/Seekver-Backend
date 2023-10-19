// Controller for Registration, Login, Logout
// There are 3 main functions for Authentication:
// - signup: create new User in MongoDB database (role is user if not specifying role)
// - signin:
// •	find username of the request in database, if it exists
// •	compare password with password in database using bcrypt, if it is correct
// •	generate a token using jsonwebtoken
// •	return user information & access Token
// - signout: clear current session.

//  Node.js Express Rest API for JWT Refresh Token
// •	update the method for /signin endpoint with Refresh Token
// •	expose the POST API for creating new Access Token from received Refresh Token


const config = require("../config/auth.config");
const db = require("../models");

const { user: User, role: Role, refreshToken: RefreshToken } = db;
// const User = db.user;
// const Role = db.role;
 
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
 
//sign up
exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });
 
  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
 
    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
 
          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
 
            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
 
        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
 
          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
};
 
//sign in
exports.signin = (req, res) => {
    User.findOne({
      username: req.body.username,
    })
      .populate("roles", "-__v")
      .exec(async (err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
   
        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }
   
        let passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
   
        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!",
          });
        }
   
        let token = jwt.sign({ id: user.id }, config.secret, {
          expiresIn: config.jwtExpiration,
        });
   
        let refreshToken = await RefreshToken.createToken(user);
   
        let authorities = [];
   
        for (let i = 0; i < user.roles.length; i++) {
          authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user._id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
          refreshToken: refreshToken,
        });
      });
  };
   
  //refresh token

//   In refreshToken() function:
// •	Firstly, we get the Refresh Token from request data
// •	Next, get the RefreshToken object {id, user, token, expiryDate} from raw Token using RefreshToken model static method
// •	We verify the token (expired or not) basing on expiryDate field. If the Refresh Token was expired, remove it from MongoDB database and return message
// •	Continue to use user _id field of RefreshToken object as parameter to generate new Access Token using jsonwebtoken library
// •	Return { new accessToken, refreshToken } if everything is done
// •	Or else, send error message

  exports.refreshToken = async (req, res) => {
    const { refreshToken: requestToken } = req.body;
   
    if (requestToken == null) {
      return res.status(403).json({ message: "Refresh Token is required!" });
    }
   
    try {
      let refreshToken = await RefreshToken.findOne({ token: requestToken });
   
      if (!refreshToken) {
        res.status(403).json({ message: "Refresh token is not in database!" });
        return;
      }
   
      if (RefreshToken.verifyExpiration(refreshToken)) {
        RefreshToken.findByIdAndRemove(refreshToken._id, { useFindAndModify: false }).exec();
       
        res.status(403).json({
          message: "Refresh token was expired. Please make a new signin request",
        });
        return;
      }
   
      let newAccessToken = jwt.sign({ id: refreshToken.user._id }, config.secret, {
        expiresIn: config.jwtExpiration,
      });
   
      return res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: refreshToken.token,
      });
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  };

  //sign out
  exports.signout = async (req, res) => {
    try {
      req.session = null;
      return res.status(200).send({ message: "You've been signed out!" });
    } catch (err) {
      this.next(err);
    }
  };
  