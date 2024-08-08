import { add, formatISO } from 'date-fns';
import { setStoredSubTask } from '@department-of-veterans-affairs/platform-forms/sub-task';

import Timeouts from 'platform/testing/e2e/timeouts';

import { getPastItf, fetchItf } from '../../995/tests/995.cypress.helpers';

import cypressSetup from './cypress.setup';
import mockUser from './fixtures/mocks/user.json';
import inProgressMock from './fixtures/mocks/get-in-progress';
import { fixDecisionDates } from './cypress.helpers';

const now = new Date();
const beforeNow = formatISO(add(now, { minutes: -1 }));
const withinHour = formatISO(add(now, { minutes: 59 }));
const endTime = formatISO(add(now, { hours: 6 }));

const downtimeTesting = ({
  baseUrl,
  contestableApi,
  formId,
  inProgressVersion,
  data,
  mockInProgress,
}) => {
  describe('Downtime Notification Test', () => {
    beforeEach(() => {
      setStoredSubTask({ benefitType: 'compensation' }); // HLR & SC

      cy.intercept('GET', `${contestableApi}compensation`, {
        data: fixDecisionDates(data.contestedIssues, { unselected: true }),
      }).as('getIssues');
      cy.intercept('PUT', `/v0/in_progress_forms/${formId}`, mockInProgress);
      cy.intercept(
        'GET',
        `/v0/in_progress_forms/${formId}`,
        inProgressMock({ data }),
      );
      cy.intercept('GET', '/v0/intent_to_file', fetchItf()); // 995 only

      cy.visit(baseUrl);
      cy.injectAxeThenAxeCheck();
    });

    it('Shows the introduction page as normal', () => {
      cypressSetup();
      cy.intercept('GET', '/v0/maintenance_windows', { data: [] });
      cy.reload();
      cy.get('va-process-list');
      cy.get('.vads-c-action-link--green');
      cy.injectAxeThenAxeCheck();
    });

    it('Does not display a downtime is approaching modal', () => {
      // Save in progress maintenance periods allow you to go through the form
      // if you already have a form in progress, but replaces the submit button
      // with a maintenance alert
      cypressSetup();
      cy.intercept('GET', '/v0/maintenance_windows', {
        data: [
          {
            id: '139',
            type: 'maintenance_windows',
            attributes: {
              externalService: 'appeals',
              description: 'My description',
              startTime: withinHour,
              endTime,
            },
          },
        ],
      });
      cy.reload();
      cy.get(
        '[data-status="downtimeApproaching"] #downtime-approaching-modal',
        { timeout: Timeouts.slow },
      ).should('not.exist');
      cy.get('.vads-c-action-link--green');

      cy.injectAxeThenAxeCheck();
    });

    it('Correctly shows that the application is down for maintenance', () => {
      cypressSetup();
      cy.intercept('GET', '/v0/maintenance_windows', {
        data: [
          {
            id: '139',
            type: 'maintenance_windows',
            attributes: {
              externalService: 'appeals',
              description: 'My description',
              startTime: beforeNow,
              endTime,
            },
          },
        ],
      });
      cy.reload();
      cy.get('va-alert [slot="headline"]', { timeout: Timeouts.slow })
        .should('be.visible')
        .and('contain', 'is down for maintenance');

      cy.injectAxeThenAxeCheck();
    });

    it('Allows continuing application when submit services are down for maintenance', () => {
      const user = {
        ...mockUser,
        data: {
          id: '',
          type: 'users_scaffolds',
          attributes: {
            ...mockUser.data.attributes,
            // set in progress returnUrl to review and submit page
            inProgressForms: [
              {
                form: formId,
                metadata: inProgressMock({ version: inProgressVersion })
                  .metadata,
                lastUpdated: 1715357232,
              },
            ],
          },
        },
      };
      cypressSetup({ user });

      cy.intercept('GET', '/v0/maintenance_windows', {
        data: [
          {
            id: '139',
            type: 'maintenance_windows',
            attributes: {
              externalService: 'appeals',
              description: 'My description',
              startTime: beforeNow,
              endTime,
            },
          },
        ],
      });

      cy.reload();

      cy.get('va-alert [slot="headline"]', { timeout: Timeouts.slow })
        .should('be.visible')
        .and('contain', 'is in progress');
      cy.injectAxeThenAxeCheck();

      cy.get('va-button[data-testid="continue-your-application"]').click();

      // go to review & submit page
      cy.location('pathname')
        .should('contain', `/review-and-submit`)
        .then(() => {
          if (formId === '20-0995') {
            getPastItf(cy);
          }
        });

      cy.get('va-alert [slot="headline"]', { timeout: Timeouts.slow })
        .should('be.visible')
        .and('contain', 'is down for maintenance');

      cy.injectAxeThenAxeCheck();
    });
  });
};

export default downtimeTesting;
