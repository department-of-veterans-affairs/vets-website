import { mhvUrl } from '@department-of-veterans-affairs/platform-site-wide/utilities';
// Links to MHV subdomain need to use `mhvUrl`. Va.gov links can just be paths
import FEATURE_FLAG_NAMES from '~/platform/utilities/feature-toggles/featureFlagNames';
import { HEALTH_TOOL_HEADINGS, HEALTH_TOOL_LINKS } from '../../constants';
import resolveLinks from './resolveLinks';

const countUnreadMessages = folders => {
  if (Array.isArray(folders?.data)) {
    return folders.data.reduce((accumulator, currentFolder) => {
      // Only count inbox (id = 0) and custom folders (id > 0)
      return currentFolder.id >= 0
        ? accumulator + currentFolder.attributes?.unreadCount
        : accumulator;
    }, 0);
  }
  if (folders?.data?.attributes?.unreadCount > 0) {
    return folders.data.attributes.unreadCount;
  }

  return 0;
};

const resolveUnreadMessageAriaLabel = unreadMessageCount => {
  return unreadMessageCount > 0
    ? 'You have unread messages. Go to your inbox.'
    : null;
};

const resolveLandingPageLinks = (
  authdWithSSOe = false,
  featureToggles,
  unreadMessageCount,
  unreadMessageAriaLabel,
  userHasHealthData = false,
) => {
  const messagesLinks = resolveLinks(
    [
      {
        ...HEALTH_TOOL_LINKS.MESSAGES[0],
        oldHref: mhvUrl(authdWithSSOe, 'secure-messaging'),
        oldText: 'Go to inbox',
        toggle: FEATURE_FLAG_NAMES.mhvLandingPageEnableVaGovHealthToolsLinks,
        ariaLabel: unreadMessageAriaLabel,
      },
      {
        ...HEALTH_TOOL_LINKS.MESSAGES[1],
        oldHref: mhvUrl(authdWithSSOe, 'compose-message'),
        oldText: 'Compose message',
        toggle: FEATURE_FLAG_NAMES.mhvLandingPageEnableVaGovHealthToolsLinks,
      },
      {
        ...HEALTH_TOOL_LINKS.MESSAGES[2],
        oldHref: mhvUrl(authdWithSSOe, 'manage-folders'),
        oldText: 'Manage folders',
        toggle: FEATURE_FLAG_NAMES.mhvLandingPageEnableVaGovHealthToolsLinks,
      },
    ],
    featureToggles,
  );

  const medicationsLinks = resolveLinks(
    [
      {
        ...HEALTH_TOOL_LINKS.MEDICATIONS[0],
        oldHref: mhvUrl(authdWithSSOe, 'prescription_refill'),
        oldText: 'Refill VA prescriptions',
        toggle: FEATURE_FLAG_NAMES.mhvLandingPageEnableVaGovHealthToolsLinks,
      },
      {
        href: null,
        oldHref: mhvUrl(authdWithSSOe, '/prescription-tracking'),
        oldText: 'Track prescription delivery',
        toggle: FEATURE_FLAG_NAMES.mhvLandingPageEnableVaGovHealthToolsLinks,
      },
      {
        ...HEALTH_TOOL_LINKS.MEDICATIONS[1],
        oldHref: mhvUrl(authdWithSSOe, '/my-complete-medications-list'),
        oldText: 'Medications and allergies',
        toggle: FEATURE_FLAG_NAMES.mhvLandingPageEnableVaGovHealthToolsLinks,
      },
    ],
    featureToggles,
  );

  const medicalRecordsLinks = resolveLinks(
    [
      {
        href: mhvUrl(authdWithSSOe, '/download-my-data'),
        text: 'Download medical record (Blue Button®)',
      },
      {
        href: mhvUrl(authdWithSSOe, '/labs-tests'),
        text: 'Lab and test results',
      },
      {
        href: mhvUrl(authdWithSSOe, '/health-history'),
        text: 'Health history',
      },
    ],
    featureToggles,
  );

  const myVaHealthBenefitsLinks = resolveLinks(
    [
      {
        href: '/health-care/copay-rates/',
        text: 'Current Veteran copay rates',
      },
      {
        href: '/health-care/health-needs-conditions/mental-health',
        text: 'Mental health services',
      },
      {
        href: '/health-care/about-va-health-benefits/dental-care/',
        text: 'Dental care',
      },
      {
        href: '/COMMUNITYCARE/programs/veterans/index.asp',
        text: 'Community care',
      },
      {
        href:
          '/my-health/update-benefits-information-form-10-10ezr/introduction',
        text: 'Update health benefits info (10-10EZR)',
      },
      {
        href: mhvUrl(authdWithSSOe, 'health-information-card'),
        text: 'Veteran health information card',
      },
      // {
      //   href: '#FIXME-need-link',
      //   text: 'Download my IRS 1095-B form',
      // },
    ],
    featureToggles,
  );

  const moreResourcesLinks = resolveLinks(
    [
      {
        href: '/resources/the-pact-act-and-your-va-benefits/',
        text: 'The PACT Act and your benefits',
      },
      {
        href: mhvUrl(authdWithSSOe, 'check-your-mental-health'),
        text: 'Check your mental health',
      },
      {
        href: 'https://www.veteranshealthlibrary.va.gov/',
        text: 'Veterans Health Library',
      },
      {
        href: 'https://www.myhealth.va.gov/healthy-living-centers',
        text: 'Healthy Living Centers',
      },
      {
        href: 'https://www.myhealth.va.gov/mhv-community',
        text: 'The My HealtheVet community',
      },
      {
        href: '/wholehealth/',
        text: 'VA’s Whole Health living',
      },
      {
        href: mhvUrl(authdWithSSOe, 'ss20200320-va-video-connect'),
        text: 'How to use VA Video Connect',
      },
    ],
    featureToggles,
  );

  const spotlightLinks = resolveLinks(
    [
      {
        text: 'Make the Most of Your VA Appointment',
        href: mhvUrl(authdWithSSOe, 'ss20240415-make-most-your-va-appointment'),
      },
      {
        text: 'VA Health Care Expands to Millions of Veterans',
        href: mhvUrl(
          authdWithSSOe,
          'ss20240315-va-health-care-expands-millions',
        ),
      },
      {
        text: 'Hearing Aids Connect with Telehealth',
        href: mhvUrl(
          authdWithSSOe,
          'ss20211015-fix-your-hearing-aid-over-video',
        ),
      },
    ],
    featureToggles,
  );

  const cards = [
    {
      title: HEALTH_TOOL_HEADINGS.APPOINTMENTS,
      icon: 'calendar',
      links: HEALTH_TOOL_LINKS.APPOINTMENTS,
    },
    {
      title: HEALTH_TOOL_HEADINGS.MESSAGES,
      icon: 'comments',
      links: messagesLinks,
    },
    {
      title: HEALTH_TOOL_HEADINGS.MEDICATIONS,
      icon: 'prescription-bottle',
      links: medicationsLinks,
    },
    {
      title: HEALTH_TOOL_HEADINGS.MEDICAL_RECORDS,
      icon: 'file-medical',
      links: medicalRecordsLinks,
    },
    {
      title: HEALTH_TOOL_HEADINGS.PAYMENTS,
      icon: 'dollar-sign',
      links: HEALTH_TOOL_LINKS.PAYMENTS,
    },
    {
      title: HEALTH_TOOL_HEADINGS.MEDICAL_SUPPLIES,
      icon: 'deaf',
      links: HEALTH_TOOL_LINKS.MEDICAL_SUPPLIES,
    },
  ];
  const hubs = [
    {
      title: userHasHealthData ? 'My VA health benefits' : 'VA health benefits',
      links: myVaHealthBenefitsLinks,
    },
    {
      title: 'More resources and support',
      links: moreResourcesLinks,
    },
    {
      title: 'In the spotlight',
      links: spotlightLinks,
    },
  ];

  return { cards, hubs };
};

export {
  countUnreadMessages,
  resolveLandingPageLinks,
  resolveUnreadMessageAriaLabel,
};
