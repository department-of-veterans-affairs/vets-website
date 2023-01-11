import { expect } from 'chai';
import sinon from 'sinon';

import { mockFetch, setFetchJSONResponse } from 'platform/testing/unit/helpers';
import * as mockPersonalInfo from '../../testing/response';

import { fetchClaimStatus } from '../../actions';

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
        mockPersonalInfo['GET /meb_api/v0/claim_status?latest=true'],
      );
      actionCreator = fetchClaimStatus('MEB', recordEventSpy);
      dispatch = sinon.spy();
    });

    it('calls fetch to `GET download-letters/letters`', async () => {
      await actionCreator(dispatch);
      expect(global.fetch.firstCall.args[1].method).to.equal('GET');
      expect(
        global.fetch.firstCall.args[0].endsWith('/download-letters/letters'),
      ).to.not.be.true;
    });
  });

  describe('fetchClaimStatus TOE SUCCESS', () => {
    beforeEach(() => {
      mockFetch();
      recordEventSpy = sinon.spy();
      setFetchJSONResponse(
        global.fetch.onFirstCall(),
        mockPersonalInfo['GET /meb_api/v0/forms_claim_status?latest=true'],
      );
      actionCreator = fetchClaimStatus('TOE', recordEventSpy);
      dispatch = sinon.spy();
    });

    it('calls fetch to `GET download-letters/letters`', async () => {
      await actionCreator(dispatch);
      expect(global.fetch.firstCall.args[1].method).to.equal('GET');
      expect(
        global.fetch.firstCall.args[0].endsWith('/download-letters/letters'),
      ).to.not.be.true;
    });
  });
});
