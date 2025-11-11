import { expect } from 'chai';
import otherPaymentOptions from '../../../../config/chapters/07-additional-information/otherPaymentOptions';

describe('Other payment options page', () => {
  it('renders the other payment options page', async () => {
    const formData = { hasBankAccount: false };
    expect(otherPaymentOptions.depends(formData)).to.be.true;
  });
});
