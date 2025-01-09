const actionPrefix = 'MHV Secondary Nav';

export const mhvNavItems = [
  {
    title: 'My HealtheVet',
    actionName: `${actionPrefix} - My HealtheVet`,
    icon: 'home',
    href: '/my-health',
  },
  {
    title: 'Appointments',
    actionName: `${actionPrefix} - Appointments`,
    abbreviation: 'Appts',
    ariaLabel: 'Appointments',
    icon: 'calendar_today',
    href: `/my-health/appointments`,
  },
  {
    title: 'Messages',
    actionName: `${actionPrefix} - Messages`,
    icon: 'forum',
    href: `/my-health/secure-messages`,
  },
  {
    title: 'Medications',
    abbreviation: 'Meds',
    actionName: `${actionPrefix} - Medications`,
    icon: 'pill',
    href: '/my-health/medications/about',
    appRootUrl: '/my-health/medications',
  },

  {
    title: 'Records',
    abbreviation: 'Records',
    actionName: `${actionPrefix} - Medical Records`,
    icon: 'note_add',
    href: '/my-health/medical-records',
  },
  {
    title: 'Travel Reimbursement',
    abbreviation: null,
    actionName: `${actionPrefix} - Travel Reimbursement`,
    icon: 'pill',
    href: '/my-health/travel-reimbursement',
  },
];
