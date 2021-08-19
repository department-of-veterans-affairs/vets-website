import { expect } from 'chai';
import { transformAvailableClinics } from '../../../services/healthcare-service/transformers';

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

describe('VAOS HealthcareService transformer', () => {
  describe('transformAvailableClinics', () => {
    const data = transformAvailableClinics(facilityId, typeOfCareId, clinics);

    it('should set id', () => {
      expect(data[0].id).to.equal('983_308');
    });

    it('should set the facility ID where the clinic is located', () => {
      expect(data[0].stationId).to.equal('983');
    });

    it('should set the name of the VA facility where the clinic is located', () => {
      expect(data[0].stationName).to.equal('CHYSHR-Cheyenne VA Medical Center');
    });

    describe('should set description of service as presented to a consumer while searching', () => {
      it('should use clinic name', () => {
        expect(data[1].serviceName).to.equal('CHY PC CASSIDY');
      });

      it('should use clinic friendly name when present', () => {
        expect(data[0].serviceName).to.equal('Green Team Clinic1');
      });
    });
  });
});
