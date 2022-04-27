import { expect } from 'chai';
import sinon from 'sinon';

import * as mockPersonalInfo from '@@profile/mocks/personalInformation';
import * as vapSvcActions from '@@vap-svc/actions';

import { mockFetch, setFetchJSONResponse } from 'platform/testing/unit/helpers';

import * as personalInformationActions from '../../actions/personalInformation';

// TODO: use setFetchJSONFailure to test network failure

describe('actions/personalInformation', () => {
  let actionCreator;
  let dispatch;
  let recordEventSpy;

  describe('fetchPersonalInformation SUCCESS', () => {
    beforeEach(() => {
      mockFetch();

      setFetchJSONResponse(
        global.fetch.onFirstCall(),
        mockPersonalInfo.basicUserPersonalInfoResponse,
      );
      actionCreator = personalInformationActions.fetchPersonalInformation(
        false,
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
        mockPersonalInfo.basicUserPersonalInfoResponse.data.attributes,
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
          mockPersonalInfo.makePutPreferredNameSuccessResponse('George'),
        );

        actionCreator = personalInformationActions.createPersonalInfoUpdate(
          'v0/profile/preferred_names',
          'PUT',
          'preferredName',
          { text: 'George' },
          'personal-information-preferred-name',
          recordEventSpy,
        );
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

      it('dispatches VAP_SERVICE_TRANSACTION_CLEARED and passes transaction with created transactionId', async () => {
        await actionCreator(dispatch);

        const expected = mockPersonalInfo.makePutPreferredNameSuccessResponse(
          'George',
        );

        expect(dispatch.thirdCall.args[0].type).to.equal(
          vapSvcActions.VAP_SERVICE_TRANSACTION_CLEARED,
        );

        expect(
          dispatch.thirdCall.args[0].transaction.data.attributes.transactionId,
        ).to.equal(`preferredName_${expected.source_date}`);
      });

      // TODO: add test for the dispatching fetchPersonalInformation at end of PUT success
    });

    describe('when PUT request is a FAILURE', () => {
      beforeEach(() => {
        mockFetch();

        recordEventSpy = sinon.spy();

        setFetchJSONResponse(
          global.fetch.onFirstCall(),
          mockPersonalInfo.putPreferredNameFailureResponse,
        );

        actionCreator = personalInformationActions.createPersonalInfoUpdate(
          'v0/profile/preferred_names',
          'PUT',
          'preferredName',
          { text: 'George' },
          'personal-information-preferred-name',
          recordEventSpy,
        );
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
          mockPersonalInfo.putPreferredNameFailureResponse.errors,
        );

        expect(dispatch.secondCall.args[0].fieldName).to.equal('preferredName');
      });

      it('reports failure to platform/monitoring/recordEvent', async () => {
        await actionCreator(dispatch);

        expect(recordEventSpy.firstCall.args[0].event).to.equal(
          'profile-edit-failure',
        );

        expect(recordEventSpy.firstCall.args[0]['profile-action']).to.equal(
          'save-failure',
        );

        expect(recordEventSpy.firstCall.args[0]['profile-section']).to.equal(
          'personal-information-preferred-name',
        );

        // TODO add expect for error-key once that is determined by analytics
      });
    });
  });
});
