import { formatMoney } from '../utils/format.js';

export const renderCards = (container, results) => {
  if (!results || results.length === 0) return;

  const startBalance = results[0].startBalance;
  const endBalance = results[results.length - 1].endBalance;
  const greenMonths = results.filter(r => r.endBalance >= 0).length;
  const criticalMonth = results.find(r => r.endBalance < 0);

  const html = `
    <div class="summary-cards">
      <div class="card">
        <label>Başlangıç Bakiye</label>
        <div class="value">${formatMoney(startBalance)} ₺</div>
      </div>
      <div class="card">
        <label>Bitiş Bakiye</label>
        <div class="value ${endBalance < 0 ? 'text-danger' : 'text-success'}">${formatMoney(endBalance)} ₺</div>
      </div>
      <div class="card">
        <label>Yeşil Ay Sayısı</label>
        <div class="value">${greenMonths} / ${results.length}</div>
      </div>
      <div class="card">
        <label>Kritik Ay</label>
        <div class="value ${criticalMonth ? 'text-danger' : 'text-success'}">
          ${criticalMonth ? `${criticalMonth.month}/${criticalMonth.year}` : 'Yok'}
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
};
