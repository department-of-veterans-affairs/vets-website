import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';

export const recordDatalayerEvent = e => {
  const sendEvent = () =>
    recordEvent({
      // prettier-ignore
      'event': e.target.dataset.eventname
    });
  switch (e.target.dataset.eventname) {
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
    case 'nav-header-sign-in':
      sendEvent();
      break;
    case 'nav-header-sign-out':
      sendEvent();
      break;
    case 'arp-card':
      sendEvent();
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
