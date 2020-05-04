import * as addressUtils from '../address/helpers';
import { expect } from 'chai';

// Examples from:
// https://github.com/department-of-veterans-affairs/vets-api/blob/1efd2c206859b1a261e762a50cdb44dc8b66462d/spec/factories/pciu_address.rb#L34

const domestic = {
  type: 'DOMESTIC',
  countryName: 'USA',
  addressLine1: '140 Rock Creek Church Rd NW',
  addressLine2: 'Apt 57',
  addressLine3: 'Area Name',
  city: 'Springfield',
  stateCode: 'OR',
  zipCode: '97477',
  zipSuffix: '',
};

const international = {
  type: 'INTERNATIONAL',
  countryName: 'France',
  addressLine1: '2 Avenue Gabriel',
  addressLine2: 'Line2',
  addressLine3: 'Line3',
  city: 'Paris',
  province: 'Ile-de-France',
  internationalPostalCode: '75000',
};

// 'countryName' is NOT part of the Military Address model.
const military = {
  type: 'MILITARY',
  addressLine1: '57 Columbus Strassa',
  addressLine2: 'Line2',
  addressLine3: 'Ben Franklin Village',
  militaryPostOfficeTypeCode: 'APO',
  militaryStateCode: 'AE',
  zipCode: '09028',
  zipSuffix: '1234',
};

describe('formatAddress', () => {
  it('formats domestic addresses with three street lines', () => {
    const expectedResult = {
      street: '140 Rock Creek Church Rd NW, Apt 57, Area Name',
      cityStateZip: 'Springfield, Oregon 97477',
      country: '',
    };

    expect(addressUtils.formatAddress(domestic)).to.deep.equal(expectedResult);
  });

  it('formats domestic addresses with two street lines', () => {
    const expectedResult = {
      street: '140 Rock Creek Church Rd NW, Apt 57',
      cityStateZip: 'Springfield, Oregon 97477',
      country: '',
    };
    const address = { ...domestic };
    address.addressLine3 = '';
    expect(addressUtils.formatAddress(address)).to.deep.equal(expectedResult);
  });

  it('formats domestic addresses with one street line', () => {
    const expectedResult = {
      street: '140 Rock Creek Church Rd NW',
      cityStateZip: 'Springfield, Oregon 97477',
      country: '',
    };
    const address = { ...domestic };
    address.addressLine2 = '';
    address.addressLine3 = '';
    expect(addressUtils.formatAddress(address)).to.deep.equal(expectedResult);
  });

  it('formats military addresses', () => {
    const expectedResult = {
      street: '57 Columbus Strassa, Line2, Ben Franklin Village',
      cityStateZip: 'APO, AE 09028',
      country: '',
    };

    expect(addressUtils.formatAddress(military)).to.deep.equal(expectedResult);
  });

  it('formats international addresses', () => {
    const expectedResult = {
      street: '2 Avenue Gabriel, Line2, Line3',
      cityStateZip: 'Paris, Ile-de-France, 75000',
      country: 'France',
    };

    expect(addressUtils.formatAddress(international)).to.deep.equal(
      expectedResult,
    );
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
    expect(
      addressUtils.isEmptyAddress({ type: 'domestic', countryName: 'USA' }),
    ).to.equal(true);
  });

  it('detects a non-empty address', () => {
    expect(addressUtils.isEmptyAddress(domestic)).to.equal(false);
  });
});

describe('consolidateAddress', () => {
  it('converts a military address into a standard address format by adding the countryName set to USA, militaryPostOfficeTypeCode converted to city, and militaryStateCode converted to stateCode.', () => {
    const expectedResult = {
      type: 'MILITARY',
      countryName: 'USA',
      addressLine1: military.addressLine1,
      addressLine2: military.addressLine2,
      addressLine3: military.addressLine3,
      city: military.militaryPostOfficeTypeCode,
      stateCode: military.militaryStateCode,
      zipCode: military.zipCode,
      zipSuffix: military.zipSuffix,
    };
    expect(addressUtils.consolidateAddress(military)).to.deep.equal(
      expectedResult,
    );
  });
  it('does not affect non-military addresses', () => {
    expect(addressUtils.consolidateAddress(domestic)).to.deep.equal(domestic);
  });
});

describe('expandAddress', () => {
  it('converts a previously-consolidated address into the proper model by inferring the address type. If it is inferred as military, the inverse conversion of consolidateAddress is performed.', () => {
    const consolidated = addressUtils.consolidateAddress(military);
    consolidated.type = 'Will be inferred based on address fields';
    expect(addressUtils.expandAddress(consolidated)).to.deep.equal(military);
  });
  it('does not affect non-military addresses', () => {
    expect(addressUtils.expandAddress(domestic)).to.deep.equal(domestic);
  });
});
