import moment from 'moment';
import { MockAppointment } from '../../fixtures/MockAppointment';
import {
  mockAppointmentApi,
  mockAppointmentCreateApi,
  mockAppointmentsApi,
  mockCCProvidersApi,
  mockFacilitiesApi,
  mockFeatureToggles,
  mockGetEligibilityCC,
  mockSchedulingConfigurationApi,
  mockVamcEhrApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';
import { PRIMARY_CARE } from '../../../../utils/constants';
import { MockUser } from '../../fixtures/MockUser';
import AppointmentListPage from '../../page-objects/AppointmentList/AppointmentListPage';

describe('VAOS community care flow - Primary care', () => {
  beforeEach(() => {
    vaosSetup();

    const appt = new MockAppointment({
      id: 'mock1',
      localStartTime: moment(),
      status: 'proposed',
      serviceType: 'podiatry',
    });
    mockAppointmentApi({
      response: {
        ...appt,
      },
    });
    mockAppointmentsApi({ response: [] });
    mockAppointmentCreateApi();
    mockFacilitiesApi();
    mockFeatureToggles();
    mockVamcEhrApi();
  });

  describe('When one facility supports CC online scheduling', () => {
    beforeEach(() => {
      mockCCProvidersApi();
      mockGetEligibilityCC({ typeOfCare: 'PrimaryCare', isEligible: true });
      mockSchedulingConfigurationApi({
        facilityIds: ['983'],
        typeOfCareId: PRIMARY_CARE,
        isDirect: true,
        isRequest: true,
      });
    });

    describe('And veteran does not have a home address', () => {
      it('should submit form', () => {
        // Arrange
        const mockUser = new MockUser();

        // Act
        cy.login(mockUser);
        AppointmentListPage.visit().scheduleAppointment();

        // Assert
        cy.axeCheckBestPractice();
      });
    });
  });
});
