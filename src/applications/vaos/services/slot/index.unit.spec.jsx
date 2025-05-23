import { expect } from 'chai';
import {
  mockFetch,
  setFetchJSONFailure,
  setFetchJSONResponse,
} from 'platform/testing/unit/helpers';

import { addDays, addMonths, format, formatISO, startOfDay } from 'date-fns';
import { getSlots } from '.';

describe('VAOS Services: Slot ', () => {
  describe('getSlots', () => {
    beforeEach(() => {
      mockFetch();
    });

    it('should make successful request', async () => {
      const startDate = addDays(new Date(), 1);
      const endDate = addMonths(new Date(), 1);
      const slots = [
        {
          id: '1',
          type: 'slots',
          attributes: {
            start: format(startDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
            end: format(startDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
          },
        },
      ];

      setFetchJSONResponse(global.fetch, { data: slots });

      const data = await getSlots({
        siteId: '983',
        clinicId: '983_308',
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
      });

      expect(global.fetch.firstCall.args[0]).to.contain(
        `/vaos/v2/locations/983/clinics/308/slots?start=${formatISO(
          startOfDay(startDate),
        )}&end=${formatISO(startOfDay(endDate))}`,
      );
      expect(data[0].start).to.equal(
        format(startDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      );
    });

    it('should return OperationOutcome error', async () => {
      const startDate = addDays(new Date(), 1);
      const endDate = addMonths(new Date(), 1);

      setFetchJSONFailure(global.fetch, {
        errors: [],
      });

      let error;
      try {
        await getSlots({
          siteId: '983',
          clinicId: '983_308',
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd'),
        });
      } catch (e) {
        error = e;
      }

      expect(global.fetch.firstCall.args[0]).to.contain(
        `/vaos/v2/locations/983/clinics/308/slots?start=${formatISO(
          startOfDay(startDate),
        )}&end=${formatISO(startOfDay(endDate))}`,
      );
      expect(error?.resourceType).to.equal('OperationOutcome');
    });
  });
});
