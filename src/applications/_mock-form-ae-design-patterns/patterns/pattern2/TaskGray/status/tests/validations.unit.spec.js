import { expect } from 'chai';

import { FILE_TYPES } from '../constants';
import { isValidFileType } from '../validations';

describe('isValidFileType', () => {
  it('should return true for valid file types', () => {
    FILE_TYPES.forEach(type => {
      expect(isValidFileType({ name: `abc.${type}` })).to.be.true;
      expect(isValidFileType({ name: `ABC.${type.toUpperCase()}` })).to.be.true;
    });
  });
  it('should return false for non-valid file types', () => {
    FILE_TYPES.forEach(type => {
      expect(isValidFileType({ name: `abc.${type}x` })).to.be.false;
    });
    FILE_TYPES.forEach(type => {
      expect(isValidFileType({ name: `${type}.xyz0` })).to.be.false;
    });
  });
});
