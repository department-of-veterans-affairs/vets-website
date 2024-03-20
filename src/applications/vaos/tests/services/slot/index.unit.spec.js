import { expect } from 'chai';
import {
  mockFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';

import moment from 'moment';
import { getSlots } from '../../../services/slot';

describe('VAOS Services: Slot ', () => {
  describe('getSlots', () => {
    beforeEach(() => {
      mockFetch();
    });

    it('should make successful request', async () => {
      const startDate = moment().add(1, 'day');
      const endDate = moment().add(1, 'month');
      const slots = [
        {
          id: '1',
          type: 'slots',
          attributes: {
            start: startDate.format('YYYY-MM-DDTHH:mm:ss[Z]'),
            end: startDate.format('YYYY-MM-DDTHH:mm:ss[Z]'),
          },
        },
      ];

      setFetchJSONResponse(global.fetch, { data: slots });

      const data = await getSlots({
        siteId: '983',
        clinicId: '983_308',
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
      });

      expect(global.fetch.firstCall.args[0]).to.contain(
        `/vaos/v2/locations/983/clinics/308/slots?start=${moment(startDate)
          .startOf('day')
          .format('YYYY-MM-DDTHH:mm:ssZ')}&end=${moment(endDate)
          .startOf('day')
          .format('YYYY-MM-DDTHH:mm:ssZ')}`,
      );
      expect(data[0].start).to.equal(
        startDate.format('YYYY-MM-DDTHH:mm:ss[Z]'),
      );
    });

    it('should return OperationOutcome error', async () => {
      const startDate = moment().add(1, 'day');
      const endDate = moment().add(1, 'month');

      setFetchJSONFailure(global.fetch, {
        errors: [],
      });

      let error;
      try {
        await getSlots({
          siteId: '983',
          clinicId: '983_308',
          startDate: startDate.format('YYYY-MM-DD'),
          endDate: endDate.format('YYYY-MM-DD'),
        });
      } catch (e) {
        error = e;
      }

      expect(global.fetch.firstCall.args[0]).to.contain(
        `/vaos/v2/locations/983/clinics/308/slots?start=${moment(startDate)
          .startOf('day')
          .format('YYYY-MM-DDTHH:mm:ssZ')}&end=${moment(endDate)
          .startOf('day')
          .format('YYYY-MM-DDTHH:mm:ssZ')}`,
      );
      expect(error?.resourceType).to.equal('OperationOutcome');
    });
  });
});
