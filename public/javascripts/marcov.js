(function() {
  "use strict";

  function mecab() {
    $.ajax({
      url: '/markov/mecab',
      data: {
        input: document.getElementById('mecab-input').value
      },
    }).done((data, status, xhr) => {
      let r = data.result,
          result = document.getElementById('mecab-result'),
          table = document.createElement('table');
      if (r === undefined || r === null || r.length <= 0) return;

      $.ajax({
        url: '/markov/parse',
        data: {
          mecab: r
        },
      }).done((data, status, xhr) => {
        data.result.forEach(v => {
          let p = document.createElement('p');
          p.innerHTML = v;
          result.appendChild(p);
        });
        console.info(data);
      }).fail((data, status, error) => {
        console.info(data);
      });

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
