describe('Interstitial Changes Page', () => {
  const baseUrl = '/sign-in-changes-reminder';

  const interceptCredentialEmails = (statusCode, body) => {
    cy.intercept('GET', 'v0/user/credential_emails', {
      statusCode,
      body,
    });
  };

  const visitPage = () => {
    cy.visit(baseUrl);
  };

  context('when user data is loading', () => {
    beforeEach(() => {
      interceptCredentialEmails(200, { logingov: 'user@logingov.com' });
      cy.visit(baseUrl);
    });

    it('displays a loading indicator', () => {
      cy.get('va-loading-indicator').should('be.visible');
    });
  });

  context('when user is unauthorized', () => {
    beforeEach(() => {
      interceptCredentialEmails(401, {});
      visitPage();
    });

    it('displays an unauthorized error message', () => {
      cy.get('va-alert').should('have.attr', 'status', 'error');
      cy.contains('401: Not authorized').should('be.visible');
    });
  });

  context('when user has only a Login.gov account', () => {
    beforeEach(() => {
      interceptCredentialEmails(200, { logingov: 'user@logingov.com' });
      visitPage();
    });

    it('displays the Login.gov account switch option', () => {
      cy.get('#signin-changes-title').should('be.visible');
      cy.contains(
        'You’ll need to sign in with a different account after January 31, 2025',
      ).should('be.visible');
      cy.contains('Start using your Login.gov account now').should(
        'be.visible',
      );
      cy.get('[data-testid="logingov"]').should('be.visible');
    });
  });

  context('when user has only an ID.me account', () => {
    beforeEach(() => {
      interceptCredentialEmails(200, { idme: 'user@idme.com' });
      visitPage();
    });

    it('displays the ID.me account switch option', () => {
      cy.get('#signin-changes-title').should('be.visible');
      cy.contains(
        'You’ll need to sign in with a different account after January 31, 2025',
      ).should('be.visible');
      cy.contains('Start using your ID.me account now').should('be.visible');
      cy.get('[data-testid="idme"]').should('be.visible');
    });
  });

  context('when user has both Login.gov and ID.me accounts', () => {
    beforeEach(() => {
      interceptCredentialEmails(200, {
        logingov: 'user@logingov.com',
        idme: 'user@idme.com',
      });
      visitPage();
    });

    it('displays options to use either Login.gov or ID.me account', () => {
      cy.contains('Start using your Login.gov or ID.me account now').should(
        'be.visible',
      );
      cy.get('[data-testid="logingov"]').should('be.visible');
      cy.get('[data-testid="idme"]').should('be.visible');
    });
  });

  context('when user has no Login.gov or ID.me account', () => {
    beforeEach(() => {
      interceptCredentialEmails(200, {});
      visitPage();
    });

    it('displays the create account option', () => {
      cy.get('#signin-changes-title').should('be.visible');
      cy.contains('Create a different account now').should('be.visible');
      cy.contains('Learn about why we are making changes to sign in').should(
        'be.visible',
      );
      cy.get('#button-div').within(() => {
        cy.get('[data-testid="logingov"]').should('be.visible');
        cy.get('[data-testid="idme"]').should('be.visible');
      });
    });
  });

  context('when user clicks on continue with My HealtheVet link', () => {
    beforeEach(() => {
      sessionStorage.setItem('RETURN_URL', '/return-path');
      interceptCredentialEmails(200, {});
      visitPage();
    });

    it('navigates to the return URL', () => {
      cy.get('va-link')
        .contains('Continue with your My HealtheVet account for now')
        .click();
      cy.url().should('include', '/return-path');
    });
  });
});
