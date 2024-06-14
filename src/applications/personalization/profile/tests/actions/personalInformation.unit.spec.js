import { expect } from 'chai';
import sinon from 'sinon';

import * as mockPersonalInfo from '@@profile/mocks/endpoints/personal-information';
import * as vapSvcActions from '@@vap-svc/actions';

import { mockFetch, setFetchJSONResponse } from 'platform/testing/unit/helpers';

import * as personalInformationActions from '@@vap-svc/actions/personalInformation';

// TODO: use setFetchJSONFailure to test network failure

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
        mockPersonalInfo.basicUserPersonalInfo,
      );
      actionCreator = personalInformationActions.fetchPersonalInformation(
        false,
        recordEventSpy,
      );

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

    it('dispatches FETCH_PERSONAL_INFORMATION', async () => {
      await actionCreator(dispatch);

      expect(dispatch.firstCall.args[0].type).to.be.equal(
        personalInformationActions.FETCH_PERSONAL_INFORMATION,
      );
    });

    it('dispatches FETCH_PERSONAL_INFORMATION_SUCCESS and passes along the data from endpoint', async () => {
      await actionCreator(dispatch);

      expect(dispatch.secondCall.args[0].type).to.be.equal(
        personalInformationActions.FETCH_PERSONAL_INFORMATION_SUCCESS,
      );

      expect(dispatch.secondCall.args[0].personalInformation).to.deep.equal(
        mockPersonalInfo.basicUserPersonalInfo.data.attributes,
      );
    });

    it('reports success to platform/monitoring/recordEvent', async () => {
      await actionCreator(dispatch);

      // records event for api call start
      expect(recordEventSpy.firstCall.args[0].event).to.equal('api_call');
      expect(recordEventSpy.firstCall.args[0]['api-status']).to.equal(
        'started',
      );

      // records event for api call failure
      expect(recordEventSpy.secondCall.args[0].event).to.equal('api_call');
      expect(recordEventSpy.secondCall.args[0]['api-status']).to.equal(
        'successful',
      );
    });
  });

  describe('fetchPersonalInformation FAILURE', () => {
    beforeEach(() => {
      mockFetch();

      recordEventSpy = sinon.spy();

      setFetchJSONResponse(
        global.fetch.onFirstCall(),
        mockPersonalInfo.userPersonalInfoFailure,
      );
      actionCreator = personalInformationActions.fetchPersonalInformation(
        false,
        recordEventSpy,
      );

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

    it('dispatches FETCH_PERSONAL_INFORMATION', async () => {
      await actionCreator(dispatch);

      expect(dispatch.firstCall.args[0].type).to.be.equal(
        personalInformationActions.FETCH_PERSONAL_INFORMATION,
      );
    });

    it('dispatches FETCH_PERSONAL_INFORMATION_FAILED', async () => {
      await actionCreator(dispatch);

      expect(dispatch.secondCall.args[0].type).to.be.equal(
        personalInformationActions.FETCH_PERSONAL_INFORMATION_FAILED,
      );
    });

    it('reports success to platform/monitoring/recordEvent', async () => {
      await actionCreator(dispatch);

      // records event for api call start
      expect(recordEventSpy.firstCall.args[0].event).to.equal('api_call');
      expect(recordEventSpy.firstCall.args[0]['api-status']).to.equal(
        'started',
      );

      // records event for api call failure
      expect(recordEventSpy.secondCall.args[0].event).to.equal('api_call');
      expect(recordEventSpy.secondCall.args[0]['api-status']).to.equal(
        'failed',
      );
    });
  });

  describe('createPersonalInfoUpdate action', () => {
    describe('when PUT request is a SUCCESS', () => {
      beforeEach(() => {
        mockFetch();

        recordEventSpy = sinon.spy();

        setFetchJSONResponse(
          global.fetch.onFirstCall(),
          mockPersonalInfo.createPutPreferredNameSuccess('George'),
        );

        actionCreator = personalInformationActions.createPersonalInfoUpdate({
          route: 'v0/profile/preferred_names',
          method: 'PUT',
          fieldName: 'preferredName',
          payload: { text: 'George' },
          analyticsSectionName: 'personal-information-preferred-name',
          value: { preferredName: 'George' },
          recordAnalyticsEvent: recordEventSpy,
        });
        dispatch = sinon.spy();
      });

      it('calls fetch to `PUT profile/preferred_names`', async () => {
        await actionCreator(dispatch);

        expect(global.fetch.firstCall.args[1].method).to.equal('PUT');

        expect(
          global.fetch.firstCall.args[0].endsWith('/profile/preferred_names'),
        ).to.be.true;
      });

      it('dispatches VAP_SERVICE_TRANSACTION_REQUESTED', async () => {
        await actionCreator(dispatch);

        expect(dispatch.firstCall.args[0].type).to.be.equal(
          vapSvcActions.VAP_SERVICE_TRANSACTION_REQUESTED,
        );

        expect(dispatch.firstCall.args[0].fieldName).to.equal('preferredName');

        expect(dispatch.firstCall.args[0].method).to.equal('PUT');
      });

      it('dispatches VAP_SERVICE_TRANSACTION_REQUEST_SUCCEEDED and passes along the data from endpoint and field name', async () => {
        await actionCreator(dispatch);

        expect(dispatch.secondCall.args[0].type).to.be.equal(
          vapSvcActions.VAP_SERVICE_TRANSACTION_REQUEST_SUCCEEDED,
        );

        expect(dispatch.secondCall.args[0].fieldName).to.equal('preferredName');
      });

      it('dispatches UPDATE_PERSONAL_INFORMATION_FIELD and passes fieldName and value', async () => {
        await actionCreator(dispatch);

        expect(dispatch.thirdCall.args[0].type).to.equal(
          personalInformationActions.UPDATE_PERSONAL_INFORMATION_FIELD,
        );

        expect(dispatch.thirdCall.args[0].fieldName).to.equal(`preferredName`);

        expect(dispatch.thirdCall.args[0].value).to.deep.equal({
          preferredName: 'George',
        });
      });

      it('dispatches VAP_SERVICE_TRANSACTION_CLEARED and passes transaction with created transactionId', async () => {
        await actionCreator(dispatch);

        const expected = mockPersonalInfo.createPutPreferredNameSuccess(
          'George',
        );

        expect(dispatch.lastCall.args[0].type).to.equal(
          vapSvcActions.VAP_SERVICE_TRANSACTION_CLEARED,
        );

        expect(
          dispatch.lastCall.args[0].transaction.data.attributes.transactionId,
        ).to.equal(
          `preferredName_${expected.attributes.preferredName.sourceDate}`,
        );
      });

      it('reports success to platform/monitoring/recordEvent', async () => {
        await actionCreator(dispatch);

        // records event for api call start
        expect(recordEventSpy.firstCall.args[0].event).to.equal('api_call');
        expect(recordEventSpy.firstCall.args[0]['api-status']).to.equal(
          'started',
        );

        // records event for api call failure
        expect(recordEventSpy.secondCall.args[0].event).to.equal('api_call');
        expect(recordEventSpy.secondCall.args[0]['api-status']).to.equal(
          'successful',
        );
      });
    });

    describe('when PUT request is a FAILURE', () => {
      beforeEach(() => {
        mockFetch();

        recordEventSpy = sinon.spy();

        setFetchJSONResponse(
          global.fetch.onFirstCall(),
          mockPersonalInfo.putBadRequestFailure400,
        );

        actionCreator = personalInformationActions.createPersonalInfoUpdate({
          route: 'v0/profile/preferred_names',
          method: 'PUT',
          fieldName: 'preferredName',
          payload: { text: 'George' },
          analyticsSectionName: 'personal-information-preferred-name',
          value: { preferredName: 'George' },
          recordAnalyticsEvent: recordEventSpy,
        });
        dispatch = sinon.spy();
      });

      it('calls fetch to `PUT profile/preferred_names`', async () => {
        await actionCreator(dispatch);

        expect(global.fetch.firstCall.args[1].method).to.equal('PUT');

        expect(
          global.fetch.firstCall.args[0].endsWith('/profile/preferred_names'),
        ).to.be.true;
      });

      it('dispatches VAP_SERVICE_TRANSACTION_REQUESTED', async () => {
        await actionCreator(dispatch);

        expect(dispatch.firstCall.args[0].type).to.be.equal(
          vapSvcActions.VAP_SERVICE_TRANSACTION_REQUESTED,
        );

        expect(dispatch.firstCall.args[0].fieldName).to.equal('preferredName');

        expect(dispatch.firstCall.args[0].method).to.equal('PUT');
      });

      it('dispatches VAP_SERVICE_TRANSACTION_REQUEST_FAILED and passes error and field name', async () => {
        await actionCreator(dispatch);

        expect(dispatch.secondCall.args[0].type).to.be.equal(
          vapSvcActions.VAP_SERVICE_TRANSACTION_REQUEST_FAILED,
        );

        expect(dispatch.secondCall.args[0].error.errors).to.deep.equal(
          mockPersonalInfo.putBadRequestFailure400.errors,
        );

        expect(dispatch.secondCall.args[0].fieldName).to.equal('preferredName');
      });

      it('reports failure to platform/monitoring/recordEvent', async () => {
        await actionCreator(dispatch);

        // records event for api call start
        expect(recordEventSpy.firstCall.args[0].event).to.equal('api_call');
        expect(recordEventSpy.firstCall.args[0]['api-status']).to.equal(
          'started',
        );

        // records event for api call failure
        expect(recordEventSpy.secondCall.args[0].event).to.equal('api_call');
        expect(recordEventSpy.secondCall.args[0]['api-status']).to.equal(
          'failed',
        );
        expect(recordEventSpy.secondCall.args[0]['error-key']).to.equal(
          'personal-information-preferred-name-EVSS400-Bad Request-Received a bad request response from the upstream server',
        );
      });
    });
  });
});
