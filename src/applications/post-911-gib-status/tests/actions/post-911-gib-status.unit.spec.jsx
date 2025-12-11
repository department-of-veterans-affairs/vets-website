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
    data: {
      id: '',
      type: 'ch33_status',
      attributes: {
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfBirth: '1988-03-01',
        vaFileNumber: '374374377',
        regionalProcessingOffice: 'Muskogee, OK',
        eligibilityDate: '2005-04-01',
        delimitingDate: null,
        percentageBenefit: 100,
        activeDuty: true,
        veteranIsEligible: true,
        originalEntitlement: {
          months: 36,
          days: 0,
        },
        usedEntitlement: {
          months: 22,
          days: 3,
        },
        remainingEntitlement: {
          months: 0,
          days: 0,
        },
        entitlementTransferredOut: {
          months: 14,
          days: 0,
        },
      },
    },
  };

  beforeEach(setup);
  afterEach(teardown);

  it('dispatches GET_ENROLLMENT_DATA_SUCCESS on successful fetch', done => {
    setFetchJSONResponse(global.fetch.onCall(0), successResponse);

    // pass apiVersion + enableSobClaimantService
    const thunk = getEnrollmentData('v0', true);
    const dispatch = sinon.spy();

    thunk(dispatch)
      .then(() => {
        const action = dispatch.firstCall.args[0];
        expect(action.type).to.equal(GET_ENROLLMENT_DATA_SUCCESS);
        expect(action.data).to.deep.equal(successResponse.data.attributes);
      })
      .then(done, done);
  });

  it('dispatches GET_ENROLLMENT_DATA_FAILURE on unspecified failure', done => {
    setFetchJSONFailure(
      global.fetch.onCall(0),
      new Error('Unknown error in apiRequest'),
    );
    const thunk = getEnrollmentData('v0', true);
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
    const thunk = getEnrollmentData('v0', true);
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
    const thunk = getEnrollmentData('v0', true);
    const dispatch = sinon.spy();
    thunk(dispatch)
      .then(() => {
        const action = dispatch.firstCall.args[0];
        expect(action.type).to.equal(GET_ENROLLMENT_DATA_FAILURE);
      })
      .then(done, done);
  });

  it('dispatches matching error action on known 503 error code', done => {
    setFetchJSONFailure(global.fetch.onCall(0), {
      errors: [{ status: '503' }],
    });
    const thunk = getEnrollmentData('v0', true);
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
    const thunk = getEnrollmentData('v0', true);
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
    const thunk = getEnrollmentData('v0', true);
    const dispatch = sinon.spy();
    thunk(dispatch)
      .then(() => {
        const action = dispatch.firstCall.args[0];
        expect(action.type).to.equal(BACKEND_AUTHENTICATION_ERROR);
      })
      .then(done, done);
  });

  it('dispatches NO_CHAPTER33_RECORD_AVAILABLE on 404 error code', done => {
    setFetchJSONFailure(global.fetch.onCall(0), {
      errors: [{ status: '404' }],
    });
    const thunk = getEnrollmentData('v0', true);
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
    const thunk = getEnrollmentData('v0', true);
    const dispatch = sinon.spy();
    thunk(dispatch)
      .then(() => {
        const action = dispatch.firstCall.args[0];
        expect(action.type).to.equal(GET_ENROLLMENT_DATA_FAILURE);
      })
      .then(done, done);
  });
});
