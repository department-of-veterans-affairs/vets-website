import { expect } from 'chai';
import sinon from 'sinon';

import * as paymentInformationActions from '../../actions/paymentInformation';

let oldFetch;

const setup = () => {
  oldFetch = global.fetch;
  global.fetch = sinon.stub();
  global.fetch.returns(
    Promise.resolve({
      headers: { get: () => 'application/json' },
      ok: true,
      json: () =>
        Promise.resolve({
          data: [],
        }),
    }),
  );
};

const teardown = () => {
  global.fetch = oldFetch;
};

describe('actions/paymentInformation', () => {
  beforeEach(setup);
  afterEach(teardown);

  it('calls fetch and dispatches FETCH_PAYMENT_INFORMATION_SUCCESS', async () => {
    const actionCreator = paymentInformationActions.fetchPaymentInformation();
    const dispatch = sinon.spy();

    await actionCreator(dispatch);

    expect(dispatch.called).to.be.true;
    expect(dispatch.firstCall.args[0].type).to.be.equal(
      paymentInformationActions.FETCH_PAYMENT_INFORMATION_SUCCESS,
    );
    expect(global.fetch.called).to.be.true;
  });

  it('calls fetch and dispatches SAVE_PAYMENT_INFORMATION', async () => {
    const actionCreator = paymentInformationActions.savePaymentInformation({
      data: 'value',
    });
    const dispatch = sinon.spy();

    await actionCreator(dispatch);

    expect(global.fetch.called).to.be.true;
    expect(dispatch.calledTwice).to.be.true;
    expect(dispatch.firstCall.args[0].type).to.be.equal(
      paymentInformationActions.SAVE_PAYMENT_INFORMATION,
    );
    expect(dispatch.secondCall.args[0].type).to.be.equal(
      paymentInformationActions.SAVE_PAYMENT_INFORMATION_SUCCESS,
    );
  });
});
