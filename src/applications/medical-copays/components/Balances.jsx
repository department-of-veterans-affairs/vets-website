import React from 'react';
import BalanceCard from './BalanceCard';
import { mockCopayBalanceData } from '../utils/mockData';

export const Balances = () => {
  return (
    <>
      <h2>What you owe to your {mockCopayBalanceData.length} facilities</h2>
      {mockCopayBalanceData.map(balance => (
        <BalanceCard
          key={balance.id}
          amount={balance.amount}
          facility={balance.facility}
          city={balance.city}
          dueDate={balance.dueDate}
        />
      ))}
    </>
  );
};

export default Balances;
