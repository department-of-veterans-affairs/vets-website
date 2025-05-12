import { expect } from 'chai';
import newMailingAddress from '../../../pages/newMailingAddress';

const addrUI = newMailingAddress.uiSchema.newMailingAddress;
const FIELDS = ['country', 'street', 'city', 'postalCode'];

describe('28-1900 newMailingAddress page', () => {
  it('adds ui:required functions to every required address field', () => {
    FIELDS.forEach(field => {
      expect(addrUI).to.have.property(field);
      expect(addrUI[field]['ui:required']).to.be.a('function');
    });
  });

  it('marks every required address field as required by default', () => {
    const formData = {}; // doesn’t matter: should always be true
    FIELDS.forEach(field => {
      const requiredFn = addrUI[field]['ui:required'];
      expect(requiredFn(formData)).to.be.true;
    });
  });

  it('defines newMailingAddress in the schema', () => {
    expect(newMailingAddress.schema.properties).to.have.property(
      'newMailingAddress',
    );
  });
});
