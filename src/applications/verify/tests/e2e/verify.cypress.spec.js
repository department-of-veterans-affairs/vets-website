import manifest from '../../manifest.json';

const createMockUser = ({ verified, serviceName }) => ({
  data: {
    attributes: {
      profile: {
        loa: {
          current: 3,
          highest: 3,
        },
        verified,
        signIn: {
          serviceName,
        },
      },
      vaProfile: {},
    },
  },
});

describe('Verify App', () => {
  it('should show both ID.me and Login.gov buttons for unauthenticated users', () => {
    cy.visit(manifest.rootUrl);
    cy.injectAxeThenAxeCheck();

    cy.findByRole('heading', {
      level: 1,
      name: /Verify your identity/i,
    }).should('exist');
    cy.get('.idme-verify-button').should('exist');
    cy.get('.logingov-verify-button').should('exist');
  });

  it('should show only ID.me verify button for user signed in with ID.me but not verified', () => {
    const mockUser = createMockUser({
      verified: false,
      serviceName: 'idme',
    });

    cy.login(mockUser);
    cy.visit(manifest.rootUrl);
    cy.injectAxeThenAxeCheck();

    cy.findByRole('heading', {
      level: 1,
      name: /Verify your identity/i,
    }).should('exist');
    cy.get('.idme-verify-button').should('exist');
    cy.get('.logingov-verify-button').should('not.exist');
  });

  it('should show only Login.gov verify button for user signed in with Login.gov but not verified', () => {
    const mockUser = createMockUser({
      verified: false,
      serviceName: 'logingov',
    });

    cy.login(mockUser);
    cy.visit(manifest.rootUrl);
    cy.injectAxeThenAxeCheck();

    cy.findByRole('heading', {
      level: 1,
      name: /Verify your identity/i,
    }).should('exist');
    cy.get('.logingov-verify-button').should('exist');
    cy.get('.idme-verify-button').should('not.exist');
  });

  it('should have an acr value of "urn:acr.va.gov:verified-facial-match-required" when the ial2 enforcement feature flag is enabled and the Login.gov verify button is clicked', () => {
    cy.intercept('GET', '/v0/feature_toggles*', {
      statusCode: 200,
      body: {
        data: {
          features: [
            {
              name: 'identity_logingov_ial2_enforcement',
              value: true,
            },
          ],
        },
      },
    }).as('featureToggles');

    cy.intercept('GET', '/v0/sign_in/authorize*', req => {
      expect(req.query.acr).to.equal(
        'urn:acr.va.gov:verified-facial-match-required',
      );
    }).as('verifyRequest');

    cy.visit(manifest.rootUrl);
    cy.injectAxeThenAxeCheck();

    cy.get('.logingov-verify-button').should('exist');
    cy.get('.logingov-verify-button').click();

    cy.wait('@verifyRequest');
  });

  it('should have an acr value of "ial2" when the ial2 enforcement feature flag is disabled and the Login.gov verify button is clicked', () => {
    cy.intercept('GET', '/v0/feature_toggles*', {
      statusCode: 200,
      body: {
        data: {
          features: [
            {
              name: 'identity_logingov_ial2_enforcement',
              value: false,
            },
          ],
        },
      },
    }).as('featureToggles');

    cy.intercept('GET', '/v0/sign_in/authorize*', req => {
      expect(req.query.acr).to.equal('ial2');
    }).as('verifyRequest');

    cy.visit(manifest.rootUrl);
    cy.injectAxeThenAxeCheck();

    cy.get('.logingov-verify-button').should('exist');
    cy.get('.logingov-verify-button').click();

    cy.wait('@verifyRequest');
  });

  it('should have an acr value of "loa3" when the ID.me verify button is clicked', () => {
    cy.intercept('GET', '/v0/sign_in/authorize*', req => {
      expect(req.query.acr).to.equal('loa3');
    }).as('verifyRequest');

    cy.visit(manifest.rootUrl);
    cy.injectAxeThenAxeCheck();

    cy.get('.idme-verify-button').should('exist');
    cy.get('.idme-verify-button').click();

    cy.wait('@verifyRequest');
  });

  it('should show success message for a verified ID.me user', () => {
    const mockUser = createMockUser({
      verified: true,
      serviceName: 'idme',
    });

    cy.login(mockUser);
    cy.visit(manifest.rootUrl);
    cy.injectAxeThenAxeCheck();

    cy.findByRole('heading', {
      level: 1,
      name: /Verify your identity/i,
    }).should('exist');
    cy.get('va-alert[status="success"]').should('exist');
    cy.findByText(/You’re verified/i).should('exist');
  });

  it('should show success message for a verified Login.gov user', () => {
    const mockUser = createMockUser({
      verified: true,
      serviceName: 'logingov',
    });

    cy.login(mockUser);
    cy.visit(manifest.rootUrl);
    cy.injectAxeThenAxeCheck();

    cy.findByRole('heading', {
      level: 1,
      name: /Verify your identity/i,
    }).should('exist');
    cy.get('va-alert[status="success"]').should('exist');
    cy.findByText(/You’re verified/i).should('exist');
  });
});
