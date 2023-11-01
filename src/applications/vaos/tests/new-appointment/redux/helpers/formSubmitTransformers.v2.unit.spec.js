import { expect } from 'chai';

import {
  transformFormToVAOSAppointment,
  transformFormToVAOSVARequest,
} from '../../../../new-appointment/redux/helpers/formSubmitTransformers.v2';
import { FLOW_TYPES, VHA_FHIR_ID } from '../../../../utils/constants';
import { getReasonCode } from '../../../../new-appointment/redux/helpers/getReasonCode';

describe('VAOS V2 data transformation', () => {
  describe('VA booked and Acheron feature toggle is on', () => {
    it('remove slot.start and slot.end from new appointment object', () => {
      const state = {
        featureToggles: { vaOnlineSchedulingAcheronService: true },
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
      };

      // when the reason text is combined with appointment information
      const reasonTextTransformed = getReasonCode({
        data: state.newAppointment.data,
        isCC: false,
        isAcheron: true,
        isDS: true,
      });

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
        reasonCode: reasonTextTransformed,
      });
    });
  });

  describe('VA request', () => {
    it('request body is valid when Acheron is off', () => {
      const state = {
        featureToggles: { vaOnlineSchedulingAcheronService: false },
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
      };

      const data = transformFormToVAOSVARequest(state);
      expect(data).to.deep.equal({
        kind: 'clinic',
        status: 'proposed',
        locationId: '983GB',
        serviceType: 'cpap',
        reasonCode: {
          coding: [{ code: 'Routine/Follow-up' }],
          text: 'Testing',
        },
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

    it('request body is valid when Acheron is on', () => {
      const superLongText =
        'The quick brown fox jumped over the lazy dog. The quick brown fox jumped over the lazy dog. The quick brown fox jumped over the lazy dog. The quick brown fox jumped over the lazy dog. The quick brown fox jumped over the lazy dog. The quick brown fox jumped over the lazy dog.';
      // Given the VA request is submitted and Acheron service toggle is on
      const state = {
        featureToggles: { vaOnlineSchedulingAcheronService: true },
        newAppointment: {
          data: {
            phoneNumber: '5035551234',
            bestTimeToCall: {
              morning: true,
            },
            email: 'test@va.gov',
            visitType: 'clinic',
            reasonForAppointment: 'other',
            reasonAdditionalInfo: superLongText,
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
      };
      // when the reason text is combined with appointment information
      const reasonTextTransformed = getReasonCode({
        data: state.newAppointment.data,
        isCC: false,
        isAcheron: true,
        isDS: false,
      });

      const data = transformFormToVAOSVARequest(state);
      // Then the request body will transform
      expect(data).to.deep.equal({
        kind: 'clinic',
        status: 'proposed',
        locationId: '983GB',
        serviceType: 'cpap',
        reasonCode: reasonTextTransformed,
        requestedPeriods: [
          { start: '2019-11-20T12:00:00Z', end: '2019-11-20T23:59:00Z' },
        ],
        preferredTimesForPhoneCall: ['Morning'],
      });
    });
  });
});
