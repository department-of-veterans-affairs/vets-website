import { v2 } from '../../mocks/appointments';

import {
  makeUserObject,
  mockLocalStorage,
} from '~/applications/personalization/dashboard/tests/e2e/dashboard-e2e-helpers';

const mockUser = makeUserObject({
  isCerner: false,
  messaging: false,
  rx: false,
  facilities: [{ facilityId: '123', isCerner: false }],
  isPatient: true,
});

describe('MyVA Dashboard - Appointments', () => {
  beforeEach(() => {
    mockLocalStorage();
  });

  it('has an appointment in the next 30 days', () => {
    cy.intercept('GET', '/vaos/v2/appointments*', req => {
      const rv = v2.createAppointmentSuccess();
      req.reply(rv);
    });

    cy.login(mockUser);
    cy.visit('my-va/');

    cy.findByTestId('dashboard-section-health-care').should('exist');
    cy.findByText('Schedule and manage your appointments').should('exist');
    cy.findByText('Next appointment').should('exist');

    cy.injectAxeThenAxeCheck();
  });

  it('has appointments more than 30 days out', () => {
    cy.intercept('GET', '/vaos/v2/appointments*', req => {
      req.reply({
        data: [],
      });
    });

    cy.login(mockUser);
    cy.visit('my-va/');

    cy.findByTestId('dashboard-section-health-care').should('exist');
    cy.findByTestId('no-upcoming-appointments-text').should('exist');

    cy.injectAxeThenAxeCheck();
  });

  it('has no appointments', () => {
    cy.intercept('GET', '/vaos/v2/appointments*', req => {
      req.reply({
        data: [],
      });
    });

    cy.login(mockUser);
    cy.visit('my-va/');

    cy.findByTestId('dashboard-section-health-care').should('exist');
    cy.findByTestId('no-upcoming-appointments-text').should('exist');

    cy.injectAxeThenAxeCheck();
  });
});
