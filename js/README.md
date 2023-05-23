# このサイトで使用しているJavaScript

[readyState.js](../js/readyState.js)
* 位置情報API を使って デバイスの位置情報(緯度・経度)[^4] を取得
* リバースジオコーディング[^5] を使って座標を住所に変換する

[^4]:位置情報の取得と合わせて、位置情報を取得した日時をウェブストレージに記録します。
[^5]:[Mapboxのリバースジオコーディングを使って、座標(緯度・経度)を住所(地域、会社名、対象地など)に変換する](https://docs.mapbox.com/api/search/geocoding/#reverse-geocoding)


[submit.js](../js/submit.js)
* ウェブストレージ(localStorage) に 位置情報 を 保存
* PHP で CSVファイル に 位置情報 の 投稿を追加する

[localStorage.js](../js/localStorage.js)
* ウェブストレージ(localStorage) から 位置情報 を 取得
* 位置情報の投稿をオブジェクトに変換し GeoJSON に 追加する

---

[markers.js](../js/markers.js)
* 地図に追加するマーカーの情報を記述する GeoJSONファイル

[polygon.js](../js/polygon.js)
* 地図に追加するポリゴンの情報を記述する GeoJSONファイル

***

ブラウザがウェブストレージに対応済みかつ使用可能であるかを検出する関数
```
function storageAvailable(type) {
  var storage;
  try {
    storage = window[type];
    var x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch(e) {
    return e instanceof DOMException && (
      e.code === 22 ||
      e.code === 1014 ||
      e.name === 'QuotaExceededError' ||
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    ) && (storage && storage.length !== 0);
  }
}
```
```
if (!storageAvailable('localStorage')) {
  // ローカルストレージが利用できない場合
}
```

---

ブラウザが位置情報サービスを利用できるかを確認するコード
```
if (!'geolocation' in navigator) {
  /* geolocation が使用不可 */
}
```
