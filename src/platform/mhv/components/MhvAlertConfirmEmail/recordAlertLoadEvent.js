import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { datadogRum } from '@datadog/browser-rum';

const recordAlertLoadEvent = headline => {
  // record GA event
  recordEvent({
    event: 'nav-alert-box-load',
    action: 'load',
    'alert-box-headline': headline,
    'alert-box-status': 'warning',
  });
  // record DD event
  datadogRum.addAction(`VaAlert load event: ${headline}`);
};

export { recordAlertLoadEvent };
