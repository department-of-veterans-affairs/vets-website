import { EXTERNAL_SERVICES } from 'platform/monitoring/external-services/config';

const downtimeBanners = [
  {
    dependencies: [EXTERNAL_SERVICES.idme],
    headline: 'Our sign in process isn’t working right now',
    status: 'error',
    message:
      'We’re sorry. We’re working to fix some problems with our sign in process. If you’d like to sign in to VA.gov, please check back later.',
  },
  {
    dependencies: [EXTERNAL_SERVICES.dslogon],
    headline: 'You may have trouble signing in with DS Logon',
    status: 'warning',
    message:
      'We’re sorry. We’re working to fix some problems with our DS Logon sign in process. If you’d like to sign in to VA.gov with your DS Logon account, please check back later.',
  },
  {
    dependencies: [EXTERNAL_SERVICES.mhv],
    headline: 'You may have trouble signing in with My HealtheVet',
    status: 'warning',
    message:
      'We’re sorry. We’re working to fix some problems with our My HealtheVet sign in process. If you’d like to sign in to VA.gov with your My HealtheVet username and password, please check back later.',
  },
  {
    dependencies: [EXTERNAL_SERVICES.mvi],
    headline: 'You may have trouble signing in or using some tools or services',
    status: 'warning',
    message:
      'We’re sorry. We’re working to fix a problem that affects some parts of our site. If you have trouble signing in or using any tools or services, please check back soon.',
  },
];

export default downtimeBanners;
