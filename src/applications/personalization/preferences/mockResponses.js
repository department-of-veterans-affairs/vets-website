// response from GET v0/user/preferences
export const sampleUserPrefResponse = {
  data: {
    attributes: {
      userPreferences: [
        {
          code: 'benefits',
          title: 'benefits',
          userPreferences: [
            {
              code: 'health-care',
              description: 'health care',
            },
            {
              code: 'disability',
              description: 'disability',
            },
          ],
        },
      ],
    },
  },
};

// response from GET v0/user/preferences/choices/:code
export const sampleAllBenefitOptionsResponse = {
  data: {
    type: 'preferences',
    attributes: {
      code: 'benefits',
      title: 'Benefits',
      preferenceChoices: [
        {
          code: 'health-care',
          description: 'health care',
        },
        {
          code: 'disability',
          description: 'disability',
        },
        {
          code: 'appeals',
          description: 'appeals',
        },
        {
          code: 'education-training',
          description: 'education and training',
        },
        {
          code: 'careers-employment',
          description: 'careers and employment',
        },
        {
          code: 'pension',
          description: 'pensions',
        },
        {
          code: 'housing-assistance',
          description: 'housing assistance',
        },
        {
          code: 'life-insurance',
          description: 'life insurance',
        },
        {
          code: 'burials-memorials',
          description: 'burials memorials',
        },
        {
          code: 'family-caregiver-benefits',
          description: 'family caregiver benefits',
        },
      ],
    },
  },
};

// response from POST v0/user/preferences
export const sampleSaveUserPrefResponse = {
  data: {
    attributes: {
      userPreferences: [
        {
          code: 'benefits',
          title: 'benefits',
          userPreferences: [
            {
              code: 'health-care',
              description: 'health care',
            },
            {
              code: 'disability',
              description: 'disability',
            },
            {
              code: 'education-training',
              description: 'education and training',
            },
          ],
        },
      ],
    },
  },
};
