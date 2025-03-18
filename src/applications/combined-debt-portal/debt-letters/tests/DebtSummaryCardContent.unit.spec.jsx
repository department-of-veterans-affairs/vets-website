import { render } from '@testing-library/react';
import { expect } from 'chai';
import { debtSummaryText } from '../const/diary-codes/debtSummaryCardContent';
import { endDate } from '../utils/helpers';

const renderDebtSummaryText = (diaryCode, dateOfLetter, balance) => {
  const { container } = render(
    debtSummaryText(diaryCode, dateOfLetter, balance),
  );
  return container;
};

describe('debtSummaryText', () => {
  const testDate = '01/01/2025';
  const testBalance = '100';

  const testCases = [
    {
      diaryCode: '71',
      expectedText: `Contact us to verify your military status.`,
    },
    {
      diaryCode: '655',
      expectedText: `Submit a Financial Status Report so that we can make a decision on your request.`,
    },
    { diaryCode: '212', expectedText: `Contact us to update your address.` },
    {
      diaryCode: '061',
      expectedText: `We’ve paused collection on this debt as you requested.`,
    },
    {
      diaryCode: '065',
      expectedText: `We’ve paused collection on this debt as you requested.`,
    },
    {
      diaryCode: '070',
      expectedText: `We’ve paused collection on this debt as you requested.`,
    },
    {
      diaryCode: '440',
      expectedText: `We’ve paused collection on this debt as you requested.`,
    },
    {
      diaryCode: '442',
      expectedText: `We’ve paused collection on this debt as you requested.`,
    },
    {
      diaryCode: '448',
      expectedText: `We’ve paused collection on this debt as you requested.`,
    },
    {
      diaryCode: '453',
      expectedText: `We’ve paused collection on this debt as you requested.`,
    },
    {
      diaryCode: '439',
      expectedText: `Pay your balance now or request help by ${endDate(
        testDate,
        '439',
      )}.`,
    },
    {
      diaryCode: '109',
      expectedText: `Pay your ${testBalance} balance now or request help by ${endDate(
        testDate,
        '109',
      )} to avoid more interest charges.`,
    },
    {
      diaryCode: '117',
      expectedText: `Pay your ${testBalance} past due balance in full or request help before ${endDate(
        testDate,
        '117',
      )}.`,
    },
    {
      diaryCode: '123',
      expectedText: `Pay your ${testBalance} past due balance now or request help by ${endDate(
        testDate,
        '123',
      )}.`,
    },
    {
      diaryCode: '680',
      expectedText: `Pay your ${testBalance} balance now or request help.`,
    },
    {
      diaryCode: '681',
      expectedText: `The U.S. Department of the Treasury is reducing your federal payments until your debt is paid.`,
    },
    {
      diaryCode: '600',
      expectedText: `Continue making monthly payments until your balance is paid.`,
    },
    {
      diaryCode: '430',
      expectedText: `We’re reducing your education benefits each month until your debt is paid.`,
    },
    {
      diaryCode: '481',
      expectedText: `We’re reviewing your account.`,
    },
    {
      diaryCode: '482',
      expectedText: `We’re reviewing your account.`,
    },
    {
      diaryCode: '483',
      expectedText: `We’re reviewing your account.`,
    },
    {
      diaryCode: '484',
      expectedText: `We’re reviewing your account.`,
    },
    {
      diaryCode: '603',
      expectedText: `Make a payment on your ${testBalance} balance or request help by ${endDate(
        testDate,
        '603',
      )}.`,
    },
    {
      diaryCode: '101',
      expectedText: `We’re reducing your benefit payments each month until your debt is paid.`,
    },
    {
      diaryCode: '450',
      expectedText: `We’re reducing your benefit payments each month until your debt is paid.`,
    },
    {
      diaryCode: '602',
      expectedText: `We’re reducing your benefit payments each month until your debt is paid.`,
    },
    {
      diaryCode: '607',
      expectedText: `We’re reducing your benefit payments each month until your debt is paid.`,
    },
    {
      diaryCode: '608',
      expectedText: `We’re reducing your benefit payments each month until your debt is paid.`,
    },
    {
      diaryCode: '610',
      expectedText: `We’re reducing your benefit payments each month until your debt is paid.`,
    },
    {
      diaryCode: '611',
      expectedText: `We’re reducing your benefit payments each month until your debt is paid.`,
    },
    {
      diaryCode: '614',
      expectedText: `We’re reducing your benefit payments each month until your debt is paid.`,
    },
    {
      diaryCode: '615',
      expectedText: `We’re reducing your benefit payments each month until your debt is paid.`,
    },
    {
      diaryCode: '617',
      expectedText: `We’re reducing your benefit payments each month until your debt is paid.`,
    },
    {
      diaryCode: '080',
      expectedText: `Contact the U.S. Department of the Treasury’s Debt Management Services at`,
    },
    {
      diaryCode: '500',
      expectedText: `We’re referring this debt to the U.S. Department of the Treasury today.`,
    },
    {
      diaryCode: '821',
      expectedText: `Continue making monthly payments while we review your Notice of Disagreement.`,
    },
    {
      diaryCode: '822',
      expectedText: `Continue making monthly payments while we review your dispute.`,
    },
    {
      diaryCode: '825',
      expectedText: `Continue making monthly payments while we review your request for a hearing.`,
    },
    {
      diaryCode: '811',
      expectedText: `Continue making monthly payments while we review your compromise offer.`,
    },
    {
      diaryCode: '815',
      expectedText: `Pay your one time payment as part of your compromise agreement by ${endDate(
        testDate,
        '815',
      )}.`,
    },
    {
      diaryCode: '816',
      expectedText: `We’re processing your compromise offer payment.`,
    },
    {
      diaryCode: '801',
      expectedText: `Continue making monthly payments while we review your waiver request.`,
    },
    { diaryCode: '002', expectedText: `We’re updating your account.` },
    { diaryCode: '005', expectedText: `We’re updating your account.` },
    { diaryCode: '032', expectedText: `We’re updating your account.` },
    { diaryCode: '609', expectedText: `We’re updating your account.` },
    { diaryCode: '321', expectedText: `We’re updating your account.` },
    { diaryCode: '400', expectedText: `We’re updating your account.` },
    { diaryCode: '420', expectedText: `We’re updating your account.` },
    { diaryCode: '421', expectedText: `We’re updating your account.` },
    { diaryCode: '422', expectedText: `We’re updating your account.` },
    { diaryCode: '627', expectedText: `We’re updating your account.` },
    { diaryCode: '425', expectedText: `We’re updating your account.` },
    { diaryCode: 'unknown', expectedText: `We’re updating your account.` },
  ];

  testCases.forEach(({ diaryCode, expectedText }) => {
    it(`should render the correct message for diary code ${diaryCode}`, () => {
      const container = renderDebtSummaryText(diaryCode, testDate, testBalance);
      expect(container.textContent).to.contain(expectedText);
    });
  });
});
