import React from 'react';

// this is used when the user is logged in, but they are flagged in one of three ways:

// Criteria within the user state in the selector cnpDirectDepositIsBlocked
// 1. they have a !isCompetentIndicator
// 2. they have a !noFiduciaryAssignedIndicator
// 3. they have a !notDeceasedIndicator

export const AccountBlocked = () => {
  return <div>AccountBlocked</div>;
};
