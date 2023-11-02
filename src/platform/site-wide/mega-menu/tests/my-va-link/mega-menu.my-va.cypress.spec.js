import manifest from 'applications/mhv/landing-page/manifest.json';
import { CSP_IDS } from '@department-of-veterans-affairs/platform-user/authentication/constants';
import { makeMockContactInfo } from '~/platform/user/profile/vap-svc/util/local-vapsvc';
import featureFlagNames from '~/platform/utilities/feature-toggles/featureFlagNames';

const mockUser = {
  data: {
    id: '',
    type: 'users_scaffolds',
    attributes: {
      services: [
        'appeals-status',
        'edu-benefits',
        'evss_common_client',
        'evss-claims',
        'facilities',
        'hca',
        'id-card',
        'identity-proofed',
        'mhv-accounts',
        'user-profile',
        'vet360',
      ],
      account: { accountUuid: 'c049d895-ecdf-40a4-ac0f-7947a06ea0c2' },
      profile: {
        email: 'vets.gov.user+36@gmail.com',
        firstName: 'WESLEY',
        middleName: 'WATSON',
        lastName: 'FORD',
        birthDate: '1986-05-06',
        gender: 'M',
        zip: '21122-6706',
        lastSignedIn: '2020-07-21T00:04:51.589Z',
        loa: { current: 3, highest: 3 },
        multifactor: true,
        verified: true,
        signIn: {
          serviceName: CSP_IDS.ID_ME,
          accountType: 'N/A',
          ssoe: true,
        },
        authnContext: 'http://idmanagement.gov/ns/assurance/loa/3',
        claims: {},
      },
      vaProfile: {
        status: 'OK',
        birthDate: '19860506',
        familyName: 'Ford',
        gender: 'M',
        givenNames: ['Wesley', 'Watson'],
        isCernerPatient: false,
        facilities: [{ facilityId: '983', isCerner: false }],
        vaPatient: true,
        mhvAccountState: 'OK',
      },
      veteranStatus: {
        status: 'OK',
        isVeteran: true,
        servedInMilitary: true,
      },
      inProgressForms: [],
      prefillsAvailable: ['21-686C'],
      vet360ContactInformation: makeMockContactInfo(),
    },
  },
  meta: { errors: null },
};

describe(manifest.appName, () => {
  context('unauthenticated', () => {
    it('shows the My VA link when enabled', () => {
      cy.intercept('GET', '/v0/feature_toggles*', {
        data: {
          type: 'feature_toggles',
          features: [
            {
              name: featureFlagNames.myVaShowHeaderLink,
              value: true,
            },
          ],
        },
      });
      cy.visit('/');
      cy.injectAxeThenAxeCheck();

      cy.get('[data-e2e-id^="my-va-"]').should('exist');
    });

    it('hides the My VA link when disabled', () => {
      cy.intercept('GET', '/v0/feature_toggles*', {
        data: {
          type: 'feature_toggles',
          features: [
            {
              name: featureFlagNames.myVaShowHeaderLink,
              value: false,
            },
          ],
        },
      });
      cy.visit('/');
      cy.injectAxeThenAxeCheck();

      cy.get('[data-e2e-id^="my-va-"]').should('not.exist');
    });
  });

  context('authenticated', () => {
    it('shows the My VA link', () => {
      cy.login(mockUser);
      cy.visit('/');
      cy.injectAxeThenAxeCheck();

      cy.get('[data-e2e-id^="my-va-"]').should('exist');
    });
  });
});
