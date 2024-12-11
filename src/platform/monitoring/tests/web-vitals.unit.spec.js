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
      event_category: 'Performance',
      event_action: 'CLS',
      event_value: 123,
      event_label: 'v1',
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
      event_category: 'Performance',
      event_action: 'LCP',
      event_value: 2500,
      event_label: 'v2',
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
      event_category: 'Performance',
      event_action: 'TTFB',
      event_value: 100,
      event_label: 'v3',
      app_name: 'testApp',
    });
    delete window.appName;
  });
});
