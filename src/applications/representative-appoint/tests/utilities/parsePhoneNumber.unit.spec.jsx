import { expect } from 'chai';

import { parsePhoneNumber } from '../../utilities/parsePhoneNumber';

describe('parsePhoneNumber', () => {
  it('should parse a valid US phone number', () => {
    const result = parsePhoneNumber('2234567890');
    expect(result).to.deep.equal({ contact: '2234567890', extension: null });
  });

  it('should parse a phone number with a US country code', () => {
    const result = parsePhoneNumber('+12234567890');
    expect(result).to.deep.equal({ contact: '2234567890', extension: null });
  });

  it('should parse a phone number with an extension', () => {
    const result = parsePhoneNumber('2234567890 x123');
    expect(result).to.deep.equal({ contact: '2234567890', extension: '123' });
  });

  it('should return null for non-US phone numbers', () => {
    const result = parsePhoneNumber('+441234567890');
    expect(result).to.deep.equal({ contact: null, extension: null });
  });

  it('should return null for invalid phone numbers', () => {
    const result = parsePhoneNumber('123');
    expect(result).to.deep.equal({ contact: null, extension: null });
  });
});
