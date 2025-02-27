import sinon from 'sinon';
import { expect } from 'chai';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import {
  fetchDirectDeposit,
  toggleDirectDepositEdit,
  fetchDirectDepositArgs,
  saveDirectDeposit,
  DIRECT_DEPOSIT_FETCH_STARTED,
  DIRECT_DEPOSIT_FETCH_SUCCEEDED,
  DIRECT_DEPOSIT_FETCH_FAILED,
  DIRECT_DEPOSIT_EDIT_TOGGLED,
  DIRECT_DEPOSIT_API_ENDPOINT,
  DIRECT_DEPOSIT_SAVE_STARTED,
  DIRECT_DEPOSIT_SAVE_SUCCEEDED,
  DIRECT_DEPOSIT_SAVE_ERROR_CLEARED,
  DIRECT_DEPOSIT_LOAD_ERROR_CLEARED,
  DIRECT_DEPOSIT_SAVE_FAILED,
} from '@@profile/actions/directDeposit';
import environment from '~/platform/utilities/environment';
import { base } from '../../mocks/endpoints/direct-deposits';

import error500 from '../fixtures/500.json';

describe('directDeposit actions', () => {
  const endpointUrl = `${environment.API_URL}/v0${DIRECT_DEPOSIT_API_ENDPOINT}`;

  let server = null;
  let recordApiEventStub = null;
  let captureErrorStub = null;
  let getDataStub = null;

  beforeEach(() => {
    recordApiEventStub = sinon.stub(fetchDirectDepositArgs, 'recordApiEvent');
    captureErrorStub = sinon.stub(fetchDirectDepositArgs, 'captureError');
  });

  afterEach(() => {
    server.resetHandlers();
    recordApiEventStub.restore();
    captureErrorStub.restore();
    if (getDataStub) {
      getDataStub.restore();
    }
  });

  after(() => {
    server.close();
  });

  it('should dispatch DIRECT_DEPOSIT_FETCH_SUCCEEDED with response on success', async () => {
    server = setupServer(
      rest.get(`${endpointUrl}`, (_, res, ctx) => {
        return res(ctx.json(base), ctx.status(500));
      }),
    );

    server.listen();

    const actionCreator = fetchDirectDeposit();

    const dispatchSpy = sinon.spy();

    await actionCreator(dispatchSpy);

    expect(dispatchSpy.firstCall.args[0]).to.eql({
      type: DIRECT_DEPOSIT_FETCH_STARTED,
    });
    expect(dispatchSpy.secondCall.args[0]).to.eql({
      type: DIRECT_DEPOSIT_LOAD_ERROR_CLEARED,
    });
    expect(dispatchSpy.thirdCall.args[0]).to.eql({
      type: DIRECT_DEPOSIT_SAVE_ERROR_CLEARED,
    });

    expect(
      dispatchSpy.withArgs({
        type: DIRECT_DEPOSIT_FETCH_SUCCEEDED,
        response: base,
      }).calledOnce,
    ).to.be.true;

    expect(dispatchSpy.callCount).to.eql(4);

    expect(recordApiEventStub.calledTwice).to.be.true;
  });

  it('should dispatch DIRECT_DEPOSIT_FETCH_FAILED with response on error', async () => {
    server = setupServer(
      rest.get(`${endpointUrl}`, (req, res, ctx) => {
        return res(ctx.json(error500), ctx.status(500));
      }),
    );

    server.listen();

    const actionCreator = fetchDirectDeposit();

    const dispatchSpy = sinon.spy();

    await actionCreator(dispatchSpy);

    expect(dispatchSpy.firstCall.args[0]).to.eql({
      type: DIRECT_DEPOSIT_FETCH_STARTED,
    });

    expect(dispatchSpy.secondCall.args[0]).to.eql({
      type: DIRECT_DEPOSIT_LOAD_ERROR_CLEARED,
    });
    expect(dispatchSpy.thirdCall.args[0]).to.eql({
      type: DIRECT_DEPOSIT_SAVE_ERROR_CLEARED,
    });

    expect(
      dispatchSpy.withArgs({
        type: DIRECT_DEPOSIT_FETCH_FAILED,
        response: error500,
      }).calledOnce,
    ).to.be.true;

    expect(recordApiEventStub.calledTwice).to.be.true;
    expect(captureErrorStub.calledOnce).to.be.true;
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

  describe('saveDirect deposit action creator', () => {
    it('should dispatch the SUCCESS state', async () => {
      server = setupServer(
        rest.put(`${endpointUrl}`, (req, res, ctx) => {
          return res(ctx.json(base), ctx.status(200));
        }),
      );

      server.listen();

      const actionCreator = saveDirectDeposit({});

      const dispatchSpy = sinon.spy();

      await actionCreator(dispatchSpy);

      expect(dispatchSpy.firstCall.args[0]).to.eql({
        type: DIRECT_DEPOSIT_SAVE_STARTED,
      });
      expect(dispatchSpy.secondCall.args[0]).to.eql({
        type: DIRECT_DEPOSIT_SAVE_ERROR_CLEARED,
      });
      expect(dispatchSpy.thirdCall.args[0]).to.eql({
        type: DIRECT_DEPOSIT_SAVE_SUCCEEDED,
        response: base.data.attributes,
      });

      expect(recordApiEventStub.calledTwice).to.be.true;
    });
    it('should dispatch the FAILURE state', async () => {
      server = setupServer(
        rest.put(`${endpointUrl}`, (req, res, ctx) => {
          return res(ctx.json(error500), ctx.status(400));
        }),
      );

      server.listen();

      const actionCreator = saveDirectDeposit({});

      const dispatchSpy = sinon.spy();

      await actionCreator(dispatchSpy);

      expect(dispatchSpy.firstCall.args[0]).to.eql({
        type: DIRECT_DEPOSIT_SAVE_STARTED,
      });

      expect(dispatchSpy.secondCall.args[0]).to.eql({
        type: DIRECT_DEPOSIT_SAVE_FAILED,
        response: error500,
      });

      expect(recordApiEventStub.calledTwice).to.be.true;
    });

    it('should dispatch the FAILURE state when the response is an instance of Error', async () => {
      server = setupServer(
        rest.put(`${endpointUrl}`, (req, res, ctx) => {
          return res(ctx.json(error500), ctx.status(400));
        }),
      );

      server.listen();

      getDataStub = sinon
        .stub(fetchDirectDepositArgs, 'getData')
        .returns(new Error('Failed to save direct deposit information'));

      const actionCreator = saveDirectDeposit({});

      const dispatchSpy = sinon.spy();

      await actionCreator(dispatchSpy);

      expect(dispatchSpy.firstCall.args[0]).to.eql({
        type: DIRECT_DEPOSIT_SAVE_STARTED,
      });

      expect(dispatchSpy.secondCall.args[0].response instanceof Error).to.be
        .true;

      expect(recordApiEventStub.calledTwice).to.be.true;
      expect(captureErrorStub.calledOnce).to.be.true;
    });
  });
});
