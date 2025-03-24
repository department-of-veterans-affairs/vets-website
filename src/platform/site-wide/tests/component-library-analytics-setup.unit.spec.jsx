import { expect } from 'chai';
import sinon from 'sinon';
import { subscribeComponentAnalyticsEvents } from 'platform/site-wide/component-library-analytics-setup';

describe('Site-wide component library analytics', () => {
  it('should push events to the analytics dataLayer for Modal', () => {
    const recordEvent = sinon.spy();
    const event = {
      detail: {
        componentName: 'Modal',
        action: 'show',
        details: {
          title: 'Modal title',
          status: 'info',
          primaryButtonText: 'Button Text 1',
          secondaryButtonText: 'Button Text 3',
        },
        version: '0.0.0',
      },
    };

    const dataLayerEvent = {
      event: 'int-modal-show',
      'event-source': 'component-library',
      'component-library-version': '0.0.0',
      'modal-title': 'Modal title',
      'modal-status': 'info',
      'modal-primaryButtonText': 'Button Text 1',
      'modal-secondaryButtonText': 'Button Text 3',
    };

    subscribeComponentAnalyticsEvents(event, recordEvent);

    expect(recordEvent.calledWith(dataLayerEvent)).to.be.true;
  });

  it('should push events to the analytics dataLayer for va-modal web component', () => {
    const recordEvent = sinon.spy();
    const event = {
      detail: {
        componentName: 'va-modal',
        action: 'show',
        details: {
          title: 'Modal title',
          primaryButtonText: 'Button Text 1',
          secondaryButtonText: 'Button Text 3',
        },
      },
    };

    const dataLayerEvent = {
      event: 'int-modal-show',
      'event-source': 'component-library',
      'component-library-version': undefined,
      'modal-title': 'Modal title',
      'modal-primaryButtonText': 'Button Text 1',
      'modal-secondaryButtonText': 'Button Text 3',
    };

    subscribeComponentAnalyticsEvents(event, recordEvent);

    expect(recordEvent.calledWith(dataLayerEvent)).to.be.true;
  });
});
