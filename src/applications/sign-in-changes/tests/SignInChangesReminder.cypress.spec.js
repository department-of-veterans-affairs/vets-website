describe('Interstitial Changes Page', () => {
  context('when user data is loading', () => {
    beforeEach(() => {
      cy.intercept('GET', 'v0/user/credential_emails', {
        delay: 1000, // to mock loading
        statusCode: 200,
        body: { logingov: 'user@logingov.com' },
      });
      cy.visit('/sign-in-changes-reminder');
    });

    it('displays a loading indicator', () => {
      cy.get('va-loading-indicator').should('be.visible');
      cy.axeCheck();
    });
  });

  context('when user is unauthorized', () => {
    beforeEach(() => {
      cy.intercept('GET', 'v0/user/credential_emails', {
        delay: 1000,
        statusCode: 401,
        body: {},
      });
      cy.visit('/sign-in-changes-reminder');
    });

    it('displays an unauthorized error message', () => {
      cy.get('va-alert').should('have.attr', 'status', 'error');
      cy.contains('401: Not authorized').should('be.visible');
      cy.axeCheck();
    });
  });

  context('when user is redirected to /sign-in-changes-reminder', () => {
    beforeEach(() => {
      cy.intercept('GET', 'v0/user/credential_emails', {
        delay: 1000,
        statusCode: 200,
        body: {},
      });
      cy.visit('/sign-in-changes-reminder');
    });

    it('displays the Login.gov account switch option', () => {
      cy.get('#interstitialH1').should('be.visible');
      cy.get('#interstitialP').should('be.visible');
      cy.get('#interstitialH2').should('be.visible');
      cy.get('#interstitialMhvP').should('be.visible');
      cy.get('#interstitialVaLink').should('be.visible');
      cy.injectAxeThenAxeCheck();
    });
  });

  context('when user has only a Login.gov account', () => {
    beforeEach(() => {
      cy.intercept('GET', 'v0/user/credential_emails', {
        delay: 1000,
        statusCode: 200,
        body: { logingov: 'user@logingov.com' },
      });
      cy.visit('/sign-in-changes-reminder');
    });

    it('displays the Login.gov account switch option', () => {
      cy.get('#accountSwitchH2').should('be.visible');
      cy.get('[data-csp="logingov"]').should('be.visible');
      cy.injectAxeThenAxeCheck();
    });
  });

  context('when user has only an ID.me account', () => {
    beforeEach(() => {
      cy.intercept('GET', 'v0/user/credential_emails', {
        delay: 1000,
        statusCode: 200,
        body: { idme: 'user@idme.com' },
      });
      cy.visit('/sign-in-changes-reminder');
    });

    it('displays the ID.me account switch option', () => {
      cy.get('#accountSwitchH2').should('be.visible');
      cy.get('[data-csp="idme"]').should('be.visible');
      cy.injectAxeThenAxeCheck();
    });
  });

  context('when user has both Login.gov and ID.me accounts', () => {
    beforeEach(() => {
      cy.intercept('GET', 'v0/user/credential_emails', {
        delay: 1000,
        statusCode: 200,
        body: { logingov: 'user@logingov.com', idme: 'user@idme.com' },
      });
      cy.visit('/sign-in-changes-reminder');
    });

    it('displays options to use either Login.gov or ID.me account', () => {
      cy.get('#accountSwitchH2').should('be.visible');
      cy.get('[data-csp="logingov"]').should('be.visible');
      cy.get('[data-csp="idme"]').should('be.visible');
      cy.injectAxeThenAxeCheck();
    });
  });

  context('when user has no Login.gov or ID.me account', () => {
    beforeEach(() => {
      cy.intercept('GET', 'v0/user/credential_emails', {
        delay: 1000,
        statusCode: 200,
        body: {},
      });
      cy.visit('/sign-in-changes-reminder');
    });

    it('displays the create account option', () => {
      cy.get('#interstitialH1').should('be.visible');
      cy.get('#interstitialP').should('be.visible');
      cy.get('#createAccountH2').should('be.visible');
      cy.get('#createAccountP').should('be.visible');
      cy.get('[data-csp="logingov"]').should('be.visible');
      cy.get('[data-csp="idme"]').should('be.visible');
      cy.get('#interstitialH2').should('be.visible');
      cy.get('#interstitialMhvP').should('be.visible');
      cy.get('#interstitialVaLink').should('be.visible');
      cy.injectAxeThenAxeCheck();
    });
  });

  context('when user clicks on continue with My HealtheVet link', () => {
    beforeEach(() => {
      sessionStorage.setItem('authReturnUrl', '/return-path');
      cy.intercept('GET', 'v0/user/credential_emails', {
        delay: 1000,
        statusCode: 200,
        body: {},
      });
      cy.visit('/sign-in-changes-reminder');
    });

    it('navigates to the return URL', () => {
      cy.axeCheck();
      cy.get('#interstitialVaLink')
        .should('be.visible')
        .click();
      cy.url().should('include', '/return-path');
    });
  });
});
