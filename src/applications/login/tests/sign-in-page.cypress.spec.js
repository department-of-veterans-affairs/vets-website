describe('Unified Sign-in Page', () => {
  context(
    `when 'mhv_credential_button_disabled: true' feature toggle is enabled`,
    () => {
      beforeEach(() => {
        cy.intercept('GET', '/v0/feature_toggles*', {
          data: {
            type: 'feature_toggles',
            features: [
              {
                name: 'mhvCredentialButtonDisabled',
                value: true,
              },
            ],
          },
        }).as('featureToggles');
        cy.intercept('GET', '/data/cms/vamc-ehr.json', { statusCode: 200 });
      });

      it(`display correct sign-in content`, () => {
        cy.visit('/sign-in/?oauth=false');
        cy.wait('@featureToggles');
        cy.get('body').should('be.visible');
        cy.get('#mhvH3').should('not.exist');
        cy.get('#dslogonH3').should('be.visible');
        cy.injectAxeThenAxeCheck();
      });
    },
  );

  context(
    `when 'mhv_credential_button_disabled: false' feature toggle is enabled`,
    () => {
      beforeEach(() => {
        cy.intercept('GET', '/v0/feature_toggles*', {
          data: {
            features: [
              {
                name: 'mhvCredentialButtonDisabled',
                value: false,
              },
            ],
          },
        }).as('featureToggles');
        cy.intercept('GET', '/data/cms/vamc-ehr.json', { statusCode: 200 });
      });

      it(`display correct sign-in content`, () => {
        cy.visit('/sign-in/?oauth=false');
        cy.wait('@featureToggles');
        cy.get('body').should('be.visible');
        cy.get('#mhvH3').should('exist');
        cy.get('#dslogonH3').should('be.visible');
        cy.injectAxeThenAxeCheck();
      });
    },
  );
});
