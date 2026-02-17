import { expect } from 'chai';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import sinon from 'sinon';
import { Actions } from '../../util/actionTypes';
import {
  clearVaccineDetails,
  getVaccineDetails,
  getVaccinesList,
} from '../../actions/vaccines';
import vaccines from '../fixtures/vaccines.json';
import vaccine from '../fixtures/vaccine.json';

describe('Get vaccines action', () => {
  it('should dispatch a get list action', () => {
    const mockData = vaccines;
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return getVaccinesList()(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Vaccines.UPDATE_LIST_STATE,
      );
      expect(dispatch.secondCall.args[0].type).to.equal(
        Actions.Refresh.CLEAR_INITIAL_FHIR_LOAD,
      );
      expect(dispatch.thirdCall.args[0].type).to.equal(
        Actions.Vaccines.GET_LIST,
      );
    });
  });

  it('should dispatch an add alert action on error and not throw', async () => {
    mockApiRequest(vaccines, false);
    const dispatch = sinon.spy();
    await getVaccinesList()(dispatch);
    expect(typeof dispatch.secondCall.args[0]).to.equal('function');
  });
});

describe('Get vaccine action', () => {
  it('should dispatch a get details action', () => {
    const mockData = vaccine;
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return getVaccineDetails('3106', undefined)(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(Actions.Vaccines.GET);
    });
  });

  it('should dispatch an add alert action on error and not throw', async () => {
    mockApiRequest(vaccine, false);
    const dispatch = sinon.spy();
    await getVaccineDetails('3106', undefined)(dispatch);
    expect(typeof dispatch.firstCall.args[0]).to.equal('function');
  });
});

describe('Get vaccine details action', () => {
  it('should dispatch a details action and pull from the list', () => {
    const dispatch = sinon.spy();
    return getVaccineDetails('1', [{ id: '1' }])(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Vaccines.GET_FROM_LIST,
      );
    });
  });
});

describe('Clear vaccine details action', () => {
  it('should dispatch a clear details action', () => {
    const dispatch = sinon.spy();
    return clearVaccineDetails()(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Vaccines.CLEAR_DETAIL,
      );
    });
  });
});

describe('Get vaccines list with acceleration', () => {
  it('should dispatch GET_UNIFIED_LIST action when isAccelerating is true', () => {
    const mockData = vaccines;
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return getVaccinesList(false, true)(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Vaccines.UPDATE_LIST_STATE,
      );
      expect(dispatch.secondCall.args[0].type).to.equal(
        Actions.Refresh.CLEAR_INITIAL_FHIR_LOAD,
      );
      expect(dispatch.thirdCall.args[0].type).to.equal(
        Actions.Vaccines.GET_UNIFIED_LIST,
      );
    });
  });

  it('should dispatch GET_LIST action when isAccelerating is false', () => {
    const mockData = vaccines;
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return getVaccinesList(false, false)(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Vaccines.UPDATE_LIST_STATE,
      );
      expect(dispatch.secondCall.args[0].type).to.equal(
        Actions.Refresh.CLEAR_INITIAL_FHIR_LOAD,
      );
      expect(dispatch.thirdCall.args[0].type).to.equal(
        Actions.Vaccines.GET_LIST,
      );
    });
  });
});

describe('Get vaccine details with acceleration', () => {
  it('should dispatch GET_UNIFIED_VACCINE action when isAccelerating is true', () => {
    const mockData = vaccine;
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return getVaccineDetails('3106', undefined, true)(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Vaccines.GET_UNIFIED_VACCINE,
      );
    });
  });

  it('should dispatch GET action when isAccelerating is false', () => {
    const mockData = vaccine;
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return getVaccineDetails('3106', undefined, false)(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(Actions.Vaccines.GET);
    });
  });

  it('should dispatch GET action when isAccelerating is undefined (default behavior)', () => {
    const mockData = vaccine;
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return getVaccineDetails('3106', undefined)(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(Actions.Vaccines.GET);
    });
  });
});
