/* eslint-disable @department-of-veterans-affairs/axe-check-required */
// the standard 4138-ss.cypress.spec.js already axe-checks everything
import { TITLE, SUBTITLE } from '../../config/constants';
import manifest from '../../manifest.json';
import featureToggles from './fixtures/mocks/featureToggles.json';
import userUnauthed from './fixtures/mocks/user.json';
import { pagePathIsCorrect } from './e2eHelpers';

// Skip in CI
const testSuite = Cypress.env('CI') ? describe.skip : describe;

testSuite('SS 21-4138', () => {
  Cypress.config({
    defaultCommandTimeout: 10000,
    delay: 20,
    waitForAnimations: true,
  });

  const userLOA3 = {
    ...userUnauthed,
    data: {
      ...userUnauthed.data,
      attributes: {
        ...userUnauthed.data.attributes,
        login: {
          currentlyLoggedIn: true,
        },
        profile: {
          ...userUnauthed.data.attributes.profile,
          loa: {
            current: 3,
          },
        },
      },
    },
  };
  const userLOA2 = {
    ...userUnauthed,
    data: {
      ...userUnauthed.data,
      attributes: {
        ...userUnauthed.data.attributes,
        login: {
          currentlyLoggedIn: true,
        },
        profile: {
          ...userUnauthed.data.attributes.profile,
          loa: {
            current: 2,
          },
        },
      },
    },
  };

  beforeEach(() => {
    cy.intercept('/v0/feature_toggles*', featureToggles);
    cy.intercept('/data/cms/vamc-ehr.json', {});
    cy.visit('/');
  });

  describe('Introduction page', () => {
    it('displays correct title & subtitle', () => {
      cy.visit(`${manifest.rootUrl}`);
      cy.findByTestId('form-title').should('contain', TITLE);
      cy.findByTestId('form-subtitle').should('contain', SUBTITLE);
    });

    describe('Unauthenticated', () => {
      it('hides unauth’ed start-link', () => {
        cy.contains(/^start*without signing in$/i, { selector: 'a' }).should(
          'not.exist',
        );
      });
      // Cypress can't test the actual Sign in to start button because
      // sign-in iframe is not visible to Cypress.
    });

    describe('Authenticated LOA3', () => {
      beforeEach(() => {
        // Cypress must sign-in first, then visit the form.
        // Doesn't support ID.me sign-in iframe/redirects.
        cy.intercept('/v0/user', userLOA3);
        cy.login(userLOA3);
        cy.visit(`${manifest.rootUrl}`);
        pagePathIsCorrect('introduction');
      });

      it('hides verify-ID alert and shows auth’ed SIP alert', () => {
        cy.findByTestId('verifyIdAlert').should('not.exist');
      });

      it('shows auth’ed SIP-alert', () => {
        cy.contains('Since you’re signed in', {
          selector: 'va-alert[status=info]',
        }).should('exist');
      });
    });

    describe('Authenticated LOA2', () => {
      beforeEach(() => {
        // Cypress must sign-in first, then visit the form.
        // Doesn't support ID.me sign-in iframe/redirects.
        cy.intercept('/v0/user', userLOA2);
        cy.login(userLOA2);
        cy.visit(`${manifest.rootUrl}/introduction`);
        pagePathIsCorrect('introduction');
      });

      it('shows verify-ID alert', () => {
        cy.findByTestId('verifyIdAlert').should('exist');
      });

      it('hides auth’ed SIP-alert', () => {
        cy.contains('Since you’re signed in', {
          selector: 'va-alert[status=info]',
        }).should('not.exist');
      });

      it('hides start-link', () => {
        cy.contains(/^start*$/i, { selector: 'a' }).should('not.exist');
      });
    });
  });
});
