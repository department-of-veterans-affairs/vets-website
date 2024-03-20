import legacyAppeal from './fixtures/mocks/legacy-appeal.json';
import backendStatuses from './fixtures/mocks/backend-statuses.json';

beforeEach(() => {
  cy.intercept('GET', '/v0/feature_toggles*', {
    data: {
      features: [
        { name: 'cst_include_ddl_boa_letters', value: true },
        { name: 'claim_letters_access', value: true },
      ],
    },
  });
  cy.intercept('GET', '/v0/backend_statuses*', backendStatuses);
  cy.intercept('GET', '/v0/appeals', legacyAppeal);
  cy.login();
});

describe('Appeals page test', () => {
  it('should show issue not found - C30837', () => {
    cy.visit('/track-claims/appeals/10/status');

    cy.title().should('eq', 'Track Claims | Veterans Affairs');
    cy.get('h1').should('contain', 'Sorry, we couldn’t find that appeal.');

    cy.injectAxeThenAxeCheck();
  });

  it('should show appropriate status information - C30838', () => {
    cy.visit('/track-claims/appeals/12/status');

    cy.get('h1').should('contain', 'Appeal received August 2017');
    cy.get('#tabv2status[aria-current="page"]').should('be.visible');

    cy.get('.view-events-button')
      .shadow()
      .find('button')
      .should('contain', 'Reveal past events')
      .click();

    cy.get('#appeal-timeline li:nth-of-type(4)').should(
      'contain',
      'sent you a Statement of the Case',
    );

    cy.get('.alerts-list li').should('contain', 'Return VA Form 9 by');
    cy.injectAxeThenAxeCheck();
  });

  it('should show issue statuses - C30839', () => {
    cy.visit('/track-claims/appeals/12/detail');

    cy.get('h1').should('contain', 'Appeal received August 2017');
    cy.get('h2').should('contain', 'Issues');

    // first accordion auto-expanded
    cy.get('va-accordion-item[open="true"]').should('be.visible');
    cy.get('va-accordion-item[open="true"] li').should('have.length', 3);
    cy.injectAxeThenAxeCheck();

    // expand second accordion
    cy.get('va-accordion-item[open="false"]')
      .shadow()
      .then(accordion => {
        cy.wrap(accordion.find('button')).click({ force: true });
      });
    cy.get('va-accordion-item[open="true"]').should('be.visible');
    cy.get('va-accordion-item[open="true"] li').should('have.length', 4);
    cy.axeCheck();
  });

  it('should show DDL link for decided appeal ', () => {
    cy.visit('/track-claims/appeals/13/status');

    cy.get('h1').should('contain', 'Appeal received August 2017');

    cy.get('a.ddl-link').should('be.visible');
    cy.get('a.ddl-link')
      .invoke('attr', 'href')
      .should('eq', '/track-claims/your-claim-letters');

    cy.get('a.ddl-link').click();

    cy.get('h1').should('contain', 'Your VA claim letters');
  });

  it('should show DDL link for post-decided appeal ', () => {
    cy.visit('/track-claims/appeals/14/status');

    cy.get('h1').should('contain', 'Appeal received August 2017');

    cy.get('a.ddl-link').should('be.visible');
    cy.get('a.ddl-link')
      .invoke('attr', 'href')
      .should('eq', '/track-claims/your-claim-letters');

    cy.get('a.ddl-link').click();

    cy.get('h1').should('contain', 'Your VA claim letters');
  });
});
