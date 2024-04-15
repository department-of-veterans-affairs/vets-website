import { INSURANCE_VIEW_FIELDS } from '../../../utils/constants';
import {
  goToNextPage,
  fillTextWebComponent,
  selectDropdownWebComponent,
  selectYesNoWebComponent,
  fillDateWebComponentPattern,
} from '.';

export const advanceToDependents = () => {
  cy.get('[href="#start"]')
    .first()
    .click();
  cy.location('pathname').should(
    'include',
    '/veteran-information/personal-information',
  );
  goToNextPage('/veteran-information/mailing-address');
  selectYesNoWebComponent('view:doesMailingMatchHomeAddress', true);

  goToNextPage('/veteran-information/contact-information');

  goToNextPage('/household-information/marital-status');
  selectDropdownWebComponent(
    'view:maritalStatus_maritalStatus',
    'Never Married',
  );
};

export const advanceFromDependentsToReview = testData => {
  goToNextPage('/household-information/veteran-annual-income');
  cy.get('[name="root_view:veteranGrossIncome_veteranGrossIncome"]').type(
    testData['view:veteranGrossIncome'].veteranGrossIncome,
  );
  cy.get('[name="root_view:veteranNetIncome_veteranNetIncome"]').type(
    testData['view:veteranNetIncome'].veteranNetIncome,
  );
  cy.get('[name="root_view:veteranOtherIncome_veteranOtherIncome"]').type(
    testData['view:veteranOtherIncome'].veteranOtherIncome,
  );

  goToNextPage('/household-information/deductible-expenses');
  cy.get(
    '[name="root_view:deductibleMedicalExpenses_deductibleMedicalExpenses',
  ).type(testData['view:deductibleMedicalExpenses'].deductibleMedicalExpenses);
  cy.get(
    '[name="root_view:deductibleEducationExpenses_deductibleEducationExpenses',
  ).type(
    testData['view:deductibleEducationExpenses'].deductibleEducationExpenses,
  );
  cy.get(
    '[name="root_view:deductibleFuneralExpenses_deductibleFuneralExpenses',
  ).type(testData['view:deductibleFuneralExpenses'].deductibleFuneralExpenses);

  goToNextPage('/insurance-information/medicaid-eligibility');
  selectYesNoWebComponent('view:isMedicaidEligible_isMedicaidEligible', false);

  goToNextPage('/insurance-information/medicare-part-a-enrollment');
  selectYesNoWebComponent(
    'view:isEnrolledMedicarePartA_isEnrolledMedicarePartA',
    false,
  );

  goToNextPage('/insurance-information/policies');
  cy.get(`[name="root_${INSURANCE_VIEW_FIELDS.add}"]`).check('N');

  goToNextPage('review-and-submit');
};

/**
 * @param {Object} dependent dependent data
 * @param {boolean} showDeductibleExpensesPage
 */
export const fillDependentInformation = (dependent, showIncomePages) => {
  const {
    fullName,
    dateOfBirth,
    becameDependent,
    dependentRelation,
    socialSecurityNumber,
    disabledBefore18,
    attendedSchoolLastYear,
    dependentEducationExpenses,
    cohabitedLastYear,
    grossIncome,
    netIncome,
    otherIncome,
    'view:dependentIncome': dependentEarnedIncome,
  } = dependent;

  // fill personal information
  fillTextWebComponent('fullName_first', fullName.first);
  fillTextWebComponent('fullName_middle', fullName.middle);
  fillTextWebComponent('fullName_last', fullName.last);
  selectDropdownWebComponent('fullName_suffix', fullName.suffix);
  selectDropdownWebComponent('dependentRelation', dependentRelation);
  fillTextWebComponent('socialSecurityNumber', socialSecurityNumber);
  fillDateWebComponentPattern('dateOfBirth', dateOfBirth);
  fillDateWebComponentPattern('becameDependent', becameDependent);
  cy.injectAxeThenAxeCheck();
  goToNextPage();

  // fill additional information
  selectYesNoWebComponent('disabledBefore18', disabledBefore18);
  selectYesNoWebComponent('cohabitedLastYear', cohabitedLastYear);
  selectYesNoWebComponent('view:dependentIncome', dependentEarnedIncome);
  cy.injectAxeThenAxeCheck();
  goToNextPage();

  // fill financial support
  selectYesNoWebComponent('receivedSupportLastYear', 'Y');
  cy.injectAxeThenAxeCheck();
  goToNextPage();

  // We only display the income and deductible expense pages if the dependent earned reportable income
  if (showIncomePages) {
    // fill income
    cy.get('[name="root_view:grossIncome_grossIncome"]').type(grossIncome);
    cy.get('[name="root_view:netIncome_netIncome"]').type(netIncome);
    cy.get('[name="root_view:otherIncome_otherIncome"]').type(otherIncome);
    cy.injectAxeThenAxeCheck();
    goToNextPage();
    // fill educational expenses
    selectYesNoWebComponent('attendedSchoolLastYear', attendedSchoolLastYear);
    cy.get('[name="root_dependentEducationExpenses"]').type(
      dependentEducationExpenses,
    );
    cy.injectAxeThenAxeCheck();
  }
};
