document.getElementById('inputText').addEventListener('input', function() {
    convertText();
});

document.getElementById('sizeSlider').addEventListener('input', function() {
    document.getElementById('sliderValue').innerText = document.getElementById('sizeSlider').value + 'px';
    convertText();
});

let imageIsActive = false; // 初期モード(false)は表 trueは画像サイズ指定

function convertText() {
    var inputText = document.getElementById('inputText').value;
    var elements = inputText.split('\n').filter(function(element) {
        return element.trim() !== ''; // 空の行を削除
    });
    var outputText = '';

    if (imageIsActive === false) {
        var header = new Array(elements.length + 1).join('| ') + '|';
        var outputLine = '|' + elements.join('|') + '|';
        outputText = header + '\n|' + new Array(elements.length + 1).join('---|') + '\n' + outputLine;
    } else if (imageIsActive === true) {
        var size = document.getElementById('sizeSlider').value;
        var urlRegex = /\((https?:\/\/[^\s)]+)\)/; // URLを抽出する正規表現
        var mappedElements = elements.map(function(element) {
            var match = element.match(urlRegex);
            return match ? `<img src="${match[1]}" width="${size}px">` : '';
        });

        outputText = mappedElements.join('\n');

        // URLが含まれていない場合のメッセージ
        if (!mappedElements.some(element => element !== '')) {
            outputText = "画像URLがありません";
        }
    }

    document.getElementById('outputText').innerText = outputText;
}

function toggleSwitch() {
    imageIsActive = !imageIsActive;

    const toggleButton = document.querySelector('.toggle-btn');
    const leftLabel = document.querySelector('.left-label');
    const rightLabel = document.querySelector('.right-label');

    if (imageIsActive) {
        toggleButton.classList.add('active');
        leftLabel.classList.remove('active');
        rightLabel.classList.add('active');
    } else {
        toggleButton.classList.remove('active');
        leftLabel.classList.add('active');
        rightLabel.classList.remove('active');
    }
    convertText(); // トグルの状態を変更した後に変換を実行
}

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
