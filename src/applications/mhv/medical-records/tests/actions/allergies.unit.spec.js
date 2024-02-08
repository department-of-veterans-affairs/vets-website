import { expect } from 'chai';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import sinon from 'sinon';
import {
  clearAllergyDetails,
  getAllergiesList,
  getAllergyDetails,
} from '../../actions/allergies';
import { Actions } from '../../util/actionTypes';
import allergies from '../fixtures/allergies.json';
import allergy from '../fixtures/allergy.json';

describe('Get allergies action', () => {
  it('should dispatch a get list action', () => {
    const mockData = allergies;
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return getAllergiesList()(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Allergies.UPDATE_LIST_STATE,
      );
      expect(dispatch.secondCall.args[0].type).to.equal(
        Actions.Allergies.GET_LIST,
      );
    });
  });

  it('should dispatch an add alert action', () => {
    const mockData = allergies;
    mockApiRequest(mockData, false);
    const dispatch = sinon.spy();
    return getAllergiesList()(dispatch).then(() => {
      expect(typeof dispatch.secondCall.args[0]).to.equal('function');
    });
  });
});

describe('Get allergy action', () => {
  it('should dispatch a get details action', () => {
    const mockData = allergy;
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return getAllergyDetails('3106', undefined)(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(Actions.Allergies.GET);
    });
  });
  it('should dispatch an add alert action', () => {
    const mockData = allergy;
    mockApiRequest(mockData, false);
    const dispatch = sinon.spy();
    return getAllergyDetails()(dispatch).then(() => {
      expect(typeof dispatch.firstCall.args[0]).to.equal('function');
    });
  });
});

describe('Get allergy details action ', () => {
  it('should dispatch a get details action and pull the list', () => {
    const dispatch = sinon.spy();
    return getAllergyDetails('1', [{ id: '1' }])(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Allergies.GET_FROM_LIST,
      );
    });
  });
  it('should dispatch an add alert action', () => {
    const dispatch = sinon.spy();
    return getAllergyDetails()(dispatch).then(() => {
      expect(typeof dispatch.firstCall.args[0]).to.equal('function');
    });
  });
});

describe('Clear allergy details action', () => {
  it('should dispatch a clear details action', () => {
    const dispatch = sinon.spy();
    return clearAllergyDetails()(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Allergies.CLEAR_DETAIL,
      );
    });
  });
});
