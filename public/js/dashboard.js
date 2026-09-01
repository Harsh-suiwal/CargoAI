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
    const riskClass = data.feasibility.risk.toLowerCase();
    const latestForecast = data.forecast[data.forecast.length - 1];

    container.innerHTML = `
      <div class="recommendation-banner ${recClass}">
        <span class="rec-label">${data.recommendation}</span>
        <span>${data.route}</span>
      </div>

      <div class="manifest">
        <div class="manifest-header">Voyage summary</div>
        <div class="manifest-row">
          <span class="label">Latest forecast rate</span>
          <span class="value">$${latestForecast.predictedRate.toFixed(2)} / MT</span>
        </div>
        <div class="manifest-row">
          <span class="label">Vessel feasibility</span>
          <span class="value">${data.feasibility.pass ? 'PASS' : 'FAIL'}</span>
        </div>
        <div class="manifest-row">
          <span class="label">Congestion risk</span>
          <span class="status ${riskClass}">${data.feasibility.risk}</span>
        </div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = '<p class="subtext" style="color:var(--risk-high)">Could not reach the server.</p>';
  }
}

loadDashboard();
