import { expect } from 'chai';
import * as helpers from 'platform/forms-system/src/js/helpers';
import sinon from 'sinon';
import transformForSubmit from '../../../config/submitTransformer';

describe('transformForSubmit', () => {
  let spy;
  let transformedString;

  const form = { data: {} };
  const formConfig = { formId: '1234' };

  beforeEach(() => {
    spy = sinon.spy(helpers, 'transformForSubmit');

    transformedString = transformForSubmit(formConfig, form);
  });

  afterEach(() => {
    spy.restore();
  });

  it('calls the platform transformForSubmit', () => {
    expect(spy.calledWith(formConfig)).to.eq(true);

    const options = spy.getCall(0).args[2];

    expect(options.replaceEscapedCharacters).to.eq(true);
  });

  it('includes the form number', () => {
    expect(JSON.parse(transformedString).formNumber).to.eq(formConfig.formId);
  });
});
