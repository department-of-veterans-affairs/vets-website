// @ts-check
import moment from 'moment';
import { APPOINTMENT_STATUS, OPTOMETRY_ID } from '../../../../utils/constants';
import MockAppointmentResponse from '../../fixtures/MockAppointmentResponse';
import {
  mockAppointmentGetApi,
  mockAppointmentCreateApi,
  mockAppointmentsGetApi,
  mockEligibilityApi,
  mockFacilitiesApi,
  mockFeatureToggles,
  mockSchedulingConfigurationApi,
  mockVamcEhrApi,
  vaosSetup,
  mockEligibilityCCApi,
  mockCCProvidersApi,
} from '../../vaos-cypress-helpers';
import MockUser from '../../fixtures/MockUser';
import AppointmentListPageObject from '../../page-objects/AppointmentList/AppointmentListPageObject';
import TypeOfCarePageObject from '../../page-objects/TypeOfCarePageObject';
import VAFacilityPageObject from '../../page-objects/VAFacilityPageObject';
import MockEligibilityResponse from '../../fixtures/MockEligibilityResponse';
import MockFacilityResponse from '../../fixtures/MockFacilityResponse';
import DateTimeRequestPageObject from '../../page-objects/DateTimeRequestPageObject';
import TypeOfVisitPageObject from '../../page-objects/TypeOfVisitPageObject';
import ContactInfoPageObject from '../../page-objects/ContactInfoPageObject';
import ReviewPageObject from '../../page-objects/ReviewPageObject';
import ConfirmationPageObject from '../../page-objects/ConfirmationPageObject';
import ReasonForAppointmentPageObject from '../../page-objects/ReasonForAppointmentPageObject';
import TypeOfEyeCarePageObject from '../../page-objects/TypeOfEyeCarePageObject';
import { getTypeOfCareById } from '../../../../utils/appointment';
import TypeOfFacilityPageObject from '../../page-objects/TypeOfFacilityPageObject';
import CommunityCarePreferencesPageObject from '../../page-objects/CommunityCarePreferencesPageObject';
import ClosestCityStatePageObject from '../../page-objects/ClosestCityStatePageObject';
import MockProviderResponse from '../../fixtures/MockProviderResponse';
import PreferredLanguagePageObject from '../../page-objects/PreferredLanguagePageObject';

const typeOfCareId = getTypeOfCareById(OPTOMETRY_ID).idV2;
const { cceType } = getTypeOfCareById(OPTOMETRY_ID);

describe('VAOS direct schedule flow - Optometry', () => {
  beforeEach(() => {
    vaosSetup();

    const response = new MockAppointmentResponse({
      id: 'mock1',
      localStartTime: moment(),
      status: APPOINTMENT_STATUS.proposed,
      serviceType: typeOfCareId,
    });
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
            .typeAdditionalText({ content: 'This is a test' })
            .clickNextButton();

          TypeOfVisitPageObject.assertUrl()
            .selectVisitType('Office visit')
            .clickNextButton();

          ContactInfoPageObject.assertUrl()
            .typeEmailAddress('veteran@va.gov')
            .typePhoneNumber('5555555555')
            .clickNextButton();

          ReviewPageObject.assertUrl()
            .assertHeading({ name: /Review your appointment details/ })
            .assertText({
              text: /Please review the information before submitting your request/i,
            })
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
            .typeAdditionalText({ content: 'This is a test' })
            .clickNextButton();

          TypeOfVisitPageObject.assertUrl()
            .selectVisitType(/Office visit/i)
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
            .typeAdditionalText({ content: 'This is a test' })
            .clickNextButton();

          TypeOfVisitPageObject.assertUrl()
            .selectVisitType('Office visit')
            .clickNextButton();

          ContactInfoPageObject.assertUrl()
            .typeEmailAddress('veteran@va.gov')
            .typePhoneNumber('5555555555')
            .clickNextButton();

          ReviewPageObject.assertUrl()
            .assertHeading({ name: /Review your appointment details/ })
            .assertText({
              text: /Please review the information before submitting your request/i,
            })
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
            .typeAdditionalText({ content: 'This is a test' })
            .clickNextButton();

          TypeOfVisitPageObject.assertUrl()
            .selectVisitType(/Office visit/i)
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
          .expandAccordian()
          .assertHomeAddress()
          .selectProvider()
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
          .assertHeading({ name: /Review your appointment details/ })
          .assertText({
            text: /Please review the information before submitting your request/i,
          })
          .clickRequestButton();

        ConfirmationPageObject.assertUrl({ isDirect: false });

        // Assert
        cy.axeCheckBestPractice();
      });
    });
  });
});
