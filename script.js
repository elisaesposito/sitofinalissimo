
const oneSignalAppId = "2aa43d68-c001-4e88-9a17-0db15e4c5236";
const countdownTarget = new Date("2025-07-22T10:30:00");

let lastMessage = "";

function initOneSignal() {
  window.OneSignal = window.OneSignal || [];
  OneSignal.push(function () {
    OneSignal.init({
      appId: oneSignalAppId,
      notifyButton: { enable: false },
      allowLocalhostAsSecureOrigin: true
    });

    if (!localStorage.getItem("notif_subscribed")) {
      document.getElementById("notify-button").style.display = "block";
    }

    document.getElementById("notify-button").addEventListener("click", () => {
      OneSignal.showSlidedownPrompt();
      OneSignal.push(() => {
        OneSignal.isPushNotificationsEnabled((enabled) => {
          if (enabled) {
            localStorage.setItem("notif_subscribed", "true");
            document.getElementById("notify-button").style.display = "none";
          }
        });
      });
    });
  });
}

function sendNotification(message) {
  if (message !== lastMessage) {
    lastMessage = message;

    fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic os_v2_app_fksd22gaafhirgqxbwyv4tcsg22spxour5jusgux3pqr2po3xmqq22lelgkpz5lruw2w5dmc6e23tp2qof6fw4awgnbzdtxzdipxaky"
      },
      body: JSON.stringify({
        app_id: oneSignalAppId,
        contents: { en: "C’È POSTA PER TE!!!" },
        included_segments: ["Subscribed Users"]
      })
    });
  }
}

function updateContent() {
  const now = new Date();
  const msgEl = document.getElementById("messageText");
  const imgEl = document.getElementById("mainImage");
  const overlayEl = document.getElementById("overlayText");

  let msg = "";
  let showImage = false;
  let showOverlay = false;

  const day = now.getDate();
  const hour = now.getHours();
  const min = now.getMinutes();

  if (day < 12) {
    msg = "Non è ancora il TUO momento! Segnati il 22 luglio: sarà memorabile (per le tue anche)";
  } else if (day >= 12 && day <= 18) {
    msg = "";
    showImage = true;
    showOverlay = true;
  } else if (day === 19) {
    msg = "PREPARA LA BORSA DA SPIAGGIA: ciabatte, costume e crema solare.";
  } else if (day === 20) {
    msg = "SCUSACI, ci siamo dimenticanti l’ombrellone P.s. Ah prepara anche il pranzo!";
  } else if (day === 21) {
    msg = "FATTI TROVARE PRONTA ALLE 10.30 (dai, portati pure un cambio carino)";
  } else if (day === 22) {
    if (hour < 7) {
      showImage = true;
      showOverlay = true;
    } else if (hour === 7) {
      msg = "SVEGLIAAAAA";
    } else if (hour === 15 && min >= 15 || (hour > 15 && hour < 19) || (hour === 19 && min < 35)) {
      msg = "Ora che hai capito che il costume non servirà, PREPARA IL FEGATO, quello potrebbe essere utile";
    } else if (hour === 19 && min >= 35 || (hour > 19 && hour < 22) || (hour === 22 && min < 30)) {
      msg = "bevuto, hai bevuto (forse) ORA CENETTA";
    } else if (hour === 22 && min >= 30 && min < 50) {
      msg = "e ora chi lo paga il conto?";
    } else if (hour === 23 && min >= 30) {
      msg = "Bene, ora che sei stata viziata, la riabilitazione ti aspetta, buona passeggiata fino a casa";
    } else if ((hour >= 16 && hour < 19 && min >= 40) || (hour >= 20 && hour < 22 && min >= 35) || (hour === 22 && min >= 50)) {
      showImage = true;
      showOverlay = true;
    }
  }

  if (showImage) {
    imgEl.src = "assets/final_image.jpeg";
    imgEl.style.display = "block";
  } else {
    imgEl.style.display = "none";
  }

  overlayEl.textContent = showOverlay ? "CI RISENTIAMO PROSSIMAMENTE" : "";
  msgEl.textContent = msg;
  sendNotification(msg);
}

function updateCountdown() {
  const now = new Date().getTime();
  const distance = countdownTarget.getTime() - now;

  if (distance > 0) {
    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);
    document.getElementById("countdown").textContent = `Ci vediamo tra: ${d}g ${h}h ${m}m ${s}s`;
  } else {
    document.getElementById("countdown").textContent = "";
  }
}

initOneSignal();
updateContent();
updateCountdown();
setInterval(() => {
  updateContent();
  updateCountdown();
}, 10000);
