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
import { dispatchDetails } from '../../util/helpers';
import * as Constants from '../../util/constants';
import { addAlert } from '../../actions/alerts';

describe('Get conditions action', () => {
  it('should dispatch a get list action', () => {
    const mockData = conditions;
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return getConditionsList()(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Conditions.GET_LIST,
      );
    });
  });
});

describe('Get condition action', () => {
  it('should dispatch a get details action', async () => {
    const conditionList = [];
    const mockData = condition;
    const dispatch = sinon.spy();

    const getDetail = async () => mockData;

    try {
      await dispatchDetails(
        '3106',
        conditionList,
        dispatch,
        getDetail,
        Actions.Conditions.GET_FROM_LIST,
        Actions.Conditions.GET,
      );
      expect(dispatch.called).to.be.true;
      expect(dispatch.firstCall.args[0]).to.exist;
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Conditions.GET_FROM_LIST,
      );
    } catch (error) {
      dispatch(addAlert(Constants.ALERT_TYPE_ERROR));
    }
  });
});

describe('Get condition action', () => {
  it('should dispatch a get details action and pull from the list', () => {
    const mockData = { id: '1', title: 'Sample Note' };
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return getConditionDetails('1', [{ id: '1', title: 'Sample Note' }])(
      dispatch,
    ).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Conditions.GET_FROM_LIST,
      );
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
