import { expect } from 'chai';
import * as helpers from 'platform/forms-system/src/js/helpers';
import sinon from 'sinon';
import transformForSubmit from '../../../config/submitTransformer';

describe('transformForSubmit', () => {
  let spy;

  beforeEach(() => {
    spy = sinon.spy(helpers, 'transformForSubmit');
  });

  it('calls the platform transformForSubmit', () => {
    const form = { data: {} };
    const formConfig = {};

    transformForSubmit(formConfig, form);

    expect(spy.calledOnce).to.eq(true);
  });
});
