import { expect } from 'chai';
import { getErrorCodes } from '../../utils/error';

describe('VAOS Utils: getErrorCodes', () => {
  describe('getErrorCodes', () => {
    it('should return array of error codes', () => {
      const error = {
        errors: [{ code: 'VAOS_400' }, { code: 'code1' }],
      };

      expect(getErrorCodes(error)).to.deep.equal(['VAOS_400', 'code1']);
    });
  });
});
