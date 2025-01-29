// Fungsi untuk mendapatkan lokasi pengguna
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                getWeatherByCoords(lat, lon);
            },
            (error) => {
                alert("Gagal mendapatkan lokasi. Masukkan kota secara manual.");
                console.error("Error lokasi:", error);
            }
        );
    } else {
        alert("Geolocation tidak didukung oleh browser ini.");
    }
}

// Fungsi untuk mendapatkan cuaca berdasarkan koordinat
async function getWeatherByCoords(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayWeather(data, lat, lon);
    } catch (error) {
        console.error("Error mengambil data cuaca:", error);
        document.getElementById("weather-info").innerHTML = `<p style="color:red;">Terjadi kesalahan, coba lagi.</p>`;
    }
}

// Fungsi untuk mendapatkan cuaca berdasarkan nama kota
async function getWeather() {
    const city = document.getElementById("city").value;

    if (city === "") {
        alert("Masukkan nama kota terlebih dahulu!");
        return;
    }

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${city}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.length > 0) {
            const lat = data[0].lat;
            const lon = data[0].lon;
            getWeatherByCoords(lat, lon);
        } else {
            alert("Kota tidak ditemukan, coba lagi.");
        }
    } catch (error) {
        console.error("Error mencari kota:", error);
    }
}
// Pemetaan kode cuaca Open-Meteo ke ikon
const weatherIcons = {
    0: { icon: "01d", description: "Cerah dan terang" }, // Cerah
    1: { icon: "02d", description: "Sebagian berawan" }, // Sebagian berawan
    2: { icon: "03d", description: "Berawan" }, // Berawan
    3: { icon: "04d", description: "Mendung" }, // Mendung
    45: { icon: "50d", description: "Kabut" }, // Kabut
    48: { icon: "50d", description: "Kabut tebal" }, // Kabut tebal
    51: { icon: "09d", description: "Gerimis ringan" }, // Gerimis ringan
    53: { icon: "09d", description: "Gerimis sedang" }, // Gerimis sedang
    55: { icon: "09d", description: "Gerimis lebat" }, // Gerimis lebat
    61: { icon: "10d", description: "Hujan ringan" }, // Hujan ringan
    63: { icon: "10d", description: "Hujan sedang" }, // Hujan sedang
    65: { icon: "10d", description: "Hujan lebat" }, // Hujan lebat
    80: { icon: "11d", description: "Hujan badai ringan" }, // Hujan badai ringan
    81: { icon: "11d", description: "Hujan badai sedang" }, // Hujan badai sedang
    82: { icon: "11d", description: "Hujan badai lebat" }, // Hujan badai lebat
};

// Fungsi untuk menampilkan cuaca
function displayWeather(data) {
    const currentWeather = data.current_weather;
    const forecast = data.daily;
    const weatherCode = currentWeather.weathercode;
    const weatherData = weatherIcons[weatherCode] || { icon: "01d", description: "Cerah dan terang" }; // Default cerah

    let weatherHTML = `
        <h2>Cuaca Saat Ini</h2>
        <img src="https://openweathermap.org/img/wn/${weatherData.icon}.png" alt="Ikon Cuaca">
        <p><strong>Cuaca:</strong> ${weatherData.description}</p>
        <p><strong>Suhu:</strong> ${currentWeather.temperature}°C</p>
        <p><strong>Kecepatan Angin:</strong> ${currentWeather.windspeed} km/h</p>
        <h3>Prakiraan Cuaca 3 Hari</h3>
        <div class="forecast-container">
    `;

    // Menampilkan prakiraan cuaca untuk 3 hari
    for (let i = 0; i < 3; i++) {
        const dailyCode = forecast.weathercode[i];
        const dailyWeatherData = weatherIcons[dailyCode] || { icon: "01d", description: "Cerah dan terang" };

        weatherHTML += `
            <div class="forecast">
                <h4>Hari ${i + 1}</h4>
                <p><strong>Max:</strong> ${forecast.temperature_2m_max[i]}°C</p>
                <p><strong>Min:</strong> ${forecast.temperature_2m_min[i]}°C</p>
                <img src="https://openweathermap.org/img/wn/${dailyWeatherData.icon}.png" alt="Ikon Cuaca">
                <p><strong>Cuaca:</strong> ${dailyWeatherData.description}</p>
            </div>
        `;
    }

    weatherHTML += `</div>`;
    document.getElementById("weather-info").innerHTML = weatherHTML;
}