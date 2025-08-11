import { expect } from 'chai';
import sinon from 'sinon';

import editAddressPage from '../../../../../config/chapters/veteran-contact-information/editAddressPage';

describe('editAddressPage', () => {
  const validCity = editAddressPage.uiSchema.address.city['ui:validations'][0];

  it('should not throw an error for a military city when checkbox is checked', () => {
    const errors = { addError: sinon.spy() };
    const formData = {
      address: {
        isMilitary: true,
        city: 'APO',
      },
    };
    validCity(errors, formData.address.city, formData);
    expect(errors.addError.notCalled).to.be.true;
  });

  it('should throw an error for a military city when checkbox is not checked', () => {
    const errors = { addError: sinon.spy() };
    const formData = {
      address: {
        isMilitary: false,
        city: 'APO',
      },
    };
    validCity(errors, formData.address.city, formData);
    expect(errors.addError.calledWith('Enter a valid city name')).to.be.true;
  });
});
