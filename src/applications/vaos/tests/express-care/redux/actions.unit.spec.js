import moment from '../../../lib/moment-tz';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  resetFetch,
  mockFetch,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';
import {
  fetchExpressCareWindows,
  FETCH_EXPRESS_CARE_WINDOWS,
  FETCH_EXPRESS_CARE_WINDOWS_SUCCEEDED,
  FETCH_EXPRESS_CARE_WINDOWS_FAILED,
} from '../../../appointment-list/redux/actions';
import {
  fetchRequestLimits,
  FORM_FETCH_REQUEST_LIMITS,
  FORM_FETCH_REQUEST_LIMITS_SUCCEEDED,
} from '../../../express-care/redux/actions';
import {
  mockRequestEligibilityCriteria,
  mockRequestLimit,
} from '../../mocks/helpers';
import { getExpressCareRequestCriteriaMock } from '../../mocks/v0';

describe('VAOS Express Care actions', () => {
  beforeEach(() => {
    mockFetch();
  });

  afterEach(() => {
    resetFetch();
  });

  const userState = {
    profile: {
      facilities: [
        {
          facilityId: '983',
          isCerner: false,
        },
      ],
    },
  };

  it('should fetch express care windows', async () => {
    const getState = () => ({
      user: userState,
    });
    const today = moment();
    const requestCriteria = getExpressCareRequestCriteriaMock('983', [
      {
        day: today
          .clone()
          .tz('America/Denver')
          .format('dddd')
          .toUpperCase(),
        canSchedule: true,
        startTime: today
          .clone()
          .subtract('2', 'minutes')
          .tz('America/Denver')
          .format('HH:mm'),
        endTime: today
          .clone()
          .add('1', 'minutes')
          .tz('America/Denver')
          .format('HH:mm'),
      },
    ]);
    mockRequestEligibilityCriteria(['983'], [requestCriteria]);

    const thunk = fetchExpressCareWindows();
    const dispatchSpy = sinon.spy();
    await thunk(dispatchSpy, getState);
    expect(dispatchSpy.firstCall.args[0].type).to.eql(
      FETCH_EXPRESS_CARE_WINDOWS,
    );
    expect(dispatchSpy.secondCall.args[0].type).to.eql(
      FETCH_EXPRESS_CARE_WINDOWS_SUCCEEDED,
    );
  });

  it('should dispatch fail action when failed to fetch windows', async () => {
    setFetchJSONFailure(global.fetch, { errors: [] });
    const thunk = fetchExpressCareWindows();
    const dispatchSpy = sinon.spy();
    const getState = () => ({
      user: userState,
      appointments: {},
    });
    await thunk(dispatchSpy, getState);
    expect(dispatchSpy.firstCall.args[0].type).to.eql(
      FETCH_EXPRESS_CARE_WINDOWS,
    );
    expect(dispatchSpy.lastCall.args[0].type).to.eql(
      FETCH_EXPRESS_CARE_WINDOWS_FAILED,
    );
  });

  it('should fetch express care limits', async () => {
    const today = moment();
    const getState = () => ({
      user: userState,
      appointments: {
        expressCareFacilities: [
          {
            facilityId: '983',
            days: [
              {
                day: today.format('dddd').toUpperCase(),
                canSchedule: true,
                startTime: today
                  .clone()
                  .subtract('2', 'minutes')
                  .tz('America/Denver')
                  .format('HH:mm'),
                endTime: today
                  .clone()
                  .add('1', 'minutes')
                  .tz('America/Denver')
                  .format('HH:mm'),
              },
            ],
          },
        ],
      },
    });

    mockRequestLimit({ facilityId: '983' });
    const thunk = fetchRequestLimits();
    const dispatchSpy = sinon.spy();
    await thunk(dispatchSpy, getState);
    expect(dispatchSpy.firstCall.args[0].type).to.eql(
      FORM_FETCH_REQUEST_LIMITS,
    );
    expect(dispatchSpy.secondCall.args[0].type).to.eql(
      FORM_FETCH_REQUEST_LIMITS_SUCCEEDED,
    );
  });
});
