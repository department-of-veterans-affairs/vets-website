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
    goToNextPage('/household-information/share-financial-information');

    goToNextPage();
    goToNextPage();
    goToNextPage('/household-information/share-financial-information-confirm');
    goToNextPage('/household-information/marital-status');
    cy.get('[name="root_maritalStatus"]').select(testData.maritalStatus);

    advanceFromHouseholdToSubmit(testData, { disclosureAssertionValue: false });
    cy.injectAxeThenAxeCheck();
  });

  it('works without spouse or dependent information', () => {
    goToNextPage();
    goToNextPage('/household-information/share-financial-information');

    goToNextPage('/household-information/financial-information-needed');
    goToNextPage('/household-information/marital-status');
    cy.get('[name="root_maritalStatus"]').select('Never Married');

    goToNextPage('/household-information/your-dependents');
    goToNextPage('/household-information/dependents');
    cy.selectYesNoVaRadioOption('root_view:reportDependents', false);

    goToNextPage('/household-information/veteran-annual-income');
    fillVeteranIncome(testData);

    goToNextPage('/household-information/deductible-expenses');
    fillDeductibleExpenses(testData);

    advanceFromHouseholdToSubmit(testData);
    cy.injectAxeThenAxeCheck();
  });
});
