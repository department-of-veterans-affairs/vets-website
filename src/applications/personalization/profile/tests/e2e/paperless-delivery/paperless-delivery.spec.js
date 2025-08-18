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

  context('when user is enrolled in health care', () => {
    beforeEach(() => {
      cy.login(
        makeUserObject({
          isPatient: true,
          facilities: [{ facilityId: '999' }],
        }),
      );
      cy.visit(PROFILE_PATHS.PAPERLESS_DELIVERY);
    });

    it('should render the page with no accessibility violations', () => {
      cy.axeCheck();
    });

    it('should display page heading', () => {
      cy.findByRole('heading', {
        name: 'Paperless delivery',
        level: 1,
      }).should('exist');
    });

    it('should display loading indicator', () => {
      cy.loadingIndicatorWorks();
    });

    it('should display description text', () => {
      cy.findByText(
        /With paperless delivery, you can choose which documents you no longer want to get by mail/,
      ).should('exist');
    });

    it('should display email address and link to update', () => {
      cy.findByText('vets.gov.user+36@gmail.com').should('exist');
      cy.findByRole('link', {
        name: 'Update your email address',
        level: 1,
      }).should('exist');
    });

    it('should display secure storage text', () => {
      cy.findByText(
        /We’ll always store secure, digital copies of these documents on VA.gov/,
      ).should('exist');
    });

    it('should display paperless delivery group and checkbox', () => {
      cy.findByRole('heading', {
        name: 'Documents available for paperless delivery',
        level: 2,
      }).should('exist');
      cy.findByRole('heading', {
        name: /Select the document you no longer want to get by mail. You can change this at any time/,
        level: 3,
      }).should('exist');
      cy.get('va-checkbox').should('exist');
    });

    it('should display note text', () => {
      cy.findByText(
        /We have limited documents available for paperless delivery at this time/,
      ).should('exist');
    });
  });

  context('when user is not enrolled in health care', () => {
    beforeEach(() => {
      cy.login(
        makeUserObject({
          isPatient: true,
          facilities: [],
        }),
      );
      cy.visit(PROFILE_PATHS.PAPERLESS_DELIVERY);
    });

    it('should render the page with no accessibility violations', () => {
      cy.axeCheck();
    });

    it('should display page heading', () => {
      cy.findByRole('heading', {
        name: 'Paperless delivery',
        level: 1,
      }).should('exist');
    });

    it('should display loading indicator', () => {
      cy.loadingIndicatorWorks();
    });

    it('should display description text', () => {
      cy.findByText(
        /With paperless delivery, you can choose which documents you no longer want to get by mail/,
      ).should('exist');
    });

    it('should display email address and link to update', () => {
      cy.findByText('vets.gov.user+36@gmail.com').should('exist');
      cy.findByRole('link', {
        name: 'Update your email address',
        level: 1,
      }).should('exist');
    });

    it('should display secure storage text', () => {
      cy.findByText(
        /We’ll always store secure, digital copies of these documents on VA.gov/,
      ).should('exist');
    });

    it('should not display paperless delivery group and checkbox', () => {
      cy.findByRole('heading', {
        name: 'Documents available for paperless delivery',
        level: 2,
      }).should('not.exist');
      cy.findByRole('heading', {
        name: /Select the document you no longer want to get by mail. You can change this at any time/,
        level: 3,
      }).should('not.exist');
      cy.get('va-checkbox').should('not.exist');
    });

    it('should display note text', () => {
      cy.findByText(
        /We have limited documents available for paperless delivery at this time/,
      ).should('exist');
    });
  });
});
