import { INSURANCE_VIEW_FIELDS } from '../../../utils/constants';
import {
  goToNextPage,
  fillTextWebComponent,
  selectDropdownWebComponent,
  selectYesNoWebComponent,
  fillDateWebComponentPattern,
} from '.';
import { handleOptionalServiceHistoryPage } from './handleOptionalServiceHistoryPage';

export const advanceToDependents = testData => {
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

  // Skip Emergency Contacts Section
  goToNextPage('/veteran-information/emergency-contacts-summary');

  selectYesNoWebComponent('view:hasEmergencyContacts', false);

  // Skip Next of Kin Section
  goToNextPage('/veteran-information/next-of-kin-summary');
  selectYesNoWebComponent('view:hasNextOfKin', false);

  handleOptionalServiceHistoryPage({
    historyEnabled: testData['view:ezrServiceHistoryEnabled'],
    hasServiceHistoryInfo: testData['view:hasPrefillServiceHistory'],
  });

  goToNextPage('/household-information/marital-status');
  selectDropdownWebComponent(
    'view:maritalStatus_maritalStatus',
    'Never Married',
  );
};

export const advanceFromDependentsToReview = testData => {
  goToNextPage('/household-information/veteran-annual-income');
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

  goToNextPage('/household-information/deductible-expenses');
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
    fillTextWebComponent('view:grossIncome_grossIncome', grossIncome);
    fillTextWebComponent('view:netIncome_netIncome', netIncome);
    fillTextWebComponent('view:otherIncome_otherIncome', otherIncome);
    cy.injectAxeThenAxeCheck();
    goToNextPage();
    // fill educational expenses
    selectYesNoWebComponent('attendedSchoolLastYear', attendedSchoolLastYear);
    fillTextWebComponent(
      'dependentEducationExpenses',
      dependentEducationExpenses,
    );
    cy.injectAxeThenAxeCheck();
  }
};
