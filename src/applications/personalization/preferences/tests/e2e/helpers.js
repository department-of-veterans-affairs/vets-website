const mock = require('platform/testing/e2e/mock-helpers');

export function initEmptyGetMock(token) {
  mock(token, {
    path: '/v0/user/preferences',
    verb: 'get',
    value: {
      data: {
        id: '',
        type: 'arrays',
        attributes: {
          userPreferences: [
            {
              code: 'benefits',
              title:
                'the benefits a veteran is interested in, so VA.gov can help you apply for them',
              userPreferences: [],
            },
          ],
        },
      },
    },
  });
}

export function initChoicesGetMock(token) {
  mock(token, {
    path: '/v0/user/preferences/choices/benefits',
    verb: 'get',
    value: {
      data: {
        id: '1',
        type: 'preferences',
        attributes: {
          code: 'benefits',
          title:
            'the benefits a veteran is interested in, so VA.gov can help you apply for them',
          preferenceChoices: [
            {
              code: 'health-care',
              description: 'Get health care coverage',
            },
            {
              code: 'disability',
              description:
                'Find benefits for an illness or injury related to a veterans service',
            },
            {
              code: 'appeals',
              description:
                'Appeal the decision VA made on veterans disability claim',
            },
            {
              code: 'education-training',
              description:
                'GI Bill to help pay for college, training, or certification',
            },
            {
              code: 'careers-employment',
              description:
                'Find a job, build skills, or get support for my own business',
            },
            {
              code: 'pension',
              description:
                'Get financial support for veterans disability or for care related to aging',
            },
            {
              code: 'housing-assistance',
              description:
                'Find, buy, build, modify, or refinance a place to live',
            },
            {
              code: 'life-insurance',
              description: 'Learn about veterans life insurance options',
            },
            {
              code: 'burials-memorials',
              description:
                'Apply for burial in a VA cemetery or for allowances to cover burial costs',
            },
            {
              code: 'family-caregiver-benefits',
              description:
                'Learn about benefits for family members and caregivers',
            },
          ],
        },
      },
    },
  });
}

export function initDeleteMock(token) {
  mock(token, {
    path: '/v0/user/preferences/benefits/delete_all',
    verb: 'delete',
    value: {
      value: {
        data: {
          id: 'string',
          type: 'string',
          attributes: {
            preferenceCode: 'string',
            userPreferences: [],
          },
        },
      },
    },
  });
}

export function initHealthPostMock(token) {
  mock(token, {
    path: '/v0/user/preferences',
    verb: 'post',
    value: {
      value: {
        data: {
          id: '',
          type: 'arrays',
          attributes: {
            userPreferences: [
              {
                code: 'benefits',
                title:
                  'the benefits a veteran is interested in, so VA.gov can help you apply for them',
                userPreferences: [
                  {
                    code: 'health-care',
                    description: 'Get health care coverage',
                  },
                ],
              },
            ],
          },
        },
      },
    },
  });
}

export function initHealthGetMock(token) {
  mock(token, {
    path: '/v0/user/preferences',
    verb: 'get',
    value: {
      data: {
        id: '',
        type: 'arrays',
        attributes: {
          userPreferences: [
            {
              code: 'benefits',
              title:
                'the benefits a veteran is interested in, so VA.gov can help you apply for them',
              userPreferences: [
                {
                  code: 'health-care',
                  description: 'Get health care coverage',
                },
              ],
            },
          ],
        },
      },
    },
  });
}

export function initCareersAndEducationGetMock(token) {
  mock(token, {
    path: '/v0/user/preferences',
    verb: 'get',
    value: {
      data: {
        id: '',
        type: 'arrays',
        attributes: {
          userPreferences: [
            {
              code: 'benefits',
              title:
                'the benefits a veteran is interested in, so VA.gov can help you apply for them',
              userPreferences: [
                {
                  code: 'careers-employment',
                  description:
                    'Find a job, build skills, or get support for my own business',
                },
                {
                  code: 'education-training',
                  description:
                    'GI Bill to help pay for college, training, or certification',
                },
              ],
            },
          ],
        },
      },
    },
  });
}
