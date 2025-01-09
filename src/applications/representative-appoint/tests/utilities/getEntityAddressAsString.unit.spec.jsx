import { expect } from 'chai';

import { getEntityAddressAsString } from '../../utilities/helpers';

describe('getEntityAddressAsString', () => {
  it('should return the correct formatted address string based on formData', () => {
    const mockFormData = {
      addressLine1: '400 South 18th Street',
      addressLine2: 'Room 119',
      addressLine3: '',
      city: 'Newark',
      stateCode: 'NJ',
      zipCode: '07102',
    };

    const expectedAddressString =
      '400 South 18th Street Room 119 Newark, NJ 07102';
    const result = getEntityAddressAsString(mockFormData);
    expect(result).to.equal(expectedAddressString);
  });

  it('should return a correctly formatted string with missing fields', () => {
    const mockFormData = {
      'view:selectedRepresentative': {
        addressLine1: '',
        addressLine2: '',
        addressLine3: '',
        city: '',
        stateCode: '',
        zipCode: '',
      },
    };

    const expectedAddressString = '';
    const result = getEntityAddressAsString(mockFormData);
    expect(result).to.equal(expectedAddressString);
  });
});
