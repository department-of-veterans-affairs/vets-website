import user from '@@profile/mocks/endpoints/user';
import { mockProfileLOA3, registerCypressHelpers } from '../helpers';

import { checkForLegacyLoadingIndicator } from '~/applications/personalization/common/e2eHelpers';
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
        `${
          PROFILE_PATHS.EDIT
        }?fieldName=mobilePhone&returnPath=%2Fprofile%2Fnotifications`,
      );

      checkForLegacyLoadingIndicator();

      cy.injectAxeThenAxeCheck();

      cy.findByRole('link', { name: /Back to/i }).click();

      cy.url().should('contain', '/profile/notifications');
    });

    it('should allow the form cancel button to send user back to notification settings page', () => {
      cy.visit(
        `${
          PROFILE_PATHS.EDIT
        }?fieldName=mobilePhone&returnPath=%2Fprofile%2Fnotifications`,
      );

      checkForLegacyLoadingIndicator();

      cy.injectAxeThenAxeCheck();

      cy.findByTestId('cancel-edit-button').click();

      cy.url().should('contain', '/profile/notifications');
    });
  });

  describe('Cancelling from edit page with unsaved changes', () => {
    it('should show modal when breadcrumb is clicked', () => {
      cy.visit(
        `${
          PROFILE_PATHS.EDIT
        }?fieldName=mobilePhone&returnPath=%2Fprofile%2Fnotifications`,
      );

      checkForLegacyLoadingIndicator();

      cy.injectAxeThenAxeCheck();

      cy.findByLabelText(/Mobile phone number/i)
        .clear()
        .type('970-867-5309');

      cy.findByRole('link', { name: /Back to/i }).click();

      cy.url().should('not.contain', '/profile/notifications');

      cy.get('va-modal')
        .shadow()
        .within(() => {
          cy.findByRole('button', { name: /cancel my changes/i }).click();
        });

      cy.url().should('contain', '/profile/notifications');

      cy.url().should('contain', '/profile/notifications');
    });

    it('should show modal when the form cancel button is clicked and allow user to cancel edit and return to notification settings page', () => {
      cy.visit(
        `${
          PROFILE_PATHS.EDIT
        }?fieldName=mobilePhone&returnPath=%2Fprofile%2Fnotifications`,
      );

      checkForLegacyLoadingIndicator();

      cy.injectAxeThenAxeCheck();

      cy.findByLabelText(/Mobile phone number/i)
        .clear()
        .type('970-867-5309');

      cy.findByTestId('cancel-edit-button').click();

      cy.url().should('not.contain', '/profile/notifications');

      cy.get('va-modal')
        .shadow()
        .within(() => {
          cy.findByRole('button', { name: /cancel my changes/i }).click();
        });

      cy.url().should('contain', '/profile/notifications');
    });

    it('should show modal when cancelling changes and a single change is made to an input field', () => {
      cy.visit(
        `${
          PROFILE_PATHS.EDIT
        }?fieldName=mobilePhone&returnPath=%2Fprofile%2Fnotifications`,
      );

      checkForLegacyLoadingIndicator();

      cy.injectAxeThenAxeCheck();

      cy.findByLabelText(/Mobile phone number/i)
        .type('{backspace}')
        .tab();

      cy.findByTestId('cancel-edit-button').click();

      cy.url().should('not.contain', '/profile/notifications');

      cy.get('va-modal')
        .shadow()
        .within(() => {
          cy.findByRole('button', { name: /cancel my changes/i }).click();
        });

      cy.url().should('contain', '/profile/notifications');
    });
  });
});
