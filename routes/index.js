var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'pollseedの孤独技術ホームページ' });
});

module.exports = router;
