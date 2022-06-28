import React from 'react';
import { useSelector } from 'react-redux';
import DebtSummaryCard from './DebtSummaryCard';

const DebtCardsList = () => {
  const { debts } = useSelector(
    ({ combinedPortal }) => combinedPortal.debtLetters,
  );

  return (
    <>
      <h2
        id="currentDebts"
        className="vads-u-margin-top--4 vads-u-margin-bottom--2"
        data-testid="current-va-debt-list"
      >
        Current debts
      </h2>
      <div className="vads-u-margin-top--3" data-testid="debt-list">
        {debts.map((debt, index) => (
          <DebtSummaryCard key={`${index}-${debt.fileNumber}`} debt={debt} />
        ))}
      </div>
    </>
  );
};

export default DebtCardsList;
