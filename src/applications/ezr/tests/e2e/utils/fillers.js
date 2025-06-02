import {
  clearVeteranIncome,
  clearSpousalIncome,
  clearDeductibleExpenses,
} from '../helpers';

export const fillVeteranIncome = (testData, clearInput = false) => {
  if (clearInput) {
    clearVeteranIncome();
  }

  cy.fill(
    '[name="root_view:veteranGrossIncome_veteranGrossIncome"]',
    testData['view:veteranGrossIncome'].veteranGrossIncome,
  );
  cy.fill(
    '[name="root_view:veteranNetIncome_veteranNetIncome"]',
    testData['view:veteranNetIncome'].veteranNetIncome,
  );
  cy.fill(
    '[name="root_view:veteranOtherIncome_veteranOtherIncome"]',
    testData['view:veteranOtherIncome'].veteranOtherIncome,
  );
};

export const fillSpousalIncome = (testData, clearInput = false) => {
  if (clearInput) {
    clearSpousalIncome();
  }

  cy.fill(
    '[name="root_view:spouseGrossIncome_spouseGrossIncome"]',
    testData['view:spouseGrossIncome'].spouseGrossIncome,
  );
  cy.fill(
    '[name="root_view:spouseNetIncome_spouseNetIncome"]',
    testData['view:spouseNetIncome'].spouseNetIncome,
  );
  cy.fill(
    '[name="root_view:spouseOtherIncome_spouseOtherIncome"]',
    testData['view:spouseOtherIncome'].spouseOtherIncome,
  );
};

export const fillDeductibleExpenses = (testData, clearInput = false) => {
  if (clearInput) {
    clearDeductibleExpenses();
  }

  cy.fill(
    '[name="root_view:deductibleMedicalExpenses_deductibleMedicalExpenses',
    testData['view:deductibleMedicalExpenses'].deductibleMedicalExpenses,
  );
  cy.fill(
    '[name="root_view:deductibleEducationExpenses_deductibleEducationExpenses',
    testData['view:deductibleEducationExpenses'].deductibleEducationExpenses,
  );
  cy.fill(
    '[name="root_view:deductibleFuneralExpenses_deductibleFuneralExpenses',
    testData['view:deductibleFuneralExpenses'].deductibleFuneralExpenses,
  );
};
