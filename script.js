
    // Seiteninhalt dynamisch laden
    function loadPage(path) {
      fetch(path)
        .then(res => res.text())
        .then(html => {
          const main = document.getElementById('main-content');
          main.innerHTML = html;
          // Nach dem Einfügen die enthaltenen Skripte ausführen
          main.querySelectorAll('script').forEach(oldScript => {
            const newScript = document.createElement('script');
            if (oldScript.src) {
              newScript.src = oldScript.src;
            } else {
              newScript.textContent = oldScript.textContent;
            }
            document.body.appendChild(newScript);
          });
        });
    }

    // Uhrzeit
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

    // Timer
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

    // Begrüßung
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

    // Titel füllen (für Profilseite)
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
      document.title = `${name}s Profil`;
    }

    // XP-Ziele anzeigen
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