import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';

import {
  addStudentsOptions,
  addStudentsIntroPage,
  addStudentsSummaryPage,
  studentInformationPage,
  studentIncomePage,
  studentAddressPage,
  studentMaritalStatusPage,
  studentEducationBenefitsPage,
  studentProgramInfoPage,
  studentEducationBenefitsStartDatePage,
  studentStoppedAttendingDatePage,
  studentAttendancePage,
  schoolAccreditationPage,
  studentTermDatesPage,
  previousTermQuestionPage,
  previousTermDatesPage,
  claimsOrReceivesPensionPage,
  studentEarningsPage,
  studentFutureEarningsPage,
  studentAssetsPage,
  remarksPage,
  studentMarriageDatePage,
  studentRelationshipPage,
} from './674/addStudentsArrayPages';

import { TASK_KEYS } from '../constants';
import { isChapterFieldRequired } from '../helpers';
import {
  shouldShowStudentIncomeQuestions,
  isAddingDependents,
} from '../utilities';

export default {
  title: 'Add one or more students between ages 18 and 23',
  pages: {
    ...arrayBuilderPages(addStudentsOptions, pageBuilder => ({
      addStudentsIntro: pageBuilder.introPage({
        title: 'Add one or more students between ages 18 and 23',
        path: 'report-674',
        uiSchema: addStudentsIntroPage.uiSchema,
        schema: addStudentsIntroPage.schema,
        depends: formData =>
          isChapterFieldRequired(formData, TASK_KEYS.report674) &&
          isAddingDependents(formData),
      }),
      addStudentsSummary: pageBuilder.summaryPage({
        title: 'Add one or more students between ages 18 and 23',
        path: 'report-674/add-students',
        uiSchema: addStudentsSummaryPage.uiSchema,
        schema: addStudentsSummaryPage.schema,
        depends: formData =>
          isChapterFieldRequired(formData, TASK_KEYS.report674) &&
          isAddingDependents(formData),
      }),
      addStudentsPartOne: pageBuilder.itemPage({
        title: 'Add one or more students between ages 18 and 23',
        path: 'report-674/add-students/:index/student-information',
        uiSchema: studentInformationPage.uiSchema,
        schema: studentInformationPage.schema,
        depends: formData =>
          isChapterFieldRequired(formData, TASK_KEYS.report674) &&
          isAddingDependents(formData),
      }),
      addStudentsPartThree: pageBuilder.itemPage({
        title: 'Add one or more students between ages 18 and 23',
        path: 'report-674/add-students/:index/student-relationship',
        uiSchema: studentRelationshipPage.uiSchema,
        schema: studentRelationshipPage.schema,
        depends: formData =>
          isChapterFieldRequired(formData, TASK_KEYS.report674) &&
          isAddingDependents(formData),
      }),
      addStudentsPartFour: pageBuilder.itemPage({
        title: 'Add one or more students between ages 18 and 23',
        path: 'report-674/add-students/:index/student-income',
        uiSchema: studentIncomePage.uiSchema,
        schema: studentIncomePage.schema,
        depends: formData =>
          isChapterFieldRequired(formData, TASK_KEYS.report674) &&
          isAddingDependents(formData) &&
          !formData?.vaDependentsNetWorthAndPension,
      }),
      addStudentsPartFive: pageBuilder.itemPage({
        title: 'Add one or more students between ages 18 and 23',
        path: 'report-674/add-students/:index/student-address',
        uiSchema: studentAddressPage.uiSchema,
        schema: studentAddressPage.schema,
        depends: formData =>
          isChapterFieldRequired(formData, TASK_KEYS.report674) &&
          isAddingDependents(formData),
      }),
      addStudentsPartSix: pageBuilder.itemPage({
        title: 'Add one or more students between ages 18 and 23',
        path: 'report-674/add-students/:index/student-marital-status',
        uiSchema: studentMaritalStatusPage.uiSchema,
        schema: studentMaritalStatusPage.schema,
        depends: formData =>
          isChapterFieldRequired(formData, TASK_KEYS.report674) &&
          isAddingDependents(formData),
      }),
      addStudentsPartSeven: pageBuilder.itemPage({
        title: 'Add one or more students between ages 18 and 23',
        path: 'report-674/add-students/:index/student-marriage-date',
        uiSchema: studentMarriageDatePage.uiSchema,
        schema: studentMarriageDatePage.schema,
        depends: (formData, index) =>
          isChapterFieldRequired(formData, TASK_KEYS.report674) &&
          isAddingDependents(formData) &&
          formData?.studentInformation?.[index]?.wasMarried,
      }),
      addStudentsPartEight: pageBuilder.itemPage({
        title: 'Add one or more students between ages 18 and 23',
        path: 'report-674/add-students/:index/student-education-benefits',
        uiSchema: studentEducationBenefitsPage.uiSchema,
        schema: studentEducationBenefitsPage.schema,
        depends: formData =>
          isChapterFieldRequired(formData, TASK_KEYS.report674) &&
          isAddingDependents(formData),
      }),
      addStudentsPartNine: pageBuilder.itemPage({
        title: 'Add one or more students between ages 18 and 23',
        path: 'report-674/add-students/:index/student-education-benefits/start-date',
        uiSchema: studentEducationBenefitsStartDatePage.uiSchema,
        schema: studentEducationBenefitsStartDatePage.schema,
        depends: (formData, index) =>
          isChapterFieldRequired(formData, TASK_KEYS.report674) &&
          isAddingDependents(formData) &&
          ['ch35', 'fry', 'feca'].some(
            key =>
              formData?.studentInformation?.[index]?.typeOfProgramOrBenefit?.[
                key
              ] === true,
          ),
      }),
      addStudentsPartTen: pageBuilder.itemPage({
        title: 'Add one or more students between ages 18 and 23',
        path: 'report-674/add-students/:index/student-program-information',
        uiSchema: studentProgramInfoPage.uiSchema,
        schema: studentProgramInfoPage.schema,
        depends: formData =>
          isChapterFieldRequired(formData, TASK_KEYS.report674) &&
          isAddingDependents(formData),
      }),
      addStudentsPartEleven: pageBuilder.itemPage({
        title: 'Add one or more students between ages 18 and 23',
        path: 'report-674/add-students/:index/student-attendance-information',
        uiSchema: studentAttendancePage.uiSchema,
        schema: studentAttendancePage.schema,
        depends: formData =>
          isChapterFieldRequired(formData, TASK_KEYS.report674) &&
          isAddingDependents(formData),
      }),
      addStudentsPartTwelve: pageBuilder.itemPage({
        title: 'Add one or more students between ages 18 and 23',
        path: 'report-674/add-students/:index/date-student-stopped-attending',
        uiSchema: studentStoppedAttendingDatePage.uiSchema,
        schema: studentStoppedAttendingDatePage.schema,
        depends: (formData, index) =>
          isChapterFieldRequired(formData, TASK_KEYS.report674) &&
          isAddingDependents(formData) &&
          !formData?.studentInformation?.[index]?.schoolInformation
            ?.studentIsEnrolledFullTime,
      }),
      addStudentsPartThirteen: pageBuilder.itemPage({
        title: 'Add one or more students between ages 18 and 23',
        path: 'report-674/add-students/:index/school-or-program-accreditation',
        uiSchema: schoolAccreditationPage.uiSchema,
        schema: schoolAccreditationPage.schema,
        depends: formData =>
          isChapterFieldRequired(formData, TASK_KEYS.report674) &&
          isAddingDependents(formData),
      }),
      addStudentsPartFourteen: pageBuilder.itemPage({
        title: 'Add one or more students between ages 18 and 23',
        path: 'report-674/add-students/:index/term-dates',
        uiSchema: studentTermDatesPage.uiSchema,
        schema: studentTermDatesPage.schema,
        depends: formData =>
          isChapterFieldRequired(formData, TASK_KEYS.report674) &&
          isAddingDependents(formData),
      }),
      addStudentsPartFifteen: pageBuilder.itemPage({
        title: 'Add one or more students between ages 18 and 23',
        path: 'report-674/add-students/:index/student-previously-attended',
        uiSchema: previousTermQuestionPage.uiSchema,
        schema: previousTermQuestionPage.schema,
        depends: formData =>
          isChapterFieldRequired(formData, TASK_KEYS.report674) &&
          isAddingDependents(formData),
      }),
      addStudentsPartSixteen: pageBuilder.itemPage({
        title: 'Add one or more students between ages 18 and 23',
        path: 'report-674/add-students/:index/previous-term-dates',
        uiSchema: previousTermDatesPage.uiSchema,
        schema: previousTermDatesPage.schema,
        depends: (formData, index) =>
          isChapterFieldRequired(formData, TASK_KEYS.report674) &&
          isAddingDependents(formData) &&
          formData?.studentInformation?.[index]?.schoolInformation
            ?.studentDidAttendSchoolLastTerm,
      }),
      addStudentsPartSeventeen: pageBuilder.itemPage({
        title: 'Add one or more students between ages 18 and 23',
        path: 'report-674/add-students/:index/additional-student-income',
        uiSchema: claimsOrReceivesPensionPage.uiSchema,
        schema: claimsOrReceivesPensionPage.schema,
        depends: formData =>
          isChapterFieldRequired(formData, TASK_KEYS.report674) &&
          isAddingDependents(formData) &&
          !formData?.vaDependentsNetWorthAndPension,
      }),
      addStudentsPartEighteen: pageBuilder.itemPage({
        title: 'Add one or more students between ages 18 and 23',
        path: 'report-674/add-students/:index/all-student-income',
        uiSchema: studentEarningsPage.uiSchema,
        schema: studentEarningsPage.schema,
        depends: (formData, index) =>
          isChapterFieldRequired(formData, TASK_KEYS.report674) &&
          isAddingDependents(formData) &&
          shouldShowStudentIncomeQuestions({ formData, index }),
      }),
      addStudentsPartNineteen: pageBuilder.itemPage({
        title: 'Add one or more students between ages 18 and 23',
        path: 'report-674/add-students/:index/expected-student-income',
        uiSchema: studentFutureEarningsPage.uiSchema,
        schema: studentFutureEarningsPage.schema,
        depends: (formData, index) =>
          isChapterFieldRequired(formData, TASK_KEYS.report674) &&
          isAddingDependents(formData) &&
          shouldShowStudentIncomeQuestions({ formData, index }),
      }),
      addStudentsPartTwenty: pageBuilder.itemPage({
        title: 'Add one or more students between ages 18 and 23',
        path: 'report-674/add-students/:index/student-assets',
        uiSchema: studentAssetsPage.uiSchema,
        schema: studentAssetsPage.schema,
        depends: (formData, index) =>
          isChapterFieldRequired(formData, TASK_KEYS.report674) &&
          isAddingDependents(formData) &&
          shouldShowStudentIncomeQuestions({ formData, index }),
      }),
      addStudentsPartTwentyOne: pageBuilder.itemPage({
        title: 'Add one or more students between ages 18 and 23',
        path: 'report-674/add-students/:index/additional-remarks',
        uiSchema: remarksPage.uiSchema,
        schema: remarksPage.schema,
        depends: formData =>
          isChapterFieldRequired(formData, TASK_KEYS.report674) &&
          isAddingDependents(formData),
      }),
    })),
  },
};
