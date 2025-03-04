import { expect } from 'chai';
import sinon from 'sinon';

import { mockFetch, setFetchJSONResponse } from 'platform/testing/unit/helpers';
import * as mockResponse from '../../testing/response';

import {
  fetchClaimStatus,
  MEB_FETCH_CLAIM_STATUS,
  MEB_FETCH_CLAIM_STATUS_SUCCESS,
  TOE_FETCH_CLAIM_STATUS,
  TOE_FETCH_CLAIM_STATUS_SUCCESS,
} from '../../actions';

describe('Render Letters UI', () => {
  let actionCreator;
  let dispatch;
  let recordEventSpy;

  describe('fetchClaimStatus MEB SUCCESS', () => {
    beforeEach(() => {
      mockFetch();
      recordEventSpy = sinon.spy();
      setFetchJSONResponse(
        global.fetch.onFirstCall(),
        mockResponse['GET /meb_api/v0/claim_status?latest=true'],
      );
      actionCreator = fetchClaimStatus('MEB', recordEventSpy);
      dispatch = sinon.spy();
    });

    it('calls fetch to `GET download-letters/letters`', async () => {
      await actionCreator(dispatch);

      expect(dispatch.firstCall.args[0].type).to.equal(MEB_FETCH_CLAIM_STATUS);
      expect(dispatch.secondCall.args[0].type).to.equal(
        MEB_FETCH_CLAIM_STATUS_SUCCESS,
      );
      expect(dispatch.secondCall.args[0].response.claimStatus).to.equal(
        mockResponse['GET /meb_api/v0/claim_status?latest=true'].claimStatus,
      );
      expect(
        global.fetch.firstCall.args[0].endsWith(
          '/meb_api/v0/claim_status?latest=true',
        ),
      ).to.be.true;
    });
  });

  describe('fetchClaimStatus TOE SUCCESS', () => {
    beforeEach(() => {
      mockFetch();
      recordEventSpy = sinon.spy();
      setFetchJSONResponse(
        global.fetch.onFirstCall(),
        mockResponse['GET /meb_api/v0/forms_claim_status?latest=true'],
      );
      actionCreator = fetchClaimStatus('TOE', recordEventSpy);
      dispatch = sinon.spy();
    });

    it('calls fetch to `GET download-letters/letters`', async () => {
      await actionCreator(dispatch);
      expect(dispatch.firstCall.args[0].type).to.equal(TOE_FETCH_CLAIM_STATUS);
      expect(dispatch.secondCall.args[0].type).to.equal(
        TOE_FETCH_CLAIM_STATUS_SUCCESS,
      );
      expect(dispatch.secondCall.args[0].response.claimStatus).to.equal(
        mockResponse['GET /meb_api/v0/forms_claim_status?latest=true']
          .claimStatus,
      );
      expect(
        global.fetch.firstCall.args[0].endsWith(
          '/meb_api/v0/forms_claim_status?latest=true',
        ),
      ).to.be.true;
    });
  });
});
