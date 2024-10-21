import fullSchema from 'vets-json-schema/dist/686C-674-schema.json';
import environment from 'platform/utilities/environment';
import { stringifyUrlParams } from '@department-of-veterans-affairs/platform-forms-system/helpers';
import { getArrayIndexFromPathName } from 'platform/forms-system/src/js/patterns/array-builder/helpers';
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
} from './chapters/report-dependent-death/deceasedDependentArrayPages';
import { reportChildMarriage } from './chapters/report-marriage-of-child';
import { reportChildStoppedAttendingSchool } from './chapters/report-child-stopped-attending-school';
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
  stepchildren,
  stepchildInformation,
} from './chapters/stepchild-no-longer-part-of-household';
import {
  studentInformation,
  studentAdditionalInformationView,
  studentAdditionalInformation,
  studentAdditionalInformationPartTwo,
  studentAdditionalInformationPartThree,
  studentAdditionalInformationPartFour,
  studentAdditionalInformationPartFive,
  studentAdditionalInformationPartSix,
  studentAdditionalInformationPartSeven,
  studentAdditionalInformationPartEight,
  studentAdditionalInformationPartNine,
  studentAdditionalInformationPartTen,
  studentAdditionalInformationPartEleven,
  studentAdditionalInformationPartTwelve,
  studentAdditionalInformationPartThirteen,
} from './chapters/674';
import { householdIncome } from './chapters/household-income';

import manifest from '../manifest.json';
import prefillTransformer from './prefill-transformer';
import { chapter as addChild } from './chapters/report-add-child';

const emptyMigration = savedData => savedData;
const migrations = [emptyMigration];

export const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // NOTE: e2e tests will fail until the dependents_applications endpoint gets merged in to vets-api.
  // All e2e tests will be disabled until then. If you need to run an e2e test, temporarily change
  // dependents_appilcations to 21-686c.
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
          title: 'Information needed to add your spouse: Spouse information',
          path: 'add-spouse/current-legal-name',
          uiSchema: spouseInformation.uiSchema,
          schema: spouseInformation.schema,
        },
        spouseNameInformationPartTwo: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse),
          title: 'Information needed to add your spouse: Spouse information',
          path: 'add-spouse/personal-information',
          uiSchema: spouseInformationPartTwo.uiSchema,
          schema: spouseInformationPartTwo.schema,
        },
        spouseNameInformationPartThree: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
            formData?.spouseInformation?.isVeteran,
          title: 'Information needed to add your spouse: Spouse information',
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
        studentInformation: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.report674),
          title: 'Add one or more students between ages 18 and 23',
          path: 'report-674/add-students',
          uiSchema: studentInformation.uiSchema,
          schema: studentInformation.schema,
        },
        studentAdditionalInformationView: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.report674),
          title: 'Add one or more students between ages 18 and 23',
          path: 'report-674/additional-student-information',
          uiSchema: studentAdditionalInformationView.uiSchema,
          schema: studentAdditionalInformationView.schema,
        },
        studentAdditionalInformation: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.report674),
          title: 'Add one or more students between ages 18 and 23',
          path: 'report-674/:index/student-identification',
          arrayPath: 'studentInformation',
          showPagePerItem: true,
          uiSchema: studentAdditionalInformation.uiSchema,
          schema: studentAdditionalInformation.schema,
        },
        studentAdditionalInformationPartTwo: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.report674),
          title: 'Add one or more students between ages 18 and 23',
          path: 'report-674/:index/student-address',
          arrayPath: 'studentInformation',
          showPagePerItem: true,
          uiSchema: studentAdditionalInformationPartTwo.uiSchema,
          schema: studentAdditionalInformationPartTwo.schema,
        },
        studentAdditionalInformationPartThree: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.report674),
          title: 'Add one or more students between ages 18 and 23',
          path: 'report-674/:index/student-marriage',
          arrayPath: 'studentInformation',
          showPagePerItem: true,
          uiSchema: studentAdditionalInformationPartThree.uiSchema,
          schema: studentAdditionalInformationPartThree.schema,
        },
        studentAdditionalInformationPartFour: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.report674),
          title: 'Add one or more students between ages 18 and 23',
          path: 'report-674/:index/student-education-benefits',
          arrayPath: 'studentInformation',
          showPagePerItem: true,
          uiSchema: studentAdditionalInformationPartFour.uiSchema,
          schema: studentAdditionalInformationPartFour.schema,
        },
        studentAdditionalInformationPartFive: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.report674),
          title: 'Add one or more students between ages 18 and 23',
          path: 'report-674/:index/school-name',
          arrayPath: 'studentInformation',
          showPagePerItem: true,
          uiSchema: studentAdditionalInformationPartFive.uiSchema,
          schema: studentAdditionalInformationPartFive.schema,
        },
        studentAdditionalInformationPartSix: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.report674),
          title: 'Add one or more students between ages 18 and 23',
          path: 'report-674/:index/student-attendance',
          arrayPath: 'studentInformation',
          showPagePerItem: true,
          uiSchema: studentAdditionalInformationPartSix.uiSchema,
          schema: studentAdditionalInformationPartSix.schema,
        },
        studentAdditionalInformationPartSeven: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.report674),
          title: 'Add one or more students between ages 18 and 23',
          path: 'report-674/:index/school-accreditation',
          arrayPath: 'studentInformation',
          showPagePerItem: true,
          uiSchema: studentAdditionalInformationPartSeven.uiSchema,
          schema: studentAdditionalInformationPartSeven.schema,
        },
        studentAdditionalInformationPartEight: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.report674),
          title: 'Add one or more students between ages 18 and 23',
          path: 'report-674/:index/school-term-dates',
          arrayPath: 'studentInformation',
          showPagePerItem: true,
          uiSchema: studentAdditionalInformationPartEight.uiSchema,
          schema: studentAdditionalInformationPartEight.schema,
        },
        studentAdditionalInformationPartNine: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.report674),
          title: 'Add one or more students between ages 18 and 23',
          path: 'report-674/:index/student-previous-term',
          arrayPath: 'studentInformation',
          showPagePerItem: true,
          uiSchema: studentAdditionalInformationPartNine.uiSchema,
          schema: studentAdditionalInformationPartNine.schema,
        },
        studentAdditionalInformationPartTen: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.report674),
          title: 'Add one or more students between ages 18 and 23',
          path: 'report-674/:index/student-income-at-school',
          arrayPath: 'studentInformation',
          showPagePerItem: true,
          uiSchema: studentAdditionalInformationPartTen.uiSchema,
          schema: studentAdditionalInformationPartTen.schema,
        },
        studentAdditionalInformationPartEleven: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.report674),
          title: 'Add one or more students between ages 18 and 23',
          path: 'report-674/:index/student-expected-income-at-school',
          arrayPath: 'studentInformation',
          showPagePerItem: true,
          uiSchema: studentAdditionalInformationPartEleven.uiSchema,
          schema: studentAdditionalInformationPartEleven.schema,
        },
        studentAdditionalInformationPartTwelve: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.report674),
          title: 'Add one or more students between ages 18 and 23',
          path: 'report-674/:index/student-assets',
          arrayPath: 'studentInformation',
          showPagePerItem: true,
          uiSchema: studentAdditionalInformationPartTwelve.uiSchema,
          schema: studentAdditionalInformationPartTwelve.schema,
        },
        studentAdditionalInformationPartThirteen: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.report674),
          title: 'Add one or more students between ages 18 and 23',
          path: 'report-674/:index/additional-remarks',
          arrayPath: 'studentInformation',
          showPagePerItem: true,
          uiSchema: studentAdditionalInformationPartThirteen.uiSchema,
          schema: studentAdditionalInformationPartThirteen.schema,
        },
      },
    },

    reportDivorce: {
      title: 'Information needed to remove a divorced spouse',
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
      },
    },

    reportStepchildNotInHousehold: {
      title:
        'Information needed to remove a stepchild who has left your household',
      pages: {
        stepchildren: {
          depends: formData =>
            isChapterFieldRequired(
              formData,
              TASK_KEYS.reportStepchildNotInHousehold,
            ),
          title:
            'Information needed to report a stepchild is no longer part of your household: Basic information',
          path: '686-stepchild-no-longer-part-of-household',
          uiSchema: stepchildren.uiSchema,
          schema: stepchildren.schema,
        },
        stepchildInformation: {
          depends: formData =>
            isChapterFieldRequired(
              formData,
              TASK_KEYS.reportStepchildNotInHousehold,
            ),
          title:
            'Information needed to report a stepchild is no longer part of your household: Additional information',
          path: '686-stepchild-no-longer-part-of-household/:index',
          showPagePerItem: true,
          arrayPath: 'stepChildren',
          uiSchema: stepchildInformation.uiSchema,
          schema: stepchildInformation.schema,
          updateFormData: stepchildInformation.updateFormData,
        },
      },
    },

    deceasedDependents: {
      title: 'Information needed to remove a dependent who has died',
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
            path: '686-report-dependent-death/:index/child-status',
            uiSchema: deceasedDependentTypePage.uiSchema,
            schema: deceasedDependentTypePage.schema,
            depends: formData =>
              isChapterFieldRequired(formData, TASK_KEYS.reportDeath),
            onNavForward: ({
              formData,
              pathname,
              urlParams,
              goPath,
              goNextPath,
            }) => {
              if (formData.dependentType !== 'child') {
                const index = getArrayIndexFromPathName(pathname);
                const urlParamsString = stringifyUrlParams(urlParams) || '';
                goPath(
                  `/686-report-dependent-death/${index}/date-of-death${urlParamsString}`,
                );
              } else {
                goNextPath(urlParams);
              }
            },
          }),
          dependentAdditionalInformationPartThree: pageBuilder.itemPage({
            title: 'Information needed to remove a dependent who has died',
            path: '686-report-dependent-death/:index/child-type',
            uiSchema: deceasedDependentChildTypePage.uiSchema,
            schema: deceasedDependentChildTypePage.schema,
            depends: formData =>
              isChapterFieldRequired(formData, TASK_KEYS.reportDeath),
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
        })),
      },
    },

    reportChildMarriage: {
      title: 'Remove one or more children who got married',
      pages: {
        childInformation: {
          depends: formData =>
            isChapterFieldRequired(
              formData,
              TASK_KEYS.reportMarriageOfChildUnder18,
            ),
          title:
            'Information needed to report the marriage of a child under 18',
          path: '686-report-marriage-of-child',
          uiSchema: reportChildMarriage.uiSchema,
          schema: reportChildMarriage.schema,
        },
      },
    },

    reportChildStoppedAttendingSchool: {
      title:
        'Remove one or more children between ages 18 and 23 who left school',
      pages: {
        childNoLongerInSchool: {
          depends: formData =>
            isChapterFieldRequired(
              formData,
              TASK_KEYS.reportChild18OrOlderIsNotAttendingSchool,
            ),
          title:
            'Information needed to report a child 18-23 years old stopped attending school',
          path: 'report-child-stopped-attending-school',
          uiSchema: reportChildStoppedAttendingSchool.uiSchema,
          schema: reportChildStoppedAttendingSchool.schema,
        },
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
