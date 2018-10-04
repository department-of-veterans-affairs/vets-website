import { expect } from 'chai';
import sinon from 'sinon';
import * as metrics from '../metrics';
import { navEntry } from './exampleNavigationTimingEntry.js';

describe('metrics', () => {
  const oldFormData = global.FormData;
  const oldNavigator = global.navigator;
  const oldPerformance = global.performance;
  const oldPerformanceObserver = global.PerformanceObserver;
  const oldWindow = global.window;

  beforeEach(() => {
    function FormDataMock() {
      this.append = sinon.spy();
      this.get = sinon.mock();
    }
    global.FormData = FormDataMock;

    const byTypeStub = sinon
      .stub()
      .withArgs('navigation')
      .returns([navEntry]);

    global.performance.getEntriesByName = byTypeStub;
    global.performance.getEntriesByName = sinon.stub();

    global.window = { location: { pathname: '/' } };
  });

  afterEach(() => {
    global.FormData = oldFormData;
    global.navigator = oldNavigator;
    global.performance = oldPerformance;
    global.PerformanceObserver = oldPerformanceObserver;
    global.window = oldWindow;
  });

  describe('buildMetricsPayload', () => {
    function buildAndParsePayload(entry) {
      const metricsPayload = metrics.buildMetricsPayload(entry);
      return JSON.parse(metricsPayload.append.args[0][1]);
    }

    it('should return a FormData object', () => {
      const metricsPayload = metrics.buildMetricsPayload(navEntry);
      expect(metricsPayload).to.be.instanceof(FormData);
    });

    it('should not include firstContentfulPaint if not present', () => {
      const byNameStub = sinon
        .stub()
        .withArgs('first-contentful-paint')
        .returns('0');
      global.performance.getEntriesByName = byNameStub;

      const parsedResponse = buildAndParsePayload(navEntry);
      expect(parsedResponse.metrics).to.not.include.deep.members([
        { duration: 1349.599999939381, metric: 'firstContentfulPaint' },
      ]);
    });

    it('should include firstContentfulPaint if present', () => {
      const byNameStub = sinon
        .stub()
        .withArgs('first-contentful-paint')
        .returns([
          {
            duration: 0,
            entryType: 'paint',
            name: 'first-contentful-paint',
            startTime: 1349.599999939381,
          },
        ]);
      global.performance.getEntriesByName = byNameStub;

      const parsedResponse = buildAndParsePayload(navEntry);
      expect(parsedResponse.metrics).to.include.deep.members([
        { duration: 1349.599999939381, metric: 'firstContentfulPaint' },
      ]);
    });

    describe('sendMetricsToBackend', () => {
      it('should call sendBeacon once', () => {
        global.navigator.sendBeacon = sinon.spy();

        const metricsPayload = metrics.buildMetricsPayload(navEntry);
        metrics.sendMetricsToBackend(metricsPayload);

        expect(global.navigator.sendBeacon.callCount).to.be.equal(1);
      });
    });

    describe('captureMetrics', () => {
      it('should instantiate a new PerformanceObserver', () => {
        global.PerformanceObserver = sinon.spy();
        metrics.captureMetrics();
        expect(PerformanceObserver.calledWithNew()).to.be.equal(true);
      });
    });
  });
});
