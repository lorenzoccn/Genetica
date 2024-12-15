const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const GRID_ROWS = 4;
const GRID_COLS = 4;
const CARD_WIDTH = 100;
const CARD_HEIGHT = 100;
const CARD_SPACING = 10;

let cooldown = false;  // Variável de controle de cooldown
let currentScreen = 'menu';  // Estado inicial da tela
let cards = [];
let speciesCards = [];
let revealedCards = [];
let matchesFound = 0;
let numPairs = (GRID_ROWS * GRID_COLS) / 2;
let textures = [];
let speciesInfos = [
    { name: "Interfase", characteristics: "A célula se prepara para a divisão, com crescimento e duplicação do DNA"},
    { name: "Prófase", characteristics: "Os cromossomos se condensam e se tornam visíveis. O envoltório nuclear começa a desaparecer. Visualmente, a célula pode mostrar cromossomos espiralizados e o núcleo se desintegrando."},
    { name: "Prometáfase", characteristics: "Os cromossomos se ligam às fibras do fuso mitótico. Aqui, as fibras do fuso são visíveis, ligando-se aos centrômeros dos cromossomos."},
    { name: "Metáfase", characteristics: "Os cromossomos se alinham no centro da célula (placa metafásica). Esta fase é facilmente reconhecível pelo alinhamento ordenado dos cromossomos."},
    { name: "Anáfase", characteristics: "Os cromossomos começam a se separar, com as cromátides irmãs sendo puxadas para polos opostos da célula. É caracterizada por cromossomos que se dividem e começam a se afastar." },
    { name: "Telófase", characteristics: "Os cromossomos chegam aos polos opostos e começam a se descondensar, com a formação de novos envoltórios nucleares." },
    { name: "Citocinese", characteristics: "A célula se divide fisicamente, formando duas células filhas." },
    { name: "Cromossomo", characteristics: "Uma estrutura longa e condensada de DNA, composta por genes, que carrega a informação genética de um organismo." },
];

function init() {
    loadTextures();
    resetGame();
    requestAnimationFrame(gameLoop);
}

function loadTextures() {
    const basePath = 'images/';
    for (let i = 1; i <= 8; i++) {
        const img = new Image();
        img.src = `${basePath}card${i}.png`;
        textures.push(img);
    }
}

function resetGame() {
    cards = [];
    for (let i = 0; i < GRID_ROWS * GRID_COLS; i++) {
        cards.push({ texture: textures[i % numPairs], revealed: false, matched: false });
    }
    shuffle(cards);
    matchesFound = 0;
    revealedCards = [];
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function gameLoop() {
    draw();
    requestAnimationFrame(gameLoop);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (currentScreen === 'menu') {
        drawMenu();
    } else if (currentScreen === 'game') {
        drawGame();
    } else if (currentScreen === 'victory') {
        drawVictory();
    } else if (currentScreen === 'species') {
        drawSpecies();
    } else if (currentScreen === 'credits') {
        drawCredits();
    }
}

function drawMenu() {
    ctx.fillStyle = 'lightgray';
    ctx.fillRect(300, 200, 200, 50);
    ctx.fillStyle = 'black';
    ctx.fillText("Iniciar", 350, 230);

    ctx.fillStyle = 'lightgray';
    ctx.fillRect(300, 270, 200, 50);
    ctx.fillStyle = 'black';
    ctx.fillText("Fases", 350, 300);

    ctx.fillStyle = 'lightgray';
    ctx.fillRect(300, 340, 200, 50);
    ctx.fillStyle = 'black';
    ctx.fillText("Créditos", 350, 370);
}

function drawCredits() {
    ctx.fillStyle = 'white';
    ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100); // Fundo branco

    ctx.fillStyle = 'black';
    ctx.font = '18px Arial'; // Reduzir o tamanho da fonte para 18px
    ctx.textAlign = 'center'; // Alinhar o texto ao centro

    // Texto centralizado
    const centerX = canvas.width / 2;
    ctx.fillText("Alunos: George Qian, Lorenzo Chaves, Lucas Carlotto e Nicolas Menegat", centerX, 150);
    ctx.fillText("Professoras orientadoras: Camille Granada e Andreia Turchetto", centerX, 200);
    ctx.fillText("Atividade de extensão da disciplina: BIO07035 - Genética ", centerX, 250);

    ctx.fillText("Clique para voltar ao Menu", centerX, canvas.height - 100);
}

function loadSpeciesCards() {
    speciesCards = [];
    for (let i = 0; i < 8; i++) { // Criar exatamente 8 cartas únicas
        const card = {
            texture: textures[i], // Cada carta terá uma imagem única
            revealed: true, // Todas as cartas começam reveladas
            info: speciesInfos[i], // Informações da espécie
        };
        speciesCards.push(card);
    }
    currentScreen = 'species'; // Exibir o modo Espécies
}

function showCardInfo(index) {
    const card = speciesCards[index];
    alert(`Informações da carta ${index + 1}:\n\n${card.info.name}\n${card.info.characteristics}`);
}

function drawSpecies() {
    const gridWidth = GRID_COLS * CARD_WIDTH + (GRID_COLS - 1) * CARD_SPACING;
    const gridHeight = GRID_ROWS * CARD_HEIGHT + (GRID_ROWS - 1) * CARD_SPACING;
    const startX = (canvas.width - gridWidth) / 2;
    const startY = (canvas.height - gridHeight) / 2;

    // Desenhar as cartas
    for (let i = 0; i < speciesCards.length; i++) {
        const card = speciesCards[i];
        const x = startX + (i % GRID_COLS) * (CARD_WIDTH + CARD_SPACING);
        const y = startY + Math.floor(i / GRID_COLS) * (CARD_HEIGHT + CARD_SPACING);

        if (card.revealed) {
            ctx.drawImage(card.texture, x, y, CARD_WIDTH, CARD_HEIGHT);
        } else {
            ctx.fillStyle = 'darkgray';
            ctx.fillRect(x, y, CARD_WIDTH, CARD_HEIGHT);
        }
    }

    // Desenhar o botão "Voltar ao Menu"
    ctx.fillStyle = 'lightgray';
    ctx.fillRect(300, canvas.height - 100, 200, 50); // posição do botão
    ctx.fillStyle = 'black';
    ctx.fillText("Voltar ao Menu", 340, canvas.height - 70); // texto do botão
}

function drawGame() {
    // Calculando a largura e altura do grid
    const gridWidth = GRID_COLS * CARD_WIDTH + (GRID_COLS - 1) * CARD_SPACING;
    const gridHeight = GRID_ROWS * CARD_HEIGHT + (GRID_ROWS - 1) * CARD_SPACING;

    // Calculando a posição (x, y) para centralizar o grid
    const startX = (canvas.width - gridWidth) / 2;
    const startY = (canvas.height - gridHeight) / 2;

    for (let i = 0; i < GRID_ROWS; i++) {
        for (let j = 0; j < GRID_COLS; j++) {
            const index = i * GRID_COLS + j;
            const x = startX + j * (CARD_WIDTH + CARD_SPACING);  // Ajuste no cálculo de x
            const y = startY + i * (CARD_HEIGHT + CARD_SPACING); // Ajuste no cálculo de y

            if (cards[index].revealed || cards[index].matched) {
                ctx.drawImage(cards[index].texture, x, y, CARD_WIDTH, CARD_HEIGHT);
            } else {
                ctx.fillStyle = 'darkgray';
                ctx.fillRect(x, y, CARD_WIDTH, CARD_HEIGHT);
            }
        }
    }
}

function drawVictory() {
    // Desenhar a mensagem de vitória no centro
    ctx.fillStyle = 'lightgray';
    ctx.fillRect(150, 100, canvas.width - 300, 150); // Retângulo de fundo para a mensagem

    ctx.fillStyle = 'black';
    ctx.font = '48px Arial'; // Tamanho grande para o texto
    ctx.textAlign = 'center'; // Alinhar o texto ao centro
    ctx.fillText("Parabéns você venceu!", canvas.width / 2, 150); // Centraliza a mensagem no meio da tela

    // Desenhar o botão "Voltar ao Menu" no canto inferior central
    ctx.fillStyle = 'lightgray';
    ctx.fillRect(300, canvas.height - 100, 200, 50); // Botão no canto inferior
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial'; // Tamanho do texto para o botão
    ctx.fillText("Voltar ao Menu", canvas.width / 2, canvas.height - 70); // Centraliza o texto do botão
}

function checkMatch() {
    if (cards[revealedCards[0]].texture === cards[revealedCards[1]].texture) {
        cards[revealedCards[0]].matched = true;
        cards[revealedCards[1]].matched = true;
        matchesFound++;
    } else {
        cards[revealedCards[0]].revealed = false;
        cards[revealedCards[1]].revealed = false;
    }
    revealedCards = [];
    if (matchesFound === numPairs) {
        currentScreen = 'victory';
    }
}

canvas.addEventListener('click', function (event) {
    const x = event.offsetX;
    const y = event.offsetY;

    if (currentScreen === 'menu') {
        if (x >= 300 && x <= 500) {
            if (y >= 200 && y <= 250) {
                currentScreen = 'game'; 
            } else if (y >= 270 && y <= 320) {
                loadSpeciesCards();
            } else if (y >= 340 && y <= 390) {
                currentScreen = 'credits'; // Ir para créditos
            }
        }
    } else if (currentScreen === 'victory') {
        // Verificar clique no botão "Voltar ao Menu" na tela de vitória
        if (x >= 300 && x <= 500 && y >= canvas.height - 100 && y <= canvas.height - 50) {
            currentScreen = 'menu'; // Voltar ao menu
        }
    } else if (currentScreen === 'credits') {
        currentScreen = 'menu';
    } else if (currentScreen === 'species') {
        // Verificar clique no botão "Voltar ao Menu"
        if (x >= 300 && x <= 500 && y >= canvas.height - 100 && y <= canvas.height - 50) {
            currentScreen = 'menu'; // Voltar ao menu
        } else {
            // Verificar clique nas cartas de espécies
            const index = Math.floor((y - (canvas.height - GRID_ROWS * CARD_HEIGHT) / 2) / (CARD_HEIGHT + CARD_SPACING)) * GRID_COLS + Math.floor((x - (canvas.width - GRID_COLS * CARD_WIDTH) / 2) / (CARD_WIDTH + CARD_SPACING));
            if (index >= 0 && index < speciesCards.length) {
                showCardInfo(index);
            }
        }
    } else if (currentScreen === 'game' && !cooldown) {
        const index = Math.floor((y - (canvas.height - GRID_ROWS * CARD_HEIGHT) / 2) / (CARD_HEIGHT + CARD_SPACING)) * GRID_COLS + Math.floor((x - (canvas.width - GRID_COLS * CARD_WIDTH) / 2) / (CARD_WIDTH + CARD_SPACING));

        if (index >= 0 && index < cards.length && !cards[index].revealed && !cards[index].matched) {
            cards[index].revealed = true;
            revealedCards.push(index);

            if (revealedCards.length === 2) {
                cooldown = true;
                setTimeout(() => {
                    checkMatch();
                    cooldown = false;
                }, 1000);
            }
        }
    }
});

init();
