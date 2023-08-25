import { expect } from 'chai';
import sinon from 'sinon';

import {
  hasAreaOfDisagreementChoice,
  areaOfDisagreementRequired,
  areaOfDisagreementMaxLength,
} from '../../validations/areaOfDisagreement';

import { MAX_LENGTH } from '../../constants';

describe('hasAreaOfDisagreementChoice && areaOfDisagreementRequired', () => {
  it('should show an error with no selections', () => {
    const errors = { addError: sinon.spy() };
    areaOfDisagreementRequired(errors);
    expect(errors.addError.called).to.be.true;
    expect(hasAreaOfDisagreementChoice()).to.be.false;
  });
  it('should show an error with no selections, and no entry text', () => {
    const errors = { addError: sinon.spy() };
    const data = { disagreementOptions: {}, otherEntry: '' };
    areaOfDisagreementRequired(errors, data);
    expect(errors.addError.called).to.be.true;
    expect(hasAreaOfDisagreementChoice(data)).to.be.false;
  });
  it('should not show an error with a single selection', () => {
    const errors = { addError: sinon.spy() };
    const data = { disagreementOptions: { foo: true } };
    areaOfDisagreementRequired(errors, data);
    expect(errors.addError.called).to.be.false;
    expect(hasAreaOfDisagreementChoice(data)).to.be.true;
  });
  it('should not show an error with entry text', () => {
    const errors = { addError: sinon.spy() };
    const data = { disagreementOptions: {}, otherEntry: 'foo' };
    areaOfDisagreementRequired(errors, data);
    expect(errors.addError.called).to.be.false;
    expect(hasAreaOfDisagreementChoice(data)).to.be.true;
  });
  it('should not show an error with a selection and entry text', () => {
    const errors = { addError: sinon.spy() };
    const data = { disagreementOptions: { foo: true }, otherEntry: 'bar' };
    areaOfDisagreementRequired(errors, data);
    expect(errors.addError.called).to.be.false;
    expect(hasAreaOfDisagreementChoice(data)).to.be.true;
  });
});

describe.skip('areaOfDisagreementMaxLength', () => {
  it('should show an error when a name is too long', () => {
    const errors = { addError: sinon.spy() };
    areaOfDisagreementMaxLength(
      errors,
      'ab '.repeat(MAX_LENGTH.DISAGREEMENT_REASON / 2),
    );
    expect(errors.addError.called).to.be.true;
  });
  it('should show an error when a name is not too long', () => {
    const errors = { addError: sinon.spy() };
    areaOfDisagreementMaxLength(errors, 'test');
    expect(errors.addError.called).to.be.false;
  });
});
