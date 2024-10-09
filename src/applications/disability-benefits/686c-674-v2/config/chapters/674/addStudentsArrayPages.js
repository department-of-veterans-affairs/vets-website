// import { format, parseISO } from 'date-fns';
import { capitalize } from 'lodash';
import {
  titleUI,
  //   textUI,
  //   textSchema,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  // arrayBuilderItemSubsequentPageTitleUI,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  //   radioUI,
  //   radioSchema,
  //   currentOrPastDateUI,
  //   currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
// import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
// import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';
// import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
import //   marriageEnums,
//   spouseFormerMarriageLabels,
//   customLocationSchema,
//   generateHelpText,
'../../helpers';
import { AddStudentsIntro } from './helpers';

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
  isItemIncomplete: item => !item?.fullName?.first || !item?.fullName?.last,
  //     !item?.startDate ||
  //     !item?.endDate ||
  //     !item?.reasonMarriageEnded ||
  //     !item?.startLocation?.location?.city ||
  //     !item?.endLocation?.location?.city ||
  //     (item?.startLocation?.outsideUsa === false &&
  //       !item?.startLocation?.location?.state) ||
  //     (item?.endLocation?.outsideUsa === false &&
  //       !item?.endLocation?.location?.state),
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
export const studentFullNamePage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Add a student',
      nounSingular: addStudentsOptions.nounSingular,
    }),
    fullName: fullNameNoSuffixUI(),
  },
  schema: {
    type: 'object',
    properties: {
      fullName: fullNameNoSuffixSchema,
    },
  },
};
