import { expect } from 'chai';
import sinon from 'sinon';

// import * as vapSvcActions from '@@vap-svc/actions';

import { mockFetch, setFetchJSONResponse } from 'platform/testing/unit/helpers';
import * as mockPersonalInfo from '../../testing/responses';

import { fetchPersonalInformation } from '../../actions';

describe('actions/personalInformation', () => {
  let actionCreator;
  let dispatch;
  let recordEventSpy;

  describe('fetchPersonalInformation SUCCESS', () => {
    beforeEach(() => {
      mockFetch();

      recordEventSpy = sinon.spy();

      setFetchJSONResponse(
        global.fetch.onFirstCall(),
        mockPersonalInfo['GET /v0/user'],
      );
      actionCreator = fetchPersonalInformation(false, recordEventSpy);

      dispatch = sinon.spy();
    });

    it('calls fetch to `GET profile/personal_information`', async () => {
      await actionCreator(dispatch);

      expect(global.fetch.firstCall.args[1].method).to.equal('GET');

      expect(
        global.fetch.firstCall.args[0].endsWith(
          '/profile/personal_information',
        ),
      ).to.be.true;
    });
  });
});
