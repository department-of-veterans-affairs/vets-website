import * as addressUtils from '../address';
import { expect } from 'chai';

const domestic = {
  type: 'DOMESTIC',
  countryName: 'USA',
  addressOne: 'First',
  addressTwo: 'Second',
  addressThree: 'Third',
  city: 'City',
  stateCode: 'KY',
  zipCode: '12345'
};

const international = {
  type: 'INTERNATIONAL',
  countryName: 'Canada',
  addressOne: 'First',
  addressTwo: 'Second',
  addressThree: 'Third',
  city: 'Montreal'
};

const military = {
  type: 'MILITARY',
  addressOne: 'First',
  addressTwo: 'Second',
  addressThree: 'Third',
  militaryPostOfficeTypeCode: 'APO',
  militaryStateCode: 'AA',
  zipCode: '12345'
};

describe('formatAddress', () => {

  it('formats domestic addresses', () => {
    const expectedResult = {
      street: 'First, Second Third',
      cityStateZip: 'City, Kentucky 12345',
      country: ''
    };

    expect(addressUtils.formatAddress(domestic)).to.deep.equal(expectedResult);
  });

  it('formats military addresses', () => {
    const expectedResult = {
      street: 'First, Second Third',
      cityStateZip: 'APO, AA 12345',
      country: ''
    };

    expect(addressUtils.formatAddress(military)).to.deep.equal(expectedResult);
  });

  it('formats international addresses', () => {
    const expectedResult = {
      street: 'First, Second Third',
      cityStateZip: 'Montreal',
      country: 'Canada'
    };

    expect(addressUtils.formatAddress(international)).to.deep.equal(expectedResult);
  });

});

describe('getStateName', () => {

  it('gets the full name of a state from its abbreviation', () => {
    expect(addressUtils.getStateName('KY')).to.equal('Kentucky');
    expect(addressUtils.getStateName('ky')).to.equal('Kentucky');
  });

});

describe('isEmptyAddress', () => {

  it('detects an empty address', () => {
    expect(addressUtils.isEmptyAddress({})).to.equal(true);
    expect(addressUtils.isEmptyAddress({ type: 'domestic', countryName: 'USA' })).to.equal(true);
  });

  it('detects a non-empty address', () => {
    expect(addressUtils.isEmptyAddress(domestic)).to.equal(false);
  });

});

describe('consolidateAddress', () => {
  it('converts a military address into a standard address format', () => {
    const expectedResult = {
      type: 'MILITARY',
      countryName: 'USA',
      addressOne: 'First',
      addressTwo: 'Second',
      addressThree: 'Third',
      city: 'APO',
      stateCode: 'AA',
      zipCode: '12345'
    };
    expect(addressUtils.consolidateAddress(military)).to.deep.equal(expectedResult);
  });
  it('does not affect non-military addresses', () => {
    expect(addressUtils.consolidateAddress(domestic)).to.deep.equal(domestic);
  });
});

describe('expandAddress', () => {
  it('converts a previously-consolidated address into the proper model by inferring the address type', () => {
    const consolidated = addressUtils.consolidateAddress(military);
    consolidated.type = 'Will be inferred based on address fields';
    expect(addressUtils.expandAddress(consolidated)).to.deep.equal(military);
  });
  it('does not affect non-military addresses', () => {
    expect(addressUtils.expandAddress(domestic)).to.deep.equal(domestic);
  });
});
