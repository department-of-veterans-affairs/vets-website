import sinon from 'sinon';
import { expect } from 'chai';
import {
  createGetHandler,
  createPutHandler,
  jsonResponse,
} from 'platform/testing/unit/msw-adapter';
import { server } from 'platform/testing/unit/mocha-setup';

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

  let captureErrorStub = null;
  let getDataStub = null;

  beforeEach(() => {
    captureErrorStub = sinon.stub(fetchDirectDepositArgs, 'captureError');
  });

  afterEach(() => {
    server.resetHandlers();
    captureErrorStub.restore();
    if (getDataStub) {
      getDataStub.restore();
    }
  });

  it('should dispatch DIRECT_DEPOSIT_FETCH_SUCCEEDED with response on success', async () => {
    server.use(
      createGetHandler(`${endpointUrl}`, () => {
        return jsonResponse(base, { status: 200 });
      }),
    );

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
        response: base.data.attributes,
      }).calledOnce,
    ).to.be.true;

    expect(dispatchSpy.callCount).to.eql(4);
  });

  it('should dispatch DIRECT_DEPOSIT_FETCH_FAILED with response on error', async () => {
    server.use(
      createGetHandler(`${endpointUrl}`, () => {
        return jsonResponse(error500, { status: 500 });
      }),
    );

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
      server.use(
        createPutHandler(`${endpointUrl}`, () => {
          return jsonResponse(base, { status: 200 });
        }),
      );

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
    });
    it('should dispatch the FAILURE state', async () => {
      server.use(
        createPutHandler(`${endpointUrl}`, () => {
          return jsonResponse(error500, { status: 400 });
        }),
      );

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
    });

    it('should dispatch the FAILURE state when the response is an instance of Error', async () => {
      server.use(
        createPutHandler(`${endpointUrl}`, () => {
          return jsonResponse(error500, { status: 400 });
        }),
      );

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

      expect(captureErrorStub.calledOnce).to.be.true;
    });
  });
});
