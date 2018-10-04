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

    function PerformanceMock() {
      this.getEntriesByType = byTypeStub;
      this.getEntriesByName = sinon.stub();
    }
    global.performance = new PerformanceMock();

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
        const spy = sinon.spy();
        function NavigatorMock() {
          this.sendBeacon = spy; // sinon.stub().returns(true);
        }
        global.navigator = new NavigatorMock();

        const metricsPayload = metrics.buildMetricsPayload(navEntry);
        metrics.sendMetricsToBackend(metricsPayload);

        expect(spy.callCount).to.be.equal(1);
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
