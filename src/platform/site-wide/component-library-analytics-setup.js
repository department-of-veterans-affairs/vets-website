/**
 * Attaches CustomEvent 'component-library-analytics' listener to document.body
 * to translate component library actions into analytics dataLayer events.
 */
import recordEvent from 'platform/monitoring/record-event';
import { kebabCase } from 'lodash';

const analyticsEvents = {
  Modal: [{ action: 'show', event: 'int-modal-click' }],
};

function subscribeComponentAnalyticsEvents(e) {
  // Is it a component we are tracking?
  const component = analyticsEvents[e.detail.componentName];

  if (component) {
    const action = component.find(ev => ev.action === e.detail.action);

    if (action) {
      const dataLayer = { event: action.event };

      // If the event included additional details / context...
      if (e.detail.details) {
        for (const key of Object.keys(e.detail.details)) {
          const newKey = `${kebabCase(e.detail.componentName)}-${key}`;

          dataLayer[newKey] = e.detail.details[key];
        }
      }

      recordEvent(dataLayer);
    }
  }
}

document.body.addEventListener(
  'component-library-analytics',
  subscribeComponentAnalyticsEvents,
);
