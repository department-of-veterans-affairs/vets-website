/* eslint-disable @department-of-veterans-affairs/axe-check-required */
import { expect } from 'chai';

import {
  transformFormToVAOSAppointment,
  transformFormToVAOSVARequest,
} from '../../../../new-appointment/redux/helpers/formSubmitTransformers.v2';
import { FLOW_TYPES, VHA_FHIR_ID } from '../../../../utils/constants';

describe('VAOS V2 data transformation', () => {
  describe('VA booked', () => {
    it('remove slot.start and slot.end from new appointment object', () => {
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
                serviceName: 'Green Team Clinic1',
                stationId: '983',
                stationName: 'CHYSHR-Cheyenne VA Medical Center',
              },
            ],
          },
        },
        featureToggles: {},
      };

      const stateWithSlotId = {
        ...state,
        newAppointment: {
          ...state.newAppointment,
          availableSlots: [
            { ...state.newAppointment.availableSlots[0], id: 'test' },
            { ...state.newAppointment.availableSlots[1], id: 'test2' },
          ],
        },
      };

      const data = transformFormToVAOSAppointment(stateWithSlotId);
      expect(data).to.deep.equal({
        kind: 'clinic',
        status: 'booked',
        clinic: '308',
        slot: {
          id: 'test2',
        },
        extension: { desiredDate: '2019-12-02T00:00:00+00:00' },
        locationId: '983',
        reasonCode: {
          coding: [
            {
              code: 'Routine Follow-up',
            },
          ],
          text: 'asdfasdf',
        },
      });
    });

    it('should set reason code only', () => {
      // When user select 'other' for reason for appointment
      const state = {
        featureToggles: {
          vaOnlineSchedulingFacilitiesServiceV2: true,
          vaOnlineSchedulingVAOSServiceVAAppointments: true,
        },
        newAppointment: {
          pages: {},
          data: {
            typeOfCareId: '323',
            phoneNumber: '2234567890',
            email: 'joeblow@gmail.com',
            reasonForAppointment: 'other',
            reasonAdditionalInfo: 'I need an appt',
            vaParent: '983',
            vaFacility: '983',
            clinicId: '983_308',
            preferredDate: '2019-12-02',
            selectedDates: ['2019-11-22T09:30:00'],
          },
          facilityDetails: {
            '983': {
              id: '983',
              name: 'Cheyenne VA Medical Center',
              address: {
                postalCode: '82001-5356',
                city: 'Cheyenne',
                state: 'WY',
                line: ['2360 East Pershing Boulevard'],
              },
            },
          },
          facilities: {
            '323': [
              {
                id: '983',
                name: 'Cheyenne VA Medical Center',
                identifier: [
                  { system: 'urn:oid:2.16.840.1.113883.6.233', value: '983' },
                ],
                address: {
                  postalCode: '82001-5356',
                  city: 'Cheyenne',
                  state: 'WY',
                  line: ['2360 East Pershing Boulevard'],
                },
                telecom: [{ system: 'phone', value: '307-778-7550' }],
              },
            ],
          },
          availableSlots: [
            {
              id: 'test2',
              start: '2019-11-22T09:30:00',
              end: '2019-11-22T09:30:00',
            },
          ],
          clinics: {
            '983_323': [
              {
                id: '983_308',
                serviceName: 'Some VA clinic',
                stationId: '983',
                stationName: 'Cheyenne VA Medical Center',
              },
            ],
          },
        },
      };
      const data = transformFormToVAOSAppointment(state);

      // then reasonCode.coding should be null or an empty array
      // and reasonCode.text should be populated with user entered additional text
      expect(data).to.deep.equal({
        kind: 'clinic',
        status: 'booked',
        clinic: '308',
        slot: {
          id: 'test2',
        },
        extension: { desiredDate: '2019-12-02T00:00:00+00:00' },
        locationId: '983',
        reasonCode: {
          coding: undefined,
          text: 'I need an appt',
        },
      });
    });

    it('should set reason code and reason text only', () => {
      // When user select anything but 'other' for reason for appointment
      const state = {
        featureToggles: {
          vaOnlineSchedulingFacilitiesServiceV2: true,
          vaOnlineSchedulingVAOSServiceVAAppointments: true,
        },
        newAppointment: {
          pages: {},
          data: {
            typeOfCareId: '323',
            phoneNumber: '2234567890',
            email: 'joeblow@gmail.com',
            reasonForAppointment: 'routine-follow-up',
            reasonAdditionalInfo: 'I need an appt',
            vaParent: '983',
            vaFacility: '983',
            clinicId: '983_308',
            preferredDate: '2019-12-02',
            selectedDates: ['2019-11-22T09:30:00'],
          },
          facilityDetails: {
            '983': {
              id: '983',
              name: 'Cheyenne VA Medical Center',
              address: {
                postalCode: '82001-5356',
                city: 'Cheyenne',
                state: 'WY',
                line: ['2360 East Pershing Boulevard'],
              },
            },
          },
          facilities: {
            '323': [
              {
                id: '983',
                name: 'Cheyenne VA Medical Center',
                identifier: [
                  { system: 'urn:oid:2.16.840.1.113883.6.233', value: '983' },
                ],
                address: {
                  postalCode: '82001-5356',
                  city: 'Cheyenne',
                  state: 'WY',
                  line: ['2360 East Pershing Boulevard'],
                },
                telecom: [{ system: 'phone', value: '307-778-7550' }],
              },
            ],
          },
          availableSlots: [
            {
              id: 'test2',
              start: '2019-11-22T09:30:00',
              end: '2019-11-22T09:30:00',
            },
          ],
          clinics: {
            '983_323': [
              {
                id: '983_308',
                serviceName: 'Some VA clinic',
                stationId: '983',
                stationName: 'Cheyenne VA Medical Center',
              },
            ],
          },
        },
      };
      const data = transformFormToVAOSAppointment(state);

      // then reasonCode.coding should contain the reason for the appointment
      // and reasonCode.text should be populated with user entered additional text
      expect(data).to.deep.equal({
        kind: 'clinic',
        status: 'booked',
        clinic: '308',
        slot: {
          id: 'test2',
        },
        extension: { desiredDate: '2019-12-02T00:00:00+00:00' },
        locationId: '983',
        reasonCode: {
          coding: [
            {
              code: 'Routine Follow-up',
            },
          ],
          text: 'I need an appt',
        },
      });
    });
  });

  describe('VA request', () => {
    it('request body is valid', () => {
      const state = {
        newAppointment: {
          data: {
            phoneNumber: '5035551234',
            bestTimeToCall: {
              morning: true,
            },
            email: 'test@va.gov',
            visitType: 'clinic',
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
          flowType: FLOW_TYPES.REQUEST,
        },
        featureToggles: {},
      };

      const data = transformFormToVAOSVARequest(state);
      expect(data).to.deep.equal({
        kind: 'clinic',
        status: 'proposed',
        locationId: '983GB',
        serviceType: 'cpap',
        reasonCode: {
          coding: [{ code: 'Routine Follow-up' }],
          text: 'Testing',
        },
        // comment: 'Testing',
        contact: {
          telecom: [
            { type: 'phone', value: '5035551234' },
            { type: 'email', value: 'test@va.gov' },
          ],
        },
        requestedPeriods: [
          { start: '2019-11-20T12:00:00Z', end: '2019-11-20T23:59:00Z' },
        ],
        preferredTimesForPhoneCall: ['Morning'],
      });
    });

    it('reasonCode text is 100 characters and less when My reason isn/`t listed is chosen', () => {
      // Given a user has entered 250 max characters for additional information
      const reasonAdditionalInfo =
        'The quick brown fox jumped over the lazy dog. The quick brown fox jumped over the lazy dog. The quick brown fox jumped over the lazy dog.';
      // When the VA request is submitted
      const state = {
        newAppointment: {
          data: {
            phoneNumber: '5035551234',
            bestTimeToCall: {
              morning: true,
            },
            email: 'test@va.gov',
            visitType: 'clinic',
            reasonForAppointment: 'other',
            reasonAdditionalInfo,
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
          flowType: FLOW_TYPES.REQUEST,
        },
        featureToggles: {},
      };

      const data = transformFormToVAOSVARequest(state);
      // Then the reasonCode text will submit the first 100 characters
      expect(data).to.deep.equal({
        kind: 'clinic',
        status: 'proposed',
        locationId: '983GB',
        serviceType: 'cpap',
        reasonCode: {
          coding: undefined,
          text: reasonAdditionalInfo.slice(0, 100),
        },
        // comment: reasonAdditionalInfo,
        contact: {
          telecom: [
            { type: 'phone', value: '5035551234' },
            { type: 'email', value: 'test@va.gov' },
          ],
        },
        requestedPeriods: [
          { start: '2019-11-20T12:00:00Z', end: '2019-11-20T23:59:00Z' },
        ],
        preferredTimesForPhoneCall: ['Morning'],
      });
    });
  });
});
