import recordEvent from 'platform/monitoring/record-event';

export default function subscribeAdditionalInfoAnalytics() {
  document.body.addEventListener(
    '@department-of-veterans-affairs/formation/additional-info/expand',
    () => recordEvent({ event: 'nav-additionalInfo-expand' }),
  );

  document.body.addEventListener(
    '@department-of-veterans-affairs/formation/additional-info/collapse',
    () => recordEvent({ event: 'nav-additionalInfo-collapse' }),
  );
}
