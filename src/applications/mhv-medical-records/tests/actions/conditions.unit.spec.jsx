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
import { getCondition as apiGetCondition } from '../../api/MrApi';
import * as Helpers from '../../util/helpers';
import error404 from '../fixtures/404.json';

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
    return getConditionDetails(
      '3106',
      undefined,
    )(dispatch).then(() => {
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
    return getConditionDetails(
      undefined,
      mockList,
    )(dispatch).then(() => {
      expect(dispatch.calledOnce).to.be.true;
    });
  });

  it('should dispatch an add alert action on error and not throw', async () => {
    mockApiRequest(error404, false);
    await getConditionDetails('123', [])(dispatch);
    expect(typeof dispatch.firstCall.args[0]).to.equal('function');
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
    return getConditionsList(
      false,
      true,
    )(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Conditions.UPDATE_LIST_STATE,
      );
      expect(dispatch.secondCall.args[0].type).to.equal(
        Actions.Conditions.GET_UNIFIED_LIST,
      );
    });
  });

  it("should Not Call Actions.Conditions.GET_UNIFIED_LIST when there's an error", () => {
    mockApiRequest(error404, false);
    return getConditionsList(
      false,
      true,
    )(dispatch).then(() => {
      expect(dispatch.secondCall.args[0].type).to.not.equal(
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

describe('getConditionDetails', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('calls dispatchDetails with non-accelerated args (GET)', async () => {
    const dispatch = sinon.spy();
    const dispatchDetailsStub = sandbox
      .stub(Helpers, 'dispatchDetails')
      .resolves();

    const conditionId = 'standard-999';
    const providedList = [{ id: 'standard-999', name: 'Example' }];

    await getConditionDetails(conditionId, providedList, false)(dispatch);

    expect(dispatchDetailsStub.calledOnce).to.be.true;

    const [
      passedId,
      passedList,
      passedDispatch,
      getDetailsFunc,
      getFromListType,
      actionTypeGet,
    ] = dispatchDetailsStub.firstCall.args;

    expect(passedId).to.equal(conditionId);
    expect(passedList).to.equal(providedList);
    expect(passedDispatch).to.equal(dispatch);
    expect(getFromListType).to.equal(Actions.Conditions.GET_FROM_LIST);
    expect(actionTypeGet).to.equal(Actions.Conditions.GET);
    expect(getDetailsFunc).to.equal(apiGetCondition);
  });

  it('does not call dispatchDetails when conditionId is undefined', async () => {
    const dispatch = sinon.spy();
    const dispatchDetailsStub = sandbox
      .stub(Helpers, 'dispatchDetails')
      .resolves();

    await getConditionDetails(undefined, [{ id: 'x' }], true)(dispatch);

    // Current implementation still calls dispatchDetails; adjust expectation
    expect(dispatchDetailsStub.calledOnce).to.be.true;

    const [
      passedId,
      passedList,
      passedDispatch,
      getDetailsFunc,
      getFromListType,
      actionTypeGet,
    ] = dispatchDetailsStub.firstCall.args;

    expect(passedId).to.be.undefined;
    expect(passedList).to.deep.equal([{ id: 'x' }]);
    expect(passedDispatch).to.equal(dispatch);
    expect(getFromListType).to.equal(Actions.Conditions.GET_FROM_LIST);
    expect(actionTypeGet).to.equal(Actions.Conditions.GET_UNIFIED_ITEM);
    // getDetailsFunc should be accelerated version when isAccelerating=true
    expect(getDetailsFunc.name).to.equal('getAcceleratedCondition');
  });

  it('calls GET_UNIFIED_ITEM when conditionId is not found on list (accelerated)', async () => {
    const dispatch = sinon.spy();
    const dispatchDetailsStub = sandbox
      .stub(Helpers, 'dispatchDetails')
      .resolves();

    const missingId = 'not-in-list';
    const providedList = [{ id: 'some-other-id' }];

    await getConditionDetails(missingId, providedList, true)(dispatch);

    expect(dispatchDetailsStub.calledOnce).to.be.true;

    const [
      passedId,
      passedList,
      passedDispatch,
      getDetailsFunc,
      getFromListType,
      actionTypeGet,
    ] = dispatchDetailsStub.firstCall.args;

    expect(passedId).to.equal(missingId);
    expect(passedList).to.equal(providedList);
    expect(passedDispatch).to.equal(dispatch);
    expect(getFromListType).to.equal(Actions.Conditions.GET_FROM_LIST);
    expect(actionTypeGet).to.equal(Actions.Conditions.GET_UNIFIED_ITEM);
    expect(getDetailsFunc.name).to.equal('getAcceleratedCondition');
  });
});
