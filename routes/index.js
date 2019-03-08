var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect(302, '/index.html');
});

router.get('/ordersV2', function (req, res, next) {
  res.redirect(302, './index_orders_v2.html');
});


module.exports = router;
