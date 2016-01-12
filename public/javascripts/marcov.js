(function() {
  "use strict";

  function mecab() {
    let count = document.getElementById('mecab-count'),
        input = document.getElementById('mecab-input').value;
    count.innerHTML = input.length;
    $.ajax({
      url: '/markov/mecab',
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
      */
    }).fail((data, status, error) => {
      console.log(`${status}: ${error}`);
    });
  }

  /**
   * mecabによって分割された単語ベースに要約処理.
   * ※ただし、圧縮率が1.0以上の場合に再度サーバにマルコフ連鎖処理
   *
   * @param data サーバから渡されたmecabオブジェクト
   * @param inputLen インプットの長さ
   */
  function requestParse(data, inputLen) {
    let r = data.result,
        result = document.getElementById('mecab-result'),
        count = document.getElementById('mecab-result-count');
        // table = document.createElement('table');
    if (r === undefined || r === null || r.length <= 0) return;

    $.ajax({
      url: '/markov/parse',
      data: {
        mecab: r
      },
    }).done((data, status, xhr) => {
      let p = document.createElement('p'),
          r = data.result.join(''),
          rLen = r.length;

      // 圧縮率が1.0以下でないと表示する意味はない
      if (inputLen <= rLen) return mecab();

      p.innerHTML = r;
      if (result.firstChild !== null) result.removeChild(result.firstChild);
      result.appendChild(p);
      count.innerHTML = `${rLen} (圧縮率: ${100 - (Math.round((rLen / inputLen) * 10000) / 100)} %)`;
      console.info(data);
    }).fail((data, status, error) => {
      console.info(data);
    });
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
    let mecab_input = document.getElementById('mecab-input');
    mecab_input.addEventListener('blur', mecab, false);
  }
  document.addEventListener('DOMContentLoaded', load, false);
}());
