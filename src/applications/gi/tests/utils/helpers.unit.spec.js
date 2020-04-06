import {
  formatNumber,
  formatCurrency,
  isVetTecSelected,
  addAllOption,
  isCountryUSA,
  isCountryInternational,
  rubyifyKeys,
  sortOptionsByStateName,
} from '../../utils/helpers';

describe('GIBCT helpers:', () => {
  describe('formatNumber', () => {
    test('should format numbers', () => {
      expect(formatNumber(1000)).toBe('1,000');
    });
  });

  describe('formatCurrency', () => {
    test('should format currency', () => {
      expect(formatCurrency(1000)).toBe('$1,000');
    });
    test('should round currency', () => {
      expect(formatCurrency(1000.5)).toBe('$1,001');
    });
  });

  describe('isVetTecSelected', () => {
    test('should recognize VET TEC', () => {
      expect(isVetTecSelected({ category: 'vettec' })).toBe(true);
    });
  });

  describe('addAllOption', () => {
    test('should add ALL option', () => {
      const options = [{ label: 'TEST', value: 'TEST' }];
      expect(addAllOption(options).length).toBe(2);
      expect(addAllOption(options)[0].label).toBe('ALL');
    });
  });

  describe('isCountryInternational', () => {
    test('should recognize USA', () => {
      expect(isCountryInternational('USA')).toBe(false);
    });
    test('should recognize non-USA', () => {
      expect(isCountryInternational('CAN')).toBe(true);
    });
    test('should handle lowercase country names', () => {
      expect(isCountryInternational('usa')).toBe(false);
    });
  });

  describe('isCountryUSA', () => {
    test('should recognize USA', () => {
      expect(isCountryUSA('USA')).toBe(true);
    });
    test('should recognize non-USA', () => {
      expect(isCountryUSA('CAN')).toBe(false);
    });
    test('should handle lowercase country names', () => {
      expect(isCountryUSA('usa')).toBe(true);
    });
  });

  describe('rubyifyKeys', () => {
    test('should properly snake-case keys', () => {
      const data = {
        testKey: '',
      };
      expect(rubyifyKeys(data)).to.have.key('test_key');
    });
  });

  describe('sortOptionsByStateName', () => {
    test('should sort an array of objects by label', () => {
      const data = [
        { value: 'AK', label: 'Alaska' },
        { value: 'AL', label: 'Alabama' },
        { value: 'AR', label: 'Arkansas' },
        { value: 'AZ', label: 'Arizona' },
        { value: 'CA', label: 'California' },
      ];
      const sortedData = [
        { value: 'AL', label: 'Alabama' },
        { value: 'AK', label: 'Alaska' },
        { value: 'AZ', label: 'Arizona' },
        { value: 'AR', label: 'Arkansas' },
        { value: 'CA', label: 'California' },
      ];
      expect(data.sort(sortOptionsByStateName)).toEqual(sortedData);
    });
  });
});
