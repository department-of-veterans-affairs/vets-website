import React from 'react';

export const UnassociatedIncomeSummaryDescription = () => {
  return (
    <>
      <p>
        Recurring income is income you receive on a regular basis, rather than a
        one-time payment. Here are some example recurring income sources:
      </p>
      <ul>
        <li>Wages from a job</li>
        <li>Social Security</li>
        <li>
          Pensions, including those from Philippine Veterans Affairs Office
        </li>
        <li>Retirement (military, civil service, railroad, private)</li>
        <li>Other benefits (Black Lung, unemployment)</li>
      </ul>
      <p>
        This doesn’t include interest or dividends from financial accounts or
        income from property you own.
      </p>
      <p>
        <strong>Note:</strong> If you’re submitting this form with your initial
        application, don’t list any income you reported on VA Form 21P-527EZ or
        21P-534EZ.
      </p>
    </>
  );
};

export const AssociatedIncomeSummaryDescription = () => {
  return (
    <>
      <p>Here are some examples of income from financial accounts:</p>
      <ul>
        <li>Savings bonds</li>
        <li>Stocks and dividends</li>
        <li>Interest-earning accounts, like checkings and savings</li>
        <li>
          Distributions from Individual Retirement Accounts (IRAs), including
          required minimum distributions (RMDs)
        </li>
        <li>Pension plans with cash value</li>
      </ul>
    </>
  );
};

export const RoyaltiesSummaryDescription = () => {
  return (
    <>
      <p>
        Here are some examples of income from royalties or other owned assets:
      </p>
      <ul>
        <li>
          Royalties from intellectual property (like acting, writing, or
          inventions)
        </li>
        <li>Income from extraction of minerals or lumber</li>
        <li>Payments for land use</li>
      </ul>
      <p>
        <strong>Note:</strong> You can include any documents about the asset’s
        value, explain if it can be sold, and report the income it generates.
      </p>
    </>
  );
};

export const AssetTransfersSummaryDescription = () => {
  return (
    <>
      <p>Asset transfers could include these types of transactions:</p>
      <ul>
        <li>Sale: For monetary benefit</li>
        <li>Trade: For an alternative property</li>
        <li>Giveaway: For no benefit</li>
        <li>Conveyed: Through a legal process</li>
      </ul>
    </>
  );
};

export const UnreportedAssetsSummaryDescription = () => {
  return (
    <>
      <p>
        Here are some examples of other assets you may not have reported yet:
      </p>
      <ul>
        <li>Accounts that don’t accrue interest</li>
        <li>Collectible valuables</li>
        <li>Real estate that doesn’t generate an income</li>
        <li>Cash</li>
      </ul>
      <p>
        <strong>Note:</strong> If you reported receiving money from an asset
        transfer and spent part of it, only include the amount you haven’t
        spent.
      </p>
    </>
  );
};
