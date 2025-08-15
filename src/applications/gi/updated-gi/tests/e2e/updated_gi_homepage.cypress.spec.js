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
    // cy.injectAxeThenAxeCheck();
    cy.get('h1[data-testid="comparison-tool-title"]').should(
      'contain',
      'GI Bill® Comparison Tool',
    );
    cy.get('p[data-testid="comparison-tool-description"]').should(
      'contain',
      'Discover how your GI Bill benefits can support your education.',
    );
  });

  it('should have correct href for Schools and employers link', () => {
    // cy.injectAxeThenAxeCheck();
    cy.get('[data-testid="comparison-tool-link-action"]')
      .contains('Go to schools and employers')
      .should(
        'have.attr',
        'href',
        '/education/gi-bill-comparison-tool/schools-and-employers',
      );
  });

  it('should direct to the schools and employers search tab', () => {
    // cy.injectAxeThenAxeCheck();
    cy.contains('Go to schools and employers').click();
    cy.url().should('contain', '/schools-and-employers');
  });
  it('should have correct href for Licenses, certifications, and prep courses link', () => {
    // cy.injectAxeThenAxeCheck();
    cy.get('[data-testid="comparison-tool-link-action"]')
      .contains('Go to licenses, certifications, and prep courses')
      .should(
        'have.attr',
        'href',
        '/education/gi-bill-comparison-tool/licenses-certifications-and-prep-courses',
      );
  });

  it('should direct to the Licenses, certifications, and prep courses page', () => {
    // cy.injectAxeThenAxeCheck();
    cy.contains('Go to licenses, certifications, and prep courses').click();
    cy.url().should('contain', '/licenses-certifications-and-prep-courses');
  });

  it('should have correct href for National exams link', () => {
    // cy.injectAxeThenAxeCheck();
    cy.get('[data-testid="comparison-tool-link-action"]')
      .contains('Go to national exams')
      .should(
        'have.attr',
        'href',
        '/education/gi-bill-comparison-tool/national-exams',
      );
  });

  it('should direct to the National exams page', () => {
    // cy.injectAxeThenAxeCheck();
    cy.contains('Go to national exams').click();
    cy.url().should('contain', '/national-exams');
  });
});
