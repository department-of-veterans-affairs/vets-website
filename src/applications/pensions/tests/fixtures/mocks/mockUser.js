import { addDays } from 'date-fns';

const { VA_FORM_IDS } = require('platform/forms/constants');

/* eslint-disable camelcase */
const mockUser = {
  data: {
    attributes: {
      profile: {
        sign_in: {
          service_name: 'idme',
        },
        email: 'fake@fake.com',
        loa: { current: 3 },
        first_name: 'Jane',
        middle_name: '',
        last_name: 'Doe',
        gender: 'F',
        birth_date: '1985-01-01',
        verified: true,
      },
      veteran_status: {
        status: 'OK',
        is_veteran: true,
      },
      in_progress_forms: [
        {
          form: VA_FORM_IDS.FORM_10_10EZ,
          metadata: {},
        },
        {
          form: VA_FORM_IDS.FORM_22_1995,
          metadata: {},
        },
        {
          form: VA_FORM_IDS.FORM_21P_530,
          metadata: {},
        },
        {
          form: VA_FORM_IDS.FORM_21P_527EZ,
          metadata: {
            last_updated: 1506792, // unix time
            expires_at: Math.floor(addDays(new Date(), 1).getTime() / 1000), // unix time
            saved_at: 1506792808, // JS time (ms)
          },
        },
      ],
      prefills_available: [],
      services: [
        'facilities',
        'hca',
        'edu-benefits',
        'evss-claims',
        'user-profile',
        'rx',
        'messaging',
      ],
      va_profile: {
        status: 'OK',
        birth_date: '19511118',
        family_name: 'Hunter',
        gender: 'M',
        given_names: ['Julio', 'E'],
        active_status: 'active',
      },
    },
  },
  meta: { errors: null },
};
/* eslint-enable camelcase */

export default mockUser;
