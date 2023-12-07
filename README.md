# github_tools

githubに画像を貼り付ける時の処理がめんどくさいので、サクッと変換できるようにした。

これが
```
![Screenshot_2023-01-23-23-45-14-92_fc5a9473197c3b42c961bb7b0322bc10](https://github.com/Krimot/github_tools/assets/105426647/c4b4ee9e-9647-453a-b0be-6e8fb88452ef)
![Screenshot_2023-01-23-23-45-34-03_fc5a9473197c3b42c961bb7b0322bc10](https://github.com/Krimot/github_tools/assets/105426647/090cc444-2d08-4e6c-a5aa-7e3456a355af)
![Screenshot_2023-01-23-23-45-31-87_fc5a9473197c3b42c961bb7b0322bc10](https://github.com/Krimot/github_tools/assets/105426647/ada0eafa-67e8-47c6-8e5e-2ce9c690771d)
![Screenshot_2023-01-23-23-45-18-30_fc5a9473197c3b42c961bb7b0322bc10](https://github.com/Krimot/github_tools/assets/105426647/9fa7400f-453b-43f2-8843-6da5ba357127)
![Screenshot_2023-01-23-23-45-23-18_fc5a9473197c3b42c961bb7b0322bc10](https://github.com/Krimot/github_tools/assets/105426647/447b887b-44e3-4bc3-a95a-adb1da488b1f)
```

↓

こうなる

```
| | | | | |
|---|---|---|---|---|
|![Screenshot_2023-01-23-23-45-14-92_fc5a9473197c3b42c961bb7b0322bc10](https://github.com/Krimot/github_tools/assets/105426647/c4b4ee9e-9647-453a-b0be-6e8fb88452ef)|![Screenshot_2023-01-23-23-45-34-03_fc5a9473197c3b42c961bb7b0322bc10](https://github.com/Krimot/github_tools/assets/105426647/090cc444-2d08-4e6c-a5aa-7e3456a355af)|![Screenshot_2023-01-23-23-45-31-87_fc5a9473197c3b42c961bb7b0322bc10](https://github.com/Krimot/github_tools/assets/105426647/ada0eafa-67e8-47c6-8e5e-2ce9c690771d)|![Screenshot_2023-01-23-23-45-18-30_fc5a9473197c3b42c961bb7b0322bc10](https://github.com/Krimot/github_tools/assets/105426647/9fa7400f-453b-43f2-8843-6da5ba357127)|![Screenshot_2023-01-23-23-45-23-18_fc5a9473197c3b42c961bb7b0322bc10](https://github.com/Krimot/github_tools/assets/105426647/447b887b-44e3-4bc3-a95a-adb1da488b1f)|
```



### そのうちやりたいこと

画像１枚だけのときはimg tagに変換する。大きさも指定できるようにする。


chrome拡張でこんなんもある。
https://chromewebstore.google.com/detail/imgconverter/pkgimcoeodgcdfnidhgijpopkfhbcomm?pli=1