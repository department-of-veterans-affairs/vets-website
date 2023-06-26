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
  'va-accordion': [
    {
      action: 'expand',
      event: 'int-accordion-expand',
      prefix: 'accordion',
      ga4: {
        event: 'interaction',
        component_name: 'va-accordion',
        custom_string_1: 'component-library',
        /* Component to GA4 parameters */
        mapping: {
          'accordion-header': 'heading_1',
          'accordion-subheader': 'heading_2',
          'accordion-level': 'custom_number_1',
          'accordion-sectionHeading': 'custom_string_2',
          version: 'component_version',
        },
      },
    },
    {
      action: 'collapse',
      event: 'int-accordion-collapse',
      prefix: 'accordion',
      ga4: {
        event: 'interaction',
        component_name: 'va-accordion',
        custom_string_1: 'component-library',
        /* Component to GA4 parameters */
        mapping: {
          'accordion-header': 'heading_1',
          'accordion-subheader': 'heading_2',
          'accordion-level': 'custom_number_1',
          'accordion-sectionHeading': 'custom_string_2',
          version: 'component_version',
        },
      },
    },
  ],
  'va-additional-info': [
    {
      action: 'expand',
      event: 'int-additional-info-expand',
      prefix: 'additional-info',
      ga4: {
        event: 'interaction',
        component_name: 'va-additional-info',
        custom_string_1: 'component-library',
        /* Component to GA4 parameters */
        mapping: {
          'additional-info-triggerText': 'custom_string_2',
          version: 'component_version',
        },
      },
    },
    {
      action: 'collapse',
      event: 'int-additional-info-collapse',
      prefix: 'additional-info',
      ga4: {
        event: 'interaction',
        component_name: 'va-additional-info',
        custom_string_1: 'component-library',
        /* Component to GA4 parameters */
        mapping: {
          'additional-info-triggerText': 'custom_string_2',
          version: 'component_version',
        },
      },
    },
  ],
  'va-alert': [
    {
      action: 'linkClick',
      event: 'nav-alert-box-link-click',
      prefix: 'alert-box',
      ga4: {
        event: 'interaction',
        component_name: 'va-alert',
        custom_string_1: 'component-library',
        /* Component to GA4 parameters */
        mapping: {
          'alert-box-clickLabel': 'custom_string_2',
          'alert-box-headline': 'heading_1',
          'alert-box-status': 'status',
          version: 'component_version',
        },
      },
    },
  ],
  'va-alert-expandable': [
    {
      action: 'expand',
      event: 'int-alert-expandable-expand',
      prefix: 'alert-expandable',
      ga4: {
        event: 'interaction',
        component_name: 'va-alert-expandable',
        custom_string_1: 'component-library',
        /* Component to GA4 parameters */
        mapping: {
          'alert-expandable-triggerText': 'custom_string_2',
          version: 'component_version',
        },
      },
    },
    {
      action: 'collapse',
      event: 'int-alert-expandable-collapse',
      prefix: 'alert-expandable',
      ga4: {
        event: 'interaction',
        component_name: 'alert-expandable',
        custom_string_1: 'component-library',
        /* Component to GA4 parameters */
        mapping: {
          'alert-expandable-triggerText': 'custom_string_2',
          version: 'component_version',
        },
      },
    },
  ],
  'va-breadcrumbs': [
    {
      action: 'linkClick',
      event: 'nav-breadcrumb-link-click',
      prefix: 'breadcrumbs',
      ga4: {
        event: 'interaction',
        component_name: 'va-breadcrumbs',
        custom_string_1: 'component-library',
        /* Component to GA4 parameters */
        mapping: {
          'breadcrumbs-clickLabel': 'custom_string_2',
          'breadcrumbs-clickLevel': 'custom_number_1',
          'breadcrumbs-totalLevels': 'custom_number_2',
          version: 'component_version',
        },
      },
    },
  ],
  'va-banner': [
    {
      action: 'close',
      event: 'int-banner-close',
      prefix: 'banner',
      ga4: {
        event: 'interaction',
        component_name: 'va-banner',
        custom_string_1: 'component-library',
        /* Component to GA4 parameters */
        mapping: {
          'banner-headline': 'heading_1',
          version: 'component_version',
        },
      },
    },
  ],
  'va-button': [
    {
      action: 'click',
      event: 'cta-button-click',
      prefix: 'button',
      ga4: {
        event: 'interaction',
        component_name: 'va-button',
        custom_string_1: 'component-library',
        /* Component to GA4 parameters */
        mapping: {
          'button-type': 'type',
          'button-label': 'custom_string_2',
          version: 'component_version',
        },
      },
    },
  ],
  'va-button-pair': [
    {
      action: 'click',
      event: 'int-button-pair-click',
      prefix: 'button-pair',
      ga4: {
        event: 'interaction',
        component_name: 'va-button-pair',
        custom_string_1: 'component-library',
        /* Component to GA4 parameters */
        mapping: {
          'button-pair-type': 'type',
          'button-pair-label': 'custom_string_2',
          version: 'component_version',
        },
      },
    },
  ],
  'va-checkbox': [
    {
      action: 'change',
      event: 'int-checkbox-option-click',
      prefix: 'checkbox',
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
  'va-file-input': [
    {
      action: 'change',
      event: 'int-file-input-change',
      prefix: 'file-input',
      ga4: {
        event: 'interaction',
        component_name: 'va-file-input',
        custom_string_1: 'component-library',
        /* Component to GA4 parameters */
        mapping: {
          'file-input-label': 'custom_string_2',
          version: 'component_version',
        },
      },
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
  'va-maintenance-banner': [
    {
      action: 'close',
      event: 'int-maintenance-banner-close',
      prefix: 'maintenance-banner',
      ga4: {
        event: 'interaction',
        component_name: 'va-maintenance-banner',
        custom_string_1: 'component-library',
        /* Component to GA4 parameters */
        mapping: {
          'maintenance-banner-header': 'heading_1',
          'maintenance-banner-warn-starts-at': 'custom_number_1',
          'maintenance-banner-expires-at': 'custom_number_2',
          'maintenance-banner-displayed-content': 'custom_string_2',
          version: 'component_version',
        },
      },
    },
  ],
  'va-memorable-date': [
    {
      action: 'blur',
      event: 'int-memorable-date-blur',
      prefix: 'memorable-date',
    },
  ],
  'va-modal': [
    {
      action: 'show',
      event: 'int-modal-show',
      prefix: 'modal',
    },
  ],
  'va-number-input': [
    {
      action: 'blur',
      event: 'int-number-input-blur',
      prefix: 'number-input',
    },
  ],
  'va-official-gov-banner': [
    {
      action: 'expand',
      event: 'int-official-gov-banner-expand',
      prefix: 'official-gov-banner',
      ga4: {
        event: 'interaction',
        component_name: 'va-official-gov-banner',
        custom_string_1: 'component-library',
        /* Component to GA4 parameters */
        mapping: {
          version: 'component_version',
        },
      },
    },
    {
      action: 'collapse',
      event: 'int-official-gov-banner-collapse',
      prefix: 'official-gov-banner',
      ga4: {
        event: 'interaction',
        component_name: 'va-official-gov-banner',
        custom_string_1: 'component-library',
        /* Component to GA4 parameters */
        mapping: {
          version: 'component_version',
        },
      },
    },
  ],
  'va-on-this-page': [
    {
      action: 'click',
      event: 'nav-jumplink-click',
      ga4: {
        event: 'interaction',
        component_name: 'va-on-this-page',
        custom_string_1: 'component-library',
        /* Component to GA4 parameters */
        mapping: {
          version: 'component_version',
        },
      },
    },
  ],
  'va-privacy-agreement': [
    {
      action: 'click',
      event: 'nav-privacy-agreement-checkbox-click',
      prefix: 'privacy-agreement',
      ga4: {
        event: 'interaction',
        component_name: 'va-privacy-agreement',
        custom_string_1: 'component-library',
        mapping: {
          'privacy-agreement-checked': 'value',
          version: 'component_version',
        },
      },
    },
  ],
  'va-promo-banner': [
    {
      action: 'linkClick',
      event: 'nav-promo-banner-link-click',
      prefix: 'promo-banner',
      ga4: {
        event: 'interaction',
        component_name: 'va-promo-banner',
        custom_string_1: 'component-library',
        /* Component to GA4 parameters */
        mapping: {
          'promo-banner-type': 'type',
          'promo-banner-href': 'href',
          'promo-banner-text': 'custom_string_2',
          version: 'component_version',
        },
      },
    },
    {
      action: 'close',
      event: 'int-promo-banner-close',
      prefix: 'promo-banner',
      ga4: {
        event: 'interaction',
        component_name: 'va-promo-banner',
        custom_string_1: 'component-library',
        /* Component to GA4 parameters */
        mapping: {
          'promo-banner-type': 'type',
          'promo-banner-text': 'custom_string_2',
          version: 'component_version',
        },
      },
    },
  ],
  'va-radio': [
    {
      action: 'change',
      event: 'int-radio-button-option-click',
      prefix: 'radio-button',
    },
  ],
  'va-search-input': [
    {
      action: 'click',
      event: 'int-search-input-click',
      prefix: 'search-input',
      ga4: {
        event: 'interaction',
        component_name: 'va-search-input',
        custom_string_1: 'component-library',
        /* Component to GA4 parameters */
        mapping: {
          'search-input-value': 'value',
          version: 'component_version',
        },
      },
    },
    {
      action: 'blur',
      event: 'int-search-input-blur',
      prefix: 'search-input',
      ga4: {
        event: 'interaction',
        component_name: 'va-search-input',
        custom_string_1: 'component-library',
        /* Component to GA4 parameters */
        mapping: {
          'search-input-value': 'value',
          version: 'component_version',
        },
      },
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
  'va-telephone': [
    {
      action: 'click',
      event: 'int-telephone-link-click',
      prefix: 'telephone',
      ga4: {
        event: 'interaction',
        component_name: 'va-telephone',
        custom_string_1: 'component-library',
        mapping: {
          'telephone-contact': 'custom_string_2',
          'telephone-extension': 'custom_number_1',
          version: 'component_version',
        },
      },
    },
  ],
  'va-text-input': [
    {
      action: 'blur',
      event: 'int-text-input-blur',
      prefix: 'text-input',
      ga4: {
        event: 'interaction',
        component_name: 'va-text-input',
        custom_string_1: 'component-library',
        /* Component to GA4 parameters */
        mapping: {
          'text-input-label': 'custom_string_2',
          'text-input-value': 'value',
          version: 'component_version',
        },
      },
    },
  ],
  'va-textarea': [
    {
      action: 'blur',
      event: 'int-textarea-blur',
      prefix: 'textarea',
      ga4: {
        event: 'interaction',
        component_name: 'va-textarea',
        custom_string_1: 'component-library',
        mapping: {
          'textarea-label': 'custom_string_2',
          'textarea-value': 'value',
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

      // GA4 dataLayer push.
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

        // Mapping the GA4 parameters to the Web Component event details.
        const ga4Mapping = action?.ga4?.mapping;

        if (ga4Mapping) {
          for (const key of Object.keys(ga4Mapping)) {
            const newKey = action.ga4.mapping[key];

            ga4DataLayer[newKey] = dataLayer[key];

            // Clean up old GA dataLayer values.
            delete ga4DataLayer[key];
          }

          // Clean up the GA4 mapping object from the dataLayer.
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
