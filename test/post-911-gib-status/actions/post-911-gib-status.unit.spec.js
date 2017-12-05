import { expect } from 'chai';
import sinon from 'sinon';
import { getEnrollmentData } from '../../../src/js/post-911-gib-status/actions/post-911-gib-status';
import {
  BACKEND_AUTHENTICATION_ERROR,
  BACKEND_SERVICE_ERROR,
  GET_ENROLLMENT_DATA_FAILURE,
  GET_ENROLLMENT_DATA_SUCCESS,
  NO_CHAPTER33_RECORD_AVAILABLE,
  metaStatus
} from '../../../src/js/post-911-gib-status/utils/constants';

let oldFetch;
let oldSessionStorage;
let oldWindow;
const setup = () => {
  oldSessionStorage = global.sessionStorage;
  oldFetch = global.fetch;
  oldWindow = global.window;
  global.sessionStorage = { userToken: '123abc' };
  global.fetch = sinon.stub();
  global.fetch.returns(Promise.resolve({
    headers: { get: () => 'application/json' },
    ok: true,
    json: () => Promise.resolve({})
  }));
  global.window.dataLayer = [];
  global.window.URL = {
    createObjectURL: () => { },
    revokeObjectURL: () => { }
  };
};

const teardown = () => {
  global.sessionStorage = oldSessionStorage;
  global.fetch = oldFetch;
  global.window = oldWindow;
};

describe.only('getEnrollmentData', () => {
  const successResponse = {
    meta: {
      status: 'OK'
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
          months: 0
        },
        usedEntitlement: {
          days: 0,
          months: 0
        },
        remainingEntitlement: {
          days: 0,
          months: 0
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
                onCampusHours: 'Unknown Type: number,null',
                onlineHours: 'Unknown Type: number,null',
                yellowRibbonAmount: 'Unknown Type: number,null',
                type: 'string',
                changeEffectiveDate: 'Unknown Type: string,null'
              }
            ]
          }
        ]
      }
    }
  };

  beforeEach(setup);
  afterEach(teardown);

  it('dispatches GET_ENROLLMENT_DATA_SUCCESS on successful fetch', (done) => {
    const thunk = getEnrollmentData();
    const dispatch = sinon.spy();
    thunk(dispatch)
      .then(() => {
        const action = dispatch.firstCall.args[0];
        expect(action.type).to.equal(GET_ENROLLMENT_DATA_SUCCESS);
        expect(action.data).to.equal(successResponse.data.attributes);
      }).then(done, done);
  });

});
