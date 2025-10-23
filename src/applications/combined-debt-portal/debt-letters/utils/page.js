export const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

// returns current debt if populated in selectedDebt or
//  finds current debt via URL and compositeDebtId
export const getCurrentDebt = (selectedDebt, debts, location) => {
  const selectedDebtEmpty = Object.keys(selectedDebt).length === 0;
  const debtsEmpty = !debts.length;

  if (selectedDebtEmpty && debtsEmpty) {
    return {};
  }

  if (!selectedDebtEmpty) {
    return selectedDebt;
  }

  // get debtId out of the URL
  const urlDebtId = location.pathname.replace(/[^0-9]/g, '');

  // return debt that has the same compositeDebtId as the URL
  const filteredDebt = debts?.find(debt => debt.compositeDebtId === urlDebtId);

  if (!filteredDebt) {
    return {};
  }

  return filteredDebt;
};
