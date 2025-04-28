import { expect } from 'chai';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import sinon from 'sinon';
import { prescriptions } from '../fixtures/prescriptions.json';
import prescriptionDetails from '../fixtures/prescriptionDetails.json';
import { Actions } from '../../util/actionTypes';
import {
  getPrescriptionDetails,
  fillPrescription,
  setPrescriptionDetails,
  clearFillNotification,
  getPaginatedFilteredList,
} from '../../actions/prescriptions';

describe('Get prescription list action', () => {
  it('should dispatch a paginated filtered list action', async () => {
    const mockData = prescriptions;
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    await getPaginatedFilteredList()(dispatch);
    expect(dispatch.firstCall.args[0].type).to.equal(
      Actions.Prescriptions.GET_PAGINATED_FILTERED_LIST,
    );
  });
});

describe('Get prescription details action', () => {
  it('should dispatch a get details action', async () => {
    const mockData = prescriptionDetails;
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    await getPrescriptionDetails()(dispatch);
    expect(dispatch.firstCall.args[0].type).to.equal(
      Actions.Prescriptions.GET_DETAILS,
    );
  });
});

describe('Set prescription details action', () => {
  it('should dispatch a set details action', async () => {
    const mockData = prescriptionDetails.data.attributes;
    const dispatch = sinon.spy();
    await setPrescriptionDetails(mockData)(dispatch);
    expect(dispatch.firstCall.args[0].type).to.equal(
      Actions.Prescriptions.SET_DETAILS,
    );
  });
});

describe('Fill prescription action', () => {
  it('should dispatch a clear error action', () => {
    const mockData = prescriptionDetails;
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return fillPrescription()(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Prescriptions.CLEAR_ERROR,
      );
    });
  });
  it('should dispatch a fill prescription error', () => {
    const mockData = prescriptionDetails;
    mockApiRequest(mockData, false);
    const dispatch = sinon.spy();
    return fillPrescription()(dispatch).then(async () => {
      expect(typeof dispatch.firstCall.args[0]).to.equal('object');
    });
  });
  it('should clear notification data', async () => {
    const dispatch = sinon.spy();
    await clearFillNotification()(dispatch);
    expect(dispatch.firstCall.args[0].type).to.equal(
      Actions.Prescriptions.CLEAR_FILL_NOTIFICATION,
    );
  });
});
