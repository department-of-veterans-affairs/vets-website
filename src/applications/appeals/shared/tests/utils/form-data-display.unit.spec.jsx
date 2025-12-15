import { expect } from 'chai';
import { convertBoolResponseToYesNo } from '../../utils/form-data-display';

describe('utils: form data display', () => {
  describe('convertBoolResponseToYesNo', () => {
    it('should properly handle a non-boolean falsy response', () => {
      expect(convertBoolResponseToYesNo(null)).to.equal('Not answered');
      expect(convertBoolResponseToYesNo('')).to.equal('Not answered');
      expect(convertBoolResponseToYesNo(undefined)).to.equal('Not answered');
    });

    it('should properly handle a non-boolean truthy response', () => {
      expect(convertBoolResponseToYesNo(' ')).to.equal('Not answered');
    });

    it('should properly handle a boolean false response', () => {
      expect(convertBoolResponseToYesNo(false)).to.equal('No');
    });

    it('should properly handle a boolean true response', () => {
      expect(convertBoolResponseToYesNo(true)).to.equal('Yes');
    });
  });
});
