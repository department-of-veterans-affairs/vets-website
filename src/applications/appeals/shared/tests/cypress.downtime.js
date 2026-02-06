import { add, formatISO } from 'date-fns';
import { setStoredSubTask } from '@department-of-veterans-affairs/platform-forms/sub-task';
import Timeouts from 'platform/testing/e2e/timeouts';
import { ITF_API } from '../../995/constants/apis';
import * as h from './cypress.helpers';
import cypressSetup from './cypress.setup';
import mockUser from './fixtures/mocks/user.json';
import inProgressMock from './fixtures/mocks/get-in-progress';

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

      cy.intercept('GET', `${contestableApi}/compensation`, {
        data: h.fixDecisionDates(data.contestedIssues, { unselected: true }),
      }).as('getIssues');

      cy.intercept('PUT', `/v0/in_progress_forms/${formId}`, mockInProgress);

      cy.intercept(
        'GET',
        `/v0/in_progress_forms/${formId}`,
        inProgressMock({ data }),
      );

      cy.intercept('GET', ITF_API, h.fetchItf()); // 995 only
      cy.intercept('GET', '/data/cms/vamc-ehr.json', {});
      cy.intercept('GET', '/v0/feature_toggles*', {});

      cy.visit(baseUrl);
      cy.injectAxeThenAxeCheck();
    });

    it('Shows the introduction page as normal', () => {
      cypressSetup();
      cy.intercept('GET', '/v0/maintenance_windows', { data: [] });
      cy.reload();

      h.verifyElement('va-process-list');
      h.verifyElement(h.START_LINK);
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

      h.verifyElementDoesNotExist(
        '[data-status="downtimeApproaching"] #downtime-approaching-modal',
        { timeout: Timeouts.slow },
      ).should('not.exist');

      h.verifyElement(h.START_LINK);
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
        .and('contain', 'last saved');
      cy.injectAxeThenAxeCheck();

      cy.get(h.CONTINUE_APP_LINK).click();

      // go to review & submit page
      cy.location('pathname')
        .should('contain', `/review-and-submit`)
        .then(() => {
          if (formId === '20-0995') {
            h.getPastItf(cy);
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
