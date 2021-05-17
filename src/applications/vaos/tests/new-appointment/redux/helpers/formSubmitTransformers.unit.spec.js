import { expect } from 'chai';

import {
  transformFormToCCRequest,
  transformFormToVARequest,
  transformFormToAppointment,
  transformFormToVAOSCCRequest,
} from '../../../../new-appointment/redux/helpers/formSubmitTransformers';
import { FETCH_STATUS, VHA_FHIR_ID } from '../../../../utils/constants';

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
          reasonForAppointment: 'other',
          reasonAdditionalInfo: 'Testing',
          selectedDates: ['2019-11-20T12:00:00.000'],
          vaParent: '983A6',
          vaFacility: '983GB',
          facilityType: 'vamc',
          typeOfCareId: '323',
        },
        parentFacilities: [
          {
            id: '983A6',
            identifier: [
              {
                system: VHA_FHIR_ID,
                value: '983A6',
              },
            ],
            partOf: {
              reference: 'Organization/983',
            },
          },
        ],
        facilities: {
          '323': [
            {
              id: '983GB',
              identifier: [
                {
                  system: VHA_FHIR_ID,
                  value: '983GB',
                },
              ],
              name: 'Cheyenne VA Medical Center',
              address: {
                city: 'Cheyenne',
                state: 'WY',
              },
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
      purposeOfVisit: 'Other',
      otherPurposeOfVisit: 'See additional information',
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
          selectedDates: ['2019-11-20T12:00:00.000'],
          vaParent: '983',
          vaFacility: '983GB',
          facilityType: 'vamc',
          typeOfCareId: 'SLEEP',
          typeOfSleepCareId: '349',
        },
        parentFacilities: [
          {
            id: '983',
            identifier: [
              {
                system: VHA_FHIR_ID,
                value: '983',
              },
            ],
          },
        ],
        facilities: {
          '349': [
            {
              id: '983GB',
              identifier: [
                {
                  system: VHA_FHIR_ID,
                  value: '983GB',
                },
              ],
              name: 'Cheyenne VA Medical Center',
              address: {
                city: 'Cheyenne',
                state: 'WY',
              },
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
          vapContactInfo: {},
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
          selectedDates: ['2019-11-20T12:00:00.000'],
          facilityType: 'communityCare',
          typeOfCareId: '323',
        },
        facilities: {},
        facilityDetails: {},
        clinics: {},
        eligibility: {},
        ccEnabledSystems: [
          {
            id: '983',
            identifier: [
              {
                system: VHA_FHIR_ID,
                value: '983',
              },
            ],
            name: 'CHYSHR-Cheyenne VA Medical Center',
            address: {
              city: 'Cheyenne',
              state: 'WY',
            },
          },
          {
            id: '984',
            identifier: [
              {
                system: VHA_FHIR_ID,
                value: '984',
              },
            ],
            address: {
              city: 'Dayton',
              state: 'OH',
            },
          },
        ],
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
      purposeOfVisit: 'other',
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
          vapContactInfo: {},
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
          selectedDates: ['2019-11-20T12:00:00.000'],
          facilityType: 'communityCare',
          typeOfCareId: '203',
          audiologyType: 'CCAUDHEAR',
        },
        facilities: {},
        facilityDetails: {},
        clinics: {},
        eligibility: {},
        ccEnabledSystems: [
          {
            id: '983',
            identifier: [
              {
                system: VHA_FHIR_ID,
                value: '983',
              },
            ],
            name: 'CHYSHR-Cheyenne VA Medical Center',
            address: {
              city: 'Cheyenne',
              state: 'WY',
            },
          },
          {
            id: '984',
            identifier: [
              {
                system: VHA_FHIR_ID,
                value: '984',
              },
            ],
            address: {
              city: 'Dayton',
              state: 'OH',
            },
          },
        ],
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
      purposeOfVisit: 'other',
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
          vapContactInfo: {},
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
          selectedDates: ['2019-11-22T09:30:00'],
          preferredDate: '2019-12-02',
          clinicId: '983_308',
          vaParent: '983',
          vaFacility: '983',
          facilityType: 'vamc',
          typeOfCareId: '323',
        },
        availableSlots: [
          {
            start: '2019-12-22T09:30:00',
            end: '2019-12-22T10:00:00',
          },
          {
            start: '2019-11-22T09:30:00',
            end: '2019-11-22T10:00:00',
          },
        ],
        parentFacilities: [
          {
            id: '983',
            identifier: [
              {
                system: VHA_FHIR_ID,
                value: '983',
              },
            ],
            address: {
              city: 'Cheyenne',
              state: 'WY',
            },
          },
        ],
        facilities: {
          '323': [
            {
              id: '983',
              identifier: [
                {
                  system: VHA_FHIR_ID,
                  value: '983',
                },
              ],
              name: 'Cheyenne VA Medical Center',
              address: {
                city: 'Cheyenne',
                state: 'WY',
              },
              legacyVAR: {
                institutionTimezone: 'America/Denver',
              },
            },
          ],
        },
        clinics: {
          '983_323': [
            {
              id: '983_308',
              resourceType: 'HealthcareService',
              identifier: [
                {
                  system: 'http://med.va.gov/fhir/urn',
                  value: 'urn:va:healthcareservice:983:983:308',
                },
              ],
              serviceName: 'CHY PC KILPATRICK',
              characteristic: [
                {
                  coding: {
                    code: '983',
                    userSelected: false,
                  },
                  text: 'institutionCode',
                },
                {
                  coding: {
                    display: 'CHYSHR-Cheyenne VA Medical Center',
                    userSelected: false,
                  },
                  text: 'institutionName',
                },
                {
                  coding: {
                    display: 'Green Team Clinic1',
                    userSelected: false,
                  },
                  text: 'clinicFriendlyLocationName',
                },
              ],
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
          selectedDates: ['2019-11-20T12:00:00.000'],
          vaParent: '983',
          vaFacility: '983GB',
          facilityType: 'vamc',
          typeOfCareId: 'EYE',
          typeOfEyeCareId: '407',
        },
        parentFacilities: [
          {
            id: '983',
            identifier: [
              {
                system: VHA_FHIR_ID,
                value: '983',
              },
            ],
          },
        ],
        facilities: {
          '407': [
            {
              id: '983GB',
              identifier: [
                {
                  system: VHA_FHIR_ID,
                  value: '983GB',
                },
              ],
              name: 'Cheyenne VA Medical Center',
              address: {
                city: 'Cheyenne',
                state: 'WY',
              },
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

  it('should transform form using provider selection into CC request', () => {
    const state = {
      featureToggles: {
        vaOnlineSchedulingProviderSelection: true,
      },
      user: {
        profile: {
          facilities: [{ facilityId: '983', isCerner: false }],
          vapContactInfo: {
            residentialAddress: {
              addressLine1: '123 big sky st',
              city: 'Cincinnati',
              stateCode: 'OH',
              zipCode: '45220',
              latitude: 39.1,
              longitude: -84.6,
            },
          },
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
          communityCareProvider: {
            name: 'Practice',
            address: {
              line: ['456 elm st', 'sfasdf'],
              state: 'MA',
              city: 'northampton',
              postalCode: '01050',
            },
          },
          selectedDates: ['2019-11-20T12:00:00.000'],
          facilityType: 'communityCare',
          typeOfCareId: '323',
        },
        facilities: {},
        facilityDetails: {},
        clinics: {},
        eligibility: {},
        ccEnabledSystems: [
          {
            id: '983',
            identifier: [
              {
                system: VHA_FHIR_ID,
                value: '983',
              },
            ],
            name: 'CHYSHR-Cheyenne VA Medical Center',
            address: {
              city: 'Cheyenne',
              state: 'WY',
            },
          },
          {
            id: '984',
            identifier: [
              {
                system: VHA_FHIR_ID,
                value: '984',
              },
            ],
            address: {
              city: 'Dayton',
              state: 'OH',
            },
          },
        ],
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
      purposeOfVisit: 'other',
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
      preferredCity: 'Cincinnati',
      preferredState: 'OH',
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
  it('should transform form into CC request for VAOS service', () => {
    const state = {
      featureToggles: {
        vaOnlineSchedulingProviderSelection: true,
      },
      user: {
        profile: {
          facilities: [{ facilityId: '983', isCerner: false }],
          vapContactInfo: {
            residentialAddress: {
              addressLine1: 'PSC 808 Box 37',
              city: 'FPO',
              latitude: 37.5615,
              longitude: -121.9988,
              stateCode: 'AE',
              zipCode: '09618',
            },
          },
        },
      },
      newAppointment: {
        ccEnabledSystems: [
          {
            resourceType: 'Organization',
            id: '983',
            name: 'CHYSHR-Cheyenne VA Medical Center',
            address: [
              {
                line: [],
                city: 'Cheyenne',
                state: 'WY',
                postalCode: null,
              },
            ],
          },
          {
            resourceType: 'Organization',
            id: '984',
            name: 'DAYTSHR -Dayton VA Medical Center',
            address: [
              {
                line: [],
                city: 'Dayton',
                state: 'OH',
                postalCode: null,
              },
            ],
          },
        ],
        data: {
          phoneNumber: '5035551234',
          bestTimeToCall: {
            morning: true,
            afternoon: true,
          },
          email: 'veteran@gmail.com',
          reasonAdditionalInfo: 'This is a reason',
          preferredLanguage: 'english',
          communityCareSystemId: '984',
          communityCareProvider: {
            id: '1952935777',
            identifier: [
              {
                system: 'PPMS',
                value: '1952935777',
              },
            ],
            resourceType: 'Location',
            address: {
              line: ['7700 LITTLE RIVER TPKE STE 102'],
              city: 'ANNANDALE',
              state: 'VA',
              postalCode: '22003-2400',
            },
            name: 'OH, JANICE',
            position: {
              longitude: -77.211165,
              latitude: 38.833571,
            },
            telecom: [
              {
                system: 'phone',
                value: '703-752-4623',
              },
            ],
            distanceFromResidentialAddress: 2409,
          },
          typeOfCareId: 'tbd-podiatry',
          facilityType: 'communityCare',
          selectedDates: ['2021-05-25T00:00:00.000', '2021-05-26T12:00:00.000'],
        },
      },
    };
    const data = transformFormToVAOSCCRequest(state);
    expect(data).to.deep.equal({
      kind: 'cc',
      status: 'proposed',
      locationId: '984',
      serviceType: 'CCPOD',
      reason: 'This is a reason',
      contact: {
        telecom: [
          {
            type: 'phone',
            value: '5035551234',
          },
          {
            type: 'email',
            value: 'veteran@gmail.com',
          },
        ],
      },
      requestedPeriods: [
        {
          start: '2021-05-25T00:00:00Z',
          end: '2021-05-25T11:59:00Z',
        },
        {
          start: '2021-05-26T12:00:00Z',
          end: '2021-05-26T23:59:00Z',
        },
      ],
      preferredTimesForPhoneCall: ['Morning', 'Afternoon'],
      preferredLanguage: 'English',
      preferredCity: 'FPO, AE',
      practitioners: ['1952935777'],
    });
  });
});
