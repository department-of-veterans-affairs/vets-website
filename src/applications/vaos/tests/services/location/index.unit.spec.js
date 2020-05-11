import { expect } from 'chai';
import {
  mockFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';

import {
  getLocations,
  getLocation,
  getSupportedLocationsByTypeOfCare,
} from '../../../services/location';
import facilities983 from '../../../api/facilities_983.json';
import facilityDetails from '../../../api/facility_data.json';

describe('VAOS Location service', () => {
  describe('getSupportedLocationsByTypeOfCare', () => {
    let data;

    it('should make successful request', async () => {
      mockFetch();
      setFetchJSONResponse(global.fetch, facilities983);
      data = await getSupportedLocationsByTypeOfCare({
        siteId: 'var983',
        parentId: 'var983A6',
        typeOfCareId: '123',
      });

      expect(global.fetch.firstCall.args[0]).to.contain(
        'vaos/v0/systems/983/direct_scheduling_facilities?type_of_care_id=123&parent_code=983A6',
      );
      expect(data[0].identifier[1].value).to.equal('urn:va:division:983:983');
    });

    it('should return OperationOutcome error', async () => {
      mockFetch();
      setFetchJSONFailure(global.fetch, {
        errors: [],
      });

      let error;
      try {
        data = await getSupportedLocationsByTypeOfCare({
          siteId: 'var983',
          parentId: 'var983A6',
          typeOfCareId: '123',
        });
      } catch (e) {
        error = e;
      }

      expect(global.fetch.firstCall.args[0]).to.contain(
        '/vaos/v0/systems/983/direct_scheduling_facilities?type_of_care_id=123&parent_code=983A6',
      );
      expect(error?.resourceType).to.equal('OperationOutcome');
    });
  });

  describe('getLocations', () => {
    let data;

    it('should make successful request', async () => {
      mockFetch();
      setFetchJSONResponse(global.fetch, facilityDetails);
      data = await getLocations({
        facilityIds: ['var983A6'],
      });

      expect(global.fetch.firstCall.args[0]).to.contain(
        '/facilities/va?ids=vha_442A6',
      );
      expect(data[0].identifier[0].value).to.equal('urn:va:division:442:442');
    });

    it('should return OperationOutcome error', async () => {
      mockFetch();
      setFetchJSONFailure(global.fetch, {
        errors: [],
      });

      let error;
      try {
        data = await getLocations({
          facilityIds: ['var983'],
        });
      } catch (e) {
        error = e;
      }

      expect(global.fetch.firstCall.args[0]).to.contain(
        '/facilities/va?ids=vha_442',
      );
      expect(error?.resourceType).to.equal('OperationOutcome');
    });
  });

  describe('getLocation', () => {
    let data;

    it('should make successful request', async () => {
      mockFetch();
      setFetchJSONResponse(global.fetch, { data: facilityDetails.data[0] });
      data = await getLocation({
        facilityId: 'var983A6',
      });

      expect(global.fetch.firstCall.args[0]).to.contain(
        '/facilities/va/vha_442A6',
      );
      expect(data.identifier[0].value).to.equal('urn:va:division:442:442');
    });

    it('should return OperationOutcome error', async () => {
      mockFetch();
      setFetchJSONFailure(global.fetch, {
        errors: [],
      });

      let error;
      try {
        data = await getLocation({
          facilityId: 'var983',
        });
      } catch (e) {
        error = e;
      }

      expect(global.fetch.firstCall.args[0]).to.contain(
        '/facilities/va/vha_442',
      );
      expect(error?.resourceType).to.equal('OperationOutcome');
    });
  });
});
