import { formatMoney } from '../utils/format.js';

export const renderChart = (container, results) => {
  if (!results || results.length === 0) return;

  const width = container.clientWidth || 800;
  const height = 300;
  const padding = 40;

  const balances = results.map(r => r.endBalance);
  const maxB = Math.max(...balances, 0);
  const minB = Math.min(...balances, 0);
  const range = maxB - minB || 1;

  const getX = (i) => padding + (i * (width - 2 * padding) / (results.length - 1 || 1));
  const getY = (v) => height - padding - ((v - minB) * (height - 2 * padding) / range);

  const zeroY = getY(0);
  
  let points = results.map((r, i) => `${getX(i)},${getY(r.endBalance)}`).join(' ');

  let svg = `
    <div class="chart-container">
      <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
        <!-- Zero Line -->
        <line x1="${padding}" y1="${zeroY}" x2="${width - padding}" y2="${zeroY}" stroke="#e74c3c" stroke-dasharray="4" stroke-width="1" />
        
        <!-- Path -->
        <polyline points="${points}" fill="none" stroke="#10b068" stroke-width="2" />
        
        <!-- Points -->
        ${results.map((r, i) => `
          <circle cx="${getX(i)}" cy="${getY(r.endBalance)}" r="3" fill="${r.endBalance < 0 ? '#e74c3c' : '#10b068'}" />
        `).join('')}
      </svg>
      
      <div class="chart-stats">
        <div class="stat-box">
          <label>En Yüksek Bakiye</label>
          <span>${formatMoney(maxB)} ₺</span>
        </div>
        <div class="stat-box">
          <label>En Düşük Bakiye</label>
          <span class="${minB < 0 ? 'text-danger' : ''}">${formatMoney(minB)} ₺</span>
        </div>
      </div>
      
      ${minB < 0 ? `
        <div class="chart-warning">
          ⚠️ Projeksiyon süresince bakiyeniz negatife düşüyor!
        </div>
      ` : ''}
    </div>
  `;

  container.innerHTML = svg;
};
