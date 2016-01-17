"use strict";

var express = require('express'),
    router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('markov', { title: '形態素解析' });
});

/*
 * nlp version.
var
    nlp = new require('nlp-async'),
    nlp = new nlp();
router.get('/nlp', (req, res, next) => {
  nlp.wakachi(req.query.input, (err, word) => {
    console.log(word);
    res.json({ "result": word });
  });
});
const DICT = "../node_modules/kuromoji/dist/dict/";
router.get('/kuromoji', (req, res, next) => {
  kuromoji.builder({ dicPath: DICT })
    .build((err, tokenizer) => {
      var input = req.query.input;
      var path = tokenizer.tokenize(input);
      console.log(path);
      res.json({ "result": path });
    });
});
*/

router.get('/parse', (req, res, next) => {
  var nlp = req.query.nlp;
  console.log('query: ' + nlp);
  if (nlp === undefined || nlp === null) res.json({ "result": "" });
  var markov = MalkovHelper.process(nlp);
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
