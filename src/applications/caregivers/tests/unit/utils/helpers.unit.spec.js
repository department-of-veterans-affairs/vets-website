import { expect } from 'chai';
import { isSsnUnique } from '../../../utils/helpers';

describe('CG helpers', () => {
  context('when `isSsnUnique` executes', () => {
    it(' should not count a party that is not present', () => {
      const formData = {
        veteranSsnOrTin: '222332222',
        'view:hasPrimaryCaregiver': true,
        primarySsnOrTin: '111332356',
        'view:hasSecondaryCaregiverOne': false,
        secondaryOneSsnOrTin: '222332222',
        'view:hasSecondaryCaregiverTwo': true,
        secondaryTwoSsnOrTin: '222332221',
      };
      expect(isSsnUnique(formData)).to.be.true;
    });

    it('should return `false` if SSN is the same and both are present', () => {
      const formData = {
        veteranSsnOrTin: '222332222',
        'view:hasPrimaryCaregiver': true,
        primarySsnOrTin: '111332356',
        'view:hasSecondaryCaregiverOne': true,
        secondaryOneSsnOrTin: '444332111',
        'view:hasSecondaryCaregiverTwo': true,
        secondaryTwoSsnOrTin: '222332222',
      };
      expect(isSsnUnique(formData)).to.be.false;
    });

    it('should return `true` if all SSNs are different', () => {
      const formData = {
        veteranSsnOrTin: '222332222',
        'view:hasPrimaryCaregiver': true,
        primarySsnOrTin: '111332356',
        'view:hasSecondaryCaregiverOne': true,
        secondaryOneSsnOrTin: '444332111',
        'view:hasSecondaryCaregiverTwo': true,
        secondaryTwoSsnOrTin: '222332245',
      };
      expect(isSsnUnique(formData)).to.be.true;
    });

    it('should return `true` and not count SSNs if they are undefined', () => {
      const formData = {
        veteranSsnOrTin: '222332222',
        'view:hasPrimaryCaregiver': true,
        primarySsnOrTin: '111332356',
        'view:hasSecondaryCaregiverOne': true,
        secondaryOneSsnOrTin: undefined,
        'view:hasSecondaryCaregiverTwo': true,
        secondaryTwoSsnOrTin: undefined,
      };
      expect(isSsnUnique(formData)).to.be.true;
    });
  });
});
