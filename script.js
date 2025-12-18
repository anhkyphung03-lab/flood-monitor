// ====== Firebase config ======
const firebaseConfig = {
  databaseURL:
    "https://flood-monitor-iot-d5766-default-rtdb.asia-southeast1.firebasedatabase.app"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// ====== Chart.js ======
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

// ====== Realtime listener ======
database.ref("/").on("value", (snapshot) => {
  const data = snapshot.val();
  if (!data || data.percent === undefined) return;

  const time = new Date().toLocaleTimeString();

  waterChart.data.labels.push(time);
  waterChart.data.datasets[0].data.push(data.percent);

  if (waterChart.data.labels.length > 20) {
    waterChart.data.labels.shift();
    waterChart.data.datasets[0].data.shift();
  }

  waterChart.update();
});
