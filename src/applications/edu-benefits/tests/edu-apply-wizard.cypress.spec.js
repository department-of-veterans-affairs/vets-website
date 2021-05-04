describe('Education Application Wizard', () => {
  it('Goes through the education wizard', () => {
    // Ensure education apply-wizard page renders.
    // Open education apply wizard
    cy.visit(`/education/how-to-apply/`)
      .get('body', { timeout: 10000 })
      .should('be.visible');
    cy.injectAxeThenAxeCheck();

    cy.get('.wizard-button')
      .click()
      .get('label[for="newBenefit-0"]', { timeout: 10000 })
      .should('be.visible');
    cy.axeCheck();

    // Create a new application
    cy.get('input[id="newBenefit-0"]')
      .click()
      .get('label[for="serviceBenefitBasedOn-0"]', { timeout: 10000 })
      .should('be.visible');

    // Select veteran
    cy.get('input[id="serviceBenefitBasedOn-0"]')
      .click()
      .get('label[for="nationalCallToService-0"]', { timeout: 10000 })
      .should('be.visible');

    // Select national call to service
    cy.get('#nationalCallToService-0')
      .click()
      .get('#apply-now-link')
      .should('be.visible');

    cy.get('#apply-now-link')
      .should('have.attr', 'href')
      .and(
        'contain',
        '/education/apply-for-education-benefits/application/1990N',
      );

    cy.get('main .usa-alert-warning').should('be.visible');

    // Select non-veteran
    cy.get('#serviceBenefitBasedOn-1').click();

    cy.get('#apply-now-link').should('not.exist');

    cy.get('main .usa-alert-warning').should('not.exist');

    cy.get('label[for="sponsorDeceasedDisabledMIA-0"]', {
      timeout: 1000,
    }).should('be.visible');

    cy.injectAxeThenAxeCheck();

    // Select dependent
    cy.get('#sponsorDeceasedDisabledMIA-0')
      .click()
      .get('#apply-now-link')
      .should('be.visible');

    cy.get('#apply-now-link')
      .should('have.attr', 'href')
      .and(
        'contain',
        '/education/apply-for-education-benefits/application/5490',
      );

    // Select non-dependant
    cy.get('#sponsorDeceasedDisabledMIA-1').click();
    cy.get('#apply-now-link').should('not.exist');

    cy.get('#sponsorDeceasedDisabledMIA-1')
      .get('label[for="sponsorTransferredBenefits-0"]', { timeout: 1000 })
      .should('be.visible');
    cy.axeCheck();

    // Select transfer
    cy.get('#sponsorTransferredBenefits-0')
      .click()
      .get('#apply-now-link', { timeout: 1000 })
      .should('be.visible');

    cy.get('#apply-now-link')
      .should('have.attr', 'href')
      .and(
        'contain',
        '/education/apply-for-education-benefits/application/1990E',
      );
    // Select non-transfer
    cy.get('#sponsorTransferredBenefits-1')
      .click()
      .get('#apply-now-link', { timeout: 1000 })
      .should('be.visible');

    cy.get('#apply-now-link')
      .should('have.attr', 'href')
      .and(
        'contain',
        '/education/apply-for-education-benefits/application/1990E',
      );
    // Update an existing application
    cy.get('#newBenefit-1')
      .click()
      .get('label[for="transferredEduBenefits-0"]', { timeout: 1000 })
      .should('be.visible');
    cy.get('#apply-now-link').should('not.exist');
    // Select dependent
    cy.get('#transferredEduBenefits-2')
      .click()
      .get('#apply-now-link', { timeout: 1000 })
      .should('be.visible');
    cy.get('main .usa-alert-warning').should('not.exist');

    cy.get('#apply-now-link')
      .should('have.attr', 'href')
      .and(
        'contain',
        '/education/apply-for-education-benefits/application/5495',
      );
    cy.get('#transferredEduBenefits-0')
      .click()
      .get('#apply-now-link', { timeout: 1000 })
      .should('be.visible');

    cy.get('#apply-now-link')
      .should('have.attr', 'href')
      .and(
        'contain',
        '/education/apply-for-education-benefits/application/1995',
      );
    cy.get('#apply-now-link').click({ timeout: 1000 });

    cy.url().should(
      'contain',
      '/education/apply-for-education-benefits/application/1995/introduction',
    );
  });
});
