/**
 * The Challenge:
 * Logged out view allows a veteran to fill out name, dob, ssn, and va file number.
 * Logged in view pulls data from the profile to populate a view only component with name, dob, and gender.
 *
 * The Implications
 * There needs to be a flexible schema that can support a logged out flow where we collect personal information
 * but also allows for the limited information we pull from the profile if they are logged in.
 *
 * There needs to be a mechanism that toggles between these two states (logged in/out).
 * We need to connect to the store in this component.
 */
import VeteranInformation from '../../../../containers/VeteranInformation';

export const schema = {
  type: 'object',
  properties: {
    veteranInformation: {
      type: 'object',
      properties: {
        fullName: {
          type: 'object',
          properties: {
            first: {
              type: 'string',
            },
            middle: {
              type: 'string',
            },
            last: {
              type: 'string',
            },
            suffix: {
              type: 'string',
              enum: ['Jr.', 'Sr.', 'II', 'III', 'IV'],
            },
          },
        },
        ssn: {
          type: 'string',
        },
        VAFileNumber: {
          type: 'string',
        },
        dob: {
          type: 'string',
          pattern:
            '^(\\d{4}|XXXX)-(0[1-9]|1[0-2]|XX)-(0[1-9]|[1-2][0-9]|3[0-1]|XX)$',
        },
      },
    },
  },
};

export const uiSchema = {
  veteranInformation: {
    'ui:title': 'Veteran Information',
    'ui:field': 'StringField',
    'ui:widget': VeteranInformation,
  },
};
