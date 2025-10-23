import React from 'react';
import { useSelector } from 'react-redux';
import DebtSummaryCard from './DebtSummaryCard';

const DebtCardsList = () => {
  const { debts } = useSelector(
    ({ combinedPortal }) => combinedPortal.debtLetters,
  );

  return (
    <div className="vads-u-margin-top--3" data-testid="current-va-debt-list">
      {debts.map((debt, index) => (
        <DebtSummaryCard key={`${index}-${debt.compositeDebtId}`} debt={debt} />
      ))}
    </div>
  );
};

export default DebtCardsList;
