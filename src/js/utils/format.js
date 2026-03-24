export const formatMoney = (val) => {
  if (val === null || val === undefined || isNaN(val)) return "-";
  if (val === 0) return "-";
  return new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(val);
};

export const parseMoney = (str) => {
  if (typeof str === 'number') return str;
  if (!str) return 0;
  return parseFloat(str.replace(/\./g, '').replace(/,/g, '.')) || 0;
};
