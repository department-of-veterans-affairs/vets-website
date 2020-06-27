import { expect } from 'chai';
import {
  mockFetch,
  resetFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
  mockMultipleApiRequests,
} from 'platform/testing/unit/helpers';

import { getLocation } from '../../../services/location';
import { getAvailableHealthcareServices } from '../../../services/healthcare-service';
import facilities983 from '../../../api/facilities_983.json';
import clinicList983 from '../../../api/clinicList983.json';

describe('VAOS Healthcare service', () => {
  describe('getAvailableHealthcareServices', () => {
    beforeEach(() => {
      mockFetch();
      setFetchJSONResponse(global.fetch, clinicList983);
    });
    afterEach(() => {
      resetFetch();
    });
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
});
