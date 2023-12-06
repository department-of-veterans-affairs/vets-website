import { add, format } from 'date-fns';

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
        appointmentTime: format(
          add(Date.now(), { minutes: 1 }),
          'MM/dd/yyyy hh:mm:ss',
        ),
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
        appointmentTime: format(
          add(Date.now(), { days: 10 }),
          'MM/dd/yyyy hh:mm:ss',
        ),
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
        appointmentTime: format(
          add(Date.now(), { days: 25 }),
          'MM/dd/yyyy hh:mm:ss',
        ),
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
        appointmentTime: format(
          add(Date.now(), { days: 31 }),
          'MM/dd/yyyy hh:mm:ss',
        ),
        timeZone: '-09:00 AKST',
      },
    },
    {
      id: '8a4888116a45cbe3016a4699b8b0000c',
      type: 'cc_appointments',
      attributes: {
        appointmentRequestId: '8a4888116a45cbe3016a4699b8b0000c',
        distanceEligibleConfirmed: true,
        name: { firstName: '', lastName: '' },
        providerPractice: 'Audiology',
        providerPhone: '(703) 345-2400',
        address: {
          street: '456 River St',
          city: 'Dayton',
          state: 'OH',
          zipCode: '45404',
        },
        instructionsToVeteran: 'Please arrive 20 min early',
        appointmentTime: format(
          add(Date.now(), { days: 60 }),
          'MM/dd/yyyy hh:mm:ss',
        ),
        timeZone: '-04:00 EDT',
      },
    },
    {
      id: '8a4885896a22f88f016a36dc98460081',
      type: 'cc_appointments',
      attributes: {
        appointmentRequestId: '8a4885896a22f88f016a36dc98460081',
        distanceEligibleConfirmed: true,
        name: { firstName: 'Rp', lastName: 'test' },
        providerPractice: 'RP location',
        providerPhone: '(301) 916-1234',
        address: {
          street: '100 newcut rd',
          city: 'clarksburg',
          state: 'MD',
          zipCode: '20874',
        },
        instructionsToVeteran: 'Come on time appt',
        appointmentTime: format(
          add(Date.now(), { days: 80 }),
          'MM/dd/yyyy hh:mm:ss',
        ),
        timeZone: '-04:00 EDT',
      },
    },
    {
      id: '8a4888506a7372fb016a791b01730037',
      type: 'cc_appointments',
      attributes: {
        appointmentRequestId: '8a4888506a7372fb016a791b01730037',
        distanceEligibleConfirmed: true,
        name: { firstName: 'Nancy', lastName: 'Green' },
        providerPractice: 'Cheyenne',
        providerPhone: '(999) 999-9999',
        address: {
          street: '111 Test Account',
          city: 'tampa',
          state: 'FL',
          zipCode: '33625',
        },
        instructionsToVeteran: 'Test Account',
        appointmentTime: format(
          add(Date.now(), { days: 100 }),
          'MM/dd/yyyy hh:mm:ss',
        ),
        timeZone: '-06:00 MDT',
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
