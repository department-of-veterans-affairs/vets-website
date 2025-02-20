import set from 'lodash/set';
import { form, featureToggles, defaultUser } from './e2e/fixtures/mocks/mocks';

describe('Unverified authenticated', () => {
  const mockedUnverifiedUser = set(
    defaultUser,
    'data.attributes.profile.loa.current',
    1,
  );

  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles?*', featureToggles).as(
      'featureToggles',
    );
    cy.intercept('GET', '/v0/form1095_bs/available_forms', form).as('form');
    cy.intercept('GET', '/v0/form1095_bs/download_pdf/*', {
      fixture:
        'applications/static-pages/download-1095b/tests/e2e/fixtures/1095BTestFixture.pdf',
      statusCode: 200,
    });
    cy.intercept('GET', '/v0/form1095_bs/download_txt/*', {
      fixture:
        'applications/static-pages/download-1095b/tests/e2e/fixtures/1095BTestFixture.txt',
      statusCode: 200,
    });

    cy.login(mockedUnverifiedUser);
    cy.visit('/health-care/download-1095b/');
    cy.wait(['@featureToggles', '@form']);
  });

  it('displays the verify alerts', () => {
    cy.get('body').should('be.visible');
    cy.injectAxeThenAxeCheck();
    cy.title().should('contain', '1095B Download | Veterans Affairs');
    cy.get('.usa-content').should('be.visible');

    cy.axeCheck();

    cy.get('va-alert-sign-in').should('be.visible');

    cy.axeCheck();
  });
});
