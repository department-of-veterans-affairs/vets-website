import { expect } from 'chai';
import {
  mockFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';

import {
  getAvailableHealthcareServices,
  getSupportedHealthcareServicesAndLocations,
} from '../../../services/healthcare-service';
import mockLocations983 from '../../../services/healthcare-service/mock_locations_983.json';
import clinicList983 from '../../../api/clinicList983.json';

describe('VAOS Healthcare service', () => {
  beforeEach(() => {
    mockFetch();
    setFetchJSONResponse(global.fetch, clinicList983);
  });

  describe('getAvailableHealthcareServices', () => {
    it('should make successful request', async () => {
      const data = await getAvailableHealthcareServices({
        facilityId: 'var983',
        typeOfCareId: '123',
        systemId: '456',
      });

      expect(global.fetch.firstCall.args[0]).to.contain(
        '/v0/facilities/983/clinics?type_of_care_id=123&system_id=456',
      );
    });

    it('should sort by serviceName', async () => {
      const data = await getAvailableHealthcareServices({
        facilityId: 'var983',
        typeOfCareId: '123',
        systemId: '456',
      });

      expect(data[0].serviceName).to.equal('CHY PC CASSIDY');
      expect(data[1].serviceName).to.equal('CHY PC VAR2');
      expect(data[2].serviceName).to.equal('Green Team Clinic1');
      expect(data[3].serviceName).to.equal('Green Team Clinic2');
    });

    it('should set identifier', async () => {
      const data = await getAvailableHealthcareServices({
        facilityId: 'var983',
        typeOfCareId: '123',
        systemId: '456',
      });

      expect(data[0].identifier[0].value).to.equal(
        'urn:va:healthcareservice:983:983:455',
      );
    });

    it('should set providedBy', async () => {
      const data = await getAvailableHealthcareServices({
        facilityId: 'var983',
        typeOfCareId: '123',
        systemId: '456',
      });

      expect(data[2].providedBy).to.equal('Organization/var983');
    });

    it('should set location', async () => {
      const data = await getAvailableHealthcareServices({
        facilityId: 'var983',
        typeOfCareId: '123',
        systemId: '456',
      });

      expect(data[2].location.reference).to.equal('Location/var983');
    });

    it('should set serviceType', async () => {
      const data = await getAvailableHealthcareServices({
        facilityId: 'var983',
        typeOfCareId: '123',
        systemId: '456',
      });

      expect(data[2].serviceType[0].type.coding.code).to.equal('123');
    });

    it('should set service name to clinic name', async () => {
      const data = await getAvailableHealthcareServices({
        facilityId: 'var983',
        typeOfCareId: '123',
        systemId: '456',
      });

      expect(data[1].serviceName).to.equal('CHY PC VAR2');
    });

    it('should set service name to friendly name when present', async () => {
      const data = await getAvailableHealthcareServices({
        facilityId: 'var983',
        typeOfCareId: '123',
        systemId: '456',
      });

      expect(data[0].serviceName).to.equal('CHY PC CASSIDY');
    });

    it('should return OperationOutcome error', async () => {
      mockFetch();
      setFetchJSONFailure(global.fetch, {
        errors: [],
      });

      let error;
      try {
        const data = await getAvailableHealthcareServices({
          facilityId: 'var983',
          typeOfCareId: '123',
          systemId: '456',
        });
      } catch (e) {
        error = e;
      }

      expect(global.fetch.firstCall.args[0]).to.contain(
        `/vaos/v0/facilities/983/clinics?type_of_care_id=123&system_id=456`,
      );
      expect(error?.resourceType).to.equal('OperationOutcome');
    });
  });

  describe('getSupportedHealthcareServicesAndLocations', () => {
    it('should make successful request', async () => {
      await getSupportedHealthcareServicesAndLocations({
        siteId: '983',
        parentId: '983GC',
        typeOfCareId: '123',
      });

      expect(global.fetch.firstCall.args[0]).to.contain(
        '/v0/systems/983/direct_scheduling_facilities?type_of_care_id=123&parent_code=983GC',
      );
    });

    it('should return OperationOutcome error', async () => {
      mockFetch();
      setFetchJSONFailure(global.fetch, {
        errors: [],
      });

      let error;
      try {
        await getSupportedHealthcareServicesAndLocations({
          siteId: '983',
          parentId: '983GC',
          typeOfCareId: '123',
        });
      } catch (e) {
        error = e;
      }

      expect(global.fetch.firstCall.args[0]).to.contain(
        '/v0/systems/983/direct_scheduling_facilities?type_of_care_id=123&parent_code=983GC',
      );
      expect(error?.resourceType).to.equal('OperationOutcome');
    });

    it('should make successful request to VSP api', async () => {
      mockFetch();
      setFetchJSONResponse(global.fetch, mockLocations983);
      const data = await getSupportedHealthcareServicesAndLocations({
        siteId: '983',
        useVSP: true,
      });

      expect(global.fetch.firstCall.args[0]).to.contain(
        '/HealthcareService?organization:Organization.identifier=983' +
          '&characteristic=PATIENTDS_ENABLED&_include=HealthcareService:location',
      );
      expect(data.locations.length).to.equal(3);
      expect(data.healthcareServices.length).to.equal(20);
      expect(data.locations[0].resourceType).to.equal('Location');
      expect(data.healthcareServices[0].resourceType).to.equal(
        'HealthcareService',
      );
    });
  });
});
