import { expect } from 'chai';
import { splitAddressLine } from '../../helpers';

describe('splitAddressLine', () => {
  it('should return the entire address line if it is shorter than or equal to maxLength', () => {
    const addressLine = '123 Main St';
    const maxLength = 20;
    const result = splitAddressLine(addressLine, maxLength);
    expect(result).to.deep.equal({ line1: '123 Main St', line2: '' });
  });

  it('should split the address line at the last space within maxLength', () => {
    const addressLine = '123 Main St, Springfield, IL';
    const maxLength = 20;
    const result = splitAddressLine(addressLine, maxLength);
    expect(result).to.deep.equal({
      line1: '123 Main St,',
      line2: 'Springfield, IL',
    });
  });

  it('should split the address line at maxLength if there are no spaces', () => {
    const addressLine = '123MainStreetSpringfieldIL';
    const maxLength = 20;
    const result = splitAddressLine(addressLine, maxLength);
    expect(result).to.deep.equal({
      line1: '123MainStreetSpringf',
      line2: 'ieldIL',
    });
  });

  it('should handle empty address lines', () => {
    const addressLine = '';
    const maxLength = 10;
    const result = splitAddressLine(addressLine, maxLength);
    expect(result).to.deep.equal({ line1: '', line2: '' });
  });

  it('should handle maxLength of 0', () => {
    const addressLine = '123 Main St';
    const maxLength = 0;
    const result = splitAddressLine(addressLine, maxLength);
    expect(result).to.deep.equal({ line1: '', line2: '123 Main St' });
  });
});
