import { expect } from 'chai';
import sinon from 'sinon';
import { submitToUrl } from 'platform/forms-system/src/js/actions';
import submitForm from '../../config/submitForm';

describe('22-10278 submitForm', () => {
  let submitToUrlStub;

  beforeEach(() => {
    submitToUrlStub = sinon.stub(submitToUrl, 'default');
  });

  afterEach(() => {
    submitToUrlStub.restore();
  });

  it('should call transformForSubmit with formConfig and form', () => {
    const form = { data: {} };
    const formConfig = {
      transformForSubmit: sinon.stub().returns('transformedBody'),
      submitUrl: 'http://example.com/submit',
      trackingPrefix: 'testPrefix',
    };

    submitForm(form, formConfig);

    expect(formConfig.transformForSubmit.calledOnce).to.be.true;
    expect(formConfig.transformForSubmit.calledWith(formConfig, form)).to.be
      .true;
  });
});
