import maxTestData from './fixtures/data/maximal-test.json';
import mockPrefill from './fixtures/mocks/prefill.saveInProgress.household.json';
import mockUser from './fixtures/mocks/user.inProgressForm.json';
import {
  advanceFromHouseholdToSubmit,
  fillDeductibleExpenses,
  fillVeteranIncome,
  goToNextPage,
  setupForAuth,
  startSaveInProgressUser,
} from './utils';

const { data: testData } = maxTestData;

describe('HCA-Household: Non-disclosure', () => {
  beforeEach(() => {
    setupForAuth({ user: mockUser, prefill: mockPrefill });
    startSaveInProgressUser();
  });

  it('works without sharing household information', () => {
    goToNextPage('/household-information/share-financial-information');
    cy.selectRadio('root_discloseFinancialInformation', 'N');

    goToNextPage('/household-information/share-financial-information-confirm');
    goToNextPage('/household-information/marital-status');
    cy.get('[name="root_maritalStatus"]').select(testData.maritalStatus);

    advanceFromHouseholdToSubmit(testData, { disclosureAssertionValue: false });
    cy.injectAxeThenAxeCheck();
  });

  it('works without spouse or dependent information', () => {
    goToNextPage('/household-information/share-financial-information');
    cy.selectRadio('root_discloseFinancialInformation', 'Y');

    goToNextPage('/household-information/financial-information-needed');
    goToNextPage('/household-information/marital-status');
    cy.get('[name="root_maritalStatus"]').select('Never Married');

    goToNextPage('/household-information/dependents');
    cy.selectRadio('root_view:reportDependents', 'N');

    goToNextPage('/household-information/veteran-annual-income');
    fillVeteranIncome(testData);

    goToNextPage('/household-information/deductible-expenses');
    fillDeductibleExpenses(testData);

    advanceFromHouseholdToSubmit(testData);
    cy.injectAxeThenAxeCheck();
  });
});
