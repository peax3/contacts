const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");

// @desc    check if th user is authenticated
exports.isAuth = (req, res, next) => {
  // retrieve token from header
  const authHeader = req.get("Authorization");
  // if there is no token - error
  if (!authHeader) {
    return next(new ErrorResponse("Not authenticated", 401));
  }

  const token = authHeader.split(" ")[1];
  try {
    // else - unsign token and retrieve payload
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    // if token not valid - error
    if (!token) {
      return next(new ErrorResponse("Not authenticated", 401));
    }
    // else next()
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    return next(new ErrorResponse("Not authenticated", 401));
  }
};
