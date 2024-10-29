import { expect } from 'chai';
import sinon from 'sinon';
import { waitFor } from '@testing-library/react';
import { mockApiRequest } from '~/platform/testing/unit/helpers';
import {
  handleError,
  handleSuccess,
  initiateApiCall,
  fetchMdotData,
} from '../../actions';
import { MDOT_API_STATES } from '../../constants';

describe('MDOT fetch data', () => {
  describe('dispatch values', () => {
    it('handle error', () => {
      const statusCode = '404';
      const errorCode = 'MDOT_INVALID';
      const dispatch = handleError(statusCode, errorCode);
      expect(dispatch.type).to.be.eql(MDOT_API_STATES.ERROR);
      expect(dispatch.statusCode).to.be.eql(statusCode);
      expect(dispatch.errorCode).to.be.eql(errorCode);
    });

    it('handle success', () => {
      const data = 'some data';
      const dispatch = handleSuccess(data);
      expect(dispatch.type).to.be.eql(MDOT_API_STATES.SUCCESS);
      expect(dispatch.statusCode).to.be.eql('200');
      expect(dispatch.data).to.be.eql(data);
    });

    it('initiate API call', () => {
      const dispatch = initiateApiCall();
      expect(dispatch.type).to.be.eql(MDOT_API_STATES.PENDING);
    });
  });

  describe('fetch data', () => {
    const errorResponse = {
      status: 404,
      errors: [
        {
          title: 'Veteran Not Found',
          detail: 'The veteran could not be found',
          code: 'MDOT_invalid',
          source: 'MDOT::Client',
          status: '404',
        },
      ],
    };

    const successResponse = {
      status: 200,
      formData: 'some data',
    };

    it('fetch MDOT data unknown error', async () => {
      const dispatch = sinon.spy();
      mockApiRequest({}, false);
      fetchMdotData()(dispatch);
      await waitFor(() => {
        expect(dispatch.calledOnce).to.be.true;
        const dispatchPendingCall = dispatch.firstCall.args[0];
        expect(dispatchPendingCall.type).to.eql(MDOT_API_STATES.PENDING);
      });
      await waitFor(() => {
        expect(dispatch.calledTwice).to.be.true;
        const dispatchErrorCall = dispatch.secondCall.args[0];
        expect(dispatchErrorCall.type).to.eql(MDOT_API_STATES.ERROR);
        expect(dispatchErrorCall.statusCode).to.eql('500');
        expect(dispatchErrorCall.errorCode).to.eql('MDOT_SERVER_ERROR');
      });
    });

    it('fetch MDOT data known error', async () => {
      const dispatch = sinon.spy();
      mockApiRequest(errorResponse, false);
      fetchMdotData()(dispatch);
      await waitFor(() => {
        expect(dispatch.calledOnce).to.be.true;
      });
      await waitFor(() => {
        expect(dispatch.calledTwice).to.be.true;
        const dispatchErrorCall = dispatch.secondCall.args[0];
        expect(dispatchErrorCall.type).to.eql(MDOT_API_STATES.ERROR);
        // Note: mockApiRequest does not send the same type of error data as a real API call
      });
    });

    it('fetch MDOT data success but with known error', async () => {
      const dispatch = sinon.spy();
      mockApiRequest(errorResponse);
      fetchMdotData()(dispatch);
      await waitFor(() => {
        expect(dispatch.calledOnce).to.be.true;
      });
      await waitFor(() => {
        expect(dispatch.calledTwice).to.be.true;
        const dispatchErrorCall = dispatch.secondCall.args[0];
        expect(dispatchErrorCall.type).to.eql(MDOT_API_STATES.ERROR);
        expect(dispatchErrorCall.statusCode).to.eql('404');
        expect(dispatchErrorCall.errorCode).to.eql(
          errorResponse.errors[0].code,
        );
      });
    });

    it('fetch MDOT data success and no error', async () => {
      const dispatch = sinon.spy();
      mockApiRequest(successResponse);
      fetchMdotData()(dispatch);
      await waitFor(() => {
        expect(dispatch.calledOnce).to.be.true;
      });
      await waitFor(() => {
        expect(dispatch.calledTwice).to.be.true;
        const dispatchErrorCall = dispatch.secondCall.args[0];
        expect(dispatchErrorCall.type).to.eql(MDOT_API_STATES.SUCCESS);
        expect(dispatchErrorCall.statusCode).to.eql('200');
        expect(dispatchErrorCall.data).to.eql(successResponse.formData);
      });
    });
  });
});
