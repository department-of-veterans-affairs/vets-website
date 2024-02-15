import { expect } from 'chai';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import sinon from 'sinon';
import { prescriptions } from '../fixtures/prescriptions.json';
import prescriptionDetails from '../fixtures/prescriptionDetails.json';
import { allergies } from '../../../medical-records/tests/fixtures/allergies.json';
import { Actions } from '../../util/actionTypes';
import {
  getPrescriptionsPaginatedSortedList,
  getPrescriptionDetails,
  getAllergiesList,
  clearAllergiesError,
  fillPrescription,
  setPrescriptionDetails,
} from '../../actions/prescriptions';

describe('Get prescription list action', () => {
  it('should dispatch a get paginated, sorted list action', () => {
    const mockData = prescriptions;
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return getPrescriptionsPaginatedSortedList()(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Prescriptions.GET_PAGINATED_SORTED_LIST,
      );
    });
  });
});

describe('Get allergies action', () => {
  it('should dispatch a get allergies list action', () => {
    const mockData = allergies;
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return getAllergiesList()(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Allergies.GET_LIST,
      );
    });
  });
  it('should dispatch an get list error', () => {
    const mockData = allergies;
    mockApiRequest(mockData, false);
    const dispatch = sinon.spy();
    return getAllergiesList()(dispatch).then(async () => {
      expect(typeof dispatch.firstCall.args[0]).to.equal('object');
    });
  });
});

describe('Clear allergies error action', () => {
  it('should dispatch a clear allergies error action', () => {
    const dispatch = sinon.spy();
    return clearAllergiesError()(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Allergies.GET_LIST_ERROR_RESET,
      );
    });
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
});
