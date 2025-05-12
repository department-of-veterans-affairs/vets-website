import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';

export const recordDatalayerEvent = e => {
  switch (e) {
    case 'nav-tab-click':
      recordEvent({
        // prettier-ignore
        'event': e.target.dataset.eventname,
        // prettier-ignore
        'tab text': e.target.innerText
      });
      break;
    case 'cta-button-click':
      recordEvent({
        // prettier-ignore
        'event': e.target.dataset.eventname,
        // prettier-ignore
        'button-label': e.target.innerText
      });
      break;
    case 'nav-header-sign-in' || 'nav-header-sign-out' || 'arp-card':
      recordEvent({
        // prettier-ignore
        'event': e.target.dataset.eventname
      });
      break;
    case 'int-radio-button-option-click':
      recordEvent({
        // prettier-ignore
        'event': e.target.dataset.eventname,
        // prettier-ignore
        'radio-button-label': 'Do you accept or decline this POA request?',
        'radio-button-optionLabel': e.target.innerText,
        'radio-button-required': 'true',
      });
      break;
    default:
      recordEvent({
        // prettier-ignore
        'event': e.target.dataset.eventname,
        // prettier-ignore
        'custom_string_2': e.target.innerText || e.target.alt,
        'link-destination': e.target.href || e.target.baseURI,
        'link-origin': 'navigation',
      });
  }
};
