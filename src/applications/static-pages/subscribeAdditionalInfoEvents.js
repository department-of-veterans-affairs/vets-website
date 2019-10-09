import recordEvent from 'platform/monitoring/record-event';

const recordExpand = () => recordEvent({ event: 'nav-additionalInfo-expand' });
const recordCollapse = () =>
  recordEvent({ event: 'nav-additionalInfo-collapse' });

export default function subscribeAdditionalInfoAnalytics() {
  document.body.addEventListener(
    '@department-of-veterans-affairs/formation/additional-info/expand',
    recordExpand,
  );

  document.body.addEventListener(
    '@department-of-veterans-affairs/formation/additional-info/collapse',
    recordCollapse,
  );
}
