import { expect } from 'chai';
import sinon from 'sinon';
import { extensionReason } from '../../validations/issues';
import * as helpers from '../../utils/helpers';
import { content as extensionReasonContent } from '../../content/extensionReason';

describe('extensionReason', () => {
  let showExtensionReasonStub;

  beforeEach(() => {
    showExtensionReasonStub = sinon.stub(helpers, 'showExtensionReason');
  });

  afterEach(() => {
    showExtensionReasonStub.restore();
  });

  it('should add an error when extension reason is required but missing', () => {
    const errors = { addError: sinon.spy() };
    const formData = { extensionReason: '' };
    showExtensionReasonStub.returns(true);

    extensionReason(errors, null, formData);

    expect(errors.addError.calledOnce).to.be.true;
    expect(errors.addError.calledWith(extensionReasonContent.errorMessage)).to
      .be.true;
  });

  it('should add an error when extension reason is only whitespace', () => {
    const errors = { addError: sinon.spy() };
    const formData = { extensionReason: '   \n\t  ' };
    showExtensionReasonStub.returns(true);

    extensionReason(errors, null, formData);

    expect(errors.addError.calledOnce).to.be.true;
    expect(errors.addError.calledWith(extensionReasonContent.errorMessage)).to
      .be.true;
  });

  it('should add an error when extension reason is undefined', () => {
    const errors = { addError: sinon.spy() };
    const formData = {};
    showExtensionReasonStub.returns(true);

    extensionReason(errors, null, formData);

    expect(errors.addError.calledOnce).to.be.true;
    expect(errors.addError.calledWith(extensionReasonContent.errorMessage)).to
      .be.true;
  });

  it('should not add an error when extension reason is provided', () => {
    const errors = { addError: sinon.spy() };
    const formData = { extensionReason: 'Valid reason for extension' };
    showExtensionReasonStub.returns(true);

    extensionReason(errors, null, formData);

    expect(errors.addError.called).to.be.false;
  });

  it('should not add an error when extension reason is not required', () => {
    const errors = { addError: sinon.spy() };
    const formData = { extensionReason: '' };
    showExtensionReasonStub.returns(false);

    extensionReason(errors, null, formData);

    expect(errors.addError.called).to.be.false;
  });

  it('should not add an error when extension reason is not required even if missing', () => {
    const errors = { addError: sinon.spy() };
    const formData = {};
    showExtensionReasonStub.returns(false);

    extensionReason(errors, null, formData);

    expect(errors.addError.called).to.be.false;
  });

  it('should prioritize appStateData over formData', () => {
    const errors = { addError: sinon.spy() };
    const formData = { extensionReason: 'Valid reason' };
    const appStateData = { extensionReason: '' };
    showExtensionReasonStub.returns(true);

    extensionReason(errors, null, formData, null, null, null, appStateData);

    expect(errors.addError.calledOnce).to.be.true;
    expect(errors.addError.calledWith(extensionReasonContent.errorMessage)).to
      .be.true;
  });

  it('should use formData when appStateData is not provided', () => {
    const errors = { addError: sinon.spy() };
    const formData = { extensionReason: 'Valid reason' };
    showExtensionReasonStub.returns(true);

    extensionReason(errors, null, formData, null, null, null, null);

    expect(errors.addError.called).to.be.false;
  });

  it('should handle whitespace-only reason with valid text before and after', () => {
    const errors = { addError: sinon.spy() };
    const formData = { extensionReason: '  Valid reason with spaces  ' };
    showExtensionReasonStub.returns(true);

    extensionReason(errors, null, formData);

    expect(errors.addError.called).to.be.false;
  });
});
