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

  it('should correctly handle livesOnMilitaryBase address', () => {
    const formData = {
      'view:livesOnMilitaryBase': true,
      countryCodeIso3: 'USA',
      stateCode: 'AA',
      city: 'APO',
      zipCode: '26789',
    };

    const result = prepareAddressData(formData);

    expect(result).to.have.property('stateCode', 'AA');
    expect(result).to.have.property('zipCode', '26789');
  });
});
