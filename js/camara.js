// Elementos del DOM
const video = document.getElementById('camera');
const outputCanvas = document.getElementById('output');
const captureBtn = document.getElementById('captureBtn');
const resetBtn = document.getElementById('resetBtn');
const messageEl = document.getElementById('message');
const loadingEl = document.getElementById('loading');

// Variables de estado
let currentStream = null;

// Inicializar la aplicación
async function initApp() {
    showMessage('Inicializando cámara...', 'info');
    await initLocalCamera();
    setupCameraUI();
}

// Inicializar cámara local con reintentos
async function initLocalCamera() {
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
        attempts++;
        const success = await tryInitLocalCamera();
        if (success) return true;
        
        if (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            showMessage(`Reintentando conectar cámara (${attempts}/${maxAttempts})...`, 'warning');
        }
    }
    
    showMessage('No se pudo acceder a la cámara. Verifica los permisos.', 'error');
    return false;
}

// Intentar inicializar cámara local
async function tryInitLocalCamera() {
    stopCurrentStream();
    
    const constraints = {
        audio: false,
        video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
        }
    };

    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        currentStream = stream;
        video.srcObject = stream;
        
        return new Promise((resolve) => {
            const onLoaded = () => {
                video.removeEventListener('loadedmetadata', onLoaded);
                setupCanvas();
                showMessage('Cámara conectada correctamente', 'success');
                resolve(true);
            };
            
            video.addEventListener('loadedmetadata', onLoaded, { once: true });
            
            // Timeout por si nunca carga
            setTimeout(() => {
                video.removeEventListener('loadedmetadata', onLoaded);
                resolve(false);
            }, 3000);
        });
    } catch (err) {
        console.error('Error al acceder a cámara:', err);
        return false;
    }
}

// Configurar canvas
function setupCanvas() {
    outputCanvas.width = video.videoWidth;
    outputCanvas.height = video.videoHeight;
}

// Configurar UI según estado de cámara
function setupCameraUI() {
    if (!currentStream) {
        captureBtn.disabled = true;
        showMessage('No se pudo acceder a la cámara. Recarga la página para intentar nuevamente.', 'error');
    } else {
        captureBtn.disabled = false;
    }
}

// Detener stream actual
function stopCurrentStream() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => {
            track.stop();
        });
        currentStream = null;
    }
    video.srcObject = null;
}

// Capturar imagen
function captureImage() {
    try {
        const context = outputCanvas.getContext('2d');
        context.drawImage(video, 0, 0, outputCanvas.width, outputCanvas.height);
        
        outputCanvas.style.display = 'block';
        video.style.display = 'none';
        captureBtn.style.display = 'none';
        resetBtn.style.display = 'inline-block';
        loadingEl.style.display = 'block';
        messageEl.innerHTML = '';
        
        analyzeHaircut(outputCanvas.toDataURL('image/jpeg', 0.8));
    } catch (error) {
        console.error('Error al capturar imagen:', error);
        showMessage('Error al capturar. Intenta nuevamente.', 'error');
        resetCamera();
    }
}

// Reiniciar cámara
function resetCamera() {
    outputCanvas.style.display = 'none';
    video.style.display = 'block';
    captureBtn.style.display = 'inline-block';
    resetBtn.style.display = 'none';
    loadingEl.style.display = 'none';
}

// Analizar imagen (simulación)
function analyzeHaircut(imageData) {
    simulateAnalysis(imageData);
}

// Simular análisis
function simulateAnalysis(imageData) {
    setTimeout(() => {
        loadingEl.style.display = 'none';
        showResults({
            success: true,
            haircutType: detectHaircutType(),
            score: getRandomScore(),
            symmetry: getRandomSymmetry(),
            recommendations: getRandomRecommendations(),
            areasToImprove: getRandomAreasToImprove()
        });
    }, 1500);
}

// Funciones de ayuda para generar datos simulados
function detectHaircutType() {
    const types = [
        "Corte clásico",
        "Corte degradado",
        "Corte bajo",
        "Corte medio",
        "Corte texturizado",
        "Corte con diseño"
    ];
    return types[Math.floor(Math.random() * types.length)];
}

function getRandomScore() {
    return (Math.random() * 3 + 7).toFixed(1); // Entre 7.0 y 10.0
}

function getRandomSymmetry() {
    const options = ["Excelente", "Buena", "Regular", "Puede mejorar"];
    return options[Math.floor(Math.random() * options.length)];
}

function getRandomRecommendations() {
    const recommendations = [
        "Podrías mejorar el equilibrio en los lados",
        "Considera un degradado más suave",
        "El volumen en la parte superior está bien logrado",
        "Las patillas podrían ser más simétricas",
        "El flequillo podría estar más definido"
    ];
    // Devuelve 1-3 recomendaciones aleatorias
    return recommendations
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 1);
}

function getRandomAreasToImprove() {
    const areas = [
        { area: "Lados", suggestion: "Igualar longitud" },
        { area: "Parte posterior", suggestion: "Suavizar transiciones" },
        { area: "Patillas", suggestion: "Afinar diseño" },
        { area: "Flequillo", suggestion: "Definir mejor la línea" },
        { area: "Corona", suggestion: "Añadir más volumen" }
    ];
    // Devuelve 1-2 áreas aleatorias
    return areas
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 2) + 1);
}

// Mostrar resultados
function showResults(data) {
    if (!data?.success) {
        showMessage('Error en el análisis. Intenta nuevamente.', 'error');
        return;
    }

    messageEl.innerHTML = `
        <h3>Resultados del Análisis</h3>
        <div class="result-summary">
            <p><strong>Tipo de corte:</strong> ${data.haircutType || 'No identificado'}</p>
            <p><strong>Puntuación:</strong> ${data.score || 'N/A'}/10</p>
            <p><strong>Simetría:</strong> ${data.symmetry || 'No evaluada'}</p>
        </div>
        
        ${data.recommendations?.length ? `
        <h4>Recomendaciones:</h4>
        <ul class="recommendations">${data.recommendations.map(r => `<li>${r}</li>`).join('')}</ul>
        ` : ''}
        
        ${data.areasToImprove?.length ? `
        <h4>Áreas para mejorar:</h4>
        <div class="areas-container">
            ${data.areasToImprove.map(a => `
            <div class="area-card">
                <strong>${a.area}:</strong> ${a.suggestion}
            </div>
            `).join('')}
        </div>
        ` : ''}
        
        <p class="final-tip">Para mantener tu corte, visita a tu barbero cada 3-4 semanas.</p>
    `;
}

// Mostrar mensaje
function showMessage(text, type = 'info') {
    messageEl.innerHTML = `<div class="message ${type}">${text}</div>`;
}

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    resetBtn.style.display = 'none';
});