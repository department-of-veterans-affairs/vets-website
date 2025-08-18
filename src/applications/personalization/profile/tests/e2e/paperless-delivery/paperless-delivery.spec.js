import { makeUserObject } from '~/applications/personalization/common/helpers';
import mockCommunicationPreferences from '@@profile/tests/fixtures/paperless-delivery/paperless-delivery-200.json';
import { PROFILE_PATHS } from '@@profile/constants';
import {
  mockNotificationSettingsAPIs,
  registerCypressHelpers,
} from '../helpers';

registerCypressHelpers();

describe('Paperless Delivery', () => {
  beforeEach(() => {
    mockNotificationSettingsAPIs();
    cy.intercept('GET', '/v0/profile/communication_preferences', {
      statusCode: 200,
      body: mockCommunicationPreferences,
    });
  });

  it('should render the page with no accessibility violations', () => {
    cy.axeCheck();
  });

  context('when user is enrolled in health care', () => {
    it('should show the Paperless delivery group', () => {
      cy.login(
        makeUserObject({
          isPatient: true,
          facilities: [{ facilityId: '983' }],
        }),
      );
      cy.visit(PROFILE_PATHS.PAPERLESS_DELIVERY);
      cy.findByRole('heading', {
        name: 'Paperless delivery',
        level: 1,
      }).should('exist');

      cy.loadingIndicatorWorks();

      cy.findByText(
        /With paperless delivery, you can choose which documents you no longer want to get by mail/,
      ).should('exist');

      cy.findByText('vets.gov.user+36@gmail.com').should('exist');
      cy.findByText('Update your email address').should('exist');

      cy.findByText(
        /We’ll always store secure, digital copies of these documents on VA.gov/,
      ).should('exist');

      cy.findByRole('heading', {
        name: 'Documents available for paperless delivery',
        level: 2,
      }).should('exist');
      cy.findByText(
        /We have limited documents available for paperless delivery at this time/,
      ).should('exist');
      cy.findByRole('heading', {
        name: /Select the document you no longer want to get by mail. You can change this at any time/,
        level: 3,
      }).should('exist');
      cy.get('va-checkbox')
        .shadow()
        .find('input[type="checkbox"]')
        .check({ force: true });
      cy.injectAxeThenAxeCheck();
    });
  });
});
