"use strict";

var express = require('express'),
    router = express.Router(),
    MeCab = new require('mecab-async'),
    mecab = new MeCab();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('markov', { title: '形態素解析' });
});

router.get('/mecab', (req, res, next) => {
  mecab.wakachi(req.query.input, (err, word) => {
    console.log(word);
    res.json({ "result": word });
  });
});

router.get('/parse', (req, res, next) => {
  var mecab = req.query.mecab;
  if (mecab === undefined || mecab === null) res.json({ "result": "" });
  var marcov = MalcovHelper.process(mecab);
  console.log(marcov);
  res.json({ "result": marcov });

});

class MalcovHelper {
  static process(keys) {
    var tmp = [keys[0], keys[1]], result = [], marcov;
    console.log('process tmp: ' + tmp);
    var cnt = 0;
    while ("EOL" != marcov) {
      var k1 = tmp[0], k2 = tmp[1];
      var builder = new MalcovBuilder()
      builder.build(keys);
      marcov = builder.getValue(k1,k2);

      tmp = [];
      tmp.push(k2);
      tmp.push(marcov);
      result.push(k1);
    }
    return result.concat(tmp);
  }
}
class MalcovBuilder {
  build(keys) {
    keys.push('EOL');
    var candidate = [];
    for (var i = 0; i < keys.length - 2; i++) {
      var malcov = new Malcov(keys[i], keys[i+1], keys[i+2]);
      candidate.push(malcov);
    }
    this.marcovVO = candidate;
  }
  getValue(k1, k2) {
    var candidate = [];
    this.marcovVO.forEach( v => {
      if (k1 == v.k1 && k2 == v.k2) {
        candidate.push(v);
      }
    });
    return candidate[Math.floor(Math.random() * candidate.length)].v;
  }
}
class Malcov {
  constructor(k1,k2,v) {
    this.k1 = k1;
    this.k2 = k2;
    this.v = v;
  }
}

module.exports = router;
