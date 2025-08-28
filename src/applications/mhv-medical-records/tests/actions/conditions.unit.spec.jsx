import { expect } from 'chai';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import sinon from 'sinon';
import { Actions } from '../../util/actionTypes';
import conditions from '../fixtures/conditions.json';
import condition from '../fixtures/condition.json';
import {
  clearConditionDetails,
  getConditionDetails,
  getConditionsList,
} from '../../actions/conditions';

describe('Get conditions action', () => {
  it('should dispatch a get list action (default behavior isAccelerating is false )', () => {
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

describe('getConditionsList - acceleration feature', () => {
  let dispatch;
  beforeEach(() => {
    dispatch = sinon.spy();
  });

  it('should dispatch GET_UNIFIED_LIST when isAccelerating is true', () => {
    mockApiRequest(conditions);
    return getConditionsList(false, true)(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Conditions.UPDATE_LIST_STATE,
      );
      expect(dispatch.secondCall.args[0].type).to.equal(
        Actions.Refresh.CLEAR_INITIAL_FHIR_LOAD,
      );
      expect(dispatch.thirdCall.args[0].type).to.equal(
        Actions.Conditions.GET_UNIFIED_LIST,
      );
    });
  });

  it('should dispatch GET_LIST when isAccelerating is false', () => {
    mockApiRequest(conditions);
    return getConditionsList(true, false)(dispatch).then(() => {
      expect(dispatch.thirdCall.args[0].type).to.equal(
        Actions.Conditions.GET_LIST,
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

describe('getConditionDetails - behavior patterns', () => {
  let dispatch;
  let sandbox;
  beforeEach(() => {
    dispatch = sinon.spy();
    sandbox = sinon.createSandbox();
  });
  afterEach(() => {
    sandbox.restore();
  });

  describe('standard FHIR path', () => {
    it('should dispatch GET action when isAccelerating is false or undefined', () => {
      mockApiRequest(condition);
      return getConditionDetails('test-id')(dispatch).then(() => {
        expect(dispatch.firstCall.args[0].type).to.equal(
          Actions.Conditions.GET,
        );
      });
    });
  });

  describe('accelerated workaround path', () => {
    it('should find and dispatch matching condition from local list', () => {
      const mockList = [
        { id: 'diabetes-123', name: 'Type 2 Diabetes' },
        { id: 'other-456', name: 'Hypertension' },
      ];

      return getConditionDetails('diabetes-123', mockList, true)(dispatch).then(
        () => {
          expect(dispatch.calledOnce).to.be.true;
          expect(dispatch.firstCall.args[0]).to.deep.equal({
            type: Actions.Conditions.GET_FROM_LIST,
            response: mockList[0],
          });
        },
      );
    });

    it('should handle missing/null/empty conditions by fetching list', async () => {
      sandbox
        .stub(require('../../actions/conditions'), 'getConditionsList')
        .returns(() => Promise.resolve());

      const testCases = [
        {
          conditionId: 'missing-id',
          list: [{ id: 'other-id', name: 'Other' }],
          expectedResponse: undefined,
        },
        { conditionId: 'test-id', list: null, expectedResponse: null },
        { conditionId: 'test-id', list: [], expectedResponse: undefined },
        {
          conditionId: '',
          list: [{ id: 'valid-id', name: 'Valid' }],
          expectedResponse: undefined,
        },
      ];

      await Promise.all(
        testCases.map(async ({ conditionId, list, expectedResponse }) => {
          // Create a fresh dispatch spy for each test case
          const freshDispatch = sinon.spy();

          await getConditionDetails(conditionId, list, true)(freshDispatch);

          expect(freshDispatch.callCount).to.equal(2);
          expect(freshDispatch.secondCall.args[0]).to.deep.equal({
            type: Actions.Conditions.GET_FROM_LIST,
            response: expectedResponse,
          });
        }),
      );
    });

    it('should handle malformed data gracefully', () => {
      const malformedList = [
        { name: 'Missing ID' },
        { id: 'valid-123', name: 'Valid Condition' },
        { id: null, name: 'Null ID' },
      ];

      return getConditionDetails('valid-123', malformedList, true)(
        dispatch,
      ).then(() => {
        expect(dispatch.calledOnce).to.be.true;
        expect(dispatch.firstCall.args[0].response).to.deep.equal(
          malformedList[1],
        );
      });
    });

    it('should maintain complete response structure', () => {
      const completeCondition = {
        id: 'comprehensive-123',
        name: 'Discharge Summary',
        date: '2019-03-12T16:30:00Z',
        summary: 'Patient was admitted for observation',
      };

      return getConditionDetails(
        'comprehensive-123',
        [completeCondition],
        true,
      )(dispatch).then(() => {
        expect(dispatch.firstCall.args[0].response).to.deep.equal(
          completeCondition,
        );
      });
    });

    it('should verify workaround behavior without API calls', () => {
      const mockList = [{ id: 'test-123', name: 'Test' }];

      return getConditionDetails('test-123', mockList, true)(dispatch).then(
        () => {
          expect(dispatch.calledOnce).to.be.true;
          expect(dispatch.firstCall.args[0].type).to.equal(
            Actions.Conditions.GET_FROM_LIST,
          );
        },
      );
    });
  });
});
