import { expect } from 'chai';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import sinon from 'sinon';
import { Actions } from '../../util/actionTypes';
import radiologyMhv from '../fixtures/radiologyMhv.json';
import error404 from '../fixtures/404.json';
import {
  clearRadiologyDetails,
  getRadiologyList,
  getRadiologyDetails,
  updateRadiologyDateRange,
} from '../../actions/radiology';

describe('getRadiologyList error handling', () => {
  it('should dispatch an add alert action on error and not throw', async () => {
    mockApiRequest(error404, false);
    const dispatch = sinon.spy();
    // This should NOT throw - error should be handled internally
    await getRadiologyList()(dispatch);
    // Verify alert was dispatched (second call after UPDATE_LIST_STATE)
    expect(typeof dispatch.secondCall.args[0]).to.equal('function');
  });

  it('should not dispatch GET_LIST when there is an error', async () => {
    mockApiRequest(error404, false);
    const dispatch = sinon.spy();
    await getRadiologyList()(dispatch);
    const dispatchCalls = dispatch.getCalls();
    const getListCall = dispatchCalls.find(
      call => call.args[0].type === Actions.Radiology.GET_LIST,
    );
    expect(getListCall).to.not.exist;
  });
});

describe('getRadiologyDetails error handling', () => {
  it('should dispatch an add alert action on error and not throw', async () => {
    mockApiRequest(error404, false);
    const dispatch = sinon.spy();
    // This should NOT throw - error should be handled internally
    await getRadiologyDetails('invalid-id', [])(dispatch);
    // Verify alert was dispatched
    expect(typeof dispatch.firstCall.args[0]).to.equal('function');
  });
});

describe('getRadiologyList', () => {
  it('should dispatch a get list action', () => {
    // Mock returns for parallel API calls - getMhvRadiologyTests and getImagingStudies
    mockApiRequest([radiologyMhv]);
    const dispatch = sinon.spy();
    return getRadiologyList()(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Radiology.UPDATE_LIST_STATE,
      );
      // Third call should be GET_LIST with radiology and CVIX responses
      const getListCall = dispatch
        .getCalls()
        .find(call => call.args[0].type === Actions.Radiology.GET_LIST);
      expect(getListCall).to.exist;
    });
  });

  it('should dispatch GET_LIST with isCurrent flag when passed', () => {
    mockApiRequest([radiologyMhv]);
    const dispatch = sinon.spy();
    return getRadiologyList(true)(dispatch).then(() => {
      const getListCall = dispatch
        .getCalls()
        .find(call => call.args[0].type === Actions.Radiology.GET_LIST);
      expect(getListCall).to.exist;
      expect(getListCall.args[0].isCurrent).to.equal(true);
    });
  });
});

describe('getRadiologyDetails', () => {
  it('should dispatch GET_FROM_LIST when record exists in the list', () => {
    const dispatch = sinon.spy();
    const testRecord = { id: 'r123' };
    return getRadiologyDetails('r123', [testRecord])(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Radiology.GET_FROM_LIST,
      );
    });
  });

  it('should dispatch GET_FROM_LIST with the matching record', () => {
    const dispatch = sinon.spy();
    const testRecord = { id: 'r123', name: 'CT SCAN' };
    return getRadiologyDetails('r123', [testRecord])(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].response).to.deep.equal(testRecord);
    });
  });
});

describe('clearRadiologyDetails', () => {
  it('should dispatch a clear details action', () => {
    const dispatch = sinon.spy();
    return clearRadiologyDetails()(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Radiology.CLEAR_DETAIL,
      );
    });
  });
});

describe('updateRadiologyDateRange', () => {
  it('should dispatch a set date range action with correct payload', () => {
    const dispatch = sinon.spy();
    const option = '6';
    const fromDate = '2025-05-13';
    const toDate = '2025-11-13';
    return updateRadiologyDateRange(
      option,
      fromDate,
      toDate,
    )(dispatch).then(() => {
      expect(dispatch.calledOnce).to.be.true;
      const action = dispatch.firstCall.args[0];
      expect(action.type).to.equal(Actions.Radiology.SET_DATE_RANGE);
      expect(action.payload).to.deep.equal({ option, fromDate, toDate });
    });
  });
});
