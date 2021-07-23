import { expect } from 'chai';
import omit from 'platform/utilities/data/omit';
import sinon from 'sinon';
import { diff } from 'just-diff';
import { mockFetch, setFetchJSONResponse } from 'platform/testing/unit/helpers';

import { fetchBookedAppointment } from '../../../services/appointment';
import { VIDEO_TYPES } from '../../../utils/constants';
import moment from '../../../lib/moment-tz';

function getAppointmentMock({
  id = null,
  email = null,
  currentStatus = null,
  version = 0,
  clinicFriendlyName = null,
  clinicName = null,
  instructionsTitle = null,
  communityCareProvider = null,
  timezone = null,
  ...fields
} = {}) {
  const fieldsWithoutProps = omit(['email'], fields);
  if (version === 0 && fields.kind !== 'cc') {
    const vdsAppointments = [];
    const vvsAppointments = [];
    let vistaStatus = currentStatus;

    if (
      !vistaStatus &&
      (fields.kind !== 'telehealth' || fields.vvsKind === VIDEO_TYPES.clinic)
    ) {
      if (fields.status === 'cancelled') {
        vistaStatus = 'CANCELLED BY PATIENT';
      } else if (
        fields.status === 'booked' &&
        moment().isSameOrAfter(fields.start)
      ) {
        vistaStatus = 'CHECKED OUT';
      } else if (fields.status === 'booked') {
        vistaStatus = 'FUTURE';
      }
    }

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

    if (fields.kind === 'telehealth') {
      vvsAppointments.push({
        id,
        appointmentKind: fields.telehealth.vvsKind,
        sourceSystem: 'VCM',
        dateTime: fields.start,
        duration: fields.minutesDuration || null,
        status: { description: null, code: 'FUTURE' },
        schedulingRequestType: null,
        type: null,
        bookingNotes: fields.comment,
        instructionsOther: null,
        instructionsTitle,
        patients: [
          {
            name: { firstName: 'JUDY', lastName: 'MORRISON' },
            contactInformation: {
              mobile: null,
              preferredEmail: email || null,
            },
            location: {
              type: 'NonVA',
              facility: {
                name: null,
                siteCode: fields.locationId?.substr(0, 3),
                timeZone: null,
              },
            },
            patientAppointment: true,
            virtualMeetingRoom: {
              conference: null,
              pin: null,
              url: fields.telehealth.url,
            },
          },
        ],
        tasInfo: fields.telehealth.atlas || null,
        providers:
          fields.practitioners?.map(p => ({
            name: {
              firstName: p.firstName,
              lastName: p.lastName,
            },
          })) || [],
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
        char4: fields.serviceType === 'covid' ? 'CDQC' : null,
        vdsAppointments,
        vvsAppointments,
      },
    };
  }

  if (version === 0 && fields.kind === 'cc') {
    return {
      id,
      type: 'cc_appointments',
      attributes: {
        appointmentRequestId: id,
        distanceEligibleConfirmed: true,
        name: { firstName: null, lastName: null },
        providerPractice: communityCareProvider.name,
        providerPhone: communityCareProvider.caresitePhone,
        address: {
          street: communityCareProvider.street,
          city: communityCareProvider.city,
          state: communityCareProvider.state,
          zipCode: communityCareProvider.zip,
        },
        instructionsToVeteran: fields.comment,
        appointmentTime: moment(fields.start)
          .utc()
          .format('MM/DD/YYYY HH:mm:ss'),
        timeZone: moment(fields.start)
          .tz(moment.tz.guess())
          .format('Z z'),
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
        practitioners: communityCareProvider
          ? [
              {
                id: { system: 'HSRM', value: communityCareProvider.uniqueId },
              },
            ]
          : null,
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

function getVideoAppointmentMock({
  id = null,
  locationId = null,
  vvsKind = null,
  providers = [],
  instructionsTitle = null,
  start = null,
  clinicId = null,
  clinicName = null,
  clinicFriendlyName = null,
  atlasConfirmationCode = null,
  atlasAddress = null,
  appointmentLength = null,
  currentStatus = null,
  email = null,
  url = null,
} = {}) {
  const vdsAppointments = [];

  if (vvsKind === VIDEO_TYPES.clinic) {
    vdsAppointments.push({
      bookingNote: null,
      appointmentLength,
      appointmentTime: start,
      clinic: {
        name: clinicName,
        askForCheckIn: false,
        facilityCode: locationId?.substr(0, 3) || null,
      },
      type: 'REGULAR',
      currentStatus,
    });
  }

  const vvsAppointment = {
    id,
    appointmentKind: vvsKind,
    sourceSystem: null,
    dateTime: start,
    duration: appointmentLength || null,
    status: { description: null, code: 'FUTURE' },
    schedulingRequestType: null,
    type: null,
    bookingNotes: null,
    instructionsOther: null,
    instructionsTitle,
    patients: [
      {
        name: { firstName: 'JUDY', lastName: 'MORRISON' },
        contactInformation: {
          mobile: null,
          preferredEmail: email || null,
        },
        location: {
          type: 'NonVA',
          facility: {
            name: null,
            siteCode: locationId?.substr(0, 3),
            timeZone: null,
          },
        },
        patientAppointment: true,
        virtualMeetingRoom: {
          conference: null,
          pin: null,
          url,
        },
      },
    ],
    providers,
  };

  if (atlasAddress) {
    vvsAppointment.tasInfo = {
      siteCode: null,
      slotId: null,
      confirmationCode: atlasConfirmationCode,
      address: atlasAddress,
      contacts: [],
    };
  }

  return {
    id,
    type: 'appointment',
    attributes: {
      startDate: start || null,
      clinicFriendlyName,
      clinicId: clinicId || null,
      facilityId: locationId?.substr(0, 3) || null,
      sta6aid: locationId || null,
      communityCare: false,
      phoneOnly: false,
      char4: null,
      vdsAppointments,
      vvsAppointments: [vvsAppointment],
    },
  };
}

describe('VAOS Appointment service', () => {
  describe('fetchBookedAppointment', () => {
    beforeEach(() => mockFetch());
    it('should return an in person VA appointment', async () => {
      const data = {
        id: '1234',
        start: moment()
          .add(3, 'days')
          .format(),
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

      // differences format is http://jsonpatch.com/
      const differences = diff(v2Result, v0Result);
      expect(differences).to.have.deep.members(
        [
          // The v2 endpoint doesn't send us the clinic name
          {
            op: 'replace',
            path: ['location', 'clinicName'],
            value: 'Friendly clinic name',
          },
          // The v2 endpoint doesn't send us the vista status
          { op: 'replace', path: ['description'], value: 'FUTURE' },
        ],
        'Transformers for v0 and v2 appointment data are out of sync',
      );
    });

    it('should return a cancelled VA appointment', async () => {
      const data = {
        id: '1234',
        start: moment()
          .add(3, 'days')
          .format(),
        email: 'test@va.gov',
        kind: 'clinic',
        locationId: '552GA',
        clinic: '5544',
        status: 'cancelled',
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

      // differences format is http://jsonpatch.com/
      const differences = diff(v2Result, v0Result);
      expect(differences).to.have.deep.members(
        [
          // The v2 endpoint doesn't send us the vista status
          {
            op: 'replace',
            path: ['description'],
            value: 'CANCELLED BY PATIENT',
          },
        ],
        'Transformers for v0 and v2 appointment data are out of sync',
      );
    });

    it('should return a past VA appointment', async () => {
      const data = {
        id: '1234',
        start: moment()
          .subtract(3, 'days')
          .format(),
        email: 'test@va.gov',
        kind: 'clinic',
        locationId: '552GA',
        clinic: '5544',
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

      // differences format is http://jsonpatch.com/
      const differences = diff(v2Result, v0Result);
      expect(differences).to.have.deep.members(
        [
          // The v2 endpoint doesn't send us the vista status
          { op: 'replace', path: ['description'], value: 'CHECKED OUT' },
        ],
        'Transformers for v0 and v2 appointment data are out of sync',
      );
    });

    it('should return a VA phone appointment', async () => {
      const data = {
        id: '1234',
        start: moment()
          .subtract(3, 'days')
          .format(),
        email: 'test@va.gov',
        kind: 'phone',
        locationId: '552GA',
        clinic: '5544',
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

      // differences format is http://jsonpatch.com/
      const differences = diff(v2Result, v0Result);
      expect(differences).to.have.deep.members(
        [
          // The v2 endpoint doesn't send us the vista status
          { op: 'replace', path: ['description'], value: 'CHECKED OUT' },
        ],
        'Transformers for v0 and v2 appointment data are out of sync',
      );
    });

    it('should return a VA covid vaccine appointment', async () => {
      const data = {
        id: '1234',
        start: moment()
          .subtract(3, 'days')
          .format(),
        email: 'test@va.gov',
        kind: 'clinic',
        locationId: '552GA',
        clinic: '5544',
        status: 'booked',
        serviceType: 'covid',
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

      // differences format is http://jsonpatch.com/
      const differences = diff(v2Result, v0Result);
      expect(differences).to.have.deep.members(
        [
          // The v2 endpoint doesn't send us the vista status
          { op: 'replace', path: ['description'], value: 'CHECKED OUT' },
        ],
        'Transformers for v0 and v2 appointment data are out of sync',
      );
    });

    it('should return a VVC at home video appointment', async () => {
      const data = {
        id: '1234',
        start: moment()
          .add(3, 'days')
          .format(),
        email: 'test@va.gov',
        kind: 'telehealth',
        locationId: '552',
        status: 'booked',
        minutesDuration: 60,
        telehealth: {
          vvsKind: VIDEO_TYPES.adhoc,
          url: 'testing',
        },
        practitioners: [
          {
            firstName: 'Meg',
            lastName: 'Doe',
          },
        ],
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

      // differences format is http://jsonpatch.com/
      const differences = diff(v2Result, v0Result);
      expect(differences).to.have.deep.members(
        [
          // The v2 endpoint doesn't send us the vista status
          { op: 'replace', path: ['description'], value: 'FUTURE' },
        ],
        'Transformers for v0 and v2 appointment data are out of sync',
      );
    });

    it('should return an ATLAS video appointment', async () => {
      const data = {
        id: '1234',
        start: moment()
          .add(3, 'days')
          .format(),
        email: 'test@va.gov',
        kind: 'telehealth',
        locationId: '552',
        status: 'booked',
        minutesDuration: 60,
        telehealth: {
          vvsKind: VIDEO_TYPES.adhoc,
          url: 'testing',
          atlas: {
            siteCode: '1234',
            confirmationCode: 'A523',
            address: {
              streetAddress: '114 Dewey Ave',
              city: 'Eureka',
              state: 'MT',
              zipCode: '59917',
              country: 'USA',
              longitude: -115.1,
              latitude: 48.8,
            },
          },
        },
        practitioners: [
          {
            firstName: 'Meg',
            lastName: 'Doe',
          },
        ],
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

      // differences format is http://jsonpatch.com/
      const differences = diff(v2Result, v0Result);
      expect(differences).to.have.deep.members(
        [
          // The v2 endpoint doesn't send us the vista status
          { op: 'replace', path: ['description'], value: 'FUTURE' },
        ],
        'Transformers for v0 and v2 appointment data are out of sync',
      );
    });

    it('should return a clinic based video appointment', async () => {
      const data = {
        id: '1234',
        start: moment()
          .add(3, 'days')
          .format(),
        email: 'test@va.gov',
        kind: 'telehealth',
        locationId: '552',
        clinicId: '5544',
        status: 'booked',
        minutesDuration: 60,
        telehealth: {
          vvsKind: VIDEO_TYPES.clinic,
        },
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

      // differences format is http://jsonpatch.com/
      const differences = diff(v2Result, v0Result);
      expect(differences).to.have.deep.members(
        [
          // The v2 endpoint doesn't send us the vista status
          { op: 'replace', path: ['description'], value: 'FUTURE' },
        ],
        'Transformers for v0 and v2 appointment data are out of sync',
      );
    });

    it('should return a store forward video appointment', async () => {
      const data = {
        id: '1234',
        start: moment()
          .add(3, 'days')
          .format(),
        email: 'test@va.gov',
        kind: 'telehealth',
        locationId: '552',
        clinicId: '5544',
        status: 'booked',
        minutesDuration: 60,
        telehealth: {
          vvsKind: VIDEO_TYPES.storeForward,
        },
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

      // differences format is http://jsonpatch.com/
      const differences = diff(v2Result, v0Result);
      expect(differences).to.have.deep.members(
        [
          // The v2 endpoint doesn't send us the vista status
          { op: 'replace', path: ['description'], value: 'FUTURE' },
        ],
        'Transformers for v0 and v2 appointment data are out of sync',
      );
    });

    it('should return a mobile any video appointment', async () => {
      const data = {
        id: '1234',
        start: moment()
          .add(3, 'days')
          .format(),
        email: 'test@va.gov',
        kind: 'telehealth',
        status: 'booked',
        minutesDuration: 60,
        telehealth: {
          vvsKind: VIDEO_TYPES.mobile,
        },
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

      // differences format is http://jsonpatch.com/
      const differences = diff(v2Result, v0Result);
      expect(differences).to.have.deep.members(
        [
          // The v2 endpoint doesn't send us the vista status
          { op: 'replace', path: ['description'], value: 'FUTURE' },
        ],
        'Transformers for v0 and v2 appointment data are out of sync',
      );
    });

    it('should return a mobile gfe video appointment', async () => {
      const data = {
        id: '1234',
        start: moment()
          .add(3, 'days')
          .format(),
        email: 'test@va.gov',
        kind: 'telehealth',
        status: 'booked',
        minutesDuration: 60,
        telehealth: {
          vvsKind: VIDEO_TYPES.gfe,
        },
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

      // differences format is http://jsonpatch.com/
      const differences = diff(v2Result, v0Result);
      expect(differences).to.have.deep.members(
        [
          // The v2 endpoint doesn't send us the vista status
          { op: 'replace', path: ['description'], value: 'FUTURE' },
        ],
        'Transformers for v0 and v2 appointment data are out of sync',
      );
    });

    it('should return a community care appointment', async () => {
      const data = {
        id: '1234',
        start: moment()
          .add(3, 'days')
          .format(),
        kind: 'cc',
        status: 'booked',
        minutesDuration: 60,
        communityCareProvider: {
          uniqueId: 'ppmsid',
          address: {
            street: '1012 14TH ST NW STE 700',
            city: 'WASHINGTON',
            state: 'DC',
            zip: '20005-3477',
          },
          caresitePhone: '202-638-0750',
          name: 'CAMPBELL, WILLIAM',
        },
      };

      setFetchJSONResponse(
        global.fetch.withArgs(sinon.match(`/vaos/v2/appointments/${data.id}`)),
        { data: getAppointmentMock({ version: 2, ...data }) },
      );
      setFetchJSONResponse(
        global.fetch.withArgs(sinon.match(`/vaos/v0/appointments`)),
        { data: [getAppointmentMock({ version: 0, ...data })] },
      );

      const [v2Result, v0Result] = await Promise.all([
        fetchBookedAppointment({
          id: data.id,
          type: 'cc',
          useV2: true,
        }),
        fetchBookedAppointment({ id: data.id, type: 'cc' }),
      ]);

      // These are always different
      delete v0Result.vaos.apiData;
      delete v2Result.vaos.apiData;

      // This is always missing on v2, has to be fetched separately
      // Setting it to null here because the diff is very long otherwise
      v0Result.communityCareProvider = null;

      // differences format is http://jsonpatch.com/
      const differences = diff(v2Result, v0Result);
      expect(differences).to.have.deep.members(
        [
          {
            op: 'replace',
            path: ['vaos', 'timeZone'],
            value: moment(data.start)
              .tz(moment.tz.guess())
              .format('Z z'),
          },
          {
            op: 'add',
            path: ['preferredCommunityCareProviders'],
            value: undefined,
          },
        ],
        'Transformers for v0 and v2 appointment data are out of sync',
      );
    });
    //should return an error
  });
  //should return a VA request
  //should return a community care request
});
