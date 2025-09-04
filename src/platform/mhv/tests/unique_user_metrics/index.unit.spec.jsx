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

  describe('valid event key handling', () => {
    it('should process single valid event key', () => {
      const logUniqueUserMetricsStub = sinon.stub(
        apiClient,
        'logUniqueUserMetrics',
      );

      const firstKey = Object.keys(EVENT_REGISTRY)[0];
      logUniqueUserMetricsEvents(firstKey);

      expect(logUniqueUserMetricsStub.calledOnce).to.be.true;
      expect(logUniqueUserMetricsStub.firstCall.args[0]).to.be.an('array');
      expect(
        logUniqueUserMetricsStub.firstCall.args[0],
      ).to.have.length.greaterThan(0);
    });

    it('should process multiple valid event keys', () => {
      const logUniqueUserMetricsStub = sinon.stub(
        apiClient,
        'logUniqueUserMetrics',
      );

      const allKeys = Object.keys(EVENT_REGISTRY);
      const testKeys = [allKeys[0], allKeys[1]];
      logUniqueUserMetricsEvents(testKeys);

      expect(logUniqueUserMetricsStub.calledOnce).to.be.true;
      expect(logUniqueUserMetricsStub.firstCall.args[0]).to.be.an('array');
      expect(logUniqueUserMetricsStub.firstCall.args[0]).to.have.length(2);
    });

    it('should handle all registry event keys', () => {
      const logUniqueUserMetricsStub = sinon.stub(
        apiClient,
        'logUniqueUserMetrics',
      );

      const allEventKeys = Object.keys(EVENT_REGISTRY);
      logUniqueUserMetricsEvents(allEventKeys);

      expect(logUniqueUserMetricsStub.calledOnce).to.be.true;

      // Verify all event names are flattened correctly
      const expectedEventNames = Object.values(EVENT_REGISTRY).flat();
      expect(logUniqueUserMetricsStub.firstCall.args[0]).to.deep.equal(
        expectedEventNames,
      );
    });
  });

  describe('invalid event key handling', () => {
    it('should log warning for invalid event key', () => {
      const sentryCaptureMessageStub = sinon.stub(Sentry, 'captureMessage');
      const logUniqueUserMetricsStub = sinon.stub(
        apiClient,
        'logUniqueUserMetrics',
      );

      logUniqueUserMetricsEvents('INVALID_EVENT_KEY');

      expect(sentryCaptureMessageStub.calledOnce).to.be.true;
      expect(sentryCaptureMessageStub.firstCall.args[0]).to.include(
        'Invalid event keys provided',
      );
      expect(sentryCaptureMessageStub.firstCall.args[0]).to.include(
        'INVALID_EVENT_KEY',
      );
      expect(sentryCaptureMessageStub.firstCall.args[1]).to.equal('warning');
      expect(logUniqueUserMetricsStub.called).to.be.false;
    });

    it('should log warning for multiple invalid event keys', () => {
      const sentryCaptureMessageStub = sinon.stub(Sentry, 'captureMessage');
      const logUniqueUserMetricsStub = sinon.stub(
        apiClient,
        'logUniqueUserMetrics',
      );

      logUniqueUserMetricsEvents(['INVALID_1', 'INVALID_2']);

      expect(sentryCaptureMessageStub.calledOnce).to.be.true;
      expect(sentryCaptureMessageStub.firstCall.args[0]).to.include(
        'INVALID_1, INVALID_2',
      );
      expect(logUniqueUserMetricsStub.called).to.be.false;
    });

    it('should log warning for mixed valid and invalid event keys', () => {
      const sentryCaptureMessageStub = sinon.stub(Sentry, 'captureMessage');
      const logUniqueUserMetricsStub = sinon.stub(
        apiClient,
        'logUniqueUserMetrics',
      );

      const validKey = Object.keys(EVENT_REGISTRY)[0];
      logUniqueUserMetricsEvents([
        validKey,
        'INVALID_EVENT',
        Object.keys(EVENT_REGISTRY)[1],
      ]);

      expect(sentryCaptureMessageStub.calledOnce).to.be.true;
      expect(sentryCaptureMessageStub.firstCall.args[0]).to.include(
        'INVALID_EVENT',
      );
      expect(logUniqueUserMetricsStub.called).to.be.false;
    });

    it('should handle empty string as invalid', () => {
      const sentryCaptureMessageStub = sinon.stub(Sentry, 'captureMessage');
      const logUniqueUserMetricsStub = sinon.stub(
        apiClient,
        'logUniqueUserMetrics',
      );

      logUniqueUserMetricsEvents('');

      expect(sentryCaptureMessageStub.calledOnce).to.be.true;
      expect(logUniqueUserMetricsStub.called).to.be.false;
    });
  });

  describe('input normalization', () => {
    it('should normalize single string to array', () => {
      const logUniqueUserMetricsStub = sinon.stub(
        apiClient,
        'logUniqueUserMetrics',
      );

      const validKey = Object.keys(EVENT_REGISTRY)[0];
      logUniqueUserMetricsEvents(validKey);

      expect(logUniqueUserMetricsStub.calledOnce).to.be.true;
      expect(logUniqueUserMetricsStub.firstCall.args[0]).to.be.an('array');
    });

    it('should handle array input directly', () => {
      const logUniqueUserMetricsStub = sinon.stub(
        apiClient,
        'logUniqueUserMetrics',
      );

      const validKey = Object.keys(EVENT_REGISTRY)[0];
      logUniqueUserMetricsEvents([validKey]);

      expect(logUniqueUserMetricsStub.calledOnce).to.be.true;
      expect(logUniqueUserMetricsStub.firstCall.args[0]).to.be.an('array');
    });

    it('should handle empty array', () => {
      const sentryCaptureMessageStub = sinon.stub(Sentry, 'captureMessage');
      const logUniqueUserMetricsStub = sinon.stub(
        apiClient,
        'logUniqueUserMetrics',
      );

      logUniqueUserMetricsEvents([]);

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
      expect(Object.keys(EVENT_REGISTRY).length).to.be.greaterThan(0);
    });

    it('should have consistent registry structure', () => {
      Object.entries(EVENT_REGISTRY).forEach(([key, value]) => {
        expect(key).to.be.a('string');
        expect(value).to.be.an('array');
        expect(value.length).to.be.greaterThan(0);
        value.forEach(eventName => {
          expect(eventName).to.be.a('string');
        });
      });
    });
  });
});
