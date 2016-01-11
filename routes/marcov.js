var express = require('express'),
    router = express.Router(),
    MeCab = new require('mecab-async'),
    mecab = new MeCab();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('marcov', { title: '形態素解析' });
});

router.get('/mecab', (req, res, next) => {
  mecab.parse(req.query.input, (err, word) => {
    res.json({ "result": word });
  });
});

module.exports = router;
