describe('go bill CT new homepage', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles?*', {
      data: {
        type: 'feature_toggles',
        features: [{ name: 'is_updated_gi', value: true }],
      },
    });
    cy.intercept('GET', '/data/cms/vamc-ehr.json', { statusCode: 200 });
    cy.visit('education/gi-bill-comparison-tool/');
  });

  it('should show the new homepage', () => {
    cy.injectAxeThenAxeCheck();
    cy.get('h1[data-testid="comparison-tool-title"]').should(
      'contain',
      'GI Bill® Comparison Tool',
    );
    cy.get('p[data-testid="comparison-tool-description"]').should(
      'contain',
      'Discover how your GI Bill benefits can support your education.',
    );
  });

  it('should direct to the schools and employers search tabs', () => {
    cy.injectAxeThenAxeCheck();
    cy.contains('.comparison-tool-link', 'Schools and employers').click();
    cy.url().should('contain', '/schools-and-employers');
  });
  it('should direct to the Licenses and Certifications page', () => {
    cy.injectAxeThenAxeCheck();
    cy.contains('.comparison-tool-link', 'Licenses and certifications').click();
    cy.url().should('contain', '/licenses-certifications-and-prep-courses');
  });

  it('should direct to the National Exams page', () => {
    cy.injectAxeThenAxeCheck();
    cy.contains('.comparison-tool-link', 'National Exams').click();
    cy.url().should('contain', '/national-exams');
  });
});
