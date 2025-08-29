import { expect } from 'chai';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import sinon from 'sinon';
import { Actions } from '../../util/actionTypes';
import conditions from '../fixtures/conditions.json';
import condition from '../fixtures/condition.json';
import conditionsAccelerating from '../fixtures/conditionsAccelerating.json';
import {
  clearConditionDetails,
  getConditionDetails,
  getConditionsList,
} from '../../actions/conditions';

describe('Get conditions action', () => {
  it('should dispatch a get list action (default behavior isAccelerating is false/undefined )', () => {
    const mockData = conditions;
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return getConditionsList()(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Conditions.UPDATE_LIST_STATE,
      );
      expect(dispatch.secondCall.args[0].type).to.equal(
        Actions.Refresh.CLEAR_INITIAL_FHIR_LOAD,
      );
      expect(dispatch.thirdCall.args[0].type).to.equal(
        Actions.Conditions.GET_LIST,
      );
    });
  });
});

describe('Get condition action', () => {
  let dispatch;
  beforeEach(() => {
    dispatch = sinon.spy();
  });
  it('should dispatch a get details action', () => {
    mockApiRequest(condition);
    return getConditionDetails('3106', undefined)(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(Actions.Conditions.GET);
    });
  });

  it('should dispatch a get details action and pull from the list', () => {
    mockApiRequest(condition);
    return getConditionDetails('1', [{ id: '1' }])(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Conditions.GET_FROM_LIST,
      );
    });
  });

  it('should handle undefined conditionId', () => {
    mockApiRequest(condition);
    const mockList = [{ id: 'test-id', name: 'Test' }];
    return getConditionDetails(undefined, mockList)(dispatch).then(() => {
      expect(dispatch.calledOnce).to.be.true;
    });
  });
});

describe('Clear condition details action', () => {
  it('should dispatch a clear details action', () => {
    const dispatch = sinon.spy();
    return clearConditionDetails()(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Conditions.CLEAR_DETAIL,
      );
    });
  });
});

describe('getConditionsList - isAccelerating feature', () => {
  let dispatch;
  beforeEach(() => {
    dispatch = sinon.spy();
  });

  it('should dispatch GET_UNIFIED_LIST', () => {
    mockApiRequest(conditionsAccelerating);
    return getConditionsList(false, true)(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Conditions.UPDATE_LIST_STATE,
      );
      expect(dispatch.secondCall.args[0].type).to.equal(
        Actions.Conditions.GET_UNIFIED_LIST,
      );
    });
  });

  it('should handle API errors gracefully', () => {
    mockApiRequest({ message: 'Network error' }, false);
    return getConditionsList()(dispatch).catch(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Conditions.UPDATE_LIST_STATE,
      );
    });
  });
});

describe('getConditionDetails - isAccelerating feature', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });
  afterEach(() => {
    sandbox.restore();
  });

  it('should dispatch getConditionsList (UPDATE_LIST_STATE then GET_UNIFIED_LIST) when item is not found', async () => {
    // Thunk-aware dispatch: executes inner thunks with (dispatch, getState)
    const getState = () => ({
      mr: { conditions: { conditionsList: [] } }, // empty so item stays missing
    });
    const dispatch = sinon.spy(action => {
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }
      return action;
    });

    // Mock the API response used by the accelerated list fetch
    // This intercepts the fetch made by getConditionsList
    mockApiRequest(conditionsAccelerating);
    const mockDetailItem = conditionsAccelerating.data[2].attributes;

    // Execute: missing item, accelerating = true
    await getConditionDetails(mockDetailItem.id, undefined, true)(
      dispatch,
      getState,
    );

    // Call sequence:
    // 0: dispatch(thunk returned by getConditionsList) -> function (no type)
    // 1: UPDATE_LIST_STATE
    // 2: GET_UNIFIED_LIST
    // 3: GET_FROM_LIST (new list with matching item)
    expect(dispatch.callCount).to.be.at.least(4);

    expect(dispatch.getCall(1).args[0].type).to.equal(
      Actions.Conditions.UPDATE_LIST_STATE,
    );

    const listAction = dispatch.getCall(2).args[0];
    expect(listAction.type).to.equal(Actions.Conditions.GET_UNIFIED_LIST);
    expect(listAction.response).to.deep.equal(conditionsAccelerating);

    const final = dispatch.getCall(dispatch.callCount - 1).args[0];
    expect(final.type).to.equal(Actions.Conditions.GET_FROM_LIST);
    expect(final.response).to.deep.equal(mockDetailItem);
  });

  it('should dispatch a get details action and pull from the list', () => {
    const dispatch = sinon.spy();
    mockApiRequest(condition);
    const mockList = [{ id: '1', facility: 'medical' }];
    return getConditionDetails('1', mockList, true)(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Conditions.GET_FROM_LIST,
      );
      expect(dispatch.firstCall.args[0].response).to.deep.equal(mockList[0]);
    });
  });
});
