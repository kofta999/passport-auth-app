const isLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.sendStatus(401);

export {
  isLoggedIn
};