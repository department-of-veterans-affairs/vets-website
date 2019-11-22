import { expect } from 'chai';

import {
  transformFormToCCRequest,
  transformFormToVARequest,
} from '../../utils/data';

describe('VAOS data transformation', () => {
  it('should transform form into VA request', () => {
    const state = {
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
    };
    const data = transformFormToVARequest(state);
    expect(data).to.deep.equal({
      typeOfCare: '323',
      typeOfCareId: '323',
      cityState: {
        institutionCode: '983',
        rootStationCode: '983',
        parentStationCode: '983',
        adminParent: true,
      },
      facility: { facilityCode: '983GB', parentSiteCode: '983' },
      purposeOfVisit: 'Routine Follow-up',
      visitType: 'Office Visit',
      phoneNumber: '5035551234',
      verifyPhoneNumber: '5035551234',
      optionDate1: '11/20/2019',
      optionDate2: 'No Date Selected',
      optionDate3: 'No Date Selected',
      optionTime1: 'PM',
      optionTime2: 'No Time Selected',
      optionTime3: 'No Time Selected',
      bestTimeToCall: ['Morning'],
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
      pproviderOption: '',
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
              street: '399 elm st',
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
        loadingSystems: false,
        loadingEligibility: false,
        loadingFacilityDetails: false,
        pastAppointments: null,
        submitStatus: 'succeeded',
        reasonRemainingChar: 78,
      },
    };
    const data = transformFormToCCRequest(state);
    expect(data).to.deep.equal({
      typeOfCare: 'CCPRMYRTNE',
      typeOfCareId: 'CCPRMYRTNE',
      cityState: {
        institutionCode: '983',
        parentStationCode: '983',
        rootStationCode: '983',
        adminParent: true,
      },
      facility: {
        facilityCode: '983',
        parentSiteCode: '983',
      },
      purposeOfVisit: 'routine-follow-up',
      phoneNumber: '5035551234',
      verifyPhoneNumber: '5035551234',
      bestTimeToCall: ['Afternoon'],
      preferredProviders: [
        {
          address: { city: '', state: '', street: '', zipCode: '01050' },
          practiceName: 'Practice',
          firstName: 'asdf',
          lastName: 'asdf',
          providerStreet: '399 elm st, sfasdf',
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
      distanceWillingToTravel: 40,
      secondRequest: false,
      secondRequestSubmitted: false,
      inpatient: false,
      status: 'Submitted',
      providerId: '0',
      pproviderOption: '',
    });
  });
});
