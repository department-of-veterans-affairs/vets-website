import { expect } from 'chai';
import sinon from 'sinon';
import {
  mockFetch,
  setFetchJSONFailure,
  setFetchJSONResponse,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import { getEnrollmentData } from '../../actions/post-911-gib-status';
import {
  BACKEND_AUTHENTICATION_ERROR,
  GET_ENROLLMENT_DATA_FAILURE,
  GET_ENROLLMENT_DATA_SUCCESS,
  NO_CHAPTER33_RECORD_AVAILABLE,
  BACKEND_SERVICE_ERROR,
  SERVICE_DOWNTIME_ERROR,
} from '../../utils/constants';

let oldWindow;
const setup = () => {
  oldWindow = global.window;
  mockFetch();
  global.window = Object.create(global.window);
  Object.assign(global.window, {
    dataLayer: [],
    URL: {
      createObjectURL: () => {},
      revokeObjectURL: () => {},
    },
  });
};

const teardown = () => {
  global.window = oldWindow;
};

describe('getEnrollmentData', () => {
  const successResponse = {
    meta: {
      status: 'OK',
    },
    data: {
      id: 'string',
      type: 'evss_gi_bill_status_gi_bill_status_responses',
      attributes: {
        firstName: 'Abraham',
        lastName: 'Lincoln',
        nameSuffix: 'Jr',
        dateOfBirth: '1955-11-12T06:00:00.000+0000',
        vaFileNumber: '123456789',
        regionalProcessingOffice: 'Central Office Washington, DC',
        eligibilityDate: '2004-10-01T04:00:00.000+0000',
        delimitingDate: '2015-10-01T04:00:00.000+0000',
        percentageBenefit: 100,
        veteranIsEligible: false,
        activeDuty: false,
        originalEntitlement: {
          days: 0,
          months: 0,
        },
        usedEntitlement: {
          days: 0,
          months: 0,
        },
        remainingEntitlement: {
          days: 0,
          months: 0,
        },
        enrollments: [
          {
            beginDate: '2012-11-01T04:00:00.000+00:00',
            endDate: '2012-12-01T05:00:00.000+00:00',
            facilityCode: '12345678',
            facilityName: 'Purdue University',
            participantId: '11170323',
            trainingType: 'UNDER_GRAD',
            termId: null,
            hourType: null,
            fullTimeHours: 12,
            fullTimeCreditHourUnderGrad: null,
            vacationDayCount: 0,
            onCampusHours: 12,
            onlineHours: 0,
            yellowRibbonAmount: 0,
            status: 'Approved',
            amendments: [
              {
                onCampusHours: 8,
                onlineHours: 0,
                yellowRibbonAmount: 1,
                type: 'string',
                changeEffectiveDate: 'No effective date',
              },
            ],
          },
        ],
      },
    },
  };

  beforeEach(setup);
  afterEach(teardown);

  it('dispatches GET_ENROLLMENT_DATA_SUCCESS on successful fetch', done => {
    setFetchJSONResponse(global.fetch.onCall(0), successResponse);
    const thunk = getEnrollmentData();
    const dispatch = sinon.spy();
    thunk(dispatch)
      .then(() => {
        const action = dispatch.firstCall.args[0];
        expect(action.type).to.equal(GET_ENROLLMENT_DATA_SUCCESS);
        expect(action.data).to.equal(successResponse.data.attributes);
      })
      .then(done, done);
  });

  it('dispatches GET_ENROLLMENT_DATA_FAILURE on unspecified failure', done => {
    setFetchJSONFailure(
      global.fetch.onCall(0),
      new Error('Unknown error in apiRequest'),
    );
    const thunk = getEnrollmentData();
    const dispatch = sinon.spy();
    thunk(dispatch)
      .then(() => {
        const action = dispatch.firstCall.args[0];
        expect(action.type).to.equal(GET_ENROLLMENT_DATA_FAILURE);
      })
      .then(done, done);
  });

  it('dispatches GET_ENROLLMENT_DATA_FAILURE on unexpected error without code', done => {
    setFetchJSONFailure(global.fetch.onCall(0), Promise.reject(new Error()));
    const thunk = getEnrollmentData();
    const dispatch = sinon.spy();
    thunk(dispatch)
      .then(() => {
        const action = dispatch.firstCall.args[0];
        expect(action.type).to.equal(GET_ENROLLMENT_DATA_FAILURE);
      })
      .then(done, done);
  });

  it('dispatches GET_ENROLLMENT_DATA_FAILURE on unexpected error code', done => {
    setFetchJSONFailure(global.fetch.onCall(0), {
      errors: [{ status: '500' }],
    });
    const thunk = getEnrollmentData();
    const dispatch = sinon.spy();
    thunk(dispatch)
      .then(() => {
        const action = dispatch.firstCall.args[0];
        expect(action.type).to.equal(GET_ENROLLMENT_DATA_FAILURE);
      })
      .then(done, done);
  });

  it('dispatches matching error action on known error code', done => {
    setFetchJSONFailure(global.fetch.onCall(0), {
      errors: [{ status: '503' }],
    });
    const thunk = getEnrollmentData();
    const dispatch = sinon.spy();
    thunk(dispatch)
      .then(() => {
        const action = dispatch.firstCall.args[0];
        expect(action.type).to.equal(SERVICE_DOWNTIME_ERROR);
      })
      .then(done, done);
  });

  it('dispatches BACKEND_SERVICE_ERROR on 504 error code', done => {
    setFetchJSONFailure(global.fetch.onCall(0), {
      errors: [{ status: '504' }],
    });
    const thunk = getEnrollmentData();
    const dispatch = sinon.spy();
    thunk(dispatch)
      .then(() => {
        const action = dispatch.firstCall.args[0];
        expect(action.type).to.equal(BACKEND_SERVICE_ERROR);
      })
      .then(done, done);
  });

  it('dispatches BACKEND_AUTHENTICATION_ERROR on 403 error code', done => {
    setFetchJSONFailure(global.fetch.onCall(0), {
      errors: [{ status: '403' }],
    });
    const thunk = getEnrollmentData();
    const dispatch = sinon.spy();
    thunk(dispatch)
      .then(() => {
        const action = dispatch.firstCall.args[0];
        expect(action.type).to.equal(BACKEND_AUTHENTICATION_ERROR);
      })
      .then(done, done);
  });

  it('dispatches BACKEND_AUTHENTICATION_ERROR on 404 error code', done => {
    setFetchJSONFailure(global.fetch.onCall(0), {
      errors: [{ status: '404' }],
    });
    const thunk = getEnrollmentData();
    const dispatch = sinon.spy();
    thunk(dispatch)
      .then(() => {
        const action = dispatch.firstCall.args[0];
        expect(action.type).to.equal(NO_CHAPTER33_RECORD_AVAILABLE);
      })
      .then(done, done);
  });

  it('dispatches GET_ENROLLMENT_DATA_FAILURE when no error codes are received', done => {
    setFetchJSONFailure(global.fetch.onCall(0), {
      errors: [], // no errors received
    });
    const thunk = getEnrollmentData();
    const dispatch = sinon.spy();
    thunk(dispatch)
      .then(() => {
        const action = dispatch.firstCall.args[0];
        expect(action.type).to.equal(GET_ENROLLMENT_DATA_FAILURE);
      })
      .then(done, done);
  });
});
