import {
  arrayBuilderItemSubsequentPageTitleUI,
  yesNoUI,
  yesNoSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaMemorableDateField from 'platform/forms-system/src/js/web-component-fields/VaMemorableDateField';
import { validateCurrentOrFutureDate } from 'platform/forms-system/src/js/validation';

import { AccreditedSchool, TermDateHint } from './helpers';
import { generateHelpText } from '../../helpers';

export const studentAttendancePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      () => 'Student\u2019s school attendance history',
    ),
    schoolInformation: {
      studentIsEnrolledFullTime: yesNoUI({
        title:
          'Has the student attended school continuously since they started school?',
        required: () => true,
        description: generateHelpText(
          'Attending school continuously means they didn\u2019t stop attending school, except for normal breaks during the school year like winter break or summer break',
        ),
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      schoolInformation: {
        type: 'object',
        required: ['studentIsEnrolledFullTime'],
        properties: {
          studentIsEnrolledFullTime: yesNoSchema,
        },
      },
    },
  },
};

export const studentStoppedAttendingDatePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      () => 'Date student stopped attending school',
    ),
    schoolInformation: {
      dateFullTimeEnded: {
        ...currentOrPastDateUI(
          'When did the student stop attending school continuously?',
        ),
        'ui:options': {
          updateSchema: (formData, schema, _uiSchema, index) => {
            const itemData = formData?.studentInformation?.[index];

            if (itemData?.schoolInformation?.studentIsEnrolledFullTime) {
              itemData.schoolInformation.dateFullTimeEnded = undefined;
            }

            return schema;
          },
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      schoolInformation: {
        type: 'object',
        properties: {
          dateFullTimeEnded: currentOrPastDateSchema,
        },
      },
    },
  },
};

export const schoolAccreditationPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      () => 'School accreditation status',
    ),
    schoolInformation: {
      isSchoolAccredited: yesNoUI({
        title: 'Is the student\u2019s school accredited?',
      }),
      'view:accredited': {
        'ui:description': AccreditedSchool,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      schoolInformation: {
        type: 'object',
        required: ['isSchoolAccredited'],
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
};

export const studentTermDatesPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => 'Student\u2019s term dates'),
    schoolInformation: {
      currentTermDates: {
        officialSchoolStartDate: {
          ...currentOrPastDateUI({
            title:
              'When did the student\u2019s regular school term or course officially start?',
            required: () => true,
          }),
          'ui:description': TermDateHint,
        },
        expectedStudentStartDate: currentOrPastDateUI({
          title: 'When did the student start or expect to start their course?',
          required: () => true,
          errorMessages: {
            pattern: 'Enter a valid date',
          },
        }),
        expectedGraduationDate: {
          'ui:title': 'When does the student expect to graduate?',
          'ui:webComponentField': VaMemorableDateField,
          'ui:required': () => true,
          'ui:validations': [validateCurrentOrFutureDate],
          'ui:errorMessages': {
            required: 'Enter a valid current or future date',
            pattern: 'Enter a valid current or future date',
          },
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      schoolInformation: {
        type: 'object',
        properties: {
          currentTermDates: {
            required: [
              'officialSchoolStartDate',
              'expectedStudentStartDate',
              'expectedGraduationDate',
            ],
            type: 'object',
            properties: {
              officialSchoolStartDate: currentOrPastDateSchema,
              expectedStudentStartDate: currentOrPastDateSchema,
              expectedGraduationDate: {
                type: 'string',
                pattern: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$',
              },
            },
          },
        },
      },
    },
  },
};

export const previousTermQuestionPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      () => 'Student\u2019s last term attendance',
    ),
    schoolInformation: {
      studentDidAttendSchoolLastTerm: yesNoUI({
        title: 'Did the student attend school last term?',
        description: generateHelpText(
          'This includes any type of school or training, including high school.',
        ),
        required: () => true,
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      schoolInformation: {
        type: 'object',
        required: ['studentDidAttendSchoolLastTerm'],
        properties: {
          studentDidAttendSchoolLastTerm: yesNoSchema,
        },
      },
    },
  },
};

export const previousTermDatesPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      () => 'Student\u2019s previous term dates',
    ),
    schoolInformation: {
      lastTermSchoolInformation: {
        'ui:options': {
          updateSchema: (formData, schema, _uiSchema, index) => {
            const itemData = formData?.studentInformation?.[index];

            if (
              itemData?.schoolInformation?.studentDidAttendSchoolLastTerm ===
              false
            ) {
              itemData.schoolInformation.lastTermSchoolInformation = undefined;
              return schema;
            }

            return {
              ...schema,
              required: ['termBegin', 'dateTermEnded'],
            };
          },
        },
        termBegin: {
          ...currentOrPastDateUI('When did the previous school term start?'),
        },
        dateTermEnded: {
          ...currentOrPastDateUI('When did the previous school term end?'),
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      schoolInformation: {
        type: 'object',
        properties: {
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
};
