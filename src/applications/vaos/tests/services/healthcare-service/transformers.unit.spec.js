import { expect } from 'chai';
import {
  transformAvailableClinic,
  transformAvailableClinics,
} from '../../../services/healthcare-service/transformers';

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
      expect(data[0].id).to.equal('var983_308');
    });

    it('should set resourceType', () => {
      expect(data[0].resourceType).to.equal('HealthcareService');
    });

    describe('External identifiers for this item', () => {
      it('should set system', () => {
        expect(data[0].identifier[0].system).to.equal(
          'http://med.va.gov/fhir/urn',
        );
      });

      it('should set value', () => {
        expect(data[0].identifier[0].value).to.equal(
          'urn:va:healthcareservice:983:983:308',
        );
      });
    });

    it('should set organization that provides this service', () => {
      expect(data[0].providedBy).to.equal('Organization/var983');
    });

    describe('Specific service delivered or performed', () => {
      describe('serviceType', () => {
        it('should set code', () => {
          expect(data[0].serviceType[0].type.coding.code).to.equal('323');
        });

        it('should set userSelected', () => {
          expect(data[0].serviceType[0].type.coding.userSelected).to.be.false;
        });
      });
    });

    describe('should set description of service as presented to a consumer while searching', () => {
      it('should use clinic name', () => {
        const obj = expect(data[1].serviceName).to.equal('CHY PC CASSIDY');
      });

      it('should use clinic friendly name when present', () => {
        expect(data[0].serviceName).to.equal('Green Team Clinic1');
      });
    });

    describe('Collection of characteristics (attributes)', () => {
      it('should contain 2 attributes', () => {
        expect(data[0].characteristic.length).to.equal(2);
      });

      describe('directSchedulingFlag', () => {
        it('should set code', () => {
          expect(data[0].characteristic[0].coding.code).to.equal('Y');
        });

        it('should set display', () => {
          expect(data[0].characteristic[0].coding.display).to.equal(
            'directSchedulingFlag',
          );
        });

        it('should set userSelected', () => {
          expect(data[0].characteristic[0].coding.userSelected).to.be.false;
        });

        it('should set text', () => {
          expect(data[0].characteristic[0].text).to.equal(
            'directSchedulingFlag',
          );
        });
      });

      describe('displayToPatientFlag', () => {
        it('should set code', () => {
          expect(data[0].characteristic[1].coding.code).to.equal('Y');
        });

        it('should set display', () => {
          expect(data[0].characteristic[1].coding.display).to.equal(
            'displayToPatientFlag',
          );
        });

        it('should set userSelected', () => {
          expect(data[0].characteristic[1].coding.userSelected).to.be.false;
        });

        it('should set text', () => {
          expect(data[0].characteristic[1].text).to.equal(
            'displayToPatientFlag',
          );
        });
      });
    });

    it('should set appointment is required flag for access to this service', () => {
      expect(data[0].appointmentRequired).to.be.true;
    });
  });
});
