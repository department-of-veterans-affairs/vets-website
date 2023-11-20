import React from 'react';
import { mhvUrl } from '@department-of-veterans-affairs/platform-site-wide/utilities';
// Links to MHV subdomain need to use `mhvUrl`. Va.gov links can just be paths
// Link objects with an `oldHref` need to be resolved via resolveToggleLink or resolveLinkCollection
// Links with only an href should be links to Va.gov pages and shouldn't need resolving

const hasOwn = (object, prop) =>
  Object.prototype.hasOwnProperty.call(object, prop);

const resolveToggleLink = (link, featureToggles) => {
  const { text, oldHref, href: newHref, toggle, ariaLabel } = link;
  let href = newHref || oldHref;
  // If the link's toggle matches a feature toggle
  // check if the toggle is on. If so, show new href. Otherwise show old href
  if (hasOwn(featureToggles, toggle)) {
    const showNewHref = featureToggles[toggle] === true;
    href = showNewHref ? newHref : oldHref;
  }
  return { href, text, key: toggle, ariaLabel };
};

const countUnreadMessages = folders => {
  let unreadMessageCount = 0;
  if (Array.isArray(folders?.data)) {
    unreadMessageCount = folders.data.reduce((accumulator, currentFolder) => {
      return accumulator + currentFolder.attributes?.unreadCount;
    }, 0);
  } else if (folders?.data?.attributes?.unreadCount > 0) {
    unreadMessageCount = folders.data.attributes.unreadCount;
  }

  return unreadMessageCount;
};

const resolveLinkCollection = (links, featureToggles) =>
  links.map(l => resolveToggleLink(l, featureToggles));

const resolveUnreadMessageAriaLabel = unreadMessageCount => {
  let unreadMessageAriaLabel = null;
  if (unreadMessageCount > 0) {
    unreadMessageAriaLabel = 'You have unread messages. Go to your inbox.';
  }
  return unreadMessageAriaLabel;
};

const resolveLandingPageLinks = (
  authdWithSSOe = false,
  featureToggles,
  unreadMessageCount = 0,
  unreadMessageAriaLabel,
  userHasHealthData = false,
) => {
  // Appointments section points to VAOS on va.gov
  const appointmentLinks = [
    {
      href: '/health-care/schedule-view-va-appointments/',
      text: 'Schedule and manage appointments',
      toggle: null,
    },
    {
      href: '/health-care/schedule-view-va-appointments/appointments',
      text: 'Upcoming VA appointments',
      toggle: null,
    },
    {
      href: '/find-locations',
      text: 'Find VA locations',
      toggle: null,
    },
  ];

  const messagesLinks = resolveLinkCollection(
    [
      {
        href: null,
        oldHref: mhvUrl(authdWithSSOe, 'secure-messaging'),
        text: (
          <span>
            Inbox
            {unreadMessageCount > 0 && (
              <span className="indicator" role="status" />
            )}
          </span>
        ),
        toggle: null,
        ariaLabel: unreadMessageAriaLabel,
      },
      {
        href: null,
        oldHref: mhvUrl(authdWithSSOe, 'compose-message'),
        text: 'Compose message',
        toggle: null,
      },
      {
        href: null,
        oldHref: mhvUrl(authdWithSSOe, 'manage-folders'),
        text: 'Manage folders',
        toggle: null,
      },
    ],
    featureToggles,
  );

  const medicationsLinks = resolveLinkCollection(
    [
      {
        href: null,
        oldHref: mhvUrl(authdWithSSOe, 'prescription_refill'),
        text: 'Refill VA prescriptions',
        toggle: null,
      },
      {
        href: null,
        oldHref: mhvUrl(authdWithSSOe, '/prescription-tracking'),
        text: 'Track prescription delivery',
        toggle: null,
      },
      {
        href: null,
        oldHref: mhvUrl(authdWithSSOe, '/my-complete-medications-list'),
        text: 'Medications and allergies',
        toggle: null,
      },
    ],
    featureToggles,
  );

  const healthRecordsLinks = resolveLinkCollection(
    [
      {
        href: null,
        oldHref: mhvUrl(authdWithSSOe, '/download-my-data'),
        text: 'Download medical record (Blue Button®)',
        toggle: null,
      },
      {
        href: null,
        oldHref: mhvUrl(authdWithSSOe, '/labs-tests'),
        text: 'Lab and test results',
        toggle: null,
      },
      {
        href: null,
        oldHref: mhvUrl(authdWithSSOe, '/health-history'),
        text: 'Health history',
        toggle: null,
      },
    ],
    featureToggles,
  );

  const paymentsLinks = [
    {
      href: 'https://dvagov-btsss.dynamics365portals.us/signin',
      oldHref: null,
      text: 'File a claim for travel reimbursement',
      toggle: null,
    },
    {
      href: '/manage-va-debt/summary/copay-balances',
      oldHref: null,
      text: 'Pay copay bills',
      toggle: null,
    },
  ];

  const medicalSuppliesLinks = [
    {
      href: '/health-care/order-hearing-aid-batteries-and-accessories',
      text: 'Order hearing aid batteries and accessories',
    },
    {
      href: '/health-care/order-cpap-supplies/',
      text: 'Order CPAP supplies',
    },
    {
      href: '/health-care/order-prosthetic-socks/',
      text: 'Order prosthetic socks',
    },
  ];

  const myVaHealthBenefitsLinks = resolveLinkCollection(
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
        href: '/health-care/update-health-information/',
        text: 'Update health benefits info (10-10EZR)',
      },
      {
        href: null,
        oldHref: mhvUrl(authdWithSSOe, 'health-information-card'),
        text: 'Veteran health information card',
        toggle: null,
      },
      // {
      //   href: '#FIXME-need-link',
      //   text: 'Download my IRS 1095-B form',
      // },
    ],
    featureToggles,
  );

  const moreResourcesLinks = resolveLinkCollection(
    [
      {
        href: '/resources/the-pact-act-and-your-va-benefits/',
        text: 'The PACT Act and your benefits',
      },
      {
        oldHref: mhvUrl(authdWithSSOe, 'check-your-mental-health'),
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
        href: mhvUrl(false, 'ss20200320-va-video-connect'),
        text: 'How to use VA Video Connect',
      },
    ],
    featureToggles,
  );

  // Spotlight links are non-authed, so we always pass `false` to mhvUrl
  const spotlightLinks = resolveLinkCollection(
    [
      {
        text: 'Pain? Try yoga',
        href: null,
        oldHref: mhvUrl(false, 'ss20211012-pain-yoga-may-help'),
        toggle: null,
      },
      {
        text: 'Where are my labs and test results?',
        href: null,
        oldHref: mhvUrl(false, 'ss20180716-where-are-va-lab-test-results'),
        toggle: null,
      },
      {
        text: 'Heart health with diabetes',
        href: null,
        oldHref: mhvUrl(false, 'ss20220415-diabetes-and-a-healthy-heart'),
        toggle: null,
      },
    ],
    featureToggles,
  );

  const cards = [
    {
      title: 'Appointments',
      icon: 'calendar',
      links: appointmentLinks,
    },
    {
      title: 'Messages',
      icon: 'comments',
      links: messagesLinks,
    },
    {
      title: 'Medications',
      icon: 'prescription-bottle',
      links: medicationsLinks,
    },
    {
      title: 'Health records',
      icon: 'file-medical',
      links: healthRecordsLinks,
    },
    {
      title: 'Payments',
      icon: 'dollar-sign',
      links: paymentsLinks,
    },
    {
      title: 'Medical supplies',
      icon: 'deaf',
      links: medicalSuppliesLinks,
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
  resolveToggleLink,
  resolveUnreadMessageAriaLabel,
};
