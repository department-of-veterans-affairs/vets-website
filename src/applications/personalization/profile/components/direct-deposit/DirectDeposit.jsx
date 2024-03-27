import React from 'react';
import { useSelector } from 'react-redux';

import Headline from '../ProfileSectionHeadline';

export const DirectDeposit = () => {
  const { controlInformation, paymentAccount } = useSelector(
    state => state?.directDeposit,
  );

  if (!controlInformation?.canUpdateDirectDeposit) {
    return <div>Cannot update direct deposit</div>;
  }

  return (
    <div>
      <Headline dataTestId="unified-direct-deposit">
        Direct deposit information
      </Headline>
      <p>Financial Institution: {paymentAccount?.name || 'none'}</p>
      <p>Account Number: {paymentAccount.accountNumber}</p>
      <p>Routing Number: {paymentAccount.routingNumber}</p>
      <p>Account type: {paymentAccount.accountType}</p>
    </div>
  );
};
