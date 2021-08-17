import { expect } from 'chai';
import sinon from 'sinon';
import { diff } from 'just-diff';
import { mockFetch, setFetchJSONResponse } from 'platform/testing/unit/helpers';

import { getSlots } from '../../../services/slot';
import moment from 'moment';

describe('VAOS Slot service', () => {
  describe('getSlots', () => {
    beforeEach(() => mockFetch());
    it('should return matching v0 and v2 data for available slots', async () => {
      // Given the start and end date for type of care at a clinic
      const data = {
        siteId: '983',
        typeOfCareId: '323',
        clinicId: '983_308',
        startDate: '2021-08-02',
        endDate: '2021-09-22',
      };

      // when fetching a VA available time slot using v0 API
      setFetchJSONResponse(
        global.fetch.withArgs(
          sinon.match(
            `/vaos/v0/facilities/${
              data.siteId
            }/available_appointments?type_of_care_id=${
              data.typeOfCareId
            }&clinic_ids[]=${data.clinicId.split('_')[1]}&start_date=${
              data.startDate
            }&end_date=${data.endDate}`,
          ),
        ),
        {
          data: [
            {
              id: '308',
              attributes: {
                clinicId: '308',
                appointmentTimeSlot: [
                  {
                    startDateTime: '2021-08-02T14:00:00+00:00',
                    endDateTime: '2021-08-02T15:00:00+00:00',
                    bookingStatus: '1',
                  },
                ],
              },
            },
          ],
        },
      );

      // when fetching a VA available time slot using v2 API
      setFetchJSONResponse(
        global.fetch.withArgs(
          sinon.match(
            `/vaos/v2/locations/${data.siteId}/clinics/${
              data.clinicId.split('_')[1]
            }/slots?start=${moment(data.startDate).format()}&end=${moment(
              data.endDate,
            ).format()}`,
          ),
        ),
        {
          data: [
            {
              id: '3230323',
              type: 'slots',
              attributes: {
                start: '2021-08-02T20:00:00Z',
                end: '2021-08-02T21:00:00Z',
              },
            },
          ],
        },
      );
      const [v2Result, v0Result] = await Promise.all([
        getSlots({
          siteId: '983',
          typeOfCareId: '323',
          clinicId: '983_308',
          startDate: data.startDate,
          endDate: data.endDate,
          useV2: false,
        }),
        getSlots({
          siteId: '983',
          typeOfCareId: '323',
          clinicId: '983_308',
          startDate: data.startDate,
          endDate: data.endDate,
          useV2: true,
        }),
      ]);
      // These are the difference when comparing the two resuts
      const differences = diff(v2Result, v0Result);
      expect(differences).to.have.deep.members(
        [
          // The v2 endpoint doesn't send the freeBusyType property
          { op: 'remove', path: [0, 'freeBusyType'] },
          // the v2 endpoint includes the slot id
          { op: 'add', path: [0, 'id'], value: '3230323' },
          // v2 uses UTC time, hence convert the v0 local time
          // and replacing +00.00 with the -06:00 offset for mountain time
          {
            op: 'replace',
            path: [0, 'start'],
            value: moment.utc('2021-08-02T14:00:00-06:00').format(),
          },
          {
            op: 'replace',
            path: [0, 'end'],
            value: moment.utc('2021-08-02T15:00:00-06:00').format(),
          },
        ],
        'Transformers for v0 and v2 appointment slot data are out of sync',
      );
    });
  });
});
