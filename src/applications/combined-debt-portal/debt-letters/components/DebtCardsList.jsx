import React from 'react';
import { useSelector } from 'react-redux';
import DebtSummaryCard from './DebtSummaryCard';

const DebtCardsList = () => {
  const { debts } = useSelector(
    ({ combinedPortal }) => combinedPortal.debtLetters,
  );

  return (
    <ul
      className="vads-u-margin-top--3 no-bullets vads-u-padding-x--0"
      data-testid="current-va-debt-list"
    >
      {debts.map((debt, index) => (
        <DebtSummaryCard key={`${index}-${debt.compositeDebtId}`} debt={debt} />
      ))}
    </ul>
  );
};

export default DebtCardsList;
