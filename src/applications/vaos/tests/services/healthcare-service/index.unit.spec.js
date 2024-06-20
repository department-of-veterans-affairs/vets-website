import { expect } from 'chai';
import {
  mockFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';

import { getAvailableHealthcareServices } from '../../../services/healthcare-service';
import mockClinics from '../../../services/mocks/v2/clinics.json';

describe('VAOS Services: Healthcare ', () => {
  beforeEach(() => {
    mockFetch();
    setFetchJSONResponse(global.fetch, mockClinics);
  });

  describe('getAvailableHealthcareServices', () => {
    it('should make successful request', async () => {
      await getAvailableHealthcareServices({
        facilityId: '983',
        typeOfCare: { id: '123' },
      });

      expect(global.fetch.firstCall.args[0]).to.contain(
        '/vaos/v2/locations/983/clinics',
      );
    });

    it('should sort by serviceName', async () => {
      const data = await getAvailableHealthcareServices({
        facilityId: '983',
        typeOfCare: { id: '123' },
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
      });

      expect(data[0].id).to.equal('983_455');
    });

    it('should set stationId to the id of the VA facility where the clinic is located', async () => {
      const data = await getAvailableHealthcareServices({
        facilityId: '983',
        typeOfCare: { id: '123' },
      });

      expect(data[0].stationId).to.equal('983');
    });

    it('should set stationName to the name of the VA facility where the clinic is located', async () => {
      const data = await getAvailableHealthcareServices({
        facilityId: '983',
        typeOfCare: { id: '123' },
      });

      expect(data[0].stationName).to.equal('CHYSHR-Cheyenne VA Medical Center');
    });

    it('should set service name to clinic name', async () => {
      const data = await getAvailableHealthcareServices({
        facilityId: '983',
        typeOfCare: { id: '123' },
      });

      expect(data[1].serviceName).to.equal('CHY PC VAR2');
    });

    it('should set service name to friendly name when present', async () => {
      const data = await getAvailableHealthcareServices({
        facilityId: '983',
        typeOfCare: { id: '123' },
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
        });
      } catch (e) {
        error = e;
      }

      expect(global.fetch.firstCall.args[0]).to.contain(
        `/vaos/v2/locations/983/clinics`,
      );
      expect(error?.resourceType).to.equal('OperationOutcome');
    });
  });
});
