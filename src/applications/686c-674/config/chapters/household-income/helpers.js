import React from 'react';
import { NETWORTH_VALUE } from '../../constants';

export const whatAreAssets = (
  <>
    <va-accordion>
      <va-accordion-item
        id="What we count as assets"
        header="What we count as assets"
        bordered
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

export const netWorthTitle = `Did the household have a net worth greater than $${NETWORTH_VALUE} in the last tax year?`;
