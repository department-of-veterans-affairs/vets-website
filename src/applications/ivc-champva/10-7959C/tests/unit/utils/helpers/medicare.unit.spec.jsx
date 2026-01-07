import { expect } from 'chai';
import {
  hasMedicare,
  hasPartsAB,
  hasPartA,
  hasPartB,
  hasPartC,
  hasPartsABorC,
  hasPartD,
  needsPartADenialNotice,
  hasPartADenialNotice,
} from '../../../../utils/helpers';

describe('10-7959c Medicare helpers', () => {
  describe('hasMedicare', () => {
    it('should return "true" when view:hasMedicare is true', () => {
      const formData = { 'view:hasMedicare': true };
      expect(hasMedicare(formData)).to.be.true;
    });

    it('should return "false" when view:hasMedicare is false', () => {
      const formData = { 'view:hasMedicare': false };
      expect(hasMedicare(formData)).to.be.false;
    });

    it('should return "false" when view:hasMedicare is not set', () => {
      const formData = {};
      expect(hasMedicare(formData)).to.be.false;
    });
  });

  describe('hasPartsAB', () => {
    it('should return "true" when beneficiary has Medicare and plan type is ab', () => {
      const formData = {
        'view:hasMedicare': true,
        medicarePlanType: 'ab',
      };
      expect(hasPartsAB(formData)).to.be.true;
    });

    it('should return "false" when beneficiary has Medicare but plan type is not ab', () => {
      const formData = {
        'view:hasMedicare': true,
        medicarePlanType: 'a',
      };
      expect(hasPartsAB(formData)).to.be.false;
    });

    it('should return "false" when beneficiary does not have Medicare', () => {
      const formData = {
        'view:hasMedicare': false,
        medicarePlanType: 'ab',
      };
      expect(hasPartsAB(formData)).to.be.false;
    });
  });

  describe('hasPartA', () => {
    it('should return true when has Medicare and plan type is a', () => {
      const formData = {
        'view:hasMedicare': true,
        medicarePlanType: 'a',
      };
      expect(hasPartA(formData)).to.be.true;
    });

    it('should return false when plan type is not a', () => {
      const formData = {
        'view:hasMedicare': true,
        medicarePlanType: 'b',
      };
      expect(hasPartA(formData)).to.be.false;
    });
  });

  describe('hasPartB', () => {
    it('should return "true" when beneficiary has Medicare and plan type is "b"', () => {
      const formData = {
        'view:hasMedicare': true,
        medicarePlanType: 'b',
      };
      expect(hasPartB(formData)).to.be.true;
    });

    it('should return "false" when plan type is not "b"', () => {
      const formData = {
        'view:hasMedicare': true,
        medicarePlanType: 'a',
      };
      expect(hasPartB(formData)).to.be.false;
    });
  });

  describe('hasPartC', () => {
    it('should return "true" when beneficiary has Medicare and plan type is "c"', () => {
      const formData = {
        'view:hasMedicare': true,
        medicarePlanType: 'c',
      };
      expect(hasPartC(formData)).to.be.true;
    });

    it('should return "false" when plan type is not "c"', () => {
      const formData = {
        'view:hasMedicare': true,
        medicarePlanType: 'a',
      };
      expect(hasPartC(formData)).to.be.false;
    });
  });

  describe('hasPartsABorC', () => {
    it('should return "true" when plan type is "ab"', () => {
      const formData = {
        'view:hasMedicare': true,
        medicarePlanType: 'ab',
      };
      expect(hasPartsABorC(formData)).to.be.true;
    });

    it('should return "true" when plan type is "c"', () => {
      const formData = {
        'view:hasMedicare': true,
        medicarePlanType: 'c',
      };
      expect(hasPartsABorC(formData)).to.be.true;
    });

    it('should return "false" when plan type is "a"', () => {
      const formData = {
        'view:hasMedicare': true,
        medicarePlanType: 'a',
      };
      expect(hasPartsABorC(formData)).to.be.false;
    });

    it('should return "false" when plan type is "b"', () => {
      const formData = {
        'view:hasMedicare': true,
        medicarePlanType: 'b',
      };
      expect(hasPartsABorC(formData)).to.be.false;
    });
  });

  describe('hasPartD', () => {
    it('should return "true" when beneficiary has Medicare, the plan type is "ab" or "c" and hasMedicarePartD is "true"', () => {
      const formData = {
        'view:hasMedicare': true,
        medicarePlanType: 'ab',
        hasMedicarePartD: true,
      };
      expect(hasPartD(formData)).to.be.true;
    });

    it('should return "false" when beneficiary has Medicare, the plan type is "ab" or "c" hasMedicarePartD is "false"', () => {
      const formData = {
        'view:hasMedicare': true,
        medicarePlanType: 'ab',
        hasMedicarePartD: false,
      };
      expect(hasPartD(formData)).to.be.false;
    });

    it('should return "false" when the plan type is not "ab" or "c"', () => {
      const formData = {
        'view:hasMedicare': true,
        medicarePlanType: 'a',
        hasMedicarePartD: true,
      };
      expect(hasPartD(formData)).to.be.false;
    });
  });

  describe('needsPartADenialNotice', () => {
    it('should return "true" when plan type is "b"', () => {
      const formData = {
        'view:hasMedicare': true,
        medicarePlanType: 'b',
      };
      expect(needsPartADenialNotice(formData)).to.be.true;
    });

    it('should return "true" when beneficiary does not have Medicare but is age 65 or older', () => {
      const formData = {
        'view:hasMedicare': false,
        'view:beneficiaryAgeOver65': true,
      };
      expect(needsPartADenialNotice(formData)).to.be.true;
    });

    it('should return "false" when plan type is "a"', () => {
      const formData = {
        'view:hasMedicare': true,
        medicarePlanType: 'a',
      };
      expect(needsPartADenialNotice(formData)).to.be.false;
    });

    it('should return "false" when beneficiary does not have Medicare but is not age 65 or older', () => {
      const formData = {
        'view:hasMedicare': false,
        'view:beneficiaryAgeOver65': false,
      };
      expect(needsPartADenialNotice(formData)).to.be.false;
    });
  });

  describe('hasPartADenialNotice', () => {
    it('should return "true" when beneficiary needs denial notice and has it', () => {
      const formData = {
        'view:hasMedicare': true,
        medicarePlanType: 'b',
        'view:hasPartADenial': {
          hasPartADenial: true,
        },
      };
      expect(hasPartADenialNotice(formData)).to.be.true;
    });

    it('should return "false" when beneficiary needs denial notice but does not have it', () => {
      const formData = {
        'view:hasMedicare': true,
        medicarePlanType: 'b',
        'view:hasPartADenial': {
          hasPartADenial: false,
        },
      };
      expect(hasPartADenialNotice(formData)).to.be.false;
    });

    it('should return "false" when beneficiary does not need denial notice', () => {
      const formData = {
        'view:hasMedicare': true,
        medicarePlanType: 'a',
        'view:hasPartADenial': {
          hasPartADenial: true,
        },
      };
      expect(hasPartADenialNotice(formData)).to.be.false;
    });
  });
});
