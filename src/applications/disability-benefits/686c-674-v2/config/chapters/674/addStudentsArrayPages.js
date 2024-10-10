// import { format, parseISO } from 'date-fns';
import { capitalize } from 'lodash';
import {
  titleUI,
  textUI,
  textSchema,
  addressUI,
  addressSchema,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  arrayBuilderItemSubsequentPageTitleUI,
  yesNoUI,
  yesNoSchema,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  ssnUI,
  ssnSchema,
  //   radioUI,
  //   radioSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
// import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
// import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';
// import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
// import //   marriageEnums,
// //   spouseFormerMarriageLabels,
// //   customLocationSchema,
// //   generateHelpText,
// '../../helpers';
import {
  AccreditedSchool,
  AddStudentsIntro,
  benefitSchemaLabels,
  benefitUiLabels,
  ProgramExamples,
  TermDateHint,
} from './helpers';
import { generateHelpText } from '../../helpers';

/* NOTE: 
 * In "Add mode" of the array builder, formData represents the entire formData object.
 * In "Edit mode," formData represents the specific array item being edited.
 * As a result, the index param may sometimes come back null depending on which mode the user is in.
 * To handle both modes, ensure that you check both via RJSF like these pages do.
 */

/** @type {ArrayBuilderOptions} */
export const addStudentsOptions = {
  arrayPath: 'studentInformation',
  nounSingular: 'student',
  nounPlural: 'students',
  required: true,
  isItemIncomplete: item =>
    !item?.fullName?.first ||
    !item?.fullName?.last ||
    !item?.birthDate ||
    !item?.ssn ||
    !item?.isParent,
  maxItems: 7,
  text: {
    summaryTitle: 'Review your students',
    getItemName: item =>
      `${capitalize(item.fullName?.first) || ''} ${capitalize(
        item.fullName?.last,
      ) || ''}`,
    // cardDescription: item => {
    //   const start = item?.startDate
    //     ? format(parseISO(item.startDate), 'MM/dd/yyyy')
    //     : 'Unknown';
    //   const end = item?.endDate
    //     ? format(parseISO(item.endDate), 'MM/dd/yyyy')
    //     : 'Unknown';

    //   return `${start} - ${end}`;
    // },
  },
};

// "studentInformation": [
//     {
//       "view:pensionEarnings": {},
//       "studentNetworthInformation": {},
//       "studentExpectedEarningsNextYear": {},
//       "view:incomeNote": {},
//       "studentEarningsFromSchoolYear": {},
//       "schoolInformation": {
//         "studentDidAttendSchoolLastTerm": true,
//         "lastTermSchoolInformation": {
//           "termBegin": "2001-04-19",
//           "dateTermEnded": "2003-03-19"
//         },
//         "currentTermDates": {
//           "officialSchoolStartDate": "1991-01-19",
//           "expectedStudentStartDate": "2000-10-19",
//           "expectedGraduationDate": "1991-05-19"
//         },
//         "isSchoolAccredited": true,
//         "view:accredited": {},
//         "studentIsEnrolledFullTime": false,
//         "name": "Trade program name"
//       },
//       "tuitionIsPaidByGovAgency": true,
//       "view:programExamples": {},
//       "typeOfProgramOrBenefit": {
//         "ch35": true,
//         "fry": true,
//         "feca": true,
//         "other": true
//       },
//       "wasMarried": true,
//       "address": {
//         "view:militaryBaseDescription": {},
//         "country": "USA",
//         "street": "123 Fake St.",
//         "city": "Fakesville",
//         "state": "AL",
//         "postalCode": "12345"
//       },
//       "ssn": "333445555",
//       "isParent": true,
//       "fullName": {
//         "first": "John",
//         "last": "Doe"
//       },
//       "birthDate": "2008-06-19"
//     }
//   ],

export const addStudentsIntroPage = {
  uiSchema: {
    ...titleUI(
      'Your students',
      //   'In the next few questions, we’ll ask you about your unmarried children between ages 18 and 23 who attend school. ' +
      //     'You’ll need to complete this section of the form, equal to a Request for Approval of School Attendance (VA Form 21-674). ' +
      //     'You must add at least one student. You can add up to 7 students. If we asked you to enter this information in a previous section, you’ll need to enter it again.',
    ),
    'ui:description': AddStudentsIntro,
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

/** @returns {PageSchema} */
export const addStudentsSummaryPage = {
  uiSchema: {
    'view:completedStudent': arrayBuilderYesNoUI(addStudentsOptions, {
      title: 'Do you have another student to add?',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:completedStudent': arrayBuilderYesNoSchema,
    },
    required: ['view:completedStudent'],
  },
};

/** @returns {PageSchema} */
export const studentInformationPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Add a student',
      nounSingular: addStudentsOptions.nounSingular,
    }),
    fullName: fullNameNoSuffixUI(title => `Student’s ${title}`),
    birthDate: {
      ...currentOrPastDateUI('Student’s date of birth'),
      'ui:required': () => true,
    },
  },
  schema: {
    type: 'object',
    properties: {
      fullName: fullNameNoSuffixSchema,
      birthDate: currentOrPastDateSchema,
    },
  },
};

/** @returns {PageSchema} */
export const studentIDInformationPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => 'Student’s information'),
    ssn: {
      ...ssnUI('Student’s Social Security number'),
      'ui:required': () => true,
    },
    isParent: {
      ...yesNoUI('Are you this student’s parent?'),
      'ui:required': () => true,
    },
  },
  schema: {
    type: 'object',
    properties: {
      ssn: ssnSchema,
      isParent: yesNoSchema,
    },
  },
};

/** @returns {PageSchema} */
export const studentIncomePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => 'Student’s information'),
    studentIncome: {
      ...yesNoUI('Did this student earn an income in the last 365 days?'),
      'ui:description': generateHelpText(
        'Answer this question only if you are adding this dependent to your pension.',
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      studentIncome: yesNoSchema,
    },
  },
};

/** @returns {PageSchema} */
export const studentAddressPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => 'Student’s address'),
    address: addressUI({
      labels: {
        militaryCheckbox:
          'They receive mail outside of the United States on a U.S. military base.',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      address: addressSchema(),
    },
  },
};

/** @returns {PageSchema} */
export const studentMaritalStatusPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => 'Student’s marital status'),
    wasMarried: {
      ...yesNoUI('Has this student ever been married?'),
      'ui:required': () => true,
    },
  },
  schema: {
    type: 'object',
    properties: {
      wasMarried: yesNoSchema,
    },
  },
};

/** @returns {PageSchema} */
export const studentEducationBenefitsPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      () => 'Student’s education benefits',
    ),
    typeOfProgramOrBenefit: {
      ...checkboxGroupUI({
        title:
          'Does the student currently receive education benefits from any of these programs?',
        labels: benefitUiLabels,
        required: () => false,
        description: generateHelpText('Check all that the student receives'),
      }),
    },
    tuitionIsPaidByGovAgency: {
      ...yesNoUI(
        'Is the student enrolled in a program or school that’s entirely funded by the federal government?',
      ),
      'ui:required': () => true,
    },
    'view:programExamples': {
      'ui:description': ProgramExamples,
      'ui:options': {
        hideOnReview: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      typeOfProgramOrBenefit: checkboxGroupSchema(benefitSchemaLabels),
      tuitionIsPaidByGovAgency: yesNoSchema,
      'view:programExamples': {
        type: 'object',
        properties: {},
      },
    },
  },
};

/** @returns {PageSchema} */
export const studentEducationBenefitsStartDatePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      () => 'Student’s education benefits',
    ),
    benefitPaymentDate: {
      ...currentOrPastDateUI(
        'When did the student start receiving education benefit payments?',
      ),
      'ui:required': () => true,
    },
  },
  schema: {
    type: 'object',
    properties: {
      benefitPaymentDate: currentOrPastDateSchema,
    },
  },
};

/** @returns {PageSchema} */
export const studentProgramInfoPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      () => 'Student’s program or school',
    ),
    schoolInformation: {
      name: {
        ...textUI(
          'What’s the name of the school or trade program the student attends?',
        ),
        'ui:required': () => true,
        'ui:options': {
          width: 'xl',
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
          name: textSchema,
        },
      },
    },
  },
};

export const studentAttendancePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      () => 'Additional information for this student',
    ),
    schoolInformation: {
      studentIsEnrolledFullTime: yesNoUI({
        title:
          'Has the student attended school continuously since they started school?',
        required: () => true,
        description: generateHelpText(
          'Attending school continuously means they didn’t stop attending school, except for normal breaks during the school year, like winter break or summer break',
        ),
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      schoolInformation: {
        type: 'object',
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
      () => 'Additional information for this student',
    ),
    schoolInformation: {
      dateFullTimeEnded: {
        ...currentOrPastDateUI(
          'When did the student stop attending school continuously?',
        ),
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
      () => 'Additional information for this student',
    ),
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
  schema: {
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
};

export const studentTermDatesPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => 'Student’s term dates'),
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
  schema: {
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
};

export const previousTermQuestionPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => 'Student’s term dates'),
    schoolInformation: {
      studentDidAttendSchoolLastTerm: yesNoUI({
        title: 'Did the student attend school last term?',
        description: generateHelpText(
          'This includes any kind type of school or training, including high school.',
        ),
        required: () => true,
      }),
      // lastTermSchoolInformation: {
      //   // 'ui:options': {
      //   //   hideIf: (formData, index) =>
      //   //     !formData?.studentInformation[index]?.schoolInformation
      //   //       ?.studentDidAttendSchoolLastTerm,
      //   // },
      //   termBegin: {
      //     ...currentOrPastDateUI('When did the previous school term start?'),
      //     // 'ui:required': (formData, index) =>
      //     //   formData?.studentInformation[index]?.schoolInformation
      //     //     ?.studentDidAttendSchoolLastTerm,
      //   },
      //   dateTermEnded: {
      //     ...currentOrPastDateUI('When did the previous school term end?'),
      //     // 'ui:required': (formData, index) =>
      //     //   formData?.studentInformation[index]?.schoolInformation
      //     //     ?.studentDidAttendSchoolLastTerm,
      //   },
      // },
    },
  },
  schema: {
    type: 'object',
    properties: {
      schoolInformation: {
        type: 'object',
        properties: {
          studentDidAttendSchoolLastTerm: yesNoSchema,
          // lastTermSchoolInformation: {
          //   type: 'object',
          //   properties: {
          //     termBegin: currentOrPastDateSchema,
          //     dateTermEnded: currentOrPastDateSchema,
          //   },
          // },
        },
      },
    },
  },
};

export const previousTermDatesPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => 'Student’s term dates'),
    schoolInformation: {
      lastTermSchoolInformation: {
        termBegin: {
          ...currentOrPastDateUI('When did the previous school term start?'),
          // 'ui:required': (formData, index) =>
          //   formData?.studentInformation[index]?.schoolInformation
          //     ?.studentDidAttendSchoolLastTerm,
        },
        dateTermEnded: {
          ...currentOrPastDateUI('When did the previous school term end?'),
          // 'ui:required': (formData, index) =>
          //   formData?.studentInformation[index]?.schoolInformation
          //     ?.studentDidAttendSchoolLastTerm,
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
