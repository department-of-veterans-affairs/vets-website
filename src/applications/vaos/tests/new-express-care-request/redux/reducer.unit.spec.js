import { expect } from 'chai';

import {
  FORM_FETCH_REQUEST_LIMITS,
  FORM_FETCH_REQUEST_LIMITS_SUCCEEDED,
  FORM_FETCH_REQUEST_LIMITS_FAILED,
} from '../../../express-care/redux/actions';
import expressCareReducer from '../../../express-care/redux/reducer';
import { FETCH_STATUS } from '../../../utils/constants';

const initialState = {
  allowRequests: false,
  localWindowString: null,
  minStart: null,
  maxEnd: null,
};

describe('VAOS express care reducer', () => {
  it('should set fetchRequestLimitsStatus to loading', () => {
    const action = {
      type: FORM_FETCH_REQUEST_LIMITS,
    };

    const newState = expressCareReducer(initialState, action);
    expect(newState.newRequest.fetchRequestLimitsStatus).to.equal(
      FETCH_STATUS.loading,
    );
  });

  it('should set facilityId, siteId, and isUnderRequestLimit', () => {
    const action = {
      type: FORM_FETCH_REQUEST_LIMITS_SUCCEEDED,
      facilityId: '983',
      siteId: '983',
      isUnderRequestLimit: true,
    };

    const newState = expressCareReducer(initialState, action).newRequest;
    expect(newState.fetchRequestLimitsStatus).to.equal(FETCH_STATUS.succeeded);
    expect(newState.facilityId).to.equal('983');
    expect(newState.siteId).to.equal('983');
    expect(newState.isUnderRequestLimit).to.equal(true);
  });

  it('should set fetchRequestLimitsStatus to failed', () => {
    const action = {
      type: FORM_FETCH_REQUEST_LIMITS_FAILED,
    };

    const newState = expressCareReducer(initialState, action);
    expect(newState.newRequest.fetchRequestLimitsStatus).to.equal(
      FETCH_STATUS.failed,
    );
  });
});
