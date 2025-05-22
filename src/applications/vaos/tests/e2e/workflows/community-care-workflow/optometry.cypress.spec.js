// @ts-check
import { getTypeOfCareById } from '../../../../utils/appointment';
import { APPOINTMENT_STATUS, OPTOMETRY_ID } from '../../../../utils/constants';
import MockAppointmentResponse from '../../../fixtures/MockAppointmentResponse';
import MockEligibilityResponse from '../../../fixtures/MockEligibilityResponse';
import MockFacilityResponse from '../../../fixtures/MockFacilityResponse';
import MockProviderResponse from '../../../fixtures/MockProviderResponse';
import MockUser from '../../../fixtures/MockUser';
import AppointmentListPageObject from '../../page-objects/AppointmentList/AppointmentListPageObject';
import ClosestCityStatePageObject from '../../page-objects/ClosestCityStatePageObject';
import CommunityCarePreferencesPageObject from '../../page-objects/CommunityCarePreferencesPageObject';
import ConfirmationPageObject from '../../page-objects/ConfirmationPageObject';
import ContactInfoPageObject from '../../page-objects/ContactInfoPageObject';
import DateTimeRequestPageObject from '../../page-objects/DateTimeRequestPageObject';
import PreferredLanguagePageObject from '../../page-objects/PreferredLanguagePageObject';
import ReasonForAppointmentPageObject from '../../page-objects/ReasonForAppointmentPageObject';
import ReviewPageObject from '../../page-objects/ReviewPageObject';
import TypeOfCarePageObject from '../../page-objects/TypeOfCarePageObject';
import TypeOfEyeCarePageObject from '../../page-objects/TypeOfEyeCarePageObject';
import TypeOfFacilityPageObject from '../../page-objects/TypeOfFacilityPageObject';
import TypeOfVisitPageObject from '../../page-objects/TypeOfVisitPageObject';
import VAFacilityPageObject from '../../page-objects/VAFacilityPageObject';
import {
  mockAppointmentCreateApi,
  mockAppointmentGetApi,
  mockAppointmentsGetApi,
  mockCCProvidersApi,
  mockEligibilityApi,
  mockEligibilityCCApi,
  mockFacilitiesApi,
  mockFeatureToggles,
  mockSchedulingConfigurationApi,
  mockVamcEhrApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';

const typeOfCareId = getTypeOfCareById(OPTOMETRY_ID).idV2;
const { cceType } = getTypeOfCareById(OPTOMETRY_ID);

describe('VAOS direct schedule flow - Optometry', () => {
  beforeEach(() => {
    vaosSetup();

    const response = new MockAppointmentResponse({
      id: 'mock1',
      localStartTime: new Date(),
      status: APPOINTMENT_STATUS.proposed,
    }).setTypeOfCare(typeOfCareId);
    mockAppointmentGetApi({
      response,
    });
    mockAppointmentCreateApi({ response });
    mockAppointmentsGetApi({ response: [] });
    mockFeatureToggles();
    mockVamcEhrApi();
  });

  describe('When veteran is not CC eligible', () => {
    describe('And one facility supports online scheduling', () => {
      beforeEach(() => {
        const mockEligibilityResponse = new MockEligibilityResponse({
          facilityId: '983',
          typeOfCareId,
          isEligible: true,
        });

        mockFacilitiesApi({
          response: MockFacilityResponse.createResponses({
            facilityIds: ['983'],
          }),
        });
        mockEligibilityApi({ response: mockEligibilityResponse });
        mockEligibilityCCApi({ cceType, isEligible: false });
        mockSchedulingConfigurationApi({
          facilityIds: ['983'],
          typeOfCareId,
          isDirect: false,
          isRequest: true,
        });
      });

      describe('And veteran does have a home address', () => {
        it('should submit form', () => {
          // Arrange
          const mockUser = new MockUser({ addressLine1: '123 Main St.' });

          // Act
          cy.login(mockUser);

          AppointmentListPageObject.visit().scheduleAppointment();

          TypeOfCarePageObject.assertUrl()
            .assertAddressAlert({ exist: false })
            .selectTypeOfCare(/Eye care/i)
            .clickNextButton();

          TypeOfEyeCarePageObject.assertUrl()
            .selectTypeOfEyeCare(/Optometry/i)
            .clickNextButton();

          VAFacilityPageObject.assertUrl()
            .assertSingleLocation({ locationName: /Facility 983/i })
            .clickNextButton();

          DateTimeRequestPageObject.assertUrl()
            .selectFirstAvailableDate()
            .clickNextButton();

          ReasonForAppointmentPageObject.assertUrl()
            .selectReasonForAppointment()
            .assertLabel({
              label: /Add any details you.d like to share with your provider/,
            })
            .typeAdditionalText({
              content: 'This is a test',
            })
            .clickNextButton();

          TypeOfVisitPageObject.assertUrl()
            .selectVisitType('In person')
            .clickNextButton();

          ContactInfoPageObject.assertUrl()
            .typeEmailAddress('veteran@va.gov')
            .typePhoneNumber('5555555555')
            .clickNextButton();

          ReviewPageObject.assertUrl()
            .assertHeading({ name: /Review and submit your request/ })
            .clickRequestButton();

          ConfirmationPageObject.assertUrl({ isDirect: false });

          // Assert
          cy.axeCheckBestPractice();
        });
      });

      describe('And veteran does not have a home address', () => {
        it('should submit form', () => {
          // Arrange
          const mockUser = new MockUser();

          // Act
          cy.login(mockUser);

          AppointmentListPageObject.visit().scheduleAppointment();

          TypeOfCarePageObject.assertUrl()
            .assertAddressAlert({ exist: true })
            .selectTypeOfCare(/Eye care/i)
            .clickNextButton();

          TypeOfEyeCarePageObject.assertUrl()
            .selectTypeOfEyeCare(/Optometry/i)
            .clickNextButton();

          VAFacilityPageObject.assertUrl()
            .assertSingleLocation({ locationName: /Facility 983/i })
            .clickNextButton();

          DateTimeRequestPageObject.assertUrl()
            .selectFirstAvailableDate()
            .clickNextButton();

          ReasonForAppointmentPageObject.assertUrl()
            .selectReasonForAppointment()
            .assertLabel({
              label: /Add any details you.d like to share with your provider/,
            })
            .typeAdditionalText({
              content: 'This is a test',
            })
            .clickNextButton();

          TypeOfVisitPageObject.assertUrl()
            .selectVisitType(/In person/i)
            .clickNextButton();

          ContactInfoPageObject.assertUrl()
            .typeEmailAddress('veteran@va.gov')
            .typePhoneNumber('5555555555')
            .clickNextButton();

          ReviewPageObject.assertUrl().clickRequestButton();

          ConfirmationPageObject.assertUrl({ isDirect: false });

          // Assert
          cy.axeCheckBestPractice();
        });
      });
    });

    describe('And more than one facility supports online scheduling', () => {
      beforeEach(() => {
        const mockEligibilityResponse = new MockEligibilityResponse({
          facilityId: '983',
          typeOfCareId,
          isEligible: true,
        });

        mockFacilitiesApi({
          response: MockFacilityResponse.createResponses({
            facilityIds: ['983', '984'],
          }),
        });
        mockEligibilityApi({ response: mockEligibilityResponse });
        mockEligibilityCCApi({ cceType, isEligible: false });
        mockSchedulingConfigurationApi({
          facilityIds: ['983', '984'],
          typeOfCareId,
          isDirect: false,
          isRequest: true,
        });
      });

      describe('And veteran does have a home address', () => {
        it('should submit form', () => {
          // Arrange
          const mockUser = new MockUser({ addressLine1: '123 Main St.' });

          // Act
          cy.login(mockUser);

          AppointmentListPageObject.visit().scheduleAppointment();

          TypeOfCarePageObject.assertUrl()
            .assertAddressAlert({ exist: false })
            .selectTypeOfCare(/Eye care/i)
            .clickNextButton();

          TypeOfEyeCarePageObject.assertUrl()
            .selectTypeOfEyeCare(/Optometry/i)
            .clickNextButton();

          VAFacilityPageObject.assertUrl()
            .selectLocation(/Facility 983/i)
            .clickNextButton();

          DateTimeRequestPageObject.assertUrl()
            .selectFirstAvailableDate()
            .clickNextButton();

          ReasonForAppointmentPageObject.assertUrl()
            .selectReasonForAppointment()
            .assertLabel({
              label: /Add any details you.d like to share with your provider/,
            })
            .typeAdditionalText({
              content: 'This is a test',
            })
            .clickNextButton();

          TypeOfVisitPageObject.assertUrl()
            .selectVisitType('In person')
            .clickNextButton();

          ContactInfoPageObject.assertUrl()
            .typeEmailAddress('veteran@va.gov')
            .typePhoneNumber('5555555555')
            .clickNextButton();

          ReviewPageObject.assertUrl()
            .assertHeading({ name: /Review and submit your request/ })
            .clickRequestButton();

          ConfirmationPageObject.assertUrl({ isDirect: false });

          // Assert
          cy.axeCheckBestPractice();
        });
      });

      describe('And veteran does not have a home address', () => {
        it('should submit form', () => {
          // Arrange
          const mockUser = new MockUser();

          // Act
          cy.login(mockUser);

          AppointmentListPageObject.visit().scheduleAppointment();

          TypeOfCarePageObject.assertUrl()
            .assertAddressAlert({ exist: true })
            .selectTypeOfCare(/Eye care/i)
            .clickNextButton();

          TypeOfEyeCarePageObject.assertUrl()
            .selectTypeOfEyeCare(/Optometry/i)
            .clickNextButton();

          VAFacilityPageObject.assertUrl()
            .selectLocation(/Facility 983/i)
            .clickNextButton();

          DateTimeRequestPageObject.assertUrl()
            .selectFirstAvailableDate()
            .clickNextButton();

          ReasonForAppointmentPageObject.assertUrl()
            .selectReasonForAppointment()
            .assertLabel({
              label: /Add any details you.d like to share with your provider/,
            })
            .typeAdditionalText({
              content: 'This is a test',
            })
            .clickNextButton();

          TypeOfVisitPageObject.assertUrl()
            .selectVisitType(/In person/i)
            .clickNextButton();

          ContactInfoPageObject.assertUrl()
            .typeEmailAddress('veteran@va.gov')
            .typePhoneNumber('5555555555')
            .clickNextButton();

          ReviewPageObject.assertUrl().clickRequestButton();

          ConfirmationPageObject.assertUrl({ isDirect: false });

          // Assert
          cy.axeCheckBestPractice();
        });
      });
    });
  });

  describe('When veteran is CC eligible', () => {
    beforeEach(() => {
      mockCCProvidersApi({
        response: MockProviderResponse.createResponses(),
      });
      mockFacilitiesApi({
        response: MockFacilityResponse.createResponses({
          facilityIds: ['983', '984'],
        }),
      });
      mockEligibilityCCApi({ cceType });
      mockSchedulingConfigurationApi({
        facilityIds: ['983', '984'],
        typeOfCareId,
        isDirect: false,
        isRequest: true,
      });
    });

    describe('And no clinics support direct schedule, clinic supports requests', () => {
      it('should start appointment request flow', () => {
        // Arrange
        const mockUser = new MockUser({ addressLine1: '123 Main St.' });

        // Act
        cy.login(mockUser);

        AppointmentListPageObject.visit().scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .assertAddressAlert({ exist: false })
          .selectTypeOfCare(/Eye care/i)
          .clickNextButton();

        TypeOfEyeCarePageObject.assertUrl()
          .selectTypeOfEyeCare(/Optometry/i)
          .clickNextButton();

        TypeOfFacilityPageObject.assertUrl()
          .selectTypeOfFacility(/Community care facility/i)
          .clickNextButton();

        DateTimeRequestPageObject.assertUrl({ isVARequest: false })
          .selectFirstAvailableDate()
          .clickNextButton();

        ClosestCityStatePageObject.assertUrl()
          .selectFacility({ label: /City 983/i })
          .clickNextButton();

        CommunityCarePreferencesPageObject.assertUrl()
          .assertHeading({ name: /Which provider do you prefer/i })
          .expandAccordian()
          .assertHomeAddress()
          .selectProvider({ label: /Optometry providers/i })
          .clickNextButton();

        PreferredLanguagePageObject.assertUrl()
          .selectLanguage('english')
          .clickNextButton();

        ReasonForAppointmentPageObject.assertUrl().clickNextButton();

        ContactInfoPageObject.assertUrl()
          .typePhoneNumber('5555555555')
          .selectPreferredTime()
          .typeEmailAddress('veteran@va.gov')
          .clickNextButton();

        ReviewPageObject.assertUrl()
          .assertHeading({ name: /Review and submit your request/ })
          .clickRequestButton();

        ConfirmationPageObject.assertUrl({ isDirect: false });

        // Assert
        cy.axeCheckBestPractice();
      });
    });
  });
});
