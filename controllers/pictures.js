const Picture = require('../models/picture.js');

function indexRoute(req,res, next) {
  Picture.find()
    .populate('user')
    .then(pictures => res.render('pictures/index', { pictures }))
    .catch(next);
}

function newRoute(req,res) {
  res.render('pictures/new');
}

function createRoute(req,res) {
  req.body.user = req.currentUser;
  Picture.create(req.body)
    .then(() => res.redirect('/pictures'));
}

function showRoute(req,res, next) {
  Picture.findById(req.params.id)
    .populate('comments.user')
    .populate('likes.user')
    .populate('user')
    .then(picture => {
      res.render('pictures/show', { picture });
    })
    .catch(next);
}

function editRoute(req,res) {
  Picture.findById(req.params.id)
    .then(picture => res.render('pictures/edit', { picture }));
}

function updateRoute(req,res) {
  Picture.findById(req.params.id)
    .then(picture => Object.assign(picture, req.body))
    .then(picture => picture.save())
    .then(() => res.redirect(`/pictures/${req.params.id}`));
}

function deleteRoute(req,res) {
  Picture.findById(req.params.id)
    .then(picture => picture.remove())
    .then(() => res.redirect('/pictures'));
}

function commentsCreateRoute(req,res, next) {
  req.body.user = req.currentUser;
  Picture.findById(req.params.id)
    .then(picture => {
      picture.comments.push(req.body);
      return picture.save();
    })
    .then(picture => res.redirect(`/pictures/${picture._id}`))
    .catch(next);
}

function commentsDeleteRoute(req,res,next) {
  Picture.findById(req.params.id)
    .then(picture => {
      const comment = picture.comments.id(req.params.commentId);
      comment.remove();
      return picture.save();
    })
    .then(picture => res.redirect(`/pictures/${picture._id}`))
    .catch(next);
}

function likesCreateRoute(req,res,next) {
  req.body.user = req.currentUser;
  Picture.findById(req.params.id)
    .then(picture => {
      picture.likes.push(req.currentUser);
      return picture.save();
    })
    .then(picture => res.redirect(`/pictures/${picture._id}`))
    .catch(next);
}

function likesDeleteRoute(req,res,next) {
  Picture.findById(req.params.id)
    .then(picture => {
      const like = picture.likes.id(req.currentUser);
      like.remove();
      return picture.save();
    })
    .then(picture => res.redirect(`/pictures/${picture._id}`))
    .catch(next);
}

module.exports = {
  index: indexRoute,
  new: newRoute,
  create: createRoute,
  show: showRoute,
  edit: editRoute,
  update: updateRoute,
  delete: deleteRoute,
  commentsCreate: commentsCreateRoute,
  commentsDelete: commentsDeleteRoute,
  likesCreate: likesCreateRoute,
  likesDelete: likesDeleteRoute
};
