import { mockGETEndpoints } from '@@profile/tests/e2e/helpers';
import powerOfAttorney from '@@profile/tests/fixtures/power-of-attorney-success.json';
import { PROFILE_PATHS } from '@@profile/constants';
import { loa3User72 } from '@@profile/mocks/endpoints/user';

describe('Accredited representative', () => {
  beforeEach(() => {
    const otherEndpoints = [
      '/v0/profile/ch33_bank_accounts',
      '/v0/profile/direct_deposits/disability_compensations',
      '/v0/profile/full_name',
      '/v0/disability_compensation_form/rating_info',
      '/v0/profile/service_history',
      '/v0/profile/personal_information',
    ];
    mockGETEndpoints(otherEndpoints, 200, {});

    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        features: [
          { name: 'representative_status_enable_v2_features', value: true },
        ],
      },
    });
    cy.intercept(
      'GET',
      '/representative-management/v0/power-of-attorney',
      powerOfAttorney,
    );
  });

  it('links from the hub page', () => {
    cy.login(loa3User72);
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);
    cy.get('a[href$="/profile/accredited-representative"]').should('exist');
    cy.injectAxeThenAxeCheck();
  });

  it('links from the nav', () => {
    cy.login(loa3User72);
    cy.visit(PROFILE_PATHS.ACCREDITED_REPRESENTATIVE);
    cy.get('a[href$="/profile/accredited-representative"]').should('exist');
    cy.injectAxeThenAxeCheck();
  });
});
