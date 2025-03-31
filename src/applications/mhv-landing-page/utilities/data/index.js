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
  const messagesLinks = [...HEALTH_TOOL_LINKS.MESSAGES];
  if (messagesLinks.length > 0)
    messagesLinks[0].ariaLabel = unreadMessageAriaLabel;

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
      href: '/health-care/get-health-id-card/',
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
      text: 'Tips for Creating Your Login.gov or ID.me Account',
      href: mhvUrl(
        authdWithSSOe,
        'ss20241209-tips-creating-login-gov-id-me-account',
      ),
    },
    {
      text: 'Try the New Medical Records Tool on VA.gov',
      href: mhvUrl(
        authdWithSSOe,
        'ss20250102-try-new-medical-records-tool-on-va-gov',
      ),
    },
    {
      text: '6 Healthy Eating Habits to Start This Year',
      href: mhvUrl(
        authdWithSSOe,
        'ss20210423-healthy-eating-habits-to-start-now',
      ),
    },
  ];

  const paymentsLinks = (featureToggles[
    FEATURE_FLAG_NAMES.travelPaySubmitMileageExpense
  ]
    ? [
        HEALTH_TOOL_LINKS.PAYMENTS[0],
        {
          href: '/my-health/travel-pay/claims',
          text: 'Check travel reimbursement claim status',
        },
      ]
    : [
        HEALTH_TOOL_LINKS.PAYMENTS[0],
        featureToggles[FEATURE_FLAG_NAMES.travelPayPowerSwitch] && {
          href: '/my-health/travel-pay/claims',
          text: 'Check travel reimbursement claim status',
        },
        HEALTH_TOOL_LINKS.PAYMENTS[1],
      ]
  ).filter(isLinkData);

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
      introduction:
        'Get quick, easy access to your medical records. Now you can print or download what you need, when you need it.',
      links: HEALTH_TOOL_LINKS.MEDICAL_RECORDS,
    },
    {
      title: HEALTH_TOOL_HEADINGS.PAYMENTS,
      icon: 'attach_money',
      iconClasses: 'vads-u-margin-right--0 vads-u-margin-left--neg0p5',
      links: paymentsLinks,
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
