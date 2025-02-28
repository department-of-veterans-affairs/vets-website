import { expect } from 'chai';
import sinon from 'sinon';

import { mockApiRequest } from 'platform/testing/unit/helpers';

import * as actions from '../../../components/connected-apps/actions';

describe('Connected Apps actions', () => {
  const appId = '1';

  describe('loadConnectedApps', () => {
    it('creates the correct action when the call succeeds', async () => {
      const mockResponse = { data: [{ app: '1', deleted: false }] };
      const dispatch = sinon.stub();
      mockApiRequest(mockResponse);
      const thunk = await actions.loadConnectedApps();
      await thunk(dispatch);

      expect(
        dispatch.firstCall.calledWith({ type: actions.LOADING_CONNECTED_APPS }),
      ).to.be.true;

      const secondCallAction = dispatch.secondCall.args[0];
      expect(secondCallAction.type).to.equal(
        actions.FINISHED_LOADING_CONNECTED_APPS,
      );
      expect(secondCallAction.data).to.deep.equal(mockResponse.data);
    });

    it('creates the correct action when the call fails', async () => {
      const mockResponse = { errors: [{ code: '300' }] };
      const dispatch = sinon.stub();
      mockApiRequest(mockResponse, false);
      const thunk = await actions.loadConnectedApps();
      await thunk(dispatch);

      expect(
        dispatch.firstCall.calledWith({ type: actions.LOADING_CONNECTED_APPS }),
      ).to.be.true;

      const secondCallAction = dispatch.secondCall.args[0];
      expect(secondCallAction.type).to.equal(
        actions.ERROR_LOADING_CONNECTED_APPS,
      );
    });
  });

  describe('deleteConnectedApp', () => {
    it('creates the correct action when the call succeeds', async () => {
      const mockResponse = { data: 'data' };
      const getState = () => ({
        connectedApps: {
          apps: [{ app: '1', deleted: false }, { app: '2', deleted: false }],
        },
      });
      const dispatch = sinon.stub();
      mockApiRequest(mockResponse);
      const thunk = await actions.deleteConnectedApp(appId);
      await thunk(dispatch, getState);

      expect(
        dispatch.firstCall.calledWith({
          appId,
          type: actions.DELETING_CONNECTED_APP,
        }),
      ).to.be.true;

      const secondCallAction = dispatch.secondCall.args[0];
      expect(secondCallAction.type).to.equal(
        actions.FINISHED_DELETING_CONNECTED_APP,
      );
    });

    it('creates the correct action when the call fails', async () => {
      const mockResponse = { errors: [{ code: '300', status: 'errorStatus' }] };
      const dispatch = sinon.stub();
      mockApiRequest(mockResponse, false);
      const thunk = await actions.deleteConnectedApp(appId);
      await thunk(dispatch);

      expect(
        dispatch.firstCall.calledWith({
          appId,
          type: actions.DELETING_CONNECTED_APP,
        }),
      ).to.be.true;

      const secondCallAction = dispatch.secondCall.args[0];
      expect(secondCallAction.type).to.equal(
        actions.ERROR_DELETING_CONNECTED_APP,
      );
    });
  });

  describe('dismissDeletedAppAlert', () => {
    it('creates the correct action', async () => {
      const dispatch = sinon.stub();
      const thunk = await actions.dismissDeletedAppAlert(appId);
      await thunk(dispatch);

      expect(
        dispatch.firstCall.calledWith({
          appId,
          type: actions.DELETED_APP_ALERT_DISMISSED,
        }),
      ).to.be.true;
    });
  });
});
