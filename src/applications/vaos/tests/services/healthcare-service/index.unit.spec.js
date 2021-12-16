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
import clinicList983 from '../../../services/mocks/var/clinicList983.json';

describe('VAOS Healthcare service', () => {
  beforeEach(() => {
    mockFetch();
    setFetchJSONResponse(global.fetch, clinicList983);
  });

  describe('getAvailableHealthcareServices', () => {
    it('should make successful request', async () => {
      await getAvailableHealthcareServices({
        facilityId: '983',
        typeOfCare: { id: '123' },
        systemId: '456',
      });

      expect(global.fetch.firstCall.args[0]).to.contain(
        '/v0/facilities/983/clinics?type_of_care_id=123&system_id=456',
      );
    });

    it('should sort by serviceName', async () => {
      const data = await getAvailableHealthcareServices({
        facilityId: '983',
        typeOfCare: { id: '123' },
        systemId: '456',
      });

      expect(data[0].serviceName).to.equal('CHY PC CASSIDY');
      expect(data[1].serviceName).to.equal('CHY PC VAR2');
      expect(data[2].serviceName).to.equal('Green Team Clinic1');
      expect(data[3].serviceName).to.equal('Green Team Clinic2');
    });

    it('should set an id', async () => {
      const data = await getAvailableHealthcareServices({
        facilityId: '983',
        typeOfCare: { id: '123' },
        systemId: '456',
      });

      expect(data[0].id).to.equal('983_455');
    });

    it('should set stationId to the id of the VA facility where the clinic is located', async () => {
      const data = await getAvailableHealthcareServices({
        facilityId: '983',
        typeOfCare: { id: '123' },
        systemId: '456',
      });

      expect(data[0].stationId).to.equal('983');
    });

    it('should set stationName to the name of the VA facility where the clinic is located', async () => {
      const data = await getAvailableHealthcareServices({
        facilityId: '983',
        typeOfCare: { id: '123' },
        systemId: '456',
      });

      expect(data[0].stationName).to.equal('CHYSHR-Cheyenne VA Medical Center');
    });

    it('should set service name to clinic name', async () => {
      const data = await getAvailableHealthcareServices({
        facilityId: '983',
        typeOfCare: { id: '123' },
        systemId: '456',
      });

      expect(data[1].serviceName).to.equal('CHY PC VAR2');
    });

    it('should set service name to friendly name when present', async () => {
      const data = await getAvailableHealthcareServices({
        facilityId: '983',
        typeOfCare: { id: '123' },
        systemId: '456',
      });

      expect(data[0].serviceName).to.equal('CHY PC CASSIDY');
    });

    it('should return OperationOutcome error', async () => {
      setFetchJSONFailure(global.fetch, {
        errors: [],
      });

      let error;
      try {
        await getAvailableHealthcareServices({
          facilityId: '983',
          typeOfCare: { id: '123' },
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
  });
});
