import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { getDebtDetailsCardContent } from '../const/diary-codes/debtDetailsCardContent';
import { endDate } from '../utils/helpers';

const renderDebtDetailsCardContent = (debt, dateOfLetter, amountDue) => {
  const content = getDebtDetailsCardContent(debt, dateOfLetter, amountDue);
  const { container } = render(<div>{content.bodyText}</div>);
  return { container, content };
};

describe('getDebtDetailsCardContent', () => {
  const testDate = '01/01/2025';
  const testAmountDue = '100';
  const testCases = [
    {
      debt: { diaryCode: '109' },
      expectedHeaderText: `Pay your balance now or request help by ${endDate(
        testDate,
        '109',
      )} to avoid more interest charges`,
      expectedBodyText: `We’ve added interest to your balance. To avoid more interest charges or further collection action, you must pay your full balance or request financial help before ${endDate(
        testDate,
        '109',
      )}. If you don’t this debt may be referred to the U.S. Department of the Treasury.`,
    },
    {
      debt: { diaryCode: '117' },
      expectedHeaderText: `Pay your ${testAmountDue} balance in full or request help by ${endDate(
        testDate,
        '117',
      )}`,
      expectedBodyText: `To avoid further collection action on your bill, you must pay your full balance or request financial help before ${endDate(
        testDate,
        '117',
      )}. If you don’t, this debt may be referred to the U.S. Department of the Treasury.`,
    },
    {
      debt: { diaryCode: '123' },
      expectedHeaderText: `Pay your ${testAmountDue} balance now or request help by ${endDate(
        testDate,
        '123',
      )}`,
      expectedBodyText: `To avoid your debt being referred to the U.S. Department of the Treasury, you must pay your full balance or request financial help before ${endDate(
        testDate,
        '123',
      )}.`,
    },
    {
      debt: { diaryCode: '815' },
      expectedHeaderText: `Pay your one time payment as part of your compromise agreement by ${endDate(
        testDate,
        '815',
      )}`,
      expectedBodyText: `Your compromise offer must be paid with a single payment.`,
    },
    {
      debt: { diaryCode: '061' },
      expectedHeaderText:
        'We’ve paused collection on this debt as you requested',
      expectedBodyText: `We’ll let you know when we start collecting on this debt again. You don’t have to do anything until that time.`,
    },
    {
      debt: { diaryCode: '811' },
      expectedHeaderText:
        'Continue making monthly payments while we review your compromise offer',
      expectedBodyText: `We’ll send you a letter with our decision. Please continue to make payments monthly while we complete our review. Your next payment is due by ${endDate(
        testDate,
        '811',
      )}.`,
    },
    {
      debt: { diaryCode: '100' },
      expectedHeaderText: `Pay your ${testAmountDue} balance now or request help by ${endDate(
        testDate,
        '100',
      )}`,
      expectedBodyText: `To avoid collection actions on your bill, you must pay your full balance or request financial help before ${endDate(
        testDate,
        '100',
      )}. If you don’t, this debt may be referred to the U.S. Department of the Treasury.`,
    },
    {
      debt: { diaryCode: '449' },
      expectedHeaderText: `Pay your balance now or request help by ${endDate(
        testDate,
        '449',
      )}`,
      expectedBodyText: `To avoid late fees or further collection action on your bill, you must pay your full balance or request financial help before ${endDate(
        testDate,
        '449',
      )}.`,
    },
    {
      debt: { diaryCode: '439' },
      expectedHeaderText: `Pay your balance now or request help by ${endDate(
        testDate,
        '439',
      )}`,
      expectedBodyText: `To avoid late fees or further collection action on your bill, you must pay your full balance or request financial help before ${endDate(
        testDate,
        '439',
      )}. If you don’t, this debt may be referred to the U.S. Department of the Treasury.`,
    },
    {
      debt: { diaryCode: '600' },
      expectedHeaderText:
        'Continue making monthly payments until your balance is paid',
      expectedBodyText: `Your next payment is due by ${endDate(
        testDate,
        '600',
      )}.`,
    },
    {
      debt: { diaryCode: '603' },
      expectedHeaderText: `Make a payment on your ${testAmountDue} balance now or request help by ${endDate(
        testDate,
        '603',
      )}`,
      expectedBodyText: `To avoid late fees or collection action on your bill, you must make a payment on your balance or request financial help before ${endDate(
        testDate,
        '603',
      )}.`,
    },
    {
      debt: { diaryCode: '655' },
      expectedHeaderText:
        'Submit a Financial Status Report so that we can make a decision on your request',
      expectedBodyText: `You can request a waiver, compromise, or extended monthly payment plan by filling out the Financial Status Report (VA FORM 5655) online or by mail.`,
    },
    {
      debt: { diaryCode: '680' },
      expectedHeaderText: `Pay your ${testAmountDue} balance now or request help`,
      expectedBodyText: `To avoid collection actions on your bill, you must pay your full balance or request financial help.`,
    },
    {
      debt: { diaryCode: '801' },
      expectedHeaderText:
        'Continue making monthly payments while we review your waiver request',
      expectedBodyText: `We’ll send you a letter with our decision. Please continue to make payments monthly while we complete our review. Your next payment is due by ${endDate(
        testDate,
        '801',
      )}.`,
    },
    {
      debt: { diaryCode: '822' },
      expectedHeaderText:
        'Continue making monthly payments while we review your dispute',
      expectedBodyText: `We’ll send you a letter with our decision. Please continue to make payments monthly while we complete our review. Your next payment is due by ${endDate(
        testDate,
        '822',
      )}.`,
    },
    {
      debt: { diaryCode: '825' },
      expectedHeaderText:
        'Continue making monthly payments while we review your request for a hearing',
      expectedBodyText: `We’ll send you a letter with our decision. Please continue to make payments monthly while we complete our review. Your next payment is due by ${endDate(
        testDate,
        '825',
      )}.`,
    },
    {
      debt: { diaryCode: '821' },
      expectedHeaderText:
        'Continue making monthly payments while we review your Notice of Disagreement',
      expectedBodyText: `We’ll send you a letter with our decision. Please continue to make payments monthly while we complete our review. Your next payment is due by ${endDate(
        testDate,
        '821',
      )}.`,
    },
  ];

  testCases.forEach(({ debt, expectedHeaderText, expectedBodyText }) => {
    it(`should render the correct message for diary code ${
      debt.diaryCode
    }`, () => {
      const { container, content } = renderDebtDetailsCardContent(
        debt,
        testDate,
        testAmountDue,
      );
      expect(content.headerText).to.equal(expectedHeaderText);
      expect(container.textContent.replace(/\s+/g, ' ')).to.contain(
        expectedBodyText.replace(/\s+/g, ' '),
      );
    });
  });
});
