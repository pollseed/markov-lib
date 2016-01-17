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
  console.log('query: ' + mecab);
  if (mecab === undefined || mecab === null) res.json({ "result": "" });
  var markov = MalkovHelper.process(mecab);
  console.log(markov);
  res.json({ "result": markov });
});

class MalkovHelper {
  static process(keys) {
    var tmp = [keys[0], keys[1]], result = [], markov;
    console.log('process tmp: ' + tmp);
    var cnt = 0;
    while ("EOL" != markov) {
      var k1 = tmp[0], k2 = tmp[1];
      var builder = new MalkovBuilder()
      builder.build(keys);
      markov = builder.getValue(k1,k2);

      tmp = [];
      tmp.push(k2);
      tmp.push(markov);
      result.push(k1);
    }
    result = result.concat(tmp);
    result.pop();
    return result;
  }
}
class MalkovBuilder {
  build(keys) {
    keys.push('EOL');
    var candidate = [];
    for (var i = 0; i < keys.length - 2; i++) {
      var malkov = new Malkov(keys[i], keys[i+1], keys[i+2]);
      candidate.push(malkov);
    }
    this.markovVO = candidate;
  }
  getValue(k1, k2) {
    var candidate = [];
    this.markovVO.forEach( v => {
      if (k1 == v.k1 && k2 == v.k2) {
        candidate.push(v);
      }
    });
    return candidate[Math.floor(Math.random() * candidate.length)].v;
  }
}
class Malkov {
  constructor(k1,k2,v) {
    this.k1 = k1;
    this.k2 = k2;
    this.v = v;
  }
}

module.exports = router;
