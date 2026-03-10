import { expect } from 'chai';
import { combineUnitNameAddress } from '../../../utils/transformers/combineUnitNameAddress';

describe('combineUnitNameAddress', () => {
  it('should combine unit name and address into unitNameAndAddress', () => {
    const formData = JSON.stringify({
      unitName: 'Alpha Company',
      unitAddress: {
        street: '100 Military Base Rd',
        street2: 'Building 5',
        city: 'San Diego',
        state: 'CA',
        postalCode: '92101',
      },
    });

    const result = JSON.parse(combineUnitNameAddress(formData));

    expect(result.unitNameAndAddress).to.equal(
      'Alpha Company, 100 Military Base Rd, Building 5, San Diego, CA 92101',
    );
    expect(result.unitName).to.be.undefined;
    expect(result.unitAddress).to.be.undefined;
  });

  it('should handle unit name only without address', () => {
    const formData = JSON.stringify({
      unitName: 'Charlie Company',
      otherField: 'test',
    });

    const result = JSON.parse(combineUnitNameAddress(formData));

    expect(result.unitNameAndAddress).to.equal('Charlie Company');
    expect(result.unitName).to.be.undefined;
    expect(result.unitAddress).to.be.undefined;
    expect(result.otherField).to.equal('test');
  });

  it('should handle address only without unit name', () => {
    const formData = JSON.stringify({
      unitAddress: {
        street: '300 Fort St',
        city: 'Fort Worth',
        state: 'TX',
        postalCode: '76102',
      },
    });

    const result = JSON.parse(combineUnitNameAddress(formData));

    expect(result.unitNameAndAddress).to.equal(
      '300 Fort St, Fort Worth, TX 76102',
    );
    expect(result.unitName).to.be.undefined;
    expect(result.unitAddress).to.be.undefined;
  });

  it('should delete unitName and unitAddress fields after combining', () => {
    const formData = JSON.stringify({
      unitName: 'Delta Company',
      unitAddress: {
        street: '400 Army Rd',
        city: 'Columbus',
        state: 'OH',
        postalCode: '43215',
      },
    });

    const result = JSON.parse(combineUnitNameAddress(formData));

    expect(result).to.not.have.property('unitName');
    expect(result).to.not.have.property('unitAddress');
    expect(result).to.have.property('unitNameAndAddress');
  });

  it('should handle empty unitAddress object', () => {
    const formData = JSON.stringify({
      unitName: 'Echo Company',
      unitAddress: {},
    });

    const result = JSON.parse(combineUnitNameAddress(formData));

    expect(result.unitNameAndAddress).to.equal('Echo Company, ');
    expect(result.unitName).to.be.undefined;
    expect(result.unitAddress).to.be.undefined;
  });

  it('should handle neither unit name nor address', () => {
    const formData = JSON.stringify({
      otherField: 'test',
    });

    const result = JSON.parse(combineUnitNameAddress(formData));

    expect(result.unitNameAndAddress).to.be.undefined;
    expect(result.unitName).to.be.undefined;
    expect(result.unitAddress).to.be.undefined;
    expect(result.otherField).to.equal('test');
  });
});
