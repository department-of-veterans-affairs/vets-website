import { setStoredSubTask } from '@department-of-veterans-affairs/platform-forms/sub-task';

import { BASE_URL } from '../constants';
import { CONTESTABLE_ISSUES_API, ITF_API } from '../constants/apis';

import mockV2Data from './fixtures/data/maximal-test.json';
import { fetchItf, errorItf, postItf } from './995.cypress.helpers';

import { mockContestableIssues } from '../../shared/tests/cypress.helpers';
import cypressSetup from '../../shared/tests/cypress.setup';

describe('995 ITF page', () => {
  Cypress.config({ requestTimeout: 10000 });

  beforeEach(() => {
    cypressSetup();

    window.dataLayer = [];
    setStoredSubTask({ benefitType: 'compensation' });
    cy.intercept(
      'GET',
      `${CONTESTABLE_ISSUES_API}/compensation`,
      mockContestableIssues,
    ).as('getIssues');
    cy.intercept('GET', '/v0/in_progress_forms/20-0995', mockV2Data);
    cy.intercept('PUT', '/v0/in_progress_forms/20-0995', mockV2Data);

    cy.visit(BASE_URL);
    cy.wait('@features');
    cy.injectAxeThenAxeCheck();
  });

  const postItfApi = `${ITF_API}/compensation`;

  it('should show ITF found alert', () => {
    cy.intercept('GET', ITF_API, fetchItf());

    cy.findAllByText(/start your claim/i, { selector: 'a' })
      .first()
      .click();

    cy.wait('@getIssues');

    cy.get('va-alert[status="success"]')
      .should('be.visible')
      .then($el => {
        cy.wrap($el)
          .find('h2')
          .should('contain', 'You already have an Intent to File');

        cy.axeCheck();
        cy.get('va-button[continue]');
      });
  });

  it('should show ITF created alert with too old active ITF', () => {
    cy.intercept('GET', ITF_API, fetchItf({ years: -2 }));
    cy.intercept('POST', postItfApi, postItf());

    cy.findAllByText(/start your claim/i, { selector: 'a' })
      .first()
      .click();

    cy.wait('@getIssues');

    cy.get('va-alert[status="success"]')
      .should('be.visible')
      .then($el => {
        cy.wrap($el)
          .find('h2')
          .should('contain', 'You submitted an Intent to File');

        cy.axeCheck();
        cy.get('va-button[continue]');
      });
  });

  it('should show ITF created alert if current ITF has already been used', () => {
    cy.intercept('GET', ITF_API, fetchItf({ months: -6 }, 'claim_recieved'));
    cy.intercept('POST', postItfApi, postItf());

    cy.findAllByText(/start your claim/i, { selector: 'a' })
      .first()
      .click();

    cy.wait('@getIssues');

    cy.get('va-alert[status="success"]')
      .should('be.visible')
      .then($el => {
        cy.wrap($el)
          .find('h2')
          .should('contain', 'You submitted an Intent to File');

        cy.axeCheck();
        cy.get('va-button[continue]');
      });
  });

  it('should show ITF created alert if current ITF is for pensions', () => {
    cy.intercept('GET', ITF_API, fetchItf({ months: 6 }, 'active', 'pension'));
    cy.intercept('POST', postItfApi, postItf());

    cy.findAllByText(/start your claim/i, { selector: 'a' })
      .first()
      .click();

    cy.wait('@getIssues');

    cy.get('va-alert[status="success"]')
      .should('be.visible')
      .then($el => {
        cy.wrap($el)
          .find('h2')
          .should('contain', 'You submitted an Intent to File');

        cy.axeCheck();
        cy.get('va-button[continue]');
      });
  });

  it('should show we can’t confirm error alert after creation error', () => {
    cy.intercept('GET', ITF_API, fetchItf({ years: -2 }));
    cy.intercept('POST', postItfApi, errorItf());

    cy.findAllByText(/start your claim/i, { selector: 'a' })
      .first()
      .click();

    cy.wait('@getIssues');

    cy.get('va-alert[status="info"]')
      .should('be.visible')
      .then($el => {
        cy.wrap($el)
          .find('h2')
          .should('contain', 'We can’t confirm if we have an intent to file');

        cy.axeCheck();
        cy.get('va-button[continue]');
      });
  });

  it('should show we can’t confirm error alert after fetch & creation error', () => {
    cy.intercept('GET', ITF_API, errorItf());
    cy.intercept('POST', postItfApi, errorItf());

    cy.findAllByText(/start your claim/i, { selector: 'a' })
      .first()
      .click();

    cy.wait('@getIssues');

    cy.get('va-alert[status="info"]')
      .should('be.visible')
      .then($el => {
        cy.wrap($el)
          .find('h2')
          .should('contain', 'We can’t confirm if we have an intent to file');

        cy.axeCheck();
        cy.get('va-button[continue]');
      });
  });
});
