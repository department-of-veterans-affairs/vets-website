import { expect } from 'chai';
import { ADDRESS_TYPES_ALTERNATE, MILITARY_STATES } from '../../constants';
import { inferAddressType } from '../../util';

const address = {
  countryName: 'USA',
  addressOne: '123 Main St N',
  stateCode: 'MA',
  zipCode: '12345',
  type: ADDRESS_TYPES_ALTERNATE.domestic,
  city: 'Bygtowne',
};

describe('inferAddressType', () => {
  it("should set the type to international if USA isn't selected", () => {
    const newAddress = { ...address, countryName: 'Uganda' };
    expect(inferAddressType(newAddress).type).to.equal(
      ADDRESS_TYPES_ALTERNATE.international,
    );
  });

  it('should set the type to military if a military stateCode is chosen', () => {
    const newAddress = { ...address };
    Array.from(MILITARY_STATES).forEach(code => {
      newAddress.stateCode = code;
      expect(inferAddressType(newAddress).type).to.equal(
        ADDRESS_TYPES_ALTERNATE.military,
      );
    });
  });

  it('should set the type to domestic if the countryName is "United States"', () => {
    const newAddress = { ...address, countryName: 'United States' };
    expect(inferAddressType(newAddress).type).to.equal(
      ADDRESS_TYPES_ALTERNATE.domestic,
    );
  });

  it('should set the type to domestic if none of the above are true', () => {
    expect(inferAddressType(address).type).to.equal(
      ADDRESS_TYPES_ALTERNATE.domestic,
    );
  });
});
