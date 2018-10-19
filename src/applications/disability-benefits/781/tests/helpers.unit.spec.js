import { expect } from 'chai';
import { locationSchemas } from '../helpers';

describe('781 helpers', () => {
  describe('locationSchemas', () => {
    it('should return adress UI schema', () => {
      expect(locationSchemas()).to.have.property('addressUI');
    });
    it('should return address schema', () => {
      expect(locationSchemas()).to.have.property('addressSchema');
    });
    it('should exclude street address inputs from UI schema', () => {
      const { addressUI } = locationSchemas();
      expect(addressUI).to.not.have.property('street');
      expect(addressUI).to.not.have.property('street2');
      expect(addressUI).to.not.have.property('street3');
      expect(addressUI).to.not.have.property('postalCode');
    });
    it('should exclude street address properties from schema', () => {
      const { addressSchema } = locationSchemas();
      expect(addressSchema.properties).to.not.have.property('street');
      expect(addressSchema.properties).to.not.have.property('street2');
      expect(addressSchema.properties).to.not.have.property('street3');
      expect(addressSchema.properties).to.not.have.property('postalCode');
    });
  });
});
