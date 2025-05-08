// Seiteninhalt + seitenbezogene CSS-Datei laden
function loadPage(path, cssPath) {
  fetch(path)
    .then(res => res.text())
    .then(html => {
      const main = document.getElementById('main-content');
      main.innerHTML = html;

      // Alte seitenbezogene Stylesheets entfernen
      document.querySelectorAll('[data-dynamic-style]').forEach(el => el.remove());

      // Neue CSS-Datei einbinden
      if (cssPath) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `/css/${cssPath}`;
        link.setAttribute('data-dynamic-style', 'true');
        document.head.appendChild(link);
      }

      // Inline-Skripte erneut ausführen
      main.querySelectorAll('script').forEach(oldScript => {
        const newScript = document.createElement('script');
        if (oldScript.src) {
          newScript.src = oldScript.src;
        } else {
          newScript.textContent = oldScript.textContent;
        }
        document.body.appendChild(newScript);
      });
      if (typeof setupChecklist === 'function') setupChecklist();
      if (typeof setupInfoText === 'function') setupInfoText();
      if (typeof renderProfilZieleMitXP === 'function') renderProfilZieleMitXP();
    });
}

// Uhrzeit anzeigen
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

// Timer (Arbeitszeit)
const timerElement = document.getElementById('timer');
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

// Begrüßungstext aktualisieren
function updateGreeting() {
  const gruss = document.getElementById('gruss');
  const nameElement = document.getElementById('profilname');
  const name = nameElement ? nameElement.textContent : 'Benutzer';

  const hour = new Date().getHours();
  let begruessung = '';
  let emoji = '';

  if (hour >= 5 && hour < 12) {
    begruessung = 'Guten Morgen'; emoji = '🌅';
  } else if (hour >= 12 && hour < 18) {
    begruessung = 'Guten Tag'; emoji = '☀️';
  } else if (hour >= 18 && hour < 23) {
    begruessung = 'Guten Abend'; emoji = '🌇';
  } else {
    begruessung = 'Gute Nacht'; emoji = '🌙';
  }

  if (gruss) {
    gruss.textContent = `${begruessung}, ${name} ${emoji}`;
  }
}

// Hotbar-Titel anpassen
function updateHotbarTitle() {
  const nameElement = document.getElementById('profilname');
  const titleElement = document.getElementById('hotbar-titel');
  const name = nameElement ? nameElement.textContent : 'Benutzer';
  if (titleElement) {
    titleElement.textContent = `🔥 ${name}s Profil 🔥`;
  }
}

// Seitentitel im Browser
function updatePageTitle() {
  const nameElement = document.getElementById('profilname');
  const name = nameElement ? nameElement.textContent : 'Benutzer';
  document.title = `${name}s Profil`;
}

// XP-Ziele in Profil anzeigen
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
function setupInfoText() {
  const textarea = document.getElementById("info-text");
  if (!textarea) return;

  // Beim Laden: Inhalt aus localStorage setzen
  textarea.value = localStorage.getItem("infoText") || "";

  // Beim Schreiben: Inhalt speichern
  textarea.addEventListener("input", () => {
    localStorage.setItem("infoText", textarea.value);
  });
}

// === CHECKLISTE ===

function setupChecklist() {
  const form = document.getElementById("checklist-form");
  const input = document.getElementById("checklist-input");
  const ul = document.getElementById("checklist-items");

  if (!form || !input || !ul) return;

  let checklist = JSON.parse(localStorage.getItem("checklist")) || [];

  function saveChecklist() {
    localStorage.setItem("checklist", JSON.stringify(checklist));
  }

  function renderChecklist() {
    ul.innerHTML = "";
    checklist.forEach((item, index) => {
      const li = document.createElement("li");
      li.className = "checklist-item";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = item.done || false;
      checkbox.addEventListener("change", () => {
        checklist[index].done = checkbox.checked;
        saveChecklist();
      });

      const text = document.createElement("span");
      text.textContent = item.text;

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "🗑️";
      deleteBtn.addEventListener("click", () => {
        checklist.splice(index, 1);
        saveChecklist();
        renderChecklist();
      });

      li.appendChild(checkbox);
      li.appendChild(text);
      li.appendChild(deleteBtn);
      ul.appendChild(li);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (text === "") return;
    checklist.push({ text, xp: 10, done: false });
    input.value = "";
    saveChecklist();
    renderChecklist();
  });

  renderChecklist();
}