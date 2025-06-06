import { expect } from 'chai';
import transformForSubmit from '../../../config/submit-transformer';

const mockFormData = {
  mainPhone: '2125551234',
  cellPhone: '2125551234',
  internationalPhone: '+12125551234',
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

    const result = JSON.parse(resultString);

    expect(result).to.have.property('form');
    expect(result.form).to.have.property('veteranInformation');
    expect(result.form.veteranInformation).to.deep.equal({
      fullName: mockFormData.fullName,
      dob: mockFormData.dob,
    });
  });
});
