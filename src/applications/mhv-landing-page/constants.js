const { entries, freeze, values } = Object;

export const HEALTH_TOOL_HEADINGS = freeze({
  APPOINTMENTS: 'Appointments',
  MESSAGES: 'Messages',
  MEDICATIONS: 'Medications',
  MEDICAL_RECORDS: 'Medical records',
  PAYMENTS: 'Payments',
  MEDICAL_SUPPLIES: 'Medical supplies',
});

export const HEALTH_TOOL_NAMES = freeze(values(HEALTH_TOOL_HEADINGS));

export const HEALTH_TOOL_LINKS = freeze({
  APPOINTMENTS: freeze([
    {
      href: '/my-health/appointments/schedule/type-of-care',
      text: 'Schedule a new appointment',
    },
    {
      href: '/health-care/schedule-view-va-appointments/appointments',
      text: 'Manage upcoming appointments',
    },
    {
      href: '/find-locations',
      text: 'Find VA locations',
    },
  ]),
  MESSAGES: freeze([
    {
      href: '/my-health/secure-messages/inbox/',
      text: 'Go to inbox',
    },
    {
      href: '/my-health/secure-messages/new-message/',
      text: 'Send a new message',
    },
    {
      href: '/my-health/secure-messages/folders/',
      text: 'Manage folders',
    },
  ]),
  MEDICATIONS: freeze([
    {
      href: '/my-health/medications/refill',
      text: 'Refill VA prescriptions',
    },
    {
      href: '/my-health/medications',
      text: 'Review medications',
    },
  ]),
  MEDICAL_RECORDS: freeze([
    {
      href: '/my-health/medical-records/download-all',
      text: 'Download medical record (Blue Button®)',
    },
    {
      href: '/my-health/medical-records/labs-and-tests',
      text: 'Lab and test results',
    },
  ]),
  PAYMENTS: freeze([
    {
      href: '/manage-va-debt/summary/copay-balances',
      text: 'Pay copay bills',
    },
    {
      href: 'https://dvagov-btsss.dynamics365portals.us/signin',
      text:
        'File a claim for travel reimbursement on the Beneficiary Travel Self-Service System website',
      isExternal: true,
    },
  ]),
  MEDICAL_SUPPLIES: freeze([
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
  ]),
});

export const HEALTH_TOOLS = entries(HEALTH_TOOL_HEADINGS).map(
  ([key, name]) => ({ name, links: HEALTH_TOOL_LINKS[key] }),
);
