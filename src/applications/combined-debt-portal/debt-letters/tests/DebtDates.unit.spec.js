import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';
import { addDays, format, parse } from 'date-fns';
import { debtSummaryText } from '../const/diary-codes/debtSummaryCardContent';
import mocks from './e2e/fixtures/mocks/debts.json';

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
    wrapper = mount(
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

    wrapper = mount(
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

    wrapper = mount(
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
    wrapper = mount(<div>{debtSummaryText(diaryCode, null, balance)}</div>);
    expect(extractVisibleText(wrapper)).to.include(
      'Pay your 100.00 balance now or request help by a future date (date not available)',
    );
    wrapper.unmount();
  });
});
