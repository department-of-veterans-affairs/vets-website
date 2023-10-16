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
        Actions.Vaccines.GET_LIST,
      );
    });
  });
  it('should dispatch an add alert action', () => {
    const mockData = vaccines;
    mockApiRequest(mockData, false);
    const dispatch = sinon.spy();
    return getVaccinesList()(dispatch).then(async () => {
      expect(typeof dispatch.firstCall.args[0]).to.equal('function');
    });
  });
});

describe('Get vaccine action', () => {
  it('should dispatch a get details action', () => {
    const mockData = vaccine;
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return getVaccineDetails('3106')(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(Actions.Vaccines.GET);
    });
  });
  it('should dispatch an add alert action', () => {
    const mockData = vaccine;
    mockApiRequest(mockData, false);
    const dispatch = sinon.spy();
    return getVaccineDetails()(dispatch).then(async () => {
      expect(typeof dispatch.firstCall.args[0]).to.equal('function');
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
