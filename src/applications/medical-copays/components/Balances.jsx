import React from 'react';
import BalanceCard from './BalanceCard';

const mockCopayBalanceData = [
  {
    id: '3fa85f64-5717-4562-b3fc-2c973f66afa6',
    amount: 300,
    facility: 'James A. Haley Veterans’ Hospital',
    city: 'Tampa',
    dueDate: 'July 9, 2021',
  },
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa1',
    amount: 230,
    facility: 'San Diego VA Medical Center',
    city: 'San Diego',
    dueDate: 'July 2, 2021',
  },
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66acw3',
    amount: 0,
    facility: 'Philadelphia VA Medical Center',
    city: 'Philadelphia',
    dueDate: null,
  },
];

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
