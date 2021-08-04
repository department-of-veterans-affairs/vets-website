import React from 'react';

const BalanceCard = () => (
  <div className="vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-bottom--2">
    BALANCE CARD
  </div>
);

export const Balances = () => (
  <>
    <h2>What you owe to each facility</h2>
    <BalanceCard />
    <BalanceCard />
    <BalanceCard />
  </>
);

export default Balances;
