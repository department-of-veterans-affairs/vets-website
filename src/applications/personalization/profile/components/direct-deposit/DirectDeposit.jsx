import React from 'react';
import { useSelector } from 'react-redux';

export const DirectDeposit = () => {
  const { controlInformation, paymentAccount } = useSelector(
    state => state?.directDeposit,
  );

  if (!controlInformation?.canUpdateDirectDeposit) {
    return <div>Cannot update direct deposit</div>;
  }

  return (
    <div>
      <h1>Direct Deposit</h1>
      <p>Financial Institution: {paymentAccount?.name || 'none'}</p>
      <p>Account Number: {paymentAccount.accountNumber}</p>
      <p>Routing Number: {paymentAccount.routingNumber}</p>
      <p>Account type: {paymentAccount.accountType}</p>
    </div>
  );
};
