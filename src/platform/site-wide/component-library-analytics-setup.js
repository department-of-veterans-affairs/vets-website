/**
 * Attaches CustomEvent 'component-library-analytics' listener to document.body
 * to translate component library actions into analytics dataLayer events.
 */
import _recordEvent from 'platform/monitoring/record-event';
import { kebabCase } from 'lodash';

const analyticsEvents = {
  Modal: [{ action: 'show', event: 'int-modal-show' }],
  AdditionalInfo: [
    { action: 'expand', event: 'int-additional-info-expand' },
    { action: 'collapse', event: 'int-additional-info-collapse' },
  ],
  AlertBox: [{ action: 'linkClick', event: 'nav-alert-box-link-click' }],
  Breadcrumbs: [{ action: 'linkClick', event: 'nav-breadcrumb-link-click' }],
  LoadingIndicator: [
    { action: 'displayed', event: 'loading-indicator-displayed' },
  ],
  ProgressBar: [{ action: 'change', event: 'nav-progress-bar-change' }],
  PromoBanner: [{ action: 'linkClick', event: 'nav-promo-banner-link-click' }],
  SegmentedProgressBar: [
    { action: 'change', event: 'nav-segmented-progress-bar-change' },
  ],
};

export function subscribeComponentAnalyticsEvents(
  e,
  recordEvent = _recordEvent,
) {
  // Is it a component we are tracking?
  const component = analyticsEvents[e.detail.componentName];

  if (component) {
    const action = component.find(ev => ev.action === e.detail.action);

    if (action) {
      const dataLayer = {
        event: action.event,
        'event-source': 'component-library',
      };

      // If the event included additional details / context...
      if (e.detail.details) {
        for (const key of Object.keys(e.detail.details)) {
          const newKey = `${kebabCase(e.detail.componentName)}-${key}`;

          dataLayer[newKey] = e.detail.details[key];
        }
      }

      recordEvent(dataLayer);

      // Reset dataLayer properties to undefined with a new push
      // so they don't bleed into other event.

      const clearedDataLayer = { ...dataLayer };

      // Remove event property
      if (Object.prototype.hasOwnProperty.call(clearedDataLayer, 'event')) {
        delete clearedDataLayer.event;
      }

      // Remove gtm.uniqueEventId property
      if (
        Object.prototype.hasOwnProperty.call(
          clearedDataLayer,
          'gtm.uniqueEventId',
        )
      ) {
        delete clearedDataLayer['gtm.uniqueEventId'];
      }

      // Set everything else to undefined
      Object.keys(clearedDataLayer).forEach(key => {
        clearedDataLayer[key] = undefined;
      });

      recordEvent(clearedDataLayer);
    }
  }
}

document.body.addEventListener(
  'component-library-analytics',
  subscribeComponentAnalyticsEvents,
);
