import React from 'react';
import { NETWORTH_VALUE } from '../../constants';

export const whatAreAssets = (
  <>
    <va-accordion open-single>
      <va-accordion-item
        id="what-we-count-as-assets"
        header="What we count as assets"
        bordered
        level={4}
      >
        <p>
          Assets include the fair market value of all your real and personal
          property, minus the amount of any mortgages you may have. “Real
          property” means any land and buildings you may own. Your personal
          property assets include any of these items:
        </p>
        <ul>
          <li>Investments (like stocks and bonds)</li>
          <li>Furniture</li>
          <li>Boats</li>
        </ul>
        <p>Don’t include the value of these items:</p>
        <ul>
          <li>
            Your primary residence (the home where you live most or all of the
            time)
          </li>
          <li>Your car</li>
          <li>
            Basic home items like appliances that you wouldn’t take with you if
            you moved to a new house
          </li>
        </ul>
      </va-accordion-item>
    </va-accordion>
  </>
);

export const netWorthTitle = ({ netWorthLimit, featureFlag } = {}) => {
  if (!featureFlag) {
    return `Did your household have a net worth less than $${NETWORTH_VALUE} in the last tax year?`;
  }

  const number = netWorthLimit || NETWORTH_VALUE;
  const formattedNumber = parseInt(
    `${number}`.replace(/,/g, ''),
    10,
  ).toLocaleString('en-US');
  return `Did your household have a net worth less than $${formattedNumber} in the last tax year?`;
};
