import { expect } from 'chai';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import sinon from 'sinon';
import { Actions } from '../../util/actionTypes';
import {
  clearSharingStatus,
  fetchSharingStatus,
  updateSharingStatus,
} from '../../actions/sharing';

describe('Fetch sharing status action', () => {
  it('should dispatch a fetch action', () => {
    const mockData = { test: 'test' };
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return fetchSharingStatus()(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(Actions.Sharing.STATUS);
    });
  });

  it('should dispatch an error action', () => {
    const mockData = { test: 'test' };
    mockApiRequest(mockData, false);
    const dispatch = sinon.spy();
    return fetchSharingStatus()(dispatch)
      .then(() => {
        throw new Error('Expected fetchSharingStatus() to throw an error.');
      })
      .catch(() => {
        expect(dispatch.firstCall.args[0].type).to.equal(
          Actions.Sharing.STATUS_ERROR,
        );
      });
  });
});

describe('Update sharing status action', () => {
  it('should dispatch an update to opt in action', () => {
    const mockData = { test: 'test' };
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return updateSharingStatus(true)(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(Actions.Sharing.UPDATE);
    });
  });

  it('should dispatch an error action and revert to opt in', () => {
    const mockData = { test: 'test' };
    mockApiRequest(mockData, false);
    const dispatch = sinon.spy();
    return updateSharingStatus(false)(dispatch)
      .then(() => {
        throw new Error('Expected updateSharingStatus() to throw an error.');
      })
      .catch(() => {
        expect(dispatch.firstCall.args[0].type).to.equal(
          Actions.Sharing.STATUS_ERROR,
        );
      });
  });

  it('should dispatch an error action and revert to opt out', () => {
    const mockData = { test: 'test' };
    mockApiRequest(mockData, false);
    const dispatch = sinon.spy();
    return updateSharingStatus(true)(dispatch)
      .then(() => {
        throw new Error('Expected updateSharingStatus() to throw an error.');
      })
      .catch(() => {
        expect(dispatch.firstCall.args[0].type).to.equal(
          Actions.Sharing.STATUS_ERROR,
        );
      });
  });
});

describe('Clear sharing status action', () => {
  it('should dispatch a clear sharing action', () => {
    const dispatch = sinon.spy();
    return clearSharingStatus()(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(Actions.Sharing.CLEAR);
    });
  });
});
