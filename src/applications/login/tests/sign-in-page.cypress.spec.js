describe('Unified Sign-in Page', () => {
  beforeEach(() => {
    cy.intercept('GET', '/data/cms/vamc-ehr.json', { statusCode: 200 });
  });

  it(`display correct sign-in content`, () => {
    cy.visit('/sign-in/?oauth=false');
    cy.get('body').should('be.visible');
    cy.get('H1').contains('Sign in or create an account');
    cy.get('H2').contains('Help and support');
    cy.get('a').contains('Learn about creating an ID.me or Login.gov account');
    cy.injectAxeThenAxeCheck();
  });
});

describe('Prod Test Account Page', () => {
  beforeEach(() => {
    cy.intercept('GET', '/feature_toggles*', { statusCode: 200 });
    cy.intercept('GET', '/data/cms/vamc-ehr.json', { statusCode: 200 });
    cy.intercept('POST', '/test_account_user_email', { statusCode: 200 });
  });

  const vaButton = `va-button[text="Access test account"]`;
  const vaTextInput = `va-text-input[name="Your VA or Oracle Health email"]`;
  const vaInput = `input[name="Your VA or Oracle Health email"]`;

  it(`display correct sign-in content`, () => {
    cy.visit('/sign-in/access-production-test-account');
    cy.get('body').should('be.visible');
    cy.get('#signin-signup-modal-title').contains(
      'Access production test account',
    );
    cy.get(vaButton).should('have.length', 1);
    cy.injectAxeThenAxeCheck();
  });

  it('should not allow any generic email addresses', () => {
    cy.visit('/sign-in/access-production-test-account');
    cy.get('body').should('be.visible');
    cy.get(vaTextInput)
      .shadow()
      .find(vaInput)
      .type('bob@example.com', { force: true });
    cy.get(vaButton).should('have.attr', 'disabled');
    cy.injectAxeThenAxeCheck();
  });
});

describe('MHV Exemption Page', () => {
  beforeEach(() => {
    cy.intercept('GET', '/feature_toggles/*', { statusCode: 200 });
    cy.intercept('GET', '/data/cms/vamc-ehr.json', { statusCode: 200 });
  });

  it(`display correct sign-in content`, () => {
    cy.visit('/sign-in/mhv');
    cy.get('body').should('be.visible');
    cy.get('#signin-signup-modal-title').contains(
      'Access the My HealtheVet sign-in option',
    );
    cy.get('va-button[text="My HealtheVet"]').should('have.length', 1);
    cy.get('va-link-action').should('have.length', 1);
    cy.injectAxeThenAxeCheck();
  });
});
