import { expect } from 'chai';
import { getAddress, getEmail } from '../../../utils/submit';

const text =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, seddo eiusmod tempor incididunt ut labore et dolore magna aliqua. Utenim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

describe('getAddress', () => {
  const wrap = obj => ({
    veteran: { address: obj },
  });
  it('should return a cleaned up address object', () => {
    // zipCode5 returns 5 zeros if country isn't set to 'US'
    const result = { zipCode5: '00000' };
    expect(getAddress()).to.deep.equal(result);
    expect(getAddress({})).to.deep.equal(result);
    expect(getAddress(wrap({}))).to.deep.equal(result);
    expect(getAddress(wrap({ temp: 'test' }))).to.deep.equal(result);
    expect(getAddress(wrap({ addressLine1: 'test' }))).to.deep.equal({
      addressLine1: 'test',
      zipCode5: '00000',
    });
    expect(
      getAddress(wrap({ countryCodeIso2: 'US', zipCode: '10101' })),
    ).to.deep.equal({
      countryCodeISO2: 'US',
      zipCode5: '10101',
    });
    expect(
      getAddress(
        wrap({
          addressLine1: '123 test',
          addressLine2: 'c/o foo',
          addressLine3: 'suite 99',
          city: 'Big City',
          stateCode: 'NV',
          zipCode: '10101',
          countryCodeIso2: 'US',
          internationalPostalCode: '12345',
          extra: 'will not be included',
        }),
      ),
    ).to.deep.equal({
      addressLine1: '123 test',
      addressLine2: 'c/o foo',
      addressLine3: 'suite 99',
      city: 'Big City',
      stateCode: 'NV',
      zipCode5: '10101',
      countryCodeISO2: 'US',
      internationalPostalCode: '12345',
    });
    expect(
      getAddress(
        wrap({
          addressLine1: '123 test',
          addressLine2: 'c/o foo',
          addressLine3: 'suite 99',
          city: 'Big City',
          stateCode: 'NV',
          zipCode: '10101',
          countryCodeIso2: 'GB',
          internationalPostalCode: '12345',
          extra: 'will not be included',
        }),
      ),
    ).to.deep.equal({
      addressLine1: '123 test',
      addressLine2: 'c/o foo',
      addressLine3: 'suite 99',
      city: 'Big City',
      stateCode: 'NV',
      zipCode5: '00000',
      countryCodeISO2: 'GB',
      internationalPostalCode: '12345',
    });
    expect(
      getAddress(
        wrap({ countryCodeIso2: 'GB', internationalPostalCode: '55555' }),
      ),
    ).to.deep.equal({
      countryCodeISO2: 'GB',
      zipCode5: '00000',
      internationalPostalCode: '55555',
    });
  });
  it('should truncate long address lines', () => {
    expect(getAddress(wrap({ addressLine1: text }))).to.deep.equal({
      addressLine1:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed',
      zipCode5: '00000',
    });
    expect(getAddress(wrap({ addressLine2: text }))).to.deep.equal({
      addressLine2: 'Lorem ipsum dolor sit amet, co',
      zipCode5: '00000',
    });
    expect(getAddress(wrap({ addressLine3: text }))).to.deep.equal({
      addressLine3: 'Lorem ipsu',
      zipCode5: '00000',
    });
    expect(getAddress(wrap({ city: text }))).to.deep.equal({
      city: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed',
      zipCode5: '00000',
    });
    expect(
      getAddress(wrap({ countryCodeIso2: 'US', zipCode: '123450000' })),
    ).to.deep.equal({
      countryCodeISO2: 'US',
      zipCode5: '12345',
    });
    expect(
      getAddress(
        wrap({
          countryCodeIso2: 'GB',
          internationalPostalCode: '12345678901234567890',
        }),
      ),
    ).to.deep.equal({
      countryCodeISO2: 'GB',
      zipCode5: '00000',
      internationalPostalCode: '1234567890123456',
    });
  });
});

describe('getEmail', () => {
  it('should return an empty string', () => {
    expect(getEmail()).to.eq('');
    expect(getEmail({})).to.eq('');
    expect(getEmail({ veteran: {} })).to.eq('');
  });
  it('should return the defined email', () => {
    expect(getEmail({ veteran: { email: 'test@test.com' } })).to.eq(
      'test@test.com',
    );
  });
  it('should return the defined email truncated to 255 characters', () => {
    const email = `${'abcde12345'.repeat(25)}@test.com`;
    const result = getEmail({ veteran: { email } });
    expect(result.length).to.eq(255);
    // results in an invalid email, but we use profile, and they won't accept
    // emails > 255 characters in length
    expect(result.slice(-10)).to.eq('12345@test');
  });
});
