describe('22-10282 Edu form', () => {
  const startApplication = () => {
    cy.get('[class="schemaform-start-button"]')
      .last()
      .click();
  };
  const checkErrorMessage = errorId => {
    cy.get(errorId).should('exist');
  };
  const checkAccredited = facilityCode => {
    startApplication();
    cy.get('[name="root_institutionName"]')
      .should('exist')
      .first()
      .type('test', { force: true });
    cy.get('[name="root_facilityCode"]')
      .should('exist')
      .first()
      .type(facilityCode, { force: true });
    cy.get('[name="root_termStartDateMonth"]')
      .should('exist')
      .select('January', { force: true });
    cy.get('[name="root_termStartDateDay"]')
      .should('exist')
      .type('1', { force: true });
    cy.get('[name="root_termStartDateYear"]')
      .should('exist')
      .type('2024', { force: true });
    cy.get('[class="usa-button-primary"]').click({ force: true });
  };
  beforeEach(() => {
    cy.visit('/education/apply-for-education-benefits/application/10216/');
  });
  it('should show form title', () => {
    cy.injectAxeThenAxeCheck();
    startApplication();
    cy.get('[id="nav-form-header"]').should('exist');
  });

  it('should show errors if fields are empty', () => {
    cy.injectAxeThenAxeCheck();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(100);
    startApplication();
    cy.get('[class="usa-button-primary"]')
      .should('exist')
      .click({ force: true });
    checkErrorMessage(
      'va-text-input[error="Please enter the name of your institution"]',
    );
    checkErrorMessage('va-text-input[error="Please enter your facility code"]');
  });
  it('should show errors if facility code is less than 8 digits', () => {
    cy.injectAxeThenAxeCheck();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(100);
    startApplication();
    cy.get('[name="root_facilityCode"]')
      .should('exist')
      .first()
      .type('1234567');
    cy.get('[class="usa-button-primary"]').click({ force: true });
    checkErrorMessage(
      'va-text-input[error="Please enter a valid 8-digit facility code"]',
    );
  });
  it('should navigate to additional form if school is not accredited', () => {
    cy.injectAxeThenAxeCheck();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(100);
    checkAccredited('09101909');
    cy.get('[id="additional-form-needed-alert"]').should(
      'contain',
      'Your school facility code indicates the school is not accredited. In addition to completing VA Form 22-10216, you’ll also need to complete and submit VA Form 22-10215. You will be directed to that form after completing this one.',
    );
  });
  it('should navigate to next page if school is accredited', () => {
    cy.injectAxeThenAxeCheck();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(100);
    checkAccredited('31850932');
  });
});
