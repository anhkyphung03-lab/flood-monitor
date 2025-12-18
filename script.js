const FIREBASE_URL =
  "https://flood-monitor-iot-d5766-default-rtdb.asia-southeast1.firebasedatabase.app/data.json";

function updateChart() {
  fetch(FIREBASE_URL)
    .then(res => res.json())
    .then(data => {
      if (!data || data.percent === undefined) return;

      const now = new Date().toLocaleTimeString();

      waterChart.data.labels.push(now);
      waterChart.data.datasets[0].data.push(data.percent);

      // Giữ tối đa 20 điểm
      if (waterChart.data.labels.length > 20) {
        waterChart.data.labels.shift();
        waterChart.data.datasets[0].data.shift();
      }

      waterChart.update();
    });
}

// cập nhật mỗi 1 giây
setInterval(updateChart, 1000);
