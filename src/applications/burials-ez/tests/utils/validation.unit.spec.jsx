import sinon from 'sinon';
import { expect } from 'chai';

import { validateBenefitsIntakeName } from '../../utils/validation';

describe('Burials validation', () => {
  describe('validateBenefitsIntakeName', () => {
    it('should accept names with at least one alphabetic character', () => {
      const errors = {
        addError: sinon.spy(),
      };
      validateBenefitsIntakeName(errors, 'f!r57 n4m3');

      expect(errors.addError.called).to.be.false;
    });
    it('should prohibit names without at least one alphabetic character', () => {
      const errors = {
        addError: sinon.spy(),
      };
      validateBenefitsIntakeName(errors, '108 97 115 116 32 110 97 109 101');

      expect(errors.addError.called).to.be.true;
    });
  });
});
