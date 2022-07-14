export const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

export const getCurrentDebt = (selectedDebt, debts, location) => {
  /* 
  TODO TECH DEBT: https://github.com/department-of-veterans-affairs/va.gov-team/issues/27790
  Once debt.id is available via backend and endpoint to fetch single debtById is created
  remove getCurrentDebt and replace with backend single item call
*/
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
  // create debtIds derived from the debt fileNumber and deductionCode and add to debts
  const debtsWithId = debts?.reduce((acc, debt) => {
    acc.push({
      ...debt,
      debtId: `${debt.fileNumber + debt.deductionCode}`,
    });
    return acc;
  }, []);
  // return debt that has the same debtId as the currentDebt
  const [filteredDebt] = debtsWithId?.filter(debt => debt.debtId === urlDebtId);

  if (!filteredDebt) {
    return {};
  }

  return filteredDebt;
};
