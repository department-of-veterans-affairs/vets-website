import { expect } from 'chai';
import { getIsInCCPilot } from '../../utils/pilot';

describe('VAOS CC pilot utils', () => {
  describe('getIsInCCPilot', () => {
    it('Returns false when the user has a facility within the pilot list but the feature is off', () => {
      expect(getIsInCCPilot(false)).to.be.false;
    });
    it.skip('should return false if patientFacilities is empty', () => {
      expect(getIsInCCPilot(true, [])).to.be.false;
    });
    it.skip('Returns false when the user has no facilities in the pilot list', () => {
      expect(
        getIsInCCPilot(true, [{ facilityId: '123' }, { facilityId: '456' }]),
      ).to.be.false;
    });
    it.skip('Returns true when the user has a facility within the pilot list', () => {
      expect(
        getIsInCCPilot(true, [{ facilityId: '123' }, { facilityId: '984' }]),
      ).to.be.true;
    });
    it.skip('Returns true when the user has a facility within the pilot list as well as some outside', () => {
      expect(
        getIsInCCPilot(true, [{ facilityId: '657GL' }, { facilityId: '400' }]),
      ).to.be.true;
    });
  });
});
