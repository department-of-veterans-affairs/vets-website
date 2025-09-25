import { expect } from 'chai';
import transformForSubmit from '../../../config/submit-transformer';

const mockFormData = {
  mainPhone: '2125551234',
  cellPhone: '2125551234',
  internationalPhone: {
    callingCode: 1,
    countryCode: 'US',
    contact: '2125551234',
    _isValid: true,
    _touched: true,
    _required: false,
  },
  email: 'email@test.com',
  newAddress: {
    country: 'USA',
    street: '13 usa street',
    city: 'Manhattan',
    state: 'KS',
    postalCode: '66502',
  },
  isMoving: true,
  veteranAddress: {
    country: 'USA',
    street: '12 usa street',
    city: 'Manhattan',
    state: 'KS',
    postalCode: '66502',
  },
  yearsOfEducation: '10',
  fullName: {
    first: 'First',
    middle: 'Middle',
    last: 'Last',
    suffix: 'III',
  },
  dob: '1980-01-01',
};

const form = { data: mockFormData };
const formConfig = {};

describe('28-1900 submit-transformer', () => {
  it('reshapes the data into the expected payload shape', () => {
    const resultString = transformForSubmit(formConfig, form);

    expect(resultString).to.be.a('string');

    const result = JSON.parse(
      JSON.parse(resultString).veteranReadinessEmploymentClaim.form,
    );

    expect(result).to.have.property('veteranInformation');
    expect(result.veteranInformation).to.deep.equal({
      fullName: mockFormData.fullName,
      dob: mockFormData.dob,
    });

    // International phone should be a string with calling code and contact number concatenated
    expect(result).to.have.property('internationalPhone');
    expect(result.internationalPhone).to.equal('12125551234');
  });

  it('removes dashes from all phone fields', () => {
    const formWithDashes = {
      data: {
        ...mockFormData,
        mainPhone: '212-555-1234',
        cellPhone: '212-555-5678',
      },
    };

    const resultString = transformForSubmit(formConfig, formWithDashes);
    const result = JSON.parse(
      JSON.parse(resultString).veteranReadinessEmploymentClaim.form,
    );

    expect(result.mainPhone).to.equal('2125551234');
    expect(result.cellPhone).to.equal('2125555678');
  });
});
