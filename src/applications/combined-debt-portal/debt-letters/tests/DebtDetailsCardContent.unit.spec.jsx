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
      debt: { diaryCode: '71' },
      expectedHeaderText: `Contact us to verify your military status`,
      expectedBodyText: `Please contact us online through Ask VA or call us at (or from overseas)
            to verify your military status. We’re here Monday through Friday,
            7:30 a.m. to 7:00 p.m. ET.`,
    },
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
      debt: { diaryCode: '212' },
      expectedHeaderText: `Contact us to update your address`,
      expectedBodyText: `Please contact us online through Ask VA or call us at (or from overseas)
             to update your address. We’re here Monday through Friday,
            7:30 a.m. to 7:00 p.m. ET.`,
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
      debt: { diaryCode: '816' },
      expectedHeaderText: 'We’re processing your compromise payment',
      expectedBodyText: `Please check your debt balance again soon. If it isn’t adjusted to
            reflect your payment within 30 days, call us at (or from overseas),
            Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.`,
    },
    {
      debt: { diaryCode: '002' },
      expectedHeaderText: 'We’re updating your account',
      expectedBodyText: `Please check back in 1 week for updates. If your account shows the
            same information then call us at (or from overseas),
            Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.`,
    },
    {
      debt: { diaryCode: '005' },
      expectedHeaderText: 'We’re updating your account',
      expectedBodyText: `Please check back in 1 week for updates. If your account shows the
            same information then call us at (or from overseas),
            Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.`,
    },
    {
      debt: { diaryCode: '032' },
      expectedHeaderText: 'We’re updating your account',
      expectedBodyText: `Please check back in 1 week for updates. If your account shows the
            same information then call us at (or from overseas),
            Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.`,
    },
    {
      debt: { diaryCode: '609' },
      expectedHeaderText: 'We’re updating your account',
      expectedBodyText: `Please check back in 1 week for updates. If your account shows the
            same information then call us at (or from overseas),
            Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.`,
    },
    {
      debt: { diaryCode: '321' },
      expectedHeaderText: 'We’re updating your account',
      expectedBodyText: `Please check back in 30 days for updates. If your account shows the
            same information then call us at (or from overseas),
            Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.`,
    },
    {
      debt: { diaryCode: '400' },
      expectedHeaderText: 'We’re updating your account',
      expectedBodyText: `Please check back in 30 days for updates. If your account shows the
            same information then call us at (or from overseas),
            Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.`,
    },
    {
      debt: { diaryCode: '420' },
      expectedHeaderText: 'We’re updating your account',
      expectedBodyText: `Please check back in 30 days for updates. If your account shows the
            same information then call us at (or from overseas),
            Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.`,
    },
    {
      debt: { diaryCode: '421' },
      expectedHeaderText: 'We’re updating your account',
      expectedBodyText: `Please check back in 30 days for updates. If your account shows the
            same information then call us at (or from overseas),
            Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.`,
    },
    {
      debt: { diaryCode: '422' },
      expectedHeaderText: 'We’re updating your account',
      expectedBodyText: `Please check back in 30 days for updates. If your account shows the
            same information then call us at (or from overseas),
            Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.`,
    },
    {
      debt: { diaryCode: '425' },
      expectedHeaderText: 'We’re updating your account',
      expectedBodyText: `Please check back in 30 days for updates. If your account shows the
            same information then call us at (or from overseas),
            Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.`,
    },
    {
      debt: { diaryCode: '627' },
      expectedHeaderText: 'We’re updating your account',
      expectedBodyText: `Please check back in 30 days for updates. If your account shows the
            same information then call us at (or from overseas),
            Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.`,
    },
    {
      debt: { diaryCode: '080' },
      expectedHeaderText: `Contact the U.S. Department of the Treasury to pay this ${testAmountDue} debt`,
      expectedBodyText: `Call the U.S. Department of the Treasury’s Debt Management Services
            at , 8:30 a.m. to 6:30 p.m. ET. Don’t send us a payment directly. This
            will delay posting the payment to your account and the Treasury
            Department may continue adding fees and interest.`,
    },
    {
      debt: { diaryCode: '850' },
      expectedHeaderText: `Contact the U.S. Department of the Treasury to pay this ${testAmountDue} debt`,
      expectedBodyText: `Call the U.S. Department of the Treasury’s Debt Management Services
            at , 8:30 a.m. to 6:30 p.m. ET. Don’t send us a payment directly. This
            will delay posting the payment to your account and the Treasury
            Department may continue adding fees and interest.`,
    },
    {
      debt: { diaryCode: '852' },
      expectedHeaderText: `Contact the U.S. Department of the Treasury to pay this ${testAmountDue} debt`,
      expectedBodyText: `Call the U.S. Department of the Treasury’s Debt Management Services
            at , 8:30 a.m. to 6:30 p.m. ET. Don’t send us a payment directly. This
            will delay posting the payment to your account and the Treasury
            Department may continue adding fees and interest.`,
    },
    {
      debt: { diaryCode: '860' },
      expectedHeaderText: `Contact the U.S. Department of the Treasury to pay this ${testAmountDue} debt`,
      expectedBodyText: `Call the U.S. Department of the Treasury’s Debt Management Services
            at , 8:30 a.m. to 6:30 p.m. ET. Don’t send us a payment directly. This
            will delay posting the payment to your account and the Treasury
            Department may continue adding fees and interest.`,
    },
    {
      debt: { diaryCode: '855' },
      expectedHeaderText: `Contact the U.S. Department of the Treasury to pay this ${testAmountDue} debt`,
      expectedBodyText: `Call the U.S. Department of the Treasury’s Debt Management Services
            at , 8:30 a.m. to 6:30 p.m. ET. Don’t send us a payment directly. This
            will delay posting the payment to your account and the Treasury
            Department may continue adding fees and interest.`,
    },
    {
      debt: { diaryCode: '081' },
      expectedHeaderText: `We’re referring this debt to the U.S. Department of the Treasury today`,
      expectedBodyText: `Please pay the full amount online or by phone at (or from overseas) to prevent referral. 
      We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET. 
      If we don’t receive your payment today, we’re required by law to refer your debt to the U.S. Department of the Treasury.`,
    },
    {
      debt: { diaryCode: '500' },
      expectedHeaderText: `We’re referring this debt to the U.S. Department of the Treasury today`,
      expectedBodyText: `Please pay the full amount online or by phone at (or from overseas) to prevent referral. 
      We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET. 
      If we don’t receive your payment today, we’re required by law to refer your debt to the U.S. Department of the Treasury.`,
    },
    {
      debt: { diaryCode: '510' },
      expectedHeaderText: `We’re referring this debt to the U.S. Department of the Treasury today`,
      expectedBodyText: `Please pay the full amount online or by phone at (or from overseas) to prevent referral. 
      We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET. 
      If we don’t receive your payment today, we’re required by law to refer your debt to the U.S. Department of the Treasury.`,
    },
    {
      debt: { diaryCode: '503' },
      expectedHeaderText: `We’re referring this debt to the U.S. Department of the Treasury today`,
      expectedBodyText: `Please pay the full amount online or by phone at (or from overseas) to prevent referral. 
      We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET. 
      If we don’t receive your payment today, we’re required by law to refer your debt to the U.S. Department of the Treasury.`,
    },
    {
      debt: { diaryCode: '430' },
      expectedHeaderText: `We’re reducing your education benefits each month until your debt is paid`,
      expectedBodyText: `If you’d like to pay in full now, call us first to ensure you don’t overpay. 
      If you stop receiving VA benefits, call us to set up a new payment plan. We can be reached at (or from overseas). 
      We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET. If reduced payments are causing you hardship, you can request help with your debt.`,
    },
    {
      debt: { diaryCode: '431' },
      expectedHeaderText: `We’re reducing your education benefits each month until your debt is paid`,
      expectedBodyText: `If you’d like to pay in full now, call us first to ensure you don’t overpay. 
      If you stop receiving VA benefits, call us to set up a new payment plan. We can be reached at (or from overseas). 
      We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET. If reduced payments are causing you hardship, you can request help with your debt.`,
    },
    {
      debt: { diaryCode: '450' },
      expectedHeaderText: `We’re reducing your benefit payments each month until your debt is paid`,
      expectedBodyText: `If you’d like to pay in full now, call us first to ensure you don’t overpay. 
      If you stop receiving VA benefits, call us to set up a new payment plan. We can be reached at (or from overseas). 
      We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET. If reduced payments are causing you hardship, you can request help with your debt.`,
    },
    {
      debt: { diaryCode: '101' },
      expectedHeaderText: `We’re reducing your benefit payments each month until your debt is paid`,
      expectedBodyText: `If you’d like to pay in full now, call us first to ensure you don’t overpay. 
      If you stop receiving VA benefits, call us to set up a new payment plan. We can be reached at (or from overseas). 
      We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET. If reduced payments are causing you hardship, you can request help with your debt.`,
    },
    {
      debt: { diaryCode: '602' },
      expectedHeaderText: `We’re reducing your benefit payments each month until your debt is paid`,
      expectedBodyText: `If you’d like to pay in full now, call us first to ensure you don’t overpay. 
      If you stop receiving VA benefits, call us to set up a new payment plan. We can be reached at (or from overseas). 
      We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET. If reduced payments are causing you hardship, you can request help with your debt.`,
    },
    {
      debt: { diaryCode: '607' },
      expectedHeaderText: `We’re reducing your benefit payments each month until your debt is paid`,
      expectedBodyText: `If you’d like to pay in full now, call us first to ensure you don’t overpay. 
      If you stop receiving VA benefits, call us to set up a new payment plan. We can be reached at (or from overseas). 
      We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET. If reduced payments are causing you hardship, you can request help with your debt.`,
    },
    {
      debt: { diaryCode: '608' },
      expectedHeaderText: `We’re reducing your benefit payments each month until your debt is paid`,
      expectedBodyText: `If you’d like to pay in full now, call us first to ensure you don’t overpay. 
      If you stop receiving VA benefits, call us to set up a new payment plan. We can be reached at (or from overseas). 
      We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET. If reduced payments are causing you hardship, you can request help with your debt.`,
    },
    {
      debt: { diaryCode: '610' },
      expectedHeaderText: `We’re reducing your benefit payments each month until your debt is paid`,
      expectedBodyText: `If you’d like to pay in full now, call us first to ensure you don’t overpay. 
      If you stop receiving VA benefits, call us to set up a new payment plan. We can be reached at (or from overseas). 
      We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET. If reduced payments are causing you hardship, you can request help with your debt.`,
    },
    {
      debt: { diaryCode: '611' },
      expectedHeaderText: `We’re reducing your benefit payments each month until your debt is paid`,
      expectedBodyText: `If you’d like to pay in full now, call us first to ensure you don’t overpay. 
      If you stop receiving VA benefits, call us to set up a new payment plan. We can be reached at (or from overseas). 
      We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET. If reduced payments are causing you hardship, you can request help with your debt.`,
    },
    {
      debt: { diaryCode: '614' },
      expectedHeaderText: `We’re reducing your benefit payments each month until your debt is paid`,
      expectedBodyText: `If you’d like to pay in full now, call us first to ensure you don’t overpay. 
      If you stop receiving VA benefits, call us to set up a new payment plan. We can be reached at (or from overseas). 
      We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET. If reduced payments are causing you hardship, you can request help with your debt.`,
    },
    {
      debt: { diaryCode: '615' },
      expectedHeaderText: `We’re reducing your benefit payments each month until your debt is paid`,
      expectedBodyText: `If you’d like to pay in full now, call us first to ensure you don’t overpay. 
      If you stop receiving VA benefits, call us to set up a new payment plan. We can be reached at (or from overseas). 
      We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET. If reduced payments are causing you hardship, you can request help with your debt.`,
    },
    {
      debt: { diaryCode: '617' },
      expectedHeaderText: `We’re reducing your benefit payments each month until your debt is paid`,
      expectedBodyText: `If you’d like to pay in full now, call us first to ensure you don’t overpay. 
      If you stop receiving VA benefits, call us to set up a new payment plan. We can be reached at (or from overseas). 
      We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET. If reduced payments are causing you hardship, you can request help with your debt.`,
    },
    {
      debt: { diaryCode: '681' },
      expectedHeaderText: `The U.S. Department of the Treasury is reducing your federal payments until your debt is paid`,
      expectedBodyText: `If you’d like to pay in full now, call the U.S. Department of the Treasury’s Debt. 
      Management Services at , 8:30 a.m. to 6:30 p.m. ET. Don’t send us a payment directly. 
      This will delay posting the payment to your account and the Treasury Department may continue adding fees and interest.`,
    },
    {
      debt: { diaryCode: '682' },
      expectedHeaderText: `The U.S. Department of the Treasury is reducing your federal payments until your debt is paid`,
      expectedBodyText: `If you’d like to pay in full now, call the U.S. Department of the Treasury’s Debt. 
      Management Services at , 8:30 a.m. to 6:30 p.m. ET. Don’t send us a payment directly. 
      This will delay posting the payment to your account and the Treasury Department may continue adding fees and interest.`,
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
    {
      debt: { diaryCode: 'unknown' },
      expectedHeaderText: 'We’re reviewing your account',
      expectedBodyText: `You don’t need to do anything at this time.`,
    },
  ];

  testCases.forEach(({ debt, expectedHeaderText, expectedBodyText }) => {
    it(`should render the correct message for diary code ${debt.diaryCode}`, () => {
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
