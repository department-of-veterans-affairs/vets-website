import { expect } from 'chai';
import {
  mockFetch,
  setFetchJSONFailure,
  setFetchJSONResponse,
} from 'platform/testing/unit/helpers';

import { addDays, addMonths, format, startOfDay } from 'date-fns';
import { getSlots } from '.';
import { DATE_FORMATS } from '../../utils/constants';

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
            start: format(startDate, DATE_FORMATS.ISODateTimeUTC),
            end: format(startDate, DATE_FORMATS.ISODateTimeUTC),
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
        `/vaos/v2/locations/983/clinics/308/slots?start=${format(
          startOfDay(startDate),
          DATE_FORMATS.ISODateTimeLocal,
        )}&end=${format(startOfDay(endDate), DATE_FORMATS.ISODateTimeLocal)}`,
      );
      expect(data[0].start).to.equal(
        format(startDate, DATE_FORMATS.ISODateTimeUTC),
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
        `/vaos/v2/locations/983/clinics/308/slots?start=${format(
          startOfDay(startDate),
          DATE_FORMATS.ISODateTimeLocal,
        )}&end=${format(startOfDay(endDate), DATE_FORMATS.ISODateTimeLocal)}`,
      );
      expect(error?.resourceType).to.equal('OperationOutcome');
    });
  });
});
