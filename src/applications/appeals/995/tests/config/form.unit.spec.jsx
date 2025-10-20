import { expect } from 'chai';
import formConfig from '../../config/form';

describe('formConfig', () => {
  // Increase test coverage
  describe('additionalRoutes', () => {
    it('should correctly return the depends function', () => {
      expect(formConfig.additionalRoutes[0].depends()).to.be.false;
      expect(formConfig.additionalRoutes[0].depends('anything')).to.be.false;
    });
  });
});
