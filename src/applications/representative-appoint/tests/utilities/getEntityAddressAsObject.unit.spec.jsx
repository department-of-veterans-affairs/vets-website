import { expect } from 'chai';

import { getEntityAddressAsObject } from '../../utilities/helpers';

describe('getEntityAddressAsObject', () => {
  it('should return correct address object based on formData', () => {
    const mockFormData = {
      'view:selectedRepresentative': {
        addressLine1: '400 South 18th Street',
        addressLine2: 'Room 119',
        addressLine3: '',
        city: 'Newark',
        stateCode: 'NJ',
        zipCode: '07102',
      },
    };

    const expectedAddressObject = {
      address1: '400 South 18th Street',
      address2: 'Room 119',
      address3: '',
      city: 'Newark',
      state: 'NJ',
      zip: '07102',
    };

    const result = getEntityAddressAsObject(mockFormData);
    expect(result).to.deep.equal(expectedAddressObject);
  });

  it('should return empty strings for missing address fields', () => {
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

    const expectedAddressObject = {
      address1: '',
      address2: '',
      address3: '',
      city: '',
      state: '',
      zip: '',
    };

    const result = getEntityAddressAsObject(mockFormData);
    expect(result).to.deep.equal(expectedAddressObject);
  });
});
