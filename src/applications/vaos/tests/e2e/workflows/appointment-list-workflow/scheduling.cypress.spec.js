import MockUser from '../../../fixtures/MockUser';
import AppointmentListPageObject from '../../page-objects/AppointmentList/AppointmentListPageObject';
import TypeOfCarePageObject from '../../page-objects/TypeOfCarePageObject';
import UrgentCareInformationPageObject from '../../page-objects/UrgentCareInformationPageObject';
import {
  mockAppointmentsGetApi,
  mockFeatureToggles,
  mockVamcEhrApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';

describe('VAOS schedule flow', () => {
  beforeEach(() => {
    vaosSetup();
    mockAppointmentsGetApi({ response: [] });
    mockFeatureToggles({
      vaOnlineSchedulingImmediateCareAlert: true,
    });
    mockVamcEhrApi();
  });

  it('should display urgent care information page before starting scheduling workflow', () => {
    // Arrange
    const mockUser = new MockUser({ addressLine1: '123 Main St.' });

    // Act
    cy.login(mockUser);

    AppointmentListPageObject.visit().scheduleAppointment(
      'Schedule a new appointment',
    );

    UrgentCareInformationPageObject.assertUrl()
      .clickButton({
        label: /Connect with the Veterans Crisis Line/i,
        shadow: true,
      })
      .assertCrisisModal()
      .clickButton({ ariaLabel: 'Close this modal' })
      .clickLink({ name: /Start scheduling an appointment/i });

    TypeOfCarePageObject.assertUrl();

    // Assert
    cy.axeCheckBestPractice();
  });
});
