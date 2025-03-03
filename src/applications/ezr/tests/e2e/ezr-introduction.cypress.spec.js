import manifest from '../../manifest.json';
import content from '../../locales/en/content.json';
import mockUser from './fixtures/mocks/mock-user';

describe('Introduction Page', () => {
  describe('Unauthenticated Access', () => {
    beforeEach(() => {
      // Set up production environment
      const mockEnvironment = {
        isLocalhost: () => false,
        isDev: () => false,
        isStaging: () => false,
        isProduction: () => true,
      };
      cy.window().then(win => {
        Object.defineProperty(win, 'environment', { value: mockEnvironment });
      });
      cy.injectAxe();
    });

    it('should allow access to introduction page', () => {
      cy.visit(manifest.rootUrl);
      cy.url().should('include', content.routes.introduction);
      cy.axeCheck();
    });

    it('should display login prompt with correct content', () => {
      cy.visit(manifest.rootUrl);
      cy.axeCheck();

      // Wait for page to load and check alert content
      cy.get('[data-testid="ezr-login-alert"]', { timeout: 10000 }).should(
        'exist',
      );
      cy.get('[data-testid="ezr-login-alert"]').within(() => {
        cy.get('h3').should('contain', content['sip-alert-title']);
        cy.get('ul li')
          .first()
          .should(
            'contain',
            'We can fill in some of your information for you to save you time',
          );
        cy.get('ul li')
          .last()
          .invoke('text')
          .should('include', 'You can save your work in progress')
          .and('include', '60 days');
      });
    });

    it('should show sign-in button', () => {
      cy.visit(manifest.rootUrl);
      cy.axeCheck();

      cy.contains('button', 'Sign in', { timeout: 10000 }).should('exist');
    });
  });

  describe('Authenticated Access', () => {
    beforeEach(() => {
      cy.login(mockUser);
      cy.visit(manifest.rootUrl);
      cy.injectAxe();
    });

    it('should not show login prompt when authenticated', () => {
      cy.get('[data-testid="ezr-login-alert"]', { timeout: 10000 }).should(
        'not.exist',
      );
      cy.axeCheck();
    });

    it('should show save-in-progress section', () => {
      // Look for SaveInProgressIntro component's rendered content
      cy.contains('.vads-u-margin-y--4', content['sip-start-form-text'], {
        timeout: 10000,
      }).should('exist');
      cy.axeCheck();
    });
  });
});
