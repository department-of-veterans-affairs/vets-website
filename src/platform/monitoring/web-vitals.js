/* eslint-disable camelcase */
/**
 * Initializes web vitals reporting to GA4 on non-localhost environments.
 */
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';

import { onCLS, onINP, onLCP, onTTFB } from 'web-vitals';

const recordWebVitalsEvent = event => {
  const webVitalsEvent = {
    event: 'web_vitals',
    web_vital_type: event.name,
    latency_ms: Math.round(
      event.name === 'CLS' ? event.delta * 1000 : event.delta,
    ),
    web_vital_id: event.id,
    app_name: window.appName || 'unknown',
  };
  recordEvent(webVitalsEvent);
};

const trackWebVitals = ({ sampleEvents = false }) => {
  if (sampleEvents) {
    // Sample ~1% of events.
    return Math.random() < 0.01;
  }

  // Exclude cypress containers and localhost from tracking web vitals.
  return environment.BASE_URL.indexOf('localhost') < 0;
};

if (trackWebVitals({ sampleEvents: environment.isProduction() })) {
  onCLS(recordWebVitalsEvent);
  onINP(recordWebVitalsEvent);
  onLCP(recordWebVitalsEvent);
  onTTFB(recordWebVitalsEvent);
}

export { recordWebVitalsEvent, trackWebVitals };
