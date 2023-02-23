import { mhvBaseUrl } from '@department-of-veterans-affairs/platform-site-wide/utilities';
// The cards structure represents rows and columns of cards as a multidimensonal array
// Links to MHV subdomain need to use `mhvUrl`. Va.gov links can just be paths

const data = {
  cards: [
    [
      {
        title: 'Appoinments',
        icon: 'calendar',
        links: [
          {
            href: '/schedule-or-cancel-a-va-appointment-online',
            text: 'Schedule and manage appointments',
            migrated: false,
          },
          {
            href: '/mhv-portal-web/appointments',
            text: 'Your VA appointments',
            migrated: false,
          },
          {
            href: '/find-locations',
            text: 'Find VA locations',
            migrated: true,
          },
        ],
      },
      {
        title: 'Messages',
        icon: 'comments',
        links: [
          {
            href: '/mhv-portal-web/compose-message',
            text: 'Compose message',
            migrated: false,
          },
          {
            href: '/mhv-portal-web/inbox',
            text: 'Inbox',
            migrated: false,
          },
          {
            href: '/mhv-portal-web/manage-folders',
            text: 'Manage folders',
            migrated: false,
          },
        ],
      },
    ],
    [
      {
        title: 'Medications',
        icon: 'prescription-bottle',
        links: [
          {
            href: '/refill-prescriptions',
            text: 'Refill VA prescriptions',
            migrated: false,
          },
          {
            href: '/prescription-tracking',
            text: 'Track prescription delivery',
            migrated: false,
          },
          {
            href: '/my-complete-medications-list',
            text: 'My medications and allergies',
            migrated: false,
          },
        ],
      },
      {
        title: 'Health records',
        icon: 'file-medical',
        links: [
          {
            href: '/download-my-data',
            text: 'Download my medical record (Blue Button)',
            migrated: false,
          },
          {
            href: '/labs-tests',
            text: 'Lab and test results',
            migrated: false,
          },
          {
            href: '/mhv-portal-web/health-history',
            text: 'Health history',
            migrated: false,
          },
        ],
      },
    ],
    [
      {
        title: 'Payments',
        icon: 'dollar-sign',
        links: [
          {
            href: 'https://dvagov-btsss.dynamics365portals.us/signin',
            text: 'File a claim for travel reimbursement',
            migrated: false,
          },
          {
            href: 'https://pay.gov/public/form/start/25987221',
            text: 'Pay your copay bill',
            migrated: false,
          },
        ],
      },
      {
        title: 'Medical supplies and equipment',
        icon: 'deaf',
        links: [
          {
            href: '#fixme-hearing-aids',
            text: 'Order hearing aid batteries and accessories',
            migrated: false,
          },
          {
            href: '#fixme-prosthetic-socks',
            text: 'Order prosthetic socks',
            migrated: false,
          },
        ],
      },
    ],
  ],
  hub: [
    {
      title: 'My VA health benefits',
      links: [
        {
          href: '',
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
      ],
    },
    {
      title: 'More resources and support',
      links: [
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
      ],
    },
    {
      title: 'In the Spotlight',
      links: [
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
      ],
    },
  ],
};

const normalizeLinks = d => {
  const nCards = d.cards.map(row => {
    return row.map(card => {
      // TODO: Process unmigrated card links
      const newLinks = card.links.map(link => {
        const updatedLink = { ...link };
        if (link?.migrated === false && !link.href.startsWith('http')) {
          updatedLink.href = `${mhvBaseUrl()}${link.href}`;
        }
        return updatedLink;
      });
      return { ...card, links: newLinks };
    });
  });
  return { ...d, cards: nCards };
};

export default normalizeLinks(data);
