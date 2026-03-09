import { expect } from 'chai';
import { buildUnitAddress } from '../../../utils/transformers/buildUnitAddress';

describe('buildUnitAddress', () => {
  it('should keep unitName and convert unitAddress to string', () => {
    const formData = JSON.stringify({
      unitName: 'Delta Company',
      unitAddress: {
        street: '300 Fort St',
        city: 'Fort Worth',
        state: 'TX',
        postalCode: '76102',
      },
    });

    const result = JSON.parse(buildUnitAddress(formData));

    expect(result).to.have.property('unitName');
    expect(result.unitName).to.equal('Delta Company');
    expect(result).to.have.property('unitAddress');
    expect(result.unitAddress).to.equal('300 Fort St, Fort Worth, TX 76102');
  });

  it('should not modify form when unitAddress is missing', () => {
    const formData = JSON.stringify({
      unitName: 'Charlie Company',
      otherField: 'test',
    });

    const result = JSON.parse(buildUnitAddress(formData));

    expect(result.unitAddress).to.be.undefined;
    expect(result.unitName).to.equal('Charlie Company');
    expect(result.otherField).to.equal('test');
  });

  it('should handle empty unitAddress object', () => {
    const formData = JSON.stringify({
      unitName: 'Echo Company',
      unitAddress: {},
    });

    const result = JSON.parse(buildUnitAddress(formData));

    expect(result.unitAddress).to.equal('');
    expect(result.unitName).to.equal('Echo Company');
  });
});
