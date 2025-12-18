const FIREBASE_URL =
  "https://flood-monitor-iot-d5766-default-rtdb.asia-southeast1.firebasedatabase.app/data.json";

setInterval(async () => {
  try {
    const res = await fetch(FIREBASE_URL);
    const data = await res.json();

    document.getElementById("water").innerText =
      data.water_cm.toFixed(1);

    document.getElementById("percent").innerText =
      data.percent.toFixed(1);

  } catch (e) {
    console.error("Lỗi lấy dữ liệu", e);
  }
}, 1000);
