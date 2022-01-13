// import moment from 'moment';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { CSP_IDS } from 'platform/user/authentication/constants';
/* eslint-disable camelcase */

const mockUser = {
  data: {
    attributes: {
      profile: {
        sign_in: {
          service_name: CSP_IDS.ID_ME,
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
        is_veteran: true,
        status: 'OK',
        served_in_military: true,
      },
      in_progress_forms: [
        {
          form: VA_FORM_IDS.FORM_XX_123,
          last_updated: 1501608808,
          metadata: {
            last_updated: 1506792808,
            expires_at: 9999999999,
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

export default mockUser;
