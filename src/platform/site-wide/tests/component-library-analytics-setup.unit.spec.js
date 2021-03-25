import { expect } from 'chai';
import sinon from 'sinon';
import { subscribeComponentAnalyticsEvents } from 'platform/site-wide/component-library-analytics-setup';

describe('Site-wide component library analytics', () => {
  it('should push events to the analytics dataLayer', () => {
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
      },
    };

    const dataLayerEvent = {
      event: 'int-modal-click',
      'event-source': 'component-library',
      'modal-title': 'Modal title',
      'modal-status': 'info',
      'modal-primaryButtonText': 'Button Text 1',
      'modal-secondaryButtonText': 'Button Text 3',
    };

    subscribeComponentAnalyticsEvents(event, recordEvent);

    expect(recordEvent.calledWith(dataLayerEvent)).to.be.true;
  });
});
