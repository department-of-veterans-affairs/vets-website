import { expect } from 'chai';
import sinon from 'sinon';

import {
  validateDocumentDescription,
  validateVALoanNumber,
} from '../validations';

describe('validateDocumentDescription', () => {
  const errors = addError => [{ attachmentDescription: { addError } }];
  const fileList = (type, descrip) => [
    {
      attachmentType: type,
      attachmentDescription: descrip,
    },
  ];
  it('should not add an error for non-other type', () => {
    const spy = sinon.spy();
    validateDocumentDescription(errors(spy), fileList('ALTA statement', ''));
    expect(spy.called).to.be.false;
  });
  it('should not add an error for Other-type with description', () => {
    const spy = sinon.spy();
    validateDocumentDescription(errors(spy), fileList('Other', 'ok'));
    expect(spy.called).to.be.false;
  });
  it('should add an error for a missing attachmentDescription', () => {
    const spy = sinon.spy();
    validateDocumentDescription(errors(spy), fileList('Other', ''));
    expect(spy.called).to.be.true;
    expect(spy.calledWith('Please provide a description'));
  });
});

describe('validateVALoanNumber', () => {
  const errors = addError => ({ addError });
  it('should not return an error for a 12-digit number', () => {
    const spy = sinon.spy();
    validateVALoanNumber(errors(spy), '123456789012');
    expect(spy.notCalled).to.be.true;
  });
  it('should not return an error for a 12-digit number with dashes', () => {
    const spy = sinon.spy();
    validateVALoanNumber(errors(spy), '1-2-3-4-5-6-7-8-9-0-1-2');
    expect(spy.notCalled).to.be.true;
  });
  it('should not return an error for a 12-digit number with spaces', () => {
    const spy = sinon.spy();
    validateVALoanNumber(errors(spy), '1 2 3 4 5 6 7 8 9 0 1 2');
    expect(spy.notCalled).to.be.true;
  });
  it('should not return an error for a 12-digit number with mixed dashes & spaces', () => {
    const spy = sinon.spy();
    validateVALoanNumber(errors(spy), '1-2 3-4 5-6 7-8 9-0 1-2');
    expect(spy.notCalled).to.be.true;
  });

  it('should return an error for a non 12-digit number', () => {
    const spy = sinon.spy();
    validateVALoanNumber(errors(spy), '1234');
    expect(spy.called).to.be.true;
  });
  it('should return an error for a non 12-digit number, but string length of 12', () => {
    const spy = sinon.spy();
    validateVALoanNumber(errors(spy), '1 2 3 4 5 6 ');
    expect(spy.called).to.be.true;
  });
});
