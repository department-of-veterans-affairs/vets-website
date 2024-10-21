import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { StudentCurrentTermH3, TermDateHint } from './helpers';

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
              currentTermDates: {
                type: 'object',
                properties: {
                  officialSchoolStartDate: currentOrPastDateSchema,
                  expectedStudentStartDate: currentOrPastDateSchema,
                  expectedGraduationDate: currentOrPastDateSchema,
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
      'ui:title': StudentCurrentTermH3,
      schoolInformation: {
        currentTermDates: {
          officialSchoolStartDate: {
            ...currentOrPastDateUI(
              'When did the student’s regular school term or course officially start?',
            ),
            'ui:required': () => true,
            'ui:description': TermDateHint,
          },
          expectedStudentStartDate: {
            ...currentOrPastDateUI(
              'When did the student start or expect to start their course?',
            ),
            'ui:required': () => true,
          },
          expectedGraduationDate: {
            ...currentOrPastDateUI('When does the student expect to graduate?'),
            'ui:required': () => true,
          },
        },
      },
    },
  },
};
