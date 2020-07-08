/*
 * Skeleton mocks for different backend data responses
 * Avoid dependening on the data in specific fields in here in your tests, prefer to 
 * set field data in your test function
 */

export function getVAAppointmentMock() {
  return {
    id: '21cdc6741c00ac67b6cbf6b972d084c1',
    type: 'va_appointments',
    attributes: {
      clinicFriendlyName: 'Fake',
      clinicId: 'fake',
      facilityId: 'fake',
      sta6aid: 'fake',
      communityCare: false,
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

export function getVAFacilityMock() {
  return {
    id: 'vha_fake',
    type: 'va_facilities',
    attributes: {
      uniqueId: 'fake',
      name: 'Fake name',
      address: {
        physical: {
          zip: 'fake zip',
          city: 'Fake city',
          state: 'FA',
          address1: 'Fake street',
          address2: null,
          address3: null,
        },
      },
      phone: {
        main: 'Fake phone',
      },
      hours: {},
    },
  };
}

export function getVideoAppointmentMock() {
  return {
    id: '05760f00c80ae60ce49879cf37a05fc8',
    type: 'va_appointments',
    attributes: {
      startDate: 'fake',
      clinicId: null,
      clinicFriendlyName: null,
      facilityId: 'fake',
      communityCare: false,
      vdsAppointments: [],
      vvsAppointments: [
        {
          id: '8a74bdfa-0e66-4848-87f5-0d9bb413ae6d',
          appointmentKind: 'fake',
          sourceSystem: 'SM',
          dateTime: 'fake',
          duration: 20,
          status: { description: null, code: 'FAKE' },
          schedulingRequestType: 'NEXT_AVAILABLE_APPT',
          type: 'REGULAR',
          bookingNotes: 'fake',
          instructionsOther: false,
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
