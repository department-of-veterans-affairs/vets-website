import { addDays, format } from 'date-fns';

export default {
  data: [
    {
      id: '8a4812b77035101201703a2086750033',
      type: 'cc_appointments',
      attributes: {
        appointmentRequestId: '8a4812b77035101201703a2086750033',
        distanceEligibleConfirmed: true,
        name: { firstName: 'Dr', lastName: 'Hyde' },
        providerPractice: 'Jeckle and Hyde',
        providerPhone: '(407) 555-1212',
        address: {
          street: '123 Main Street',
          city: 'Orlando',
          state: 'FL',
          zipCode: '32826',
        },
        instructionsToVeteran: 'Date test',
        appointmentTime: format(addDays(Date.now(), 40), 'MM/dd/yyyy hh:mm:ss'),
        timeZone: '-06:00 MDT',
      },
    },
    {
      id: '8a4885896a22f88f016a2c8834b1005d',
      type: 'cc_appointments',
      attributes: {
        appointmentRequestId: '8a4885896a22f88f016a2c8834b1005d',
        distanceEligibleConfirmed: true,
        name: { firstName: '', lastName: '' },
        providerPractice: 'Atlantic Medical Care',
        providerPhone: '(407) 555-1212',
        address: {
          street: '123 Main Street',
          city: 'Orlando',
          state: 'FL',
          zipCode: '32826',
        },
        instructionsToVeteran: 'Please arrive 15 minutes ahead of appointment.',
        appointmentTime: format(addDays(Date.now(), 50), 'MM/dd/yyyy hh:mm:ss'),
        timeZone: '+08:00 WITA',
      },
    },
    {
      id: '8a4885896a22f88f016a2cb7f5de0062',
      type: 'cc_appointments',
      attributes: {
        appointmentRequestId: '8a4885896a22f88f016a2cb7f5de0062',
        distanceEligibleConfirmed: true,
        name: { firstName: 'Rick', lastName: 'Katz' },
        providerPractice: 'My Eye Dr',
        providerPhone: '(703) 555-1264',
        address: {
          street: '123',
          city: 'Burke',
          state: 'VA',
          zipCode: '20151',
        },
        instructionsToVeteran: 'Bring your glasses',
        appointmentTime: format(addDays(Date.now(), 80), 'MM/dd/yyyy hh:mm:ss'),
        timeZone: 'UTC',
      },
    },
    {
      id: '8a4888116a45cbe3016a45f482fb0002',
      type: 'cc_appointments',
      attributes: {
        appointmentRequestId: '8a4888116a45cbe3016a45f482fb0002',
        distanceEligibleConfirmed: true,
        name: { firstName: '', lastName: '' },
        providerPractice: 'Audiologists of Dayton',
        providerPhone: '(703) 345-2400',
        address: {
          street: '123 Main St',
          city: 'dayton',
          state: 'OH',
          zipCode: '45405',
        },
        instructionsToVeteran:
          'Please arrive 20 minutes before the start of your appointment',
        appointmentTime: format(addDays(Date.now(), 90), 'MM/dd/yyyy hh:mm:ss'),
        timeZone: '-09:00 AKST',
      },
    },
  ],
  meta: {
    pagination: {
      currentPage: 0,
      perPage: 0,
      totalPages: 0,
      totalEntries: 0,
    },
    errors: [],
  },
};
