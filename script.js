const textarea = document.getElementById('info-text');

window.addEventListener('DOMContentLoaded', () => {
  const savedText = localStorage.getItem('infoText');
  if (savedText) {
    textarea.value = savedText;
  }
});

textarea.addEventListener('input', () => {
  localStorage.setItem('infoText', textarea.value);
});

function updateClock() {
  const uhr = document.getElementById('uhr');
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  uhr.textContent = `${hh}:${mm}:${ss}`;
}

// alle 1 Sekunde aktualisieren
setInterval(updateClock, 1000);
updateClock(); // beim Laden sofort aufrufen

function updateGreeting() {
  const gruss = document.getElementById('gruss');
  const nameElement = document.getElementById('profilname');
  const name = nameElement ? nameElement.textContent : 'Benutzer'; // fallback
  
  
  const hour = new Date().getHours();
  let begruessung = '';

  if (hour >= 5 && hour < 12) {
    begruessung = 'Guten Morgen';
  } else if (hour >= 12 && hour < 18) {
    begruessung = 'Guten Tag';
  } else if (hour >= 18 && hour < 23) {
    begruessung = 'Guten Abend';
  } else {
    begruessung = 'Gute Nacht';
  }

  gruss.textContent = `${begruessung}, ${name}`;
}

// Begrüßung sofort anzeigen
updateGreeting();

let timerElement = document.getElementById('timer');
let startTime = Date.now();
let savedTime = parseInt(localStorage.getItem('arbeitszeit')) || 0;

function updateTimerDisplay(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const s = String(totalSeconds % 60).padStart(2, '0');
  timerElement.textContent = `${h}:${m}:${s}`;
}

function startTimer() {
  startTime = Date.now();
  setInterval(() => {
    const now = Date.now();
    const elapsed = savedTime + (now - startTime);
    updateTimerDisplay(elapsed);
  }, 1000);
}

// Beim Verlassen der Seite speichern
window.addEventListener('beforeunload', () => {
  const now = Date.now();
  const totalTime = savedTime + (now - startTime);
  localStorage.setItem('arbeitszeit', totalTime);
});

// Beim Laden direkt starten
updateTimerDisplay(savedTime);
startTimer();