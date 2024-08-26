import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { mhvUrl } from '@department-of-veterans-affairs/platform-site-wide/utilities';
// Links to MHV subdomain need to use `mhvUrl`. Va.gov links can just be paths
import { HEALTH_TOOL_HEADINGS, HEALTH_TOOL_LINKS } from '../../constants';

const isLinkData = x => x?.href !== undefined && x?.text !== undefined;

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
  unreadMessageAriaLabel,
  registered = false,
) => {
  const messagesLinks = [
    {
      ...HEALTH_TOOL_LINKS.MESSAGES[0],
      ariaLabel: unreadMessageAriaLabel,
    },
    {
      ...HEALTH_TOOL_LINKS.MESSAGES[1],
    },
    {
      ...HEALTH_TOOL_LINKS.MESSAGES[2],
    },
  ];

  const medicalRecordsLinks = HEALTH_TOOL_LINKS.MEDICAL_RECORDS;

  const myVaHealthBenefitsLinks = [
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
    registered && {
      href: '/my-health/update-benefits-information-form-10-10ezr/introduction',
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
  ].filter(isLinkData);

  const moreResourcesLinks = [
    featureToggles[FEATURE_FLAG_NAMES.mhvVaHealthChatEnabled] && {
      href: 'https://eauth.va.gov/MAP/users/v2/landing?redirect_uri=/cirrusmd/',
      text: 'Chat live with a health professional on VA Health Chat',
    },
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
  ].filter(isLinkData);

  const spotlightLinks = [
    {
      text: 'Make the Most of Your VA Appointment',
      href: mhvUrl(authdWithSSOe, 'ss20240415-make-most-your-va-appointment'),
    },
    {
      text: 'VA Health Care Expands to Millions of Veterans',
      href: mhvUrl(authdWithSSOe, 'ss20240315-va-health-care-expands-millions'),
    },
    {
      text: 'Hearing Aids Connect with Telehealth',
      href: mhvUrl(authdWithSSOe, 'ss20211015-fix-your-hearing-aid-over-video'),
    },
  ];

  const cards = [
    {
      title: HEALTH_TOOL_HEADINGS.APPOINTMENTS,
      icon: 'calendar_today',
      links: HEALTH_TOOL_LINKS.APPOINTMENTS,
    },
    {
      title: HEALTH_TOOL_HEADINGS.MESSAGES,
      icon: 'forum',
      links: messagesLinks,
    },
    {
      title: HEALTH_TOOL_HEADINGS.MEDICATIONS,
      icon: 'pill',
      links: HEALTH_TOOL_LINKS.MEDICATIONS,
    },
    {
      title: HEALTH_TOOL_HEADINGS.MEDICAL_RECORDS,
      icon: 'note_add',
      links: medicalRecordsLinks,
    },
    {
      title: HEALTH_TOOL_HEADINGS.PAYMENTS,
      icon: 'attach_money',
      iconClasses: 'vads-u-margin-right--0 vads-u-margin-left--neg0p5',
      links: HEALTH_TOOL_LINKS.PAYMENTS,
    },
    {
      title: HEALTH_TOOL_HEADINGS.MEDICAL_SUPPLIES,
      icon: 'medical_services',
      links: HEALTH_TOOL_LINKS.MEDICAL_SUPPLIES,
    },
  ];

  const hubs = [
    {
      title: registered ? 'My VA health benefits' : 'VA health benefits',
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
  isLinkData,
  resolveLandingPageLinks,
  resolveUnreadMessageAriaLabel,
};
