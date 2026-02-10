import maxTestData from './fixtures/data/maximal-test.json';
import mockPrefill from './fixtures/mocks/prefill.inProgress.household.json';
import mockUser from './fixtures/mocks/user.inProgressForm.json';
import {
  advanceFromHouseholdToSubmit,
  fillDeductibleExpenses,
  fillVeteranIncome,
  goToNextPage,
  setupForAuth,
  startAsInProgressUser,
} from './utils';

const { data: testData } = maxTestData;

describe('HCA-Household: Non-disclosure', () => {
  beforeEach(() => {
    setupForAuth({ user: mockUser, prefill: mockPrefill });
    startAsInProgressUser();
  });

  it('works without sharing household information', () => {
    goToNextPage();
    cy.selectYesNoVaRadioOption('root_discloseFinancialInformation', false);

    goToNextPage();
    goToNextPage();
    cy.get('[name="root_maritalStatus"]').select(testData.maritalStatus);

    advanceFromHouseholdToSubmit(testData, { disclosureAssertionValue: false });
    cy.injectAxeThenAxeCheck();
  });

  it('works without spouse or dependent information', () => {
    goToNextPage();
    cy.selectYesNoVaRadioOption('root_discloseFinancialInformation', true);

    goToNextPage();
    goToNextPage();
    cy.get('[name="root_maritalStatus"]').select('Never Married');

    goToNextPage();
    goToNextPage();
    cy.selectYesNoVaRadioOption('root_view:reportDependents', false);

    goToNextPage();
    fillVeteranIncome(testData);

    goToNextPage();
    fillDeductibleExpenses(testData);

    advanceFromHouseholdToSubmit(testData);
    cy.injectAxeThenAxeCheck();
  });
});
