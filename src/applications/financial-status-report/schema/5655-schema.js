export default {
  veteranInfo: {
    title: 'Financial Status Report 5655',
    type: 'object',
    definitions: {
      fullName: {
        type: 'object',
        properties: {
          first: {
            type: 'string',
            'ui:title': 'First name',
            minLength: 1,
            maxLength: 30,
          },
          middle: {
            type: 'string',
            'ui:title': 'Middle name',
          },
          last: {
            type: 'string',
            'ui:title': 'Last name',
            minLength: 1,
            maxLength: 30,
          },
          suffix: {
            type: 'string',
            'ui:title': 'Middle name',
            enum: ['Jr.', 'Sr.', 'II', 'III', 'IV'],
          },
        },
        required: ['first', 'last'],
      },
      ssn: {
        type: 'string',
        pattern: '^[0-9]{9}$',
      },
      fileNumber: {
        type: 'string',
        pattern: '^[cC]{0,1}\\d{7,9}$',
      },
      dob: {
        pattern:
          '^(\\d{4}|XXXX)-(0[1-9]|1[0-2]|XX)-(0[1-9]|[1-2][0-9]|3[0-1]|XX)$',
        type: 'string',
      },
    },
    properties: {
      veteranFullName: {
        $ref: '#/definitions/fullName',
      },
      veteranSocialSecurityNumber: {
        $ref: '#/definitions/ssn',
      },
      veteranDateOfBirth: {
        $ref: '#/definitions/dob',
      },
      vaFileNumber: {
        $ref: '#/definitions/fileNumber',
      },
    },
  },
  householdIncome: {
    type: 'object',
    properties: {
      employmentHistory: {
        type: 'object',
        properties: {
          'view:hasBeenEmployed': {
            type: 'boolean',
          },
          'view:isEmployed': {
            type: 'object',
            properties: {
              'view:currentlyEmployed': {
                type: 'boolean',
              },
              'view:isCurrentlyEmployed': {
                type: 'object',
                properties: {
                  employmentType: {
                    type: 'string',
                    enum: ['Full-time', 'Part-time', 'Seasonal'],
                  },
                  employmentStart: {
                    type: 'string',
                  },
                  employerName: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
