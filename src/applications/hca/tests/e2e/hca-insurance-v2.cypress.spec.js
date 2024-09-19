import manifest from '../../manifest.json';
import featureToggles from './fixtures/mocks/feature-toggles-insurance.json';
import mockEnrollmentStatus from './fixtures/mocks/mockEnrollmentStatus.json';
import maxTestData from './fixtures/data/maximal-test.json';
import {
  goToNextPage,
  fillTextWebComponent,
  selectYesNoWebComponent,
} from './utils';

const { data: testData } = maxTestData;
const APIs = {
  features: '/v0/feature_toggles*',
  enrollment: '/v0/health_care_applications/enrollment_status*',
};

describe('HCA-Health-Insurance-Information', () => {
  const setupGuestUser = () => {
    cy.intercept('GET', APIs.features, featureToggles).as('mockFeatures');
    cy.intercept('GET', APIs.enrollment, {
      statusCode: 404,
      body: mockEnrollmentStatus,
    }).as('mockEnrollmentStatus');
    cy.visit(manifest.rootUrl);
    cy.wait(['@mockFeatures']);
  };
  const advanceToHealthInsurance = () => {
    cy.get('.schemaform-start-button')
      .first()
      .click();
    cy.location('pathname').should('include', '/id-form');

    cy.get('#root_firstName').type(testData.veteranFullName.first);
    cy.get('#root_lastName').type(testData.veteranFullName.last);

    const [year, month, day] = testData.veteranDateOfBirth
      .split('-')
      .map(dateComponent => parseInt(dateComponent, 10).toString());
    cy.get('#root_dobMonth').select(month);
    cy.get('#root_dobDay').select(day);
    cy.get('#root_dobYear').type(year);

    cy.get('#root_ssn').type(testData.veteranSocialSecurityNumber);

    goToNextPage('/veteran-information/personal-information');
    goToNextPage('/veteran-information/birth-information');
    goToNextPage('/veteran-information/maiden-name-information');
    goToNextPage('/veteran-information/birth-sex');
    cy.get('[name="root_gender"]').check('M');

    goToNextPage('/veteran-information/demographic-information');
    goToNextPage('/veteran-information/veteran-address');
    cy.get('#root_veteranAddress_street').type(testData.veteranAddress.street);
    cy.get('#root_veteranAddress_city').type(testData.veteranAddress.city);
    cy.get('#root_veteranAddress_state').select(testData.veteranAddress.state);
    cy.get('#root_veteranAddress_postalCode').type(
      testData.veteranAddress.postalCode,
    );
    cy.get('[name="root_view:doesMailingMatchHomeAddress"]').check('Y');

    goToNextPage('/veteran-information/contact-information');
    goToNextPage('/va-benefits/basic-information');
    cy.get('[name="root_vaCompensationType"]').check('highDisability');

    goToNextPage('/va-benefits/confirm-service-pay');
    goToNextPage('/military-service/toxic-exposure');
    cy.get('[name="root_hasTeraResponse"]').check('N');

    goToNextPage('/insurance-information/medicaid');
    cy.get('[name="root_isMedicaidEligible"]').check('N');

    goToNextPage('/insurance-information/your-health-insurance');
    goToNextPage('/insurance-information/health-insurance');
  };
  const fillInsuranceInformation = policy => {
    const {
      insuranceName,
      insurancePolicyHolderName,
      insurancePolicyNumber,
    } = policy;

    fillTextWebComponent('insuranceName', insuranceName);
    fillTextWebComponent(
      'insurancePolicyHolderName',
      insurancePolicyHolderName,
    );
    fillTextWebComponent(
      'view:policyNumberOrGroupCode_insurancePolicyNumber',
      insurancePolicyNumber,
    );
    cy.injectAxeThenAxeCheck();
  };

  beforeEach(() => {
    setupGuestUser();
    advanceToHealthInsurance();
  });

  it('should successfully advance to facility selection when user does not have health insurance coverage', () => {
    selectYesNoWebComponent('view:hasHealthInsuranceToAdd', false);
    goToNextPage('/insurance-information/va-facility');
    cy.injectAxeThenAxeCheck();
  });

  it('should successfully fill the policy information when user has health insurance coverage', () => {
    selectYesNoWebComponent('view:hasHealthInsuranceToAdd', true);

    goToNextPage(
      '/insurance-information/health-insurance/0/policy-information',
    );
    fillInsuranceInformation(testData.providers[0]);

    goToNextPage('/insurance-information/health-insurance');
    selectYesNoWebComponent('view:hasHealthInsuranceToAdd', false);

    goToNextPage('/insurance-information/va-facility');
    cy.injectAxeThenAxeCheck();
  });
});
