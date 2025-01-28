import maxTestData from './fixtures/data/maximal-test.json';
import mockFeatures from './fixtures/mocks/feature-toggles.insurance.json';
import {
  advanceToHealthInsurance,
  fillInsuranceInformation,
  goToNextPage,
  setupForAuth,
} from './utils';

const { data: testData } = maxTestData;

describe('HCA-Health-Insurance-Information', () => {
  beforeEach(() => {
    setupForAuth({ features: mockFeatures });
    advanceToHealthInsurance();
  });

  it('should successfully advance to facility selection when user does not have health insurance coverage', () => {
    cy.selectYesNoVaRadioOption('root_view:hasHealthInsuranceToAdd', false);
    goToNextPage('/insurance-information/va-facility');
    cy.injectAxeThenAxeCheck();
  });

  it('should successfully fill the policy information when user has health insurance coverage', () => {
    cy.selectYesNoVaRadioOption('root_view:hasHealthInsuranceToAdd', true);

    goToNextPage(
      '/insurance-information/health-insurance/0/policy-information',
    );
    fillInsuranceInformation(testData.providers[0]);

    goToNextPage('/insurance-information/health-insurance');
    cy.selectYesNoVaRadioOption('root_view:hasHealthInsuranceToAdd', false);

    goToNextPage('/insurance-information/va-facility');
    cy.injectAxeThenAxeCheck();
  });
});
