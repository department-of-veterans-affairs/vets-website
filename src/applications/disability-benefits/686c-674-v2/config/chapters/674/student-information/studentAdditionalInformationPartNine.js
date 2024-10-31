import {
  yesNoUI,
  yesNoSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { StudentPrevTermH3 } from './helpers';
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
              studentDidAttendSchoolLastTerm: yesNoSchema,
              lastTermSchoolInformation: {
                type: 'object',
                properties: {
                  termBegin: currentOrPastDateSchema,
                  dateTermEnded: currentOrPastDateSchema,
                },
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
      'ui:title': StudentPrevTermH3,
      schoolInformation: {
        studentDidAttendSchoolLastTerm: yesNoUI({
          title: 'Did the student attend school last term?',
          description: generateHelpText(
            'This includes any kind type of school or training, including high school.',
          ),
          required: () => true,
        }),
        lastTermSchoolInformation: {
          'ui:options': {
            hideIf: (formData, index) =>
              !formData?.studentInformation[index]?.schoolInformation
                ?.studentDidAttendSchoolLastTerm,
          },
          termBegin: {
            ...currentOrPastDateUI('When did the previous school term start?'),
            'ui:required': (formData, index) =>
              formData?.studentInformation[index]?.schoolInformation
                ?.studentDidAttendSchoolLastTerm,
          },
          dateTermEnded: {
            ...currentOrPastDateUI('When did the previous school term end?'),
            'ui:required': (formData, index) =>
              formData?.studentInformation[index]?.schoolInformation
                ?.studentDidAttendSchoolLastTerm,
          },
        },
      },
    },
  },
};
