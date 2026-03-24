export const calculateProjection = (config) => {
  const months = [];
  let currentBalance = config.base.balance;
  let currentRate = config.interest.rate;
  
  const startYear = config.base.startYear;
  const startMonth = config.base.startMonth;
  const duration = config.base.duration;

  for (let i = 0; i < duration; i++) {
    const monthIndex = (startMonth + i - 1) % 12 + 1;
    const yearIndex = startYear + Math.floor((startMonth + i - 1) / 12);
    const yearDiff = yearIndex - startYear;

    // Interest rate drop every 2 months
    if (i > 0 && i % 2 === 0) {
      currentRate = Math.max(config.interest.min, currentRate - config.interest.drop);
    }

    const monthData = {
      month: monthIndex,
      year: yearIndex,
      incomes: {},
      expenses: {},
      periodic: {},
      annual: {},
      totalIncome: 0,
      totalExpense: 0,
      interest: 0,
      startBalance: currentBalance,
      endBalance: 0
    };

    // 1. Incomes
    config.incomes.forEach(inc => {
      let active = false;
      if (inc.months === "tum") {
        active = true;
      } else {
        const [start, end] = inc.months.split("-").map(Number);
        if (start <= end) {
          active = monthIndex >= start && monthIndex <= end;
        } else {
          active = monthIndex >= start || monthIndex <= end;
        }
      }

      if (active) {
        const amount = inc.amount * Math.pow(1 + inc.increase / 100, yearDiff);
        monthData.incomes[inc.id] = amount;
        monthData.totalIncome += amount;
      } else {
        monthData.incomes[inc.id] = 0;
      }
    });

    // 2. Fixed Expenses
    config.expenses.forEach(exp => {
      const amount = exp.amount * Math.pow(1 + exp.increase / 100, yearDiff);
      monthData.expenses[exp.id] = amount;
      monthData.totalExpense += amount;
    });

    // 3. Periodic Expenses
    config.periodic.forEach(per => {
      let active = false;
      // Check if it's within the installment period
      // It starts at per.startMonth every year if repeat is true
      // Or only in the first year if repeat is false
      
      const checkActive = (y) => {
        const startTotalMonths = y * 12 + per.startMonth;
        const currentTotalMonths = yearIndex * 12 + monthIndex;
        return currentTotalMonths >= startTotalMonths && currentTotalMonths < startTotalMonths + per.count;
      };

      if (per.repeat) {
        // Check current year and previous year (in case it spans across years)
        active = checkActive(yearIndex) || checkActive(yearIndex - 1);
      } else {
        active = checkActive(startYear);
      }

      if (active) {
        const amount = per.amount * Math.pow(1 + per.increase / 100, yearDiff);
        monthData.periodic[per.id] = amount;
        monthData.totalExpense += amount;
      } else {
        monthData.periodic[per.id] = 0;
      }
    });

    // 4. Annual Expenses
    config.annual.forEach(ann => {
      if (monthIndex === ann.month) {
        const amount = ann.amount * Math.pow(1 + ann.increase / 100, yearDiff);
        monthData.annual[ann.id] = amount;
        monthData.totalExpense += amount;
      } else {
        monthData.annual[ann.id] = 0;
      }
    });

    // 5. Interest Calculation
    // Monthly net rate
    const monthlyNetRate = (currentRate / 12 / 100) * (1 - config.interest.tax / 100);
    // We assume interest is calculated on the starting balance of the month
    monthData.interest = currentBalance > 0 ? currentBalance * monthlyNetRate : 0;
    monthData.interestRate = currentRate;
    
    // Add interest to total income as requested
    monthData.totalIncome += monthData.interest;
    
    monthData.net = monthData.totalIncome - monthData.totalExpense;
    monthData.endBalance = currentBalance + monthData.net;
    
    currentBalance = monthData.endBalance;
    months.push(monthData);
  }

  return months;
};
