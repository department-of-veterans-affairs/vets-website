import vamcEhr from '../../fixtures/vamc-ehr.json';
import featureToggles from '../../fixtures/feature-toggles.json';

describe('Medications Landing Page', () => {
  beforeEach(() => {
    cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcEhr).as('vamcEhr');
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles).as(
      'featureToggles',
    );
    // const redirectUrl = 'https://**.va.gov/mhv-portal**/**';
    // cy.intercept('GET', redirectUrl, '').as('mhvRedirect');
  });

  it('visits Medications landing Page', () => {
    cy.login();
    cy.visit('my-health/about-medications/');

    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
});
