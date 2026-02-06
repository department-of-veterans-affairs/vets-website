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
  setVitalsList,
  reloadRecords,
} from '../../actions/vitals';
import error404 from '../fixtures/404.json';

describe('unable to get vitals action because of server error', () => {
  it("should Not Call Actions.Conditions.GET_UNIFIED_LIST when there's an error", () => {
    mockApiRequest(error404, false);
    const dispatch = sinon.spy();
    return getVitals()(dispatch).then(() => {
      expect(dispatch.secondCall.args[0].type).to.not.equal(Actions.Vitals.GET);
    });
  });
});

describe('Get vitals action', () => {
  it('should dispatch a get list action', () => {
    const mockData = vitals;
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return getVitals()(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Vitals.UPDATE_LIST_STATE,
      );
      expect(dispatch.secondCall.args[0].type).to.equal(
        Actions.Refresh.CLEAR_INITIAL_FHIR_LOAD,
      );
      expect(dispatch.thirdCall.args[0].type).to.equal(Actions.Vitals.GET_LIST);
    });
  });

  it('should dispatch a get unified list action when accelerating', () => {
    const mockData = vitals;
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return getVitals(false, true, true)(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Vitals.UPDATE_LIST_STATE,
      );
      // For the Unified list we don't clear the FHIR load so this is the second call
      expect(dispatch.secondCall.args[0].type).to.equal(
        Actions.Vitals.GET_UNIFIED_LIST,
      );
    });
  });

  it('should dispatch an add alert action', () => {
    const mockData = vitals;
    mockApiRequest(mockData, false);
    const dispatch = sinon.spy();
    return getVitals()(dispatch)
      .then(() => {
        throw new Error('Expected getVitals() to throw an error.');
      })
      .catch(() => {
        expect(typeof dispatch.secondCall.args[0]).to.equal('function');
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

  it('should dispatch an add alert action on error and not throw', async () => {
    mockApiRequest(error404, false);
    const dispatch = sinon.spy();
    await getVitalDetails('vitalType', [])(dispatch);
    expect(typeof dispatch.firstCall.args[0]).to.equal('function');
  });
});

describe('set vitals list action', () => {
  it('should dispatch a get action', () => {
    const dispatch = sinon.spy();
    return setVitalsList('vitalType')(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(Actions.Vitals.GET);
      expect(dispatch.firstCall.args[0].vitalType).to.equal('vitalType');
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

describe('reload records action', () => {
  it('should dispatch a get action', () => {
    const dispatch = sinon.spy();
    return reloadRecords()(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Vitals.COPY_UPDATED_LIST,
      );
    });
  });
});
