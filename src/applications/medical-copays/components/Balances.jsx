import React from 'react';
import { useSelector } from 'react-redux';
import BalanceCard from './BalanceCard';

export const Balances = () => {
  const statementData = useSelector(({ mcp }) => mcp.statements);

  return (
    <>
      <h2>What you owe to your {statementData?.length} facilities</h2>
      {statementData?.map(balance => (
        <BalanceCard
          key={balance.id}
          amount={balance.pHAmtDue}
          facility={balance.station.facilitYDesc}
          city={balance.station.city}
          dueDate={balance.pSStatementDateOutput}
        />
      ))}
    </>
  );
};

export default Balances;
