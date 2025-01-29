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
    const url = `https://wttr.in/${lat},${lon}?format=j1`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayWeather(data);
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

    const url = `https://wttr.in/${city}?format=j1`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error("Error mengambil data cuaca:", error);
        document.getElementById("weather-info").innerHTML = `<p style="color:red;">Terjadi kesalahan, coba lagi.</p>`;
    }
}

// Fungsi untuk menampilkan data cuaca
function displayWeather(data) {
    const currentWeather = data.current_condition[0];
    const forecast = data.weather.slice(0, 3); // 3 hari ke depan
    const cityName = data.nearest_area[0].areaName[0].value;
    const countryName = data.nearest_area[0].country[0].value;

    let weatherHTML = `
        <h2>Cuaca di ${cityName}, ${countryName}</h2>
        <img src="https://wttr.in/${cityName}_0q.png" alt="Ikon Cuaca">
        <p><strong>Cuaca:</strong> ${currentWeather.weatherDesc[0].value}</p>
        <p><strong>Suhu:</strong> ${currentWeather.temp_C}°C</p>
        <p><strong>Kelembaban:</strong> ${currentWeather.humidity}%</p>
        <p><strong>Kecepatan Angin:</strong> ${currentWeather.windspeedKmph} km/h</p>
        <h3>Prakiraan Cuaca 3 Hari</h3>
        <div class="forecast-container">
    `;

    forecast.forEach((day, index) => {
        weatherHTML += `
            <div class="forecast">
                <h4>Hari ${index + 1}</h4>
                <p><strong>Max:</strong> ${day.maxtempC}°C</p>
                <p><strong>Min:</strong> ${day.mintempC}°C</p>
                <p><strong>Cuaca:</strong> ${day.hourly[4].weatherDesc[0].value}</p>
                <img src="https://wttr.in/${cityName}_${index + 1}q.png" alt="Ikon Cuaca">
            </div>
        `;
    });

    weatherHTML += `</div>`;
    document.getElementById("weather-info").innerHTML = weatherHTML;
}
