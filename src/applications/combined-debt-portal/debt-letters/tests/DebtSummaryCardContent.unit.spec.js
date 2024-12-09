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
      diaryCode: '603',
      expectedText: `Make a payment on your ${testBalance} balance or request help by ${endDate(
        testDate,
        '603',
      )}.`,
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
      diaryCode: '801',
      expectedText: `Continue making monthly payments while we review your waiver request.`,
    },
    { diaryCode: 'unknown', expectedText: `We’re updating your account.` },
  ];

  testCases.forEach(({ diaryCode, expectedText }) => {
    it(`should render the correct message for diary code ${diaryCode}`, () => {
      const container = renderDebtSummaryText(diaryCode, testDate, testBalance);
      expect(container.textContent).to.contain(expectedText);
    });
  });
});
