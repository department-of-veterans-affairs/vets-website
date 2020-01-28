import { expect } from 'chai';

import {
  transformFormToCCRequest,
  transformFormToVARequest,
  transformFormToAppointment,
} from '../../utils/data';
import { FETCH_STATUS } from '../../utils/constants';

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
            currentRowIndex: 3,
          },
          vaSystem: '983',
          vaFacility: '983GB',
          facilityType: 'vamc',
          typeOfCareId: '323',
        },
        facilities: {
          '323_983': [
            {
              institutionCode: '983GB',
              name: 'CHYSHR-Cheyenne VA Medical Center',
              city: 'Cheyenne',
              stateAbbrev: 'WY',
              authoritativeName: 'CHYSHR-Cheyenne VA Medical Center',
              rootStationCode: '983',
              parentStationCode: '983',
              institutionTimezone: 'America/Denver',
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
      cityState: {
        institutionCode: '983',
        rootStationCode: '983',
        parentStationCode: '983',
        adminParent: true,
      },
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
            currentRowIndex: 3,
          },
          vaSystem: '983',
          vaFacility: '983GB',
          facilityType: 'vamc',
          typeOfCareId: 'SLEEP',
          typeOfSleepCareId: '349',
        },
        facilities: {
          '349_983': [
            {
              institutionCode: '983GB',
              name: 'CHYSHR-Cheyenne VA Medical Center',
              city: 'Cheyenne',
              stateAbbrev: 'WY',
              authoritativeName: 'CHYSHR-Cheyenne VA Medical Center',
              rootStationCode: '983',
              parentStationCode: '983',
              institutionTimezone: 'America/Denver',
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
      cityState: {
        institutionCode: '983',
        rootStationCode: '983',
        parentStationCode: '983',
        adminParent: true,
      },
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
          communityCareSystemId: '983',
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
            currentRowIndex: 3,
          },
          facilityType: 'communityCare',
          typeOfCareId: '323',
        },
        facilities: {},
        facilityDetails: {},
        clinics: {},
        eligibility: {},
        systems: [
          {
            institutionCode: '983',
            city: 'Cheyenne',
            stateAbbrev: 'WY',
            authoritativeName: 'CHYSHR-Cheyenne VA Medical Center',
            rootStationCode: '983',
            adminParent: true,
            parentStationCode: '983',
          },
          {
            institutionCode: '984',
            city: 'Dayton',
            stateAbbrev: 'OH',
            authoritativeName: 'DAYTSHR -Dayton VA Medical Center',
            rootStationCode: '984',
            adminParent: true,
            parentStationCode: '984',
          },
        ],
        ccEnabledSystems: ['984', '983'],
        pageChangeInProgress: false,
        systemsStatus: FETCH_STATUS.succeeded,
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
      cityState: {
        institutionCode: '983',
        parentStationCode: '983',
        rootStationCode: '983',
        adminParent: true,
      },
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
          communityCareSystemId: '983',
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
            currentRowIndex: 3,
          },
          facilityType: 'communityCare',
          typeOfCareId: '203',
          audiologyType: 'CCAUDHEAR',
        },
        facilities: {},
        facilityDetails: {},
        clinics: {},
        eligibility: {},
        systems: [
          {
            institutionCode: '983',
            city: 'Cheyenne',
            stateAbbrev: 'WY',
            authoritativeName: 'CHYSHR-Cheyenne VA Medical Center',
            rootStationCode: '983',
            adminParent: true,
            parentStationCode: '983',
          },
          {
            institutionCode: '984',
            city: 'Dayton',
            stateAbbrev: 'OH',
            authoritativeName: 'DAYTSHR -Dayton VA Medical Center',
            rootStationCode: '984',
            adminParent: true,
            parentStationCode: '984',
          },
        ],
        ccEnabledSystems: ['984', '983'],
        pageChangeInProgress: false,
        systemsStatus: FETCH_STATUS.succeeded,
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
      cityState: {
        institutionCode: '983',
        parentStationCode: '983',
        rootStationCode: '983',
        adminParent: true,
      },
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
            currentRowIndex: 3,
          },
          preferredDate: '2019-12-02',
          clinicId: '308',
          vaSystem: '983',
          vaFacility: '983',
          facilityType: 'vamc',
          typeOfCareId: '323',
        },
        appointmentLength: '30',
        facilities: {
          '323_983': [
            {
              institutionCode: '983',
              name: 'CHYSHR-Cheyenne VA Medical Center',
              city: 'Cheyenne',
              stateAbbrev: 'WY',
              authoritativeName: 'CHYSHR-Cheyenne VA Medical Center',
              rootStationCode: '983',
              parentStationCode: '983',
              institutionTimezone: 'America/Denver',
            },
          ],
        },
        clinics: {
          '983_323': [
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
});
