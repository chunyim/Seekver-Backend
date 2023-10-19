// This Mongoose model has one-to-one relationship with User model. 
//It contains expiryDate field which value is set by adding config.jwtRefreshExpiration value above.
// There are 2 static methods:
// •	createToken: use uuid library for creating a random token and save new object into MongoDB database
// •	verifyExpiration: compare expiryDate with current Date time to check the expiration

const mongoose = require("mongoose");
const config = require("../config/auth.config");
const { v4: uuidv4 } = require('uuid');
 
const RefreshTokenSchema = new mongoose.Schema({
  token: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  expiryDate: Date,
});
 
RefreshTokenSchema.statics.createToken = async function (user) {
  let expiredAt = new Date();
 
  expiredAt.setSeconds(
    expiredAt.getSeconds() + config.jwtRefreshExpiration
  );
 
  let _token = uuidv4();
 
  let _object = new this({
    token: _token,
    user: user._id,
    expiryDate: expiredAt.getTime(),
  });
 
  console.log(_object);
 
  let refreshToken = await _object.save();
 
  return refreshToken.token;
};
 
RefreshTokenSchema.statics.verifyExpiration = (token) => {
  return token.expiryDate.getTime() < new Date().getTime();
}
 
const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);
 
module.exports = RefreshToken;
