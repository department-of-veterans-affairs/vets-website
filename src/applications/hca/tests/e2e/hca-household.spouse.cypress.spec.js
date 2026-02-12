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
    cy.selectYesNoVaRadioOption('root_discloseFinancialInformation', true);

    goToNextPage('/household-information/financial-information-needed');
    goToNextPage('/household-information/marital-status');
    cy.get('[name="root_maritalStatus"]').select(testData.maritalStatus);

    goToNextPage('/household-information/spouse-personal-information');
    fillSpousalBasicInformation(testData);

    goToNextPage('/household-information/spouse-additional-information');
    cy.selectYesNoVaRadioOption('root_cohabitedLastYear', true);
    cy.selectYesNoVaRadioOption('root_sameAddress', true);

    goToNextPage('/household-information/your-dependents');
    goToNextPage('/household-information/dependents');
    cy.selectYesNoVaRadioOption('root_view:reportDependents', false);

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
    cy.selectYesNoVaRadioOption('root_discloseFinancialInformation', true);

    goToNextPage('/household-information/financial-information-needed');
    goToNextPage('/household-information/marital-status');
    cy.get('[name="root_maritalStatus"]').select(testData.maritalStatus);

    goToNextPage('/household-information/spouse-personal-information');
    fillSpousalBasicInformation(testData);

    goToNextPage('/household-information/spouse-additional-information');
    cy.selectYesNoVaRadioOption('root_cohabitedLastYear', false);
    cy.selectYesNoVaRadioOption('root_sameAddress', false);

    goToNextPage('/household-information/spouse-financial-support');
    cy.selectYesNoVaRadioOption('root_provideSupportLastYear', false);

    goToNextPage('/household-information/spouse-contact-information');
    cy.fillAddress(
      'root_spouseAddress',
      testData['view:spouseContactInformation'].spouseAddress,
    );
    cy.fill(
      '[name="root_spousePhone"]',
      testData['view:spouseContactInformation'].spousePhone,
    );

    goToNextPage('/household-information/your-dependents');
    goToNextPage('/household-information/dependents');
    cy.selectYesNoVaRadioOption('root_view:reportDependents', false);

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
