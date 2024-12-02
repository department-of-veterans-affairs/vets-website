import { expect } from 'chai';
import {
  titleCaseRepresentativeName,
  titleCase,
  buildAddressArray,
} from '../../utils/representativeAddress';

describe('titleCaseRepresentativeName', () => {
  it('Should convert all caps to title case', () => {
    const actual = titleCaseRepresentativeName(
      'FAYETTEVILLE VA MEDICAL CENTER',
    );
    expect(actual).to.equal('Fayetteville VA Medical Center');
  });
  it('Should convert all caps to title case', () => {
    const actual = titleCase('MEDICAL CENTER');
    expect(actual).to.equal('Medical Center');
  });

  it('Should return null for empty string', () => {
    const actual = titleCaseRepresentativeName('');
    expect(actual).to.equal(null);
  });
});

describe('buildAddressArray', () => {
  it('Should build address array', () => {
    const addressData = {
      attributes: {
        addressLine1: '123 Address',
        addressLine2: 'Suite 4',
        addressLine3: '',
        city: 'New York',
        stateCode: 'NY',
        zipCode: '11111',
      },
    };
    const actual = buildAddressArray(addressData);
    expect(JSON.stringify(actual)).to.equal(
      '["123 Address","Suite 4","New York, NY 11111"]',
    );
  });
  it('Should convert to titleCase when titleCase set to true', () => {
    const addressData = {
      attributes: {
        addressLine1: '123 ADDRESS',
        addressLine2: 'SUITE 4',
        addressLine3: '',
        city: 'NEW YORK',
        stateCode: 'NY',
        zipCode: '11111',
      },
    };
    const actual = buildAddressArray(addressData, true);
    expect(JSON.stringify(actual)).to.equal(
      '["123 Address","Suite 4","New York, NY 11111"]',
    );
  });
});
