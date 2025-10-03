import { expect } from 'chai';
import { getIsInPilotUserStations } from '../../utils/pilot';

describe('VAOS CC pilot utils', () => {
  describe('getIsInPilotUserStations', () => {
    it('Returns false when the user has a facility within the pilot list but the feature is off', () => {
      expect(getIsInPilotUserStations(false)).to.be.false;
    });
    it('should return false if patientFacilities is empty', () => {
      expect(getIsInPilotUserStations(true, [])).to.be.false;
    });
    it('Returns false when the user has no facilities in the pilot list', () => {
      expect(
        getIsInPilotUserStations(true, [
          { facilityId: '123' },
          { facilityId: '456' },
        ]),
      ).to.be.false;
    });
    it('Returns true when the user has a facility within the pilot list', () => {
      expect(
        getIsInPilotUserStations(true, [
          { facilityId: '123' },
          { facilityId: '984' },
        ]),
      ).to.be.true;
    });
    it('Returns true when the user has a facility within the pilot list as well as some outside', () => {
      expect(
        getIsInPilotUserStations(true, [
          { facilityId: '659' },
          { facilityId: '400' },
        ]),
      ).to.be.true;
    });
    it('Returns true when the user has a facility within the pilot extension', () => {
      expect(getIsInPilotUserStations(true, [{ facilityId: '648' }])).to.be
        .true;
    });
  });
});
