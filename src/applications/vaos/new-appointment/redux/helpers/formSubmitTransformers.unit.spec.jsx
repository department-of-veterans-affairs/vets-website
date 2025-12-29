import { expect } from 'chai';

import {
  FLOW_TYPES,
  TYPE_OF_CARE_IDS,
  VHA_FHIR_ID,
} from '../../../utils/constants';
import {
  transformFormToVAOSAppointment,
  transformFormToVAOSCCRequest,
  transformFormToVAOSVARequest,
} from './formSubmitTransformers';
import { getReasonCode } from './getReasonCode';

describe('VAOS V2 data transformation', () => {
  describe('VA booked', () => {
    const initialState = {
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
          selectedDates: ['2019-11-22T09:30:00Z'],
          preferredDate: '2019-12-02',
          clinicId: '983_308',
          vaParent: '983',
          vaFacility: '983',
          facilityType: 'vamc',
          typeOfCareId: TYPE_OF_CARE_IDS.PRIMARY_CARE,
        },
        availableSlots: [
          {
            start: '2019-12-22T09:30:00Z',
            end: '2019-12-22T10:00:00Z',
          },
          {
            start: '2019-11-22T09:30:00Z',
            end: '2019-11-22T10:00:00Z',
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
    it('returns clinic id for clinic when appointment scheduled at VistA facility', () => {
      const state = {
        ...initialState,
        newAppointment: { ...initialState.newAppointment, ehr: 'vista' },
      };

      // when the reason text is combined with appointment information
      const reasonTextTransformed = getReasonCode({
        data: state.newAppointment.data,
        isCC: false,
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

    it('returns null for clinic when appointment scheduled at a OH facility', () => {
      const state = {
        ...initialState,
        newAppointment: { ...initialState.newAppointment, ehr: 'cerner' },
      };

      // when the reason text is combined with appointment information
      const reasonTextTransformed = getReasonCode({
        data: state.newAppointment.data,
        isCC: false,
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
        clinic: null,
        slot: {
          id: 'test2',
        },
        extension: { desiredDate: '2019-12-02T00:00:00+00:00' },
        locationId: '983',
        reasonCode: reasonTextTransformed,
      });
    });

    it('remove slot.start and slot.end from new appointment object', () => {
      const state = {
        ...initialState,
        newAppointment: { ...initialState.newAppointment, ehr: 'vista' },
      };

      // when the reason text is combined with appointment information
      const reasonTextTransformed = getReasonCode({
        data: state.newAppointment.data,
        isCC: false,
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
    it('request body is valid', () => {
      const superLongText =
        'The quick brown fox jumped over the lazy dog. The quick brown fox jumped over the lazy dog. The quick brown fox jumped over the lazy dog. The quick brown fox jumped over the lazy dog. The quick brown fox jumped over the lazy dog. The quick brown fox jumped over the lazy dog.';
      // Given the VA request is submitted
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
            reasonAdditionalInfo: superLongText,
            selectedDates: ['2019-11-20T12:00:00.000'],
            vaParent: '983',
            vaFacility: '983GB',
            facilityType: 'vamc',
            typeOfCareId: TYPE_OF_CARE_IDS.SLEEP_MEDICINE_ID,
            typeOfSleepCareId: TYPE_OF_CARE_IDS.CPAP_ID,
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

  describe('CC request', () => {
    it('request body is valid', () => {
      const superLongText =
        'The quick brown fox jumped over the lazy dog. The quick brown fox jumped over the lazy dog. The quick brown fox jumped over the lazy dog. The quick brown fox jumped over the lazy dog. The quick brown fox jumped over the lazy dog. The quick brown fox jumped over the lazy dog.';
      // Given the VA request is submitted
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
            reasonAdditionalInfo: superLongText,
            selectedDates: ['2019-11-20T12:00:00.000'],
            vaParent: '983',
            vaFacility: '983GB',
            facilityType: 'vamc',
            typeOfCareId: TYPE_OF_CARE_IDS.SLEEP_MEDICINE_ID,
            typeOfSleepCareId: TYPE_OF_CARE_IDS.CPAP_ID,
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
        isCC: true,
        isDS: false,
      });

      const data = transformFormToVAOSCCRequest(state);

      // Then the request body will transform
      expect(data).to.deep.equal({
        contact: {
          telecom: [
            {
              type: 'phone',
              value: '5035551234',
            },
            {
              type: 'email',
              value: 'test@va.gov',
            },
          ],
        },
        kind: 'cc',
        locationId: undefined,
        practitioners: [],
        preferredLanguage: undefined,
        preferredLocation: undefined,
        status: 'proposed',
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
