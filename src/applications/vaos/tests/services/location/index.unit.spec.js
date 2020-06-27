import { expect } from 'chai';
import {
  mockFetch,
  resetFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';

import {
  getLocations,
  getLocation,
  getSupportedLocationsByTypeOfCare,
  getParentOfLocation,
  getFacilityIdFromLocation,
} from '../../../services/location';
import facilities983 from '../../../api/facilities_983.json';
import facilityDetails from '../../../api/facility_data.json';
import { VHA_FHIR_ID } from '../../../utils/constants';

describe('VAOS Location service', () => {
  describe('getSupportedLocationsByTypeOfCare', () => {
    let data;

    it('should make successful request', async () => {
      mockFetch();
      setFetchJSONResponse(global.fetch, facilities983);
      data = await getSupportedLocationsByTypeOfCare({
        rootOrgId: 'var983',
        parentId: 'var983A6',
        typeOfCareId: '123',
      });

      expect(global.fetch.firstCall.args[0]).to.contain(
        'vaos/v0/systems/983/direct_scheduling_facilities?type_of_care_id=123&parent_code=983A6',
      );
      expect(data[0].identifier[1].value).to.equal('urn:va:division:983:983');
      resetFetch();
    });

    it('should sort by name', async () => {
      mockFetch();
      setFetchJSONResponse(global.fetch, facilities983);
      data = await getSupportedLocationsByTypeOfCare({
        rootOrgId: 'var983',
        parentId: 'var983A6',
        typeOfCareId: '123',
      });

      expect(data[0].name).to.equal('CHYSHR-Cheyenne VA Medical Center');
      expect(data[1].name).to.equal('CHYSHR-Fort Collins VA Clinic');
      expect(data[2].name).to.equal('CHYSHR-Loveland VA Clinic');
      expect(data[3].name).to.equal('CHYSHR-Sidney VA Clinic');
      expect(data[4].name).to.equal('CHYSHR-Wheatland VA Mobile Clinic');
      resetFetch();
    });

    it('should return OperationOutcome error', async () => {
      mockFetch();
      setFetchJSONFailure(global.fetch, {
        errors: [],
      });

      let error;
      try {
        data = await getSupportedLocationsByTypeOfCare({
          rootOrgId: 'var983',
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
      resetFetch();
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
      resetFetch();
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
      resetFetch();
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
      resetFetch();
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
      resetFetch();
    });
  });

  describe('getParentOfLocation', () => {
    it('should return parent org', () => {
      const orgs = [
        {
          id: 'testorg',
        },
        {
          id: 'testorg2',
        },
      ];
      const location = {
        id: 'test',
        managingOrganization: {
          reference: 'Organization/testorg2',
        },
      };
      const org = getParentOfLocation(orgs, location);
      expect(org).to.equal(orgs[1]);
    });
  });

  describe('getFacilityIdFromLocation', () => {
    it('should get the facility id', () => {
      const location = {
        id: 'test',
        identifier: [
          {
            system: VHA_FHIR_ID,
            value: '983',
          },
        ],
      };
      const id = getFacilityIdFromLocation(location);
      expect(id).to.equal('983');
    });
  });
});
