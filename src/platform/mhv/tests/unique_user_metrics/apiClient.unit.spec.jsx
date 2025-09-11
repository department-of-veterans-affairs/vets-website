import { expect } from 'chai';
import sinon from 'sinon-v20';
import * as Sentry from '@sentry/browser';
import { mockApiRequest, resetFetch } from 'platform/testing/unit/helpers';
import { logUniqueUserMetrics } from '../../unique_user_metrics/apiClient';

describe('logUniqueUserMetrics', () => {
  afterEach(() => {
    sinon.restore();
    resetFetch();
  });

  it('should make API request with correct parameters', async () => {
    const eventNames = ['mhv_test_event'];
    mockApiRequest({
      results: [
        // eslint-disable-next-line camelcase
        { event_name: 'mhv_test_event', status: 'created', new_event: true },
      ],
    });

    logUniqueUserMetrics(eventNames);

    // Wait for the async call to be made
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(global.fetch.calledOnce).to.be.true;

    const requestOptions = global.fetch.firstCall.args[1];
    expect(requestOptions.method).to.equal('POST');
    expect(requestOptions.headers['Content-Type']).to.equal('application/json');

    const requestBody = JSON.parse(requestOptions.body);
    expect(requestBody.event_names).to.deep.equal(eventNames);
  });

  it('should handle multiple event names', async () => {
    const eventNames = ['mhv_test_event_1', 'mhv_test_event_2'];
    mockApiRequest({
      results: [],
    });

    logUniqueUserMetrics(eventNames);

    // Wait for the async call to be made
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(global.fetch.calledOnce).to.be.true;
    const requestBody = JSON.parse(global.fetch.firstCall.args[1].body);
    expect(requestBody.event_names).to.deep.equal(eventNames);
  });

  it('should log warning for invalid input - not an array', () => {
    const sentryCaptureMessageStub = sinon.stub(Sentry, 'captureMessage');

    logUniqueUserMetrics('not_an_array');

    expect(sentryCaptureMessageStub.calledOnce).to.be.true;
    expect(sentryCaptureMessageStub.firstCall.args[0]).to.include(
      'Invalid event names provided',
    );
    expect(sentryCaptureMessageStub.firstCall.args[1]).to.equal('warning');
    // No need to check fetch since no mockApiRequest was called
  });

  it('should log warning for empty array', () => {
    const sentryCaptureMessageStub = sinon.stub(Sentry, 'captureMessage');

    logUniqueUserMetrics([]);

    expect(sentryCaptureMessageStub.calledOnce).to.be.true;
    expect(sentryCaptureMessageStub.firstCall.args[0]).to.include(
      'Invalid event names provided',
    );
    // No need to check fetch since no mockApiRequest was called
  });

  it('should log warning for invalid event names - empty string', () => {
    const sentryCaptureMessageStub = sinon.stub(Sentry, 'captureMessage');

    logUniqueUserMetrics(['']);

    expect(sentryCaptureMessageStub.calledOnce).to.be.true;
    expect(sentryCaptureMessageStub.firstCall.args[0]).to.include(
      'Invalid event names',
    );
    // No need to check fetch since no mockApiRequest was called
  });

  it('should log warning for invalid event names - too long', () => {
    const longEventName = 'a'.repeat(51); // 51 characters, exceeds 50 limit
    const sentryCaptureMessageStub = sinon.stub(Sentry, 'captureMessage');

    logUniqueUserMetrics([longEventName]);

    expect(sentryCaptureMessageStub.calledOnce).to.be.true;
    expect(sentryCaptureMessageStub.firstCall.args[0]).to.include(
      'Invalid event names',
    );
    // No need to check fetch since no mockApiRequest was called
  });

  it('should accept event names at character limit boundary', async () => {
    const maxLengthEvent = 'a'.repeat(50); // Exactly 50 characters
    mockApiRequest({
      results: [],
    });
    const sentryCaptureMessageStub = sinon.stub(Sentry, 'captureMessage');

    logUniqueUserMetrics([maxLengthEvent]);

    // Wait for the async call to be made
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(global.fetch.calledOnce).to.be.true;
    expect(sentryCaptureMessageStub.called).to.be.false;
  });

  it('should handle API request failure', async () => {
    const mockError = new Error('Network error');
    mockApiRequest(mockError, false);
    const sentryCaptureExceptionStub = sinon.stub(Sentry, 'captureException');
    const sentryCaptureMessageStub = sinon.stub(Sentry, 'captureMessage');

    logUniqueUserMetrics(['mhv_test_event']);

    // Wait longer for the promise to reject and error handlers to run
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(sentryCaptureExceptionStub.called).to.be.true;
    expect(sentryCaptureMessageStub.called).to.be.true;

    // Check that at least one message contains 'API request failed'
    const messageCallsWithFailure = sentryCaptureMessageStub
      .getCalls()
      .filter(call => call.args[0].includes('API request failed'));
    expect(messageCallsWithFailure.length).to.be.greaterThan(0);
  });
});
