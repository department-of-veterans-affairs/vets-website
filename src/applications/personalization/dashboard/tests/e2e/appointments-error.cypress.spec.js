import moment from 'moment';
import { mockFeatureToggles } from './helpers';
import { mockUser } from '@@profile/tests/fixtures/users/user';

import ERROR_400 from '~/applications/personalization/dashboard/utils/mocks/ERROR_400';
import ERROR_500 from '@@profile/tests/fixtures/500.json';
import PARTIAL_ERROR from '~/applications/personalization/dashboard/utils/mocks/appointments/MOCK_VA_APPOINTMENTS_PARTIAL_ERROR';

import { mockLocalStorage } from '~/applications/personalization/dashboard/tests/e2e/dashboard-e2e-helpers';
import {
  upcomingCCAppointment,
  upcomingVAAppointment,
} from '~/applications/personalization/dashboard/utils/appointments';

const alertText = /Something went wrong on our end, and we can’t access your appointment information/i;
const startOfToday = () =>
  moment()
    .startOf('day')
    .toISOString();

// Maximum number of days you can schedule an appointment in advance in VAOS
const endDate = () =>
  moment()
    .add(395, 'days')
    .startOf('day')
    .toISOString();

const VA_APPOINTMENTS_ENDPOINT = `vaos/v0/appointments?start_date=${startOfToday()}&end_date=${endDate()}&type=va`;
const CC_APPOINTMENTS_ENDPOINT = `vaos/v0/appointments?start_date=${startOfToday()}&end_date=${endDate()}&type=cc`;
const FACILITIES_ENDPOINT = `v1/facilities/va?ids=*`;

const mockVAAppointmentsSuccess = () => {
  cy.intercept('GET', VA_APPOINTMENTS_ENDPOINT, upcomingVAAppointment);
};
const mockCCAppointmentsSuccess = () => {
  cy.intercept('GET', CC_APPOINTMENTS_ENDPOINT, upcomingCCAppointment);
};

const spyOnFacilitiesEndpoint = stub => {
  cy.intercept('GET', FACILITIES_ENDPOINT, () => {
    stub();
  });
};

describe('MyVA Dashboard - Appointments', () => {
  let getFacilitiesStub;
  beforeEach(() => {
    mockLocalStorage();
    cy.login(mockUser);
    mockFeatureToggles();
    getFacilitiesStub = cy.stub();
  });
  context('when there is a 500 error fetching VA appointments', () => {
    it('should show the appointments error alert and never call the facilities API', () => {
      cy.intercept('GET', VA_APPOINTMENTS_ENDPOINT, {
        statusCode: 500,
        body: ERROR_500,
      });
      mockCCAppointmentsSuccess();
      spyOnFacilitiesEndpoint(getFacilitiesStub);

      cy.visit('my-va/');
      cy.findByText(alertText).should('exist');
      cy.should(() => {
        expect(getFacilitiesStub).not.to.be.called;
      });
    });
  });

  context('when there is a 400 error fetching VA appointments', () => {
    it('should show the appointments error alert and never call the facilities API', () => {
      cy.intercept('GET', VA_APPOINTMENTS_ENDPOINT, {
        statusCode: 400,
        body: ERROR_400,
      });
      mockCCAppointmentsSuccess();
      spyOnFacilitiesEndpoint(getFacilitiesStub);

      cy.visit('my-va/');
      cy.findByText(alertText).should('exist');
      cy.should(() => {
        expect(getFacilitiesStub).not.to.be.called;
      });
    });
  });

  context('when there is a 400 error fetching CC appointments', () => {
    it('should show the appointments error alert and never call the facilities API', () => {
      mockVAAppointmentsSuccess();
      cy.intercept('GET', CC_APPOINTMENTS_ENDPOINT, {
        statusCode: 400,
        body: ERROR_400,
      });
      spyOnFacilitiesEndpoint(getFacilitiesStub);

      cy.visit('my-va/');
      cy.findByText(alertText).should('exist');
      cy.should(() => {
        expect(getFacilitiesStub).not.to.be.called;
      });
    });
  });

  context('when there is a partial error fetching VA appointments', () => {
    it('should show the appointments error alert and never call the facilities API', () => {
      cy.intercept('GET', VA_APPOINTMENTS_ENDPOINT, PARTIAL_ERROR);
      mockCCAppointmentsSuccess();
      spyOnFacilitiesEndpoint(getFacilitiesStub);

      cy.visit('my-va/');
      cy.findByText(alertText).should('exist');
      cy.should(() => {
        expect(getFacilitiesStub).not.to.be.called;
      });
    });
  });

  context('when there is an error fetching facilities', () => {
    it('should show the appointments error alert', () => {
      mockVAAppointmentsSuccess();
      mockCCAppointmentsSuccess();
      cy.intercept('GET', FACILITIES_ENDPOINT, {
        statusCode: 400,
        body: ERROR_400,
      });

      cy.visit('my-va/');
      cy.findByText(alertText).should('exist');
    });
  });
});
