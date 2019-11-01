import { expect } from 'chai';

import {
  formatNumber,
  formatCurrency,
  isVetTecSelected,
  addAllOption,
  isCountryUSA,
  isCountryInternational,
  snakeCaseKeys,
} from '../../utils/helpers';

describe('GIBCT helpers:', () => {
  describe('formatNumber', () => {
    it('should format numbers', () => {
      expect(formatNumber(1000)).to.equal('1,000');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency', () => {
      expect(formatCurrency(1000)).to.equal('$1,000');
    });
    it('should round currency', () => {
      expect(formatCurrency(1000.5)).to.equal('$1,001');
    });
  });

  describe('isVetTecSelected', () => {
    it('should recognize VET TEC', () => {
      expect(isVetTecSelected({ category: 'vettec' })).to.be.true;
    });
    it('should recognize vetTecProvider flag', () => {
      expect(isVetTecSelected({ vetTecProvider: true })).to.be.true;
    });
  });

  describe('addAllOption', () => {
    it('should add ALL option', () => {
      const options = [{ label: 'TEST', value: 'TEST' }];
      expect(addAllOption(options).length).to.equal(2);
      expect(addAllOption(options)[0].label).to.equal('ALL');
    });
  });

  describe('isCountryInternational', () => {
    it('should recognize USA', () => {
      expect(isCountryInternational('USA')).to.be.false;
    });
    it('should recognize non-USA', () => {
      expect(isCountryInternational('CAN')).to.be.true;
    });
    it('should handle lowercase country names', () => {
      expect(isCountryInternational('usa')).to.be.false;
    });
  });

  describe('isCountryUSA', () => {
    it('should recognize USA', () => {
      expect(isCountryUSA('USA')).to.be.true;
    });
    it('should recognize non-USA', () => {
      expect(isCountryUSA('CAN')).to.be.false;
    });
    it('should handle lowercase country names', () => {
      expect(isCountryUSA('usa')).to.be.true;
    });
  });

  describe('snakeCaseKeys', () => {
    it('should properly snake-case keys', () => {
      const data = {
        testKey: '',
      };

      expect(snakeCaseKeys(data)).to.have.key('test_key');
    });
  });
});
