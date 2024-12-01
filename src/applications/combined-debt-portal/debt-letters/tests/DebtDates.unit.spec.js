import { expect } from 'chai';
import { addDays, format, parse } from 'date-fns';
import { getDebtDetailsCardContent } from '../const/diary-codes/debtDetailsCardContent';
import mocks from './e2e/fixtures/mocks/debts.json';

describe('DebtSummaryText function', () => {
  it('renders correct "pay by" date for diary code 100', () => {
    const diaryCode = '100';
    const balance = '100.00';
    const debtEntry = mocks.debts.find(debt => debt.diaryCode === diaryCode);
    const dateOfLetter = debtEntry.debtHistory[0].date;
    const result = getDebtDetailsCardContent(debtEntry, dateOfLetter, balance);
    expect(result.headerText).to.include(
      'Pay your 100.00 balance now or request help by October 18, 2012',
    );
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

    const result = getDebtDetailsCardContent(debtEntry, dateOfLetter, balance);
    expect(result.headerText).to.include(
      `Pay your ${balance} balance in full or request help by ${expectedDate}`,
    );
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

    const result = getDebtDetailsCardContent(debtEntry, dateOfLetter, balance);
    expect(result.headerText).to.include(
      `Pay your ${balance} balance now or request help by ${expectedDate}`,
    );
  });
  it('renders the alternative message when dateOfLetter is missing for diaryCode 117', () => {
    const diaryCode = '117';
    const balance = '100.00';
    const debtEntry = mocks.debts.find(debt => debt.diaryCode === diaryCode);
    const dateOfLetter = debtEntry.debtHistory[0].date;
    const expectedDate = format(
      addDays(parse(dateOfLetter, 'MM/dd/yyyy', new Date()), 60),
      'MMMM d, yyyy',
    );
    const result = getDebtDetailsCardContent(debtEntry, dateOfLetter, balance);
    expect(result.headerText).to.include(
      `Pay your 100.00 balance in full or request help by ${expectedDate}`,
    );
  });

  it('renders the alternative message when dateOfLetter is missing for diaryCode 100', () => {
    const diaryCode = '100';
    const balance = '100.00';
    const debtEntry = mocks.debts.find(debt => debt.diaryCode === diaryCode);
    const dateOfLetter = debtEntry.debtHistory[0].date;
    const expectedDate = format(
      addDays(parse(dateOfLetter, 'MM/dd/yyyy', new Date()), 30),
      'MMMM d, yyyy',
    );
    const result = getDebtDetailsCardContent(debtEntry, dateOfLetter, balance);
    expect(result.headerText).to.include(
      `Pay your 100.00 balance now or request help by ${expectedDate}`,
    );
  });
});

describe('getDebtDetailsCardContent function', () => {
  it('renders correct "pay by" date for diary code 100', () => {
    const diaryCode = '100';
    const balance = '100.00';
    const debtEntry = mocks.debts.find(debt => debt.diaryCode === diaryCode);
    const dateOfLetter = debtEntry?.debtHistory?.[0]?.date;
    const result = getDebtDetailsCardContent(debtEntry, dateOfLetter, balance);
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
    expect(result.headerText).to.include(
      `Pay your ${balance} balance now or request help by ${expectedDate}`,
    );
  });

  it('renders the alternative message when dateOfLetter is missing', () => {
    const diaryCode = '100';
    const balance = '100.00';
    const result = getDebtDetailsCardContent(diaryCode, null, balance);
    expect(result.headerText).to.include('We’re reviewing your account');
  });
});
