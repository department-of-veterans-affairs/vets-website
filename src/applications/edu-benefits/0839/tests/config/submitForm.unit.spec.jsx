import { expect } from 'chai';
import sinon from 'sinon';
import { submitToUrl } from 'platform/forms-system/src/js/actions';
import submitForm from '../../config/submitForm';

describe('submitForm', () => {
  let formConfig;
  let form;
  let submitToUrlStub;

  beforeEach(() => {
    submitToUrlStub = sinon.stub(submitToUrl, 'default');

    form = { data: {} };
    formConfig = {
      transformForSubmit: sinon.stub().returns('transformedBody'),
      submitUrl: 'http://example.com/submit',
      trackingPrefix: 'testPrefix',
    };
  });

  afterEach(() => {
    submitToUrlStub.restore();
  });

  it('should call transformForSubmit with formConfig and form', () => {
    submitForm(form, formConfig);

    expect(formConfig.transformForSubmit.calledOnce).to.be.true;
    expect(formConfig.transformForSubmit.calledWith(formConfig, form)).to.be
      .true;
  });
});
