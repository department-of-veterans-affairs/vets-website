import {
  mockFetch,
  setFetchJSONFailure,
  setFetchJSONResponse,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import { expect } from 'chai';

import {
  getCommunityProvidersByTypeOfCare,
  getFacilityIdFromLocation,
  getLocation,
  getLocations,
  getLocationsByTypeOfCareAndSiteIds,
} from '.';
import MockFacilityResponse from '../../tests/fixtures/MockFacilityResponse';
import MockSchedulingConfigurationResponse, {
  MockServiceConfiguration,
} from '../../tests/fixtures/MockSchedulingConfigurationResponse';
import {
  mockFacilitiesApi,
  mockSchedulingConfigurationsApi,
} from '../../tests/mocks/mockApis';
import { VHA_FHIR_ID, TYPE_OF_CARE_IDS } from '../../utils/constants';
import ccProviders from '../mocks/v2/cc_providers.json';
import facilityDetails from '../mocks/v2/facilities.json';

describe('VAOS Services: Location ', () => {
  describe('getLocations', () => {
    let data;

    it('should make successful request', async () => {
      mockFetch();
      setFetchJSONResponse(global.fetch, facilityDetails);
      data = await getLocations({
        facilityIds: ['983A6'],
      });

      expect(global.fetch.firstCall.args[0]).to.contain(
        '/vaos/v2/facilities?children=false&ids[]=983A6',
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
        'vaos/v2/facilities?children=false&ids[]=983',
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
        '/vaos/v2/facilities/983A6',
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
        '/vaos/v2/facilities/983',
      );
      expect(error?.resourceType).to.equal('OperationOutcome');
    });
  });

  describe('getLocationsByTypeOfCareAndSiteIds', () => {
    let data;

    it('should make 3 successful requests', async () => {
      mockFetch();
      mockFacilitiesApi({
        children: true,
        response: [
          new MockFacilityResponse(),
          new MockFacilityResponse({ id: '984' }),
        ],
      });
      mockSchedulingConfigurationsApi({
        response: [
          new MockSchedulingConfigurationResponse({
            facilityId: '983',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'primaryCare',
                requestEnabled: true,
                directEnabled: true,
              }),
            ],
          }),
          new MockSchedulingConfigurationResponse({
            facilityId: '984',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'primaryCare',
              }),
            ],
          }),
        ],
      });

      data = await getLocationsByTypeOfCareAndSiteIds({
        typeOfCareId: TYPE_OF_CARE_IDS.PRIMARY_CARE,
        siteIds: ['983', '984'],
      });

      expect(global.fetch.firstCall.args[0]).to.contain(
        '/vaos/v2/facilities?children=true&ids[]=983&ids[]=984',
      );
      expect(global.fetch.secondCall.args[0]).to.contain(
        '/v2/scheduling/configurations?facility_ids[]=983&facility_ids[]=984',
      );
      expect(data[0].resourceType).to.equal('Location');
      expect(data[0].name).to.equal('Cheyenne VA Medical Center');
      expect(
        data[0].legacyVAR.settings[TYPE_OF_CARE_IDS.PRIMARY_CARE]?.request
          .enabled,
      ).to.be.true;
      expect(
        data[0].legacyVAR.settings[TYPE_OF_CARE_IDS.PRIMARY_CARE]?.direct
          .enabled,
      ).to.be.true;
    });

    it('should return OperationOutcome error', async () => {
      mockFetch();
      setFetchJSONFailure(global.fetch, {
        errors: [],
      });

      let error;
      try {
        data = await getLocationsByTypeOfCareAndSiteIds({
          typeOfCareId: TYPE_OF_CARE_IDS.PRIMARY_CARE,
          siteIds: ['983', '984'],
        });
      } catch (e) {
        error = e;
      }

      expect(global.fetch.firstCall.args[0]).to.contain(
        '/vaos/v2/facilities?children=true&ids[]=983&ids[]=984',
      );
      expect(error?.resourceType).to.equal('OperationOutcome');
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
        '/facilities_api/v2/ccp/provider?latitude=-72.73&longitude=42.12&radius=60&per_page=15&page=1&bbox[]=-73.598&bbox[]=39.194&bbox[]=-71.862&bbox[]=45.046&specialties[]=133NN1002X&trim=true',
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
