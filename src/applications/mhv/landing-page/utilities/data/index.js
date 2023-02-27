import { mhvUrl } from '@department-of-veterans-affairs/platform-site-wide/utilities';
// Links to MHV subdomain need to use `mhvUrl`. Va.gov links can just be paths

const hasOwn = (object, prop) =>
  Object.prototype.hasOwnProperty.call(object, prop);

const resolveToggleLink = (link, featureToggles) => {
  const { text, oldHref, href: newHref, toggle } = link;
  let href = newHref || oldHref;
  // If the link's toggle matches a feature toggle
  // check if the toggle is on. If so, show new href. Otherwise show old href
  if (hasOwn(featureToggles, toggle)) {
    const showNewHref = featureToggles[toggle] === true;
    href = showNewHref ? newHref : oldHref;
  }
  return { href, text, key: toggle };
};

const appointmentLinks = [
  {
    href: null,
    oldHref: mhvUrl(true, '/schedule-or-cancel-a-va-appointment-online'),
    text: 'Schedule and manage appointments',
    toggle: null,
  },
  {
    href: null,
    oldHref: mhvUrl(true, 'appointments'),
    text: 'Your VA appointments',
    toggle: null,
  },
  {
    href: '/find-locations',
    oldHref: null,
    text: 'Find VA locations',
    toggle: null,
  },
];

const messagesLinks = [
  {
    href: null,
    oldHref: mhvUrl(true, 'compose-message'),
    text: 'Compose message',
    toggle: null,
  },
  {
    href: null,
    oldHref: mhvUrl(true, '/inbox'),
    text: 'Inbox',
    toggle: null,
  },
  {
    href: null,
    oldHref: mhvUrl(true, '/manage-folders'),
    text: 'Manage folders',
    toggle: null,
  },
];

const medicationsLinks = [
  {
    href: null,
    oldHref: mhvUrl(true, 'prescription_refill'),
    text: 'Refill VA prescriptions',
    toggle: null,
  },
  {
    href: null,
    oldHref: mhvUrl(true, '/prescription-tracking'),
    text: 'Track prescription delivery',
    toggle: null,
  },
  {
    href: null,
    oldHref: mhvUrl(true, '/my-complete-medications-list'),
    text: 'My medications and allergies',
    toggle: null,
  },
];

const healthRecordsLinks = [
  {
    href: null,
    oldHref: mhvUrl(true, '/download-my-data'),
    text: 'Download my medical record (Blue Button)',
    toggle: null,
  },
  {
    href: null,
    oldHref: mhvUrl(true, '/labs-tests'),
    text: 'Lab and test results',
    toggle: null,
  },
  {
    href: null,
    oldHref: mhvUrl(true, '/health-history'),
    text: 'Health history',
    toggle: null,
  },
];

const paymentsLinks = [
  {
    href: 'https://dvagov-btsss.dynamics365portals.us/signin',
    oldHref: null,
    text: 'File a claim for travel reimbursement',
    toggle: null,
  },
  {
    href: 'https://pay.gov/public/form/start/25987221',
    oldHref: null,
    text: 'Pay your copay bill',
    toggle: null,
  },
];

const medicalSuppliesLinks = [
  {
    href: '/health-care/order-hearing-aid-batteries-and-accessories',
    oldHref: null,
    text: 'Order hearing aid batteries and accessories',
    toggle: null,
  },
  {
    href: '/health-care/order-prosthetic-socks/',
    oldHref: null,
    text: 'Order prosthetic socks',
    toggle: null,
  },
];

const myVaHealthBenefitsLinks = [
  {
    href: '/manage-va-debt/summary/copay-balances/',
    text: 'Current veteran copay rates',
  },
  {
    href: '#FIXME-need-link',
    text: 'Mental health services',
  },
  {
    href: '#FIXME-need-link',
    text: 'Dental care',
  },
  {
    href: '#FIXME-need-link',
    text: 'Community Care',
  },
  {
    href: '#FIXME-need-link',
    text: 'Update my health benefits info (10-10EZR)',
  },
  {
    href: '#FIXME-need-link',
    text: 'My health information card',
  },
  {
    href: '#FIXME-need-link',
    text: 'Download my IRS 1095-B form',
  },
];

const moreResourcesLinks = [
  {
    href: '#FIXME-need-link',
    text: 'The PACT Act and your benefits',
  },
  {
    href: '#FIXME-need-link',
    text: 'Check your mental health',
  },
  {
    href: '#FIXME-need-link',
    text: 'Veterans Health Library',
  },
  {
    href: '#FIXME-need-link',
    text: 'Healthy Living Centers',
  },
  {
    href: '#FIXME-need-link',
    text: 'The My HealtheVet community',
  },
  {
    href: '#FIXME-need-link',
    text: "VA's Whole Health living",
  },
  {
    href: '#FIXME-need-link',
    text: 'How to use VA Video Connect',
  },
];

const spotlightLinks = [
  {
    href: '#FIXME-need-link',
    text: 'Five Exercises for Balance',
  },
  {
    href: '#FIXME-need-link',
    text: 'Recognizing a Heart Attack',
  },
  {
    href: '#FIXME-need-link',
    text: 'Get the New Toxic Exposure Screening',
  },
  {
    href: '#FIXME-need-link',
    text: 'Need Internet or a Tablet for Appointments?',
  },
  {
    href: '#FIXME-need-link',
    text: 'Top Five Health Threats to Men',
  },
];

// The cards structure represents rows and columns of cards as a multidimensonal array
const data = {
  cards: [
    {
      title: 'Appoinments',
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
      title: 'Medical supplies and equipment',
      icon: 'deaf',
      links: medicalSuppliesLinks,
    },
  ],
  hub: [
    {
      title: 'My VA health benefits',
      links: myVaHealthBenefitsLinks,
    },
    {
      title: 'More resources and support',
      links: moreResourcesLinks,
    },
    {
      title: 'In the Spotlight',
      links: spotlightLinks,
    },
  ],
};

export { data as default, resolveToggleLink };
