var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect(302, '/index.html');
});

router.get('/v1', function (req, res, next) {
  res.redirect(302, './index_v1.html');
});

router.get('/v2', function (req, res, next) {
  res.redirect(302, './index_v2.html');
});

router.get('/nvp', function (req, res, next) {
  res.redirect(302, './index_nvp.html');
});

router.get('/ba', function (req, res, next) {
  res.redirect(302, './index_ba.html');
});


module.exports = router;
