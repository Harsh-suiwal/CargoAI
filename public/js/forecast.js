// public/js/forecast.js
// Loads a freight forecast for the selected route and renders it as manifest rows.

const routeSelect = document.getElementById('route-select');
const resultDiv = document.getElementById('forecast-result');

async function loadForecast(route) {
  resultDiv.innerHTML = '<p class="subtext" style="padding:20px">Loading forecast...</p>';

  try {
    const res = await fetch(`/api/forecast?route=${encodeURIComponent(route)}`);
    const data = await res.json();

    if (!res.ok) {
      resultDiv.innerHTML = `<p class="subtext" style="padding:20px;color:var(--risk-high)">${data.error}</p>`;
      return;
    }

    // FIXED: Access the predictions array inside the forecast object
    const predictions = data.forecast.predictions || data.forecast;

    const rows = predictions
      .map(
        (point) => `
        <div class="manifest-row">
          <span class="label">${point.date}</span>
          <!-- FIXED: Mapped to predicted_rate_usd_per_ton -->
          <span class="value">$${point.predicted_rate_usd_per_ton.toFixed(2)} / MT</span>
        </div>`
      )
      .join('');

    // FIXED: Safely default to 'STABLE' if trend isn't provided by the backend
    const trend = data.trend || 'STABLE';
    const trendClass = trend === 'RISING' ? 'high' : trend === 'FALLING' ? 'low' : 'medium';

    resultDiv.innerHTML = `
      <div class="manifest-header">${data.route || route}</div>
      ${rows}
      <div class="trend-note">
        Trend: <span class="status ${trendClass}">${trend}</span>
      </div>
    `;
  } catch (err) {
    console.error("Forecast render error:", err);
    resultDiv.innerHTML = '<p class="subtext" style="padding:20px;color:var(--risk-high)">Could not reach the server.</p>';
  }
}

routeSelect.addEventListener('change', () => loadForecast(routeSelect.value));

// Load default route on page load
loadForecast(routeSelect.value);