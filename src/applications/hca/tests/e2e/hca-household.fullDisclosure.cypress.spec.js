import maxTestData from './fixtures/data/maximal-test.json';
import mockPrefill from './fixtures/mocks/prefill.inProgress.household.json';
import mockUser from './fixtures/mocks/user.inProgressForm.json';
import {
  advanceFromHouseholdToSubmit,
  fillDeductibleExpenses,
  fillDependentBasicInformation,
  fillDependentIncome,
  fillSpousalBasicInformation,
  fillSpousalIncome,
  fillVeteranIncome,
  goToNextPage,
  setupForAuth,
  startAsInProgressUser,
} from './utils';

const { data: testData } = maxTestData;

describe('HCA-Household: Full disclosure', () => {
  beforeEach(() => {
    setupForAuth({ user: mockUser, prefill: mockPrefill });
    startAsInProgressUser();
  });

  it('works with full spousal and dependent information', () => {
    goToNextPage('/household-information/share-financial-information');
    cy.selectYesNoVaRadioOption('root_discloseFinancialInformation', true);

    goToNextPage('/household-information/financial-information-needed');
    goToNextPage('/household-information/marital-status');
    cy.get('[name="root_maritalStatus"]').select('Married');

    goToNextPage('/household-information/spouse-personal-information');
    fillSpousalBasicInformation(testData);

    goToNextPage('/household-information/spouse-additional-information');
    cy.selectYesNoVaRadioOption('root_cohabitedLastYear', true);
    cy.selectYesNoVaRadioOption('root_sameAddress', true);

    goToNextPage('/household-information/your-dependents');
    goToNextPage('/household-information/dependents');
    cy.selectYesNoVaRadioOption('root_view:reportDependents', true);

    goToNextPage('/household-information/dependents/0/basic-information');
    fillDependentBasicInformation(testData.dependents[0]);

    goToNextPage('/household-information/dependents/0/additional-information');
    cy.selectRadio('root_disabledBefore18', 'N');
    cy.selectRadio('root_cohabitedLastYear', 'N');
    cy.selectRadio('root_view:dependentIncome', 'Y');

    goToNextPage('/household-information/dependents/0/financial-support');
    cy.selectRadio('root_receivedSupportLastYear', 'Y');

    goToNextPage('/household-information/dependents/0/annual-income');
    fillDependentIncome(testData.dependents[0]);

    goToNextPage('/household-information/dependents/0/education-expenses');
    cy.selectRadio('root_attendedSchoolLastYear', 'Y');
    cy.fill(
      '[name="root_dependentEducationExpenses"]',
      testData.dependents[0].dependentEducationExpenses,
    );

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
