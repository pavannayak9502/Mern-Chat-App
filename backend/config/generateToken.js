//To generate we need jwt(json-web-token). npm install jsonwebtoken

const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  //jwt.sign({id}, "SecretToken", expiresToken).
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

module.exports = generateToken;
