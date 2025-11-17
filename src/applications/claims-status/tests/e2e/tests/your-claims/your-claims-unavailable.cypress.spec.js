import appeals from '../../fixtures/mocks/appeals.json';
import claimsList from '../../fixtures/mocks/claims-list.json';

describe('Your claims unavailable,', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        features: [],
      },
    });
    cy.intercept('GET', '/data/cms/vamc-ehr.json', {});
    cy.intercept('GET', '/v0/education_benefits_claims/stem_claim_status', {
      data: {},
    });

    /* eslint-disable camelcase */
    cy.login({
      data: {
        id: '',
        type: 'users_scaffolds',
        attributes: {
          account: {
            account_uuid: '777bfa-2cbb-98fc-zz-9231fbac',
          },
          profile: {
            sign_in: {
              service_name: 'dslogon',
              account_type: '2',
              ssoe: false,
            },
            email: 'fake@fake.com',
            loa: { current: 3 },
            first_name: 'Jane',
            middle_name: '',
            last_name: 'Doe',
            gender: 'F',
            birth_date: '1985-01-01',
            verified: true,
            authn_context: 'dslogon',
            multifactor: true,
            zip: '21076',
            last_signed_in: '2022-05-18T22:02:02.188Z',
          },
          veteran_status: {
            status: 'OK',
            is_veteran: true,
            served_in_military: true,
          },
          in_progress_forms: [{ form: '10-10EZ', metadata: {} }],
          prefills_available: ['21-526EZ'],
          services: [
            'facilities',
            'hca',
            'edu-benefits',
            'evss-claims',
            'lighthouse',
            'appeals-status', // ← Added appeals-status!
            'form526',
            'user-profile',
            'health-records',
            'rx',
            'messaging',
          ],
          va_profile: {
            status: 'OK',
            birth_date: '19850101',
            family_name: 'Doe',
            gender: 'F',
            given_names: ['Jane', 'E'],
            active_status: 'active',
            facilities: [
              { facility_id: '983', isCerner: false },
              { facility_id: '984', isCerner: false },
            ],
            is_cerner_patient: false,
            va_patient: true,
            mhv_account_state: 'OK',
          },
        },
      },
      meta: { errors: null },
    });
    // eslint-disable-next-line no-console
  });

  it('should display claims and appeals unavailable alert', () => {
    cy.intercept('GET', '/v0/benefits_claims', {
      statusCode: 500,
    });
    cy.intercept('GET', '/v0/appeals', {
      statusCode: 500,
    });

    cy.visit('/track-claims');
    cy.injectAxe();

    cy.findByRole('heading', {
      name: 'Claim and Appeal status is unavailable',
    });
    cy.findByText(
      'VA.gov is having trouble loading claims and appeals information at this time. Check back again in an hour.',
    );

    cy.axeCheck();
  });

  it('should display claims unavailable alert', () => {
    cy.intercept('GET', '/v0/benefits_claims', {
      statusCode: 500,
    });
    cy.intercept('GET', '/v0/appeals', appeals);

    cy.visit('/track-claims');
    cy.injectAxe();

    cy.findByRole('heading', {
      name: 'Claim status is unavailable',
    });
    cy.findByText(
      'VA.gov is having trouble loading claims information at this time. Check back again in an hour. Note: You are still able to review appeals information.',
    );

    cy.axeCheck();
  });

  it('should display appeals unavailable alert', () => {
    cy.intercept('GET', '/v0/benefits_claims', claimsList);
    cy.intercept('GET', '/v0/appeals', {
      statusCode: 500,
    });

    cy.visit('/track-claims');
    cy.injectAxe();

    cy.findByRole('heading', {
      name: 'Appeal status is unavailable',
    });
    cy.findByText(
      'VA.gov is having trouble loading appeals information at this time. Check back again in an hour. Note: You are still able to review claims information.',
    );

    cy.axeCheck();
  });
});
