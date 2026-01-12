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
      cy.get('ul.submissions__list li:nth-of-type(5)').should(
        'contain',
        'Karlsson, Rachel',
      );
      cy.get('ul.submissions__list li:nth-of-type(5)').should(
        'contain',
        'Processing error',
      );
      cy.get('ul.submissions__list li:nth-of-type(6)').should(
        'contain',
        'Ryan, Logan',
      );
      cy.get('ul.submissions__list li:nth-of-type(6)').should(
        'contain',
        'VA Form 21-0966 packet',
      );
      cy.get('ul.submissions__list li:nth-of-type(6)').should(
        'contain',
        'Benefit: Disability Compensation (VA Form 21-526EZ)',
      );
      cy.get('ul.submissions__list li:nth-of-type(6)').should(
        'contain',
        'Expires in 365 days',
      );
      cy.get('ul.submissions__list li:nth-of-type(7)').should(
        'contain',
        'Andrews, David',
      );
      cy.get('ul.submissions__list li:nth-of-type(7)').should(
        'contain',
        'VA Form 21-0966 packet',
      );
      cy.get('ul.submissions__list li:nth-of-type(7)').should(
        'contain',
        'Benefit: Pension (VA Form 21P-527EZ)',
      );
      cy.get('ul.submissions__list li:nth-of-type(7)').should(
        'contain',
        'Expires in 60 days',
      );
      cy.get('ul.submissions__list li:nth-of-type(7)')
        .find('va-icon')
        .should('exist');
      cy.get('ul.submissions__list li:nth-of-type(8)').should(
        'contain',
        'Dobson, Aaron',
      );
      cy.get('ul.submissions__list li:nth-of-type(8)').should(
        'contain',
        'VA Form 21-0966 packet',
      );
      cy.get('ul.submissions__list li:nth-of-type(8)').should(
        'contain',
        'Benefit: Survivors pension and/or dependency and indemnity compensation (DIC) (VA Form 21P-534 or VA Form 21P-534EZ)',
      );
      cy.get('ul.submissions__list li:nth-of-type(8)').should(
        'contain',
        'Expires in 70 days',
      );
      cy.get('ul.submissions__list li:nth-of-type(8)')
        .find('va-icon')
        .should('not.exist');
    });

    it('Allows the user to visit 686c form from Submissions', () => {
      cy.injectAxeThenAxeCheck();
      cy.get(
        "va-link-action[href='/representative/representative-form-upload/submit-va-form-21-686c']",
      ).click();
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
        },
        SUBMISSIONS_PAGE,
      );
    });

    it('Allows the user to visit 526ez form from Submissions', () => {
      cy.injectAxeThenAxeCheck();
      cy.get(
        "va-link-action[href='/representative/representative-form-upload/submit-va-form-21-526EZ']",
      ).click();
    });
  });
});
