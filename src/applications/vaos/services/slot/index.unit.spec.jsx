import { expect } from 'chai';
import {
  addDays,
  addMonths,
  format,
  lastDayOfMonth,
  startOfDay,
  startOfMonth,
} from 'date-fns';
import {
  mockFetch,
  setFetchJSONFailure,
  setFetchJSONResponse,
} from 'platform/testing/unit/helpers';
import sinon from 'sinon';
import * as vaos from '../vaos';
import * as transformers from './transformers';

import { getSlots } from '.';
import { DATE_FORMATS } from '../../utils/constants';

describe('VAOS Services: Slot ', () => {
  describe('getSlots', () => {
    let sandbox;
    let getAvailableV2SlotsStub;
    let transformV2SlotsStub;

    beforeEach(() => {
      mockFetch();
      sandbox = sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should make successful request', async () => {
      const startDate = startOfMonth(startOfDay(addDays(new Date(), 1)));
      const endDate = lastDayOfMonth(addMonths(startOfDay(new Date()), 1));

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
        startDate,
        endDate,
      });

      expect(decodeURIComponent(global.fetch.firstCall.args[0])).to.contain(
        `/vaos/v2/locations/983/clinics/308/slots?start=${startDate.toISOString()}&end=${endDate.toISOString()}`,
      );
      expect(data[0].start).to.equal(
        format(startDate, DATE_FORMATS.ISODateTimeUTC),
      );
    });

    it('should return OperationOutcome error', async () => {
      const startDate = startOfMonth(startOfDay(addDays(new Date(), 1)));
      const endDate = lastDayOfMonth(addMonths(startOfDay(new Date()), 1));

      setFetchJSONFailure(global.fetch, {
        errors: [],
      });

      let error;
      try {
        await getSlots({
          siteId: '983',
          clinicId: '983_308',
          startDate,
          endDate,
        });
      } catch (e) {
        error = e;
      }
      expect(decodeURIComponent(global.fetch.firstCall.args[0])).to.contain(
        `/vaos/v2/locations/983/clinics/308/slots?start=${startDate.toISOString()}&end=${endDate.toISOString()}`,
      );
      expect(error?.resourceType).to.equal('OperationOutcome');
    });

    it('should call getAvailableV2Slots with correct arguments and transform the result', async () => {
      // Arrange
      const mockParams = {
        siteId: '983',
        clinicId: '983_308',
        startDate: '2025-05-01T00:00:00+05:00',
        endDate: '2025-06-30T00:00:00+05:00',
      };
      const mockApiResponse = [{ id: 'slot1', start: '2025-05-01T10:00:00Z' }];
      const mockTransformed = [
        { start: '2025-05-01T10:00:00Z', end: '2025-05-01T10:30:00Z' },
      ];

      getAvailableV2SlotsStub = sandbox
        .stub(vaos, 'getAvailableV2Slots')
        .resolves(mockApiResponse);
      transformV2SlotsStub = sandbox
        .stub(transformers, 'transformV2Slots')
        .returns(mockTransformed);

      // Act
      const result = await getSlots(mockParams);

      // Assert
      expect(getAvailableV2SlotsStub.calledOnce).to.be.true;

      const {
        facilityId,
        clinicId,
        startDate,
        endDate,
      } = getAvailableV2SlotsStub.firstCall.args[0];

      expect(facilityId).to.equal('983');
      expect(clinicId).to.equal('983_308');
      expect(new Date(startDate).toISOString()).to.equal(
        '2025-04-30T19:00:00.000Z',
      );
      expect(new Date(endDate).toISOString()).to.equal(
        '2025-06-29T19:00:00.000Z',
      );

      expect(transformV2SlotsStub.calledOnce).to.be.true;
      expect(transformV2SlotsStub.firstCall.args[0]).to.deep.equal(
        mockApiResponse,
      );
      expect(result).to.deep.equal(mockTransformed);
    });

    it('should call getAvailableV2Slots with correct arguments for OH and transform the result', async () => {
      // Arrange
      const mockParams = {
        siteId: '983',
        typeOfCare: 'foodAndNutrition',
        provider: 'Practitioner/123456',
        startDate: '2025-05-01T00:00:00+05:00',
        endDate: '2025-06-30T00:00:00+05:00',
      };
      const mockApiResponse = [{ id: 'slot1', start: '2025-05-01T10:00:00Z' }];
      const mockTransformed = [
        { start: '2025-05-01T10:00:00Z', end: '2025-05-01T10:30:00Z' },
      ];

      getAvailableV2SlotsStub = sandbox
        .stub(vaos, 'getAvailableV2Slots')
        .resolves(mockApiResponse);
      transformV2SlotsStub = sandbox
        .stub(transformers, 'transformV2Slots')
        .returns(mockTransformed);

      // Act
      const result = await getSlots(mockParams);
      // Assert
      expect(getAvailableV2SlotsStub.calledOnce).to.be.true;

      const {
        facilityId,
        typeOfCare,
        provider,
        startDate,
        endDate,
      } = getAvailableV2SlotsStub.firstCall.args[0];

      expect(facilityId).to.equal('983');
      expect(typeOfCare).to.equal('foodAndNutrition');
      expect(provider).to.equal('Practitioner/123456');
      expect(new Date(startDate).toISOString()).to.equal(
        '2025-04-30T19:00:00.000Z',
      );
      expect(new Date(endDate).toISOString()).to.equal(
        '2025-06-29T19:00:00.000Z',
      );

      expect(transformV2SlotsStub.calledOnce).to.be.true;
      expect(transformV2SlotsStub.firstCall.args[0]).to.deep.equal(
        mockApiResponse,
      );
      expect(result).to.deep.equal(mockTransformed);
    });
  });
});
