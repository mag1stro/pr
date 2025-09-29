document.addEventListener("DOMContentLoaded", async () => {
  const statusEl = document.getElementById("status");
  const resultEl = document.getElementById("result");
  const mapEl = document.getElementById("map");

  try {
    const res = await fetch("https://ipapi.co/json/");
    if (!res.ok) throw new Error("Ошибка API");
    const data = await res.json();

    statusEl.textContent = "Информация найдена:";

    const entries = [
      { label: "IP", value: data.ip },
      { label: "Город", value: data.city },
      { label: "Регион", value: data.region },
      { label: "Страна", value: data.country_name },
      { label: "Код страны", value: data.country },
      { label: "Провайдер", value: data.org },
      { label: "Часовой пояс", value: data.timezone },
      { label: "Почтовый индекс", value: data.postal }
    ];

    entries.forEach((item, idx) => {
      if (item.value) {
        const div = document.createElement("div");
        div.className = "info";
        div.style.animationDelay = `${idx * 0.1}s`;
        div.innerHTML = `<b>${item.label}:</b> ${item.value}`;
        resultEl.appendChild(div);
      }
    });

    // 📍 карта
    if (data.latitude && data.longitude) {
      const lat = parseFloat(data.latitude);
      const lon = parseFloat(data.longitude);

      const map = L.map("map").setView([lat, lon], 10);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      L.marker([lat, lon]).addTo(map).bindPopup(`${data.city}, ${data.country_name}`).openPopup();
    } else {
      mapEl.innerHTML = "<p>📌 Местоположение недоступно</p>";
      mapEl.style.color = "#aaa";
      mapEl.style.textAlign = "center";
      mapEl.style.lineHeight = "300px";
    }

  } catch (err) {
    console.error(err);
    statusEl.textContent = "Ошибка загрузки данных.";
    mapEl.innerHTML = "<p>❌ Ошибка при загрузке карты</p>";
    mapEl.style.color = "#f88";
    mapEl.style.textAlign = "center";
    mapEl.style.lineHeight = "300px";
  }
});
