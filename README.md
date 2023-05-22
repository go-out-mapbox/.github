# This is a Collection of Location You have clicked "I'm Here" on This Site and more.

このサイトに投稿された位置情報を ウェブストレージ[^1] と CSV に保存し、私たちがいた場所のコレクションを制作します。

[^1]:ウェブストレージは、ユーザーのローカル環境(ブラウザ)にデータを保存する仕組みです。
ブラウザがプライベートモード・シークレットウインドウの場合や、閲覧履歴（キャッシュ）を消去した場合などは、ウェブストレージに保存されたデータは削除されます。

---

## This Site Creates a Collection of Where We Were (Device Locations) with Mapbox GL JS.

[このページ](profile/)には、あなたのウェブストレージに保存された位置情報[^2] が表示されます。
[^2]:ウェブストレージAPIが利用できないブラウザは、このページを閲覧できません。

[位置情報API](geolocation/)[^3]
[^3]:位置情報APIが利用できないブラウザは、このページを閲覧できません。

***

### How to Coding
[The Website that Build on top of Mapbox GL JS](https://go-out-mapbox.github.io/)
* Mapbox GL JS を 使って カスタム地図アプリケーション を作る
* Mapbox GL JS に カスタムマーカー と ポップアップ を追加する

---

[readyState.js](js/readyState.js)
* 位置情報API を使って デバイスの位置情報(緯度・経度)[^4] を取得
* Mapbox の リバースジオコーディング[^5] を使って 緯度・経度を変換

[^4]:位置情報の取得と合わせて、位置情報を取得した日時をウェブストレージに記録します。
[^5]:[リバースジオコーディングは、座標(緯度・経度)を人が読める住所(地域、会社名、対象地など)に変換するプロセスです。](https://docs.mapbox.com/api/search/geocoding/#reverse-geocoding)

[submit.js](js/submit.js)
* ウェブストレージ(localStorage) に 位置情報 を 保存
* PHP で CSVファイル に 位置情報 の 投稿を追加する

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
if (storageAvailable('localStorage')) {
  // ローカルストレージが利用できる場合
} else {
  // ローカルストレージが利用できない場合
}
```

ブラウザが位置情報サービスを利用できるかを確認するコード
```
if('geolocation' in navigator) {
  /* geolocation が使用可能 */
} else {
  /* geolocation が使用不可 */
}
```
