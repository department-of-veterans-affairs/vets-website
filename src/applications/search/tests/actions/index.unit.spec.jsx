import { expect } from 'chai';
import sinon from 'sinon';
import * as apiModule from 'platform/utilities/api';
import * as recordEventModule from 'platform/monitoring/record-event';
import * as redactPiiModule from 'platform/utilities/data/redactPii';
import { fetchSearchResults } from '../../actions/index';

describe('search actions', () => {
  let sandbox;
  let dispatch;
  let apiRequestStub;
  let recordEventStub;
  let redactPiiStub;
  let clearGADataStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    dispatch = sandbox.spy();
    apiRequestStub = sandbox.stub(apiModule, 'apiRequest');
    recordEventStub = sandbox.stub(recordEventModule, 'default');
    redactPiiStub = sandbox.stub(redactPiiModule, 'default');
    clearGADataStub = sandbox.spy();
    redactPiiStub.returns('[REDACTED]');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('fetchSearchResults', () => {
    it('should call redactPii with userInput when trackEvent is enabled', async () => {
      const query = 'test query';
      const userInput = 'john@example.com';
      const options = {
        trackEvent: true,
        eventName: 'search-event',
        path: '/search',
        userInput,
      };
      const response = {
        data: {
          attributes: {
            body: [],
          },
        },
        meta: {
          pagination: {
            totalEntries: 0,
            totalPages: 0,
          },
        },
      };

      apiRequestStub.resolves(response);

      await fetchSearchResults(query, null, options, clearGADataStub)(dispatch);

      expect(redactPiiStub.calledOnce).to.be.true;
      expect(redactPiiStub.calledWith(userInput)).to.be.true;
      expect(recordEventStub.calledOnce).to.be.true;
      expect(recordEventStub.firstCall.args[0]['search-query']).to.equal(
        '[REDACTED]',
      );
    });

    it('should not call redactPii when trackEvent is not enabled', async () => {
      const query = 'test query';
      const options = {
        trackEvent: false,
      };
      const response = {
        data: {
          attributes: {
            body: [],
          },
        },
        meta: {
          pagination: {
            totalEntries: 0,
            totalPages: 0,
          },
        },
      };

      apiRequestStub.resolves(response);

      await fetchSearchResults(query, null, options, clearGADataStub)(dispatch);

      expect(redactPiiStub.called).to.be.false;
      expect(recordEventStub.called).to.be.false;
    });

    it('should not call redactPii when options is undefined', async () => {
      const query = 'test query';
      const response = {
        data: {
          attributes: {
            body: [],
          },
        },
        meta: {
          pagination: {
            totalEntries: 0,
            totalPages: 0,
          },
        },
      };

      apiRequestStub.resolves(response);

      await fetchSearchResults(query, null, undefined, clearGADataStub)(
        dispatch,
      );

      expect(redactPiiStub.called).to.be.false;
      expect(recordEventStub.called).to.be.false;
    });

    it('should handle userInput with PII and redact it before recording event', async () => {
      const query = 'test query';
      const userInputWithPii = 'Contact me at 555-123-4567 or john@example.com';
      const options = {
        trackEvent: true,
        eventName: 'search-event',
        path: '/search',
        userInput: userInputWithPii,
      };
      const response = {
        data: {
          attributes: {
            body: [],
          },
        },
        meta: {
          pagination: {
            totalEntries: 0,
            totalPages: 0,
          },
        },
      };

      apiRequestStub.resolves(response);

      await fetchSearchResults(query, null, options, clearGADataStub)(dispatch);

      expect(redactPiiStub.calledOnce).to.be.true;
      expect(redactPiiStub.calledWith(userInputWithPii)).to.be.true;
      expect(recordEventStub.firstCall.args[0]['search-query']).to.equal(
        '[REDACTED]',
      );
    });
  });
});
