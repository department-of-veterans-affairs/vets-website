import maxTestData from './fixtures/data/maximal-test.json';
import mockPrefill from './fixtures/mocks/prefill.inProgress.household.json';
import mockUser from './fixtures/mocks/user.inProgressForm.json';
import {
  advanceFromHouseholdToSubmit,
  fillDeductibleExpenses,
  fillDependentBasicInformation,
  fillDependentIncome,
  fillVeteranIncome,
  goToNextPage,
  setupForAuth,
  startAsInProgressUser,
} from './utils';

const { data: testData } = maxTestData;

describe('HCA-Household: Dependent disclosure', () => {
  beforeEach(() => {
    setupForAuth({ user: mockUser, prefill: mockPrefill });
    startAsInProgressUser();
  });

  it('works with dependent who is of college age, lived with Veteran and did not earn income', () => {
    goToNextPage();
    cy.selectYesNoVaRadioOption('root_discloseFinancialInformation', true);

    goToNextPage();
    goToNextPage();
    cy.get('[name="root_maritalStatus"]').select('Never Married');

    goToNextPage();
    goToNextPage();
    cy.selectYesNoVaRadioOption('root_view:reportDependents', true);

    goToNextPage();
    fillDependentBasicInformation(testData.dependents[0]);

    goToNextPage();
    cy.selectRadio('root_disabledBefore18', 'N');
    cy.selectRadio('root_cohabitedLastYear', 'Y');
    cy.selectRadio('root_view:dependentIncome', 'N');

    goToNextPage();
    cy.selectYesNoVaRadioOption('root_view:reportDependents', false);

    goToNextPage();
    fillVeteranIncome(testData);

    goToNextPage();
    fillDeductibleExpenses(testData);

    advanceFromHouseholdToSubmit(testData);
    cy.injectAxeThenAxeCheck();
  });

  it('works with dependent who is of college age, lived with Veteran and earned income', () => {
    goToNextPage();
    cy.selectYesNoVaRadioOption('root_discloseFinancialInformation', true);

    goToNextPage();
    goToNextPage();
    cy.get('[name="root_maritalStatus"]').select('Never Married');

    goToNextPage();
    goToNextPage();
    cy.selectYesNoVaRadioOption('root_view:reportDependents', true);

    goToNextPage();
    fillDependentBasicInformation(testData.dependents[0]);

    goToNextPage();
    cy.selectRadio('root_disabledBefore18', 'N');
    cy.selectRadio('root_cohabitedLastYear', 'Y');
    cy.selectRadio('root_view:dependentIncome', 'Y');

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
    fillDeductibleExpenses(testData);

    advanceFromHouseholdToSubmit(testData);
    cy.injectAxeThenAxeCheck();
  });

  it('works with dependent who is of college age, did not live with Veteran and did not earn income', () => {
    goToNextPage();
    cy.selectYesNoVaRadioOption('root_discloseFinancialInformation', true);

    goToNextPage();
    goToNextPage();
    cy.get('[name="root_maritalStatus"]').select('Never Married');

    goToNextPage();
    goToNextPage();
    cy.selectYesNoVaRadioOption('root_view:reportDependents', true);

    goToNextPage();
    fillDependentBasicInformation(testData.dependents[0]);

    goToNextPage();
    cy.selectRadio('root_disabledBefore18', 'N');
    cy.selectRadio('root_cohabitedLastYear', 'N');
    cy.selectRadio('root_view:dependentIncome', 'N');

    goToNextPage();
    cy.selectRadio('root_receivedSupportLastYear', 'Y');

    goToNextPage();
    cy.selectYesNoVaRadioOption('root_view:reportDependents', false);

    goToNextPage();
    fillVeteranIncome(testData);

    goToNextPage();
    fillDeductibleExpenses(testData);

    advanceFromHouseholdToSubmit(testData);
    cy.injectAxeThenAxeCheck();
  });

  it('works with dependent who is of college age, did not live with Veteran and earned income', () => {
    goToNextPage();
    cy.selectYesNoVaRadioOption('root_discloseFinancialInformation', true);

    goToNextPage();
    goToNextPage();
    cy.get('[name="root_maritalStatus"]').select('Never Married');

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
    fillDeductibleExpenses(testData);

    advanceFromHouseholdToSubmit(testData);
    cy.injectAxeThenAxeCheck();
  });

  it('works with dependent who is not of college age, lived with Veteran and did not earn income', () => {
    goToNextPage();
    cy.selectYesNoVaRadioOption('root_discloseFinancialInformation', true);

    goToNextPage();
    goToNextPage();
    cy.get('[name="root_maritalStatus"]').select('Never Married');

    goToNextPage();
    goToNextPage();
    cy.selectYesNoVaRadioOption('root_view:reportDependents', true);

    goToNextPage();
    fillDependentBasicInformation({
      ...testData.dependents[0],
      dateOfBirth: '1990-01-01',
    });

    goToNextPage();
    cy.selectRadio('root_disabledBefore18', 'N');
    cy.selectRadio('root_cohabitedLastYear', 'Y');
    cy.selectRadio('root_view:dependentIncome', 'N');

    goToNextPage();
    cy.selectYesNoVaRadioOption('root_view:reportDependents', false);

    goToNextPage();
    fillVeteranIncome(testData);

    goToNextPage();
    fillDeductibleExpenses(testData);

    advanceFromHouseholdToSubmit(testData);
    cy.injectAxeThenAxeCheck();
  });

  it('works with dependent who is not of college age, lived with Veteran and earned income', () => {
    goToNextPage();
    cy.selectYesNoVaRadioOption('root_discloseFinancialInformation', true);

    goToNextPage();
    goToNextPage();
    cy.get('[name="root_maritalStatus"]').select('Never Married');

    goToNextPage();
    goToNextPage();
    cy.selectYesNoVaRadioOption('root_view:reportDependents', true);

    goToNextPage();
    fillDependentBasicInformation({
      ...testData.dependents[0],
      dateOfBirth: '1990-01-01',
    });

    goToNextPage();
    cy.selectRadio('root_disabledBefore18', 'N');
    cy.selectRadio('root_cohabitedLastYear', 'Y');
    cy.selectRadio('root_view:dependentIncome', 'Y');

    goToNextPage();
    fillDependentIncome(testData.dependents[0]);

    goToNextPage();
    cy.selectYesNoVaRadioOption('root_view:reportDependents', false);

    goToNextPage();
    fillVeteranIncome(testData);

    goToNextPage();
    fillDeductibleExpenses(testData);

    advanceFromHouseholdToSubmit(testData);
    cy.injectAxeThenAxeCheck();
  });

  it('works with dependent who is not of college age, did not live with Veteran and did not earn income', () => {
    goToNextPage();
    cy.selectYesNoVaRadioOption('root_discloseFinancialInformation', true);

    goToNextPage();
    goToNextPage();
    cy.get('[name="root_maritalStatus"]').select('Never Married');

    goToNextPage();
    goToNextPage();
    cy.selectYesNoVaRadioOption('root_view:reportDependents', true);

    goToNextPage();
    fillDependentBasicInformation({
      ...testData.dependents[0],
      dateOfBirth: '1990-01-01',
    });

    goToNextPage();
    cy.selectRadio('root_disabledBefore18', 'N');
    cy.selectRadio('root_cohabitedLastYear', 'N');
    cy.selectRadio('root_view:dependentIncome', 'N');

    goToNextPage();
    cy.selectRadio('root_receivedSupportLastYear', 'Y');

    goToNextPage();
    cy.selectYesNoVaRadioOption('root_view:reportDependents', false);

    goToNextPage();
    fillVeteranIncome(testData);

    goToNextPage();
    fillDeductibleExpenses(testData);

    advanceFromHouseholdToSubmit(testData);
    cy.injectAxeThenAxeCheck();
  });

  it('works with dependent who is not of college age, did not live with Veteran and earned income', () => {
    goToNextPage();
    cy.selectYesNoVaRadioOption('root_discloseFinancialInformation', true);

    goToNextPage();
    goToNextPage();
    cy.get('[name="root_maritalStatus"]').select('Never Married');

    goToNextPage();
    goToNextPage();
    cy.selectYesNoVaRadioOption('root_view:reportDependents', true);

    goToNextPage();
    fillDependentBasicInformation({
      ...testData.dependents[0],
      dateOfBirth: '1990-01-01',
    });

    goToNextPage();
    cy.selectRadio('root_disabledBefore18', 'N');
    cy.selectRadio('root_cohabitedLastYear', 'N');
    cy.selectRadio('root_view:dependentIncome', 'Y');

    goToNextPage();
    cy.selectRadio('root_receivedSupportLastYear', 'Y');

    goToNextPage();
    fillDependentIncome(testData.dependents[0]);

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
