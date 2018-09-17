import conditionalStorage from '../../platform/utilities/storage/conditionalStorage';
import MessagingManifest from '../../applications/messaging/manifest.json';

const lowerEnvironments = [
  'development',
  'staging',
  'preview',
  'vagovdev',
  'vagovstaging'
];

const mhvDomain = lowerEnvironments.includes(__BUILDTYPE__) ? 'https://mhv-syst.myhealth.va.gov' : 'https://www.myhealth.va.gov';

const urlMap = {
  [`${MessagingManifest.url}/`]: `${mhvDomain}/mhv-portal-web/secure-messaging`,

  '/health-care/refill-track-prescriptions/': `${mhvDomain}/mhv-portal-web/web/myhealthevet/refill-prescriptions`,

  '/health-care/schedule-view-va-appointments/': `${mhvDomain}/mhv-portal-web/web/myhealthevet/scheduling-a-va-appointment`,

  '/health-care/view-test-and-lab-results/': `${mhvDomain}/mhv-portal-web/labs-tests`
};

export default function createCallToActionWidget() {
  if (conditionalStorage().getItem('userToken')) {
    const redirectUrl = urlMap[location.pathname];
    window.open(redirectUrl, 'redirect-popup');
  }

  // TODO: Implement CTA behavior in a new component.
}
