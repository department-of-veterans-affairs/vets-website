/* eslint-disable @department-of-veterans-affairs/axe-check-required */
import { expect } from 'chai';
import sinon from 'sinon';
import { diff } from 'just-diff';
import {
  mockFetch,
  setFetchJSONFailure,
  setFetchJSONResponse,
} from 'platform/testing/unit/helpers';

import {
  fetchBookedAppointment,
  getAppointmentRequests,
} from '../../../services/appointment';
import { VIDEO_TYPES } from '../../../utils/constants';
import moment from '../../../lib/moment-tz';
import { createMockAppointmentByVersion } from '../../mocks/data';
import { getLongTermAppointmentHistoryV2 } from '../../../services/vaos';
import {
  getDateRanges,
  mockVAOSAppointmentsFetch,
} from '../../mocks/helpers.v2';

describe('VAOS Appointment service', () => {
  describe('fetchBookedAppointment', () => {
    beforeEach(() => mockFetch());
    it('should return matching v0 and v2 data for an in person VA appointment', async () => {
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
        { data: createMockAppointmentByVersion({ version: 2, ...data }) },
      );
      setFetchJSONResponse(
        global.fetch.withArgs(
          sinon.match(`/vaos/v0/appointments/va/${data.id}`),
        ),
        { data: createMockAppointmentByVersion({ version: 0, ...data }) },
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
      delete v0Result.version;
      delete v2Result.version;

      // differences format is http://jsonpatch.com/
      const differences = diff(v2Result, v0Result);
      expect(differences).to.have.deep.members(
        [
          // The v2 endpoint doesn't send us the clinic name
          {
            op: 'replace',
            path: ['location', 'clinicName'],
            value: 'Friendly clinic name',
          }, // The v2 endpoint doesn't send us the vista status
          { op: 'replace', path: ['description'], value: 'FUTURE' },
          { op: 'remove', path: ['practitioners'] },
          { op: 'remove', path: ['vaos', 'facilityData'] },
        ],
        'Transformers for v0 and v2 appointment data are out of sync',
      );
    });

    it('should return matching v0 and v2 data for a cancelled VA appointment', async () => {
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
        { data: createMockAppointmentByVersion({ version: 2, ...data }) },
      );
      setFetchJSONResponse(
        global.fetch.withArgs(
          sinon.match(`/vaos/v0/appointments/va/${data.id}`),
        ),
        { data: createMockAppointmentByVersion({ version: 0, ...data }) },
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
      delete v0Result.version;
      delete v2Result.version;

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
          { op: 'remove', path: ['practitioners'] },
          { op: 'replace', path: ['cancelationReason'], value: 'pat' },
          { op: 'remove', path: ['vaos', 'facilityData'] },
        ],
        'Transformers for v0 and v2 appointment data are out of sync',
      );
    });

    it('should return matching v0 and v2 data for a past VA appointment', async () => {
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
        { data: createMockAppointmentByVersion({ version: 2, ...data }) },
      );
      setFetchJSONResponse(
        global.fetch.withArgs(
          sinon.match(`/vaos/v0/appointments/va/${data.id}`),
        ),
        { data: createMockAppointmentByVersion({ version: 0, ...data }) },
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
      delete v0Result.version;
      delete v2Result.version;

      // differences format is http://jsonpatch.com/
      const differences = diff(v2Result, v0Result);
      expect(differences).to.have.deep.members(
        [
          // The v2 endpoint doesn't send us the vista status
          { op: 'replace', path: ['description'], value: 'CHECKED OUT' },
          { op: 'remove', path: ['practitioners'] },
          { op: 'remove', path: ['vaos', 'facilityData'] },
        ],
        'Transformers for v0 and v2 appointment data are out of sync',
      );
    });

    it('should return matching v0 and v2 data for a VA phone appointment', async () => {
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
        { data: createMockAppointmentByVersion({ version: 2, ...data }) },
      );
      setFetchJSONResponse(
        global.fetch.withArgs(
          sinon.match(`/vaos/v0/appointments/va/${data.id}`),
        ),
        { data: createMockAppointmentByVersion({ version: 0, ...data }) },
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
      delete v0Result.version;
      delete v2Result.version;

      // differences format is http://jsonpatch.com/
      const differences = diff(v2Result, v0Result);
      expect(differences).to.have.deep.members(
        [
          // The v2 endpoint doesn't send us the vista status
          { op: 'replace', path: ['description'], value: 'CHECKED OUT' },
          { op: 'remove', path: ['practitioners'] },
          { op: 'remove', path: ['vaos', 'facilityData'] },
        ],
        'Transformers for v0 and v2 appointment data are out of sync',
      );
    });

    it('should return matching v0 and v2 data for a VA covid vaccine appointment', async () => {
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
        { data: createMockAppointmentByVersion({ version: 2, ...data }) },
      );
      setFetchJSONResponse(
        global.fetch.withArgs(
          sinon.match(`/vaos/v0/appointments/va/${data.id}`),
        ),
        { data: createMockAppointmentByVersion({ version: 0, ...data }) },
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
      delete v0Result.version;
      delete v2Result.version;

      // differences format is http://jsonpatch.com/
      const differences = diff(v2Result, v0Result);
      expect(differences).to.have.deep.members(
        [
          // The v2 endpoint doesn't send us the vista status
          { op: 'replace', path: ['description'], value: 'CHECKED OUT' },
          { op: 'remove', path: ['practitioners'] },
          { op: 'remove', path: ['vaos', 'facilityData'] },
        ],
        'Transformers for v0 and v2 appointment data are out of sync',
      );
    });

    it('should return matching v0 and v2 data for a VVC at home video appointment', async () => {
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
            name: {
              family: 'Doe',
              given: ['Meg'],
            },
          },
        ],
      };

      setFetchJSONResponse(
        global.fetch.withArgs(sinon.match(`/vaos/v2/appointments/${data.id}`)),
        { data: createMockAppointmentByVersion({ version: 2, ...data }) },
      );
      setFetchJSONResponse(
        global.fetch.withArgs(
          sinon.match(`/vaos/v0/appointments/va/${data.id}`),
        ),
        { data: createMockAppointmentByVersion({ version: 0, ...data }) },
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
      delete v0Result.version;
      delete v2Result.version;

      // differences format is http://jsonpatch.com/
      const differences = diff(v2Result, v0Result);
      expect(differences).to.have.deep.members(
        [
          // The v2 endpoint doesn't send us the vista status
          { op: 'remove', path: ['practitioners'] },
          { op: 'remove', path: ['vaos', 'facilityData'] },
          { op: 'replace', path: ['description'], value: 'FUTURE' },
          {
            op: 'replace',
            path: ['videoData', 'providers', 0, 'name', 'firstName'],
            value: undefined,
          },
          {
            op: 'replace',
            path: ['videoData', 'providers', 0, 'name', 'lastName'],
            value: undefined,
          },
          {
            op: 'replace',
            path: ['videoData', 'providers', 0, 'display'],
            value: 'undefined undefined',
          },
        ],
        'Transformers for v0 and v2 appointment data are out of sync',
      );
    });

    it('should return matching v0 and v2 data for an ATLAS video appointment', async () => {
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
            name: {
              family: 'Doe',
              given: ['Meg'],
            },
          },
        ],
      };

      setFetchJSONResponse(
        global.fetch.withArgs(sinon.match(`/vaos/v2/appointments/${data.id}`)),
        { data: createMockAppointmentByVersion({ version: 2, ...data }) },
      );
      setFetchJSONResponse(
        global.fetch.withArgs(
          sinon.match(`/vaos/v0/appointments/va/${data.id}`),
        ),
        { data: createMockAppointmentByVersion({ version: 0, ...data }) },
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
      delete v0Result.version;
      delete v2Result.version;

      // differences format is http://jsonpatch.com/
      const differences = diff(v2Result, v0Result);
      expect(differences).to.have.deep.members(
        [
          // The v2 endpoint doesn't send us the vista status
          { op: 'remove', path: ['practitioners'] },
          { op: 'remove', path: ['vaos', 'facilityData'] },
          { op: 'replace', path: ['description'], value: 'FUTURE' },
          {
            op: 'replace',
            path: ['videoData', 'providers', 0, 'name', 'firstName'],
            value: undefined,
          },
          {
            op: 'replace',
            path: ['videoData', 'providers', 0, 'name', 'lastName'],
            value: undefined,
          },
          {
            op: 'replace',
            path: ['videoData', 'providers', 0, 'display'],
            value: 'undefined undefined',
          },
        ],
        'Transformers for v0 and v2 appointment data are out of sync',
      );
    });

    it('should return matching v0 and v2 data for a clinic based video appointment', async () => {
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
        { data: createMockAppointmentByVersion({ version: 2, ...data }) },
      );
      setFetchJSONResponse(
        global.fetch.withArgs(
          sinon.match(`/vaos/v0/appointments/va/${data.id}`),
        ),
        { data: createMockAppointmentByVersion({ version: 0, ...data }) },
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
      delete v0Result.version;
      delete v2Result.version;

      // differences format is http://jsonpatch.com/
      const differences = diff(v2Result, v0Result);
      expect(differences).to.have.deep.members(
        [
          // The v2 endpoint doesn't send us the vista status
          { op: 'replace', path: ['description'], value: 'FUTURE' },
          { op: 'remove', path: ['practitioners'] },
          { op: 'remove', path: ['vaos', 'facilityData'] },
        ],
        'Transformers for v0 and v2 appointment data are out of sync',
      );
    });

    it('should return matching v0 and v2 data for a store forward video appointment', async () => {
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
        { data: createMockAppointmentByVersion({ version: 2, ...data }) },
      );
      setFetchJSONResponse(
        global.fetch.withArgs(
          sinon.match(`/vaos/v0/appointments/va/${data.id}`),
        ),
        { data: createMockAppointmentByVersion({ version: 0, ...data }) },
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
      delete v0Result.version;
      delete v2Result.version;

      // differences format is http://jsonpatch.com/
      const differences = diff(v2Result, v0Result);
      expect(differences).to.have.deep.members(
        [
          // The v2 endpoint doesn't send us the vista status
          { op: 'replace', path: ['description'], value: 'FUTURE' },
          { op: 'remove', path: ['practitioners'] },
          { op: 'remove', path: ['vaos', 'facilityData'] },
        ],
        'Transformers for v0 and v2 appointment data are out of sync',
      );
    });

    it('should return matching v0 and v2 data for a mobile any video appointment', async () => {
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
        { data: createMockAppointmentByVersion({ version: 2, ...data }) },
      );
      setFetchJSONResponse(
        global.fetch.withArgs(
          sinon.match(`/vaos/v0/appointments/va/${data.id}`),
        ),
        { data: createMockAppointmentByVersion({ version: 0, ...data }) },
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
      delete v0Result.version;
      delete v2Result.version;

      // differences format is http://jsonpatch.com/
      const differences = diff(v2Result, v0Result);
      expect(differences).to.have.deep.members(
        [
          // The v2 endpoint doesn't send us the vista status
          { op: 'replace', path: ['description'], value: 'FUTURE' },
          { op: 'remove', path: ['practitioners'] },
          { op: 'remove', path: ['vaos', 'facilityData'] },
        ],
        'Transformers for v0 and v2 appointment data are out of sync',
      );
    });

    it('should return matching v0 and v2 data for a mobile gfe video appointment', async () => {
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
        { data: createMockAppointmentByVersion({ version: 2, ...data }) },
      );
      setFetchJSONResponse(
        global.fetch.withArgs(
          sinon.match(`/vaos/v0/appointments/va/${data.id}`),
        ),
        { data: createMockAppointmentByVersion({ version: 0, ...data }) },
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
      delete v0Result.version;
      delete v2Result.version;

      // differences format is http://jsonpatch.com/
      const differences = diff(v2Result, v0Result);
      expect(differences).to.have.deep.members(
        [
          // The v2 endpoint doesn't send us the vista status
          { op: 'replace', path: ['description'], value: 'FUTURE' },
          { op: 'remove', path: ['practitioners'] },
          { op: 'remove', path: ['vaos', 'facilityData'] },
        ],
        'Transformers for v0 and v2 appointment data are out of sync',
      );
    });

    it('should return matching v0 and v2 data for a community care appointment', async () => {
      const data = {
        id: '1234',
        start: moment()
          .add(3, 'days')
          .format(),
        kind: 'cc',
        status: 'booked',
        minutesDuration: 60,
        communityCareProvider: {
          address: {
            line: ['1012 14TH ST NW STE 700'],
            city: 'WASHINGTON',
            state: 'DC',
            postalCode: '20005-3477',
          },
          providers: {
            name: {
              firstName: 'WILLIAM',
              lastName: 'CAMPBELL',
            },
          },
        },
      };

      setFetchJSONResponse(
        global.fetch.withArgs(sinon.match(`/vaos/v2/appointments/${data.id}`)),
        { data: createMockAppointmentByVersion({ version: 2, ...data }) },
      );
      setFetchJSONResponse(
        global.fetch.withArgs(sinon.match(`/vaos/v0/appointments`)),
        { data: [createMockAppointmentByVersion({ version: 0, ...data })] },
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
      delete v0Result.version;
      delete v2Result.version;

      // The CC date transformer logic sets the date in UTC mode, which creates
      // a format difference when this test is run on a machine in GMT/UTC
      // This adjusts for that format difference, because fixing the code results
      // in weird test failures that need to be looked at separately
      v0Result.start = v0Result.start.replace('Z', '+00:00');

      // differences format is http://jsonpatch.com/
      const differences = diff(v2Result, v0Result);
      expect(differences).to.have.deep.members(
        [
          { op: 'remove', path: ['communityCareProvider', 'providers'] },
          { op: 'remove', path: ['practitioners'] },
          { op: 'remove', path: ['vaos', 'facilityData'] },
          {
            op: 'replace',
            path: ['communityCareProvider', 'telecom'],
            value: null,
          },
          {
            op: 'replace',
            path: ['vaos', 'timeZone'],
            value: moment(data.start)
              .tz(moment.tz.guess())
              .format('Z z'),
          },
          {
            op: 'add',
            path: ['communityCareProvider', 'firstName'],
            value: null,
          },
          {
            op: 'add',
            path: ['communityCareProvider', 'lastName'],
            value: null,
          },
          {
            op: 'add',
            path: ['communityCareProvider', 'providerName'],
            value: null,
          },
          {
            op: 'add',
            path: ['preferredCommunityCareProviders'],
            value: null,
          },
        ],
        'Transformers for v0 and v2 appointment data are out of sync',
      );
    });

    it('should return matching v0 and v2 data for an error fetching appointments', async () => {
      const error = {
        code: 'VAOS_504',
        title: 'Gateway error',
        status: 504,
        source: 'stack trace',
      };
      setFetchJSONFailure(
        global.fetch.withArgs(sinon.match(`/vaos/v2/appointments/1234`)),
        {
          errors: [error],
        },
      );
      setFetchJSONFailure(
        global.fetch.withArgs(sinon.match(`/vaos/v0/appointments/va/1234`)),
        {
          errors: [error],
        },
      );

      let v0Result = null;
      let v2Result = null;
      try {
        await fetchBookedAppointment({
          id: '1234',
          type: 'va',
          useV2: true,
        });
      } catch (e) {
        v0Result = e;
      }

      try {
        await fetchBookedAppointment({ id: '1234', type: 'va' });
      } catch (e) {
        v2Result = e;
      }

      expect(v2Result).to.be.ok;
      expect(v0Result).to.be.ok;

      const differences = diff(v2Result, v0Result);
      expect(differences).to.be.empty;
    });
  });

  describe('getAppointmentRequests', () => {
    beforeEach(() => mockFetch());
    it('should return matching v0 and v2 data for a VA appointment request', async () => {
      // Given VA appointment request
      const data = {
        id: '1234',
        start: moment()
          .add(3, 'days')
          .format(),
        email: 'test@va.gov',
        phone: '2125551212',
        kind: 'clinic',
        locationId: '552GA',
        clinicFriendlyName: 'Friendly clinic name',
        requestedPeriods: [
          {
            start: `${moment().format('YYYY-MM-DD')}T00:00:00.000`,
            end: `${moment().format('YYYY-MM-DD')}T11:59:59.999`,
          },
        ],
        serviceType: 'primaryCare',
        status: 'proposed',
        visitType: 'Office Visit',
      };
      const startDate = moment()
        .subtract(30, 'days')
        .format();
      const endDate = moment()
        .add(30, 'days')
        .format();

      // And the developer fetched that request through both the v2 and v0 APIs
      setFetchJSONResponse(
        global.fetch.withArgs(
          sinon.match(
            `/vaos/v2/appointments?_include=facilities,clinics&start=${startDate}&end=${endDate}&statuses[]=proposed&statuses[]=cancelled`,
          ),
        ),
        {
          data: [
            createMockAppointmentByVersion({
              version: 2,
              ...data,
              requestedPeriods: [
                {
                  start: `${moment().format('YYYY-MM-DD')}T00:00:00Z`,
                  end: `${moment().format('YYYY-MM-DD')}T11:59:59Z`,
                },
              ],
            }),
          ],
        },
      );

      setFetchJSONResponse(
        global.fetch.withArgs(
          sinon.match(
            `/vaos/v0/appointment_requests?start_date=${startDate}&end_date=${endDate}`,
          ),
        ),
        {
          data: [
            createMockAppointmentByVersion({
              version: 0,
              ...data,
            }),
          ],
        },
      );

      const [v0Result, v2Result] = await Promise.all([
        getAppointmentRequests({
          startDate,
          endDate,
        }),
        getAppointmentRequests({
          startDate,
          endDate,
          useV2: true,
        }),
      ]);

      // These are always different
      delete v0Result[0].vaos.apiData;
      delete v2Result[0].vaos.apiData;
      delete v0Result[0].version;
      delete v2Result[0].version;

      // When they compare the two results
      // differences format is http://jsonpatch.com/
      const differences = diff(v2Result[0], v0Result[0]);

      // Then the results have the following differences
      expect(differences).to.have.deep.members(
        [
          { op: 'remove', path: ['description'] },
          { op: 'remove', path: ['practitioners'] },
          { op: 'remove', path: ['vaos', 'facilityData'] },
          { op: 'replace', path: ['reason'], value: undefined },
        ],
        'Transformers for v0 and v2 appointment request data are out of sync',
      );
    });

    it('should return matching v0 and v2 data for a CC appointment request', async () => {
      // Given CC appointment request
      const data = {
        id: '1234',
        email: 'test@va.gov',
        phone: '2125551212',
        kind: 'cc',
        clinicFriendlyName: 'Friendly clinic name',
        requestedPeriods: [
          {
            start: `${moment().format('YYYY-MM-DD')}T00:00:00.000`,
            end: `${moment().format('YYYY-MM-DD')}T11:59:59.999`,
          },
        ],
        serviceType: 'primaryCare',
        status: 'proposed',
        typeOfCareId: 'CCPRMYRTNE',
        visitType: 'Office Visit',
      };
      const startDate = moment()
        .subtract(30, 'days')
        .format();
      const endDate = moment()
        .add(30, 'days')
        .format();

      // And the developer fetched that request through both the v2 and v0 APIs
      setFetchJSONResponse(
        global.fetch.withArgs(
          sinon.match(
            `/vaos/v2/appointments?_include=facilities,clinics&start=${startDate}&end=${endDate}&statuses[]=proposed&statuses[]=cancelled`,
          ),
        ),
        {
          data: [
            createMockAppointmentByVersion({
              version: 2,
              ...data,
              requestedPeriods: [
                {
                  start: `${moment().format('YYYY-MM-DD')}T00:00:00Z`,
                  end: `${moment().format('YYYY-MM-DD')}T11:59:59Z`,
                },
              ],
            }),
          ],
        },
      );

      setFetchJSONResponse(
        global.fetch.withArgs(
          sinon.match(
            `/vaos/v0/appointment_requests?start_date=${startDate}&end_date=${endDate}`,
          ),
        ),
        {
          data: [
            createMockAppointmentByVersion({
              version: 0,
              ...data,
            }),
          ],
        },
      );

      const [v0Result, v2Result] = await Promise.all([
        getAppointmentRequests({
          startDate,
          endDate,
        }),
        getAppointmentRequests({
          startDate,
          endDate,
          useV2: true,
        }),
      ]);

      // These are always different
      delete v0Result[0].vaos.apiData;
      delete v2Result[0].vaos.apiData;
      delete v0Result[0].version;
      delete v2Result[0].version;

      // When they compare the two results
      // differences format is http://jsonpatch.com/
      const differences = diff(v2Result[0], v0Result[0]);

      // Then the results have the following differences
      expect(differences).to.have.deep.members(
        [
          { op: 'remove', path: ['description'] },
          { op: 'remove', path: ['practitioners'] },
          { op: 'replace', path: ['reason'], value: undefined },

          {
            op: 'replace',
            path: ['type', 'coding', 0, 'code'],
            value: 'CCPRMYRTNE',
          },
          { op: 'replace', path: ['requestVisitType'], value: 'Office visit' },
          {
            op: 'add',
            path: ['preferredCommunityCareProviders'],
            value: null,
          },
          { op: 'remove', path: ['vaos', 'facilityData'] },
        ],
        'Transformers for v0 and v2 appointment request data are out of sync',
      );
    });

    it('should return matching v0 and v2 data for a cancelled appointment request', async () => {
      // Given cancelled VA appointment request
      const data = {
        id: '1234',
        start: moment()
          .add(3, 'days')
          .format(),
        email: 'test@va.gov',
        phone: '2125551212',
        kind: 'clinic',
        locationId: '552GA',
        clinicFriendlyName: 'Friendly clinic name',
        requestedPeriods: [
          {
            start: `${moment().format('YYYY-MM-DD')}T00:00:00.000`,
            end: `${moment().format('YYYY-MM-DD')}T11:59:59.999`,
          },
        ],
        serviceType: 'primaryCare',
        status: 'cancelled',
        visitType: 'Office Visit',
      };
      const startDate = moment()
        .subtract(30, 'days')
        .format();
      const endDate = moment()
        .add(30, 'days')
        .format();

      // And the developer fetched that request through both the v2 and v0 APIs
      setFetchJSONResponse(
        global.fetch.withArgs(
          sinon.match(
            `/vaos/v2/appointments?_include=facilities,clinics&start=${startDate}&end=${endDate}&statuses[]=proposed&statuses[]=cancelled`,
          ),
        ),
        {
          data: [
            createMockAppointmentByVersion({
              version: 2,
              ...data,
            }),
          ],
        },
      );

      setFetchJSONResponse(
        global.fetch.withArgs(
          sinon.match(
            `/vaos/v0/appointment_requests?start_date=${startDate}&end_date=${endDate}`,
          ),
        ),
        {
          data: [
            createMockAppointmentByVersion({
              version: 0,
              ...data,
            }),
          ],
        },
      );

      const [v0Result, v2Result] = await Promise.all([
        getAppointmentRequests({
          startDate,
          endDate,
        }),
        getAppointmentRequests({
          startDate,
          endDate,
          useV2: true,
        }),
      ]);

      // These are always different
      delete v0Result[0].vaos.apiData;
      delete v2Result[0].vaos.apiData;
      delete v0Result[0].version;
      delete v2Result[0].version;

      // When they compare the two results
      // differences format is http://jsonpatch.com/
      const differences = diff(v2Result[0], v0Result[0]);

      // Then the results have the following differences
      expect(differences).to.have.deep.members(
        [
          { op: 'remove', path: ['description'] },
          { op: 'remove', path: ['practitioners'] },
          { op: 'remove', path: ['vaos', 'facilityData'] },
          { op: 'replace', path: ['reason'], value: undefined },
        ],
        'Transformers for v0 and v2 appointment request data are out of sync',
      );
    });

    it('should return matching v0 and v2 data for an error fetching requests', async () => {
      // Given VAOS error
      const error = {
        code: 'VAOS_504',
        title: 'Gateway error',
        status: 504,
        source: 'stack trace',
      };

      const startDate = moment()
        .subtract(30, 'days')
        .format();
      const endDate = moment()
        .add(30, 'days')
        .format();

      // And the developer fetched that request through both the v2 and v0 APIs
      setFetchJSONFailure(
        global.fetch.withArgs(
          sinon.match(
            `/vaos/v2/appointments?_include=facilities,clinics&start=${startDate}&end=${endDate}&statuses[]=proposed&statuses[]=cancelled`,
          ),
        ),
        {
          errors: [error],
        },
      );

      setFetchJSONFailure(
        global.fetch.withArgs(
          sinon.match(
            `/vaos/v0/appointment_requests?start_date=${startDate}&end_date=${endDate}`,
          ),
        ),
        {
          errors: [error],
        },
      );

      let v0Result = null;
      let v2Result = null;

      try {
        await getAppointmentRequests({
          startDate,
          endDate,
        });
      } catch (e) {
        v0Result = e;
      }

      try {
        await getAppointmentRequests({
          startDate,
          endDate,
        });
      } catch (e) {
        v2Result = e;
      }

      expect(v2Result).to.be.ok;
      expect(v0Result).to.be.ok;

      // When they compare the two results
      const differences = diff(v2Result, v0Result);

      // Then the results have the following differences
      expect(differences).to.be.empty;
    });
  });

  describe('getLongTermAppointmentHistoryV2', () => {
    beforeEach(() => {
      mockFetch();
    });

    it('should fetch 3 years of appointment history', async () => {
      const dateRanges = getDateRanges(3);
      dateRanges.forEach(range => {
        mockVAOSAppointmentsFetch({
          start: range.start,
          end: range.end,
          requests: [],
          statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
        });
      });

      await getLongTermAppointmentHistoryV2();
      expect(global.fetch.callCount).to.equal(3);
      expect(global.fetch.firstCall.args[0]).to.contain(dateRanges[0].start);
      expect(global.fetch.firstCall.args[0]).to.contain(dateRanges[0].end);
      expect(global.fetch.secondCall.args[0]).to.contain(dateRanges[1].start);
      expect(global.fetch.secondCall.args[0]).to.contain(dateRanges[1].end);
      expect(global.fetch.thirdCall.args[0]).to.contain(dateRanges[2].start);
      expect(global.fetch.thirdCall.args[0]).to.contain(dateRanges[2].end);
    });
  });
});
