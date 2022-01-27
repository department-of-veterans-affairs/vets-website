import { expect } from 'chai';
import sinon from 'sinon';

import {
  contactInfoValidation,
  areaOfDisagreementRequired,
  optInValidation,
} from '../../validations';
import { optInErrorMessage } from '../../content/OptIn';

describe('contactInfoValidation', () => {
  const getData = ({
    email = true,
    phone = true,
    address = true,
    homeless = false,
  } = {}) => ({
    veteran: {
      email: email ? 'placeholder' : '',
      phone: phone ? { phoneNumber: 'placeholder' } : {},
      address: address ? { addressLine1: 'placeholder' } : {},
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
    expect(addError.args[0][0]).to.contain('add an email');
  });
  it('should have multiple errors when email & phone are missing', () => {
    const addError = sinon.spy();
    contactInfoValidation(
      { addError },
      null,
      getData({ email: false, phone: false }),
    );
    expect(addError.called).to.be.true;
    expect(addError.firstCall.args[0]).to.contain('add an email');
    expect(addError.secondCall.args[0]).to.contain('add a phone');
  });
  it('should have multiple errors when everything is missing', () => {
    const addError = sinon.spy();
    contactInfoValidation(
      { addError },
      null,
      getData({ email: false, phone: false, address: false }),
    );
    expect(addError.called).to.be.true;
    expect(addError.firstCall.args[0]).to.contain('add an email');
    expect(addError.secondCall.args[0]).to.contain('add a phone');
    expect(addError.thirdCall.args[0]).to.contain('add an address');
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
});

describe('areaOfDisagreementRequired', () => {
  it('should show an error with no selections', () => {
    const errors = { addError: sinon.spy() };
    areaOfDisagreementRequired(errors);
    expect(errors.addError.called).to.be.true;
  });
  it('should show an error with other selected, but no entry text', () => {
    const errors = { addError: sinon.spy() };
    areaOfDisagreementRequired(errors, {
      disagreementOptions: { other: true },
    });
    expect(errors.addError.called).to.be.true;
  });
  it('should not show an error with a single selection', () => {
    const errors = { addError: sinon.spy() };
    areaOfDisagreementRequired(errors, { disagreementOptions: { foo: true } });
    expect(errors.addError.called).to.be.false;
  });
  it('should not show an error with other selected with entry text', () => {
    const errors = { addError: sinon.spy() };
    areaOfDisagreementRequired(errors, {
      disagreementOptions: { other: true },
      otherEntry: 'foo',
    });
    expect(errors.addError.called).to.be.false;
  });
});

describe('optInValidation', () => {
  let errorMessage = '';
  const errors = {
    addError: message => {
      errorMessage = message || '';
    },
  };

  beforeEach(() => {
    errorMessage = '';
  });

  it('should show an error when the value is false', () => {
    optInValidation(errors, false);
    expect(errorMessage).to.equal(optInErrorMessage);
  });
  it('should not show an error when the value is true', () => {
    optInValidation(errors, true);
    expect(errorMessage).to.equal('');
  });
});
