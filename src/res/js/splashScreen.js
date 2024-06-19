const loadingText = document.getElementById('loadingText');
const progressBar = document.getElementById('progressBar');

function updateProgress(percentage) {
    loadingText.textContent = `Cargando... ${percentage}%`;
    progressBar.style.width = `${percentage}%`;
}

window.api.onUpdateProgress((progress) => {
    updateProgress(progress);
});