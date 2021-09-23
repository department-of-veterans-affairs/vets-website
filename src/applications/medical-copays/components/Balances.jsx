import React from 'react';
import BalanceCard from './BalanceCard';

export const Balances = ({ statementData }) => (
  <>
    <h2>What you owe to your {statementData?.length} facilities</h2>
    {statementData?.map(balance => (
      <BalanceCard
        key={balance.id}
        amount={balance.pHAmtDue}
        facility={balance.station.facilitYDesc}
        city={balance.station.city}
        dueDate={balance.pSStatementDate}
      />
    ))}
  </>
);

export default Balances;
