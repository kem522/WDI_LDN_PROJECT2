const router = require('express').Router();
const pictures = require('../controllers/pictures');
const registrations = require('../controllers/registrations');
const sessions = require('../controllers/sessions');
const secureRoute = require('../lib/secureRoute');


router.get('/', (req,res) => res.render('pages/home'));

router.route('/pictures')
  .get(pictures.index)
  .post(secureRoute, pictures.create);

router.route('/pictures/new')
  .get(secureRoute, pictures.new);

router.route('/pictures/:id')
  .get(pictures.show)
  .put(secureRoute, pictures.update)
  .delete(secureRoute, pictures.delete);

router.route('/pictures/:id/comments')
  .post(secureRoute, pictures.commentsCreate);

router.route('/pictures/:id/comments/:commentId')
  .delete(secureRoute, pictures.commentsDelete);

router.route('/pictures/:id/likes')
  .post(secureRoute, pictures.likesCreate);

router.route('/pictures/:id/likes/:likeId')
  .delete(secureRoute, pictures.likesDelete);

router.route('/pictures/:id/edit')
  .get(secureRoute, pictures.edit);

router.route('/users/:id/follow')
  .post(secureRoute, registrations.followersCreate);

router.route('/users/:id/follow/:followingId')
  .delete(secureRoute, registrations.followersDelete);

router.route('/following')
  .get(secureRoute, registrations.followersShow);

router.route('/register')
  .get(registrations.new)
  .post(registrations.create);

router.route('/users/:id')
  .get(registrations.show)
  .put(secureRoute, registrations.update)
  .delete(secureRoute, registrations.delete);

router.route('/users/:id/edit')
  .get(secureRoute, registrations.edit);

router.route('/login')
  .get(sessions.new)
  .post(sessions.create);

router.route('/logout')
  .get(sessions.delete);

router.all('/*', (req,res) => res.render('pages/404'));

module.exports = router;
