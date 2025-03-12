import { expect } from 'chai';
import { hasEHRM, hasVista } from '../../selectors/facilities';

describe('facilities selectors', () => {
  describe('hasEHRM', () => {
    it('should return true if the profile has EHRM facilities', () => {
      const profile = { facilities: [{ isCerner: true }] };
      expect(hasEHRM({ profile })).to.be.true;
    });

    it('should return false if the profile has no EHRM facilities', () => {
      const profile = { facilities: [{ isCerner: false }] };
      expect(hasEHRM({ profile })).to.be.false;
    });

    it('should return false if the profile is empty', () => {
      const profile = { facilities: [] };
      expect(hasEHRM({ profile })).to.be.false;
    });
  });

  describe('hasVista', () => {
    it('should return true if the profile has VistA facilities', () => {
      const profile = { facilities: [{ isCerner: false }] };
      expect(hasVista({ profile })).to.be.true;
    });

    it('should return false if the profile has no VistA facilities', () => {
      const profile = { facilities: [{ isCerner: true }] };
      expect(hasVista({ profile })).to.be.false;
    });

    it('should return false if the profile is empty', () => {
      const profile = { facilities: [] };
      expect(hasVista({ profile })).to.be.false;
    });
  });
});
