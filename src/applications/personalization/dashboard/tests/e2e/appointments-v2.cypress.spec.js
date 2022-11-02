import { mockUser } from '@@profile/tests/fixtures/users/user';
import serviceHistory from '@@profile/tests/fixtures/service-history-success.json';
import fullName from '@@profile/tests/fixtures/full-name-success.json';
import disabilityRating from '@@profile/tests/fixtures/disability-rating-success.json';
import featureFlagNames from 'platform/utilities/feature-toggles/featureFlagNames';

import moment from 'moment';
import ERROR_500 from '@@profile/tests/fixtures/500.json';
import enrollmentStatusEnrolled from '@@profile/tests/fixtures/enrollment-system/enrolled.json';
import claimsSuccess from '@@profile/tests/fixtures/claims-success';
import appealsSuccess from '@@profile/tests/fixtures/appeals-success';
import MOCK_VA_APPOINTMENTS from '../../utils/mocks/appointments/MOCK_VA_APPOINTMENTS';
import MOCK_VA_APPOINTMENTS_EMPTY from '../../utils/mocks/appointments/MOCK_VA_APPOINTMENTS_EMPTY';
import MOCK_VA_APPOINTMENTS_OVER_30_DAYS from '../../utils/mocks/appointments/MOCK_VA_APPOINTMENTS_OVER_30_DAYS';
import MOCK_CC_APPOINTMENTS from '../../utils/mocks/appointments/MOCK_CC_APPOINTMENTS';
import MOCK_CC_APPOINTMENTS_EMPTY from '../../utils/mocks/appointments/MOCK_CC_APPOINTMENTS_EMPTY';
import MOCK_CC_APPOINTMENTS_OVER_30_DAYS from '../../utils/mocks/appointments/MOCK_CC_APPOINTMENTS_OVER_30_DAYS';
import ERROR_400 from '~/applications/personalization/dashboard/utils/mocks/ERROR_400';
import PARTIAL_ERROR from '~/applications/personalization/dashboard/utils/mocks/appointments/MOCK_VA_APPOINTMENTS_PARTIAL_ERROR';
import { mockFolderResponse } from '../../utils/mocks/messaging/folder';
import MOCK_FACILITIES from '../../utils/mocks/appointments/MOCK_FACILITIES.json';
import { makeUserObject } from './dashboard-e2e-helpers';

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

const mockCCAppointmentsSuccess = () => {
  cy.intercept(CC_APPOINTMENTS_ENDPOINT, MOCK_CC_APPOINTMENTS);
};

const mockCCAppointmentsEmpty = () => {
  cy.intercept(CC_APPOINTMENTS_ENDPOINT, MOCK_CC_APPOINTMENTS_EMPTY);
};

const mockCCAppointmentsPast30Days = () => {
  cy.intercept(CC_APPOINTMENTS_ENDPOINT, MOCK_CC_APPOINTMENTS_OVER_30_DAYS);
};

const mockVAAppointmentsSuccess = () => {
  cy.intercept(VA_APPOINTMENTS_ENDPOINT, MOCK_VA_APPOINTMENTS);
};

const mockVAAppointmentsEmpty = () => {
  cy.intercept(VA_APPOINTMENTS_ENDPOINT, MOCK_VA_APPOINTMENTS_EMPTY);
};

const mockVAAppointmentsPast30Days = () => {
  cy.intercept(VA_APPOINTMENTS_ENDPOINT, MOCK_VA_APPOINTMENTS_OVER_30_DAYS);
};

const spyOnFacilitiesEndpoint = stub => {
  cy.intercept('GET', FACILITIES_ENDPOINT, () => {
    stub();
  });
};

const alertText = /We’re sorry. Something went wrong on our end and we can’t access your appointment information. Please try again later or go to the appointments tool/i;

describe('The My VA Dashboard Claims and Appeals section', () => {
  beforeEach(() => {
    cy.intercept('/v0/profile/service_history', serviceHistory);
    cy.intercept('/v0/profile/full_name', fullName);
    cy.intercept(
      '/v0/disability_compensation_form/rating_info',
      disabilityRating,
    );
    cy.intercept('/v0/evss_claims_async', claimsSuccess());
    cy.intercept('/v0/appeals', appealsSuccess());
    cy.intercept(
      '/v0/disability_compensation_form/rating_info',
      disabilityRating,
    );
    cy.intercept('/v1/facilities/va?ids=*', MOCK_FACILITIES);
  });
  describe('when the feature is hidden', () => {
    beforeEach(() => {
      cy.login(mockUser);
      cy.intercept('GET', '/v0/feature_toggles*', {
        data: {
          type: 'feature_toggles',
          features: [],
        },
      }).as('featuresA');
    });
    it('the v2 dashboard does not show up', () => {
      cy.visit('my-va/');
      cy.findByTestId('dashboard-section-health-care').should('exist');
      cy.findByTestId('dashboard-section-health-care-v2').should('not.exist');
      // make the a11y check
      cy.injectAxeThenAxeCheck();
    });
  });
  describe('when the feature is not hidden and they have VA Healthcare', () => {
    let getFacilitiesStub;
    beforeEach(() => {
      cy.login(mockUser);
      cy.intercept('GET', '/v0/feature_toggles*', {
        data: {
          type: 'feature_toggles',
          features: [
            {
              name: featureFlagNames.showMyVADashboardV2,
              value: true,
            },
          ],
        },
      }).as('featuresB');
      getFacilitiesStub = cy.stub();
    });
    context('when the next appointment is within 30 days', () => {
      it('when the next upcoming appointment is a community cares appointment', () => {
        cy.visit('my-va/');
        mockVAAppointmentsSuccess();
        mockCCAppointmentsSuccess();
        // make sure that the Health care section is shown
        cy.findByTestId('dashboard-section-health-care-v2').should('exist');

        cy.findByRole('link', { name: /manage your appointments/i }).should(
          'exist',
        );
        cy.findByRole('heading', { name: /next appointment/i }).should('exist');

        cy.findByTestId('view-manage-appointments-link-from-cta').should(
          'not.exist',
        );
        cy.findByTestId('refill-prescriptions-link-from-cta').should('exist');
        cy.findByTestId('request-travel-reimbursement-link-from-cta').should(
          'exist',
        );
        cy.findByTestId('get-medical-records-link-from-cta').should('exist');
        cy.findByTestId('view-your-messages-link-from-cta').should('exist');
        cy.findByTestId('apply-va-healthcare-link-from-cta').should(
          'not.exist',
        );

        // make the a11y check
        cy.injectAxeThenAxeCheck();
      });
    });
    context('when the next appointment is over 30 days', () => {
      it('when the next upcoming appointment is a community cares appointment', () => {
        cy.visit('my-va/');
        mockVAAppointmentsPast30Days();
        mockCCAppointmentsPast30Days();
        // make sure that the Health care section is shown
        cy.findByTestId('dashboard-section-health-care-v2').should('exist');
        cy.findByRole('link', { name: /manage your appointments/i }).should(
          'exist',
        );
        cy.findByRole('heading', { name: /next appointment/i }).should('exist');
        cy.findByTestId('view-manage-appointments-link-from-cta').should(
          'not.exist',
        );
        cy.findByTestId('refill-prescriptions-link-from-cta').should('exist');
        cy.findByTestId('request-travel-reimbursement-link-from-cta').should(
          'exist',
        );
        cy.findByTestId('get-medical-records-link-from-cta').should('exist');
        cy.findByTestId('view-your-messages-link-from-cta').should('exist');
        cy.findByTestId('apply-va-healthcare-link-from-cta').should(
          'not.exist',
        );

        // make the a11y check
        cy.injectAxeThenAxeCheck();
      });
    });
    context('when there is no appointment', () => {
      it('when the next upcoming appointment is a community cares appointment', () => {
        cy.visit('my-va/');
        mockVAAppointmentsEmpty();
        mockCCAppointmentsEmpty();
        // make sure that the Health care section is shown
        cy.findByTestId('dashboard-section-health-care-v2').should('exist');
        cy.findByTestId('no-upcoming-appointments-text-v2').should('exist');

        cy.findByTestId('view-manage-appointments-link-from-cta').should(
          'exist',
        );
        cy.findByTestId('refill-prescriptions-link-from-cta').should('exist');
        cy.findByTestId('request-travel-reimbursement-link-from-cta').should(
          'exist',
        );
        cy.findByTestId('get-medical-records-link-from-cta').should('exist');
        cy.findByTestId('view-your-messages-link-from-cta').should('exist');
        cy.findByTestId('apply-va-healthcare-link-from-cta').should(
          'not.exist',
        );

        // make the a11y check
        cy.injectAxeThenAxeCheck();
      });
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
        cy.findByTestId('view-manage-appointments-link-from-error').should(
          'exist',
        );
        cy.findByTestId('view-manage-appointments-link-from-cta').should(
          'not.exist',
        );
        cy.findByTestId('view-your-messages-link-from-cta').should('exist');
        cy.findByTestId('refill-prescriptions-link-from-cta').should('exist');
        cy.findByTestId('request-travel-reimbursement-link-from-cta').should(
          'exist',
        );
        cy.findByTestId('get-medical-records-link-from-cta').should('exist');
        cy.findByTestId('apply-va-healthcare-link-from-cta').should(
          'not.exist',
        );

        // make the a11y check
        cy.injectAxeThenAxeCheck();
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
        cy.findByTestId('view-manage-appointments-link-from-error').should(
          'exist',
        );
        cy.findByTestId('view-manage-appointments-link-from-cta').should(
          'not.exist',
        );
        cy.findByTestId('view-your-messages-link-from-cta').should('exist');
        cy.findByTestId('refill-prescriptions-link-from-cta').should('exist');
        cy.findByTestId('request-travel-reimbursement-link-from-cta').should(
          'exist',
        );
        cy.findByTestId('get-medical-records-link-from-cta').should('exist');
        cy.findByTestId('apply-va-healthcare-link-from-cta').should(
          'not.exist',
        );

        // make the a11y check
        cy.injectAxeThenAxeCheck();
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
        cy.findByTestId('view-manage-appointments-link-from-error').should(
          'exist',
        );
        cy.findByTestId('view-manage-appointments-link-from-cta').should(
          'not.exist',
        );
        cy.findByTestId('view-your-messages-link-from-cta').should('exist');
        cy.findByTestId('refill-prescriptions-link-from-cta').should('exist');
        cy.findByTestId('request-travel-reimbursement-link-from-cta').should(
          'exist',
        );
        cy.findByTestId('get-medical-records-link-from-cta').should('exist');
        cy.findByTestId('apply-va-healthcare-link-from-cta').should(
          'not.exist',
        );

        // make the a11y check
        cy.injectAxeThenAxeCheck();
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
        cy.findByTestId('view-manage-appointments-link-from-error').should(
          'exist',
        );
        cy.findByTestId('view-manage-appointments-link-from-cta').should(
          'not.exist',
        );
        cy.findByTestId('view-your-messages-link-from-cta').should('exist');
        cy.findByTestId('refill-prescriptions-link-from-cta').should('exist');
        cy.findByTestId('request-travel-reimbursement-link-from-cta').should(
          'exist',
        );
        cy.findByTestId('get-medical-records-link-from-cta').should('exist');
        cy.findByTestId('apply-va-healthcare-link-from-cta').should(
          'not.exist',
        );

        // make the a11y check
        cy.injectAxeThenAxeCheck();
      });
    });
    context('when user is has messaging and rx features', () => {
      beforeEach(() => {
        const mockUser2 = makeUserObject({
          isCerner: false,
          messaging: true,
          rx: true,
          facilities: [{ facilityId: '123', isCerner: false }],
          isPatient: true,
        });

        cy.login(mockUser2);
        cy.intercept(
          'GET',
          '/v0/health_care_applications/enrollment_status',
          enrollmentStatusEnrolled,
        );
        cy.intercept(
          'GET',
          '/v0/messaging/health/folders/0',
          mockFolderResponse,
        );
      });
      it('should show the rx CTA amd unread messages alert', () => {
        cy.visit('my-va/');
        mockVAAppointmentsEmpty();
        mockCCAppointmentsEmpty();
        cy.findByTestId('unread-messages-alert-v2').should('exist');

        cy.findByTestId('view-manage-appointments-link-from-error').should(
          'not.exist',
        );
        cy.findByTestId('view-manage-appointments-link-from-cta').should(
          'exist',
        );
        cy.findByTestId('view-your-messages-link-from-cta').should('not.exist');
        cy.findByTestId('refill-prescriptions-link-from-cta').should('exist');
        cy.findByTestId('request-travel-reimbursement-link-from-cta').should(
          'exist',
        );
        cy.findByTestId('get-medical-records-link-from-cta').should('exist');
        cy.findByTestId('apply-va-healthcare-link-from-cta').should(
          'not.exist',
        );
        cy.injectAxeThenAxeCheck();
      });
    });
    context('when user lacks messaging and rx features', () => {
      beforeEach(() => {
        const mockUser3 = makeUserObject({
          isCerner: false,
          messaging: false,
          rx: false,
          facilities: [{ facilityId: '123', isCerner: false }],
          isPatient: true,
        });

        cy.login(mockUser3);
        cy.intercept(
          'GET',
          '/v0/health_care_applications/enrollment_status',
          enrollmentStatusEnrolled,
        );
      });
      it('should show the rx and messaging CTAs', () => {
        cy.visit('my-va/');
        mockVAAppointmentsEmpty();
        mockCCAppointmentsEmpty();
        cy.findByTestId('view-manage-appointments-link-from-error').should(
          'not.exist',
        );
        cy.findByTestId('view-manage-appointments-link-from-cta').should(
          'exist',
        );
        cy.findByTestId('view-your-messages-link-from-cta').should('exist');
        cy.findByTestId('refill-prescriptions-link-from-cta').should('exist');
        cy.findByTestId('request-travel-reimbursement-link-from-cta').should(
          'exist',
        );
        cy.findByTestId('get-medical-records-link-from-cta').should('exist');
        cy.findByTestId('apply-va-healthcare-link-from-cta').should(
          'not.exist',
        );
        cy.injectAxeThenAxeCheck();
      });
    });
    describe('when the feature is not hidden and they do not have VA Healthcare', () => {
      beforeEach(() => {
        const mockUser4 = makeUserObject({
          isCerner: false,
          messaging: false,
          rx: false,
          facilities: [],
          isPatient: false,
        });
        cy.login(mockUser4);
        cy.intercept('GET', '/v0/feature_toggles*', {
          data: {
            type: 'feature_toggles',
            features: [
              {
                name: featureFlagNames.showMyVADashboardV2,
                value: true,
              },
            ],
          },
        }).as('featuresC');
      });
      it('the v2 dashboard shows up and shows no healthcare text', () => {
        cy.visit('my-va/');
        cy.findByTestId('dashboard-section-health-care').should('not.exist');
        cy.findByTestId('dashboard-section-health-care-v2').should('exist');
        cy.findByTestId('no-healthcare-text-v2').should('exist');
        cy.findByTestId('view-manage-appointments-link-from-error').should(
          'not.exist',
        );
        cy.findByTestId('view-manage-appointments-link-from-cta').should(
          'not.exist',
        );
        cy.findByTestId('view-your-messages-link-from-cta').should('not.exist');
        cy.findByTestId('refill-prescriptions-link-from-cta').should(
          'not.exist',
        );
        cy.findByTestId('request-travel-reimbursement-link-from-cta').should(
          'not.exist',
        );
        cy.findByTestId('get-medical-records-link-from-cta').should(
          'not.exist',
        );
        cy.findByTestId('apply-va-healthcare-link-from-cta').should('exist');
        // make the a11y check
        cy.injectAxeThenAxeCheck();
      });
    });
  });
});
