(function() {
  "use strict";

  function nlp() {
    $('.spinner').show();
    let count = document.getElementById('nlp-count'),
        input = document.getElementById('nlp-input').value;
    count.innerHTML = input.length;

    kuromoji.builder({ dicPath: '/dict' }).build((err, tokenizer) => {
      let path = tokenizer.tokenize(input), data = [];
      console.info(path);
      path.forEach(v => { data.push(v.surface_form); })
      requestParse(data, input.length);
    });

    /*
    $.ajax({
      //url: '/markov/nlp',
      url: '/markov/kuromoji',
      data: {
        input: input
      },
    }).done((data, status, xhr) => {
      requestParse(data, input.length);

      // create table header
      /*
      createTh(
        ['表層系', '品詞', '品詞細分類1', '品詞細分類2', '品詞細分類3', '活用形', '活用型', '原形', '読み', '発音'],
        table.insertRow(-1));

      data.result.forEach(v => {
          let row = table.insertRow(-1);
          v.forEach(e => {
            row.insertCell(-1).innerHTML = e;
          });
      });
      result.appendChild(table);
    }).fail((data, status, error) => {
      console.log(`${status}: ${error}`);
    });
    */
  }

  /**
   * nlpによって分割された単語ベースに要約処理.
   * ※ただし、圧縮率が1.0以上の場合に再度サーバにマルコフ連鎖処理
   *
   * @param data サーバから渡されたnlpオブジェクト
   * @param inputLen インプットの長さ
   */
  function requestParse(r, inputLen) {
    let result = document.getElementById('nlp-result'),
        count = document.getElementById('nlp-result-count');
        // table = document.createElement('table');
    if (r === undefined || r === null || r.length <= 0) return;

    $.ajax({
      url: '/markov/parse',
      data: {
        nlp: r
      },
    }).done((data, status, xhr) => {
      let p = document.createElement('p'),
          r = data.result, rLen;
      if (!validation(data.status)) {
        removeFirstChild(result);
        $('.spinner').hide();
        return;
      }

      r = data.result.join('');
      rLen = r.length;

      // 圧縮率が1.0以下でないと表示する意味はない
      if (inputLen <= rLen) return nlp();

      p.innerHTML = r;
      removeFirstChild(result);
      result.appendChild(p);
      count.innerHTML = `${rLen} (圧縮率: ${100 - (Math.round((rLen / inputLen) * 10000) / 100)} %)`;
      console.info(data);
      $('.spinner').hide();
    }).fail((data, status, error) => {
      console.info(data);
    });
  }

  function removeFirstChild(result) {
    if (result.firstChild !== null) result.removeChild(result.firstChild);
  }

  function validation(status) {
    if (status == 200) return true;

    let msg = '';
    if (status == 400) {
      msg = "与えられた文字列が不正です。再度入力して下さい。";
    } else if (status == 404) {
      msg = "文字数が多すぎます。500文字以内にして下さい。"
    } else {
      return true;
    }

    let p = document.createElement('p'),
        result = document.getElementById('nlp-result');
    p.style.color = "#F78181";
    p.innerHTML = msg;
    result.appendChild(p);
    return false;
  }

  /**
   * 渡された配列のthタグを生成してtrタグに突っ込む.
   *
   * @param arr thタグに入れるヘッダ配列
   * @param tr ヘッダオブジェ
   */
  function createTh(arr, tr) {
    arr.forEach(v => {
      let th = document.createElement('th');
      th.innerHTML = v;
      tr.appendChild(th);
    });
  }

  function load() {
    $('.spinner').hide();
    let nlp_input = document.getElementById('nlp-input');
    nlp_input.addEventListener('blur', nlp, false);
  }
  document.addEventListener('DOMContentLoaded', load, false);
}());
