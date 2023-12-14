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
import { dispatchDetails } from '../../util/helpers';
import { addAlert } from '../../actions/alerts';
import * as Constants from '../../util/constants';

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
});

describe('Get vaccine action test', () => {
  it('should dispatch a get details action', async () => {
    const vaccineList = [];
    const mockData = vaccine;
    const dispatch = sinon.spy();

    const getDetail = async () => mockData;

    try {
      await dispatchDetails(
        '3106',
        vaccineList,
        dispatch,
        getDetail,
        Actions.Vaccines.GET_FROM_LIST,
        Actions.Vaccines.GET,
      );
      expect(dispatch.called).to.be.true;
      expect(dispatch.firstCall.args[0]).to.exist;
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Vaccines.GET_FROM_LIST,
      );
    } catch (error) {
      dispatch(addAlert(Constants.ALERT_TYPE_ERROR));
    }
  });
});

describe('Get vaccine details action', () => {
  it('should dispatch a details action and pull from the list', () => {
    const mockData = { id: '1', title: 'Sample Note' };
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return getVaccineDetails('1', [{ id: '1', title: 'Sample Note' }])(
      dispatch,
    ).then(() => {
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
