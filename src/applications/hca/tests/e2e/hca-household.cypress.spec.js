import maxTestData from './fixtures/data/maximal-test.json';
import {
  advanceFromHouseholdToSubmit,
  advanceToHousehold,
  fillDeductibleExpenses,
  fillDependentBasicInformation,
  fillDependentIncome,
  fillSpousalBasicInformation,
  fillSpousalIncome,
  fillVeteranIncome,
  goToNextPage,
  setupForAuth,
} from './utils';

const { data: testData } = maxTestData;

describe('HCA-Household: Non-disclosure', () => {
  beforeEach(() => {
    setupForAuth();
    advanceToHousehold();
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

describe('HCA-Household: Spousal disclosure', () => {
  beforeEach(() => {
    setupForAuth();
    advanceToHousehold();
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

describe('HCA-Household: Dependent disclosure', () => {
  beforeEach(() => {
    setupForAuth();
    advanceToHousehold();
  });

  it('works with dependent who is of college age, lived with Veteran and did not earn income', () => {
    goToNextPage('/household-information/share-financial-information');
    cy.selectRadio('root_discloseFinancialInformation', 'Y');

    goToNextPage('/household-information/financial-information-needed');
    goToNextPage('/household-information/marital-status');
    cy.get('[name="root_maritalStatus"]').select('Never Married');

    goToNextPage('/household-information/dependents');
    cy.selectRadio('root_view:reportDependents', 'Y');

    goToNextPage('/household-information/dependent-information');
    fillDependentBasicInformation(testData.dependents[0]);

    goToNextPage();
    cy.selectRadio('root_disabledBefore18', 'N');
    cy.selectRadio('root_cohabitedLastYear', 'Y');
    cy.selectRadio('root_view:dependentIncome', 'N');

    goToNextPage('/household-information/dependents');
    cy.selectRadio('root_view:reportDependents', 'N');

    goToNextPage('/household-information/veteran-annual-income');
    fillVeteranIncome(testData);

    goToNextPage('/household-information/deductible-expenses');
    fillDeductibleExpenses(testData);

    advanceFromHouseholdToSubmit(testData);
    cy.injectAxeThenAxeCheck();
  });

  it('works with dependent who is of college age, lived with Veteran and earned income', () => {
    goToNextPage('/household-information/share-financial-information');
    cy.selectRadio('root_discloseFinancialInformation', 'Y');

    goToNextPage('/household-information/financial-information-needed');
    goToNextPage('/household-information/marital-status');
    cy.get('[name="root_maritalStatus"]').select('Never Married');

    goToNextPage('/household-information/dependents');
    cy.selectRadio('root_view:reportDependents', 'Y');

    goToNextPage('/household-information/dependent-information');
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

    goToNextPage('/household-information/dependents');
    cy.selectRadio('root_view:reportDependents', 'N');

    goToNextPage('/household-information/veteran-annual-income');
    fillVeteranIncome(testData);

    goToNextPage('/household-information/deductible-expenses');
    fillDeductibleExpenses(testData);

    advanceFromHouseholdToSubmit(testData);
    cy.injectAxeThenAxeCheck();
  });

  it('works with dependent who is of college age, did not live with Veteran and did not earn income', () => {
    goToNextPage('/household-information/share-financial-information');
    cy.selectRadio('root_discloseFinancialInformation', 'Y');

    goToNextPage('/household-information/financial-information-needed');
    goToNextPage('/household-information/marital-status');
    cy.get('[name="root_maritalStatus"]').select('Never Married');

    goToNextPage('/household-information/dependents');
    cy.selectRadio('root_view:reportDependents', 'Y');

    goToNextPage('/household-information/dependent-information');
    fillDependentBasicInformation(testData.dependents[0]);

    goToNextPage();
    cy.selectRadio('root_disabledBefore18', 'N');
    cy.selectRadio('root_cohabitedLastYear', 'N');
    cy.selectRadio('root_view:dependentIncome', 'N');

    goToNextPage();
    cy.selectRadio('root_receivedSupportLastYear', 'Y');

    goToNextPage('/household-information/dependents');
    cy.selectRadio('root_view:reportDependents', 'N');

    goToNextPage('/household-information/veteran-annual-income');
    fillVeteranIncome(testData);

    goToNextPage('/household-information/deductible-expenses');
    fillDeductibleExpenses(testData);

    advanceFromHouseholdToSubmit(testData);
    cy.injectAxeThenAxeCheck();
  });

  it('works with dependent who is of college age, did not live with Veteran and earned income', () => {
    goToNextPage('/household-information/share-financial-information');
    cy.selectRadio('root_discloseFinancialInformation', 'Y');

    goToNextPage('/household-information/financial-information-needed');
    goToNextPage('/household-information/marital-status');
    cy.get('[name="root_maritalStatus"]').select('Never Married');

    goToNextPage('/household-information/dependents');
    cy.selectRadio('root_view:reportDependents', 'Y');

    goToNextPage('/household-information/dependent-information');
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

    goToNextPage('/household-information/dependents');
    cy.selectRadio('root_view:reportDependents', 'N');

    goToNextPage('/household-information/veteran-annual-income');
    fillVeteranIncome(testData);

    goToNextPage('/household-information/deductible-expenses');
    fillDeductibleExpenses(testData);

    advanceFromHouseholdToSubmit(testData);
    cy.injectAxeThenAxeCheck();
  });

  it('works with dependent who is not of college age, lived with Veteran and did not earn income', () => {
    goToNextPage('/household-information/share-financial-information');
    cy.selectRadio('root_discloseFinancialInformation', 'Y');

    goToNextPage('/household-information/financial-information-needed');
    goToNextPage('/household-information/marital-status');
    cy.get('[name="root_maritalStatus"]').select('Never Married');

    goToNextPage('/household-information/dependents');
    cy.selectRadio('root_view:reportDependents', 'Y');

    goToNextPage('/household-information/dependent-information');
    fillDependentBasicInformation({
      ...testData.dependents[0],
      dateOfBirth: '1990-01-01',
    });

    goToNextPage();
    cy.selectRadio('root_disabledBefore18', 'N');
    cy.selectRadio('root_cohabitedLastYear', 'Y');
    cy.selectRadio('root_view:dependentIncome', 'N');

    goToNextPage('/household-information/dependents');
    cy.selectRadio('root_view:reportDependents', 'N');

    goToNextPage('/household-information/veteran-annual-income');
    fillVeteranIncome(testData);

    goToNextPage('/household-information/deductible-expenses');
    fillDeductibleExpenses(testData);

    advanceFromHouseholdToSubmit(testData);
    cy.injectAxeThenAxeCheck();
  });

  it('works with dependent who is not of college age, lived with Veteran and earned income', () => {
    goToNextPage('/household-information/share-financial-information');
    cy.selectRadio('root_discloseFinancialInformation', 'Y');

    goToNextPage('/household-information/financial-information-needed');
    goToNextPage('/household-information/marital-status');
    cy.get('[name="root_maritalStatus"]').select('Never Married');

    goToNextPage('/household-information/dependents');
    cy.selectRadio('root_view:reportDependents', 'Y');

    goToNextPage('/household-information/dependent-information');
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

    goToNextPage('/household-information/dependents');
    cy.selectRadio('root_view:reportDependents', 'N');

    goToNextPage('/household-information/veteran-annual-income');
    fillVeteranIncome(testData);

    goToNextPage('/household-information/deductible-expenses');
    fillDeductibleExpenses(testData);

    advanceFromHouseholdToSubmit(testData);
    cy.injectAxeThenAxeCheck();
  });

  it('works with dependent who is not of college age, did not live with Veteran and did not earn income', () => {
    goToNextPage('/household-information/share-financial-information');
    cy.selectRadio('root_discloseFinancialInformation', 'Y');

    goToNextPage('/household-information/financial-information-needed');
    goToNextPage('/household-information/marital-status');
    cy.get('[name="root_maritalStatus"]').select('Never Married');

    goToNextPage('/household-information/dependents');
    cy.selectRadio('root_view:reportDependents', 'Y');

    goToNextPage('/household-information/dependent-information');
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

    goToNextPage('/household-information/dependents');
    cy.selectRadio('root_view:reportDependents', 'N');

    goToNextPage('/household-information/veteran-annual-income');
    fillVeteranIncome(testData);

    goToNextPage('/household-information/deductible-expenses');
    fillDeductibleExpenses(testData);

    advanceFromHouseholdToSubmit(testData);
    cy.injectAxeThenAxeCheck();
  });

  it('works with dependent who is not of college age, did not live with Veteran and earned income', () => {
    goToNextPage('/household-information/share-financial-information');
    cy.selectRadio('root_discloseFinancialInformation', 'Y');

    goToNextPage('/household-information/financial-information-needed');
    goToNextPage('/household-information/marital-status');
    cy.get('[name="root_maritalStatus"]').select('Never Married');

    goToNextPage('/household-information/dependents');
    cy.selectRadio('root_view:reportDependents', 'Y');

    goToNextPage('/household-information/dependent-information');
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

describe('HCA-Household: Full disclosure', () => {
  beforeEach(() => {
    setupForAuth();
    advanceToHousehold();
  });

  it('works with full spousal and dependent information', () => {
    goToNextPage('/household-information/share-financial-information');
    cy.selectRadio('root_discloseFinancialInformation', 'Y');

    goToNextPage('/household-information/financial-information-needed');
    goToNextPage('/household-information/marital-status');
    cy.get('[name="root_maritalStatus"]').select('Married');

    goToNextPage('/household-information/spouse-personal-information');
    fillSpousalBasicInformation(testData);

    goToNextPage('/household-information/spouse-additional-information');
    cy.selectRadio('root_cohabitedLastYear', 'Y');
    cy.selectRadio('root_sameAddress', 'Y');

    goToNextPage('/household-information/dependents');
    cy.selectRadio('root_view:reportDependents', 'Y');

    goToNextPage('/household-information/dependent-information');
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
