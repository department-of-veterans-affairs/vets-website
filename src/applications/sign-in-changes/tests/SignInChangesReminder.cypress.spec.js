describe('Interstitial Changes Page', () => {
  const baseUrl = '/sign-in-changes-reminder';

  const interceptResponse = (statusCode, body) => {
    cy.intercept('GET', 'v0/user/credential_emails', {
      delay: 1000, // Simulate loading delay
      statusCode,
      body,
    });
  };

  const visitPage = () => {
    cy.visit(baseUrl);
  };

  context('when user data is loading', () => {
    beforeEach(() => {
      interceptResponse(200, { logingov: 'user@logingov.com' });
      visitPage();
    });

    it('displays a loading indicator', () => {
      cy.get('va-loading-indicator').should('be.visible');
      cy.injectAxeThenAxeCheck();
    });
  });

  context('when user is redirected to /sign-in-changes-reminder', () => {
    beforeEach(() => {
      interceptResponse(200, {});
      visitPage();
    });

    it('displays the correct content', () => {
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
      interceptResponse(200, { logingov: 'user@logingov.com' });
      visitPage();
    });

    it('displays the Login.gov account switch option', () => {
      cy.get('#accountSwitchH2').should('be.visible');
      cy.get('.logingov-verify-buttons').should('be.visible');
      cy.injectAxeThenAxeCheck();
    });
  });

  context('when user has only an ID.me account', () => {
    beforeEach(() => {
      interceptResponse(200, { idme: 'user@idme.com' });
      visitPage();
    });

    it('displays the ID.me account switch option', () => {
      cy.get('#accountSwitchH2').should('be.visible');
      cy.get('.idme-verify-buttons').should('be.visible');
      cy.injectAxeThenAxeCheck();
    });
  });

  context('when user has both Login.gov and ID.me accounts', () => {
    beforeEach(() => {
      interceptResponse(200, {
        logingov: 'user@logingov.com',
        idme: 'user@idme.com',
      });
      visitPage();
    });

    it('displays options to use either Login.gov or ID.me account', () => {
      cy.get('#accountSwitchH2').should('be.visible');
      cy.get('.logingov-verify-buttons').should('be.visible');
      cy.get('.idme-verify-buttons').should('be.visible');
      cy.injectAxeThenAxeCheck();
    });
  });

  context('when user has no Login.gov or ID.me account', () => {
    beforeEach(() => {
      interceptResponse(200, {});
      visitPage();
    });

    it('displays the create account option', () => {
      cy.get('#createAccountH2').should('be.visible');
      cy.get('#createAccountP').should('be.visible');
      cy.get('.logingov-verify-buttons').should('be.visible');
      cy.get('.idme-verify-buttons').should('be.visible');
      cy.injectAxeThenAxeCheck();
    });
  });

  context('when user clicks on continue with My HealtheVet link', () => {
    beforeEach(() => {
      sessionStorage.setItem('authReturnUrl', '/return-path');
      interceptResponse(200, {});
      visitPage();
    });

    it('navigates to the return URL', () => {
      cy.injectAxeThenAxeCheck();
      cy.get('#interstitialVaLink')
        .should('be.visible')
        .click();
      cy.url().should('include', '/return-path');
    });
  });
});
