import { expect } from 'chai';
import mainMailingAddress from '../../../pages/mainMailingAddress';

const FIELDS = ['country', 'street', 'city', 'postalCode'];
const addrUI = mainMailingAddress.uiSchema.mainMailingAddress;

describe('28-1900 mainMailingAddress page', () => {
  it('adds a ui:required function for every required address field by default', () => {
    FIELDS.forEach(field => {
      expect(addrUI).to.have.property(field);
      expect(addrUI[field]['ui:required']).to.be.a('function');
    });
  });

  it('makes address fields **not** required when "I do not have a mailing address" is checked', () => {
    const formData = { checkBoxGroup: { checkForMailingAddress: true } };

    FIELDS.forEach(field => {
      const requiredFn = addrUI[field]['ui:required'];
      expect(requiredFn(formData)).to.be.false;
    });
  });

  it('makes address fields required when when "I do not have a mailing address" is unchecked', () => {
    const formData = { checkBoxGroup: { checkForMailingAddress: false } };

    FIELDS.forEach(field => {
      const requiredFn = addrUI[field]['ui:required'];
      expect(requiredFn(formData)).to.be.true;
    });
  });
});
