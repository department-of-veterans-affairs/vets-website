import moment from 'moment';
import Timeouts from 'platform/testing/e2e/timeouts';
import FacilityHelpers from './helpers/facility-helpers-cypress';

Cypress.Commands.add('createDowntimeNotificationIntercept', data => {
  cy.intercept('GET', '/v0/maintenance_windows', { data });
});

const beforeNow = moment()
  .subtract(1, 'minute')
  .toISOString();
const withinHour = moment()
  .add(1, 'hour')
  .subtract(1, 'minute')
  .toISOString();
const endTime = moment()
  .add(6, 'hour')
  .toISOString();

const selectors = {
  app: '.facility-locator',
  statusDown: '[slot="headline"]',
  statusDownApproachingModal:
    '[data-status="downtimeApproaching"] #downtime-approaching-modal',
};

describe('Downtime Notification Test', () => {
  beforeEach(() => {
    cy.visit('/find-locations');
    FacilityHelpers.initApplicationMock();
  });
  it('Shows the facility locator as normal', () => {
    cy.createDowntimeNotificationIntercept([]);
    cy.reload();
    cy.get(selectors.app, { timeout: Timeouts.slow }).should('be.visible');
  });
  it('Correctly displays that downtime is approaching', () => {
    cy.createDowntimeNotificationIntercept([
      {
        id: '139',
        type: 'maintenance_windows',
        attributes: {
          externalService: 'arcgis',
          description: 'My description',
          startTime: withinHour,
          endTime,
        },
      },
    ]);
    cy.reload();
    cy.get(selectors.statusDownApproachingModal, {
      timeout: Timeouts.slow,
    }).should('be.visible');
  });
  it('Correctly shows that the tool is down for maintenance', () => {
    cy.createDowntimeNotificationIntercept([
      {
        id: '139',
        type: 'maintenance_windows',
        attributes: {
          externalService: 'arcgis',
          description: 'My description',
          startTime: beforeNow,
          endTime,
        },
      },
    ]);
    cy.reload();
    cy.get(selectors.statusDown, { timeout: Timeouts.slow })
      .should('be.visible')
      .and('contain', 'This tool is down for maintenance');
    cy.createDowntimeNotificationIntercept([]);
  });
});
