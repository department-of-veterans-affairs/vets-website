import { expect } from 'chai';
import sinon from 'sinon';

import {
  contactInfoValidation,
  contactInfo995Validation,
} from '../../validations/contactInfo';
import { errorMessages } from '../../content/contactInfo';

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
    const errors = [[errorMessages.missingEmail]];
    expect(addError.called).to.be.true;
    expect(addError.args).to.deep.equal(errors);
  });
  it('should have multiple errors when email & phone are missing', () => {
    const addError = sinon.spy();
    contactInfoValidation(
      { addError },
      null,
      getData({ email: false, phone: false }),
    );
    const errors = [
      [errorMessages.missingEmail],
      [errorMessages.missingMobilePhone],
    ];
    expect(addError.called).to.be.true;
    expect(addError.args).to.deep.equal(errors);
  });
  it('should have multiple errors when everything is missing', () => {
    const addError = sinon.spy();
    contactInfoValidation(
      { addError },
      null,
      getData({ email: false, phone: false, address: false }),
    );
    const errors = [
      [errorMessages.missingEmail],
      [errorMessages.missingMobilePhone],
      [errorMessages.missingMailingAddress],
      [errorMessages.invalidMailingAddress],
    ];
    expect(addError.called).to.be.true;
    expect(addError.args).to.deep.equal(errors);
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

describe('contactInfo995Validation', () => {
  const getData = ({
    housingRisk = false,
    email = true,
    homePhone = true,
    mobilePhone = true,
    address = true,
    city = 'city',
    stateCode = 'CA',
    zipCode = '12345',
    country = 'US',
  } = {}) => ({
    housingRisk,
    veteran: {
      email: email ? 'placeholder' : '',
      homePhone: homePhone ? { phoneNumber: 'placeholder' } : {},
      mobilePhone: mobilePhone ? { phoneNumber: 'placeholder' } : {},
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
  });
  it('should not show an error when data is available', () => {
    const addError = sinon.spy();
    contactInfo995Validation({ addError }, null, getData());
    expect(addError.notCalled).to.be.true;
  });
  it('should not show an error when adddress is missing and Veteran has housing risk', () => {
    const addError = sinon.spy();
    contactInfo995Validation(
      { addError },
      null,
      getData({ address: false, housingRisk: true }),
    );
    expect(addError.notCalled).to.be.true;
  });

  it('should have an error when email is missing', () => {
    const addError = sinon.spy();
    contactInfo995Validation({ addError }, null, getData({ email: false }));
    const errors = [[errorMessages.missingEmail]];
    expect(addError.called).to.be.true;
    expect(addError.args).to.deep.equal(errors);
  });
  it('should have one error when email & home phone are missing', () => {
    const addError = sinon.spy();
    contactInfo995Validation(
      { addError },
      null,
      getData({ email: false, homePhone: false }),
    );
    const errors = [
      [errorMessages.missingEmail],
      [errorMessages.missingHomePhone],
    ];
    expect(addError.called).to.be.true;
    expect(addError.args).to.deep.equal(errors);
  });
  it('should have multiple errors when everything is missing', () => {
    const addError = sinon.spy();
    contactInfo995Validation(
      { addError },
      null,
      getData({
        email: false,
        homePhone: false,
        mobilePhone: false,
        address: false,
      }),
    );
    const errors = [
      [errorMessages.missingEmail],
      [errorMessages.missingHomePhone],
      [errorMessages.missingMobilePhone],
      [errorMessages.missingMailingAddress],
      [errorMessages.invalidMailingAddress],
    ];
    expect(addError.called).to.be.true;
    expect(addError.args).to.deep.equal(errors);
  });
  it('should not throw an error when addError function is missing', () => {
    try {
      contactInfo995Validation();
      expect(true).to.be.true;
    } catch (error) {
      expect(error).to.be.null;
    }
  });
});
