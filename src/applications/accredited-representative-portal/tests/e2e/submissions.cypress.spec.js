import user from './fixtures/mocks/user.json';
import { setFeatureToggles } from './intercepts/feature-toggles';
import { setSubmissions } from './intercepts/submissions';

const vamcUser = {
  data: {
    nodeQuery: {
      count: 0,
      entities: [],
    },
  },
};

const SUBMISSIONS_PAGE =
  '/representative/submissions?sortOrder=desc&sortBy=created_at&pageSize=20&pageNumber=1';

Cypress.Commands.add('loginArpUser', () => {
  cy.intercept('GET', '**/accredited_representative_portal/v0/user', {
    statusCode: 200,
    body: user,
  }).as('fetchUser');
});

const setUpInterceptsAndVisit = (featureToggles, url) => {
  cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcUser).as('vamcUser');
  setFeatureToggles(
    featureToggles || {
      isAppEnabled: true,
      isInPilot: true,
      isSubmissionsEnabled: true,
    },
  );
  cy.visit(url || '/representative');
  cy.injectAxeThenAxeCheck();
};

describe('Accredited Representative Portal', () => {
  describe('App feature toggle is enabled, but submissions feature toggle is not enabled', () => {
    beforeEach(() => {
      setUpInterceptsAndVisit(
        {
          isAppEnabled: true,
          isInPilot: true,
          isSubmissionsEnabled: false,
        },
        SUBMISSIONS_PAGE,
      );

      it('redirects to representative home', () => {
        cy.injectAxeThenAxeCheck();
        cy.location('pathname').should('eq', '/representative');
      });
    });
  });

  describe('App feature toggle and Pilot feature toggle are enabled', () => {
    beforeEach(() => {
      setSubmissions();
      cy.loginArpUser();
      setUpInterceptsAndVisit(null, SUBMISSIONS_PAGE);
    });

    it('Allows the user to see the Submissions page when visiting directly', () => {
      cy.injectAxeThenAxeCheck();
      cy.contains('Recent Submissions').should('be.visible');
    });

    it('Shows data mock fetched from backend', () => {
      cy.injectAxeThenAxeCheck();
      cy.get('ul.submissions__list li:nth-of-type(1)').should(
        'contain',
        'Snyder, John',
      );
      cy.get('ul.submissions__list li:nth-of-type(1)').should(
        'contain',
        'Awaiting receipt',
      );
      cy.get('ul.submissions__list li:nth-of-type(2)').should(
        'contain',
        'Anderson, Montgomery',
      );
      cy.get('ul.submissions__list li:nth-of-type(2)').should(
        'contain',
        'Received April 15, 2025',
      );
      cy.get('ul.submissions__list li:nth-of-type(3)').should(
        'contain',
        'Fahey, Isias',
      );
      cy.get('ul.submissions__list li:nth-of-type(3)').should(
        'contain',
        'Processing error',
      );
      cy.get('ul.submissions__list li:nth-of-type(4)').should(
        'contain',
        'Davis, Brooks',
      );
      cy.get('ul.submissions__list li:nth-of-type(4)').should(
        'contain',
        'Processing error',
      );
    });

    it('Allows the user to visit 686c form from Submissions', () => {
      cy.injectAxeThenAxeCheck();
      cy.get(
        "va-link-action[href='/representative/representative-form-upload/21-686c']",
      ).click();

      cy.location('pathname').should(
        'eq',
        '/representative/representative-form-upload/21-686c/introduction',
      );
    });

    context('526ez feature flag is off', () => {
      it('does not allow the user to visit 526ez form from Submissions', () => {
        cy.injectAxeThenAxeCheck();
        cy.get('body').should('not.have.text', '526EZ');
      });
    });
  });

  context('526ez feature flag is on', () => {
    beforeEach(() => {
      setSubmissions();
      cy.loginArpUser();
      setUpInterceptsAndVisit(
        {
          isAppEnabled: true,
          isInPilot: true,
          isSubmissionsEnabled: true,
          is526ezEnabled: true,
        },
        SUBMISSIONS_PAGE,
      );
    });

    it('Allows the user to visit 526ez form from Submissions', () => {
      cy.injectAxeThenAxeCheck();
      cy.get(
        "va-link-action[href='/representative/representative-form-upload/21-526EZ']",
      ).click();

      cy.location('pathname').should(
        'eq',
        '/representative/representative-form-upload/21-526ez/introduction',
      );
    });
  });
});
