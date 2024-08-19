/* eslint-disable camelcase */
import { expect } from 'chai';
import formConfig from '../../../config/form';
import transformForSubmit from '../../../config/submitTransformer';

describe('submit transformer', () => {
  it('should return expected data', () => {
    const formData = {
      data: {
        veteranDateOfBirth: '2004-02-19',
        fullName: 'John Smith',
        physical_address: {
          street: '1 Main st',
          city: 'Canton',
          state: 'NY',
          postalCode: '13625',
          country: 'US',
        },
        mailing_address: {
          street: '21 Jump St',
          city: 'Prattville',
          state: 'WA',
          postalCode: '12569',
          country: 'US',
        },
        ssn: '963879632',
        va_claim_number: '5236978',
        phone_number: '2056321459',
        email_address: 'john@gmail.com0',
      },
    };
    const newTransformData = JSON.parse(
      transformForSubmit(formConfig, formData),
    );
    // eslint-disable-next-line no-console
    expect(newTransformData.veteran.date_of_birth).to.equal('2004-02-19');
  });
});
