import { expect } from 'chai';
import sinon from 'sinon';

import {
  validateDocumentDescription,
  validateUniqueVALoanNumber,
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
    expect(spy.calledWith('Provide a description'));
  });
});

describe('validateUniqueVALoanNumber', () => {
  const errors = (...args) =>
    args.map(spy => ({ vaLoanNumber: { addError: spy } }));
  const getData = (...args) => args.map(data => ({ vaLoanNumber: data }));

  it('should not return an error for unique 12-digit numbers', () => {
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    const data = getData('123456789012', '123456789011');
    validateUniqueVALoanNumber(errors(spy1, spy2), data);
    expect(spy1.notCalled).to.be.true;
    expect(spy2.notCalled).to.be.true;
  });
  it('should not return an error for unique 12-digit numbers, ingnoring dashes', () => {
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    const data = getData('12-34-5-6789012', '12-34-5-6789011');
    validateUniqueVALoanNumber(errors(spy1, spy2), data);
    expect(spy1.notCalled).to.be.true;
    expect(spy2.notCalled).to.be.true;
  });
  it('should not return an error for "duplicate" empty loan numbers', () => {
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    const data = getData('', '12-34-5-6789011', '');
    validateUniqueVALoanNumber(errors(spy1, spy2), data);
    expect(spy1.notCalled).to.be.true;
    expect(spy2.notCalled).to.be.true;
  });
  it('should return errors for non-unique 12-digit numbers', () => {
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    const data = getData('123456789012', '123456789012');
    validateUniqueVALoanNumber(errors(spy1, spy2), data);
    expect(spy1.called).to.be.true;
    expect(spy2.called).to.be.true;
  });
  it('should return errors for non-unique 12-digit numbers, ignoring dashes/spaces', () => {
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    const data = getData('12-34-5-6789012', '12 34 5 6789012');
    validateUniqueVALoanNumber(errors(spy1, spy2), data);
    expect(spy1.called).to.be.true;
    expect(spy2.called).to.be.true;
  });
  it('should return errors for ONLY non-unique 12-digit numbers', () => {
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    const spy3 = sinon.spy();
    const data = getData(
      '12-34-5-6789012',
      '12-34-5-6789011',
      '12 34 5 6789012',
    );
    validateUniqueVALoanNumber(errors(spy1, spy2, spy3), data);
    expect(spy1.called).to.be.true;
    expect(spy2.notCalled).to.be.true;
    expect(spy3.called).to.be.true;
  });
  it('should return errors for multiple sets of non-unique 12-digit numbers', () => {
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    const spy3 = sinon.spy();
    const spy4 = sinon.spy();

    const data = getData(
      '12-34-5-6789012',
      '12-34-5-6789011',
      '12 34 5 6789012',
      '12-34-5-6789011',
    );
    validateUniqueVALoanNumber(errors(spy1, spy2, spy3, spy4), data);
    expect(spy1.called).to.be.true;
    expect(spy2.called).to.be.true;
    expect(spy3.called).to.be.true;
    expect(spy4.called).to.be.true;
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
