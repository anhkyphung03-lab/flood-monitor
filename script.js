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
      borderColor: "green",
      fill: false,
      tension: 0.3,
      borderWidth: 2
    }]
  },
  options: {
    scales: {
      y: { min: 0, max: 100 }
    }
  }
});

// ===== NGƯỠNG CẢNH BÁO =====
const ALERT_LEVEL = 50;

// ===== CỜ CHỐNG SPAM EMAIL =====
// true  = đã gửi email
// false = chưa gửi
let emailSent = localStorage.getItem("emailSent") === "true";

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

  // ===== ĐỔI MÀU ĐƯỜNG =====
  if (data.percent < ALERT_LEVEL) {
    waterChart.data.datasets[0].borderColor = "green";

    // reset khi nước rút
    emailSent = false;
    localStorage.removeItem("emailSent");
  } else {
    waterChart.data.datasets[0].borderColor = "red";

    // ===== GỬI EMAIL CHỈ 1 LẦN =====
    if (!emailSent) {
      sendAlertEmail(data.percent);
      emailSent = true;
      localStorage.setItem("emailSent", "true");
    }
  }

  waterChart.update();
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
    console.log("📧 Email cảnh báo đã gửi (1 lần)");
  }).catch((err) => {
    console.error("❌ Lỗi gửi email:", err);
  });
}
