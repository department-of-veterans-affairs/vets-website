import { expect } from 'chai';
import { checkReturnUrl } from '../helpers';

describe('AuthApp helpers', () => {
  describe('checkReturnUrl', () => {
    it('should return true/false', () => {
      expect(checkReturnUrl('https://int.eauth.va.gov/ebenefits')).to.be.true;
    });
  });
});
