import { expect } from 'chai';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import sinon from 'sinon';
import { Actions } from '../../util/actionTypes';
import vitals from '../fixtures/vitals.json';
import {
  clearVitalDetails,
  getVitalDetails,
  getVitals,
} from '../../actions/vitals';

describe('Get vitals action', () => {
  it('should dispatch a get list action', () => {
    const mockData = vitals;
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return getVitals()(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(Actions.Vitals.GET_LIST);
    });
  });
});

describe('Get vital details action', () => {
  it('should dispatch a get vital action when vitalList is provided', async () => {
    const dispatch = sinon.spy();
    await getVitalDetails('vitalType', [{ id: '1', name: 'Vital 1' }])(
      dispatch,
    );
    expect(dispatch.firstCall.args[0]?.type).to.equal(Actions.Vitals.GET);
  });
});

describe('Clear vital details action', () => {
  it('should dispatch a clear details action', () => {
    const dispatch = sinon.spy();
    return clearVitalDetails()(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Vitals.CLEAR_DETAIL,
      );
    });
  });
});
