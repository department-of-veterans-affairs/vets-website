import { expect } from 'chai';
import sinon from 'sinon';

import { contactInfoValidation } from '../../validations/contactInfo';

describe('contactInfoValidation', () => {
  const getData = ({
    email = true,
    phone = true,
    address = true,
    homeless = false,
    city = 'city',
    stateCode = 'CA',
    zipCode = '12345',
    country = 'US',
  } = {}) => ({
    veteran: {
      email: email ? 'placeholder' : '',
      phone: phone ? { phoneNumber: 'placeholder' } : {},
      address: address
        ? {
            addressLine1: 'placeholder',
            city,
            stateCode,
            zipCode,
            countryCodeIso2: country,
          }
        : {},
    },
    homeless,
  });
  it('should not show an error when data is available', () => {
    const addError = sinon.spy();
    contactInfoValidation({ addError }, null, getData());
    expect(addError.notCalled).to.be.true;
  });
  it('should have an error when email is missing', () => {
    const addError = sinon.spy();
    contactInfoValidation({ addError }, null, getData({ email: false }));
    expect(addError.called).to.be.true;
    expect(addError.args[0][0]).to.contain('Add an email');
  });
  it('should have multiple errors when email & phone are missing', () => {
    const addError = sinon.spy();
    contactInfoValidation(
      { addError },
      null,
      getData({ email: false, phone: false }),
    );
    expect(addError.called).to.be.true;
    expect(addError.firstCall.args[0]).to.contain('Add a mobile phone');
    expect(addError.secondCall.args[0]).to.contain('Add an email');
  });
  it('should have multiple errors when everything is missing', () => {
    const addError = sinon.spy();
    contactInfoValidation(
      { addError },
      null,
      getData({ email: false, phone: false, address: false }),
    );
    expect(addError.called).to.be.true;
    expect(addError.firstCall.args[0]).to.contain('Add a mobile phone');
    expect(addError.secondCall.args[0]).to.contain('Add an email');
    expect(addError.thirdCall.args[0]).to.contain('Add a mailing address');
  });
  it('should not include address when homeless is true', () => {
    const addError = sinon.spy();
    contactInfoValidation(
      { addError },
      null,
      getData({ address: false, homeless: true }),
    );
    expect(addError.called).to.be.false;
  });

  it('should show invalid address when missing required city value', () => {
    const addError = sinon.spy();
    contactInfoValidation({ addError }, null, getData({ city: '' }));
    expect(addError.called).to.be.true;
  });
  it('should show invalid address when missing required state code value', () => {
    const addError = sinon.spy();
    contactInfoValidation({ addError }, null, getData({ stateCode: '' }));
    expect(addError.called).to.be.true;
  });
  it('should show invalid address when missing required zip code value', () => {
    const addError = sinon.spy();
    contactInfoValidation({ addError }, null, getData({ zipCode: '' }));
    expect(addError.called).to.be.true;
  });
  it('should show invalid address when missing required city in non-US address', () => {
    const addError = sinon.spy();
    contactInfoValidation(
      { addError },
      null,
      getData({ city: '', country: 'GB' }),
    );
    expect(addError.called).to.be.true;
  });
  it('should have a valid address when missing zip code in non-US address', () => {
    const addError = sinon.spy();
    contactInfoValidation(
      { addError },
      null,
      getData({ zipCode: '', country: 'GB' }), // postal code is optional
    );
    expect(addError.called).to.be.false;
  });

  it('should not throw an error when addError function is missing', () => {
    try {
      contactInfoValidation();
      expect(true).to.be.true;
    } catch (error) {
      expect(error).to.be.null;
    }
  });
});
