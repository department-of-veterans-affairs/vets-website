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
      <p>
        Any payments you may have made to your current debts will not be
        reflected here until our systems are updated with the next monthly
        statement.
      </p>
      <div className="vads-u-margin-top--3" data-testid="debt-list">
        {debts.map((debt, index) => (
          <DebtSummaryCard key={`${index}-${debt.fileNumber}`} debt={debt} />
        ))}
      </div>
    </>
  );
};

export default DebtCardsList;
