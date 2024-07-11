# github_tools

githubのコメント欄に画像をドラッグ&ドロップすると画像が幅いっぱいまで拡大された状態で表示される。

いちいちサイズ指定して貼り付けるのがめんどくさいので、サクッと変換できるようにした。

## 変換例

これが元テキスト

``` plaintext
![Screenshot_2023-01-23-23-45-14-92_fc5a9473197c3b42c961bb7b0322bc10](https://github.com/Krimot/github_tools/assets/105426647/c4b4ee9e-9647-453a-b0be-6e8fb88452ef)
![Screenshot_2023-01-23-23-45-34-03_fc5a9473197c3b42c961bb7b0322bc10](https://github.com/Krimot/github_tools/assets/105426647/090cc444-2d08-4e6c-a5aa-7e3456a355af)
![Screenshot_2023-01-23-23-45-31-87_fc5a9473197c3b42c961bb7b0322bc10](https://github.com/Krimot/github_tools/assets/105426647/ada0eafa-67e8-47c6-8e5e-2ce9c690771d)
![Screenshot_2023-01-23-23-45-18-30_fc5a9473197c3b42c961bb7b0322bc10](https://github.com/Krimot/github_tools/assets/105426647/9fa7400f-453b-43f2-8843-6da5ba357127)
![Screenshot_2023-01-23-23-45-23-18_fc5a9473197c3b42c961bb7b0322bc10](https://github.com/Krimot/github_tools/assets/105426647/447b887b-44e3-4bc3-a95a-adb1da488b1f)
```

↓

markdown形式の表に変換するとこうなる

``` plaintext
| | | | | |
|---|---|---|---|---|
|![Screenshot_2023-01-23-23-45-14-92_fc5a9473197c3b42c961bb7b0322bc10](https://github.com/Krimot/github_tools/assets/105426647/c4b4ee9e-9647-453a-b0be-6e8fb88452ef)|![Screenshot_2023-01-23-23-45-34-03_fc5a9473197c3b42c961bb7b0322bc10](https://github.com/Krimot/github_tools/assets/105426647/090cc444-2d08-4e6c-a5aa-7e3456a355af)|![Screenshot_2023-01-23-23-45-31-87_fc5a9473197c3b42c961bb7b0322bc10](https://github.com/Krimot/github_tools/assets/105426647/ada0eafa-67e8-47c6-8e5e-2ce9c690771d)|![Screenshot_2023-01-23-23-45-18-30_fc5a9473197c3b42c961bb7b0322bc10](https://github.com/Krimot/github_tools/assets/105426647/9fa7400f-453b-43f2-8843-6da5ba357127)|![Screenshot_2023-01-23-23-45-23-18_fc5a9473197c3b42c961bb7b0322bc10](https://github.com/Krimot/github_tools/assets/105426647/447b887b-44e3-4bc3-a95a-adb1da488b1f)|
```

imgタグのサイズを指定した場合はこうなる

``` plaintext
<img src="https://github.com/Krimot/github_tools/assets/105426647/c4b4ee9e-9647-453a-b0be-6e8fb88452ef" width="360px">
<img src="https://github.com/Krimot/github_tools/assets/105426647/090cc444-2d08-4e6c-a5aa-7e3456a355af" width="360px">
<img src="https://github.com/Krimot/github_tools/assets/105426647/ada0eafa-67e8-47c6-8e5e-2ce9c690771d" width="360px">
<img src="https://github.com/Krimot/github_tools/assets/105426647/9fa7400f-453b-43f2-8843-6da5ba357127" width="360px">
<img src="https://github.com/Krimot/github_tools/assets/105426647/447b887b-44e3-4bc3-a95a-adb1da488b1f" width="360px">
```

## おまけ

chrome拡張でこんなんもある。
https://chromewebstore.google.com/detail/imgconverter/pkgimcoeodgcdfnidhgijpopkfhbcomm?pli=1