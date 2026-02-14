class ImagePuzzle {
    constructor() {
        this.board = document.getElementById('puzzleBoard');
        this.movesDisplay = document.getElementById('movesCount');
        this.timerDisplay = document.getElementById('timer');
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.winMessage = document.getElementById('winMessage');

        this.size = 3;
        this.tiles = [];
        this.emptyPos = { r: 2, c: 2 };
        this.moves = 0;
        this.startTime = null;
        this.timerInterval = null;
        this.isWon = false;

        this.init();
    }

    init() {
        this.createBoard();
        this.shuffleBtn.addEventListener('click', () => this.shuffle());
        this.shuffle();
    }

    createBoard() {
        this.board.innerHTML = '';
        this.tiles = [];

        for (let r = 0; r < this.size; r++) {
            this.tiles[r] = [];
            for (let c = 0; c < this.size; c++) {
                const tile = document.createElement('div');
                tile.className = 'puzzle-tile';

                if (r === this.size - 1 && c === this.size - 1) {
                    tile.classList.add('empty');
                } else {
                    // Set background position based on correct coordinates
                    tile.style.backgroundPosition = `${(c / (this.size - 1)) * 100}% ${(r / (this.size - 1)) * 100}%`;
                }

                tile.addEventListener('click', () => this.moveTile(r, c));
                this.board.appendChild(tile);
                this.tiles[r][c] = {
                    element: tile,
                    correctPos: { r, c },
                    currentPos: { r, c }
                };
            }
        }
    }

    moveTile(r, c) {
        if (this.isWon) return;

        const dr = Math.abs(r - this.emptyPos.r);
        const dc = Math.abs(c - this.emptyPos.c);

        if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) {
            this.swapTiles(r, c, this.emptyPos.r, this.emptyPos.c);
            this.emptyPos = { r, c };
            this.moves++;
            this.updateStats();
            this.checkWin();

            if (!this.startTime) {
                this.startTimer();
            }
        }
    }

    swapTiles(r1, c1, r2, c2) {
        // Swap visual appearance and classes
        const t1 = this.tiles[r1][c1].element;
        const t2 = this.tiles[r2][c2].element;

        const t1BG = t1.style.backgroundPosition;
        const t2BG = t2.style.backgroundPosition;

        t1.style.backgroundPosition = t2BG;
        t2.style.backgroundPosition = t1BG;

        const isT1Empty = t1.classList.contains('empty');
        const isT2Empty = t2.classList.contains('empty');

        t1.classList.toggle('empty', isT2Empty);
        t2.classList.toggle('empty', isT1Empty);

        // Update correctPos tracking
        const tempCorrect = this.tiles[r1][c1].correctPos;
        this.tiles[r1][c1].correctPos = this.tiles[r2][c2].correctPos;
        this.tiles[r2][c2].correctPos = tempCorrect;
    }

    shuffle() {
        this.isWon = false;
        this.winMessage.classList.remove('active');
        this.moves = 0;
        this.resetTimer();
        this.updateStats();

        // Random moves to ensure solvability
        for (let i = 0; i < 100; i++) {
            const neighbors = this.getNeighbors(this.emptyPos.r, this.emptyPos.c);
            const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
            this.swapTiles(randomNeighbor.r, randomNeighbor.c, this.emptyPos.r, this.emptyPos.c);
            this.emptyPos = { r: randomNeighbor.r, c: randomNeighbor.c };
        }
    }

    getNeighbors(r, c) {
        const neighbors = [];
        if (r > 0) neighbors.push({ r: r - 1, c });
        if (r < this.size - 1) neighbors.push({ r: r + 1, c });
        if (c > 0) neighbors.push({ r, c: c - 1 });
        if (c < this.size - 1) neighbors.push({ r, c: c + 1 });
        return neighbors;
    }

    updateStats() {
        this.movesDisplay.textContent = this.moves;
    }

    startTimer() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const secs = (elapsed % 60).toString().padStart(2, '0');
            this.timerDisplay.textContent = `${mins}:${secs}`;
        }, 1000);
    }

    resetTimer() {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.startTime = null;
        this.timerDisplay.textContent = '00:00';
    }

    checkWin() {
        let win = true;
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                const tile = this.tiles[r][c];
                // Check if current tile's background position matches its grid position
                const expectedX = (c / (this.size - 1)) * 100;
                const expectedY = (r / (this.size - 1)) * 100;

                const bgPos = tile.element.style.backgroundPosition;
                if (!tile.element.classList.contains('empty')) {
                    if (!bgPos.includes(`${expectedX}% ${expectedY}%`)) {
                        win = false;
                        break;
                    }
                } else {
                    if (r !== this.size - 1 || c !== this.size - 1) {
                        win = false;
                        break;
                    }
                }
            }
            if (!win) break;
        }

        if (win && this.moves > 0) {
            this.isWon = true;
            clearInterval(this.timerInterval);
            this.winMessage.classList.add('active');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ImagePuzzle();
});
