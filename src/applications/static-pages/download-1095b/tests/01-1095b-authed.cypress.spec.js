import Timeouts from 'platform/testing/e2e/timeouts';
import { form } from './e2e/fixtures/mocks/mocks';
import mockUsers from '../mocks/endpoints/user';
import { generateFeatureToggles } from '../mocks/endpoints/feature-toggles';

describe('Authed 1095-B Form Download PDF', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      '/v0/feature_toggles*',
      generateFeatureToggles({
        showDigitalForm1095b: true,
      }),
    ).as('featureToggles');
    cy.intercept('GET', 'v0/form1095_bs/available_forms', form).as('form');
    cy.intercept('GET', 'v0/form1095_bs/download_pdf/*', {
      fixture:
        'applications/static-pages/download-1095b/tests/e2e/fixtures/1095BTestFixture.pdf',
      statusCode: 200,
    });
    cy.intercept('GET', 'v0/form1095_bs/download_txt/*', {
      fixture:
        'applications/static-pages/download-1095b/tests/e2e/fixtures/1095BTestFixture.txt',
      statusCode: 200,
    });
    cy.intercept('GET', '/data/cms/vamc-ehr.json', { statusCode: 200 }).as(
      'vamcUser',
    );

    cy.login(mockUsers.loa3User);
    cy.visit('/health-care/download-1095b/');
    cy.wait(['@featureToggles', '@form', '@vamcUser']);
  });

  it('downloads the 1095-B PDF form', () => {
    cy.get('body').should('be.visible');
    cy.injectAxeThenAxeCheck();
    cy.title().should('contain', '1095B Download | Veterans Affairs');
    cy.get('.usa-content', {
      timeout: Timeouts.slow,
    }).should('be.visible');

    cy.axeCheck();

    cy.get('#pdf-download-link').should('be.visible');
    cy.get('#txt-download-link').should('be.visible');

    cy.get('#pdf-download-link')
      .click()
      .then(() => {
        cy.readFile(`${Cypress.config('downloadsFolder')}/1095B-2021.pdf`);
      });

    cy.get('#txt-download-link')
      .click()
      .then(() => {
        cy.readFile(`${Cypress.config('downloadsFolder')}/1095B-2021.txt`);
      });

    cy.axeCheck();
  });

  it('displays an error message when the PDF download fails', () => {
    cy.intercept('GET', 'v0/form1095_bs/download_pdf/*', {
      statusCode: 500,
      body: { error: 'An error occurred' },
    });
    cy.injectAxeThenAxeCheck();

    cy.get('#pdf-download-link').click();
    cy.focused().should(
      'contain',
      'We’re sorry. Something went wrong when we tried to download your form.',
    );
  });
});
