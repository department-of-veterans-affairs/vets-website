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
