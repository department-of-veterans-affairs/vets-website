import { mhvUrl } from '@department-of-veterans-affairs/platform-site-wide/utilities';
// Links to MHV subdomain need to use `mhvUrl`. Va.gov links can just be paths

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
    href: '',
    text: 'Mental health services',
  },
  {
    href: '',
    text: 'Dental care',
  },
  {
    href: '',
    text: 'Community Care',
  },
  {
    href: '',
    text: 'Update my health benefits info (10-10EZR)',
  },
  {
    href: '',
    text: 'My health information card',
  },
  {
    href: '',
    text: 'Download my IRS 1095-B form',
  },
];

const moreResourcesLinks = [
  {
    href: '',
    text: 'The PAC Act and your benefits',
  },
  {
    href: '',
    text: 'Check your mental health',
  },
  {
    href: '',
    text: 'Veterans Health Library',
  },
  {
    href: '',
    text: 'Healthy Living Centers',
  },
  {
    href: '',
    text: 'The My HealtheVet community',
  },
  {
    href: '',
    text: "VA's Whole Health living",
  },
  {
    href: '',
    text: 'How to use VA Video Connect',
  },
];

const spotlightLinks = [
  {
    href: '',
    text: 'Five Exercises for Balance',
  },
  {
    href: '',
    text: 'Recognizing a Heart Attack',
  },
  {
    href: '',
    text: 'Get the New Toxic Exposure Screening',
  },
  {
    href: '',
    text: 'Need Internet or a Tablet for Appointments?',
  },
  {
    href: '',
    text: 'Top Five Health Threats to Men',
  },
  {
    href: '',
    text: '',
  },
  {
    href: '',
    text: '',
  },
];

// The cards structure represents rows and columns of cards as a multidimensonal array
const data = {
  cards: [
    [
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
    ],
    [
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
    ],
    [
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

export default data;
