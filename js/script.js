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
    0: "01d", // Cerah
    1: "02d", // Sebagian berawan
    2: "03d", // Berawan
    3: "04d", // Mendung
    45: "50d", // Kabut
    48: "50d", // Kabut tebal
    51: "09d", // Gerimis ringan
    53: "09d", // Gerimis sedang
    55: "09d", // Gerimis lebat
    61: "10d", // Hujan ringan
    63: "10d", // Hujan sedang
    65: "10d", // Hujan lebat
    80: "11d", // Hujan badai ringan
    81: "11d", // Hujan badai sedang
    82: "11d", // Hujan badai lebat
};

// Fungsi untuk menampilkan data cuaca
function displayWeather(data, lat, lon) {
    const currentWeather = data.current_weather;
    const forecast = data.daily;
    const weatherCode = currentWeather.weathercode;
    const weatherIcon = weatherIcons[weatherCode] || "01d"; // Default ikon cerah

    let weatherHTML = `
        <h2>Cuaca Saat Ini</h2>
        <img src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="Ikon Cuaca">
        <p><strong>Suhu:</strong> ${currentWeather.temperature}°C</p>
        <p><strong>Kecepatan Angin:</strong> ${currentWeather.windspeed} km/h</p>
        <h3>Prakiraan Cuaca 3 Hari</h3>
        <div class="forecast-container">
    `;

    for (let i = 0; i < 3; i++) {
        const dailyCode = forecast.weathercode[i];
        const dailyIcon = weatherIcons[dailyCode] || "01d";

        weatherHTML += `
            <div class="forecast">
                <h4>Hari ${i + 1}</h4>
                <p><strong>Max:</strong> ${forecast.temperature_2m_max[i]}°C</p>
                <p><strong>Min:</strong> ${forecast.temperature_2m_min[i]}°C</p>
                <img src="https://openweathermap.org/img/wn/${dailyIcon}.png" alt="Ikon Cuaca">
            </div>
        `;
    }

    weatherHTML += `</div>`;
    document.getElementById("weather-info").innerHTML = weatherHTML;
}
