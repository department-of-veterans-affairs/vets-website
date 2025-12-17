/* eslint-disable camelcase */
import { expect } from 'chai';
import sinon from 'sinon';
import {
  mockFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import * as helpers from '../../../helpers';

import {
  fetchCh31Eligibility,
  fetchCh31CaseStatusDetails,
} from '../../../actions/ch31-my-eligibility-and-benefits';
import {
  CH31_FETCH_STARTED,
  CH31_FETCH_SUCCEEDED,
  CH31_FETCH_FAILED,
  CH31_ERROR_400_BAD_REQUEST,
  CH31_ERROR_403_FORBIDDEN,
  CH31_ERROR_500_SERVER,
  CH31_ERROR_503_UNAVAILABLE,
  CH31_CASE_STATUS_DETAILS_FETCH_STARTED,
  CH31_CASE_STATUS_DETAILS_FETCH_SUCCEEDED,
  CH31_CASE_STATUS_DETAILS_FETCH_FAILED,
  CH31_CASE_STATUS_DETAILS_ERROR_400_BAD_REQUEST,
  CH31_CASE_STATUS_DETAILS_ERROR_403_FORBIDDEN,
  CH31_CASE_STATUS_DETAILS_ERROR_500_SERVER,
  CH31_CASE_STATUS_DETAILS_ERROR_503_UNAVAILABLE,
} from '../../../constants';

const setup = () => {
  mockFetch();
};

const teardown = () => {
  if (global.fetch?.resetHistory) global.fetch.resetHistory();
};

const successPayload = {
  data: {
    id: 'abc',
    type: 'vre_ch31_eligibility',
    attributes: { resEligibilityRecommendation: 'eligible', resCaseId: 123 },
  },
};

const successCaseDetailsPayload = {
  data: {
    id: '',
    type: 'ch31_case_details',
    attributes: {
      res_case_id: 123456,
      is_transfered_to_cwnrs: true,
      external_status: {
        is_discontinued: false,
        discontinued_reason: null,
        state_list: [
          { step_code: 'APPL', status: 'COMPLETED' },
          { step_code: 'ELGLDET', status: 'COMPLETED' },
          { step_code: 'INTAKE', status: 'ACTIVE' },
          { step_code: 'ENTLDET', status: 'PENDING' },
          { step_code: 'PLANSELECT', status: 'PENDING' },
          { step_code: 'PLANINTAKE', status: 'PENDING' },
        ],
      },
    },
  },
};

const makeError = (status, extras = {}) => ({
  errors: [
    {
      status: String(status),
      title: extras.title || 'Error',
      detail: extras.detail || 'Something went wrong',
      code: extras.code || `RES_CH31_ELIGIBILITY_${status}`,
    },
  ],
});

describe('fetchCh31Eligibility action', () => {
  beforeEach(setup);
  afterEach(teardown);

  it('dispatches START then SUCCEEDED on success', async () => {
    setFetchJSONResponse(global.fetch.onCall(0), successPayload);

    const thunk = fetchCh31Eligibility();
    const dispatch = sinon.spy();

    await thunk(dispatch);

    expect(dispatch.callCount).to.equal(2);
    expect(dispatch.getCall(0).args[0].type).to.equal(CH31_FETCH_STARTED);

    const action = dispatch.getCall(1).args[0];
    expect(action.type).to.equal(CH31_FETCH_SUCCEEDED);
    expect(action.payload).to.deep.equal(successPayload);
  });

  it('maps 400 → CH31_ERROR_400_BAD_REQUEST', async () => {
    setFetchJSONFailure(global.fetch.onCall(0), makeError(400));

    const thunk = fetchCh31Eligibility();
    const dispatch = sinon.spy();

    await thunk(dispatch);

    expect(dispatch.getCall(0).args[0].type).to.equal(CH31_FETCH_STARTED);
    const action = dispatch.getCall(1).args[0];
    expect(action.type).to.equal(CH31_ERROR_400_BAD_REQUEST);
    expect(action.error.status).to.equal(400);
    expect(action.error.messages).to.be.an('array').that.is.not.empty;
  });

  it('maps 403 → CH31_ERROR_403_FORBIDDEN', async () => {
    setFetchJSONFailure(
      global.fetch.onCall(0),
      makeError(403, { detail: 'Not Authorized' }),
    );

    const thunk = fetchCh31Eligibility();
    const dispatch = sinon.spy();

    await thunk(dispatch);

    expect(dispatch.getCall(0).args[0].type).to.equal(CH31_FETCH_STARTED);
    const action = dispatch.getCall(1).args[0];
    expect(action.type).to.equal(CH31_ERROR_403_FORBIDDEN);
    expect(action.error.status).to.equal(403);
  });

  it('maps 503 → CH31_ERROR_503_UNAVAILABLE', async () => {
    setFetchJSONFailure(
      global.fetch.onCall(0),
      makeError(503, { title: 'Service Unavailable' }),
    );

    const thunk = fetchCh31Eligibility();
    const dispatch = sinon.spy();

    await thunk(dispatch);

    expect(dispatch.getCall(0).args[0].type).to.equal(CH31_FETCH_STARTED);
    const action = dispatch.getCall(1).args[0];
    expect(action.type).to.equal(CH31_ERROR_503_UNAVAILABLE);
    expect(action.error.status).to.equal(503);
  });

  it('maps 500/504 → CH31_ERROR_500_SERVER', async () => {
    setFetchJSONFailure(global.fetch.onCall(0), makeError(504));

    const thunk = fetchCh31Eligibility();
    const dispatch = sinon.spy();

    await thunk(dispatch);

    expect(dispatch.getCall(0).args[0].type).to.equal(CH31_FETCH_STARTED);
    const action = dispatch.getCall(1).args[0];
    expect(action.type).to.equal(CH31_ERROR_500_SERVER);
    expect(action.error.status).to.equal(504);
  });

  it('unknown status → CH31_FETCH_FAILED', async () => {
    setFetchJSONFailure(global.fetch.onCall(0), makeError(418));

    const thunk = fetchCh31Eligibility();
    const dispatch = sinon.spy();

    await thunk(dispatch);

    expect(dispatch.getCall(0).args[0].type).to.equal(CH31_FETCH_STARTED);
    const action = dispatch.getCall(1).args[0];
    expect(action.type).to.equal(CH31_FETCH_FAILED);
    expect(action.error.status).to.equal(418);
  });

  it('empty errors array → CH31_FETCH_FAILED', async () => {
    setFetchJSONFailure(global.fetch.onCall(0), { errors: [] });

    const thunk = fetchCh31Eligibility();
    const dispatch = sinon.spy();

    await thunk(dispatch);

    expect(dispatch.getCall(0).args[0].type).to.equal(CH31_FETCH_STARTED);
    const action = dispatch.getCall(1).args[0];
    expect(action.type).to.equal(CH31_FETCH_FAILED);
    expect(action.error.status).to.equal(null);
  });

  it('no errors key ({} rejection) → CH31_FETCH_FAILED', async () => {
    setFetchJSONFailure(global.fetch.onCall(0), {}); // e.g., bad shape from fetch

    const thunk = fetchCh31Eligibility();
    const dispatch = sinon.spy();

    await thunk(dispatch);

    expect(dispatch.getCall(0).args[0].type).to.equal(CH31_FETCH_STARTED);
    const action = dispatch.getCall(1).args[0];
    expect(action.type).to.equal(CH31_FETCH_FAILED);
    expect(action.error.status).to.equal(null);
  });

  it('no errors key ({} rejection) → CH31_FETCH_FAILED with default "Network error" message', async () => {
    const extractStub = sinon.stub(helpers, 'extractMessages').returns([]);
    setFetchJSONFailure(global.fetch.onCall(0), {});

    const thunk = fetchCh31Eligibility();
    const dispatch = sinon.spy();

    await thunk(dispatch);

    expect(dispatch.getCall(0).args[0].type).to.equal(CH31_FETCH_STARTED);
    const action = dispatch.getCall(1).args[0];
    expect(action.type).to.equal(CH31_FETCH_FAILED);
    expect(action.error.status).to.equal(null);
    expect(action.error.messages[0]).to.equal('Network error');

    extractStub.restore();
  });
});

describe('fetchCh31CaseStatusDetails action', () => {
  beforeEach(setup);
  afterEach(teardown);

  it('dispatches START then SUCCEEDED on success', async () => {
    setFetchJSONResponse(global.fetch.onCall(0), successCaseDetailsPayload);

    const thunk = fetchCh31CaseStatusDetails();
    const dispatch = sinon.spy();

    await thunk(dispatch);

    expect(dispatch.callCount).to.equal(2);
    expect(dispatch.getCall(0).args[0].type).to.equal(
      CH31_CASE_STATUS_DETAILS_FETCH_STARTED,
    );

    const action = dispatch.getCall(1).args[0];
    expect(action.type).to.equal(CH31_CASE_STATUS_DETAILS_FETCH_SUCCEEDED);
    expect(action.payload).to.deep.equal(successCaseDetailsPayload.data);
  });

  it('maps 400 → CH31_CASE_STATUS_DETAILS_ERROR_400_BAD_REQUEST', async () => {
    setFetchJSONFailure(global.fetch.onCall(0), makeError(400));

    const thunk = fetchCh31CaseStatusDetails();
    const dispatch = sinon.spy();

    await thunk(dispatch);

    expect(dispatch.getCall(0).args[0].type).to.equal(
      CH31_CASE_STATUS_DETAILS_FETCH_STARTED,
    );
    const action = dispatch.getCall(1).args[0];
    expect(action.type).to.equal(
      CH31_CASE_STATUS_DETAILS_ERROR_400_BAD_REQUEST,
    );
    expect(action.error.status).to.equal(400);
    expect(action.error.messages).to.be.an('array').that.is.not.empty;
  });

  it('maps 403 → CH31_CASE_STATUS_DETAILS_ERROR_403_FORBIDDEN', async () => {
    setFetchJSONFailure(
      global.fetch.onCall(0),
      makeError(403, { detail: 'Not Authorized' }),
    );

    const thunk = fetchCh31CaseStatusDetails();
    const dispatch = sinon.spy();

    await thunk(dispatch);

    expect(dispatch.getCall(0).args[0].type).to.equal(
      CH31_CASE_STATUS_DETAILS_FETCH_STARTED,
    );
    const action = dispatch.getCall(1).args[0];
    expect(action.type).to.equal(CH31_CASE_STATUS_DETAILS_ERROR_403_FORBIDDEN);
    expect(action.error.status).to.equal(403);
  });

  it('maps 503 → CH31_CASE_STATUS_DETAILS_ERROR_503_UNAVAILABLE', async () => {
    setFetchJSONFailure(
      global.fetch.onCall(0),
      makeError(503, { title: 'Service Unavailable' }),
    );

    const thunk = fetchCh31CaseStatusDetails();
    const dispatch = sinon.spy();

    await thunk(dispatch);

    expect(dispatch.getCall(0).args[0].type).to.equal(
      CH31_CASE_STATUS_DETAILS_FETCH_STARTED,
    );
    const action = dispatch.getCall(1).args[0];
    expect(action.type).to.equal(
      CH31_CASE_STATUS_DETAILS_ERROR_503_UNAVAILABLE,
    );
    expect(action.error.status).to.equal(503);
  });

  it('maps 500/504 → CH31_CASE_STATUS_DETAILS_ERROR_500_SERVER', async () => {
    setFetchJSONFailure(global.fetch.onCall(0), makeError(504));

    const thunk = fetchCh31CaseStatusDetails();
    const dispatch = sinon.spy();

    await thunk(dispatch);

    expect(dispatch.getCall(0).args[0].type).to.equal(
      CH31_CASE_STATUS_DETAILS_FETCH_STARTED,
    );
    const action = dispatch.getCall(1).args[0];
    expect(action.type).to.equal(CH31_CASE_STATUS_DETAILS_ERROR_500_SERVER);
    expect(action.error.status).to.equal(504);
  });

  it('unknown status → CH31_CASE_STATUS_DETAILS_FETCH_FAILED', async () => {
    setFetchJSONFailure(global.fetch.onCall(0), makeError(418));

    const thunk = fetchCh31CaseStatusDetails();
    const dispatch = sinon.spy();

    await thunk(dispatch);

    expect(dispatch.getCall(0).args[0].type).to.equal(
      CH31_CASE_STATUS_DETAILS_FETCH_STARTED,
    );
    const action = dispatch.getCall(1).args[0];
    expect(action.type).to.equal(CH31_CASE_STATUS_DETAILS_FETCH_FAILED);
    expect(action.error.status).to.equal(418);
  });

  it('empty errors array → CH31_CASE_STATUS_DETAILS_FETCH_FAILED', async () => {
    setFetchJSONFailure(global.fetch.onCall(0), { errors: [] });

    const thunk = fetchCh31CaseStatusDetails();
    const dispatch = sinon.spy();

    await thunk(dispatch);

    expect(dispatch.getCall(0).args[0].type).to.equal(
      CH31_CASE_STATUS_DETAILS_FETCH_STARTED,
    );
    const action = dispatch.getCall(1).args[0];
    expect(action.type).to.equal(CH31_CASE_STATUS_DETAILS_FETCH_FAILED);
    expect(action.error.status).to.equal(null);
  });

  it('no errors key ({} rejection) → CH31_CASE_STATUS_DETAILS_FETCH_FAILED', async () => {
    setFetchJSONFailure(global.fetch.onCall(0), {});

    const thunk = fetchCh31CaseStatusDetails();
    const dispatch = sinon.spy();

    await thunk(dispatch);

    expect(dispatch.getCall(0).args[0].type).to.equal(
      CH31_CASE_STATUS_DETAILS_FETCH_STARTED,
    );
    const action = dispatch.getCall(1).args[0];
    expect(action.type).to.equal(CH31_CASE_STATUS_DETAILS_FETCH_FAILED);
    expect(action.error.status).to.equal(null);
  });
  it('no errors key ({} rejection) → CH31_CASE_STATUS_DETAILS_FETCH_FAILED with default "Network error" message', async () => {
    const extractStub = sinon.stub(helpers, 'extractMessages').returns([]);
    setFetchJSONFailure(global.fetch.onCall(0), {});

    const thunk = fetchCh31CaseStatusDetails();
    const dispatch = sinon.spy();

    await thunk(dispatch);

    expect(dispatch.getCall(0).args[0].type).to.equal(
      CH31_CASE_STATUS_DETAILS_FETCH_STARTED,
    );
    const action = dispatch.getCall(1).args[0];
    expect(action.type).to.equal(CH31_CASE_STATUS_DETAILS_FETCH_FAILED);
    expect(action.error.status).to.equal(null);
    expect(action.error.messages[0]).to.equal('Network error');

    extractStub.restore();
  });
});
