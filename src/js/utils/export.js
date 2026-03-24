export const exportToCSV = (config, results) => {
  const headers = [
    "Ay", "Yıl", "Başlangıç", "Faiz %",
    ...config.incomes.map(inc => inc.name),
    "Faiz (₺)",
    "Toplam Gelir",
    ...config.expenses.map(exp => exp.name),
    ...config.periodic.map(per => per.name),
    ...config.annual.map(ann => ann.name),
    "Toplam Gider",
    "Net",
    "Bitiş Bakiye"
  ];

  let csv = headers.join("\t") + "\n";
  
  results.forEach(m => {
    const row = [
      m.month,
      m.year,
      Math.round(m.startBalance),
      m.interestRate.toFixed(1),
      ...config.incomes.map(inc => Math.round(m.incomes[inc.id] || 0)),
      Math.round(m.interest),
      Math.round(m.totalIncome),
      ...config.expenses.map(exp => Math.round(m.expenses[exp.id] || 0)),
      ...config.periodic.map(per => Math.round(m.periodic[per.id] || 0)),
      ...config.annual.map(ann => Math.round(m.annual[ann.id] || 0)),
      Math.round(m.totalExpense),
      Math.round(m.net),
      Math.round(m.endBalance)
    ];
    csv += row.join("\t") + "\n";
  });

  const blob = new Blob([csv], { type: 'text/tab-separated-values;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `nakit_akisi_detayli_${new Date().toISOString().split('T')[0]}.tsv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (name, config) => {
  const data = JSON.stringify({ name, config }, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `senaryo_${name}.json`);
  link.click();
};
