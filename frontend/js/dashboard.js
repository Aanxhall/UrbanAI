// 🌆 City Data
const cityData = {
    complaints: 124,
    resolved: 78,
    pending: 46,
    traffic: "High",
    crowd: "Moderate",
    wastePickup: "15 minutes"
};

console.log("UrbanAI Dashboard Loaded");

// 🔗 Navigation
function goTo(page) {
    window.location.href = page;
}

// 📦 Common reports fetch
function getReports() {
    return JSON.parse(localStorage.getItem("reports")) || [];
}

// 🗺️ LOAD MAP + AI LOGIC
document.addEventListener("DOMContentLoaded", function () {

    if (document.getElementById("map")) {

        window.map = L.map('map').setView([17.3850, 78.4867], 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(window.map);

        let reports = getReports();
        let heatPoints = [];

        reports.forEach((r) => {
    let lat, lng;

    // use saved coordinates from reports page
    if (
        r.coordinates &&
        r.coordinates.lat &&
        r.coordinates.lng
    ) {
        lat = r.coordinates.lat + (Math.random() - 0.5) * 0.01;
lng = r.coordinates.lng + (Math.random() - 0.5) * 0.01;
    }

    // old support if any previous data exists
    else if (
        r.location &&
        typeof r.location === "object" &&
        r.location.lat &&
        r.location.lng
    ) {
        lat = r.location.lat;
        lng = r.location.lng;
    }

    // fallback only if no coordinates
    else {
        lat = 17.3850 + (Math.random() - 0.5) * 0.08;
        lng = 78.4867 + (Math.random() - 0.5) * 0.08;
    }

    L.marker([lat, lng]).addTo(map)
        .bindPopup(`
            <b>Issue:</b> ${r.issue}<br>
            <b>Severity:</b> ${r.severity || "low"}<br>
            <b>Status:</b> ${r.status || "pending"}<br>
            <b>Area:</b> ${r.location || "Unknown"}
        `);

    let weight = 0.4;

    if (r.severity === "high") weight = 1;
    else if (r.severity === "medium") weight = 0.7;

    heatPoints.push([lat, lng, weight]);
});

        if (window.L && window.L.heatLayer && heatPoints.length > 0) {
            L.heatLayer(heatPoints, {
                radius: 35,
                blur: 25,
                maxZoom: 17,
                minOpacity: 0.5
            }).addTo(map);
        }

        setTimeout(() => {
            map.invalidateSize();
        }, 300);
    }

    updateDashboardStats();
    
    loadAQI();
    updateSmartAlerts();
    updateHeatmapCard();
    updateLiveNotifications();
});

/* =========================
   🤖 URBAN AI CHATBOT
========================= */

function toggleChat() {
    const chat = document.getElementById("chatWindow");

    if (chat.classList.contains("active")) {
        chat.classList.remove("active");
    } else {
        chat.classList.add("active");
    }
}

/* ENTER KEY */
function handleKey(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

/* SEND MESSAGE */
async function sendMessage() {

    const input = document.getElementById("userInput");
    const chatBody = document.getElementById("chatBody");

    const message = input.value.trim();

    if (message === "") return;

    /* USER MESSAGE */
    chatBody.innerHTML += `
        <div class="user-msg">
            ${message}
        </div>
    `;

    input.value = "";

    chatBody.scrollTop = chatBody.scrollHeight;

    /* TYPING */
    const typingId = "typing-" + Date.now();

    chatBody.innerHTML += `
        <div class="bot-msg" id="${typingId}">
            🤖 UrbanAI is typing...
        </div>
    `;

    chatBody.scrollTop = chatBody.scrollHeight;

    /* AI RESPONSE */
    setTimeout(() => {

        const reply = getAdvancedBotResponse(message);

        const typingEl = document.getElementById(typingId);

        if (typingEl) {
            typingEl.innerHTML = `🤖 ${reply}`;
        }

        chatBody.scrollTop = chatBody.scrollHeight;

    }, 900);
}

/* =========================
   🧠 SMART AI RESPONSE ENGINE
========================= */

function getAdvancedBotResponse(message) {

    message = message.toLowerCase();

    const reports = getReports();

    const total = reports.length;

    const high = reports.filter(
        r => (r.severity || "").toLowerCase() === "high"
    ).length;

    const pending = reports.filter(
        r => (r.status || "").toLowerCase() === "pending"
    ).length;

    const resolved = reports.filter(
        r => (r.status || "").toLowerCase() === "resolved"
    ).length;

    /* TRAFFIC */
    if (
        message.includes("traffic") ||
        message.includes("jam")
    ) {

        if (high >= 5) {
            return "🚨 AI detected severe congestion zones in Hyderabad. Traffic risk is HIGH.";
        }

        if (high >= 2) {
            return "⚠️ AI predicts moderate traffic buildup within 30 minutes.";
        }

        return "✅ Traffic flow looks smooth across most monitored zones.";
    }

    /* COMPLAINTS */
    if (
        message.includes("complaint") ||
        message.includes("report")
    ) {

        return `
📊 Total Complaints: ${total}
📌 Pending: ${pending}
✅ Resolved: ${resolved}
        `;
    }

    /* WEATHER */
    if (
        message.includes("weather") ||
        message.includes("temperature")
    ) {

        const temp =
            document.getElementById("weatherTemp")?.innerText || "Unavailable";

        return `🌤️ Current Hyderabad weather is ${temp}`;
    }

    /* AQI */
    if (
        message.includes("aqi") ||
        message.includes("pollution") ||
        message.includes("air")
    ) {

        const aqi =
            document.getElementById("aqiValue")?.innerText || "Unavailable";

        return `🌍 Live Air Quality Status: ${aqi}`;
    }

    /* ALERTS */
    if (
        message.includes("alert") ||
        message.includes("danger") ||
        message.includes("risk")
    ) {

        if (high > 0) {
            return `🚨 AI detected ${high} high severity issues requiring urgent attention.`;
        }

        return "✅ No major city risk alerts detected currently.";
    }

    /* MAP */
    if (
        message.includes("map") ||
        message.includes("location")
    ) {

        return "🗺️ Live map is monitoring issue hotspots and citizen reports.";
    }

    /* AI */
    if (
        message.includes("ai") ||
        message.includes("analysis") ||
        message.includes("prediction")
    ) {

        return `
🧠 UrbanAI Analysis:
• High Severity Issues: ${high}
• Pending Complaints: ${pending}
• Resolution Efficiency: ${
            total > 0
                ? Math.round((resolved / total) * 100)
                : 0
        }%
        `;
    }

    /* GREETINGS */
    if (
        message.includes("hello") ||
        message.includes("hi")
    ) {

        return "👋 Hello! Ask me about traffic, complaints, AQI, weather, alerts, or AI analysis.";
    }

    /* DEFAULT */
    return "🤖 I can help with traffic, alerts, AQI, complaints, weather, and AI city analysis.";
}

// 📊 DASHBOARD STATS
function updateDashboardStats() {
    let reports = getReports();

    let total = reports.length;

    let pending = reports.filter(
        r => (r.status || "pending").toLowerCase() === "pending"
    ).length;

    let resolved = reports.filter(
        r => (r.status || "").toLowerCase() === "resolved"
    ).length;

    let efficiency = total > 0
        ? Math.round((resolved / total) * 100)
        : 0;

    const totalEl = document.getElementById("totalComplaints");
    const statsEl = document.getElementById("complaintStats");
    const efficiencyEl = document.getElementById("efficiencyText");

    if (totalEl) totalEl.innerText = `${total} Total`;
    if (statsEl) statsEl.innerText = `Pending: ${pending} | Resolved: ${resolved}`;
    if (efficiencyEl) efficiencyEl.innerText = `Efficiency: ${efficiency}%`;

    let highIssues = reports.filter(r => r.severity === "high").length;

    let trafficText = "Low Traffic";
    let predictionText = "✅ Traffic will remain SMOOTH";

    if (highIssues > 5) {
        trafficText = "High Traffic";
        predictionText = "🚨 Traffic likely to increase in next 30 mins";
    }
    else if (highIssues > 2) {
        trafficText = "Moderate Traffic";
        predictionText = "⚠️ Traffic may become MODERATE";
    }

    document.getElementById("trafficStatus").innerText = trafficText;
    document.getElementById("trafficPrediction").innerText = predictionText;
}

async function loadWeather() {
    const apiKey = "7bca6b85030811f988857532cc9b6627";
    const lat = 17.3914;
    const lon = 78.6000;

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        console.log("Weather Data:", data);

        const temp = data.main.temp;
        const condition = data.weather[0].description;

        const tempEl = document.getElementById("weatherTemp");
const descEl = document.getElementById("weatherDesc");

console.log("tempEl:", tempEl);
console.log("descEl:", descEl);

if (tempEl) {
    tempEl.innerText = `${Math.round(temp)}°C`;
}

if (descEl) {
    descEl.innerText = condition;
}

        console.log("Calling updateWeatherAI with:", temp);

        updateWeatherAI(temp);

    } catch (error) {
        console.error("Weather API Error:", error);
        document.getElementById("weatherTemp").innerText = "Error";
        document.getElementById("weatherDesc").innerText = "Unavailable";
    }
}

function updateWeatherAI(temp) {
    console.log("===== WEATHER AI DEBUG START =====");
    console.log("Temperature received:", temp);

    const weatherAlert = document.getElementById("weatherAlertText");

    console.log("Element check:", weatherAlert);
    console.log("Element type:", typeof weatherAlert);

    if (!weatherAlert) {
        console.error("ERROR: weatherAlertText element NOT found");
        return;
    }

    let message = "";

    if (temp >= 38) {
        message = "🔥 Heat alert across Hyderabad";
    } else if (temp >= 30) {
        message = "☀️ Warm weather and smooth traffic expected";
    } else {
        message = "🌤️ Pleasant city conditions";
    }

    console.log("Message before update:", message);

    weatherAlert.innerText = message;

    console.log("Final element text:", weatherAlert.innerText);
    console.log("===== WEATHER AI DEBUG END =====");
}
// 🌍 AQI
async function loadAQI() {
    const url = "https://api.waqi.info/feed/A546253/?token=1788e8fdc7d949ad0f5fc54d4989ab8036b706e9";

    try {
        let res = await fetch(url);
        let data = await res.json();

        let aqi = data.data.aqi;

        let status = "Good";
        if (aqi > 150) status = "Unhealthy 🚨";
        else if (aqi > 100) status = "Moderate ⚠️";

        document.getElementById("aqiValue").innerText = `AQI: ${aqi}`;
        document.getElementById("aqiStatus").innerText = status;

    } catch {}
}

// 🚨 ALERTS
function updateSmartAlerts() {
    let reports = getReports();

    let high = reports.filter(r => r.severity === "high").length;
    let medium = reports.filter(r => r.severity === "medium").length;

    let alertBox = document.getElementById("smartAlert");
    if (!alertBox) return;

    if (high > 3) {
        alertBox.innerText = "🚨 CRITICAL: Multiple severe issues detected!";
    }
    else if (medium > 3) {
        alertBox.innerText = "⚠️ WARNING: Several medium issues.";
    }
    else {
        alertBox.innerText = "✅ City conditions are stable.";
    }
}

function updateHeatmapCard() {
    let reports = getReports();

    let high = reports.filter(r => r.severity === "high").length;
    let medium = reports.filter(r => r.severity === "medium").length;

    let insight = document.getElementById("heatmapInsight");
    if (!insight) return;

    if (high >= 3) {
        insight.innerText = "🚨 Critical hotspot detected";
    } else if (medium >= 2) {
        insight.innerText = "⚠️ Moderate issue concentration";
    } else {
        insight.innerText = "✅ No major hotspot clusters";
    }
}

function updateLiveNotifications() {
    const reports = getReports();

    const highIssues = reports.filter(
        r => r.severity === "high"
    ).length;

    const pendingIssues = reports.filter(
        r => r.status === "pending"
    ).length;

    if (highIssues > 0) {
        showToast(`🚨 ${highIssues} critical issue(s) detected`);
    }

    if (pendingIssues > 3) {
        showToast(`📌 ${pendingIssues} pending complaints`);
    }
}

function showToast(message) {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerText = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 4000);
}
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded");
    loadWeather();
});
function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("closed");
}
function loadReportsOnDashboard() {
    const reports = JSON.parse(localStorage.getItem("reports")) || [];

    console.log("Dashboard Reports:", reports);

    // complaints card
    const total = reports.length;
    const pending = reports.filter(r => r.status === "pending").length;
    const resolved = reports.filter(r => r.status === "resolved").length;

    const totalEl = document.getElementById("totalComplaints");
    const statsEl = document.getElementById("complaintStats");
    const efficiencyEl = document.getElementById("efficiencyText");

    if (totalEl) {
        totalEl.innerText = `${total} Total`;
    }

    if (statsEl) {
        statsEl.innerText = `Pending: ${pending} | Resolved: ${resolved}`;
    }

    let efficiency = total === 0
        ? 0
        : Math.round((resolved / total) * 100);

    if (efficiencyEl) {
        efficiencyEl.innerText = `Efficiency: ${efficiency}%`;
    }

    // map markers
    if (window.reportMarkersLayer) {
        window.reportMarkersLayer.clearLayers();
    } else {
        window.reportMarkersLayer = L.layerGroup().addTo(window.map);
    }

    reports.forEach(report => {
        if (report.coordinates) {
            L.marker([
                report.coordinates.lat,
                report.coordinates.lng
            ])
            .addTo(window.reportMarkersLayer)
            .bindPopup(`
                <b>${report.issue}</b><br>
                Type: ${report.type}<br>
                Status: ${report.status}<br>
                Severity: ${report.severity}
            `);
        }
    });
}
document.addEventListener("DOMContentLoaded", function () {
    loadWeather();

    if (document.getElementById("map")) {
        loadReportsOnDashboard();
    }

    if (document.getElementById("reportList")) {
        displayReports();
    }
});
/* ===== PROFILE MENU ===== */
function toggleProfileMenu() {
    const menu = document.getElementById("profileDropdown");
    menu.classList.toggle("show");
}

/* ===== NOTIFICATIONS ===== */
function toggleNotifications() {
    const box = document.getElementById("notificationDropdown");
    const dot = document.getElementById("notificationDot");

    box.classList.toggle("show");

    // remove red dot after opening
    if (dot) {
        dot.style.display = "none";
    }
}

/* ===== LOGOUT ===== */
function logoutUser() {
    alert("Logged out successfully");
    window.location.href = "index.html";
}

/* close dropdown when clicking outside */
document.addEventListener("click", function(event) {
    const profile = document.querySelector(".profile-box-top");
    const profileMenu = document.getElementById("profileDropdown");

    const notification = document.querySelector(".notification-wrapper");
    const notificationMenu = document.getElementById("notificationDropdown");

    if (
        profile &&
        !profile.contains(event.target) &&
        profileMenu &&
        !profileMenu.contains(event.target)
    ) {
        profileMenu.classList.remove("show");
    }

    if (
        notification &&
        !notification.contains(event.target) &&
        notificationMenu &&
        !notificationMenu.contains(event.target)
    ) {
        notificationMenu.classList.remove("show");
    }
});
