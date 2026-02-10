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
    goToNextPage();
    cy.selectYesNoVaRadioOption('root_discloseFinancialInformation', true);

    goToNextPage();
    goToNextPage();
    cy.get('[name="root_maritalStatus"]').select(testData.maritalStatus);

    goToNextPage();
    fillSpousalBasicInformation(testData);

    goToNextPage();
    cy.selectYesNoVaRadioOption('root_cohabitedLastYear', true);
    cy.selectYesNoVaRadioOption('root_sameAddress', true);

    goToNextPage();
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

  it('works with spouse who did not live with Veteran', () => {
    goToNextPage();
    cy.selectYesNoVaRadioOption('root_discloseFinancialInformation', true);

    goToNextPage();
    goToNextPage();
    cy.get('[name="root_maritalStatus"]').select(testData.maritalStatus);

    goToNextPage();
    fillSpousalBasicInformation(testData);

    goToNextPage();
    cy.selectYesNoVaRadioOption('root_cohabitedLastYear', false);
    cy.selectYesNoVaRadioOption('root_sameAddress', false);

    goToNextPage();
    cy.selectYesNoVaRadioOption('root_provideSupportLastYear', false);

    goToNextPage();
    cy.fillAddress(
      'root_spouseAddress',
      testData['view:spouseContactInformation'].spouseAddress,
    );
    cy.fill(
      '[name="root_spousePhone"]',
      testData['view:spouseContactInformation'].spousePhone,
    );

    goToNextPage();
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
