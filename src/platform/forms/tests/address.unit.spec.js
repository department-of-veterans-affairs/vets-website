import { expect } from 'chai';
import * as addressUtils from '../address/helpers';

const domestic = {
  addressType: 'DOMESTIC',
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
  addressType: 'INTERNATIONAL',
  countryName: 'France',
  addressLine1: '2 Avenue Gabriel',
  addressLine2: 'Line2',
  addressLine3: 'Line3',
  city: 'Paris',
  stateCode: null,
  province: 'Ile-de-France',
  internationalPostalCode: '75000',
};

// 'countryName' is NOT part of the Military Address model.
const military = {
  addressType: 'OVERSEAS MILITARY',
  addressLine1: '57 Columbus Strassa',
  addressLine2: 'Line2',
  addressLine3: 'Ben Franklin Village',
  city: 'APO',
  stateCode: 'AE',
  zipCode: '09028',
  zipSuffix: '1234',
};

describe('formatAddress', () => {
  it('should not throw an error with a null address', () => {
    const expectedResult = {
      street: '',
      cityStateZip: '',
      country: '',
    };

    expect(addressUtils.formatAddress(null)).to.deep.equal(expectedResult);
  });
  it('formats domestic addresses with three street lines', () => {
    const expectedResult = {
      street: '140 Rock Creek Church Rd NW, Apt 57, Area Name',
      cityStateZip: 'Springfield, OR 97477',
      country: '',
    };

    expect(addressUtils.formatAddress(domestic)).to.deep.equal(expectedResult);
  });

  it('formats domestic addresses with two street lines', () => {
    const expectedResult = {
      street: '140 Rock Creek Church Rd NW, Apt 57',
      cityStateZip: 'Springfield, OR 97477',
      country: '',
    };
    const address = { ...domestic };
    address.addressLine3 = '';
    expect(addressUtils.formatAddress(address)).to.deep.equal(expectedResult);
  });

  it('formats domestic addresses with one street line', () => {
    const expectedResult = {
      street: '140 Rock Creek Church Rd NW',
      cityStateZip: 'Springfield, OR 97477',
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
      cityStateZip: 'APO, Armed Forces Europe (AE) 09028',
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
      addressUtils.isEmptyAddress({
        addressType: 'DOMESTIC',
        countryName: 'USA',
      }),
    ).to.equal(true);
  });

  it('detects a non-empty address', () => {
    expect(addressUtils.isEmptyAddress(domestic)).to.equal(false);
  });
});
