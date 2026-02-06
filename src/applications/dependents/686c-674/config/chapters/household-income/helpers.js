import React from 'react';
import { NETWORTH_VALUE } from '../../constants';

export const whatAreAssets = (
  <>
    <h3>What we count as assets</h3>

    <p>
      Assets include the fair market value of all your real and personal
      property, minus any mortgages you owe. "Real property" means any land and
      buildings you may own. Your personal property assets include any of these
      items:
    </p>

    <ul>
      <li>Investments (like stocks and bonds)</li>
      <li>Antique furniture</li>
      <li>Boats</li>
    </ul>

    <p>What we don’t count as assets:</p>

    <ul>
      <li>
        Your primary residence (the home where you live most or all of the time)
      </li>
      <li>Your car</li>
      <li>
        Basic home items (like appliances that you wouldn’t take with you if you
        moved to a new house)
      </li>
    </ul>
  </>
);

/**
 * Returns the net worth description text based on feature flag
 * @param {boolean} featureFlag - vaDependentsNetWorthAndPension feature flag
 * @returns {string} Net worth description text
 */
export const netWorthDescription = (featureFlag = false) => {
  if (featureFlag) {
    return 'Because you currently receive VA pension benefits, we need to know your net worth. Your net worth includes your assets, your annual income, and the assets and income of your dependents (including your spouse if you are married).';
  }
  return "If you currently receive VA pension benefits, we need to know your net worth. Your net worth includes your assets and your annual income. If you're married, include the value of your spouse's assets and annual income too.";
};

/**
 * @typedef {object} StudentNetworthTitleProps
 * @property {number|string} netWorthLimit - Net worth limit value
 * @property {boolean} featureFlag - Feature flag for formatted net worth
 *
 * @param {StudentNetworthTitleProps} props - Net worth title props
 * @returns {string} Net worth title
 */
export const netWorthTitle = ({ netWorthLimit, featureFlag } = {}) => {
  const number = netWorthLimit || NETWORTH_VALUE;
  const formattedNumber = parseInt(
    `${number}`.replace(/,/g, ''),
    10,
  ).toLocaleString('en-US');

  if (!featureFlag) {
    // If va_dependents_net_worth_and_pension FF is off, show "greater than" wording
    return `Did your household have a net worth greater than $${NETWORTH_VALUE} in the last tax year?`;
  }

  // If va_dependents_net_worth_and_pension FF is on, show "less than" wording (value gets flipped for RBPS submission)
  return `Did your household have a net worth less than $${formattedNumber} in the last tax year?`;
};
