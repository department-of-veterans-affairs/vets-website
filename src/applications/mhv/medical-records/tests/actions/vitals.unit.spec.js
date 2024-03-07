import { expect } from 'chai';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import sinon from 'sinon';
import { Actions } from '../../util/actionTypes';
import vitals from '../fixtures/vitals.json';
import vital from '../fixtures/vital.json';
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

  it('should dispatch an add alert action', () => {
    const mockData = vitals;
    mockApiRequest(mockData, false);
    const dispatch = sinon.spy();
    return getVitals()(dispatch).then(() => {
      expect(typeof dispatch.firstCall.args[0]).to.equal('function');
    });
  });
});

describe('Get vital action', () => {
  it('should dispatch a get details action', () => {
    const mockData = vital;
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return getVitalDetails('3106', undefined)(dispatch).then(() => {
      expect(dispatch.secondCall.args[0].type).to.equal(Actions.Vitals.GET);
    });
  });

  it('should dispatch an add alert action', () => {
    const mockData = vitals;
    mockApiRequest(mockData, false);
    const dispatch = sinon.spy();
    return getVitalDetails()(dispatch).then(() => {
      expect(typeof dispatch.firstCall.args[0]).to.equal('function');
    });
  });
});

describe('Get vital details action', () => {
  it('it should dispatch a details action and pull from the list', async () => {
    const dispatch = sinon.spy();
    await getVitalDetails('vitalType', [{ id: '1' }])(dispatch);
    expect(dispatch.firstCall.args[0]?.type).to.equal(Actions.Vitals.GET);
  });

  it('should dispatch an add alert action', () => {
    const dispatch = sinon.spy();
    return getVitalDetails()(dispatch).then(() => {
      expect(typeof dispatch.firstCall.args[0]).to.equal('function');
    });
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
