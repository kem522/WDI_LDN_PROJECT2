const User = require('../models/user');

function newRoute(req,res) {
  res.render('sessions/new');
}

function createRoute(req, res, next) {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user || !user.validatePassword(req.body.password)) {
        req.flash('danger', 'Invalid Password');
        return res.redirect('/');
      }

      req.session.userId = user._id;
      req.flash('success', `Welcome back ${user.username}!`);
      res.redirect('/pictures');
    })
    .catch(next);
}

function deleteRoute(req,res) {
  req.session.regenerate(() => res.redirect('/'));
}


module.exports = {
  new: newRoute,
  create: createRoute,
  delete: deleteRoute
};
