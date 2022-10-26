/* eslint-disable camelcase */
/**
 * Attaches CustomEvent 'component-library-analytics' listener to document.body
 * to translate component library actions into analytics dataLayer events.
 */
import _recordEvent from 'platform/monitoring/record-event';
import { getSectionLabel } from 'applications/static-pages/subscription-creators/subscribeAccordionEvents';
import environment from 'platform/utilities/environment';

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
  'va-banner': [
    {
      action: 'close',
      event: 'int-banner-close',
      prefix: 'banner',
    },
  ],
  'va-button': [
    {
      action: 'click',
      event: 'cta-button-click',
      prefix: 'button',
    },
  ],
  'va-button-pair': [
    {
      action: 'click',
      event: 'int-button-pair-click',
      prefix: 'button-pair',
    },
  ],
  'va-checkbox-group': [
    {
      action: 'change',
      event: 'int-checkbox-group-option-click',
      prefix: 'checkbox-group',
    },
  ],
  'va-date': [
    {
      action: 'blur',
      event: 'int-date-blur',
      prefix: 'date',
    },
  ],
  'va-link': [
    {
      action: 'click',
      event: 'nav-link-click',
      prefix: 'link',
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
  'va-promo-banner': [
    {
      action: 'linkClick',
      event: 'nav-promo-banner-link-click',
      prefix: 'promo-banner',
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
  'va-pagination': [
    {
      action: 'linkClick',
      event: 'nav-paginate-number',
      prefix: 'pagination',
    },
    {
      action: 'linkClick',
      event: 'nav-paginate-previous',
      prefix: 'pagination',
    },
    {
      action: 'linkClick',
      event: 'nav-paginate-next',
      prefix: 'pagination',
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
      ga4: {
        event: 'interaction',
        component_name: 'va-on-this-page',
        /* Component to GA4 parameters */
        mapping: {
          'click-text': 'value',
          version: 'component_version',
        },
      },
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

      /**
       * GA4 dataLayer push.
       */
      if (!environment.isProduction() && action?.ga4) {
        /**
         * Creating the GA4 dataLayer object by combining the existing
         * GA dataLayer with the defined GA4 parameters.
         */
        const ga4DataLayer = {
          ...dataLayer,
          ...action.ga4,
          action: action.event,
        };

        /**
         * Mapping the GA4 parameters to the Web Component event details.
         */
        const ga4Mapping = action?.ga4?.mapping;

        if (ga4Mapping) {
          for (const key of Object.keys(ga4Mapping)) {
            const newKey = action.ga4.mapping[key];

            ga4DataLayer[newKey] = dataLayer[key];
          }

          /**
           * Cleaning up the GA4 mapping object from the dataLayer.
           */
          delete ga4DataLayer.mapping;
        }

        recordEvent(ga4DataLayer);
      }
    }
  }
}

document.body.addEventListener(
  'component-library-analytics',
  subscribeComponentAnalyticsEvents,
);
