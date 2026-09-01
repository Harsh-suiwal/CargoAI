// public/js/cargoForm.js
// Handles the cargo requirement form submission and displays the feasibility result.

document.getElementById('cargo-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const payload = {
    cargoType: document.getElementById('cargoType').value,
    quantityMT: Number(document.getElementById('quantityMT').value),
    vesselType: document.getElementById('vesselType').value,
    origin: document.getElementById('origin').value,
    destination: document.getElementById('destination').value,
  };

  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '<p class="subtext">Evaluating...</p>';

  try {
    const res = await fetch('/api/cargo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      resultDiv.innerHTML = `<p class="subtext" style="color:var(--risk-high)">${data.error}</p>`;
      return;
    }

    const riskClass = data.feasibility.risk.toLowerCase();

    resultDiv.innerHTML = `
      <div class="manifest">
        <div class="manifest-header">
          <span>Feasibility result</span>
          <span class="status ${data.feasibility.pass ? 'low' : 'high'}">
            ${data.feasibility.pass ? 'PASS' : 'FAIL'}
          </span>
        </div>
        <div class="manifest-row">
          <span class="label">Congestion risk</span>
          <span class="status ${riskClass}">${data.feasibility.risk}</span>
        </div>
        <div class="manifest-row">
          <span class="label">Vessel deadweight</span>
          <span class="value">${data.feasibility.details.vesselDWT.toLocaleString()} DWT</span>
        </div>
        <div class="manifest-row">
          <span class="label">Port max deadweight</span>
          <span class="value">${data.feasibility.details.portMaxDWT.toLocaleString()} DWT</span>
        </div>
      </div>
    `;
  } catch (err) {
    resultDiv.innerHTML = '<p class="subtext" style="color:var(--risk-high)">Could not reach the server.</p>';
  }
});
