import {
  deleteAllPreferences,
  getUserPreferencesTwoSelected,
  makeUserObject,
  mockLocalStorage,
  removeSinglePreference,
} from './dashboard-e2e-helpers';

describe('MyVA Dashboard - Find VA Benefits', () => {
  describe('when user has already selected two VA benefits to learn about', () => {
    beforeEach(() => {
      mockLocalStorage();
      const mockUser = makeUserObject({
        isCerner: false,
        messaging: false,
        rx: false,
        facilities: [],
        inProgressForms: [],
        isPatient: false,
      });
      cy.login(mockUser);
      // login() calls cy.server() so we can now mock routes
      cy.route('GET', '/v0/user/preferences', getUserPreferencesTwoSelected);
      cy.route('POST', '/v0/user/preferences', removeSinglePreference);
      cy.route(
        'DELETE',
        'v0/user/preferences/benefits/delete_all',
        deleteAllPreferences,
      );
    });
    it('should allow them to delete those selections', () => {
      cy.visit('my-va/');

      // Shows the preference widget in a non-empty state
      cy.findByTestId('preferences-widget').should(
        'not.contain.text',
        'You haven’t selected any benefits to learn about',
      );
      cy.findByRole('link', { name: /select benefits now/i }).should(
        'not.exist',
      );

      cy.findByRole('button', {
        name: /remove health care preference/i,
      }).click();
      cy.findByRole('heading', { name: /please confirm this change/i }).should(
        'exist',
      );
      cy.findByRole('button', { name: /remove health care content/i }).click();

      cy.findByRole('button', {
        name: /remove disability compensation preference/i,
      }).click();
      cy.findByRole('heading', { name: /please confirm this change/i }).should(
        'exist',
      );
      cy.findByRole('button', {
        name: /remove disability compensation content/i,
      }).click();

      cy.findByRole('link', { name: /select benefits now/i }).should('exist');
    });
  });
});
