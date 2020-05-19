import { expect } from 'chai';

import {
  transformFormToCCRequest,
  transformFormToVARequest,
  transformFormToAppointment,
} from '../../utils/data';
import { FETCH_STATUS, VHA_FHIR_ID } from '../../utils/constants';

describe('VAOS data transformation', () => {
  it('should transform form into VA request', () => {
    const state = {
      newAppointment: {
        data: {
          phoneNumber: '5035551234',
          bestTimeToCall: {
            morning: true,
          },
          email: 'test@va.gov',
          visitType: 'office',
          reasonForAppointment: 'routine-follow-up',
          reasonAdditionalInfo: 'Testing',
          calendarData: {
            currentlySelectedDate: '2019-11-20',
            selectedDates: [
              {
                date: '2019-11-20',
                optionTime: 'PM',
              },
            ],
          },
          vaParent: 'var983A6',
          vaFacility: 'var983GB',
          facilityType: 'vamc',
          typeOfCareId: '323',
        },
        parentFacilities: [
          {
            id: 'var983A6',
            identifier: [
              {
                system: VHA_FHIR_ID,
                value: '983A6',
              },
            ],
            partOf: {
              reference: 'Organization/var983',
            },
          },
        ],
        facilities: {
          '323_var983A6': [
            {
              id: 'var983GB',
              identifier: [
                {
                  system: VHA_FHIR_ID,
                  value: '983GB',
                },
              ],
              name: 'CHYSHR-Cheyenne VA Medical Center',
              address: [
                {
                  city: 'Cheyenne',
                  state: 'WY',
                },
              ],
              legacyVAR: {
                institutionTimezone: 'America/Denver',
              },
            },
          ],
        },
      },
    };
    const data = transformFormToVARequest(state);
    expect(data).to.deep.equal({
      typeOfCare: '323',
      typeOfCareId: '323',
      appointmentType: 'Primary care',
      status: 'Submitted',
      facility: {
        name: 'CHYSHR-Cheyenne VA Medical Center',
        facilityCode: '983GB',
        parentSiteCode: '983',
      },
      purposeOfVisit: 'Routine Follow-up',
      otherPurposeOfVisit: null,
      visitType: 'Office Visit',
      phoneNumber: '5035551234',
      verifyPhoneNumber: '5035551234',
      optionDate1: '11/20/2019',
      optionDate2: 'No Date Selected',
      optionDate3: 'No Date Selected',
      optionTime1: 'PM',
      optionTime2: 'No Time Selected',
      optionTime3: 'No Time Selected',
      bestTimetoCall: ['Morning'],
      emailPreferences: {
        emailAddress: 'test@va.gov',
        notificationFrequency: 'Each new message',
        emailAllowed: true,
        textMsgAllowed: false,
        textMsgPhNumber: '',
      },
      email: 'test@va.gov',
      schedulingMethod: 'clerk',
      requestedPhoneCall: false,
      providerId: '0',
      providerOption: '',
    });
  });
  it('should transform form for Sleep Care into VA request', () => {
    const state = {
      newAppointment: {
        data: {
          phoneNumber: '5035551234',
          bestTimeToCall: {
            morning: true,
          },
          email: 'test@va.gov',
          visitType: 'office',
          reasonForAppointment: 'routine-follow-up',
          reasonAdditionalInfo: 'Testing',
          calendarData: {
            currentlySelectedDate: '2019-11-20',
            selectedDates: [
              {
                date: '2019-11-20',
                optionTime: 'PM',
              },
            ],
          },
          vaParent: 'var983',
          vaFacility: 'var983GB',
          facilityType: 'vamc',
          typeOfCareId: 'SLEEP',
          typeOfSleepCareId: '349',
        },
        parentFacilities: [
          {
            id: 'var983',
            identifier: [
              {
                system: VHA_FHIR_ID,
                value: '983',
              },
            ],
          },
        ],
        facilities: {
          '349_var983': [
            {
              id: 'var983GB',
              identifier: [
                {
                  system: VHA_FHIR_ID,
                  value: '983GB',
                },
              ],
              name: 'CHYSHR-Cheyenne VA Medical Center',
              address: [
                {
                  city: 'Cheyenne',
                  state: 'WY',
                },
              ],
              legacyVAR: {
                institutionTimezone: 'America/Denver',
              },
            },
          ],
        },
      },
    };
    const data = transformFormToVARequest(state);
    expect(data).to.deep.equal({
      typeOfCare: '349',
      typeOfCareId: '349',
      appointmentType: 'Continuous Positive Airway Pressure (CPAP)',
      status: 'Submitted',
      facility: {
        name: 'CHYSHR-Cheyenne VA Medical Center',
        facilityCode: '983GB',
        parentSiteCode: '983',
      },
      purposeOfVisit: 'Routine Follow-up',
      otherPurposeOfVisit: null,
      visitType: 'Office Visit',
      phoneNumber: '5035551234',
      verifyPhoneNumber: '5035551234',
      optionDate1: '11/20/2019',
      optionDate2: 'No Date Selected',
      optionDate3: 'No Date Selected',
      optionTime1: 'PM',
      optionTime2: 'No Time Selected',
      optionTime3: 'No Time Selected',
      bestTimetoCall: ['Morning'],
      emailPreferences: {
        emailAddress: 'test@va.gov',
        notificationFrequency: 'Each new message',
        emailAllowed: true,
        textMsgAllowed: false,
        textMsgPhNumber: '',
      },
      email: 'test@va.gov',
      schedulingMethod: 'clerk',
      requestedPhoneCall: false,
      providerId: '0',
      providerOption: '',
    });
  });

  it('should transform form into CC request', () => {
    const state = {
      user: {
        profile: {
          vet360: {},
        },
      },
      newAppointment: {
        data: {
          phoneNumber: '5035551234',
          bestTimeToCall: {
            afternoon: true,
          },
          email: 'test@va.gov',
          reasonForAppointment: 'routine-follow-up',
          reasonAdditionalInfo: 'asdf',
          communityCareSystemId: 'var983',
          preferredLanguage: 'english',
          hasCommunityCareProvider: true,
          communityCareProvider: {
            firstName: 'asdf',
            lastName: 'asdf',
            practiceName: 'Practice',
            address: {
              street: '456 elm st',
              street2: 'sfasdf',
              state: 'MA',
              city: 'northampton',
              postalCode: '01050',
            },
            phone: '2342444444',
          },
          calendarData: {
            currentlySelectedDate: '2019-11-20',
            selectedDates: [
              {
                date: '2019-11-20',
                optionTime: 'PM',
              },
            ],
          },
          facilityType: 'communityCare',
          typeOfCareId: '323',
        },
        facilities: {},
        facilityDetails: {},
        clinics: {},
        eligibility: {},
        parentFacilities: [
          {
            id: 'var983',
            identifier: [
              {
                system: VHA_FHIR_ID,
                value: '983',
              },
            ],
            name: 'CHYSHR-Cheyenne VA Medical Center',
            address: [
              {
                city: 'Cheyenne',
                state: 'WY',
              },
            ],
          },
          {
            id: 'var984',
            identifier: [
              {
                system: VHA_FHIR_ID,
                value: '984',
              },
            ],
            address: [
              {
                city: 'Dayton',
                state: 'OH',
              },
            ],
          },
        ],
        ccEnabledSystems: ['984', '983'],
        pageChangeInProgress: false,
        parentFacilitiesStatus: FETCH_STATUS.succeeded,
        eligibilityStatus: FETCH_STATUS.succeeded,
        facilityDetailsStatus: FETCH_STATUS.succeeded,
        pastAppointments: null,
        submitStatus: 'succeeded',
      },
    };
    const data = transformFormToCCRequest(state);
    expect(data).to.deep.equal({
      typeOfCare: 'CCPRMYRTNE',
      typeOfCareId: 'CCPRMYRTNE',
      appointmentType: 'Primary care',
      facility: {
        name: 'CHYSHR-Cheyenne VA Medical Center',
        facilityCode: '983',
        parentSiteCode: '983',
      },
      purposeOfVisit: 'routine-follow-up',
      phoneNumber: '5035551234',
      verifyPhoneNumber: '5035551234',
      bestTimetoCall: ['Afternoon'],
      preferredProviders: [
        {
          address: {
            street: '456 elm st, sfasdf',
            city: 'northampton',
            state: 'MA',
            zipCode: '01050',
          },
          practiceName: 'Practice',
          firstName: 'asdf',
          lastName: 'asdf',
          providerStreet: '456 elm st, sfasdf',
          providerCity: 'northampton',
          providerState: 'MA',
          providerZipCode1: '01050',
        },
      ],
      newMessage: 'asdf',
      preferredLanguage: 'English',
      optionDate1: '11/20/2019',
      optionDate2: 'No Date Selected',
      optionDate3: 'No Date Selected',
      optionTime1: 'PM',
      optionTime2: 'No Time Selected',
      optionTime3: 'No Time Selected',
      preferredCity: 'Cheyenne',
      preferredState: 'WY',
      requestedPhoneCall: false,
      email: 'test@va.gov',
      officeHours: [],
      reasonForVisit: '',
      visitType: 'Office Visit',
      distanceWillingToTravel: 40,
      secondRequest: false,
      secondRequestSubmitted: false,
      inpatient: false,
      status: 'Submitted',
      providerId: '0',
      providerOption: '',
    });
  });

  it('should transform audiology form into audiology CC request', () => {
    const state = {
      user: {
        profile: {
          vet360: {},
        },
      },
      newAppointment: {
        data: {
          phoneNumber: '5035551234',
          bestTimeToCall: {
            afternoon: true,
          },
          email: 'test@va.gov',
          reasonForAppointment: 'routine-follow-up',
          reasonAdditionalInfo: 'asdf',
          communityCareSystemId: 'var983',
          preferredLanguage: 'english',
          hasCommunityCareProvider: true,
          communityCareProvider: {
            firstName: 'asdf',
            lastName: 'asdf',
            practiceName: 'Practice',
            address: {
              street: '456 elm st',
              street2: 'sfasdf',
              state: 'MA',
              city: 'northampton',
              postalCode: '01050',
            },
            phone: '2342444444',
          },
          calendarData: {
            currentlySelectedDate: '2019-11-20',
            selectedDates: [
              {
                date: '2019-11-20',
                optionTime: 'PM',
              },
            ],
          },
          facilityType: 'communityCare',
          typeOfCareId: '203',
          audiologyType: 'CCAUDHEAR',
        },
        facilities: {},
        facilityDetails: {},
        clinics: {},
        eligibility: {},
        parentFacilities: [
          {
            id: 'var983',
            identifier: [
              {
                system: VHA_FHIR_ID,
                value: '983',
              },
            ],
            name: 'CHYSHR-Cheyenne VA Medical Center',
            address: [
              {
                city: 'Cheyenne',
                state: 'WY',
              },
            ],
          },
          {
            id: 'var984',
            identifier: [
              {
                system: VHA_FHIR_ID,
                value: '984',
              },
            ],
            address: [
              {
                city: 'Dayton',
                state: 'OH',
              },
            ],
          },
        ],
        ccEnabledSystems: ['984', '983'],
        pageChangeInProgress: false,
        parentFacilitiesStatus: FETCH_STATUS.succeeded,
        eligibilityStatus: FETCH_STATUS.succeeded,
        facilityDetailsStatus: FETCH_STATUS.succeeded,
        pastAppointments: null,
        submitStatus: 'succeeded',
      },
    };
    const data = transformFormToCCRequest(state);
    expect(data).to.deep.equal({
      typeOfCare: 'CCAUDHEAR',
      typeOfCareId: 'CCAUDHEAR',
      appointmentType: 'Hearing aid support',
      facility: {
        name: 'CHYSHR-Cheyenne VA Medical Center',
        facilityCode: '983',
        parentSiteCode: '983',
      },
      purposeOfVisit: 'routine-follow-up',
      phoneNumber: '5035551234',
      verifyPhoneNumber: '5035551234',
      bestTimetoCall: ['Afternoon'],
      preferredProviders: [
        {
          address: {
            street: '456 elm st, sfasdf',
            city: 'northampton',
            state: 'MA',
            zipCode: '01050',
          },
          practiceName: 'Practice',
          firstName: 'asdf',
          lastName: 'asdf',
          providerStreet: '456 elm st, sfasdf',
          providerCity: 'northampton',
          providerState: 'MA',
          providerZipCode1: '01050',
        },
      ],
      newMessage: 'asdf',
      preferredLanguage: 'English',
      optionDate1: '11/20/2019',
      optionDate2: 'No Date Selected',
      optionDate3: 'No Date Selected',
      optionTime1: 'PM',
      optionTime2: 'No Time Selected',
      optionTime3: 'No Time Selected',
      preferredCity: 'Cheyenne',
      preferredState: 'WY',
      requestedPhoneCall: false,
      email: 'test@va.gov',
      officeHours: [],
      reasonForVisit: '',
      visitType: 'Office Visit',
      distanceWillingToTravel: 40,
      secondRequest: false,
      secondRequestSubmitted: false,
      inpatient: false,
      status: 'Submitted',
      providerId: '0',
      providerOption: '',
    });
  });

  it('should transform form into VA appointment', () => {
    const state = {
      user: {
        profile: {
          vet360: {},
        },
      },
      newAppointment: {
        data: {
          phoneNumber: '5035551234',
          bestTimeToCall: {
            morning: true,
          },
          email: 'test@va.gov',
          reasonForAppointment: 'routine-follow-up',
          reasonAdditionalInfo: 'asdfasdf',
          calendarData: {
            currentlySelectedDate: '2019-11-22',
            selectedDates: [
              {
                date: '2019-11-22',
                datetime: '2019-11-22T09:30:00',
              },
            ],
          },
          preferredDate: '2019-12-02',
          clinicId: '308',
          vaParent: 'var983',
          vaFacility: 'var983',
          facilityType: 'vamc',
          typeOfCareId: '323',
        },
        appointmentLength: '30',
        parentFacilities: [
          {
            id: 'var983',
            identifier: [
              {
                system: VHA_FHIR_ID,
                value: '983',
              },
            ],
            address: [
              {
                city: 'Cheyenne',
                state: 'WY',
              },
            ],
          },
        ],
        facilities: {
          '323_var983': [
            {
              id: 'var983',
              identifier: [
                {
                  system: VHA_FHIR_ID,
                  value: '983',
                },
              ],
              name: 'CHYSHR-Cheyenne VA Medical Center',
              address: [
                {
                  city: 'Cheyenne',
                  state: 'WY',
                },
              ],
              legacyVAR: {
                institutionTimezone: 'America/Denver',
              },
            },
          ],
        },
        clinics: {
          // eslint-disable-next-line camelcase
          var983_323: [
            {
              siteCode: '983',
              clinicId: '308',
              clinicName: 'CHY PC KILPATRICK',
              clinicFriendlyLocationName: 'Green Team Clinic1',
              institutionName: 'CHYSHR-Cheyenne VA Medical Center',
              institutionCode: '983',
            },
          ],
        },
      },
    };
    const data = transformFormToAppointment(state);
    expect(data).to.deep.equal({
      clinic: {
        siteCode: '983',
        clinicId: '308',
        clinicName: 'CHY PC KILPATRICK',
        clinicFriendlyLocationName: 'Green Team Clinic1',
        institutionName: 'CHYSHR-Cheyenne VA Medical Center',
        institutionCode: '983',
      },
      desiredDate: '2019-12-02T00:00:00+00:00',
      dateTime: '2019-11-22T09:30:00+00:00',
      duration: 30,
      bookingNotes: 'Follow-up/Routine: asdfasdf',
      preferredEmail: 'test@va.gov',
      timeZone: 'America/Denver',
      apptType: 'P',
      purpose: '9',
      lvl: '1',
      ekg: '',
      lab: '',
      xRay: '',
      schedulingRequestType: 'NEXT_AVAILABLE_APPT',
      type: 'REGULAR',
      appointmentKind: 'TRADITIONAL',
      appointmentType: 'Primary care',
      schedulingMethod: 'direct',
    });
  });

  it('should transform form for Eye Care into VA request', () => {
    const state = {
      newAppointment: {
        data: {
          phoneNumber: '5035551234',
          bestTimeToCall: {
            morning: true,
          },
          email: 'test@va.gov',
          visitType: 'office',
          reasonForAppointment: 'routine-follow-up',
          reasonAdditionalInfo: 'Testing',
          calendarData: {
            currentlySelectedDate: '2019-11-20',
            selectedDates: [
              {
                date: '2019-11-20',
                optionTime: 'PM',
              },
            ],
            currentRowIndex: 3,
          },
          vaParent: 'var983',
          vaFacility: 'var983GB',
          facilityType: 'vamc',
          typeOfCareId: 'EYE',
          typeOfEyeCareId: '407',
        },
        parentFacilities: [
          {
            id: 'var983',
            identifier: [
              {
                system: VHA_FHIR_ID,
                value: '983',
              },
            ],
          },
        ],
        facilities: {
          '407_var983': [
            {
              id: 'var983GB',
              identifier: [
                {
                  system: VHA_FHIR_ID,
                  value: '983GB',
                },
              ],
              name: 'CHYSHR-Cheyenne VA Medical Center',
              address: [
                {
                  city: 'Cheyenne',
                  state: 'WY',
                },
              ],
              legacyVAR: {
                institutionTimezone: 'America/Denver',
              },
            },
          ],
        },
      },
    };
    const data = transformFormToVARequest(state);
    expect(data).to.deep.equal({
      typeOfCare: '407',
      typeOfCareId: '407',
      appointmentType: 'Ophthalmology',
      status: 'Submitted',
      facility: {
        name: 'CHYSHR-Cheyenne VA Medical Center',
        facilityCode: '983GB',
        parentSiteCode: '983',
      },
      purposeOfVisit: 'Routine Follow-up',
      otherPurposeOfVisit: null,
      visitType: 'Office Visit',
      phoneNumber: '5035551234',
      verifyPhoneNumber: '5035551234',
      optionDate1: '11/20/2019',
      optionDate2: 'No Date Selected',
      optionDate3: 'No Date Selected',
      optionTime1: 'PM',
      optionTime2: 'No Time Selected',
      optionTime3: 'No Time Selected',
      bestTimetoCall: ['Morning'],
      emailPreferences: {
        emailAddress: 'test@va.gov',
        notificationFrequency: 'Each new message',
        emailAllowed: true,
        textMsgAllowed: false,
        textMsgPhNumber: '',
      },
      email: 'test@va.gov',
      schedulingMethod: 'clerk',
      requestedPhoneCall: false,
      providerId: '0',
      providerOption: '',
    });
  });
});
