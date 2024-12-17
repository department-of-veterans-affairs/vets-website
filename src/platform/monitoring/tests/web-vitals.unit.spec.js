/* eslint-disable camelcase */
import { expect } from 'chai';
import sinon from 'sinon';
import * as recordEventModule from 'platform/monitoring/record-event';
import { recordWebVitalsEvent } from '../web-vitals';

describe('recordWebVitalsEvent', () => {
  let recordEventStub;

  beforeEach(() => {
    recordEventStub = sinon.stub(recordEventModule, 'default');
  });

  afterEach(() => {
    recordEventStub.restore();
  });

  it('should record a web vitals event with correct properties for CLS', () => {
    const event = {
      name: 'CLS',
      delta: 0.123,
      id: 'v1',
    };
    recordWebVitalsEvent(event);
    expect(recordEventStub.calledOnce).to.be.true;
    const recordedEvent = recordEventStub.getCall(0).args[0];
    expect(recordedEvent).to.deep.equal({
      event: 'web_vitals',
      web_vital_type: 'CLS',
      latency_ms: 123,
      web_vital_id: 'v1',
      app_name: 'unknown',
    });
  });

  it('should record a web vitals event with correct properties for non-CLS events', () => {
    const event = {
      name: 'LCP',
      delta: 2500,
      id: 'v2',
    };
    recordWebVitalsEvent(event);
    expect(recordEventStub.calledOnce).to.be.true;
    const recordedEvent = recordEventStub.getCall(0).args[0];
    expect(recordedEvent).to.deep.equal({
      event: 'web_vitals',
      web_vital_type: 'LCP',
      latency_ms: 2500,
      web_vital_id: 'v2',
      app_name: 'unknown',
    });
  });

  it('should use window.appName if available', () => {
    window.appName = 'testApp';
    const event = {
      name: 'TTFB',
      delta: 100,
      id: 'v3',
    };
    recordWebVitalsEvent(event);
    expect(recordEventStub.calledOnce).to.be.true;
    const recordedEvent = recordEventStub.getCall(0).args[0];
    expect(recordedEvent).to.deep.equal({
      event: 'web_vitals',
      web_vital_type: 'TTFB',
      latency_ms: 100,
      web_vital_id: 'v3',
      app_name: 'testApp',
    });
    delete window.appName;
  });
});
