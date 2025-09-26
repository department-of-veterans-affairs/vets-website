import appeals from './fixtures/mocks/appeals.json';
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
  cy.intercept('GET', '/v0/appeals', appeals);
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
    cy.get('.appeal-past-events li').should('have.length.at.least', 3);
    cy.get('.appeal-past-events li:nth-of-type(1)').should(
      'contain',
      'sent you a Statement of the Case',
    );

    cy.get('.alerts-list li').should('contain', 'Return VA Form 9 by');
    cy.injectAxe();
    cy.checkA11y(null, null, violations => {
      if (violations.length) {
        violations.forEach(v => {
          cy.log(`A11y violation: ${v.id}`);
          cy.log(`  Description: ${v.description}`);
          cy.log(`  Impact: ${v.impact}`);
          cy.log(`  Help: ${v.helpUrl}`);
        });
      }

      // This line is still useful to make sure we don't silently ignore unexpected issues
      expect(violations.length, 'a11y violations').to.equal(0);
    });
    cy.injectAxeThenAxeCheck();
  });

  it('should show issue statuses - C30839', () => {
    cy.visit('/track-claims/appeals/12/detail');

    cy.get('h1').should('contain', 'Appeal received August 2017');
    cy.get('h2').should('contain', 'Issues');

    // first accordion auto-expanded
    cy.get('va-accordion-item[open]:not([open="false"])').should('be.visible');
    cy.get('va-accordion-item[open]:not([open="false"]) li').should(
      'have.length',
      3,
    );
    cy.injectAxeThenAxeCheck();

    // expand second accordion
    cy.get('va-accordion-item[open="false"]')
      .shadow()
      .then(accordion => {
        cy.wrap(accordion.find('button')).click({ force: true });
      });
    cy.get('va-accordion-item[open]:not([open="false"])').should('be.visible');
    cy.get('va-accordion-item[open]:not([open="false"]) li').should(
      'have.length',
      4,
    );
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

    cy.get('h1').should('contain', 'Your VA claim and appeal letters');
    cy.injectAxeThenAxeCheck();
  });

  it('should show DDL link for post-decided appeal ', () => {
    cy.visit('/track-claims/appeals/14/status');

    cy.get('h1').should('contain', 'Appeal received August 2017');

    cy.get('a.ddl-link').should('be.visible');
    cy.get('a.ddl-link')
      .invoke('attr', 'href')
      .should('eq', '/track-claims/your-claim-letters');

    cy.get('a.ddl-link').click();

    cy.get('h1').should('contain', 'Your VA claim and appeal letters');
    cy.injectAxeThenAxeCheck();
  });

  context('when the appeal type is appeal', () => {
    it('should show no description items for issues without descriptions with correct appeal type', () => {
      cy.visit('/track-claims/appeals/15/detail');

      cy.get('h1').should('contain', 'Appeal received August 2017');
      cy.get('h2').should('contain', 'Issues');

      // Check that the "Currently on appeal" section shows a list item for 2 issues without a description
      cy.get('va-accordion-item[open]:not([open="false"])').should(
        'be.visible',
      );
      cy.get('va-accordion-item[open]:not([open="false"]) li').should(
        'contain',
        "We're unable to show 2 issues on appeal",
      );

      // Expand the "Closed" section
      cy.get('va-accordion-item[open="false"]')
        .shadow()
        .then(accordion => {
          cy.wrap(accordion.find('button')).click({ force: true });
        });

      // Check that the "Closed" section displays a list item for 1 issue without a description
      cy.get('va-accordion-item[open]:not([open="false"])').should(
        'be.visible',
      );
      cy.get('va-accordion-item[open]:not([open="false"]) li').should(
        'contain',
        "We're unable to show 1 issue on appeal",
      );

      cy.injectAxeThenAxeCheck();
    });
  });

  context('when the appeal type is not appeal or legacy appeal', () => {
    it('should show no description items for issues without descriptions with correct appeal type', () => {
      cy.visit('/track-claims/appeals/SC3239/detail');

      cy.get('h1').should(
        'contain',
        'Supplemental claim received January 2023',
      );
      cy.get('h2').should('contain', 'Issues');
      cy.get('va-accordion-item[open]:not([open="false"])').should(
        'be.visible',
      );
      cy.get('va-accordion-item[open]:not([open="false"]) li').should(
        'contain',
        "We're unable to show 1 issue on your Supplemental Claim",
      );

      cy.injectAxeThenAxeCheck();
    });
  });
});
