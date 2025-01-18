import { expect } from 'chai';
import transformForSubmit from '../../utils/transformForSubmit';

describe('transformForSubmit', () => {
  it('transforms form data into a shape that DLC accepts', () => {
    const data = {
      chosenSupplies: { 9998: true, 9999: false },
      emailAddress: 'email@example.com',
      permanentAddress: {
        street: '321 Main St',
        city: 'Okay',
        state: 'OK',
        country: 'USA',
        postalCode: 74446,
      },
    };
    const result = transformForSubmit(data);
    expect(result.order).to.deep.equal([{ productId: '9998' }]);
    expect(result.vetEmail).to.equal('email@example.com');
    expect(result.permanentAddress).to.deep.equal(data.permanentAddress);
    expect(result.useVeteranAddress).to.be.true;
    expect(result.useTemporaryAddress).to.be.false;
  });
});
