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
    cy.get('[name="root_discloseFinancialInformation"]').check('N');

    goToNextPage('/household-information/share-financial-information-confirm');
    goToNextPage('/household-information/marital-status');
    cy.get('#root_maritalStatus').select(testData.maritalStatus);

    advanceFromHouseholdToSubmit(testData, { disclosureAssertionValue: false });
    cy.injectAxeThenAxeCheck();
  });

  it('works without spouse or dependent information', () => {
    goToNextPage('/household-information/share-financial-information');
    cy.get('[name="root_discloseFinancialInformation"]').check('Y');

    goToNextPage('/household-information/financial-information-needed');
    goToNextPage('/household-information/marital-status');
    cy.get('#root_maritalStatus').select('Never Married');

    goToNextPage('/household-information/dependents');
    cy.get('[type="radio"]')
      .last()
      .check('N');

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
    cy.get('[name="root_discloseFinancialInformation"]').check('Y');

    goToNextPage('/household-information/financial-information-needed');
    goToNextPage('/household-information/marital-status');
    cy.get('#root_maritalStatus').select(testData.maritalStatus);

    goToNextPage('/household-information/spouse-personal-information');
    fillSpousalBasicInformation(testData);

    goToNextPage('/household-information/spouse-additional-information');
    cy.get('[name="root_cohabitedLastYear"]').check('Y');
    cy.get('[name="root_sameAddress"]').check('Y');

    goToNextPage('/household-information/dependents');
    cy.get('[type="radio"]')
      .last()
      .check('N');

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
    cy.get('[name="root_discloseFinancialInformation"]').check('Y');

    goToNextPage('/household-information/financial-information-needed');
    goToNextPage('/household-information/marital-status');
    cy.get('#root_maritalStatus').select(testData.maritalStatus);

    goToNextPage('/household-information/spouse-personal-information');
    fillSpousalBasicInformation(testData);

    goToNextPage('/household-information/spouse-additional-information');
    cy.get('[name="root_cohabitedLastYear"]').check('N');
    cy.get('[name="root_sameAddress"]').check('N');

    goToNextPage('/household-information/spouse-financial-support');
    cy.get('[name="root_provideSupportLastYear"]').check('N');

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
    cy.get('[type="radio"]')
      .last()
      .check('N');

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
    cy.get('[name="root_discloseFinancialInformation"]').check('Y');

    goToNextPage('/household-information/financial-information-needed');
    goToNextPage('/household-information/marital-status');
    cy.get('#root_maritalStatus').select('Never Married');

    goToNextPage('/household-information/dependents');
    cy.get('[name="root_view:reportDependents"]').check('Y');

    goToNextPage('/household-information/dependent-information');
    fillDependentBasicInformation(testData.dependents[0]);

    goToNextPage();
    cy.get('[name="root_disabledBefore18"]').check('N');
    cy.get('[name="root_cohabitedLastYear"]').check('Y');
    cy.get('[name="root_view:dependentIncome"]').check('N');

    goToNextPage('/household-information/dependents');
    cy.get('[name="root_view:reportDependents"]').check('N');

    goToNextPage('/household-information/veteran-annual-income');
    fillVeteranIncome(testData);

    goToNextPage('/household-information/deductible-expenses');
    fillDeductibleExpenses(testData);

    advanceFromHouseholdToSubmit(testData);
    cy.injectAxeThenAxeCheck();
  });

  it('works with dependent who is of college age, lived with Veteran and earned income', () => {
    goToNextPage('/household-information/share-financial-information');
    cy.get('[name="root_discloseFinancialInformation"]').check('Y');

    goToNextPage('/household-information/financial-information-needed');
    goToNextPage('/household-information/marital-status');
    cy.get('#root_maritalStatus').select('Never Married');

    goToNextPage('/household-information/dependents');
    cy.get('[name="root_view:reportDependents"]').check('Y');

    goToNextPage('/household-information/dependent-information');
    fillDependentBasicInformation(testData.dependents[0]);

    goToNextPage();
    cy.get('[name="root_disabledBefore18"]').check('N');
    cy.get('[name="root_cohabitedLastYear"]').check('Y');
    cy.get('[name="root_view:dependentIncome"]').check('Y');

    goToNextPage();
    fillDependentIncome(testData.dependents[0]);

    goToNextPage();
    cy.get('[name="root_attendedSchoolLastYear"]').check('Y');
    cy.fill(
      '[name="root_dependentEducationExpenses"]',
      testData.dependents[0].dependentEducationExpenses,
    );

    goToNextPage('/household-information/dependents');
    cy.get('[name="root_view:reportDependents"]').check('N');

    goToNextPage('/household-information/veteran-annual-income');
    fillVeteranIncome(testData);

    goToNextPage('/household-information/deductible-expenses');
    fillDeductibleExpenses(testData);

    advanceFromHouseholdToSubmit(testData);
    cy.injectAxeThenAxeCheck();
  });

  it('works with dependent who is of college age, did not live with Veteran and did not earn income', () => {
    goToNextPage('/household-information/share-financial-information');
    cy.get('[name="root_discloseFinancialInformation"]').check('Y');

    goToNextPage('/household-information/financial-information-needed');
    goToNextPage('/household-information/marital-status');
    cy.get('#root_maritalStatus').select('Never Married');

    goToNextPage('/household-information/dependents');
    cy.get('[name="root_view:reportDependents"]').check('Y');

    goToNextPage('/household-information/dependent-information');
    fillDependentBasicInformation(testData.dependents[0]);

    goToNextPage();
    cy.get('[name="root_disabledBefore18"]').check('N');
    cy.get('[name="root_cohabitedLastYear"]').check('N');
    cy.get('[name="root_view:dependentIncome"]').check('N');

    goToNextPage();
    cy.get('[name="root_receivedSupportLastYear"]').check('Y');

    goToNextPage('/household-information/dependents');
    cy.get('[name="root_view:reportDependents"]').check('N');

    goToNextPage('/household-information/veteran-annual-income');
    fillVeteranIncome(testData);

    goToNextPage('/household-information/deductible-expenses');
    fillDeductibleExpenses(testData);

    advanceFromHouseholdToSubmit(testData);
    cy.injectAxeThenAxeCheck();
  });

  it('works with dependent who is of college age, did not live with Veteran and earned income', () => {
    goToNextPage('/household-information/share-financial-information');
    cy.get('[name="root_discloseFinancialInformation"]').check('Y');

    goToNextPage('/household-information/financial-information-needed');
    goToNextPage('/household-information/marital-status');
    cy.get('#root_maritalStatus').select('Never Married');

    goToNextPage('/household-information/dependents');
    cy.get('[name="root_view:reportDependents"]').check('Y');

    goToNextPage('/household-information/dependent-information');
    fillDependentBasicInformation(testData.dependents[0]);

    goToNextPage();
    cy.get('[name="root_disabledBefore18"]').check('N');
    cy.get('[name="root_cohabitedLastYear"]').check('N');
    cy.get('[name="root_view:dependentIncome"]').check('Y');

    goToNextPage();
    cy.get('[name="root_receivedSupportLastYear"]').check('Y');

    goToNextPage();
    fillDependentIncome(testData.dependents[0]);

    goToNextPage();
    cy.get('[name="root_attendedSchoolLastYear"]').check('Y');
    cy.fill(
      '[name="root_dependentEducationExpenses"]',
      testData.dependents[0].dependentEducationExpenses,
    );

    goToNextPage('/household-information/dependents');
    cy.get('[name="root_view:reportDependents"]').check('N');

    goToNextPage('/household-information/veteran-annual-income');
    fillVeteranIncome(testData);

    goToNextPage('/household-information/deductible-expenses');
    fillDeductibleExpenses(testData);

    advanceFromHouseholdToSubmit(testData);
    cy.injectAxeThenAxeCheck();
  });

  it('works with dependent who is not of college age, lived with Veteran and did not earn income', () => {
    goToNextPage('/household-information/share-financial-information');
    cy.get('[name="root_discloseFinancialInformation"]').check('Y');

    goToNextPage('/household-information/financial-information-needed');
    goToNextPage('/household-information/marital-status');
    cy.get('#root_maritalStatus').select('Never Married');

    goToNextPage('/household-information/dependents');
    cy.get('[name="root_view:reportDependents"]').check('Y');

    goToNextPage('/household-information/dependent-information');
    fillDependentBasicInformation({
      ...testData.dependents[0],
      dateOfBirth: '1990-01-01',
    });

    goToNextPage();
    cy.get('[name="root_disabledBefore18"]').check('N');
    cy.get('[name="root_cohabitedLastYear"]').check('Y');
    cy.get('[name="root_view:dependentIncome"]').check('N');

    goToNextPage('/household-information/dependents');
    cy.get('[name="root_view:reportDependents"]').check('N');

    goToNextPage('/household-information/veteran-annual-income');
    fillVeteranIncome(testData);

    goToNextPage('/household-information/deductible-expenses');
    fillDeductibleExpenses(testData);

    advanceFromHouseholdToSubmit(testData);
    cy.injectAxeThenAxeCheck();
  });

  it('works with dependent who is not of college age, lived with Veteran and earned income', () => {
    goToNextPage('/household-information/share-financial-information');
    cy.get('[name="root_discloseFinancialInformation"]').check('Y');

    goToNextPage('/household-information/financial-information-needed');
    goToNextPage('/household-information/marital-status');
    cy.get('#root_maritalStatus').select('Never Married');

    goToNextPage('/household-information/dependents');
    cy.get('[name="root_view:reportDependents"]').check('Y');

    goToNextPage('/household-information/dependent-information');
    fillDependentBasicInformation({
      ...testData.dependents[0],
      dateOfBirth: '1990-01-01',
    });

    goToNextPage();
    cy.get('[name="root_disabledBefore18"]').check('N');
    cy.get('[name="root_cohabitedLastYear"]').check('Y');
    cy.get('[name="root_view:dependentIncome"]').check('Y');

    goToNextPage();
    fillDependentIncome(testData.dependents[0]);

    goToNextPage('/household-information/dependents');
    cy.get('[name="root_view:reportDependents"]').check('N');

    goToNextPage('/household-information/veteran-annual-income');
    fillVeteranIncome(testData);

    goToNextPage('/household-information/deductible-expenses');
    fillDeductibleExpenses(testData);

    advanceFromHouseholdToSubmit(testData);
    cy.injectAxeThenAxeCheck();
  });

  it('works with dependent who is not of college age, did not live with Veteran and did not earn income', () => {
    goToNextPage('/household-information/share-financial-information');
    cy.get('[name="root_discloseFinancialInformation"]').check('Y');

    goToNextPage('/household-information/financial-information-needed');
    goToNextPage('/household-information/marital-status');
    cy.get('#root_maritalStatus').select('Never Married');

    goToNextPage('/household-information/dependents');
    cy.get('[name="root_view:reportDependents"]').check('Y');

    goToNextPage('/household-information/dependent-information');
    fillDependentBasicInformation({
      ...testData.dependents[0],
      dateOfBirth: '1990-01-01',
    });

    goToNextPage();
    cy.get('[name="root_disabledBefore18"]').check('N');
    cy.get('[name="root_cohabitedLastYear"]').check('N');
    cy.get('[name="root_view:dependentIncome"]').check('N');

    goToNextPage();
    cy.get('[name="root_receivedSupportLastYear"]').check('Y');

    goToNextPage('/household-information/dependents');
    cy.get('[name="root_view:reportDependents"]').check('N');

    goToNextPage('/household-information/veteran-annual-income');
    fillVeteranIncome(testData);

    goToNextPage('/household-information/deductible-expenses');
    fillDeductibleExpenses(testData);

    advanceFromHouseholdToSubmit(testData);
    cy.injectAxeThenAxeCheck();
  });

  it('works with dependent who is not of college age, did not live with Veteran and earned income', () => {
    goToNextPage('/household-information/share-financial-information');
    cy.get('[name="root_discloseFinancialInformation"]').check('Y');

    goToNextPage('/household-information/financial-information-needed');
    goToNextPage('/household-information/marital-status');
    cy.get('#root_maritalStatus').select('Never Married');

    goToNextPage('/household-information/dependents');
    cy.get('[name="root_view:reportDependents"]').check('Y');

    goToNextPage('/household-information/dependent-information');
    fillDependentBasicInformation({
      ...testData.dependents[0],
      dateOfBirth: '1990-01-01',
    });

    goToNextPage();
    cy.get('[name="root_disabledBefore18"]').check('N');
    cy.get('[name="root_cohabitedLastYear"]').check('N');
    cy.get('[name="root_view:dependentIncome"]').check('Y');

    goToNextPage();
    cy.get('[name="root_receivedSupportLastYear"]').check('Y');

    goToNextPage();
    fillDependentIncome(testData.dependents[0]);

    goToNextPage('/household-information/dependents');
    cy.get('[name="root_view:reportDependents"]').check('N');

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
    cy.get('[name="root_discloseFinancialInformation"]').check('Y');

    goToNextPage('/household-information/financial-information-needed');
    goToNextPage('/household-information/marital-status');
    cy.get('#root_maritalStatus').select('Married');

    goToNextPage('/household-information/spouse-personal-information');
    fillSpousalBasicInformation(testData);

    goToNextPage('/household-information/spouse-additional-information');
    cy.get('[name="root_cohabitedLastYear"]').check('Y');
    cy.get('[name="root_sameAddress"]').check('Y');

    goToNextPage('/household-information/dependents');
    cy.get('[name="root_view:reportDependents"]').check('Y');

    goToNextPage('/household-information/dependent-information');
    fillDependentBasicInformation(testData.dependents[0]);

    goToNextPage();
    cy.get('[name="root_disabledBefore18"]').check('N');
    cy.get('[name="root_cohabitedLastYear"]').check('N');
    cy.get('[name="root_view:dependentIncome"]').check('Y');

    goToNextPage();
    cy.get('[name="root_receivedSupportLastYear"]').check('Y');

    goToNextPage();
    fillDependentIncome(testData.dependents[0]);

    goToNextPage();
    cy.get('[name="root_attendedSchoolLastYear"]').check('Y');
    cy.fill(
      '[name="root_dependentEducationExpenses"]',
      testData.dependents[0].dependentEducationExpenses,
    );

    goToNextPage('/household-information/dependents');
    cy.get('[name="root_view:reportDependents"]').check('N');

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
