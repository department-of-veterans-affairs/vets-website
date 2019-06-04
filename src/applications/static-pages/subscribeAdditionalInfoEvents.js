import { recordEventOnce } from 'platform/monitoring/record-event';

export default function subscribeAdditionalInfoAnalytics() {
  document.body.addEventListener(
    '@department-of-veterans-affairs/formation/additional-info/button-clicked',
    event => {
      const eventName = event.detail.dataset && event.detail.dataset.analytics;
      if (eventName) {
        const key = 'additional-info-expander-label';
        const analytic = {
          event: eventName,
          [key]: `Additional Info - ${event.detail.titleText}`,
        };

        recordEventOnce(analytic, key);
      }
    },
  );
}
