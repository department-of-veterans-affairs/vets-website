/**
 * Attaches CustomEvent 'component-library-analytics' listener to document.body
 * to translate component library actions into analytics dataLayer events.
 */
import _recordEvent from 'platform/monitoring/record-event';
import { kebabCase } from 'lodash';
import { getSectionLabel } from 'applications/static-pages/subscription-creators/subscribeAccordionEvents';

const analyticsEvents = {
  Modal: [{ action: 'show', event: 'int-modal-show' }],
  Accordion: [
    { action: 'expand', event: 'int-accordion-expand' },
    { action: 'collapse', event: 'int-accordion-collapse' },
  ],
  AdditionalInfo: [
    { action: 'expand', event: 'int-additional-info-expand' },
    { action: 'collapse', event: 'int-additional-info-collapse' },
  ],
  AlertBox: [{ action: 'linkClick', event: 'nav-alert-box-link-click' }],
  Breadcrumbs: [{ action: 'linkClick', event: 'nav-breadcrumb-link-click' }],
  Checkbox: [{ action: 'change', event: 'int-checkbox-option-click' }],
  CheckboxGroup: [
    { action: 'click', event: 'int-checkbox-group-option-click' },
  ],
  LoadingIndicator: [
    { action: 'displayed', event: 'loading-indicator-displayed' },
  ],
  PromoBanner: [{ action: 'linkClick', event: 'nav-promo-banner-link-click' }],
  RadioButtons: [{ action: 'change', event: 'int-radio-button-option-click' }],
  Select: [{ action: 'change', event: 'int-select-box-option-click' }],
  TextArea: [{ action: 'blur', event: 'int-text-area-blur' }],
  TextInput: [{ action: 'blur', event: 'int-text-input-blur' }],
  'va-checkbox': [{ action: 'change', event: 'int-checkbox-option-click' }],
  'va-text-input': [{ action: 'blur', event: 'int-text-input-blur' }],
};

export function subscribeComponentAnalyticsEvents(
  e,
  recordEvent = _recordEvent,
) {
  // Is it a component we are tracking?
  const component = analyticsEvents[e.detail.componentName];

  if (component) {
    const action = component.find(ev => ev.action === e.detail.action);
    const version = e.detail.version;

    if (action) {
      const dataLayer = {
        event: action.event,
        'event-source': 'component-library',
        'component-library-version': version,
      };

      // If the event included additional details / context...
      if (e.detail.details) {
        for (const key of Object.keys(e.detail.details)) {
          const newKey = `${kebabCase(e.detail.componentName)}-${key}`;

          dataLayer[newKey] = e.detail.details[key];
        }
      }

      if (
        ['int-accordion-expand', 'int-accordion-collapse'].includes(
          action.event,
        )
      ) {
        dataLayer['accordion-section-label'] = getSectionLabel(e.target);
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
