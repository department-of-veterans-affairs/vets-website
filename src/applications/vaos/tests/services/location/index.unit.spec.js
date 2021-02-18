import { expect } from 'chai';
import {
  mockFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';

import {
  getCommunityProvidersByTypeOfCare,
  getFacilityIdFromLocation,
  getLocation,
  getLocations,
  getLocationsByTypeOfCareAndSiteIds,
  getParentOfLocation,
  getSupportedLocationsByTypeOfCare,
} from '../../../services/location';
import facilities983 from '../../../services/mocks/var/facilities_983.json';
import facilityDetails from '../../../services/mocks/var/facility_data.json';
import requestEligbilityCriteria from '../../../services/mocks/var/request_eligibility_criteria.json';
import directBookingEligbilityCriteria from '../../../services/mocks/var/direct_booking_eligibility_criteria.json';
import ccProviders from '../../../services/mocks/var/cc_providers.json';
import { VHA_FHIR_ID } from '../../../utils/constants';

describe('VAOS Location service', () => {
  describe('getSupportedLocationsByTypeOfCare', () => {
    let data;

    it('should make successful request', async () => {
      mockFetch();
      setFetchJSONResponse(global.fetch, facilities983);
      data = await getSupportedLocationsByTypeOfCare({
        siteId: '983',
        parentId: '983A6',
        typeOfCareId: '123',
      });

      expect(global.fetch.firstCall.args[0]).to.contain(
        'vaos/v0/systems/983/direct_scheduling_facilities?type_of_care_id=123&parent_code=983A6',
      );
      expect(data[0].identifier[1].value).to.equal('urn:va:division:983:983');
    });

    it('should sort by name', async () => {
      mockFetch();
      setFetchJSONResponse(global.fetch, facilities983);
      data = await getSupportedLocationsByTypeOfCare({
        siteId: '983',
        parentId: '983A6',
        typeOfCareId: '123',
      });

      expect(data[0].name).to.equal('CHYSHR-Cheyenne VA Medical Center');
      expect(data[1].name).to.equal('CHYSHR-Fort Collins VA Clinic');
      expect(data[2].name).to.equal('CHYSHR-Loveland VA Clinic');
      expect(data[3].name).to.equal('CHYSHR-Sidney VA Clinic');
      expect(data[4].name).to.equal('CHYSHR-Wheatland VA Mobile Clinic');
    });

    it('should return OperationOutcome error', async () => {
      mockFetch();
      setFetchJSONFailure(global.fetch, {
        errors: [],
      });

      let error;
      try {
        data = await getSupportedLocationsByTypeOfCare({
          siteId: '983',
          parentId: '983A6',
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
        facilityIds: ['983A6'],
      });

      expect(global.fetch.firstCall.args[0]).to.contain(
        '/facilities/va?ids=vha_442A6',
      );
      expect(data[0].identifier[0].value).to.equal('urn:va:division:983:983');
    });
    it('should return OperationOutcome error', async () => {
      mockFetch();
      setFetchJSONFailure(global.fetch, {
        errors: [],
      });

      let error;
      try {
        data = await getLocations({
          facilityIds: ['983'],
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
        facilityId: '983A6',
      });

      expect(global.fetch.firstCall.args[0]).to.contain(
        '/facilities/va/vha_442A6',
      );
      expect(data.identifier[0].value).to.equal('urn:va:division:983:983');
    });

    it('should return OperationOutcome error', async () => {
      mockFetch();
      setFetchJSONFailure(global.fetch, {
        errors: [],
      });

      let error;
      try {
        data = await getLocation({
          facilityId: '983',
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

  describe('getLocationsByTypeOfCareAndSiteIds', () => {
    let data;

    it('should make 3 successful requests', async () => {
      mockFetch();
      setFetchJSONResponse(global.fetch, requestEligbilityCriteria);
      setFetchJSONResponse(
        global.fetch.onCall(1),
        directBookingEligbilityCriteria,
      );
      setFetchJSONResponse(global.fetch.onCall(2), facilityDetails);

      data = await getLocationsByTypeOfCareAndSiteIds({
        typeOfCareId: '323',
        siteIds: ['983', '984'],
        directSchedulingEnabled: true,
      });

      expect(global.fetch.firstCall.args[0]).to.contain(
        '/request_eligibility_criteria?parent_sites[]=983&parent_sites[]=984',
      );
      expect(global.fetch.secondCall.args[0]).to.contain(
        '/direct_booking_eligibility_criteria?parent_sites[]=983&parent_sites[]=984',
      );
      expect(global.fetch.thirdCall.args[0]).to.contain(
        '/v1/facilities/va?ids=vha_442GD,vha_442GC,vha_442GB,vha_442HK,vha_442,vha_442QA,vha_552GD,vha_552GB,vha_552,vha_552GC,vha_552GA,vha_442QE,vha_552GF',
      );
      expect(data[0].resourceType).to.equal('Location');
      expect(data[0].name).to.equal('Cheyenne VA Medical Center');
      expect('requestSupported' in data[0].legacyVAR).to.equal(true);
      expect('directSchedulingSupported' in data[0].legacyVAR).to.equal(true);
    });

    it('should skip direct booking fetch if direct scheduling disabled', async () => {
      mockFetch();
      setFetchJSONResponse(global.fetch, requestEligbilityCriteria);
      setFetchJSONResponse(global.fetch.onCall(1), facilityDetails);

      data = await getLocationsByTypeOfCareAndSiteIds({
        typeOfCareId: '323',
        siteIds: ['983', '984'],
        directSchedulingEnabled: false,
      });

      expect(global.fetch.firstCall.args[0]).to.contain(
        '/request_eligibility_criteria?parent_sites[]=983&parent_sites[]=984',
      );
      expect(global.fetch.secondCall.args[0]).to.contain(
        '/v1/facilities/va?ids=',
      );
      expect(data[0].resourceType).to.equal('Location');
      expect('requestSupported' in data[0].legacyVAR).to.equal(true);
      expect('directSchedulingSupported' in data[0].legacyVAR).to.equal(true);
    });

    it('should return OperationOutcome error', async () => {
      mockFetch();
      setFetchJSONFailure(global.fetch, {
        errors: [],
      });

      let error;
      try {
        data = await getLocationsByTypeOfCareAndSiteIds({
          typeOfCareId: '323',
          siteIds: ['983', '984'],
          directSchedulingEnabled: true,
        });
      } catch (e) {
        error = e;
      }

      expect(global.fetch.firstCall.args[0]).to.contain(
        '/request_eligibility_criteria?parent_sites[]=983&parent_sites[]=984',
      );
      expect(error?.resourceType).to.equal('OperationOutcome');
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
  describe('getCommunityProvidersByTypeOfCare', () => {
    it('should make request to facilities api using correct bounding box', async () => {
      mockFetch();
      setFetchJSONResponse(global.fetch, ccProviders);

      const data = await getCommunityProvidersByTypeOfCare({
        address: {
          addressLine1: '123 big sky st',
          city: 'Bozeman',
          stateCode: 'MT',
          zipCode: '59715',
          country: 'United States',
          latitude: -72.73,
          longitude: 42.12,
        },
        typeOfCare: {
          specialties: ['133NN1002X'],
        },
      });

      expect(global.fetch.firstCall.args[0]).to.contain(
        '/v1/facilities/ccp?latitude=-72.73&longitude=42.12&radius=60&per_page=15&page=1&bbox[]=-73.598&bbox[]=39.194&bbox[]=-71.862&bbox[]=45.046&specialties[]=133NN1002X&type=provider&trim=true',
      );
      expect(data.length).to.equal(ccProviders.data.length);
      const firstProvider = ccProviders.data[0];
      const firstLocation = data[0];
      expect(firstLocation.name).to.equal(firstProvider.attributes.name);
      expect(firstLocation.id).to.equal(firstProvider.id);
      expect(firstLocation.telecom[0].value).to.equal(
        firstProvider.attributes.caresitePhone,
      );
      expect(firstLocation.address.line[0]).to.equal(
        firstProvider.attributes.address.street,
      );
    });
  });
});
