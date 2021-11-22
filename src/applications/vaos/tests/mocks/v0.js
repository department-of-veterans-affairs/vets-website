/**
 *
 * Skeleton mocks for different backend data responses
 *
 * Avoid dependening on the data in specific fields in here in your tests, prefer to
 * set field data in your test function
 *
 * @module testing/mocks/data
 */

/**
 * Return a MAS appointment object, with a VistA appointment stub (item in vdsAppointments)
 *
 * @export
 * @returns {MASAppointment} MAS appointment object
 */
export function getVAAppointmentMock() {
  return {
    id: '21cdc6741c00ac67b6cbf6b972d084c1',
    type: 'appointment',
    attributes: {
      uniqueId: '21cdc6741c00ac67b6cbf6b972d084c1',
      clinicFriendlyName: 'Fake',
      clinicId: 'fake',
      facilityId: 'fake',
      sta6aid: null,
      communityCare: false,
      phoneOnly: false,
      vdsAppointments: [
        {
          bookingNote: null,
          appointmentLength: '60',
          appointmentTime: 'fake',
          clinic: {
            name: 'fake',
            askForCheckIn: false,
            facilityCode: 'fake',
          },
          type: 'REGULAR',
          currentStatus: 'fake',
        },
      ],
      vvsAppointments: [],
    },
  };
}

/**
 * Return a MAS appointment object, with a video appointment stub (item in vvsAppointments)
 *
 * @export
 * @param {Object} params
 * @param {string} params.id The appointment id
 * @param {string} params.facilityId The site id of the appointment
 * @param {string} params.startDate The start date of the appointment, in ISO format
 * @param {string} params.appointmentKind The VVS appointment kind to use
 * @param {string} params.instructionsTitle The type of instructions to use
 * @returns {MASAppointment} MAS appointment object
 */
export function getVideoAppointmentMock({
  id = '05760f00c80ae60ce49879cf37a05fc8',
  facilityId = 'fake',
  startDate = 'fake',
  appointmentKind = 'fake',
  instructionsTitle = null,
} = {}) {
  return {
    id,
    type: 'va_appointments',
    attributes: {
      startDate,
      clinicId: null,
      clinicFriendlyName: null,
      facilityId,
      communityCare: false,
      vdsAppointments: [],
      vvsAppointments: [
        {
          id: '8a74bdfa-0e66-4848-87f5-0d9bb413ae6d',
          appointmentKind,
          sourceSystem: 'SM',
          dateTime: startDate,
          duration: 20,
          status: { description: null, code: 'FAKE' },
          schedulingRequestType: 'NEXT_AVAILABLE_APPT',
          type: 'REGULAR',
          bookingNotes: 'fake',
          instructionsOther: false,
          instructionsTitle,
          patients: [
            {
              name: { firstName: 'JUDY', lastName: 'MORRISON' },
              contactInformation: {
                mobile: 'fake',
                preferredEmail: 'fake',
              },
              location: {
                type: 'NonVA',
                facility: {
                  name: 'fake name',
                  siteCode: 'fake',
                  timeZone: 'fake',
                },
              },
              patientAppointment: true,
              virtualMeetingRoom: {
                conference: 'VVC8275247',
                pin: 'fake',
                url: 'fake',
              },
            },
          ],
          providers: [],
        },
      ],
    },
  };
}

/**
 * Return a stubbed var-resources community care request item
 *
 * @export
 * @returns {VARRequest} var-resources request object
 */
export function getCCRequestMock() {
  return {
    id: '8a4886886e4c8e22016e6613216d001f',
    attributes: {
      dataIdentifier: {
        uniqueId: '8a4886886e4c8e22016e6613216d001f',
        systemId: 'var',
      },
      lastUpdatedDate: '11/13/2019 11:42:40',
      optionDate1: 'No Date Selected',
      optionTime1: 'No Time Selected',
      optionDate2: 'No Date Selected',
      optionTime2: 'No Time Selected',
      optionDate3: 'No Date Selected',
      optionTime3: 'No Time Selected',
      status: 'fake',
      appointmentType: 'fake',
      visitType: 'fake',
      email: 'fake',
      patient: {},
      bestTimetoCall: [],
      typeOfCareId: 'fake',
      ccAppointmentRequest: {
        preferredProviders: [{}],
      },
    },
  };
}

/**
 * Return a stubbed var-resources VA request item
 *
 * @export
 * @returns {VARRequest} var-resources request object
 */
export function getVARequestMock() {
  return {
    id: '8a4886886e4c8e22016e6613216d001g',
    attributes: {
      dataIdentifier: {
        uniqueId: '8a4886886e4c8e22016e6613216d001g',
        systemId: 'var',
      },
      lastUpdatedDate: '11/13/2019 11:42:40',
      optionDate1: 'No Date Selected',
      optionTime1: 'No Time Selected',
      optionDate2: 'No Date Selected',
      optionTime2: 'No Time Selected',
      optionDate3: 'No Date Selected',
      optionTime3: 'No Time Selected',
      status: 'fake',
      appointmentType: 'fake',
      visitType: 'fake',
      facility: {
        name: 'fake',
        facilityCode: 'fake',
        state: 'fake',
        city: 'fake',
        address: 'fake',
        parentSiteCode: 'fake',
      },
      email: 'fake@va.gov',
      phoneNumber: 'fake',
      purposeOfVisit: 'fake',
      bestTimetoCall: [],
      typeOfCareId: 'fake',
      friendlyLocationName: 'fake',
      createdDate: '11/13/2019 11:42:40',
    },
  };
}

/**
 * Return a stubbed var-resources request message object. Messages are assoicated
 * with a var-resources request
 *
 * @export
 * @returns {VARRequestMessage} var-resources request message object
 */
export function getMessageMock() {
  return {
    id: 'fake',
    type: 'messages',
    attributes: {
      surrogateIdentifier: {},
      messageText: 'fake',
      messageDateTime: '11/11/2019 12:26:13',
      senderId: 'fake',
      appointmentRequestId: 'fake',
      date: 'fake',
      assigningAuthority: 'ICN',
      systemId: 'var',
    },
  };
}

/**
 * Returns a stubbed var-resources community care appointment object
 *
 * @export
 * @returns {VARCommunityCareAppointment} var-resources community care appointment object
 */
export function getCCAppointmentMock() {
  return {
    id: 'fake',
    type: 'cc_appointments',
    attributes: {
      appointmentRequestId: 'fake',
      distanceEligibleConfirmed: true,
      name: { firstName: 'fake', lastName: 'fake' },
      providerPractice: 'fake',
      providerPhone: 'fake',
      address: {
        street: 'fake',
        city: 'fake',
        state: 'FK',
        zipCode: 'fake',
      },
      instructionsToVeteran: 'fake',
      appointmentTime: 'fake',
      timeZone: 'fake',
    },
  };
}

/**
 * Returns a stubbed var-resources cancel reason object
 *
 * @export
 * @returns {CancelReason} var-resources cancel reason object
 */
export function getCancelReasonMock() {
  return {
    id: 'fake',
    type: 'cancel_reason',
    attributes: {
      number: 'fake',
      text: 'fake',
      type: 'B',
      inactive: false,
    },
  };
}

/**
 * Returns a stubbed var-resources parent site object. Mostly unused now.
 *
 * @export
 * @returns {VARParentSite} var-resources parent site object
 */
export function getParentSiteMock({
  id = 'fake',
  name = 'fake',
  city = 'fake',
  state = 'FK',
} = {}) {
  return {
    id,
    type: 'facility',
    attributes: {
      institutionCode: id,
      city,
      stateAbbrev: state,
      authoritativeName: name,
      rootStationCode: id,
      adminParent: true,
      parentStationCode: id,
    },
  };
}

/**
 * Returns a stubbed VATS request settings object for a specific facility
 *
 * @export
 * @param {Object} [criteriaParams]
 * @param {string} [criteriaParams.id=fake] Facility id
 * @param {string} [criteriaParams.typeOfCareId=fake] Type of care id
 * @param {string} [criteriaParams.patientHistoryRequred=null] Setting that marks facility as enabled or not.
 *   Pass null to disable, or 'No' or 'Yes' to enable
 * @returns {VATSRequestCriteria} VATS request setting object for a facility
 */
export function getRequestEligibilityCriteriaMock({
  id = 'fake',
  typeOfCareId = 'fake',
  patientHistoryRequired = 'No',
  patientHistoryDuration = 365,
} = {}) {
  return {
    id,
    type: 'request_eligibility_criteria',
    attributes: {
      id,
      requestSettings: [
        {
          id: typeOfCareId,
          typeOfCare: 'fake',
          patientHistoryRequired,
          patientHistoryDuration,
          submittedRequestLimit: 1,
          enterpriseSubmittedRequestLimit: 1,
        },
      ],
    },
  };
}

/**
 * Returns a stubbed VATS direct schedule settings object for a specific facility
 *
 * @export
 * @param {Object} [criteriaParams]
 * @param {string} [criteriaParams.id=fake] Facility id
 * @param {string} [criteriaParams.typeOfCareId=fake] Type of care id
 * @param {string} [criteriaParams.patientHistoryRequred=null] Setting that marks facility as enabled or not.
 *   Pass null to disable, or 'No' or 'Yes' to enable
 * @returns {VATSDirectCriteria} VATS direct schedule setting object for a facility
 */
export function getDirectBookingEligibilityCriteriaMock({
  id = 'fake',
  typeOfCareId = 'fake',
  patientHistoryRequired = 'No',
  patientHistoryDuration = 0,
} = {}) {
  return {
    id,
    type: 'direct_booking_eligibility_criteria',
    attributes: {
      id,
      coreSettings: [
        {
          id: typeOfCareId,
          typeOfCare: 'fake',
          patientHistoryRequired,
          patientHistoryDuration,
          submittedRequestLimit: 1,
          enterpriseSubmittedRequestLimit: 1,
        },
      ],
    },
  };
}

/**
 * Returns a stubbed var-resources facility object. Not really used outside of
 * old parent/child facility page
 *
 * @export
 * @returns {VARFacility} var-resources facility object
 */
export function getFacilityMock() {
  return {
    id: 'fake',
    type: 'direct_scheduling_facility',
    attributes: {
      institutionCode: 'fake',
      city: 'fake',
      stateAbbrev: 'FK',
      authoritativeName: 'fake',
      rootStationCode: 'fake',
      adminParent: true,
      parentStationCode: 'fake',
      requestSupported: false,
      directSchedulingSupported: false,
      expressTimes: null,
      institutionTimezone: 'fake',
    },
  };
}

/**
 * Returns a stubbed var-resources VistA clinic object.
 *
 * @export
 * @returns {VARClinic} var-resources clinic object
 */
export function getClinicMock() {
  return {
    id: 'fake',
    type: 'clinic',
    attributes: {
      siteCode: 'fake',
      clinicId: 'fake',
      clinicName: 'Fake name',
      clinicFriendlyLocationName: 'Fake friendly name',
      primaryStopCode: 'fake',
      secondaryStopCode: '',
      directSchedulingFlag: 'Y',
      displayToPatientFlag: 'Y',
      institutionName: 'Fake inst name',
      institutionCode: 'fake',
      objectType: 'CdwClinic',
      link: [],
    },
  };
}

/**
 * Returns a stubbed var-resources VistA clinic appointment slot object.
 *
 * @export
 * @returns {VARSlot} var-resources clinic appointment slot object
 */
export function getAppointmentSlotMock() {
  return {
    startDateTime: 'fake',
    endDateTime: 'fake',
    bookingStatus: '1',
    remainingAllowedOverBookings: '3',
    availability: true,
  };
}

/**
 * @summary
 *
 * VATS days settings for Express Care request
 *
 * @typedef {Object} SchedulingDay
 * @static
 * @property {string} day All caps day of week name
 * @property {boolean} canSchedule Can you schedule EC on this day
 * @property {string} startTime Start time in HH:MM format
 * @property {string} endTime End time in HH:MM format
 */

/**
 * Returns a stubbed VATS request setting object for the Express Care type of care
 *
 * @export
 * @param {string} id Facility id
 * @param {Array<module:testing/mocks/data.SchedulingDay>} schedulingDays List of days with settings for each to determine if scheduling is allowed
 * @returns {VATSRequestCriteria} var-resources VATS request settings object
 */
export function getExpressCareRequestCriteriaMock(id, schedulingDays) {
  return {
    id,
    type: 'request_eligibility_criteria',
    attributes: {
      id,
      requestSettings: [],
      customRequestSettings: [
        {
          id: 'CR1',
          typeOfCare: 'Express Care',
          submittedRequestLimit: 2,
          enterpriseSubmittedRequestLimit: 2,
          supported: !!schedulingDays,
          schedulingDays: schedulingDays || [],
        },
      ],
    },
  };
}

/**
 * Returns a stubbed mobile community care eligibility object
 *
 * @export
 * @param {string} typeOfCare CCE type of care id string (not the number, text like PrimaryCare)
 * @param {boolean} [eligible=true] Mock the response as being eligible for CC or not
 * @returns {CCEResponse} Stubbed cce object
 */
export function getCCEligibilityMock(typeOfCare, eligible = true) {
  return {
    id: typeOfCare,
    type: 'cc_eligibility',
    attributes: { eligible },
  };
}
