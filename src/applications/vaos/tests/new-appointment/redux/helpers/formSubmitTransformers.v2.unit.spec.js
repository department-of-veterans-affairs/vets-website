import { expect } from 'chai';

import { transformFormToVAOSAppointment } from '../../../../new-appointment/redux/helpers/formSubmitTransformers.v2';
import { VHA_FHIR_ID } from '../../../../utils/constants';

describe('VAOS V2 data transformation', () => {
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
      comment: 'Follow-up/Routine: asdfasdf',
      contact: {
        telecom: [
          { type: 'phone', value: '5035551234' },
          { type: 'email', value: 'test@va.gov' },
        ],
      },
    });
  });
});
