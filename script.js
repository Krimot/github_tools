// githubに複数枚貼り付けた画像のURLをMarkdownの表に変換する
document.getElementById('inputText').addEventListener('input', function() {
    var inputText = document.getElementById('inputText').value;
    var elements = inputText.split('\n').filter(function(element) {
        return element.trim() !== ''; // 空の行を削除
    });
    var header =  new Array(elements.length + 1).join('| ') + '|' ; // ヘッダー行（ | | | | ）を生成
    var outputLine = '|' + elements.join('|') + '|'; // 要素をMarkdownの表形式に変換( |111|222|333|444| )
    var outputText = header + '\n|' + new Array(elements.length + 1).join('---|') + '\n' + outputLine; // ヘッダー行と|---|---|---|と変換した要素を結合
    document.getElementById('outputText').innerText = outputText;
});

// 変換後のテキストをクリックしたらクリップボードにコピーする
document.getElementById('outputText').addEventListener('click', async function() {
    var outputText = document.getElementById('outputText').innerText;
    try {
        await navigator.clipboard.writeText(outputText);
        console.log('Text copied to clipboard');
    } catch (err) {
        console.error('Error in copy text: ', err);
    }
    
    // トースト表示の処理
    var toast = document.getElementById('toast');
    document.getElementById('toastContent').innerText = document.getElementById('outputText').innerText;
    toast.className = "toast show";
    setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
});
