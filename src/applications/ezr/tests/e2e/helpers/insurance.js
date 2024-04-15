import { DEPENDENT_VIEW_FIELDS } from '../../../utils/constants';
import {
  goToNextPage,
  fillTextWebComponent,
  selectDropdownWebComponent,
  selectYesNoWebComponent,
} from '.';

export const advanceToInsurancePolicies = testData => {
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

  goToNextPage('/household-information/dependents');
  cy.get(`[name="root_${DEPENDENT_VIEW_FIELDS.add}"]`).check('N');

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
};

export const fillInsuranceInformation = policy => {
  const {
    insuranceName,
    insurancePolicyHolderName,
    insurancePolicyNumber,
  } = policy;

  fillTextWebComponent('insuranceName', insuranceName);
  fillTextWebComponent('insurancePolicyHolderName', insurancePolicyHolderName);
  fillTextWebComponent(
    'view:policyOrGroup_insurancePolicyNumber',
    insurancePolicyNumber,
  );
  cy.injectAxeThenAxeCheck();
};
