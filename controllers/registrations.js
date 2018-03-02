const User = require('../models/user');

function newRoute(req, res) {
  res.render('registrations/new');
}

function createRoute(req, res, next) {
  User.create(req.body)
    .then(user => {
      req.session.userId = user._id;
      req.flash('success', `Welcome ${user.username}!`);
      res.redirect('/pictures');
    })
    .catch(next);
}

function showRoute(req,res, next) {
  User.findById(req.params.id)
    .populate('pictures')
    .populate('followers followers._id')
    .populate('followedUsers followedUsers._id')
    .then(user => {
      res.render('registrations/show', { user });
    })
    .catch(next);
}

function editRoute(req,res) {
  User.findById(req.params.id)
    .then(user => res.render('registrations/edit', { user }));
}

function deleteRoute(req,res) {
  User.findById(req.params.id)
    .populate('pictures')
    .then(user => {
      user.pictures.forEach(picture => {
        picture.remove();
      });
      user.remove();
    })
    .then(() => res.redirect('/'));
}

function updateRoute(req,res) {
  User.findById(req.params.id)
    .then(user => Object.assign(user, req.body))
    .then(user => user.save())
    .then(() => res.redirect(`/users/${req.params.id}`));
}

function followersCreateRoute(req,res,next) {
  User.findById(req.currentUser)
    .then(user => {
      user.followedUsers.push(req.params.id);
      return user.save();
    });
  User.findById(req.params.id)
    .then(user =>  {
      user.followers.push(req.currentUser);
      return user.save();
    })
    .then(() => res.redirect(`/users/${req.params.id}`))
    .catch(next);
}

function followerShowRoute(req,res,next) {
  User.findById(req.currentUser)
    .populate({
      path: 'followedUsersPics',
      populate: {
        path: 'user',
        model: 'User'
      }
    })
    .then(user => {
      user.followedUsersPics = user.followedUsersPics || [];
      user.followedUsersPics = user.followedUsersPics.reduce((flattened, pics) => {
        return flattened.concat(pics);
      }, []);
      // reduce, flatten and concatenate are being used to turn an array of both objects and arrays into a single array of objects
      res.render('followers/show', { user });
    })
    .catch(next);
}

function followersDeleteRoute(req,res,next) {
  User.findById(req.currentUser)
    .then(user => {
      const followedUser = user.followedUsers.id(req.params.id);
      followedUser.remove();
      return user.save();
    });
  User.findById(req.params.id)
    .then(user =>  {
      const follower = user.followers.id(req.currentUser);
      follower.remove();
      return user.save();
    })
    .then(() => res.redirect(`/users/${req.params.id}`))
    .catch(next);
}

module.exports = {
  new: newRoute,
  create: createRoute,
  show: showRoute,
  edit: editRoute,
  update: updateRoute,
  delete: deleteRoute,
  followersCreate: followersCreateRoute,
  followersShow: followerShowRoute,
  followersDelete: followersDeleteRoute
};
