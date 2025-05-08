// ========== INFO-TEXT speichern ==========
document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('info-text');
  const savedText = localStorage.getItem('infoText');
  if (textarea && savedText) {
    textarea.value = savedText;
  }

  if (textarea) {
    textarea.addEventListener('input', () => {
      localStorage.setItem('infoText', textarea.value);
    });
  }
});

// ========== LIVE-UHR ==========
function updateClock() {
  const uhr = document.getElementById('uhr');
  if (!uhr) return;
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  uhr.textContent = `${hh}:${mm}:${ss}`;
}
setInterval(updateClock, 1000);
updateClock();

// ========== DYNAMISCHER GRUSS ==========
function updateGreeting() {
  const gruss = document.getElementById('gruss');
  const nameElement = document.getElementById('profilname');
  const name = nameElement ? nameElement.textContent : 'Benutzer';

  const hour = new Date().getHours();
  let begruessung = '';
  let emoji = '';

  if (hour >= 5 && hour < 12) {
    begruessung = 'Guten Morgen';
    emoji = '🌅';
  } else if (hour >= 12 && hour < 18) {
    begruessung = 'Guten Tag';
    emoji = '☀️';
  } else if (hour >= 18 && hour < 23) {
    begruessung = 'Guten Abend';
    emoji = '🌇';
  } else {
    begruessung = 'Gute Nacht';
    emoji = '🌙';
  }

  if (gruss) {
    gruss.textContent = `${begruessung}, ${name} ${emoji}`;
  }
}

// ========== HOTBAR-TITEL & SEITENTITEL FÜR PROFILSEITE ==========
function updateHotbarTitle() {
  const nameElement = document.getElementById('profilname');
  const titleElement = document.getElementById('hotbar-titel');
  const name = nameElement ? nameElement.textContent : 'Benutzer';
  if (titleElement) {
    titleElement.textContent = `🔥 ${name}s Profil 🔥`;
  }
}

function updatePageTitle() {
  const nameElement = document.getElementById('profilname');
  const name = nameElement ? nameElement.textContent : 'Benutzer';
  document.title = `${name}s Profil 🔥`;
}

// ========== TIMER ==========
let timerElement = document.getElementById('timer');
let startTime = Date.now();
let savedTime = parseInt(localStorage.getItem('arbeitszeit')) || 0;

function updateTimerDisplay(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const s = String(totalSeconds % 60).padStart(2, '0');
  if (timerElement) {
    timerElement.textContent = `${h}:${m}:${s}`;
  }
}

function startTimer() {
  startTime = Date.now();
  setInterval(() => {
    const now = Date.now();
    const elapsed = savedTime + (now - startTime);
    updateTimerDisplay(elapsed);
  }, 1000);
}
updateTimerDisplay(savedTime);
startTimer();

window.addEventListener('beforeunload', () => {
  const now = Date.now();
  const totalTime = savedTime + (now - startTime);
  localStorage.setItem('arbeitszeit', totalTime);
});

// ========== CHECKLISTE & XP ==========
document.addEventListener("DOMContentLoaded", () => {
  updateGreeting();

  if (window.location.pathname.includes("profil.html")) {
    updateHotbarTitle();
    updatePageTitle();
  }

  const form = document.getElementById("checklist-form");
  const input = document.getElementById("checklist-input");
  const list = document.getElementById("checklist-items");

  let items = JSON.parse(localStorage.getItem("checklist")) || [];

  // === NEU: TÄGLICHES RESET PRÜFEN UND SPEICHERN ===
  const gespeichertesDatum = localStorage.getItem("checklistDatum");
  const heutigesDatum = new Date().toISOString().split("T")[0];

  if (gespeichertesDatum !== heutigesDatum) {
    const gesternErledigt = items.filter(item => item.done);
    localStorage.setItem("gesternErledigt", JSON.stringify(gesternErledigt));

    // Reset aller Ziele
    items = items.map(item => ({ ...item, done: false }));

    localStorage.setItem("checklistDatum", heutigesDatum);
    localStorage.setItem("checklist", JSON.stringify(items));
  }

  function saveItems() {
    localStorage.setItem("checklist", JSON.stringify(items));
  }

  function renderItems() {
    if (!list) return;
    list.innerHTML = "";
    items.forEach((item, index) => {
      const li = document.createElement("li");
      li.className = "checklist-item";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = item.done;
      checkbox.addEventListener("change", () => {
        items[index].done = checkbox.checked;
        span.style.textDecoration = checkbox.checked ? "line-through" : "none";
        saveItems();
      });

      const span = document.createElement("span");
      span.textContent = item.text;
      if (item.done) span.style.textDecoration = "line-through";

      const delBtn = document.createElement("button");
      delBtn.textContent = "🗑️";
      delBtn.addEventListener("click", () => {
        items.splice(index, 1);
        saveItems();
        renderItems();
      });

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(delBtn);
      list.appendChild(li);
    });
  }

  form?.addEventListener("submit", e => {
    e.preventDefault();
    const value = input.value.trim();
    if (value === "") return;
    items.push({ text: value, done: false, xp: 10 });
    input.value = "";
    saveItems();
    renderItems();
  });

  function renderGesternErledigt() {
    const historyList = document.querySelector(".checklist-history ul");
    if (!historyList) return;
    const gestern = JSON.parse(localStorage.getItem("gesternErledigt")) || [];
    historyList.innerHTML = "";
    gestern.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item.text;
      historyList.appendChild(li);
    });
  }

  function renderProfilZieleMitXP() {
    const zielListe = document.getElementById("profil-ziele");
    if (!zielListe) return;
    const items = JSON.parse(localStorage.getItem("checklist")) || [];

    zielListe.innerHTML = "";
    items.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `<span>${item.text}</span><span>${item.xp || 10} XP</span>`;
      zielListe.appendChild(li);
    });
  }

  renderItems();
  renderGesternErledigt();
  if (window.location.pathname.includes("profil.html")) {
    renderProfilZieleMitXP();
  }
});
