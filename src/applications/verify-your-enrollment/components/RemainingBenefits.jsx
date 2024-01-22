import React from 'react';
import { getCurrentDateFormatted } from '../helpers';

const RemainingBenefits = () => {
  const months = 33;
  const days = 0;
  return (
    <div id="remaining-benefits-statement">
      <h2>Remaining Benefits</h2>

      <p>
        {`This is the amount of remaining benefits you have left as of ${getCurrentDateFormatted()}.`}
      </p>
      <p className="vads-u-font-weight--bold">
        {`${months} Months, ${days} Days`}
      </p>
    </div>
  );
};

export default RemainingBenefits;
