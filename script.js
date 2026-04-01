const hackedScreen = document.getElementById('hacked-screen');
const terminalContent = document.getElementById('terminal-content');
const popupContainer = document.getElementById('popup-container');
const educationalScreen = document.getElementById('educational-screen');

let matrixInterval;
let terminalInterval;
let popupInterval;

function startSimulation() {
    // Tenta pedir fullscreen (poderá ser bloqueado pelo browser se não houver clique)
    const elem = document.documentElement;
    try {
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(err => console.log("Fullscreen bloqueado", err));
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
        }
    } catch(e) {}

    // Mostrar ecrã de hacking
    if(hackedScreen) hackedScreen.classList.remove('hidden');

    // Iniciar o caos
    initMatrix();
    startTerminal();
    spawnPopups(); 

    // Contagem de 4 segundos antes de mostrar o ecrã educativo
    setTimeout(() => {
        clearInterval(matrixInterval);
        clearInterval(terminalInterval);
        clearInterval(popupInterval);
        
        if(hackedScreen) hackedScreen.classList.add('hidden');
        if(educationalScreen) educationalScreen.classList.remove('hidden');
        
        document.body.style.overflow = 'auto';
        document.body.style.backgroundColor = '#1a202c';
        
    }, 4000);
}

// Iniciar automaticamente
window.onload = startSimulation;

// Tentar o fullscreen novamente se o utilizador clicar algures na página
document.body.addEventListener('click', () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(err => {});
    }
});

function initMatrix() {
    const canvas = document.getElementById('matrix');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=<>?{}[]\\|';
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = [];

    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }

    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0F0';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = characters.charAt(Math.floor(Math.random() * characters.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    matrixInterval = setInterval(draw, 33);
}

const terminalMessages = [
    "A INICIAR SEQUÊNCIA DE CONEXÃO DIRETA...",
    "A IGNORAR FIREWALL DO SISTEMA...",
    "[SUCESSO] ACESSO ROOT CONCEDIDO.",
    "A INICIAR EXTRAÇÃO DE DADOS...",
    "A ENCRIPTAR DISCO RIGIDO LOCAL...",
    "A TRANSFERIR INFORMAÇÕES BANCÁRIAS E PALAVRAS-PASSE...",
    "CRITICAL ERROR: KERNEL PANIC",
    "[ALERTA] SISTEMA TOTALMENTE COMPROMETIDO!"
];

function startTerminal() {
    let msgIndex = 0;
    
    terminalInterval = setInterval(() => {
        if (msgIndex < terminalMessages.length) {
            addTerminalLine(terminalMessages[msgIndex]);
            msgIndex++;
        } else {
            clearInterval(terminalInterval);
            terminalInterval = setInterval(() => {
                const randomHex = () => Math.floor(Math.random()*16777215).toString(16).toUpperCase();
                addTerminalLine(`[OK] A extrair bloco de memória 0x${randomHex().padStart(6, '0')} para C&C...`);
            }, 80); // Mais rápido!
        }
    }, 800); // Mais rápido nas iniciais
}

function addTerminalLine(text) {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = `<span style="color: #fff;">root@unknown:~$</span> ${text}`;
    terminalContent.appendChild(line);
    
    if (terminalContent.children.length > 25) {
        terminalContent.removeChild(terminalContent.firstChild);
    }
}

const popupTexts = [
    "COMPUTADOR INFETADO!",
    "ALERTA GERAL: VIRUS DETETADO!",
    "FOTOS PRIVADAS A SEREM PUBLICADAS...",
    "DADOS ENCRIPTADOS. PAGUE RESGATE!",
    "ERRO DE SISTEMA CRÍTICO!",
    "TROJAN RAT ATIVADO",
    "A ELIMINAR SYSTEM32..."
];

function spawnPopups() {
    popupInterval = setInterval(() => {
        const popup = document.createElement('div');
        popup.className = 'popup';
        
        const w = 350;
        const h = 120;
        const x = Math.random() * (window.innerWidth - w);
        const y = Math.random() * (window.innerHeight - h);
        
        popup.style.left = `${x}px`;
        popup.style.top = `${y}px`;
        popup.style.width = `${w}px`;
        
        const msg = popupTexts[Math.floor(Math.random() * popupTexts.length)];
        
        popup.innerHTML = `
            <h2>⚠️ AVISO ⚠️</h2>
            <p>${msg}</p>
        `;
        
        popupContainer.appendChild(popup);
        
        if (popupContainer.children.length > 50) {
            popupContainer.removeChild(popupContainer.firstChild);
        }
    }, 120); // Aparecem MUITO mais rápido (a cada 120ms)
}

window.addEventListener('beforeunload', function (e) {
    // Apenas chatear se ainda estivermos no meio da brincadeira
    if(hackedScreen.classList.contains('hidden') === false) {
        e.preventDefault();
        e.returnValue = 'O sistema está a ser apagado. Tem a certeza?';
    }
});
