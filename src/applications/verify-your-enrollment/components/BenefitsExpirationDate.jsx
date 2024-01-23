import React from 'react';
import { ACTIVEDUTYBENEFITSSTATEMENT } from '../constants/index';

const BenefitsExpirationDate = () => {
  const monthYear = 'April 30th';
  const year = 2035;
  return (
    <div id="benefits-expiration-statement">
      <h2>Benefits Expiration Date</h2>

      {ACTIVEDUTYBENEFITSSTATEMENT}

      <p className="vads-u-font-weight--bold">{`${monthYear}, ${year}`}</p>
    </div>
  );
};

export default BenefitsExpirationDate;
