const User = require('../models/user');

function userAuth(req, res, next) {

  if(!req.session.userId) return next();
  User
    .findById(req.session.userId)
    .then(user => {

      if(!user) req.session.regenerate(() => res.redirect('/login'));

      res.locals.isAuthenticated = true;
      res.locals.currentUser = user;

      req.currentUser = user;

      next();
    });
}

module.exports = userAuth;
