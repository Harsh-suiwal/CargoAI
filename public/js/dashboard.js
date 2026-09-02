// public/js/dashboard.js
// Loads the combined forecast + feasibility + recommendation payload and renders it.

async function loadDashboard() {
  const container = document.getElementById('dashboard-content');

  try {
    const res = await fetch('/api/dashboard');
    const data = await res.json();

    if (!res.ok) {
      container.innerHTML = `<p class="subtext" style="color:var(--risk-high)">${data.error}</p>`;
      return;
    }

    const recClass = data.recommendation === 'BOOK' ? 'book' : 'wait';
    // FIXED: Mapped to risk_level instead of risk
    const riskClass = data.feasibility.risk_level.toLowerCase();
    
    // FIXED: Mapped to forecast.predictions array
    const predictions = data.forecast.predictions;
    const latestForecast = predictions[predictions.length - 1];

    container.innerHTML = `
      <div class="recommendation-banner ${recClass}">
        <span class="rec-label">${data.recommendation}</span>
        <span>${data.route}</span>
      </div>

      <div class="manifest">
        <div class="manifest-header">Voyage summary</div>
        <div class="manifest-row">
          <span class="label">Latest forecast rate</span>
          <!-- FIXED: Mapped to predicted_rate_usd_per_ton -->
          <span class="value">$${latestForecast.predicted_rate_usd_per_ton.toFixed(2)} / MT</span>
        </div>
        <div class="manifest-row">
          <span class="label">Vessel feasibility</span>
          <!-- FIXED: Mapped to feasible instead of pass -->
          <span class="value">${data.feasibility.feasible ? 'PASS' : 'FAIL'}</span>
        </div>
        <div class="manifest-row">
          <span class="label">Congestion risk</span>
          <!-- FIXED: Mapped to risk_level -->
          <span class="status ${riskClass}">${data.feasibility.risk_level.toUpperCase()}</span>
        </div>
      </div>
    `;
  } catch (err) {
    // Added console.error so you never fly blind again!
    console.error("Dashboard render error:", err);
    container.innerHTML = '<p class="subtext" style="color:var(--risk-high)">Could not reach the server.</p>';
  }
}

loadDashboard();