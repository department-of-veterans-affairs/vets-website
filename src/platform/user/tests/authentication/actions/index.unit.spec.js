import { expect } from 'chai';
import * as actions from '../../../authentication/actions';

describe('authentication actions', () => {
  it('should return the update logged in status type along with the passed value', () => {
    const action = actions.updateLoggedInStatus(true);
    expect(action.type).to.equal(actions.UPDATE_LOGGEDIN_STATUS);
    expect(action.value).to.be.true;
  });

  it('should return the log out type', () => {
    const action = actions.logOut();
    expect(action.type).to.equal(actions.LOG_OUT);
  });

  it('should return the check keep alive type', () => {
    const action = actions.checkKeepAlive();
    expect(action.type).to.equal(actions.CHECK_KEEP_ALIVE);
  });
});
