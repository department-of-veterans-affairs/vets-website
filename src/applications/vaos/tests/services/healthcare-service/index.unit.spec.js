import { expect } from 'chai';
import {
  mockFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';

import {
  getAvailableHealthcareServices,
  getSupportedHealthcareServicesAndLocations,
  findCharacteristic,
} from '../../../services/healthcare-service';
import { transformAvailableClinics } from '../../../services/healthcare-service/transformers';
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
        typeOfCareId: '123',
        systemId: '456',
      });

      expect(global.fetch.firstCall.args[0]).to.contain(
        '/v0/facilities/983/clinics?type_of_care_id=123&system_id=456',
      );
    });

    it('should sort by serviceName', async () => {
      const data = await getAvailableHealthcareServices({
        facilityId: '983',
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
        facilityId: '983',
        typeOfCareId: '123',
        systemId: '456',
      });

      expect(data[0].identifier[0].value).to.equal(
        'urn:va:healthcareservice:983:983:455',
      );
    });

    it('should set providedBy', async () => {
      const data = await getAvailableHealthcareServices({
        facilityId: '983',
        typeOfCareId: '123',
        systemId: '456',
      });

      expect(data[2].providedBy).to.equal('Organization/983');
    });

    it('should set location', async () => {
      const data = await getAvailableHealthcareServices({
        facilityId: '983',
        typeOfCareId: '123',
        systemId: '456',
      });

      expect(data[2].location.reference).to.equal('Location/983');
    });

    it('should set serviceType', async () => {
      const data = await getAvailableHealthcareServices({
        facilityId: '983',
        typeOfCareId: '123',
        systemId: '456',
      });

      expect(data[2].serviceType[0].type.coding.code).to.equal('123');
    });

    it('should set service name to clinic name', async () => {
      const data = await getAvailableHealthcareServices({
        facilityId: '983',
        typeOfCareId: '123',
        systemId: '456',
      });

      expect(data[1].serviceName).to.equal('CHY PC VAR2');
    });

    it('should set service name to friendly name when present', async () => {
      const data = await getAvailableHealthcareServices({
        facilityId: '983',
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
        await getAvailableHealthcareServices({
          facilityId: '983',
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
  describe('findCharacteristic', () => {
    const facilityId = '983';
    const typeOfCareId = '323';
    const clinics = [
      {
        id: '983',
        siteCode: '983',
        clinicId: '308',
        clinicName: 'CHY PC KILPATRICK',
        clinicFriendlyLocationName: 'Green Team Clinic1',
        primaryStopCode: '323',
        secondaryStopCode: '',
        directSchedulingFlag: 'Y',
        displayToPatientFlag: 'Y',
        institutionName: 'CHYSHR-Cheyenne VA Medical Center',
        institutionCode: '983',
        objectType: 'CdwClinic',
        link: [],
      },
      {
        id: '983',
        siteCode: '983',
        clinicId: '455',
        clinicName: 'CHY PC CASSIDY',
        clinicFriendlyLocationName: '',
        primaryStopCode: '323',
        secondaryStopCode: '',
        directSchedulingFlag: 'Y',
        displayToPatientFlag: 'Y',
        institutionName: 'CHYSHR-Cheyenne VA Medical Center',
        institutionCode: '983',
        objectType: 'CdwClinic',
        link: [],
      },
    ];
    const clinic = transformAvailableClinics(
      facilityId,
      typeOfCareId,
      clinics,
    )[0];

    it('should find the "directSchedulingFlag" characteristic of a clinic', () => {
      const result = findCharacteristic(clinic, 'directSchedulingFlag');
      expect(result).to.equal('Y');
    });

    it('should find the "displayToPatientFlag" characteristic of a clinic', () => {
      const result = findCharacteristic(clinic, 'displayToPatientFlag');
      expect(result).to.equal('Y');
    });

    it('should find the "institutionCode" characteristic of a clinic', () => {
      const result = findCharacteristic(clinic, 'institutionCode');
      expect(result).to.equal('983');
    });

    it('should find the "institutionName" characteristic of a clinic', () => {
      const result = findCharacteristic(clinic, 'institutionName');
      expect(result).to.equal('CHYSHR-Cheyenne VA Medical Center');
    });

    it('should find the "clinicFriendlyLocationName" characteristic of a clinic', () => {
      const result = findCharacteristic(clinic, 'clinicFriendlyLocationName');
      expect(result).to.equal('Green Team Clinic1');
    });
  });
});
