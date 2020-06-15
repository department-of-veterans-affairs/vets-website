import { expect } from 'chai';
import sinon from 'sinon';

import { mockApiRequest } from 'platform/testing/unit/helpers.js';

import * as actions from '../../../components/connected-apps/actions';

describe('Connected Apps actions', () => {
  const appId = '1';
  const mockRequest = true;

  describe('loadConnectedApps', () => {
    it('creates the correct action when the call succeeds', async () => {
      const mockResponse = { data: 'data' };
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
    it('creates the correct action', async () => {
      const dispatch = sinon.stub();
      const thunk = await actions.deleteConnectedApp(appId, mockRequest);
      await thunk(dispatch);

      expect(
        dispatch.firstCall.calledWith({
          appId,
          type: actions.DELETING_CONNECTED_APP,
        }),
      ).to.be.true;

      const secondCallAction = dispatch.secondCall.args[0];
      expect(secondCallAction.type).to.be.oneOf([
        actions.FINISHED_DELETING_CONNECTED_APP,
        actions.ERROR_DELETING_CONNECTED_APP,
      ]);
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
