import { expect } from 'chai';

import { getEntityAddressAsObject } from '../../utilities/helpers';

describe('getEntityAddressAsObject', () => {
  it('should return correct address object based on formData', () => {
    const mockFormData = {
      addressLine1: '400 South 18th Street',
      addressLine2: 'Room 119',
      addressLine3: '',
      city: 'Newark',
      stateCode: 'NJ',
      zipCode: '07102',
    };

    const expectedAddressObject = {
      addressLine1: '400 South 18th Street',
      addressLine2: 'Room 119',
      addressLine3: '',
      city: 'Newark',
      stateCode: 'NJ',
      zipCode: '07102',
    };

    const result = getEntityAddressAsObject(mockFormData);
    expect(result).to.deep.equal(expectedAddressObject);
  });

  it('should return empty strings for missing address fields', () => {
    const mockFormData = {
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      city: '',
      stateCode: '',
      zipCode: '',
    };

    const expectedAddressObject = {
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      city: '',
      stateCode: '',
      zipCode: '',
    };

    const result = getEntityAddressAsObject(mockFormData);
    expect(result).to.deep.equal(expectedAddressObject);
  });
});
