const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.header("Token");

  if (!token)
    return res.status(401).json("Access Denied , you're not authenticated!");

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;

    next();
  } catch (error) {
    res.status(400).json("Invalid Token");
  }
}

function verifyTokenAndAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.role === "admin") {
      next();
    } else {
      res.status(403).json("You are not allowed to perform this action ");
    }
  });
}

module.exports = {
  verifyToken,
  verifyTokenAndAdmin,
};
