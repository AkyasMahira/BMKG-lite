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

