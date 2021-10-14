import React from 'react';
import BalanceCard from './BalanceCard';

export const Balances = ({ statementData }) => {
  const single = <h2>What you owe to your facility</h2>;
  const multiple = (
    <h2>What you owe to your {statementData?.length} facilities</h2>
  );

  return (
    <>
      {statementData?.length === 1 ? single : multiple}
      {statementData?.map(balance => (
        <BalanceCard
          id={balance.id}
          key={balance.id}
          amount={balance.pHAmtDue}
          facility={balance.station.facilityName}
          city={balance.station.city}
          date={balance.pSStatementDate}
        />
      ))}
    </>
  );
};

export default Balances;
