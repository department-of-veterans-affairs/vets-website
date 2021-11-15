import mockUser from 'platform/testing/e2e/mock-user';

describe('Application Status Test', () => {
  it('Achieves the correct result per URL', () => {
    cy.login();
    cy.intercept('GET', '/v0/user', mockUser);

    // src/applications/hca @department-of-veterans-affairs/vsa-caregiver-frontend @department-of-veterans-affairs/vsa-bam-1-frontend
    cy.testStatus(
      '/health-care/how-to-apply/',
      '/health-care/apply/application/resume',
    );
    cy.testStatus(
      '/health-care/eligibility',
      '/health-care/apply/application/resume',
    );

    // src/applications/burials @department-of-veterans-affairs/vsa-debt-frontend @department-of-veterans-affairs/vsa-bam-1-frontend
    cy.testStatus(
      '/burials-memorials/veterans-burial-allowance/',
      '/burials-and-memorials/application/530/resume',
    );

    // src/applications/my-education-benefits @department-of-veterans-affairs/my-education-benefits
    cy.testStatus(
      '/education/how-to-apply/',
      '/education/apply-for-education-benefits/application/1995/resume',
    );
    cy.testStatus(
      '/education/eligibility',
      '/education/apply-for-education-benefits/application/1995/resume',
    );
  });
});
