import { expect } from 'chai';
import { isInPilot } from './index';

describe('check in utils', () => {
  describe('isInPilotFeature', () => {
    it('should return false if feature not defined', () => {
      const appointment = {
        stationNo: '0001',
        clinicIen: '0001',
      };
      expect(isInPilot({ appointment, pilotFeature: 'notAPilot' })).to.be.false;
    });
    it('should return false if station not in list', () => {
      const appointment = {
        stationNo: '0002',
        clinicIen: '0001',
      };
      expect(isInPilot({ appointment, pilotFeature: 'fileTravelClaim' })).to.be
        .false;
    });
    it('should return false if clinic not in list', () => {
      const appointment = {
        stationNo: '0001',
        clinicIen: '0002',
      };
      expect(isInPilot({ appointment, pilotFeature: 'fileTravelClaim' })).to.be
        .false;
    });
    it('should return true if clinic, and station match', () => {
      const appointment = {
        stationNo: '0001',
        clinicIen: '0001',
      };
      expect(isInPilot({ appointment, pilotFeature: 'fileTravelClaim' })).to.be
        .true;
    });
    it('should return true only station listed', () => {
      const appointment = {
        stationNo: '500',
        clinicIen: '3003',
      };
      expect(isInPilot({ appointment, pilotFeature: 'fileTravelClaim' })).to.be
        .true;
    });
  });
});
