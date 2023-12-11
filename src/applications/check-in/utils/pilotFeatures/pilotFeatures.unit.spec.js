import { expect } from 'chai';
import { isInPilot } from './index';

describe('check in utils', () => {
  describe('isInPilotFeature', () => {
    const featuredAppointment = {
      stationNo: '0001',
      clinicIen: '0001',
    };
    const nonFeaturedStation = {
      stationNo: '0002',
      clinicIen: '0001',
    };
    const nonFeaturedClinic = {
      stationNo: '0001',
      clinicIen: '0002',
    };
    it('should return false if feature not defined', () => {
      expect(
        isInPilot({
          appointment: featuredAppointment,
          pilotFeature: 'notAPilot',
        }),
      ).to.be.false;
    });
    it('should return false if station not in list', () => {
      expect(
        isInPilot({
          appointment: nonFeaturedStation,
          pilotFeature: 'exampleFeature',
        }),
      ).to.be.false;
    });
    it('should return false if clinic not in list', () => {
      expect(
        isInPilot({
          appointment: nonFeaturedClinic,
          pilotFeature: 'exampleFeature',
        }),
      ).to.be.false;
    });
    it('should return true if clinic, and station match', () => {
      expect(
        isInPilot({
          appointment: featuredAppointment,
          pilotFeature: 'exampleFeature',
        }),
      ).to.be.true;
    });
    it('should return true if only station is listed', () => {
      const appointment = {
        stationNo: '500',
        clinicIen: '3003',
      };
      expect(isInPilot({ appointment, pilotFeature: 'exampleFeature' })).to.be
        .true;
    });
  });
});
