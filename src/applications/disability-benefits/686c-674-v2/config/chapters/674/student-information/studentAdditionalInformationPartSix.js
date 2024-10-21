import {
  yesNoUI,
  yesNoSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { StudentAdditionalInfoH3 } from './helpers';
import { generateHelpText } from '../../../helpers';

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
              studentIsEnrolledFullTime: yesNoSchema,
              dateFullTimeEnded: currentOrPastDateSchema,
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
        studentIsEnrolledFullTime: yesNoUI({
          title:
            'Has the student attended school continuously since they started school?',
          required: () => true,
          description: generateHelpText(
            'Attending school continuously means they didn’t stop attending school, except for normal breaks during the school year, like winter break or summer break',
          ),
        }),
        dateFullTimeEnded: {
          ...currentOrPastDateUI(
            'When did the student stop attending school continuously?',
          ),
          'ui:options': {
            hideIf: (formData, index) =>
              formData?.studentInformation[index]?.schoolInformation
                ?.studentIsEnrolledFullTime,
          },
        },
      },
    },
  },
};
