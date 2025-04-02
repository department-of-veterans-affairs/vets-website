/* eslint-disable camelcase */
import { expect } from 'chai';
import formConfig from '../../../config/form';
import transformForSubmit from '../../../config/submitTransformer';

describe('submit transformer', () => {
  const formData = {
    data: {
      veteranDateOfBirth: '2004-02-19',
      fullName: 'John Smith',
      veteranAddress: {
        street: '1 Main st',
        city: 'Canton',
        state: 'NY',
        postalCode: '13625',
        country: 'AFG',
      },
      physicalAddress: {
        street: '21 Jump St',
        city: 'Prattville',
        state: 'WA',
        postalCode: '12569',
        country: 'USA',
      },
      ssn: '963879632',
      va_claim_number: '5236978',
      phone_number: '2056321459',
      email_address: 'john@gmail.com0',
    },
  };
  it('should return expected data', () => {
    const newTransformData = JSON.parse(
      transformForSubmit(formConfig, formData),
    );
    // eslint-disable-next-line no-console
    expect(newTransformData.veteran.date_of_birth).to.equal('02/19/2004');
  });
  it('should replace country code with full country name', () => {
    const data = JSON.parse(
      transformForSubmit(formConfig, {
        data: {
          veteranDateOfBirth: '2004-02-19',
          sameMailingAddress: true,
          veteranAddress: {
            street: '1 Main st',
            city: 'Canton',
            state: 'NY',
            postalCode: '13625',
            country: 'USA',
          },
        },
      }),
    );
    expect(data.veteran.physical_address.country).to.equal('United States');
  });
});
