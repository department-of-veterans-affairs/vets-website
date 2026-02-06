import { expect } from 'chai';
import claimantAddress from '../../../pages/claimantAddress';

const FIELDS = ['country', 'street', 'city', 'postalCode'];
const addrUI = claimantAddress.uiSchema.claimantAddress;

describe('27-8832 claimantAddress page', () => {
  it('adds a ui:required function for every required address field by default', () => {
    FIELDS.forEach(field => {
      expect(addrUI).to.have.property(field);
      expect(addrUI[field]['ui:required']).to.be.a('function');
    });
  });
});
