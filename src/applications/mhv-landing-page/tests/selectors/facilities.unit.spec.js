import { expect } from 'chai';
import { profileHasEHRM, profileHasVista } from '../../selectors/facilities';

describe('facilities selectors', () => {
  describe('profileHasEHRM', () => {
    it('should return true if the profile has EHRM facilities', () => {
      const profile = { facilities: [{ isCerner: true }] };
      expect(profileHasEHRM({ profile })).to.be.true;
    });

    it('should return false if the profile has no EHRM facilities', () => {
      const profile = { facilities: [{ isCerner: false }] };
      expect(profileHasEHRM({ profile })).to.be.false;
    });

    it('should return false if the profile is empty', () => {
      const profile = { facilities: [] };
      expect(profileHasEHRM({ profile })).to.be.false;
    });
  });

  describe('profileHasVista', () => {
    it('should return true if the profile has VistA facilities', () => {
      const profile = { facilities: [{ isCerner: false }] };
      expect(profileHasVista({ profile })).to.be.true;
    });

    it('should return false if the profile has no VistA facilities', () => {
      const profile = { facilities: [{ isCerner: true }] };
      expect(profileHasVista({ profile })).to.be.false;
    });

    it('should return false if the profile is empty', () => {
      const profile = { facilities: [] };
      expect(profileHasVista({ profile })).to.be.false;
    });
  });
});
