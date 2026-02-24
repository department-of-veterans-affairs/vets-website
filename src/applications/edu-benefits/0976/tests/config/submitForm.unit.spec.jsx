import { expect } from 'chai';
import sinon from 'sinon';
import { submitToUrl } from 'platform/forms-system/src/js/actions';
import submitForm from '../../config/submitForm';

describe('submitForm', () => {
  let formConfig = {
    transformForSubmit: sinon.stub(),
    submitUrl: 'http://example.com/submit',
    trackingPrefix: 'testPrefix',
  };
  let form = {};

  beforeEach(() => {
    sinon.stub(submitToUrl, 'default');

    form = { data: {} };
    formConfig = {
      transformForSubmit: sinon.stub().returns('mockedBody'),
      submitUrl: 'http://example.com/submit',
      trackingPrefix: 'testPrefix',
    };
  });

  it('should call submitToUrl with the correct parameters', () => {
    submitForm(form, formConfig);

    expect(formConfig.transformForSubmit.calledOnce).to.be.true;
  });
});
