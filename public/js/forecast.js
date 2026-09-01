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

    const rows = data.forecast
      .map(
        (point) => `
        <div class="manifest-row">
          <span class="label">${point.date}</span>
          <span class="value">$${point.predictedRate.toFixed(2)} / MT</span>
        </div>`
      )
      .join('');

    const trendClass = data.trend === 'RISING' ? 'high' : data.trend === 'FALLING' ? 'low' : 'medium';

    resultDiv.innerHTML = `
      <div class="manifest-header">${data.route}</div>
      ${rows}
      <div class="trend-note">
        Trend: <span class="status ${trendClass}">${data.trend}</span>
      </div>
    `;
  } catch (err) {
    resultDiv.innerHTML = '<p class="subtext" style="padding:20px;color:var(--risk-high)">Could not reach the server.</p>';
  }
}

routeSelect.addEventListener('change', () => loadForecast(routeSelect.value));

// Load default route on page load
loadForecast(routeSelect.value);
