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
    goToNextPage();
    cy.selectYesNoVaRadioOption('root_discloseFinancialInformation', true);

    goToNextPage();
    goToNextPage();
    cy.get('[name="root_maritalStatus"]').select('Married');

    goToNextPage();
    fillSpousalBasicInformation(testData);

    goToNextPage();
    cy.selectYesNoVaRadioOption('root_cohabitedLastYear', true);
    cy.selectYesNoVaRadioOption('root_sameAddress', true);

    goToNextPage();
    goToNextPage();
    cy.selectYesNoVaRadioOption('root_view:reportDependents', true);

    goToNextPage();
    fillDependentBasicInformation(testData.dependents[0]);

    goToNextPage();
    cy.selectRadio('root_disabledBefore18', 'N');
    cy.selectRadio('root_cohabitedLastYear', 'N');
    cy.selectRadio('root_view:dependentIncome', 'Y');

    goToNextPage();
    cy.selectRadio('root_receivedSupportLastYear', 'Y');

    goToNextPage();
    fillDependentIncome(testData.dependents[0]);

    goToNextPage();
    cy.selectRadio('root_attendedSchoolLastYear', 'Y');
    cy.fill(
      '[name="root_dependentEducationExpenses"]',
      testData.dependents[0].dependentEducationExpenses,
    );

    goToNextPage();
    cy.selectYesNoVaRadioOption('root_view:reportDependents', false);

    goToNextPage();
    fillVeteranIncome(testData);

    goToNextPage();
    fillSpousalIncome(testData);

    goToNextPage();
    fillDeductibleExpenses(testData);

    advanceFromHouseholdToSubmit(testData);
    cy.injectAxeThenAxeCheck();
  });
});
