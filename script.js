// 🔴 LINK FIREBASE (SỬA CHO ĐÚNG PROJECT CỦA EM)
const FIREBASE_URL =
  "https://flood-monitor-iot-d5766-default-rtdb.asia-southeast1.firebasedatabase.app/data.json";

// ===== BIỂU ĐỒ =====
const ctx = document.getElementById("waterChart").getContext("2d");

const waterChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [{
      label: "Mực nước (%)",
      data: [],
      borderWidth: 2,
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
          text: "Phần trăm mực nước (%)"
        }
      }
    }
  }
});

// ===== CẬP NHẬT DỮ LIỆU =====
function updateData() {
  fetch(FIREBASE_URL)
    .then(response => response.json())
    .then(data => {
      if (!data || data.percent === undefined) return;

      const percent = data.percent;
      const time = new Date().toLocaleTimeString();

      // hiển thị số
      document.getElementById("waterValue").innerText = percent;

      // thêm điểm mới
      waterChart.data.labels.push(time);
      waterChart.data.datasets[0].data.push(percent);

      // giới hạn 20 điểm
      if (waterChart.data.labels.length > 20) {
        waterChart.data.labels.shift();
        waterChart.data.datasets[0].data.shift();
      }

      waterChart.update();
    })
    .catch(err => console.log("Lỗi Firebase:", err));
}

// cập nhật mỗi 1 giây
setInterval(updateData, 1000);
