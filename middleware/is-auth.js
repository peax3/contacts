const jwt = require("jsonwebtoken");

// @desc    check if th user is authenticated
exports.isAuth = (req, res, next) => {
  // retrieve token from header
  const authHeader = req.get("Authorization");
  // if there is no token - error
  if (!authHeader) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const token = authHeader.split(" ")[1];
  try {
    // else - unsign token and retrieve payload
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    // if token not valid - error
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    // else next()
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "server error" });
  }
};
