import { expect } from 'chai';
import sinon from 'sinon';
import { mockFetch, setFetchJSONResponse } from 'platform/testing/unit/helpers';
import * as mockPersonalInfo from '../../testing/responses';
import { fetchPersonalInformation } from '../../actions';

describe('actions/personalInformation', () => {
  let actionCreator;
  let dispatch;
  let recordEventSpy;
  describe('fetchPersonalInformation', () => {
    beforeEach(() => {
      mockFetch();
      recordEventSpy = sinon.spy();
      setFetchJSONResponse(
        global.fetch.onFirstCall(),
        mockPersonalInfo['GET /v0/user'],
      );
      dispatch = sinon.spy();
    });
    it('redirects when showMebCh33SelfForm is false and showMebEnhancements09 is true', async () => {
      actionCreator = fetchPersonalInformation(false, true, recordEventSpy);
      await actionCreator(dispatch);
      expect(window.location.href).not.to.contain(
        '/education/apply-for-education-benefits/application/1990/',
      );
    });
    it('does not redirect when showMebCh33SelfForm is true and showMebEnhancements09 is true', async () => {
      actionCreator = fetchPersonalInformation(true, true, recordEventSpy);
      await actionCreator(dispatch);
      expect(window.location.href).not.to.contain(
        '/education/apply-for-education-benefits/application/1990/',
      );
    });
  });
});
