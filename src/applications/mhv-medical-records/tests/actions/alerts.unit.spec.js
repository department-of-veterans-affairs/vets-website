import { expect } from 'chai';
import sinon from 'sinon';
import { Actions } from '../../util/actionTypes';
import { addAlert, clearAlerts } from '../../actions/alerts';
import * as Constants from '../../util/constants';

describe('Add alert action ', () => {
  it('should dispatch an add alerts action', () => {
    const dispatch = sinon.spy();
    const error = new Error('This is an error');
    return addAlert(Constants.ALERT_TYPE_ERROR, error)(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Alerts.ADD_ALERT,
      );
    });
  });
});

describe('Clear alerts action', () => {
  it('should dispatch a clear alerts action', () => {
    const dispatch = sinon.spy();
    return clearAlerts()(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Alerts.CLEAR_ALERT,
      );
    });
  });
});
