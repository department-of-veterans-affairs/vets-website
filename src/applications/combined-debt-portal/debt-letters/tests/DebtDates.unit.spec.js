import { expect } from 'chai';
import { shallow } from 'enzyme';

import React from 'react';
import { addDays, format, parse } from 'date-fns';
import { debtSummaryText } from '../const/diary-codes/debtSummaryCardContent';
import { getDebtDetailsCardContent } from '../const/diary-codes/debtDetailsCardContent';
import mocks from './e2e/fixtures/mocks/debts.json';

// jest.mock('@department-of-veterans-affairs/component-library/contacts', () => ({
//   CONTACTS: {
//     DMC: '8008270648',
//     DMC_OVERSEAS: '6127136415',
//   },
// }));

// jest.mock('va-telephone', () => ({ contact, international }) => (
//   <span>
//     {contact} {international ? 'International' : 'Domestic'}
//   </span>
// ));

function extractVisibleText(wrapper) {
  const textArray = wrapper
    .find('p')
    .not('.sr-only')
    .map(node => node.text());
  return textArray
    .join(' ')
    .replace(/important/g, '')
    .trim();
}

describe('DebtSummaryText function', () => {
  let wrapper;

  it('renders correct "pay by" date for diary code 100', () => {
    const diaryCode = '100';
    const balance = '100.00';
    const debtEntry = mocks.debts.find(debt => debt.diaryCode === diaryCode);
    const dateOfLetter = debtEntry.debtHistory[0].date;
    wrapper = shallow(
      <div>{debtSummaryText(diaryCode, dateOfLetter, balance)}</div>,
    );
    expect(extractVisibleText(wrapper)).to.include(
      'Pay your 100.00 balance now or request help by October 18, 2012',
    );
    wrapper.unmount();
  });

  it('renders correct "pay by" date for diary code 117 with 60 days', () => {
    const diaryCode = '117';
    const balance = '200.00';
    const debtEntry = mocks.debts.find(debt => debt.diaryCode === diaryCode);
    const dateOfLetter = debtEntry.debtHistory[0].date;
    const expectedDate = format(
      addDays(parse(dateOfLetter, 'MM/dd/yyyy', new Date()), 60),
      'MMMM d, yyyy',
    );

    wrapper = shallow(
      <div>{debtSummaryText(diaryCode, dateOfLetter, balance)}</div>,
    );
    expect(extractVisibleText(wrapper)).to.include(
      `Pay your ${balance} past due balance in full or request help before ${expectedDate}`,
    );
    wrapper.unmount();
  });

  it('renders correct "pay by" date for diary code 123 with 60 days', () => {
    const diaryCode = '123';
    const balance = '200.00';
    const debtEntry = mocks.debts.find(debt => debt.diaryCode === diaryCode);
    const dateOfLetter = debtEntry.debtHistory[0].date;
    const expectedDate = format(
      addDays(parse(dateOfLetter, 'MM/dd/yyyy', new Date()), 60),
      'MMMM d, yyyy',
    );

    wrapper = shallow(
      <div>{debtSummaryText(diaryCode, dateOfLetter, balance)}</div>,
    );
    expect(extractVisibleText(wrapper)).to.include(
      `Pay your ${balance} past due balance now or request help by ${expectedDate}`,
    );
    wrapper.unmount();
  });

  it('renders the alternative message when dateOfLetter is missing', () => {
    const diaryCode = '100';
    const balance = '100.00';
    wrapper = shallow(<div>{debtSummaryText(diaryCode, null, balance)}</div>);
    expect(extractVisibleText(wrapper)).to.include(
      'Pay your 100.00 balance now or request help by a future date (date not available)',
    );
    wrapper.unmount();
  });
});

describe('getDebtDetailsCardContent function', () => {
  it('renders correct "pay by" date for diary code 100', () => {
    const diaryCode = '100';
    const balance = '100.00';
    const debtEntry = mocks.debts.find(debt => debt.diaryCode === diaryCode);
    const dateOfLetter = debtEntry?.debtHistory?.[0]?.date;
    const result = getDebtDetailsCardContent(debtEntry, dateOfLetter, balance);
    // console.log('Result:', JSON.stringify(result, null, 2));
    expect(result.headerText).to.include(
      'Pay your 100.00 balance now or request help by October 18, 2012',
    );
  });

  it('renders correct "pay by" date for diary code 117 with 60 days', () => {
    const diaryCode = '117';
    const balance = '200.00';
    const debtEntry = mocks.debts.find(debt => debt.diaryCode === diaryCode);
    const dateOfLetter = debtEntry?.debtHistory?.[0]?.date;
    const expectedDate = format(
      addDays(parse(dateOfLetter, 'MM/dd/yyyy', new Date()), 60),
      'MMMM d, yyyy',
    );
    const result = getDebtDetailsCardContent(debtEntry, dateOfLetter, balance);
    // console.log('Result:', JSON.stringify(result, null, 2));
    expect(result.headerText).to.include(
      `Pay your ${balance} balance in full or request help by ${expectedDate}`,
    );
  });

  it('renders correct "pay by" date for diary code 123 with 60 days', () => {
    const diaryCode = '123';
    const balance = '200.00';
    const debtEntry = mocks.debts.find(debt => debt.diaryCode === diaryCode);
    const dateOfLetter = debtEntry?.debtHistory?.[0]?.date;
    const expectedDate = format(
      addDays(parse(dateOfLetter, 'MM/dd/yyyy', new Date()), 60),
      'MMMM d, yyyy',
    );
    const result = getDebtDetailsCardContent(debtEntry, dateOfLetter, balance);
    // console.log('Result:', JSON.stringify(result, null, 2));
    expect(result.headerText).to.include(
      `Pay your ${balance} balance now or request help by ${expectedDate}`,
    );
  });

  it('renders the alternative message when dateOfLetter is missing', () => {
    const diaryCode = '100';
    const balance = '100.00';
    const result = getDebtDetailsCardContent(diaryCode, null, balance);
    // console.log('Result:', JSON.stringify(result, null, 2));
    expect(result.headerText).to.include("We're reviewing your account");
  });
});
