import {
  addUserPreferences,
  getPreferencesChoices,
  getUserPreferencesEmpty,
  makeUserObject,
  mockLocalStorage,
} from './dashboard-e2e-helpers';

describe('MyVA Dashboard - Find VA Benefits', () => {
  describe('when user has not already selected VA benefits to learn about', () => {
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
      cy.route('GET', '/v0/user/preferences', getUserPreferencesEmpty);
      cy.route(
        'GET',
        '/v0/user/preferences/choices/benefits',
        getPreferencesChoices,
      );
      cy.route('POST', '/v0/user/preferences', addUserPreferences);
    });
    it('should allow them to select some benefits to learn more about', () => {
      cy.visit('my-va/');

      // Shows the preference widget empty state
      cy.findByTestId('preferences-widget')
        .should(
          'contain.text',
          'You haven’t selected any benefits to learn about',
        )
        .should(
          'not.contain.text',
          'If you’re homeless or at risk of becoming homeless',
        );
      cy.findByRole('link', { name: /select benefits now/i }).click();

      cy.findByRole('button', { name: /save preferences/i }).should(
        'be.disabled',
      );

      // make a selection and save
      cy.findByRole('checkbox', { name: /health care/i }).click();
      cy.findByRole('button', { name: /save preferences/i }).click();

      cy.findByTestId('preferences-widget')
        .should(
          'contain.text',
          'If you’re homeless or at risk of becoming homeless',
        )
        .should(
          'not.contain.text',
          'You haven’t selected any benefits to learn about',
        )
        .findByRole('heading', { name: /we’ve saved your preferences/i })
        .should('exist');
    });
  });
});
