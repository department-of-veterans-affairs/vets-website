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

const CLAIMANT_DETAILS_SUBMISSIONS_PAGE =
  '/representative/find-claimant/submission-history/f87aaa2f-37da-4dc7-ae20-bf36aedbbc85?sort=newest';

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
      isClaimantDetailsEnabled: true,
    },
  );
  cy.visit(url || '/representative');
  cy.injectAxeThenAxeCheck();
};

describe('Claimant details submissions history', () => {
  beforeEach(() => {
    setSubmissions();
    cy.loginArpUser();
    setUpInterceptsAndVisit(null, CLAIMANT_DETAILS_SUBMISSIONS_PAGE);
  });

  it('Allows the user to see the Submissions page when visiting directly', () => {
    cy.injectAxeThenAxeCheck();
    cy.contains('Submission history').should('be.visible');
    cy.contains('Santiago, Brooke').should('be.visible');
  });

  it('Shows data mock fetched from backend', () => {
    cy.injectAxeThenAxeCheck();
    cy.get('ul.submissions__list li:nth-of-type(1)').should(
      'contain',
      'e3bd5925-6902-4b94-acbc-49b554ffcec1',
    );
    cy.get('ul.submissions__list li:nth-of-type(1)').should(
      'contain',
      'Awaiting receipt',
    );
    cy.get('ul.submissions__list li:nth-of-type(2)').should(
      'contain',
      '58d1c6a3-f970-48cb-bc92-65403e2a0c16',
    );
    cy.get('ul.submissions__list li:nth-of-type(2)').should(
      'contain',
      'Received April 15, 2025',
    );
    cy.get('ul.submissions__list li:nth-of-type(3)').should(
      'contain',
      'f344d484-8b4b-4e81-93dc-5f6b6ef52bac',
    );
    cy.get('ul.submissions__list li:nth-of-type(3)').should(
      'contain',
      'Processing error',
    );
    cy.get('ul.submissions__list li:nth-of-type(4)').should(
      'contain',
      'b4d7ae1d-6aa9-4231-930c-e3b3e73f0e31',
    );
    cy.get('ul.submissions__list li:nth-of-type(4)').should(
      'contain',
      'Processing error',
    );
    cy.get('ul.submissions__list li:nth-of-type(5)').should(
      'contain',
      'e3bd5925-6902-4b94-acbc-49b554ffce22',
    );
    cy.get('ul.submissions__list li:nth-of-type(5)').should(
      'contain',
      'Processing error',
    );
    cy.get('ul.submissions__list li:nth-of-type(6)').should(
      'contain',
      'VA Form 21-0966 packet',
    );
    cy.get('ul.submissions__list li:nth-of-type(6)').should(
      'contain',
      'Expires in 365 days',
    );
    cy.get('ul.submissions__list li:nth-of-type(7)').should(
      'contain',
      'VA Form 21-0966 packet',
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
      'VA Form 21-0966 packet',
    );
    cy.get('ul.submissions__list li:nth-of-type(8)').should(
      'contain',
      'Expires in 70 days',
    );
    cy.get('ul.submissions__list li:nth-of-type(8)')
      .find('va-icon')
      .should('not.exist');
  });

  it('Allows the user to visit Submissions', () => {
    cy.injectAxeThenAxeCheck();
    cy.get("va-link-action[href='/representative/submissions']").click({
      force: true,
    });
  });
});
