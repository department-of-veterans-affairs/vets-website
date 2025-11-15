import { expect } from 'chai';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import sinon from 'sinon';
import { Actions } from '../../util/actionTypes';
import labsAndTests from '../fixtures/labsAndTests.json';
import pathology from '../fixtures/pathology.json';
import {
  clearLabsAndTestDetails,
  getLabsAndTestsList,
  getLabsAndTestsDetails,
  updateLabsAndTestDateRange,
} from '../../actions/labsAndTests';

describe('Get labs and tests action', () => {
  it('should dispatch a get list action', () => {
    const mockData = labsAndTests;
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return getLabsAndTestsList()(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.LabsAndTests.UPDATE_LIST_STATE,
      );
      expect(dispatch.secondCall.args[0].type).to.equal(
        Actions.Refresh.CLEAR_INITIAL_FHIR_LOAD,
      );
      expect(dispatch.thirdCall.args[0].type).to.equal(
        Actions.LabsAndTests.GET_LIST,
      );
    });
  });

  it('should dispatch a get list action when accelerating', () => {
    const mockData = labsAndTests;
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return getLabsAndTestsList(false, true)(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.LabsAndTests.UPDATE_LIST_STATE,
      );
      expect(dispatch.secondCall.args[0].type).to.equal(
        Actions.Refresh.CLEAR_INITIAL_FHIR_LOAD,
      );
      expect(dispatch.thirdCall.args[0].type).to.equal(
        Actions.LabsAndTests.GET_UNIFIED_LIST,
      );
    });
  });
});

describe('Get labs and tests details action', () => {
  it('should dispatch a get details action', () => {
    const mockData = pathology;
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return getLabsAndTestsDetails('3106')(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.LabsAndTests.GET,
      );
    });
  });

  it('should dispatch a get details action and pull from the list argument', () => {
    const dispatch = sinon.spy();
    return getLabsAndTestsDetails('1', [{ id: '1' }])(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.LabsAndTests.GET_FROM_LIST,
      );
    });
  });
});

describe('Clear labs and tests details action', () => {
  it('should dispatch a clear details action', () => {
    const dispatch = sinon.spy();
    return clearLabsAndTestDetails()(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.LabsAndTests.CLEAR_DETAIL,
      );
    });
  });
});

describe('Update labs and tests date range action', () => {
  it('should dispatch a set date range action with correct payload', () => {
    const dispatch = sinon.spy();
    const option = '6';
    const fromDate = '2025-05-13';
    const toDate = '2025-11-13';
    return updateLabsAndTestDateRange(option, fromDate, toDate)(dispatch).then(
      () => {
        expect(dispatch.calledOnce).to.be.true;
        const action = dispatch.firstCall.args[0];
        expect(action.type).to.equal(Actions.LabsAndTests.SET_DATE_RANGE);
        expect(action.payload).to.deep.equal({ option, fromDate, toDate });
      },
    );
  });
});
