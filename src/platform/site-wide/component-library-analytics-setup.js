/* eslint-disable camelcase */
/**
 * Attaches CustomEvent 'component-library-analytics' listener to document.body
 * to translate component library actions into analytics dataLayer events.
 */
import _recordEvent from 'platform/monitoring/record-event';

const analyticsEvents = {
  Modal: [{ action: 'show', event: 'int-modal-show', prefix: 'modal' }],
  'va-accordion': [
    {
      action: 'expand',
      event: 'int-accordion-expand',
      prefix: 'accordion',
    },
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
  'va-button-segmented': [
    {
      action: 'click',
      event: 'int-button-segmented-click',
      prefix: 'button-segmented',
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
    },
  ],
  'va-language-toggle': [
    {
      action: 'linkClick',
      event: 'nav-language-toggle-click',
      prefix: 'language-toggle',
    },
  ],
  'va-link': [
    {
      action: 'click',
      event: 'nav-link-click',
      prefix: 'link',
    },
  ],
  'va-link-action': [
    {
      action: 'click',
      event: 'nav-link-click',
      prefix: 'link-action',
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
      action: 'click',
      event: 'cta-modal-click',
      prefix: 'modal',
    },
    {
      action: 'show',
      event: 'int-modal-show',
      prefix: 'modal',
    },
  ],
  'va-notification': [
    {
      action: 'linkClick',
      event: 'nav-notification-link-click',
      prefix: 'notification',
    },
    {
      action: 'close',
      event: 'int-notification-close',
      prefix: 'notification',
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
    },
    {
      action: 'collapse',
      event: 'int-official-gov-banner-collapse',
      prefix: 'official-gov-banner',
    },
  ],
  'va-on-this-page': [
    {
      action: 'click',
      event: 'nav-jumplink-click',
    },
  ],
  'va-privacy-agreement': [
    {
      action: 'click',
      event: 'nav-privacy-agreement-checkbox-click',
      prefix: 'privacy-agreement',
    },
  ],
  'va-promo-banner': [
    {
      action: 'linkClick',
      event: 'nav-promo-banner-link-click',
      prefix: 'promo-banner',
    },
    {
      action: 'close',
      event: 'int-promo-banner-close',
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
  'va-search-input': [
    {
      action: 'click',
      event: 'int-search-input-click',
      prefix: 'search-input',
    },
    {
      action: 'blur',
      event: 'int-search-input-blur',
      prefix: 'search-input',
    },
  ],
  'va-select': [
    {
      action: 'change',
      event: 'int-select-box-option-click',
      prefix: 'select',
    },
  ],
  'va-sort': [
    {
      action: 'change',
      event: 'int-sort-box-option-click',
      prefix: 'sort',
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
    },
  ],
  'va-text-input': [
    {
      action: 'blur',
      event: 'int-text-input-blur',
      prefix: 'text-input',
    },
  ],
  'va-textarea': [
    {
      action: 'blur',
      event: 'int-textarea-blur',
      prefix: 'textarea',
    },
  ],
};

// This function assumes an accordion element in a <section> tag
// which has a data-label attribute set.
const getSectionLabel = node => {
  let currentNode = node;
  while (
    currentNode &&
    currentNode.tagName &&
    currentNode.nodeName.toUpperCase() !== 'SECTION'
  ) {
    currentNode = currentNode.parentNode;
  }
  return currentNode?.dataset?.label;
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
