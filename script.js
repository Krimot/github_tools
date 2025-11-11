document.getElementById('inputText').addEventListener('input', function() {
    convertText();
});

document.getElementById('sizeSlider').addEventListener('input', function() {
    document.getElementById('sliderValue').innerText = document.getElementById('sizeSlider').value + 'px';
    convertText();
});

let imageIsActive = false; // 初期モード(false)は表 trueは画像サイズ指定
let gridRows = 3;
let gridCols = 3;

// グリッドセルを生成
function initializeGrid() {
    const container = document.getElementById('gridContainer');
    container.innerHTML = '';

    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 6; col++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.row = row + 1;
            cell.dataset.col = col + 1;

            cell.addEventListener('mouseenter', function() {
                highlightGrid(parseInt(this.dataset.row), parseInt(this.dataset.col));
            });

            cell.addEventListener('click', function() {
                selectGrid(parseInt(this.dataset.row), parseInt(this.dataset.col));
            });

            container.appendChild(cell);
        }
    }
}

// グリッドをハイライト
function highlightGrid(rows, cols) {
    const cells = document.querySelectorAll('.grid-cell');
    cells.forEach(cell => {
        const cellRow = parseInt(cell.dataset.row);
        const cellCol = parseInt(cell.dataset.col);

        if (cellRow <= rows && cellCol <= cols) {
            cell.classList.add('active');
        } else {
            cell.classList.remove('active');
        }
    });

    document.getElementById('gridLabel').innerText = `${rows}×${cols}`;
}

// グリッドを選択
function selectGrid(rows, cols) {
    gridRows = rows;
    gridCols = cols;
    convertText();
}

// グリッドコンテナからマウスが離れたときの処理
document.getElementById('gridContainer').addEventListener('mouseleave', function() {
    highlightGrid(gridRows, gridCols);
});

function convertText() {
    var inputText = document.getElementById('inputText').value;
    var elements = inputText.split('\n').filter(function(element) {
        return element.trim() !== ''; // 空の行を削除
    });
    var outputText = '';

    if (imageIsActive === false) {
        // 表モード: 指定された行列数でテーブルを作成
        if (elements.length === 0) {
            outputText = "有効な文字列がありません";
        } else {
            var lines = [];

            // ヘッダー行
            var headerCells = new Array(gridCols).fill('').join('|');
            lines.push('|' + headerCells + '|');

            // 区切り行
            var separatorCells = new Array(gridCols).fill('---').join('|');
            lines.push('|' + separatorCells + '|');

            // データ行を作成
            for (var i = 0; i < elements.length; i += gridCols) {
                var rowElements = elements.slice(i, i + gridCols);
                // 列数に満たない場合は空セルで埋める
                while (rowElements.length < gridCols) {
                    rowElements.push(' ');
                }
                lines.push('|' + rowElements.join('|') + '|');
            }

            outputText = lines.join('\n');
        }
    } else if (imageIsActive === true) {
        // 画像サイズ指定モード
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
    const gridSelector = document.getElementById('gridSelector');
    const sizeSliderWrapper = document.getElementById('sizeSliderWrapper');

    if (imageIsActive) {
        toggleButton.classList.add('active');
        leftLabel.classList.remove('active');
        rightLabel.classList.add('active');
        gridSelector.style.display = 'none';
        sizeSliderWrapper.style.display = 'flex';
    } else {
        toggleButton.classList.remove('active');
        leftLabel.classList.add('active');
        rightLabel.classList.remove('active');
        gridSelector.style.display = 'flex';
        sizeSliderWrapper.style.display = 'none';
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

    // コピーしたことを知らせるためトーストを表示
    var toast = document.getElementById('toast');
    document.getElementById('toastContent').innerText = document.getElementById('outputText').innerText;
    toast.className = "toast show";
    setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
});

// ページ読み込み時にグリッドを初期化
initializeGrid();
highlightGrid(gridRows, gridCols);
