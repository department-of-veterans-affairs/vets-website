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

describe('getConditionDetails', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('uses accelerated notFound stub and passes GET_UNIFIED_ITEM_FROM_LIST when isAccelerating=true', async () => {
    const dispatch = sinon.spy();

    const dispatchDetailsStub = sandbox
      .stub(Helpers, 'dispatchDetails')
      .callsFake(async () => {});

    const conditionId = 'abc-accelerated';
    const providedList = undefined;

    await getConditionDetails(conditionId, providedList, true)(dispatch);

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
    expect(actionTypeGet).to.equal(
      Actions.Conditions.GET_UNIFIED_ITEM_FROM_LIST,
    );

    // The accelerated path provides an async stub that indicates "not found"
    expect(getDetailsFunc).to.be.a('function');
    const stubResult = await getDetailsFunc();

    // Accept either top-level or nested notFound to match implementation changes
    const hasNotFound = res =>
      res?.notFound === true ||
      res?.data?.notFound === true ||
      res?.attributes?.notFound === true;

    expect(hasNotFound(stubResult)).to.be.true;
  });

  it('uses api getCondition and passes GET when isAccelerating=false', async () => {
    const dispatch = sinon.spy();

    const dispatchDetailsStub = sandbox
      .stub(Helpers, 'dispatchDetails')
      .callsFake(async () => {});

    const conditionId = 'xyz-non-accelerated';
    const providedList = [{ id: '1', name: 'Hypertension' }];

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

    // Should be the API function reference
    expect(getDetailsFunc).to.equal(apiGetCondition);
  });
});
