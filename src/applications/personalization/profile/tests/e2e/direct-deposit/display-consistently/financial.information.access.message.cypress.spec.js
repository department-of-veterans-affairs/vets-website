import { PROFILE_PATHS } from '@@profile/constants';
import mockDisabilityCompensations from '@@profile/mocks/endpoints/disability-compensations';
import { loa3User72 } from 'applications/personalization/profile/mocks/endpoints/user';
import { basicUserPersonalInfo } from 'applications/personalization/profile/mocks/endpoints/personal-information';
import { generateFeatureToggles } from 'applications/personalization/profile/mocks/endpoints/feature-toggles';
import { airForce } from 'applications/personalization/profile/mocks/endpoints/service-history';

describe('Direct Deposit Consistently', () => {
  describe('alert is hidden', () => {
    beforeEach(() => {
      cy.login(loa3User72);
      cy.intercept(
        'GET',
        'v0/profile/personal_information',
        basicUserPersonalInfo,
      );
      cy.intercept('v0/profile/service_history', airForce);
      cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles());
      cy.intercept(
        'GET',
        '/v0/profile/direct_deposits/disability_compensations',
        mockDisabilityCompensations.isFiduciary,
      );
    });
    it('should not display the paymentInformation message on the personal information page', () => {
      cy.visit(PROFILE_PATHS.PERSONAL_INFORMATION);
      cy.get('.vads-u-font-size--h2').should('exist');
      cy.injectAxeThenAxeCheck();
      cy.findAllByText('You can’t update your financial information').should(
        'not.exist',
      );
    });
    it('should not display the paymentInformation message on the contact page', () => {
      cy.visit(PROFILE_PATHS.CONTACT_INFORMATION);
      cy.get('.vads-u-font-size--h2').should('exist');
      cy.injectAxeThenAxeCheck();
      cy.findAllByText('You can’t update your financial information').should(
        'not.exist',
      );
    });
  });
});
