import { expect } from 'chai';
import sinon from 'sinon';

import * as actions from '../../../components/connected-apps/actions';

describe('Connected Apps actions', () => {
  const appId = '1';

  describe('loadConnectedApps', () => {
    it('creates the correct action', async () => {
      const dispatch = sinon.stub();
      const thunk = await actions.loadConnectedApps(appId);
      await thunk(dispatch);

      expect(
        dispatch.firstCall.calledWith({ type: actions.LOADING_CONNECTED_APPS }),
      ).to.be.true;

      const secondCallAction = dispatch.secondCall.args[0];
      expect(secondCallAction.type).to.be.oneOf([
        actions.FINISHED_CONNECTED_APPS,
        actions.ERROR_CONNECTED_APPS,
      ]);
    });
  });

  describe('deleteConnectedApp', () => {
    it('creates the correct action', async () => {
      const dispatch = sinon.stub();
      const thunk = await actions.deleteConnectedApp(appId);
      await thunk(dispatch);

      expect(
        dispatch.firstCall.calledWith({
          type: actions.DELETING_CONNECTED_APP,
          appId,
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
          type: actions.DELETED_APP_ALERT_DISMISSED,
          appId,
        }),
      ).to.be.true;
    });
  });
});
