import fullSchema from 'vets-json-schema/dist/686C-674-schema.json';
import environment from 'platform/utilities/environment';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import FormFooter from 'platform/forms/components/FormFooter';
import { externalServices } from 'platform/monitoring/DowntimeNotification';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { TASK_KEYS, MARRIAGE_TYPES } from './constants';
import { isChapterFieldRequired } from './helpers';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import CustomPreSubmitInfo from '../components/CustomPreSubmitInfo';
import GetFormHelp from '../components/GetFormHelp';
import { customSubmit686 } from '../analytics/helpers';

// Chapter imports
import {
  formerSpouseInformation,
  formerSpouseInformationPartThree,
  formerSpouseInformationPartTwo,
} from './chapters/report-divorce';
import {
  deceasedDependentOptions,
  deceasedDependentIntroPage,
  deceasedDependentSummaryPage,
  deceasedDependentPersonalInfoPage,
  deceasedDependentTypePage,
  deceasedDependentChildTypePage,
  deceasedDependentDateOfDeathPage,
  deceasedDependentLocationOfDeathPage,
  deceasedDependentIncomePage,
} from './chapters/report-dependent-death/deceasedDependentArrayPages';
import {
  currentMarriageInformation,
  currentMarriageInformationPartTwo,
  currentMarriageInformationPartThree,
  currentMarriageInformationPartFour,
  currentMarriageInformationPartFive,
  doesLiveWithSpouse,
  marriageAdditionalEvidence,
  spouseInformation,
  spouseInformationPartTwo,
  spouseInformationPartThree,
} from './chapters/report-add-a-spouse';
import {
  spouseMarriageHistoryOptions,
  spouseMarriageHistorySummaryPage,
  formerMarriagePersonalInfoPage,
  formerMarriageEndReasonPage,
  formerMarriageStartDatePage,
  formerMarriageEndDatePage,
  formerMarriageStartLocationPage,
  formerMarriageEndLocationPage,
} from './chapters/report-add-a-spouse/spouseMarriageHistoryArrayPages';
import {
  veteranMarriageHistoryOptions,
  veteranMarriageHistorySummaryPage,
  vetFormerMarriagePersonalInfoPage,
  vetFormerMarriageEndReasonPage,
  vetFormerMarriageStartDatePage,
  vetFormerMarriageEndDatePage,
  vetFormerMarriageStartLocationPage,
  vetFormerMarriageEndLocationPage,
} from './chapters/report-add-a-spouse/veteranMarriageHistoryArrayPages';
import {
  addDependentOptions,
  removeDependentOptions,
  addOrRemoveDependents,
} from './chapters/taskWizard';
import {
  veteranInformation,
  veteranAddress,
  veteranContactInformation,
} from './chapters/veteran-information';
import {
  removeChildStoppedAttendingSchoolOptions,
  removeChildStoppedAttendingSchoolIntroPage,
  removeChildStoppedAttendingSchoolSummaryPage,
  childInformationPage,
  dateChildLeftSchoolPage,
  childIncomeQuestionPage,
} from './chapters/report-child-stopped-attending-school/removeChildStoppedAttendingSchoolArrayPages';
import {
  removeMarriedChildIntroPage,
  removeMarriedChildOptions,
  removeMarriedChildSummaryPage,
  marriedChildInformationPage,
  marriedChildIncomeQuestionPage,
  dateChildMarriedPage,
} from './chapters/report-marriage-of-child/removeMarriedChildArrayPages';
import {
  addStudentsOptions,
  addStudentsIntroPage,
  addStudentsSummaryPage,
  studentInformationPage,
  studentIDInformationPage,
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
} from './chapters/674/addStudentsArrayPages';
import {
  childAddressPage,
  householdChildInfoPage,
  parentOrGuardianPage,
  removeChildHouseholdIntroPage,
  removeChildHouseholdOptions,
  removeChildHouseholdSummaryPage,
  supportAmountPage,
  veteranSupportsChildPage,
} from './chapters/stepchild-no-longer-part-of-household/removeChildHouseholdArrayPages';
import { householdIncome } from './chapters/household-income';

import manifest from '../manifest.json';
import prefillTransformer from './prefill-transformer';
import { chapter as addChild } from './chapters/report-add-child';

const emptyMigration = savedData => savedData;
const migrations = [emptyMigration];

export const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/dependents_applications`,
  submit: customSubmit686,
  trackingPrefix: 'disability-21-686c-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  preSubmitInfo: CustomPreSubmitInfo,
  formId: VA_FORM_IDS.FORM_21_686CV2,
  saveInProgress: {
    messages: {
      inProgress: 'Your dependent status application (21-686c) is in progress.',
      expired:
        'Your saved dependent status application (21-686c) has expired. If you want to apply for dependent status, start a new application.',
      saved: 'Your dependent status application has been saved.',
    },
  },
  version: migrations.length,
  v3SegmentedProgressBar: true,
  migrations,
  prefillEnabled: true,
  prefillTransformer,
  verifyRequiredPrefill: true,
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  downtime: {
    requiredForPrefill: true,
    dependencies: [
      externalServices.bgs,
      externalServices.global,
      externalServices.mvi,
      externalServices.vaProfile,
      externalServices.vbms,
    ],
  },
  savedFormMessages: {
    notFound:
      'Start your application to add or remove a dependent on your VA benefits.',
    noAuth:
      'Sign in again to continue your application to add or remove a dependent on your VA benefits.',
  },
  title: 'Add or remove a dependent on VA benefits',
  subTitle: 'VA Forms 21-686c and 21-674',
  defaultDefinitions: { ...fullSchema.definitions },
  chapters: {
    optionSelection: {
      title: 'What would you like to do?',
      pages: {
        addOrRemoveDependents: {
          hideHeaderRow: true,
          title: 'What do you like to do?',
          path: 'options-selection',
          uiSchema: addOrRemoveDependents.uiSchema,
          schema: addOrRemoveDependents.schema,
        },
        addDependentOptions: {
          hideHeaderRow: true,
          title: 'What do you like to do?',
          path: 'options-selection/add-dependents',
          uiSchema: addDependentOptions.uiSchema,
          schema: addDependentOptions.schema,
          depends: form => form?.['view:addOrRemoveDependents']?.add,
        },
        removeDependentOptions: {
          hideHeaderRow: true,
          title: 'What do you like to do?',
          path: 'options-selection/remove-dependents',
          uiSchema: removeDependentOptions.uiSchema,
          schema: removeDependentOptions.schema,
          depends: form => form?.['view:addOrRemoveDependents']?.remove,
        },
      },
    },

    veteranInformation: {
      title: "Veteran's information",
      pages: {
        veteranInformation: {
          path: 'veteran-information',
          title: 'Veteran information',
          uiSchema: veteranInformation.uiSchema,
          schema: veteranInformation.schema,
        },
        veteranAddress: {
          path: 'veteran-address',
          title: 'Veteran address',
          uiSchema: veteranAddress.uiSchema,
          schema: veteranAddress.schema,
        },
        veteranContactInformation: {
          path: 'veteran-contact-information',
          title: 'Veteran contact information',
          uiSchema: veteranContactInformation.uiSchema,
          schema: veteranContactInformation.schema,
        },
      },
    },

    addSpouse: {
      title: 'Add your spouse',
      pages: {
        spouseNameInformation: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse),
          title: 'Spouse’s name',
          path: 'add-spouse/current-legal-name',
          uiSchema: spouseInformation.uiSchema,
          schema: spouseInformation.schema,
        },
        spouseNameInformationPartTwo: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse),
          title: 'Spouse information',
          path: 'add-spouse/personal-information',
          uiSchema: spouseInformationPartTwo.uiSchema,
          schema: spouseInformationPartTwo.schema,
        },
        spouseNameInformationPartThree: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
            formData?.spouseInformation?.isVeteran,
          title: 'Spouse information: VA file number',
          path: 'add-spouse/military-service-information',
          uiSchema: spouseInformationPartThree.uiSchema,
          schema: spouseInformationPartThree.schema,
        },
        doesLiveWithSpouse: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse),
          title: 'Information needed to add your spouse: Address information',
          path: 'current-marriage-information/living-together',
          uiSchema: doesLiveWithSpouse.uiSchema,
          schema: doesLiveWithSpouse.schema,
        },
        currentMarriageInformation: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
            !formData?.doesLiveWithSpouse?.spouseDoesLiveWithVeteran,
          title: 'Information needed to add your spouse: Marriage information',
          path: 'current-marriage-information/spouse-address',
          uiSchema: currentMarriageInformation.uiSchema,
          schema: currentMarriageInformation.schema,
        },
        currentMarriageInformationPartTwo: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse),
          title: 'Information needed to add your spouse: Marriage information',
          path: 'current-marriage-information/spouse-income',
          uiSchema: currentMarriageInformationPartTwo.uiSchema,
          schema: currentMarriageInformationPartTwo.schema,
        },
        currentMarriageInformationPartThree: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse),
          title: 'Information needed to add your spouse: Marriage information',
          path: 'current-marriage-information/location-of-marriage',
          uiSchema: currentMarriageInformationPartThree.uiSchema,
          schema: currentMarriageInformationPartThree.schema,
        },
        currentMarriageInformationPartFour: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse),
          title: 'Information needed to add your spouse: Marriage information',
          path: 'current-marriage-information/type-of-marriage',
          uiSchema: currentMarriageInformationPartFour.uiSchema,
          schema: currentMarriageInformationPartFour.schema,
        },
        currentMarriageInformationPartFive: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
            !formData?.doesLiveWithSpouse?.spouseDoesLiveWithVeteran,
          title: 'Information needed to add your spouse: Marriage information',
          path: 'current-marriage-information/reason-for-living-separately',
          uiSchema: currentMarriageInformationPartFive.uiSchema,
          schema: currentMarriageInformationPartFive.schema,
        },

        ...arrayBuilderPages(spouseMarriageHistoryOptions, pageBuilder => ({
          spouseMarriageHistorySummary: pageBuilder.summaryPage({
            title:
              'Information needed to add your spouse: Former spouse information',
            path: 'current-spouse-marriage-history',
            uiSchema: spouseMarriageHistorySummaryPage.uiSchema,
            schema: spouseMarriageHistorySummaryPage.schema,
            depends: formData =>
              isChapterFieldRequired(formData, TASK_KEYS.addSpouse),
          }),
          spouseMarriageHistoryPartOne: pageBuilder.itemPage({
            title:
              'Information needed to add your spouse: Former spouse information',
            path:
              'current-spouse-marriage-history/:index/former-spouse-information',
            uiSchema: formerMarriagePersonalInfoPage.uiSchema,
            schema: formerMarriagePersonalInfoPage.schema,
            depends: formData =>
              isChapterFieldRequired(formData, TASK_KEYS.addSpouse),
          }),
          spouseMarriageHistoryPartTwo: pageBuilder.itemPage({
            title:
              'Information needed to add your spouse: Reason former marriage ended',
            path:
              'current-spouse-marriage-history/:index/reason-former-marriage-ended',
            uiSchema: formerMarriageEndReasonPage.uiSchema,
            schema: formerMarriageEndReasonPage.schema,
            depends: formData =>
              isChapterFieldRequired(formData, TASK_KEYS.addSpouse),
          }),
          spouseMarriageHistoryPartThree: pageBuilder.itemPage({
            title:
              'Information needed to add your spouse: Date former marriage started',
            path:
              'current-spouse-marriage-history/:index/date-marriage-started',
            uiSchema: formerMarriageStartDatePage.uiSchema,
            schema: formerMarriageStartDatePage.schema,
            depends: formData =>
              isChapterFieldRequired(formData, TASK_KEYS.addSpouse),
          }),
          spouseMarriageHistoryPartFour: pageBuilder.itemPage({
            title:
              'Information needed to add your spouse: Date former marriage ended',
            path: 'current-spouse-marriage-history/:index/date-marriage-ended',
            uiSchema: formerMarriageEndDatePage.uiSchema,
            schema: formerMarriageEndDatePage.schema,
            depends: formData =>
              isChapterFieldRequired(formData, TASK_KEYS.addSpouse),
          }),
          spouseMarriageHistoryPartFive: pageBuilder.itemPage({
            title:
              'Information needed to add your spouse: Location where former marriage started',
            path:
              'current-spouse-marriage-history/:index/location-where-marriage-started',
            uiSchema: formerMarriageStartLocationPage.uiSchema,
            schema: formerMarriageStartLocationPage.schema,
            depends: formData =>
              isChapterFieldRequired(formData, TASK_KEYS.addSpouse),
          }),
          spouseMarriageHistoryPartSix: pageBuilder.itemPage({
            title:
              'Information needed to add your spouse: Location where former marriage ended',
            path:
              'current-spouse-marriage-history/:index/location-where-marriage-ended',
            uiSchema: formerMarriageEndLocationPage.uiSchema,
            schema: formerMarriageEndLocationPage.schema,
            depends: formData =>
              isChapterFieldRequired(formData, TASK_KEYS.addSpouse),
          }),
        })),

        ...arrayBuilderPages(veteranMarriageHistoryOptions, pageBuilder => ({
          veteranMarriageHistorySummary: pageBuilder.summaryPage({
            title:
              'Information needed to add your spouse: Former spouse information',
            path: 'veteran-marriage-history',
            uiSchema: veteranMarriageHistorySummaryPage.uiSchema,
            schema: veteranMarriageHistorySummaryPage.schema,
            depends: formData =>
              isChapterFieldRequired(formData, TASK_KEYS.addSpouse),
          }),
          veteranMarriageHistoryPartOne: pageBuilder.itemPage({
            title:
              'Information needed to add your spouse: Former spouse information',
            path: 'veteran-marriage-history/:index/former-spouse-information',
            uiSchema: vetFormerMarriagePersonalInfoPage.uiSchema,
            schema: vetFormerMarriagePersonalInfoPage.schema,
            depends: formData =>
              isChapterFieldRequired(formData, TASK_KEYS.addSpouse),
          }),
          veteranMarriageHistoryPartTwo: pageBuilder.itemPage({
            title:
              'Information needed to add your spouse: Reason former marriage ended',
            path:
              'veteran-marriage-history/:index/reason-former-marriage-ended',
            uiSchema: vetFormerMarriageEndReasonPage.uiSchema,
            schema: vetFormerMarriageEndReasonPage.schema,
            depends: formData =>
              isChapterFieldRequired(formData, TASK_KEYS.addSpouse),
          }),
          veteranMarriageHistoryPartThree: pageBuilder.itemPage({
            title:
              'Information needed to add your spouse: Date former marriage started',
            path: 'veteran-marriage-history/:index/date-marriage-started',
            uiSchema: vetFormerMarriageStartDatePage.uiSchema,
            schema: vetFormerMarriageStartDatePage.schema,
            depends: formData =>
              isChapterFieldRequired(formData, TASK_KEYS.addSpouse),
          }),
          veteranMarriageHistoryPartFour: pageBuilder.itemPage({
            title:
              'Information needed to add your spouse: Date former marriage ended',
            path: 'veteran-marriage-history/:index/date-marriage-ended',
            uiSchema: vetFormerMarriageEndDatePage.uiSchema,
            schema: vetFormerMarriageEndDatePage.schema,
            depends: formData =>
              isChapterFieldRequired(formData, TASK_KEYS.addSpouse),
          }),
          veteranMarriageHistoryPartFive: pageBuilder.itemPage({
            title:
              'Information needed to add your spouse: Location where former marriage started',
            path:
              'veteran-marriage-history/:index/location-where-marriage-started',
            uiSchema: vetFormerMarriageStartLocationPage.uiSchema,
            schema: vetFormerMarriageStartLocationPage.schema,
            depends: formData =>
              isChapterFieldRequired(formData, TASK_KEYS.addSpouse),
          }),
          veteranMarriageHistoryPartSix: pageBuilder.itemPage({
            title:
              'Information needed to add your spouse: Location where former marriage ended',
            path:
              'veteran-marriage-history/:index/location-where-marriage-ended',
            uiSchema: vetFormerMarriageEndLocationPage.uiSchema,
            schema: vetFormerMarriageEndLocationPage.schema,
            depends: formData =>
              isChapterFieldRequired(formData, TASK_KEYS.addSpouse),
          }),
        })),

        marriageAdditionalEvidence: {
          depends: formData =>
            typeof formData?.currentMarriageInformation?.type === 'string' &&
            formData?.currentMarriageInformation?.type !==
              MARRIAGE_TYPES.ceremonial &&
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse),
          title: 'Additional evidence needed to add spouse',
          path: 'add-spouse-evidence',
          uiSchema: marriageAdditionalEvidence.uiSchema,
          schema: marriageAdditionalEvidence.schema,
        },
      },
    },

    addChild,

    report674: {
      title: 'Add one or more students between ages 18 and 23',
      pages: {
        ...arrayBuilderPages(addStudentsOptions, pageBuilder => ({
          addStudentsIntro: pageBuilder.introPage({
            title: 'Add one or more students between ages 18 and 23',
            path: 'report-674',
            uiSchema: addStudentsIntroPage.uiSchema,
            schema: addStudentsIntroPage.schema,
            depends: formData =>
              isChapterFieldRequired(formData, TASK_KEYS.report674),
          }),
          addStudentsSummary: pageBuilder.summaryPage({
            title: 'Add one or more students between ages 18 and 23',
            path: 'report-674/add-students',
            uiSchema: addStudentsSummaryPage.uiSchema,
            schema: addStudentsSummaryPage.schema,
            depends: formData =>
              isChapterFieldRequired(formData, TASK_KEYS.report674),
          }),
          addStudentsPartOne: pageBuilder.itemPage({
            title: 'Add one or more students between ages 18 and 23',
            path: 'report-674/add-students/:index/student-information',
            uiSchema: studentInformationPage.uiSchema,
            schema: studentInformationPage.schema,
            depends: formData =>
              isChapterFieldRequired(formData, TASK_KEYS.report674),
          }),
          addStudentsPartTwo: pageBuilder.itemPage({
            title: 'Add one or more students between ages 18 and 23',
            path: 'report-674/add-students/:index/student-identification',
            uiSchema: studentIDInformationPage.uiSchema,
            schema: studentIDInformationPage.schema,
            depends: formData =>
              isChapterFieldRequired(formData, TASK_KEYS.report674),
          }),
          addStudentsPartThree: pageBuilder.itemPage({
            title: 'Add one or more students between ages 18 and 23',
            path: 'report-674/add-students/:index/student-income',
            uiSchema: studentIncomePage.uiSchema,
            schema: studentIncomePage.schema,
            depends: formData =>
              isChapterFieldRequired(formData, TASK_KEYS.report674),
          }),
          addStudentsPartFour: pageBuilder.itemPage({
            title: 'Add one or more students between ages 18 and 23',
            path: 'report-674/add-students/:index/student-address',
            uiSchema: studentAddressPage.uiSchema,
            schema: studentAddressPage.schema,
            depends: formData =>
              isChapterFieldRequired(formData, TASK_KEYS.report674),
          }),
          addStudentsPartFive: pageBuilder.itemPage({
            title: 'Add one or more students between ages 18 and 23',
            path: 'report-674/add-students/:index/student-marital-status',
            uiSchema: studentMaritalStatusPage.uiSchema,
            schema: studentMaritalStatusPage.schema,
            depends: formData =>
              isChapterFieldRequired(formData, TASK_KEYS.report674),
          }),
          addStudentsPartSix: pageBuilder.itemPage({
            title: 'Add one or more students between ages 18 and 23',
            path: 'report-674/add-students/:index/student-education-benefits',
            uiSchema: studentEducationBenefitsPage.uiSchema,
            schema: studentEducationBenefitsPage.schema,
            depends: formData =>
              isChapterFieldRequired(formData, TASK_KEYS.report674),
          }),
          addStudentsPartSeven: pageBuilder.itemPage({
            title: 'Add one or more students between ages 18 and 23',
            path:
              'report-674/add-students/:index/student-education-benefits/start-date',
            uiSchema: studentEducationBenefitsStartDatePage.uiSchema,
            schema: studentEducationBenefitsStartDatePage.schema,
            depends: (formData, index) =>
              isChapterFieldRequired(formData, TASK_KEYS.report674) &&
              Object.values(
                formData?.studentInformation?.[index]?.typeOfProgramOrBenefit,
              ).includes(true),
          }),
          addStudentsPartEight: pageBuilder.itemPage({
            title: 'Add one or more students between ages 18 and 23',
            path: 'report-674/add-students/:index/student-program-information',
            uiSchema: studentProgramInfoPage.uiSchema,
            schema: studentProgramInfoPage.schema,
            depends: formData =>
              isChapterFieldRequired(formData, TASK_KEYS.report674),
          }),
          addStudentsPartNine: pageBuilder.itemPage({
            title: 'Add one or more students between ages 18 and 23',
            path:
              'report-674/add-students/:index/student-attendance-information',
            uiSchema: studentAttendancePage.uiSchema,
            schema: studentAttendancePage.schema,
            depends: formData =>
              isChapterFieldRequired(formData, TASK_KEYS.report674),
          }),
          addStudentsPartTen: pageBuilder.itemPage({
            title: 'Add one or more students between ages 18 and 23',
            path:
              'report-674/add-students/:index/date-student-stopped-attending',
            uiSchema: studentStoppedAttendingDatePage.uiSchema,
            schema: studentStoppedAttendingDatePage.schema,
            depends: (formData, index) =>
              isChapterFieldRequired(formData, TASK_KEYS.report674) &&
              !formData?.studentInformation?.[index]?.schoolInformation
                ?.studentIsEnrolledFullTime,
          }),
          addStudentsPartEleven: pageBuilder.itemPage({
            title: 'Add one or more students between ages 18 and 23',
            path:
              'report-674/add-students/:index/school-or-program-accreditation',
            uiSchema: schoolAccreditationPage.uiSchema,
            schema: schoolAccreditationPage.schema,
            depends: formData =>
              isChapterFieldRequired(formData, TASK_KEYS.report674),
          }),
          addStudentsPartTwelve: pageBuilder.itemPage({
            title: 'Add one or more students between ages 18 and 23',
            path: 'report-674/add-students/:index/term-dates',
            uiSchema: studentTermDatesPage.uiSchema,
            schema: studentTermDatesPage.schema,
            depends: formData =>
              isChapterFieldRequired(formData, TASK_KEYS.report674),
          }),
          addStudentsPartThirteen: pageBuilder.itemPage({
            title: 'Add one or more students between ages 18 and 23',
            path: 'report-674/add-students/:index/student-previously-attended',
            uiSchema: previousTermQuestionPage.uiSchema,
            schema: previousTermQuestionPage.schema,
            depends: formData =>
              isChapterFieldRequired(formData, TASK_KEYS.report674),
          }),
          addStudentsPartFourteen: pageBuilder.itemPage({
            title: 'Add one or more students between ages 18 and 23',
            path: 'report-674/add-students/:index/previous-term-dates',
            uiSchema: previousTermDatesPage.uiSchema,
            schema: previousTermDatesPage.schema,
            depends: (formData, index) =>
              isChapterFieldRequired(formData, TASK_KEYS.report674) &&
              formData?.studentInformation?.[index]?.schoolInformation
                ?.studentDidAttendSchoolLastTerm,
          }),
          addStudentsPartFifteen: pageBuilder.itemPage({
            title: 'Add one or more students between ages 18 and 23',
            path: 'report-674/add-students/:index/additional-student-income',
            uiSchema: claimsOrReceivesPensionPage.uiSchema,
            schema: claimsOrReceivesPensionPage.schema,
            depends: formData =>
              isChapterFieldRequired(formData, TASK_KEYS.report674),
          }),
          addStudentsPartSixteen: pageBuilder.itemPage({
            title: 'Add one or more students between ages 18 and 23',
            path: 'report-674/add-students/:index/all-student-income',
            uiSchema: studentEarningsPage.uiSchema,
            schema: studentEarningsPage.schema,
            depends: (formData, index) =>
              isChapterFieldRequired(formData, TASK_KEYS.report674) &&
              formData?.studentInformation?.[index]?.claimsOrReceivesPension,
          }),
          addStudentsPartSeventeen: pageBuilder.itemPage({
            title: 'Add one or more students between ages 18 and 23',
            path: 'report-674/add-students/:index/expected-student-income',
            uiSchema: studentFutureEarningsPage.uiSchema,
            schema: studentFutureEarningsPage.schema,
            depends: (formData, index) =>
              isChapterFieldRequired(formData, TASK_KEYS.report674) &&
              formData?.studentInformation?.[index]?.claimsOrReceivesPension,
          }),
          addStudentsPartEighteen: pageBuilder.itemPage({
            title: 'Add one or more students between ages 18 and 23',
            path: 'report-674/add-students/:index/student-assets',
            uiSchema: studentAssetsPage.uiSchema,
            schema: studentAssetsPage.schema,
            depends: (formData, index) =>
              isChapterFieldRequired(formData, TASK_KEYS.report674) &&
              formData?.studentInformation?.[index]?.claimsOrReceivesPension,
          }),
          addStudentsPartNineteen: pageBuilder.itemPage({
            title: 'Add one or more students between ages 18 and 23',
            path: 'report-674/add-students/:index/additional-remarks',
            uiSchema: remarksPage.uiSchema,
            schema: remarksPage.schema,
            depends: formData =>
              isChapterFieldRequired(formData, TASK_KEYS.report674),
          }),
        })),
      },
    },

    reportDivorce: {
      title: 'Remove a divorced spouse',
      pages: {
        formerSpouseInformation: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.reportDivorce),
          title: 'Information needed to report a divorce',
          path: 'report-a-divorce/former-spouse-information',
          uiSchema: formerSpouseInformation.uiSchema,
          schema: formerSpouseInformation.schema,
        },
        formerSpouseInformationPartTwo: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.reportDivorce),
          title: 'Information needed to report a divorce',
          path: 'report-a-divorce/divorce-information',
          uiSchema: formerSpouseInformationPartTwo.uiSchema,
          schema: formerSpouseInformationPartTwo.schema,
        },
        formerSpouseInformationPartThree: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.reportDivorce),
          title: 'Information needed to report a divorce',
          path: 'report-a-divorce/former-spouse-income',
          uiSchema: formerSpouseInformationPartThree.uiSchema,
          schema: formerSpouseInformationPartThree.schema,
        },
      },
    },

    reportStepchildNotInHousehold: {
      title: 'Remove one or more stepchildren who have left your household',
      pages: {
        ...arrayBuilderPages(removeChildHouseholdOptions, pageBuilder => ({
          removeChildHouseholdIntro: pageBuilder.introPage({
            title:
              'Information needed to report a stepchild is no longer part of your household',
            path: '686-stepchild-no-longer-part-of-household',
            uiSchema: removeChildHouseholdIntroPage.uiSchema,
            schema: removeChildHouseholdIntroPage.schema,
            depends: formData =>
              isChapterFieldRequired(
                formData,
                TASK_KEYS.reportStepchildNotInHousehold,
              ),
          }),
          removeChildHouseholdSummary: pageBuilder.summaryPage({
            title:
              'Information needed to report a stepchild is no longer part of your household',
            path: '686-stepchild-no-longer-part-of-household/summary',
            uiSchema: removeChildHouseholdSummaryPage.uiSchema,
            schema: removeChildHouseholdSummaryPage.schema,
            depends: formData =>
              isChapterFieldRequired(
                formData,
                TASK_KEYS.reportStepchildNotInHousehold,
              ),
          }),
          removeChildHouseholdPartOne: pageBuilder.itemPage({
            title:
              'Information needed to report a stepchild is no longer part of your household',
            path:
              '686-stepchild-no-longer-part-of-household/:index/child-information',
            uiSchema: householdChildInfoPage.uiSchema,
            schema: householdChildInfoPage.schema,
            depends: formData =>
              isChapterFieldRequired(
                formData,
                TASK_KEYS.reportStepchildNotInHousehold,
              ),
          }),
          removeChildHouseholdPartTwo: pageBuilder.itemPage({
            title:
              'Information needed to report a stepchild is no longer part of your household',
            path:
              '686-stepchild-no-longer-part-of-household/:index/veteran-supports-child',
            uiSchema: veteranSupportsChildPage.uiSchema,
            schema: veteranSupportsChildPage.schema,
            depends: formData =>
              isChapterFieldRequired(
                formData,
                TASK_KEYS.reportStepchildNotInHousehold,
              ),
          }),
          removeChildHouseholdPartThree: pageBuilder.itemPage({
            title:
              'Information needed to report a stepchild is no longer part of your household',
            path:
              '686-stepchild-no-longer-part-of-household/:index/child-support-amount',
            uiSchema: supportAmountPage.uiSchema,
            schema: supportAmountPage.schema,
            depends: (formData, index) =>
              isChapterFieldRequired(
                formData,
                TASK_KEYS.reportStepchildNotInHousehold,
              ) && formData?.stepChildren?.[index]?.supportingStepchild,
          }),
          removeChildHouseholdPartFour: pageBuilder.itemPage({
            title:
              'Information needed to report a stepchild is no longer part of your household',
            path:
              '686-stepchild-no-longer-part-of-household/:index/child-address',
            uiSchema: childAddressPage.uiSchema,
            schema: childAddressPage.schema,
            depends: formData =>
              isChapterFieldRequired(
                formData,
                TASK_KEYS.reportStepchildNotInHousehold,
              ),
          }),
          removeChildHouseholdPartFive: pageBuilder.itemPage({
            title:
              'Information needed to report a stepchild is no longer part of your household',
            path:
              '686-stepchild-no-longer-part-of-household/:index/parent-or-guardian',
            uiSchema: parentOrGuardianPage.uiSchema,
            schema: parentOrGuardianPage.schema,
            depends: formData =>
              isChapterFieldRequired(
                formData,
                TASK_KEYS.reportStepchildNotInHousehold,
              ),
          }),
        })),
      },
    },

    deceasedDependents: {
      title: 'Remove one or more dependents who have died',
      pages: {
        ...arrayBuilderPages(deceasedDependentOptions, pageBuilder => ({
          dependentAdditionalInformationIntro: pageBuilder.introPage({
            depends: formData =>
              isChapterFieldRequired(formData, TASK_KEYS.reportDeath),
            title: 'Information needed to remove a dependent who has died',
            path: '686-report-dependent-death',
            uiSchema: deceasedDependentIntroPage.uiSchema,
            schema: deceasedDependentIntroPage.schema,
          }),
          dependentAdditionalInformationSummary: pageBuilder.summaryPage({
            title: 'Information needed to remove a dependent who has died',
            path: '686-report-dependent-death/dependent-summary',
            uiSchema: deceasedDependentSummaryPage.uiSchema,
            schema: deceasedDependentSummaryPage.schema,
            depends: formData =>
              isChapterFieldRequired(formData, TASK_KEYS.reportDeath),
          }),
          dependentAdditionalInformationPartOne: pageBuilder.itemPage({
            title: 'Information needed to remove a dependent who has died',
            path: '686-report-dependent-death/:index/dependent-information',
            uiSchema: deceasedDependentPersonalInfoPage.uiSchema,
            schema: deceasedDependentPersonalInfoPage.schema,
            depends: formData =>
              isChapterFieldRequired(formData, TASK_KEYS.reportDeath),
          }),
          dependentAdditionalInformationPartTwo: pageBuilder.itemPage({
            title: 'Information needed to remove a dependent who has died',
            path: '686-report-dependent-death/:index/dependent-type',
            uiSchema: deceasedDependentTypePage.uiSchema,
            schema: deceasedDependentTypePage.schema,
            depends: formData =>
              isChapterFieldRequired(formData, TASK_KEYS.reportDeath),
          }),
          dependentAdditionalInformationPartThree: pageBuilder.itemPage({
            title: 'Information needed to remove a dependent who has died',
            path: '686-report-dependent-death/:index/child-type',
            uiSchema: deceasedDependentChildTypePage.uiSchema,
            schema: deceasedDependentChildTypePage.schema,
            depends: (formData, index) =>
              isChapterFieldRequired(formData, TASK_KEYS.reportDeath) &&
              formData?.deaths?.[index]?.dependentType === 'child',
          }),
          dependentAdditionalInformationPartFour: pageBuilder.itemPage({
            title: 'Information needed to remove a dependent who has died',
            path: '686-report-dependent-death/:index/date-of-death',
            uiSchema: deceasedDependentDateOfDeathPage.uiSchema,
            schema: deceasedDependentDateOfDeathPage.schema,
            depends: formData =>
              isChapterFieldRequired(formData, TASK_KEYS.reportDeath),
          }),
          dependentAdditionalInformationPartFive: pageBuilder.itemPage({
            title: 'Information needed to remove a dependent who has died',
            path: '686-report-dependent-death/:index/location-of-death',
            uiSchema: deceasedDependentLocationOfDeathPage.uiSchema,
            schema: deceasedDependentLocationOfDeathPage.schema,
            depends: formData =>
              isChapterFieldRequired(formData, TASK_KEYS.reportDeath),
          }),
          dependentAdditionalInformationPartSix: pageBuilder.itemPage({
            title: 'Information needed to remove a dependent who has died',
            path: '686-report-dependent-death/:index/dependent-income',
            uiSchema: deceasedDependentIncomePage.uiSchema,
            schema: deceasedDependentIncomePage.schema,
            depends: formData =>
              isChapterFieldRequired(formData, TASK_KEYS.reportDeath),
          }),
        })),
      },
    },

    reportChildMarriage: {
      title: 'Remove one or more children who got married',
      pages: {
        ...arrayBuilderPages(removeMarriedChildOptions, pageBuilder => ({
          removeMarriedChildIntro: pageBuilder.introPage({
            title:
              'Information needed to report the marriage of a child under 18',
            path: '686-report-marriage-of-child',
            uiSchema: removeMarriedChildIntroPage.uiSchema,
            schema: removeMarriedChildIntroPage.schema,
            depends: formData =>
              isChapterFieldRequired(
                formData,
                TASK_KEYS.reportMarriageOfChildUnder18,
              ),
          }),
          removeMarriedChildSummary: pageBuilder.summaryPage({
            title:
              'Information needed to report the marriage of a child under 18',
            path: '686-report-marriage-of-child/summary',
            uiSchema: removeMarriedChildSummaryPage.uiSchema,
            schema: removeMarriedChildSummaryPage.schema,
            depends: formData =>
              isChapterFieldRequired(
                formData,
                TASK_KEYS.reportMarriageOfChildUnder18,
              ),
          }),
          removeMarriedChildPartOne: pageBuilder.itemPage({
            title:
              'Information needed to report the marriage of a child under 18',
            path: '686-report-marriage-of-child/:index/child-information',
            uiSchema: marriedChildInformationPage.uiSchema,
            schema: marriedChildInformationPage.schema,
            depends: formData =>
              isChapterFieldRequired(
                formData,
                TASK_KEYS.reportMarriageOfChildUnder18,
              ),
          }),
          removeMarriedChildPartTwo: pageBuilder.itemPage({
            title:
              'Information needed to report the marriage of a child under 18',
            path: '686-report-marriage-of-child/:index/date-child-married',
            uiSchema: dateChildMarriedPage.uiSchema,
            schema: dateChildMarriedPage.schema,
            depends: formData =>
              isChapterFieldRequired(
                formData,
                TASK_KEYS.reportMarriageOfChildUnder18,
              ),
          }),
          removeMarriedChildPartThree: pageBuilder.itemPage({
            title:
              'Information needed to report the marriage of a child under 18',
            path: '686-report-marriage-of-child/:index/child-income',
            uiSchema: marriedChildIncomeQuestionPage.uiSchema,
            schema: marriedChildIncomeQuestionPage.schema,
            depends: formData =>
              isChapterFieldRequired(
                formData,
                TASK_KEYS.reportMarriageOfChildUnder18,
              ),
          }),
        })),
      },
    },

    reportChildStoppedAttendingSchool: {
      title:
        'Remove one or more children between ages 18 and 23 who left school',
      pages: {
        ...arrayBuilderPages(
          removeChildStoppedAttendingSchoolOptions,
          pageBuilder => ({
            childNoLongerInSchoolIntro: pageBuilder.introPage({
              title:
                'Information needed to report a child 18-23 years old stopped attending school',
              path: 'report-child-stopped-attending-school',
              uiSchema: removeChildStoppedAttendingSchoolIntroPage.uiSchema,
              schema: removeChildStoppedAttendingSchoolIntroPage.schema,
              depends: formData =>
                isChapterFieldRequired(
                  formData,
                  TASK_KEYS.reportChild18OrOlderIsNotAttendingSchool,
                ),
            }),
            childNoLongerInSchoolSummary: pageBuilder.summaryPage({
              title:
                'Information needed to report a child 18-23 years old stopped attending school',
              path: 'report-child-stopped-attending-school/summary',
              uiSchema: removeChildStoppedAttendingSchoolSummaryPage.uiSchema,
              schema: removeChildStoppedAttendingSchoolSummaryPage.schema,
              depends: formData =>
                isChapterFieldRequired(
                  formData,
                  TASK_KEYS.reportChild18OrOlderIsNotAttendingSchool,
                ),
            }),
            childNoLongerInSchoolPartOne: pageBuilder.itemPage({
              title:
                'Information needed to report a child 18-23 years old stopped attending school',
              path:
                'report-child-stopped-attending-school/:index/child-information',
              uiSchema: childInformationPage.uiSchema,
              schema: childInformationPage.schema,
              depends: formData =>
                isChapterFieldRequired(
                  formData,
                  TASK_KEYS.reportChild18OrOlderIsNotAttendingSchool,
                ),
            }),
            childNoLongerInSchoolPartTwo: pageBuilder.itemPage({
              title:
                'Information needed to report a child 18-23 years old stopped attending school',
              path:
                'report-child-stopped-attending-school/:index/date-child-left-school',
              uiSchema: dateChildLeftSchoolPage.uiSchema,
              schema: dateChildLeftSchoolPage.schema,
              depends: formData =>
                isChapterFieldRequired(
                  formData,
                  TASK_KEYS.reportChild18OrOlderIsNotAttendingSchool,
                ),
            }),
            childNoLongerInSchoolPartThree: pageBuilder.itemPage({
              title:
                'Information needed to report a child 18-23 years old stopped attending school',
              path: 'report-child-stopped-attending-school/:index/child-income',
              uiSchema: childIncomeQuestionPage.uiSchema,
              schema: childIncomeQuestionPage.schema,
              depends: formData =>
                isChapterFieldRequired(
                  formData,
                  TASK_KEYS.reportChild18OrOlderIsNotAttendingSchool,
                ),
            }),
          }),
        ),
      },
    },

    householdIncome: {
      title: 'Your net worth',
      pages: {
        householdIncome: {
          path: 'net-worth',
          title: 'Your net worth',
          uiSchema: householdIncome.uiSchema,
          schema: householdIncome.schema,
        },
      },
    },
  },
};

export default formConfig;
