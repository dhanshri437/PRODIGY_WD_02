let startTime, updatedTime, difference, timerInterval;
let running = false;
let laps = [];
const timeDisplay = document.getElementById("timeDisplay");
const lapList = document.getElementById("lapList");
const lapBtn = document.getElementById("lapBtn");
const startBtn = document.getElementById("startBtn");
const bestLapDisplay = document.getElementById("bestLap");
const avgLapDisplay = document.getElementById("avgLap");
const totalLapsDisplay = document.getElementById("totalLaps");
let chart;

// Start or Stop
function startStop() {
  if (!running) {
    // Start or Resume
    startTime = new Date().getTime() - (difference || 0);
    timerInterval = setInterval(updateTime, 100);
    startBtn.textContent = difference ? "Pause" : "Pause"; // Show "Pause" even on resume
    lapBtn.disabled = false;
    running = true;
  } else {
    // Pause
    clearInterval(timerInterval);
    difference = new Date().getTime() - startTime;
    startBtn.textContent = "Resume";
    lapBtn.disabled = true;
    running = false;
  }
}

// Reset Stopwatch
function reset() {
  clearInterval(timerInterval);
  running = false;
  startTime = null; // ✅ Important to fully reset state
  difference = 0;
  timeDisplay.textContent = "00:00:00";
  startBtn.textContent = "Start";
  lapBtn.disabled = true;
  laps = [];
  updateLapList();
  updateChart();
  updateStats();
}

// Update Display
function updateTime() {
  updatedTime = new Date().getTime();
  difference = updatedTime - startTime;
  let time = formatTime(difference);
  timeDisplay.textContent = time;
}

// Format Time
function formatTime(ms) {
  const date = new Date(ms);
  const m = String(date.getUTCMinutes()).padStart(2, "0");
  const s = String(date.getUTCSeconds()).padStart(2, "0");
  const msPart = String(Math.floor(date.getUTCMilliseconds() / 10)).padStart(2, "0");
  return `${m}:${s}:${msPart}`;
}

// Record Lap
function recordLap() {
  if (!running) return;
  const lapTime = difference;
  laps.push(lapTime);
  updateLapList();
  updateChart();
  updateStats();
}

// Lap List
function updateLapList() {
  lapList.innerHTML = "";
  if (laps.length === 0) {
    lapList.innerHTML = '<div class="no-data">No laps recorded yet</div>';
    return;
  }
  laps.forEach((lap, index) => {
    const lapItem = document.createElement("div");
    lapItem.className = "lap-item";
    lapItem.innerHTML = `
      <span>Lap ${index + 1}</span>
      <span class="lap-time">${formatTime(lap)}</span>
    `;
    lapList.appendChild(lapItem);
  });
}

// Chart with Chart.js
function updateChart() {
  const ctx = document.getElementById("lapChart").getContext("2d");
  const labels = laps.map((_, i) => `Lap ${i + 1}`);
  const data = laps.map(lap => lap / 1000); // in seconds

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Lap Time (s)",
        data: data,
        backgroundColor: "rgba(108,99,255,0.2)",
        borderColor: "#6c63ff",
        borderWidth: 2,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: value => value + "s"
          }
        }
      }
    }
  });
}

// Stats Calculation
function updateStats() {
  if (laps.length === 0) {
    bestLapDisplay.textContent = "--:--:--";
    avgLapDisplay.textContent = "--:--:--";
    totalLapsDisplay.textContent = "0";
    return;
  }

  const best = Math.min(...laps);
  const avg = laps.reduce((a, b) => a + b) / laps.length;

  bestLapDisplay.textContent = formatTime(best);
  avgLapDisplay.textContent = formatTime(avg);
  totalLapsDisplay.textContent = laps.length;
}

// Theme Toggle
function toggleTheme() {
  const html = document.documentElement;
  html.dataset.theme = html.dataset.theme === "dark" ? "light" : "dark";
}
