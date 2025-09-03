import * as Sentry from '@sentry/browser';
import sinon from 'sinon';

import { expect } from 'chai';

import { captureError } from '../../utils/errors.ts';

describe('capture error', () => {
  it('reports errors to sentry', () => {
    const spy = sinon.spy(Sentry, 'captureMessage');
    captureError(new Error());

    expect(spy.called).to.be.true;
    expect(spy.firstCall.args[0]).to.eq('avs_client_error');
    spy.restore();
  });
});
