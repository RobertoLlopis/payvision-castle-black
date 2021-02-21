const AuthMiddleware = (req, res, next) => {
  const auth = { user: "rolmaster", password: "whowillwin?" };
  if (req.headers.authorization) {
    const b64auth = req.headers.authorization.split(" ")[1];
    const [user, password] = Buffer.from(b64auth, "base64")
      .toString()
      .split(":");
    if (user && password && user === auth.user && password === auth.password) {
      // Access granted
      return next();
    }
    res.status(401).send("Wrong credentials.");
    return;
  }
  // Access denied
  res.status(401).send("Basic Authentication header required.");
};

module.exports = {
  AuthMiddleware,
};
