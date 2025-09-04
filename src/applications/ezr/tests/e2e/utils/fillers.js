import {
  clearVeteranIncome,
  clearSpousalIncome,
  clearDeductibleExpenses,
  fillTextWebComponent,
} from '../helpers';

export const fillVeteranIncome = (testData, clearInput = false) => {
  if (clearInput) {
    clearVeteranIncome();
  }

  fillTextWebComponent(
    'view:veteranGrossIncome_veteranGrossIncome',
    testData['view:veteranGrossIncome'].veteranGrossIncome,
  );

  fillTextWebComponent(
    'view:veteranNetIncome_veteranNetIncome',
    testData['view:veteranNetIncome'].veteranNetIncome,
  );

  fillTextWebComponent(
    'view:veteranOtherIncome_veteranOtherIncome',
    testData['view:veteranOtherIncome'].veteranOtherIncome,
  );
};

export const fillSpousalIncome = (testData, clearInput = false) => {
  if (clearInput) {
    clearSpousalIncome();
  }

  fillTextWebComponent(
    'view:spouseGrossIncome_spouseGrossIncome',
    testData['view:spouseGrossIncome'].spouseGrossIncome,
  );

  fillTextWebComponent(
    'view:spouseNetIncome_spouseNetIncome',
    testData['view:spouseNetIncome'].spouseNetIncome,
  );

  fillTextWebComponent(
    'view:spouseOtherIncome_spouseOtherIncome',
    testData['view:spouseOtherIncome'].spouseOtherIncome,
  );
};

export const fillDeductibleExpenses = (testData, clearInput = false) => {
  if (clearInput) {
    clearDeductibleExpenses();
  }

  fillTextWebComponent(
    'view:deductibleMedicalExpenses_deductibleMedicalExpenses',
    testData['view:deductibleMedicalExpenses'].deductibleMedicalExpenses,
  );
  fillTextWebComponent(
    'view:deductibleEducationExpenses_deductibleEducationExpenses',
    testData['view:deductibleEducationExpenses'].deductibleEducationExpenses,
  );
  fillTextWebComponent(
    'view:deductibleFuneralExpenses_deductibleFuneralExpenses',
    testData['view:deductibleFuneralExpenses'].deductibleFuneralExpenses,
  );
};
