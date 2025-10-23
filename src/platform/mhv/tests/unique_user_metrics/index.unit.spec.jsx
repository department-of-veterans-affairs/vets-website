import { expect } from 'chai';
import sinon from 'sinon-v20';
import * as Sentry from '@sentry/browser';
import {
  logUniqueUserMetricsEvents,
  EVENT_REGISTRY,
} from '../../unique_user_metrics/index';
import * as apiClient from '../../unique_user_metrics/apiClient';

describe('logUniqueUserMetricsEvents', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('valid event value handling', () => {
    it('should process single valid event value', () => {
      const logUniqueUserMetricsStub = sinon.stub(
        apiClient,
        'logUniqueUserMetrics',
      );

      const firstEventValue = Object.values(EVENT_REGISTRY)[0];
      logUniqueUserMetricsEvents(firstEventValue);

      expect(logUniqueUserMetricsStub.calledOnce).to.be.true;
      expect(logUniqueUserMetricsStub.firstCall.args[0]).to.be.an('array');
      expect(logUniqueUserMetricsStub.firstCall.args[0]).to.include(
        firstEventValue,
      );
    });

    it('should process multiple valid event values using variable arguments', () => {
      const logUniqueUserMetricsStub = sinon.stub(
        apiClient,
        'logUniqueUserMetrics',
      );

      const allValues = Object.values(EVENT_REGISTRY);
      const firstValue = allValues[0];
      const secondValue = allValues[1];

      logUniqueUserMetricsEvents(firstValue, secondValue);

      expect(logUniqueUserMetricsStub.calledOnce).to.be.true;
      expect(logUniqueUserMetricsStub.firstCall.args[0]).to.be.an('array');
      expect(logUniqueUserMetricsStub.firstCall.args[0]).to.include(firstValue);
      expect(logUniqueUserMetricsStub.firstCall.args[0]).to.include(
        secondValue,
      );
      expect(logUniqueUserMetricsStub.firstCall.args[0]).to.have.length(2);
    });

    it('should handle all registry event values', () => {
      const logUniqueUserMetricsStub = sinon.stub(
        apiClient,
        'logUniqueUserMetrics',
      );

      const allEventValues = Object.values(EVENT_REGISTRY);
      logUniqueUserMetricsEvents(...allEventValues);

      expect(logUniqueUserMetricsStub.calledOnce).to.be.true;
      expect(logUniqueUserMetricsStub.firstCall.args[0]).to.deep.equal(
        allEventValues,
      );
    });
  });

  describe('invalid event value handling', () => {
    it('should log warning for invalid event value', () => {
      const sentryCaptureMessageStub = sinon.stub(Sentry, 'captureMessage');
      const logUniqueUserMetricsStub = sinon.stub(
        apiClient,
        'logUniqueUserMetrics',
      );

      logUniqueUserMetricsEvents('invalid_event_name');

      expect(sentryCaptureMessageStub.calledOnce).to.be.true;
      expect(sentryCaptureMessageStub.firstCall.args[0]).to.include(
        'Invalid event values provided',
      );
      expect(sentryCaptureMessageStub.firstCall.args[1]).to.equal('warning');
      expect(logUniqueUserMetricsStub.called).to.be.false;
    });

    it('should log warning for multiple invalid event values', () => {
      const sentryCaptureMessageStub = sinon.stub(Sentry, 'captureMessage');
      const logUniqueUserMetricsStub = sinon.stub(
        apiClient,
        'logUniqueUserMetrics',
      );

      logUniqueUserMetricsEvents('invalid_1', 'invalid_2');

      expect(sentryCaptureMessageStub.calledOnce).to.be.true;
      expect(sentryCaptureMessageStub.firstCall.args[0]).to.include(
        'Invalid event values provided',
      );
      expect(logUniqueUserMetricsStub.called).to.be.false;
    });

    it('should log warning for mixed valid and invalid event values', () => {
      const sentryCaptureMessageStub = sinon.stub(Sentry, 'captureMessage');
      const logUniqueUserMetricsStub = sinon.stub(
        apiClient,
        'logUniqueUserMetrics',
      );

      const validEventValue = Object.values(EVENT_REGISTRY)[0];
      logUniqueUserMetricsEvents(validEventValue, 'invalid_event');

      expect(sentryCaptureMessageStub.calledOnce).to.be.true;
      expect(sentryCaptureMessageStub.firstCall.args[0]).to.include(
        'Invalid event values provided',
      );
      expect(logUniqueUserMetricsStub.called).to.be.false;
    });
  });

  describe('edge cases', () => {
    it('should handle no arguments', () => {
      const sentryCaptureMessageStub = sinon.stub(Sentry, 'captureMessage');
      const logUniqueUserMetricsStub = sinon.stub(
        apiClient,
        'logUniqueUserMetrics',
      );

      logUniqueUserMetricsEvents();

      expect(sentryCaptureMessageStub.calledOnce).to.be.true;
      expect(sentryCaptureMessageStub.firstCall.args[0]).to.include(
        'No valid event names to log',
      );
      expect(logUniqueUserMetricsStub.called).to.be.false;
    });
  });

  describe('EVENT_REGISTRY export', () => {
    it('should export EVENT_REGISTRY', () => {
      expect(EVENT_REGISTRY).to.be.an('object');
      expect(Object.keys(EVENT_REGISTRY)).to.have.length.greaterThan(0);
    });

    it('should have all registry values as strings', () => {
      Object.values(EVENT_REGISTRY).forEach(eventValue => {
        expect(eventValue).to.be.a('string');
        expect(eventValue).to.include('mhv_');
      });
    });
  });
});
