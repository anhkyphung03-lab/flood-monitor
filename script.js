// ===== Firebase config =====
const firebaseConfig = {
  databaseURL:
    "https://flood-monitor-iot-d5766-default-rtdb.asia-southeast1.firebasedatabase.app"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// ===== Chart.js =====
const ctx = document.getElementById("waterChart").getContext("2d");

const waterChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [{
      label: "Mực nước (%)",
      data: [],
      borderColor: "red",
      fill: false,
      tension: 0.3
    }]
  },
  options: {
    scales: {
      y: {
        min: 0,
        max: 100
      }
    }
  }
});

// ===== EMAIL CONFIG =====
const ALERT_EMAIL_LEVEL = 50;          // %
const EMAIL_INTERVAL = 10 * 60 * 1000; // 10 phút (ms)
let lastEmailTime = 0;

// ===== Realtime Firebase =====
database.ref("/realtime").on("value", (snapshot) => {
  const data = snapshot.val();
  if (!data || data.percent === undefined) return;

  const time = new Date().toLocaleTimeString();

  // ===== Update chart =====
  waterChart.data.labels.push(time);
  waterChart.data.datasets[0].data.push(data.percent);

  if (waterChart.data.labels.length > 20) {
    waterChart.data.labels.shift();
    waterChart.data.datasets[0].data.shift();
  }

  waterChart.update();

  // ===== SEND EMAIL mỗi 10 phút nếu vẫn ngập =====
  const now = Date.now();

  if (
    data.percent >= ALERT_EMAIL_LEVEL &&
    (now - lastEmailTime >= EMAIL_INTERVAL)
  ) {
    sendAlertEmail(data.percent);
    lastEmailTime = now;
  }

  // reset khi nước rút
  if (data.percent < ALERT_EMAIL_LEVEL) {
    lastEmailTime = 0;
  }
});

// ===== SEND EMAIL FUNCTION =====
function sendAlertEmail(percent) {
  emailjs.send(
    "service_jxrivlm",     // SERVICE ID
    "template_cc3fkrq",    // TEMPLATE ID
    {
      percent: percent,
      time: new Date().toLocaleString()
    }
  ).then(() => {
    console.log("📧 Email đã gửi");
  }).catch((err) => {
    console.error("❌ Lỗi gửi email:", err);
  });
}
