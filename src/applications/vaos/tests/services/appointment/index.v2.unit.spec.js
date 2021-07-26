import { expect } from 'chai';
import sinon from 'sinon';
import { diff } from 'just-diff';
import {
  mockFetch,
  setFetchJSONFailure,
  setFetchJSONResponse,
} from 'platform/testing/unit/helpers';

import { fetchBookedAppointment } from '../../../services/appointment';
import { VIDEO_TYPES } from '../../../utils/constants';
import moment from '../../../lib/moment-tz';
import { createMockAppointment } from '../../mocks/data';

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
        { data: createMockAppointment({ version: 2, ...data }) },
      );
      setFetchJSONResponse(
        global.fetch.withArgs(
          sinon.match(`/vaos/v0/appointments/va/${data.id}`),
        ),
        { data: createMockAppointment({ version: 0, ...data }) },
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
        { data: createMockAppointment({ version: 2, ...data }) },
      );
      setFetchJSONResponse(
        global.fetch.withArgs(
          sinon.match(`/vaos/v0/appointments/va/${data.id}`),
        ),
        { data: createMockAppointment({ version: 0, ...data }) },
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
        { data: createMockAppointment({ version: 2, ...data }) },
      );
      setFetchJSONResponse(
        global.fetch.withArgs(
          sinon.match(`/vaos/v0/appointments/va/${data.id}`),
        ),
        { data: createMockAppointment({ version: 0, ...data }) },
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
        { data: createMockAppointment({ version: 2, ...data }) },
      );
      setFetchJSONResponse(
        global.fetch.withArgs(
          sinon.match(`/vaos/v0/appointments/va/${data.id}`),
        ),
        { data: createMockAppointment({ version: 0, ...data }) },
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
        { data: createMockAppointment({ version: 2, ...data }) },
      );
      setFetchJSONResponse(
        global.fetch.withArgs(
          sinon.match(`/vaos/v0/appointments/va/${data.id}`),
        ),
        { data: createMockAppointment({ version: 0, ...data }) },
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
            firstName: 'Meg',
            lastName: 'Doe',
          },
        ],
      };

      setFetchJSONResponse(
        global.fetch.withArgs(sinon.match(`/vaos/v2/appointments/${data.id}`)),
        { data: createMockAppointment({ version: 2, ...data }) },
      );
      setFetchJSONResponse(
        global.fetch.withArgs(
          sinon.match(`/vaos/v0/appointments/va/${data.id}`),
        ),
        { data: createMockAppointment({ version: 0, ...data }) },
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
            firstName: 'Meg',
            lastName: 'Doe',
          },
        ],
      };

      setFetchJSONResponse(
        global.fetch.withArgs(sinon.match(`/vaos/v2/appointments/${data.id}`)),
        { data: createMockAppointment({ version: 2, ...data }) },
      );
      setFetchJSONResponse(
        global.fetch.withArgs(
          sinon.match(`/vaos/v0/appointments/va/${data.id}`),
        ),
        { data: createMockAppointment({ version: 0, ...data }) },
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
        { data: createMockAppointment({ version: 2, ...data }) },
      );
      setFetchJSONResponse(
        global.fetch.withArgs(
          sinon.match(`/vaos/v0/appointments/va/${data.id}`),
        ),
        { data: createMockAppointment({ version: 0, ...data }) },
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
        { data: createMockAppointment({ version: 2, ...data }) },
      );
      setFetchJSONResponse(
        global.fetch.withArgs(
          sinon.match(`/vaos/v0/appointments/va/${data.id}`),
        ),
        { data: createMockAppointment({ version: 0, ...data }) },
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
        { data: createMockAppointment({ version: 2, ...data }) },
      );
      setFetchJSONResponse(
        global.fetch.withArgs(
          sinon.match(`/vaos/v0/appointments/va/${data.id}`),
        ),
        { data: createMockAppointment({ version: 0, ...data }) },
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
        { data: createMockAppointment({ version: 2, ...data }) },
      );
      setFetchJSONResponse(
        global.fetch.withArgs(
          sinon.match(`/vaos/v0/appointments/va/${data.id}`),
        ),
        { data: createMockAppointment({ version: 0, ...data }) },
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
        { data: createMockAppointment({ version: 2, ...data }) },
      );
      setFetchJSONResponse(
        global.fetch.withArgs(sinon.match(`/vaos/v0/appointments`)),
        { data: [createMockAppointment({ version: 0, ...data })] },
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

    it('should return matching v0 and v2 data for an error', async () => {
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
});
