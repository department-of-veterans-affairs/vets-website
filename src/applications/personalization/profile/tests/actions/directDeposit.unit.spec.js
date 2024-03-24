import sinon from 'sinon';
import { expect } from 'chai';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import {
  fetchDirectDeposit,
  toggleDirectDepositEdit,
  DIRECT_DEPOSIT_FETCH_STARTED,
  DIRECT_DEPOSIT_FETCH_SUCCEEDED,
  DIRECT_DEPOSIT_FETCH_FAILED,
  DIRECT_DEPOSIT_EDIT_TOGGLED,
  DIRECT_DEPOSIT_API_ENDPOINT,
} from '@@profile/actions/directDeposit';
import environment from '~/platform/utilities/environment';
import { base } from '../../mocks/endpoints/direct-deposits';

import error500 from '../fixtures/500.json';

describe('directDeposit actions', () => {
  const endpointUrl = `${environment.API_URL}/v0${DIRECT_DEPOSIT_API_ENDPOINT}`;

  let server = null;

  afterEach(() => {
    server.resetHandlers();
  });

  after(() => {
    server.close();
  });

  it('should dispatch DIRECT_DEPOSIT_INFORMATION_FETCH_SUCCEEDED with response on success', async () => {
    const createApiEventSpy = sinon.spy();
    const captureErrorSpy = sinon.spy();

    server = setupServer(
      rest.get(`${endpointUrl}`, (req, res, ctx) => {
        return res(ctx.json(base), ctx.status(500));
      }),
    );

    server.listen();

    const actionCreator = fetchDirectDeposit({
      captureDirectDepositError: captureErrorSpy,
      recordDirectDepositEvent: createApiEventSpy,
    });

    const dispatchSpy = sinon.spy();

    await actionCreator(dispatchSpy);

    expect(dispatchSpy.firstCall.args[0]).to.eql({
      type: DIRECT_DEPOSIT_FETCH_STARTED,
    });
    expect(dispatchSpy.secondCall.args[0]).to.eql({
      type: DIRECT_DEPOSIT_FETCH_SUCCEEDED,
      response: base,
    });
    expect(createApiEventSpy.calledTwice).to.be.true;
  });

  it('should dispatch DIRECT_DEPOSIT_INFORMATION_FETCH_FAILED with response on error', async () => {
    const createApiEventSpy = sinon.spy();
    const captureErrorSpy = sinon.spy();

    server = setupServer(
      rest.get(`${endpointUrl}`, (req, res, ctx) => {
        return res(ctx.json(error500), ctx.status(500));
      }),
    );

    server.listen();

    const actionCreator = fetchDirectDeposit({
      captureDirectDepositError: captureErrorSpy,
      recordDirectDepositEvent: createApiEventSpy,
    });

    const dispatchSpy = sinon.spy();

    await actionCreator(dispatchSpy);

    expect(dispatchSpy.firstCall.args[0]).to.eql({
      type: DIRECT_DEPOSIT_FETCH_STARTED,
    });
    expect(dispatchSpy.secondCall.args[0]).to.eql({
      type: DIRECT_DEPOSIT_FETCH_FAILED,
      response: error500,
    });

    expect(createApiEventSpy.calledTwice).to.be.true;
    expect(captureErrorSpy.calledOnce).to.be.true;
  });

  describe('toggleDirectDepositInformationEdit', () => {
    it('should create an action to toggle edit mode', () => {
      const open = true;
      const expectedAction = {
        type: DIRECT_DEPOSIT_EDIT_TOGGLED,
        open,
      };
      expect(toggleDirectDepositEdit(open)).to.eql(expectedAction);
    });
  });
});
