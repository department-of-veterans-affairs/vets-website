import maxTestData from './fixtures/data/maximal-test.json';
import mockPrefill from './fixtures/mocks/prefill.inProgress.household.json';
import mockUser from './fixtures/mocks/user.inProgressForm.json';
import {
  advanceFromHouseholdToSubmit,
  fillDeductibleExpenses,
  fillSpousalBasicInformation,
  fillSpousalIncome,
  fillVeteranIncome,
  goToNextPage,
  setupForAuth,
  startAsInProgressUser,
} from './utils';

const { data: testData } = maxTestData;

describe('HCA-Household: Spousal disclosure', () => {
  beforeEach(() => {
    setupForAuth({ user: mockUser, prefill: mockPrefill });
    startAsInProgressUser();
  });

  it('works with spouse who lived with Veteran', () => {
    goToNextPage('/household-information/share-financial-information');
    cy.selectRadio('root_discloseFinancialInformation', 'Y');

    goToNextPage('/household-information/financial-information-needed');
    goToNextPage('/household-information/marital-status');
    cy.get('[name="root_maritalStatus"]').select(testData.maritalStatus);

    goToNextPage('/household-information/spouse-personal-information');
    fillSpousalBasicInformation(testData);

    goToNextPage('/household-information/spouse-additional-information');
    cy.selectRadio('root_cohabitedLastYear', 'Y');
    cy.selectRadio('root_sameAddress', 'Y');

    goToNextPage('/household-information/dependents');
    cy.selectRadio('root_view:reportDependents', 'N');

    goToNextPage('/household-information/veteran-annual-income');
    fillVeteranIncome(testData);

    goToNextPage('/household-information/spouse-annual-income');
    fillSpousalIncome(testData);

    goToNextPage('/household-information/deductible-expenses');
    fillDeductibleExpenses(testData);

    advanceFromHouseholdToSubmit(testData);
    cy.injectAxeThenAxeCheck();
  });

  it('works with spouse who did not live with Veteran', () => {
    goToNextPage('/household-information/share-financial-information');
    cy.selectRadio('root_discloseFinancialInformation', 'Y');

    goToNextPage('/household-information/financial-information-needed');
    goToNextPage('/household-information/marital-status');
    cy.get('[name="root_maritalStatus"]').select(testData.maritalStatus);

    goToNextPage('/household-information/spouse-personal-information');
    fillSpousalBasicInformation(testData);

    goToNextPage('/household-information/spouse-additional-information');
    cy.selectRadio('root_cohabitedLastYear', 'N');
    cy.selectRadio('root_sameAddress', 'N');

    goToNextPage('/household-information/spouse-financial-support');
    cy.selectRadio('root_provideSupportLastYear', 'N');

    goToNextPage('/household-information/spouse-contact-information');
    cy.fillAddress(
      'root_spouseAddress',
      testData['view:spouseContactInformation'].spouseAddress,
    );
    cy.fill(
      '[name="root_spousePhone"]',
      testData['view:spouseContactInformation'].spousePhone,
    );

    goToNextPage('/household-information/dependents');
    cy.selectRadio('root_view:reportDependents', 'N');

    goToNextPage('/household-information/veteran-annual-income');
    fillVeteranIncome(testData);

    goToNextPage('/household-information/spouse-annual-income');
    fillSpousalIncome(testData);

    goToNextPage('/household-information/deductible-expenses');
    fillDeductibleExpenses(testData);

    advanceFromHouseholdToSubmit(testData);
    cy.injectAxeThenAxeCheck();
  });
});
