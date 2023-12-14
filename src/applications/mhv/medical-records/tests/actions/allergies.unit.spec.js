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
import { dispatchDetails } from '../../util/helpers';
import { addAlert } from '../../actions/alerts';
import * as Constants from '../../util/constants';

describe('Get allergies action', () => {
  it('should dispatch a get list action', () => {
    const mockData = allergies;
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return getAllergiesList()(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Allergies.GET_LIST,
      );
    });
  });
  it('should dispatch an add alert action', () => {
    const mockData = allergies;
    mockApiRequest(mockData, false);
    const dispatch = sinon.spy();
    return getAllergiesList()(dispatch).then(() => {
      expect(typeof dispatch.firstCall.args[0]).to.equal('function');
    });
  });
});

describe('Get allergy action', () => {
  it('should dispatch a get details action', async () => {
    const allergyList = [];
    const mockData = allergy;
    const dispatch = sinon.spy();

    const getDetail = async () => mockData;

    try {
      await dispatchDetails(
        '3106',
        allergyList,
        dispatch,
        getDetail,
        Actions.Allergies.GET_FROM_LIST,
        Actions.Allergies.GET,
      );
      expect(dispatch.called).to.be.true;
      expect(dispatch.firstCall.args[0]).to.exist;
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Allergies.GET_FROM_LIST,
      );
    } catch (error) {
      dispatch(addAlert(Constants.ALERT_TYPE_ERROR));
    }
  });

  it('should dispatch an add alert action', async () => {
    const allergyList = [];
    const mockData = allergy;
    const dispatch = sinon.spy();

    const getDetail = async () => mockData;

    try {
      await dispatchDetails(
        '',
        allergyList,
        dispatch,
        getDetail,
        Actions.Allergies.GET_FROM_LIST,
        Actions.Allergies.GET,
      );
      expect(dispatch.calledTwice).to.be.true;
      expect(dispatch.secondCall.args[0]).to.exist;
      expect(typeof dispatch.secondCall.args[0]).to.equal('function');
    } catch (error) {
      dispatch(addAlert(Constants.ALERT_TYPE_ERROR));
    }
  });
});

describe('Get allergy details action ', () => {
  it('should dispatch a get details action and pull the list', () => {
    const mockData = { id: '1', title: 'Sample Note' };
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return getAllergyDetails('1', [{ id: '1', title: 'Sample Note' }])(
      dispatch,
    ).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Allergies.GET_FROM_LIST,
      );
    });
  });
  it('should dispatch an add alert action', () => {
    const mockData = { id: '1', title: 'Sample Note' };
    mockApiRequest(mockData, false);
    const dispatch = sinon.spy();
    return getAllergyDetails('1', [{ id: '1', title: 'Sample Note' }])(
      dispatch,
    ).then(() => {
      expect(typeof dispatch.firstCall.args[0]).to.equal('object');
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
