import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { AccreditedSchool, StudentAdditionalInfoH3 } from './helpers';

export const schema = {
  type: 'object',
  properties: {
    studentInformation: {
      type: 'array',
      minItems: 1,
      maxItems: 100,
      items: {
        type: 'object',
        properties: {
          schoolInformation: {
            type: 'object',
            properties: {
              isSchoolAccredited: yesNoSchema,
              'view:accredited': {
                type: 'object',
                properties: {},
              },
            },
          },
        },
      },
    },
  },
};

export const uiSchema = {
  studentInformation: {
    items: {
      'ui:title': StudentAdditionalInfoH3,
      schoolInformation: {
        isSchoolAccredited: yesNoUI({
          title: 'Is the student’s school accredited?',
          required: () => true,
        }),
        'view:accredited': {
          'ui:description': AccreditedSchool,
        },
      },
    },
  },
};
