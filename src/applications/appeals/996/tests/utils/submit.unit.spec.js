import { expect } from 'chai';

import {
  getAddress,
  getConferenceTime,
  getRep,
  getTimeZone,
  getContact,
} from '../../utils/submit';

describe('getRep', () => {
  const getDataV2 = ({
    rep = 'rep',
    extension = '1234',
    email = 'sully@pixar.com',
  } = {}) => ({
    informalConference: rep,
    informalConferenceRep: {
      firstName: 'James',
      lastName: 'Sullivan',
      phone: '8005551212',
      extension,
      email,
    },
  });

  it('should return null for v2 non-rep choices', () => {
    expect(getRep(getDataV2({ rep: 'me' }))).to.be.null;
  });
  it('should return all v2 rep info', () => {
    expect(getRep(getDataV2({}))).to.deep.equal({
      firstName: 'James',
      lastName: 'Sullivan',
      phone: {
        countryCode: '1',
        areaCode: '800',
        phoneNumber: '5551212',
        phoneNumberExt: '1234',
      },
      email: 'sully@pixar.com',
    });
  });
  it('should not include empty v2 rep info', () => {
    expect(getRep(getDataV2({ extension: '', email: '' }))).to.deep.equal({
      firstName: 'James',
      lastName: 'Sullivan',
      phone: {
        countryCode: '1',
        areaCode: '800',
        phoneNumber: '5551212',
      },
    });
  });
});

describe('getConferenceTime', () => {
  it('should return empty string', () => {
    expect(getConferenceTime()).to.equal('');
  });
  it('should return v2 times', () => {
    expect(
      getConferenceTime({ informalConferenceTime: 'time0800to1200' }),
    ).to.deep.equal('800-1200 ET');
    expect(
      getConferenceTime({ informalConferenceTime: 'time1200to1630' }),
    ).to.deep.equal('1200-1630 ET');
  });
});

describe('getAddress', () => {
  it('should return a cleaned up address object', () => {
    // zipCode5 returns 5 zeros if country isn't set to 'US'
    const result = { zipCode5: '00000' };
    const wrap = obj => ({ veteran: { address: obj } });
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
});

describe('getTimeZone', () => {
  it('should return a string', () => {
    // result will be a location string, not stubbing for this test
    expect(getTimeZone().length).to.be.greaterThan(1);
  });
});

describe('getContact', () => {
  it('should return an empty string', () => {
    expect(getContact({})).to.eq('');
  });
  it('should return a string containing representative', () => {
    expect(getContact({ informalConference: 'rep' })).to.eq('representative');
  });
  it('should return a string containing veteran', () => {
    expect(getContact({ informalConference: 'me' })).to.eq('veteran');
  });
});
