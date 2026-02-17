import user from '@@profile/mocks/endpoints/user';
import commPrefs from '@@profile/mocks/endpoints/communication-preferences';
import { mockProfileLOA3, registerCypressHelpers } from '../helpers';

import { PROFILE_PATHS } from '../../../constants';

registerCypressHelpers();

describe('Edit page', () => {
  beforeEach(() => {
    mockProfileLOA3();
    cy.login(user.loa3User72);
  });

  describe('Cancelling from edit page with no unsaved changes', () => {
    it('should allow breadcrumb to send user back to notification settings page', () => {
      cy.visit(
        `${PROFILE_PATHS.EDIT}?fieldName=mobilePhone&returnPath=%2Fprofile%2Fnotifications`,
      );

      cy.get('va-link[back]').click();

      cy.url().should('contain', '/profile/notifications');

      cy.injectAxeThenAxeCheck();
    });

    it('should allow the form cancel button to send user back to notification settings page', () => {
      cy.visit(
        `${PROFILE_PATHS.EDIT}?fieldName=mobilePhone&returnPath=%2Fprofile%2Fnotifications`,
      );

      cy.findByTestId('cancel-edit-button').click();

      cy.url().should('contain', '/profile/notifications');

      cy.injectAxeThenAxeCheck();
    });
  });

  describe('Cancelling from edit page with unsaved changes', () => {
    it('should show modal when breadcrumb is clicked', () => {
      cy.visit(
        `${PROFILE_PATHS.EDIT}?fieldName=mobilePhone&returnPath=%2Fprofile%2Fnotifications`,
      );

      cy.fillVaTextInput('root_inputPhoneNumber', '970-867-5309');

      cy.get('va-link[back]').click();

      cy.url().should('not.contain', '/profile/notifications');

      cy.get('va-modal')
        .last()
        .shadow()
        .within(() => {
          cy.get('.usa-button-group va-button').first().click();
        });

      cy.url().should('contain', '/profile/notifications');

      cy.injectAxeThenAxeCheck();
    });

    it('should show modal when the form cancel button is clicked and allow user to cancel edit and return to notification settings page', () => {
      cy.visit(
        `${PROFILE_PATHS.EDIT}?fieldName=mobilePhone&returnPath=%2Fprofile%2Fnotifications`,
      );

      cy.fillVaTextInput('root_inputPhoneNumber', '970-867-5309');

      cy.findByTestId('cancel-edit-button').click();

      cy.injectAxeThenAxeCheck();

      cy.url().should('not.contain', '/profile/notifications');

      cy.get('va-modal')
        .last()
        .shadow()
        .within(() => {
          cy.get('va-button').first().click();
        });

      cy.url().should('contain', '/profile/notifications');
    });

    it('should show modal when cancelling changes and a single change is made to an input field', () => {
      cy.visit(
        `${PROFILE_PATHS.EDIT}?fieldName=mobilePhone&returnPath=%2Fprofile%2Fnotifications`,
      );

      cy.fillVaTextInput('root_inputPhoneNumber', ' ');
      cy.realPress('Tab');

      cy.findByTestId('cancel-edit-button').click();

      cy.injectAxeThenAxeCheck();

      cy.url().should('not.contain', '/profile/notifications');

      cy.get('va-modal')
        .last()
        .shadow()
        .within(() => {
          cy.get('va-button').first().click();
        });

      cy.url().should('contain', '/profile/notifications');
    });

    it('redirects to notification settings when no changes are made and the save button is clicked', () => {
      cy.visit(
        `${PROFILE_PATHS.EDIT}?fieldName=mobilePhone&returnPath=%2Fprofile%2Fnotifications`,
      );

      cy.intercept('PUT', '/v0/profile/telephones', {
        data: {
          id: '',
          type: 'async_transaction_va_profile_telephone_transactions',
          attributes: {
            transactionId: '1234567890',
            transactionStatus: 'COMPLETED_NO_CHANGES_DETECTED',
            type: 'AsyncTransaction::VAProfile::TelephoneTransaction',
            metadata: [],
          },
        },
      });

      cy.intercept('/v0/user?now=*', user.loa3User72);

      cy.intercept(
        '/v0/profile/communication_preferences',
        commPrefs.maximalSetOfPreferences,
      );

      cy.findByTestId('save-edit-button').click();

      cy.url().should('contain', '/profile/notifications');

      cy.findByText(
        'We saved your mobile phone number to your profile.',
      ).should('exist');

      cy.injectAxeThenAxeCheck();
    });
  });
});
