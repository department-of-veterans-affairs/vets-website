import { DEPENDENT_VIEW_FIELDS } from '../../../utils/constants';
import {
  goToNextPage,
  fillTextWebComponent,
  selectDropdownWebComponent,
  selectYesNoWebComponent,
} from '.';
import { handleOptionalServiceHistoryPage } from './handleOptionalServiceHistoryPage';

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

  // Skip Emergency Contacts Section
  goToNextPage('/veteran-information/emergency-contacts-summary');

  selectYesNoWebComponent('view:hasEmergencyContacts', false);

  // Skip Next of Kin Section
  goToNextPage('/veteran-information/next-of-kin-summary');
  selectYesNoWebComponent('view:hasNextOfKin', false);

  // Skip TERA Section
  handleOptionalServiceHistoryPage({
    historyEnabled: testData['view:ezrServiceHistoryEnabled'],
  });

  goToNextPage('/household-information/marital-status');
  selectDropdownWebComponent(
    'view:maritalStatus_maritalStatus',
    'Never Married',
  );

  goToNextPage('/household-information/dependents');
  cy.get(`[name="root_${DEPENDENT_VIEW_FIELDS.add}"]`).check('N');

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
