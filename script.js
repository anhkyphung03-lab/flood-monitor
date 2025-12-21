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
      borderColor: "blue",
      backgroundColor: "rgba(0, 0, 255, 0.1)",
      fill: true,
      tension: 0.3
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: "%"
        }
      },
      x: {
        title: {
          display: true,
          text: "Thời gian"
        }
      }
    }
  }
});

// ===== DOM =====
const percentText = document.getElementById("percent");

// ===== Realtime Firebase listener =====
database.ref("/realtime").on("value", (snapshot) => {
  const data = snapshot.val();
  if (!data || data.percent === undefined) return;

  const time = new Date().toLocaleTimeString();

  percentText.innerText = data.percent.toFixed(1);

  waterChart.data.labels.push(time);
  waterChart.data.datasets[0].data.push(data.percent);

  // giữ tối đa 30 điểm
  if (waterChart.data.labels.length > 30) {
    waterChart.data.labels.shift();
    waterChart.data.datasets[0].data.shift();
  }

  waterChart.update();
});
