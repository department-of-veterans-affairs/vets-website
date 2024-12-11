import { expect } from 'chai';
import { stub } from 'sinon';
import {
  mockFetch,
  resetFetch,
  setFetchJSONFailure,
  setFetchJSONResponse,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import {
  actionStart,
  actionFail,
  actionSuccess,
  makeFetchFormPdfUrl,
} from '../../actions/form-pdf-url';

const MOCK_ID = 'form_id';
const MOCK_GUID = 'mock-guid';
const MOCK_URL = 'http://www.example.submission.pdf';

describe('fetchFormPdfUrl action creator', () => {
  let downloadStub;
  let recordEventStub;
  let dispatchStub;

  beforeEach(() => {
    mockFetch();
    downloadStub = stub();
    recordEventStub = stub();
    dispatchStub = stub();
  });

  afterEach(() => {
    resetFetch();
  });

  it('dispatches appropriate actions on success response', async () => {
    const response = { url: MOCK_URL };
    setFetchJSONResponse(global.fetch.onCall(0), response);
    const fetchFormPdfUrl = makeFetchFormPdfUrl(downloadStub, recordEventStub);
    await fetchFormPdfUrl(MOCK_ID, MOCK_GUID)(dispatchStub);
    const actions = dispatchStub.getCalls().map(c => c.args[0]);
    expect(actions).to.deep.equal([
      actionStart(MOCK_GUID),
      actionSuccess(MOCK_GUID, response),
    ]);
  });

  it('dispatches appropriate actions on failure response', async () => {
    const response = { error: 'bad request' };
    setFetchJSONFailure(global.fetch.onCall(0), response);
    const fetchFormPdfUrl = makeFetchFormPdfUrl(downloadStub, recordEventStub);
    let actions = [];
    try {
      await fetchFormPdfUrl(MOCK_ID, MOCK_GUID)(dispatchStub);
    } catch (e) {
      actions = dispatchStub.getCalls().map(c => c.args[0]);
    }
    expect(actions).to.deep.equal([
      actionStart(MOCK_GUID),
      actionFail(MOCK_GUID, response),
    ]);
  });

  it('fails if success response returns empty url', async () => {
    const response = { url: '' };
    setFetchJSONResponse(global.fetch.onCall(0), response);
    const fetchFormPdfUrl = makeFetchFormPdfUrl(downloadStub, recordEventStub);
    let actions = [];
    try {
      await fetchFormPdfUrl(MOCK_ID, MOCK_GUID)(dispatchStub);
    } catch (e) {
      actions = dispatchStub.getCalls().map(c => c.args[0]);
    }
    expect(actions[1].type).to.equal(actionFail().type);
    expect(actions[1].error).to.be.ok;
  });

  it('attempts to download url on success response', async () => {
    setFetchJSONResponse(global.fetch.onCall(0), { url: MOCK_URL });
    const fetchFormPdfUrl = makeFetchFormPdfUrl(downloadStub, recordEventStub);
    await fetchFormPdfUrl(MOCK_ID, MOCK_GUID)(dispatchStub);
    expect(downloadStub.callCount).to.equal(1);
    expect(downloadStub.firstCall.args[0]).to.equal(MOCK_URL);
  });
});
