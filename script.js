document.getElementById('inputText').addEventListener('input', function() {
    autoAdjustColumns();
    convertText();
});

document.getElementById('sizeSlider').addEventListener('input', function() {
    document.getElementById('sliderValue').innerText = document.getElementById('sizeSlider').value + 'px';
    convertText();
});

let imageIsActive = false; // 初期モード(false)は表 trueは画像サイズ指定
let gridRows = 1;
let gridCols = 2;
let isManuallySet = false; // 手動で変更されたかどうかのフラグ
let currentGridCols = 6; // 現在表示している列数
let currentGridRows = 6; // 現在表示している行数
const MAX_COLS = 12;
const MAX_ROWS = 24;

// グリッドセルを生成
function initializeGrid() {
    const container = document.getElementById('gridContainer');
    container.innerHTML = '';

    for (let row = 0; row < currentGridRows; row++) {
        for (let col = 0; col < currentGridCols; col++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.row = row + 1;
            cell.dataset.col = col + 1;

            cell.addEventListener('mouseenter', function() {
                const cellRow = parseInt(this.dataset.row);
                const cellCol = parseInt(this.dataset.col);

                // 端に近づいたらグリッドを拡張
                if (cellCol >= currentGridCols - 1 && currentGridCols < MAX_COLS) {
                    currentGridCols = Math.min(cellCol + 2, MAX_COLS);
                    expandGrid();
                }
                if (cellRow >= currentGridRows - 1 && currentGridRows < MAX_ROWS) {
                    currentGridRows = Math.min(cellRow + 2, MAX_ROWS);
                    expandGrid();
                }

                highlightGrid(cellRow, cellCol);
            });

            cell.addEventListener('click', function() {
                selectGrid(parseInt(this.dataset.row), parseInt(this.dataset.col));
            });

            container.appendChild(cell);
        }
    }

    updateGridContainerStyle();
}

// グリッドを拡張
function expandGrid() {
    initializeGrid();
}

// グリッドコンテナのスタイルを更新
function updateGridContainerStyle() {
    const container = document.getElementById('gridContainer');
    container.style.gridTemplateColumns = `repeat(${currentGridCols}, 20px)`;
    container.style.gridTemplateRows = `repeat(${currentGridRows}, 20px)`;
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

    document.getElementById('gridLabel').innerText = `${cols}列 × ${rows}行 ▼`;
}

// グリッドを選択
function selectGrid(rows, cols) {
    gridRows = rows;
    gridCols = cols;
    isManuallySet = true; // 手動で変更されたことを記録
    updateGridLabel();
    convertText();
    toggleGridDropdown(); // 選択後にグリッドを閉じる
}

// グリッドラベルを更新
function updateGridLabel() {
    document.getElementById('gridLabel').innerText = `${gridCols}列 × ${gridRows}行 ▼`;
}

// グリッドコンテナからマウスが離れたときの処理
document.getElementById('gridContainer').addEventListener('mouseleave', function() {
    highlightGrid(gridRows, gridCols);
});

// ドロップダウンの開閉
function toggleGridDropdown() {
    const container = document.getElementById('gridContainer');
    const isVisible = container.style.display !== 'none';

    if (isVisible) {
        container.style.display = 'none';
        // 閉じたときにグリッドを初期サイズにリセット
        currentGridCols = 6;
        currentGridRows = 6;
        initializeGrid();
    } else {
        container.style.display = 'grid';
        highlightGrid(gridRows, gridCols);
    }
}

// 入力内容に応じて自動的に列数を調整
function autoAdjustColumns() {
    if (isManuallySet || imageIsActive) {
        return; // 手動変更済みまたは画像モードの場合は調整しない
    }

    var inputText = document.getElementById('inputText').value;
    var elements = inputText.split('\n').filter(function(element) {
        return element.trim() !== '';
    });

    var count = elements.length;

    if (count === 0) {
        gridCols = 2;
        gridRows = 1;
    } else if (count <= 6) {
        // 6個以下は1行で表示
        gridCols = count;
        gridRows = 1;
    } else {
        // 7個以上は6列で折り返し
        gridCols = 6;
        gridRows = Math.ceil(count / 6);
    }

    updateGridLabel();
}

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
            var headerCells = new Array(gridCols).fill('  ').join('|');
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

    // HTMLタグをエスケープしてから改行記号を追加
    var escapedText = outputText
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    var displayText = escapedText.replace(/\n/g, '<span class="newline-symbol">⏎</span>\n');
    document.getElementById('outputText').innerHTML = displayText;
    // コピー用に元のテキストを保存
    document.getElementById('outputText').dataset.originalText = outputText;
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
    // 改行記号を含まない元のテキストをコピー
    var outputText = document.getElementById('outputText').dataset.originalText || document.getElementById('outputText').innerText;
    try {
        await navigator.clipboard.writeText(outputText);
        console.log('Text copied to clipboard');
    } catch (err) {
        console.error('Error in copy text: ', err);
    }

    // コピーしたことを知らせるためトーストを表示
    var toast = document.getElementById('toast');
    document.getElementById('toastContent').innerText = outputText;
    toast.className = "toast show";
    setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
});

// グリッド外をクリックしたら閉じる
document.addEventListener('click', function(event) {
    const gridContainer = document.getElementById('gridContainer');
    const gridLabel = document.getElementById('gridLabel');
    const gridSelector = document.getElementById('gridSelector');

    // クリックがグリッド関連要素の外だったら閉じる
    if (!gridSelector.contains(event.target) && gridContainer.style.display === 'grid') {
        gridContainer.style.display = 'none';
        // 閉じたときにグリッドを初期サイズにリセット
        currentGridCols = 6;
        currentGridRows = 6;
        initializeGrid();
    }
});

// ページ読み込み時にグリッドを初期化
initializeGrid();
highlightGrid(gridRows, gridCols);
updateGridLabel();
