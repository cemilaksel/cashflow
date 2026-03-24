import { formatMoney } from '../utils/format.js';

export const renderTable = (container, config, results) => {
  let html = `
    <div class="table-wrapper">
      <table>
        <thead>
          <tr class="group-header">
            <th class="sticky-col">Zaman</th>
            <th colspan="2" class="bg-bakiye">Bakiye & Faiz</th>
            <th colspan="${config.incomes.length + 2}" class="bg-gelir-total">Gelirler</th>
            <th colspan="${config.expenses.length}" class="bg-gider">Giderler</th>
            <th colspan="${config.periodic.length}" class="bg-donemsel">Dönemsel</th>
            <th colspan="${config.annual.length}" class="bg-yillik">Yıllık</th>
            <th colspan="3" class="bg-bakiye">Özet</th>
          </tr>
          <tr>
            <th class="sticky-col">Ay / Yıl</th>
            <th class="bg-bakiye">Başlangıç</th>
            <th class="bg-faiz">Faiz %</th>
            ${config.incomes.map(inc => `<th class="bg-gelir">${inc.name}</th>`).join('')}
            <th class="bg-faiz">Faiz (₺)</th>
            <th class="bg-gelir-total">Top. Gelir</th>
            ${config.expenses.map(exp => `<th class="bg-gider">${exp.name}</th>`).join('')}
            ${config.periodic.map(per => `<th class="bg-donemsel">${per.name}</th>`).join('')}
            ${config.annual.map(ann => `<th class="bg-yillik">${ann.name}</th>`).join('')}
            <th class="bg-gider-total">Top. Gider</th>
            <th class="bg-net">Net</th>
            <th class="bg-bakiye">Bitiş Bakiye</th>
          </tr>
        </thead>
        <tbody>
  `;

  results.forEach((m, i) => {
    const isYearChange = i > 0 && results[i-1].year !== m.year;
    const rowClass = m.endBalance < 0 ? 'negative-row' : '';
    const yearLineClass = isYearChange ? 'year-line' : '';

    html += `<tr class="${rowClass} ${yearLineClass}">`;
    html += `<td class="sticky-col">${m.month} / ${m.year}</td>`;
    html += `<td class="text-right font-bold">${formatMoney(m.startBalance)}</td>`;
    html += `<td class="text-right text-faiz">%${m.interestRate.toFixed(1)}</td>`;

    // Incomes
    config.incomes.forEach(inc => {
      const val = m.incomes[inc.id] || 0;
      html += `<td class="text-right ${val === 0 ? 'zero-val' : ''}">${formatMoney(val)}</td>`;
    });
    html += `<td class="text-right text-faiz">${formatMoney(m.interest)}</td>`;
    html += `<td class="text-right font-bold">${formatMoney(m.totalIncome)}</td>`;

    // Expenses
    config.expenses.forEach(exp => {
      const val = m.expenses[exp.id] || 0;
      html += `<td class="text-right ${val === 0 ? 'zero-val' : ''}">${formatMoney(val)}</td>`;
    });

    // Periodic
    config.periodic.forEach(per => {
      const val = m.periodic[per.id] || 0;
      const cellClass = val > 0 ? 'bg-donemsel-active' : 'zero-val';
      html += `<td class="text-right ${cellClass}">${formatMoney(val)}</td>`;
    });

    // Annual
    config.annual.forEach(ann => {
      const val = m.annual[ann.id] || 0;
      const cellClass = val > 0 ? 'bg-yillik-active' : 'zero-val';
      html += `<td class="text-right ${cellClass}">${formatMoney(val)}</td>`;
    });

    html += `<td class="text-right font-bold">${formatMoney(m.totalExpense)}</td>`;
    html += `<td class="text-right font-bold text-net">${formatMoney(m.net)}</td>`;
    html += `<td class="text-right font-bold">${formatMoney(m.endBalance)}</td>`;
    html += `</tr>`;
  });

  html += `</tbody></table></div>`;
  container.innerHTML = html;
};
