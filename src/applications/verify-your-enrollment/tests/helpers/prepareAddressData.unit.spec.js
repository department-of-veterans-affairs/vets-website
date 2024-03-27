import { expect } from 'chai';
import { prepareAddressData } from '../../helpers';

describe('prepareAddressData', () => {
  it('should correctly handle a USA address', () => {
    const formData = {
      countryCodeIso3: 'USA',
      stateCode: 'NY',
      zipCode: '10001',
    };

    const result = prepareAddressData(formData);

    expect(result).to.have.property('stateCode', 'NY');
    expect(result).to.have.property('zipCode', '10001');
  });

  it('should correctly handle a non-USA address', () => {
    const formData = {
      countryCodeIso3: 'CAN',
      province: 'ON',
      internationalPostalCode: 'K1A 0B1',
    };

    const result = prepareAddressData(formData);

    expect(result).to.have.property('stateCode', 'ON');
    expect(result).to.have.property('zipCode', 'K1A 0B1');
  });
});
