import { PROFILE_PATHS_LGBTQ_ENHANCEMENT } from '@@profile/constants';
import { paymentHistory } from '../../../../mocks/payment-history';
import { user72Success } from '../../../../mocks/user';
import { basicUserPersonalInfo } from '../../../../mocks/personal-information';

import { generateFeatureToggles } from '../../../../mocks/feature-toggles';
import { airForce } from '../../../../mocks/service-history';

describe('Direct Deposit Consistently', () => {
  describe('alert is hidden', () => {
    beforeEach(() => {
      cy.login(user72Success);
      cy.intercept(
        'GET',
        'v0/profile/personal_information',
        basicUserPersonalInfo,
      );
      cy.intercept('v0/profile/service_history', airForce);
      cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles());
      cy.intercept(
        'GET',
        'v0/ppiu/payment_information',
        paymentHistory.isFiduciary,
      );
    });
    it('should not display the paymentInformation message on the personal information page', () => {
      cy.visit(PROFILE_PATHS_LGBTQ_ENHANCEMENT.PERSONAL_INFORMATION);
      cy.get('.vads-u-font-size--h2').should('exist');
      cy.injectAxeThenAxeCheck();
      cy.findAllByText('You can’t update your financial information').should(
        'not.exist',
      );
    });
    it('should not display the paymentInformation message on the contact page', () => {
      cy.visit(PROFILE_PATHS_LGBTQ_ENHANCEMENT.CONTACT_INFORMATION);
      cy.get('.vads-u-font-size--h2').should('exist');
      cy.injectAxeThenAxeCheck();
      cy.findAllByText('You can’t update your financial information').should(
        'not.exist',
      );
    });
  });
});
