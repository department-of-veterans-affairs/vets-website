import { expect } from 'chai';
import omit from 'platform/utilities/data/omit';
import sinon from 'sinon';
import { diff } from 'just-diff';
import { mockFetch, setFetchJSONResponse } from 'platform/testing/unit/helpers';

import { fetchBookedAppointment } from '../../../services/appointment';
import { VIDEO_TYPES } from '../../../utils/constants';
import moment from 'moment';

function getAppointmentMock({
  id = null,
  email = null,
  vistaStatus = null,
  version = 0,
  clinicFriendlyName = null,
  clinicName = null,
  ...fields
} = {}) {
  const fieldsWithoutProps = omit(['email'], fields);
  if (version === 0) {
    const vdsAppointments = [];
    const vvsAppointments = [];

    if (
      fields.kind === 'clinic' ||
      fields.kind === 'phone' ||
      (fields.kind === 'telehealth' &&
        fields.telehealth.vvsKind === VIDEO_TYPES.clinic)
    ) {
      vdsAppointments.push({
        bookingNote: fields.comment,
        appointmentLength: fields.minutesDuration,
        appointmentTime: fields.start,
        clinic: {
          name: clinicName,
          askForCheckIn: false,
          facilityCode: fields.locationId?.substr(0, 3) || null,
        },
        type: 'REGULAR',
        currentStatus: vistaStatus,
      });
    }

    return {
      id,
      type: 'appointment',
      attributes: {
        startDate: fields.start || null,
        uniqueId: id,
        clinicFriendlyName,
        clinicId: fields.clinic || null,
        facilityId: fields.locationId?.substr(0, 3) || null,
        sta6aid: fields.locationId || null,
        communityCare: false,
        phoneOnly: fields.kind === 'phone',
        vdsAppointments,
        vvsAppointments,
      },
    };
  }

  if (version === 2) {
    return {
      id,
      type: 'appointments',
      attributes: {
        id,
        cancellationReason: null,
        clinic: null,
        comment: null,
        contact: {
          telecom: [
            {
              type: 'email',
              value: email,
            },
          ],
        },
        description: null,
        end: null,
        kind: null,
        locationId: null,
        minutesDuration: null,
        practitioners: null,
        preferredTimesForPhoneCall: null,
        priority: null,
        reason: null,
        requestedPeriods: null,
        serviceType: null,
        slot: null,
        start: null,
        status: null,
        telehealth: null,
        ...fieldsWithoutProps,
      },
    };
  }

  return null;
}

describe.only('VAOS Appointment service', () => {
  describe('fetchBookedAppointment', () => {
    beforeEach(() => mockFetch());
    it('should return an in person VA appointment', async () => {
      const start = moment().add(3, 'days');
      const data = {
        id: '1234',
        start: start.format(),
        email: 'test@va.gov',
        kind: 'clinic',
        locationId: '552GA',
        clinic: '5544',
        clinicFriendlyName: 'Friendly clinic name',
        serviceType: 'primaryCare',
        status: 'booked',
      };

      setFetchJSONResponse(
        global.fetch.withArgs(sinon.match(`/vaos/v2/appointments/${data.id}`)),
        { data: getAppointmentMock({ version: 2, ...data }) },
      );
      setFetchJSONResponse(
        global.fetch.withArgs(
          sinon.match(`/vaos/v0/appointments/va/${data.id}`),
        ),
        { data: getAppointmentMock({ version: 0, ...data }) },
      );

      const [v2Result, v0Result] = await Promise.all([
        fetchBookedAppointment({
          id: data.id,
          type: 'va',
          useV2: true,
        }),
        fetchBookedAppointment({ id: data.id, type: 'va' }),
      ]);

      // These are always different
      delete v0Result.vaos.apiData;
      delete v2Result.vaos.apiData;

      const differences = diff(v2Result, v0Result);
      expect(differences).to.deep.equal([
        // The v0 endpoint doesn't send us service type for booked appts
        { op: 'remove', path: ['type'] },
        // The v2 endpoint doesn't send us the vista status
        { op: 'add', path: ['description'], value: null },
        // The v2 endpoint doesn't send us the clinic name
        {
          op: 'add',
          path: ['location', 'clinicName'],
          value: 'Friendly clinic name',
        },
      ]);
      expect(v2Result.type).to.deep.equal({
        coding: [
          {
            code: data.serviceType,
            display: 'Primary care',
          },
        ],
      });
    });
    //should return a cancelled VA appointment
    //should return a past VA appointment
    //should return a VA phone appointment
    //should return a covid appointment
    //should return an adhoc video appointment
    //should return an ATLAS video appointment
    //should return a clinic based video appointment
    //should return a store forward video appointment
    //should return a mobile_any video appointment
    //should return a mobile_gfe video appointment
    //should return a community care appointment
    //should return an error
  });
});
