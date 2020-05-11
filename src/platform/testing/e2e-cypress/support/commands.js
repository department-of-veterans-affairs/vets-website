// Mock user login
Cypress.Commands.add('initUserMock', (token, level) => {
  /* eslint-disable camelcase */
  cy.request('POST', 'http://localhost:3000/mock', {
    ...{
      path: '/v0/user',
      verb: 'get',
      value: {
        data: {
          attributes: {
            profile: {
              sign_in: {
                service_name: 'idme',
              },
              email: 'fake@fake.com',
              loa: { current: level },
              first_name: 'Jane',
              middle_name: '',
              last_name: 'Doe',
              gender: 'F',
              birth_date: '1985-01-01',
              verified: level === 3,
            },
            veteran_status: {
              status: 'OK',
              is_veteran: true,
              served_in_military: true,
            },
            in_progress_forms: [
              {
                // form: VA_FORM_IDS.FORM_10_10EZ,
                metadata: {},
              },
            ],
            // prefills_available: [VA_FORM_IDS.FORM_21_526EZ],
            services: [
              'facilities',
              'hca',
              'edu-benefits',
              'evss-claims',
              'form526',
              'user-profile',
              'health-records',
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
      },
    },
    token,
  })
    .its('body')
    .then(() => {
      //
    });
  /* eslint-enable camelcase */
});
