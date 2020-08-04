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

describe('VAOS express care reducer', () => {
  it('should set windowsStatus to loading', () => {
    const action = {
      type: FETCH_EXPRESS_CARE_WINDOWS,
    };

    const newState = expressCareReducer(initialState, action);
    expect(newState.windowsStatus).to.equal(FETCH_STATUS.loading);
  });

  it('should filter out facilities without EC and set status on success', () => {
    const action = {
      type: FETCH_EXPRESS_CARE_WINDOWS_SUCCEEDED,
      settings: [
        {
          id: '983',
          customRequestSettings: [
            {
              id: 'CR1',
              typeOfCare: 'Express Care',
              supported: true,
              schedulingDays: [
                {
                  day: 'MONDAY',
                  canSchedule: true,
                },
                {
                  day: 'TUESDAY',
                  canSchedule: false,
                },
              ],
            },
          ],
        },
        {
          id: '984',
          customRequestSettings: [
            {
              id: 'CR1',
              typeOfCare: 'Express Care',
              supported: false,
              schedulingDays: [],
            },
          ],
        },
      ],
    };

    const newState = expressCareReducer(initialState, action);
    expect(newState.windowsStatus).to.equal(FETCH_STATUS.succeeded);
    expect(newState.supportedFacilities.length).to.equal(1);
    expect(newState.supportedFacilities[0].days.length).to.equal(1);
  });

  it('should set windowsStatus to failed', () => {
    const action = {
      type: FETCH_EXPRESS_CARE_WINDOWS_FAILED,
    };

    const newState = expressCareReducer(initialState, action);
    expect(newState.windowsStatus).to.equal(FETCH_STATUS.failed);
  });
});
