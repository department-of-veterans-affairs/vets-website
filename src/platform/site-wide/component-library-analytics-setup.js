/**
 * Attaches CustomEvent 'component-library-analytics' listener to document.body
 * to translate component library actions into analytics dataLayer events.
 */
import _recordEvent from 'platform/monitoring/record-event';
import { getSectionLabel } from 'applications/static-pages/subscription-creators/subscribeAccordionEvents';

const analyticsEvents = {
  Modal: [{ action: 'show', event: 'int-modal-show', prefix: 'modal' }],
  Accordion: [
    { action: 'expand', event: 'int-accordion-expand', prefix: 'accordion' },
    {
      action: 'collapse',
      event: 'int-accordion-collapse',
      prefix: 'accordion',
    },
  ],
  AdditionalInfo: [
    {
      action: 'expand',
      event: 'int-additional-info-expand',
      prefix: 'additional-info',
    },
    {
      action: 'collapse',
      event: 'int-additional-info-collapse',
      prefix: 'additional-info',
    },
  ],
  AlertBox: [
    {
      action: 'linkClick',
      event: 'nav-alert-box-link-click',
      prefix: 'alert-box',
    },
  ],
  Breadcrumbs: [
    {
      action: 'linkClick',
      event: 'nav-breadcrumb-link-click',
      prefix: 'breadcrumbs',
    },
  ],
  Checkbox: [
    {
      action: 'change',
      event: 'int-checkbox-option-click',
      prefix: 'checkbox',
    },
  ],
  CheckboxGroup: [
    {
      action: 'click',
      event: 'int-checkbox-group-option-click',
      prefix: 'checkbox-group',
    },
  ],
  LoadingIndicator: [
    {
      action: 'displayed',
      event: 'loading-indicator-displayed',
      prefix: 'loading-indicator',
    },
  ],
  PromoBanner: [
    {
      action: 'linkClick',
      event: 'nav-promo-banner-link-click',
      prefix: 'promo-banner',
    },
  ],
  RadioButtons: [
    {
      action: 'change',
      event: 'int-radio-button-option-click',
      prefix: 'radio-button',
    },
  ],
  Select: [
    {
      action: 'change',
      event: 'int-select-box-option-click',
      prefix: 'select',
    },
  ],
  TextArea: [
    { action: 'blur', event: 'int-text-area-blur', prefix: 'text-area' },
  ],
  TextInput: [
    { action: 'blur', event: 'int-text-input-blur', prefix: 'text-input' },
  ],
  'va-checkbox': [
    {
      action: 'change',
      event: 'int-checkbox-option-click',
      prefix: 'checkbox',
    },
  ],
  'va-text-input': [
    { action: 'blur', event: 'int-text-input-blur', prefix: 'text-input' },
  ],
  'va-accordion': [
    { action: 'expand', event: 'int-accordion-expand', prefix: 'accordion' },
    {
      action: 'collapse',
      event: 'int-accordion-collapse',
      prefix: 'accordion',
    },
  ],
  'va-additional-info': [
    {
      action: 'expand',
      event: 'int-additional-info-expand',
      prefix: 'additional-info',
    },
    {
      action: 'collapse',
      event: 'int-additional-info-collapse',
      prefix: 'additional-info',
    },
  ],
  'va-alert': [
    {
      action: 'linkClick',
      event: 'nav-alert-box-link-click',
      prefix: 'alert-box',
    },
  ],
  'va-alert-expandable': [
    {
      action: 'expand',
      event: 'int-alert-expandable-expand',
      prefix: 'alert-expandable',
    },
    {
      action: 'collapse',
      event: 'int-alert-expandable-collapse',
      prefix: 'alert-expandable',
    },
  ],
  'va-breadcrumbs': [
    {
      action: 'linkClick',
      event: 'nav-breadcrumb-link-click',
      prefix: 'breadcrumbs',
    },
  ],
  'va-checkbox-group': [
    {
      action: 'change',
      event: 'int-checkbox-group-option-click',
      prefix: 'checkbox-group',
    },
  ],
  'va-loading-indicator': [
    {
      action: 'displayed',
      event: 'loading-indicator-displayed',
      prefix: 'loading-indicator',
    },
  ],
  'va-modal': [
    {
      action: 'show',
      event: 'int-modal-show',
      prefix: 'modal',
    },
  ],
  'va-radio': [
    {
      action: 'change',
      event: 'int-radio-button-option-click',
      prefix: 'radio-button',
    },
  ],
  'va-select': [
    {
      action: 'change',
      event: 'int-select-box-option-click',
      prefix: 'select',
    },
  ],
  'va-progress-bar': [
    {
      action: 'change',
      event: 'nav-progress-bar-change',
      prefix: 'progress-bar',
    },
  ],
  'va-segmented-progress-bar': [
    {
      action: 'change',
      event: 'nav-segmented-progress-bar-change',
      prefix: 'segmented-progress-bar',
    },
  ],
  'va-on-this-page': [
    {
      action: 'click',
      event: 'nav-jumplink-click',
    },
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
    const { version } = e.detail;

    if (action) {
      const dataLayer = {
        event: action.event,
        'event-source': 'component-library',
        'component-library-version': version,
      };

      // If the event included additional details / context...
      if (e.detail.details) {
        for (const key of Object.keys(e.detail.details)) {
          const newKey = action.prefix ? `${action.prefix}-${key}` : key;

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
