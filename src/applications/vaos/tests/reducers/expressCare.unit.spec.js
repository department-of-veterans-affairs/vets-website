import { expect } from 'chai';
import moment from 'moment';

import {
  FETCH_EXPRESS_CARE_WINDOWS,
  FETCH_EXPRESS_CARE_WINDOWS_SUCCEEDED,
  FETCH_EXPRESS_CARE_WINDOWS_FAILED,
} from '../../actions/expressCare';
import expressCareReducer from '../../reducers/expressCare';
import { FETCH_STATUS } from '../../utils/constants';

const initialState = {
  windowsStatus: FETCH_STATUS.notStarted,
  allowRequests: false,
  localWindowString: null,
  minStart: null,
  maxEnd: null,
};

describe('express care window', () => {
  it('should set windowsStatus to loading', () => {
    const action = {
      type: FETCH_EXPRESS_CARE_WINDOWS,
    };

    const newState = expressCareReducer(initialState, action);
    expect(newState.windowsStatus).to.equal(FETCH_STATUS.loading);
  });

  it('should fetch and format express care window and update windowsStatus', () => {
    const window = {
      start: '00:00',
      end: '23:59',
      timezone: 'MDT',
      offsetUtc: '-06:00',
    };
    const action = {
      type: FETCH_EXPRESS_CARE_WINDOWS_SUCCEEDED,
      facilityData: [
        [
          {
            expressTimes: window,
          },
        ],
      ],
      nowUtc: moment.utc(),
    };

    const newState = expressCareReducer(initialState, action);
    expect(newState.windowsStatus).to.equal(FETCH_STATUS.succeeded);
    expect('allowRequests' in newState).to.equal(true);
    expect(newState.localWindowString).to.equal('12:00 a.m. to 11:59 p.m. MT');
  });

  it('should set windowsStatus to failed', () => {
    const action = {
      type: FETCH_EXPRESS_CARE_WINDOWS_FAILED,
    };

    const newState = expressCareReducer(initialState, action);
    expect(newState.windowsStatus).to.equal(FETCH_STATUS.failed);
  });
});
