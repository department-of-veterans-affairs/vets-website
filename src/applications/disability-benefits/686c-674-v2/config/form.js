import fullSchema from 'vets-json-schema/dist/686C-674-schema.json';
import environment from 'platform/utilities/environment';
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
  deceasedDependentInformation,
  deceasedDependentAdditionalInformation,
} from './chapters/report-dependent-death';
import { reportChildMarriage } from './chapters/report-marriage-of-child';
import { reportChildStoppedAttendingSchool } from './chapters/report-child-stopped-attending-school';
import {
  currentMarriageInformation,
  currentMarriageInformationPartTwo,
  currentMarriageInformationPartThree,
  currentMarriageInformationPartFour,
  doesLiveWithSpouse,
  marriageAdditionalEvidence,
  spouseInformation,
  spouseInformationPartTwo,
  spouseInformationPartThree,
  spouseMarriageHistory,
  spouseMarriageHistoryPartTwo,
  additionalQuestionsView,
  spouseMarriageHistoryDetails,
  spouseMarriageHistoryDetailsPartTwo,
  spouseMarriageHistoryDetailsPartThree,
  spouseMarriageHistoryDetailsPartFour,
  spouseMarriageHistoryDetailsPartFive,
  veteranMarriageHistory,
  veteranMarriageHistoryPartTwo,
  veteranAdditionalQuestionsView,
  veteranMarriageHistoryDetails,
  veteranMarriageHistoryDetailsPartTwo,
  veteranMarriageHistoryDetailsPartThree,
  veteranMarriageHistoryDetailsPartFour,
  veteranMarriageHistoryDetailsPartFive,
} from './chapters/report-add-a-spouse';
import {
  children,
  childPlaceOfBirth,
  childAdditionalInformation,
  childAdditionalEvidence,
} from './chapters/add-a-child';
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
          path: 'add-spouse/identification-information',
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
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse),
          title: 'Information needed to add your spouse: Marriage information',
          path: 'current-marriage-information/location-of-marriage',
          uiSchema: currentMarriageInformation.uiSchema,
          schema: currentMarriageInformation.schema,
        },
        currentMarriageInformationPartTwo: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse),
          title: 'Information needed to add your spouse: Marriage information',
          path: 'current-marriage-information/type-of-marriage',
          uiSchema: currentMarriageInformationPartTwo.uiSchema,
          schema: currentMarriageInformationPartTwo.schema,
        },
        currentMarriageInformationPartThree: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
            !formData?.doesLiveWithSpouse?.spouseDoesLiveWithVeteran,
          title: 'Information needed to add your spouse: Marriage information',
          path: 'current-marriage-information/spouse-address',
          uiSchema: currentMarriageInformationPartThree.uiSchema,
          schema: currentMarriageInformationPartThree.schema,
        },
        currentMarriageInformationPartFour: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
            !formData?.doesLiveWithSpouse?.spouseDoesLiveWithVeteran,
          title: 'Information needed to add your spouse: Marriage information',
          path: 'current-marriage-information/reason-for-living-separately',
          uiSchema: currentMarriageInformationPartFour.uiSchema,
          schema: currentMarriageInformationPartFour.schema,
        },
        spouseMarriageHistory: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse),
          title:
            'Information about your spouse’s former marriage(s): Marriage history',
          path: 'current-spouse-marriage-history',
          uiSchema: spouseMarriageHistory.uiSchema,
          schema: spouseMarriageHistory.schema,
        },
        spouseMarriageHistoryPartTwo: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
            formData?.spouseWasMarriedBefore,
          title:
            'Information about your spouse’s former marriage(s): Marriage history',
          path: 'current-spouse-marriage-history/previous-marriage',
          uiSchema: spouseMarriageHistoryPartTwo.uiSchema,
          schema: spouseMarriageHistoryPartTwo.schema,
        },
        additionalQuestionsView: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
            formData?.spouseWasMarriedBefore,
          title:
            'Information about your spouse’s former marriage(s): Marriage history details',
          path:
            'current-spouse-marriage-history/previous-marriage/additional-information',
          uiSchema: additionalQuestionsView.uiSchema,
          schema: additionalQuestionsView.schema,
        },
        spouseMarriageHistoryDetails: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
            formData?.spouseWasMarriedBefore,
          title:
            'Information about your spouse’s former marriage(s): Marriage history details',
          path:
            'current-spouse-marriage-history/previous-marriage/:index/how-marriage-ended',
          showPagePerItem: true,
          arrayPath: 'spouseMarriageHistory',
          uiSchema: spouseMarriageHistoryDetails.uiSchema,
          schema: spouseMarriageHistoryDetails.schema,
        },
        spouseMarriageHistoryDetailsPartTwo: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
            formData?.spouseWasMarriedBefore,
          title:
            'Information about your spouse’s former marriage(s): Marriage history details',
          path:
            'current-spouse-marriage-history/previous-marriage/:index/date-marriage-started',
          showPagePerItem: true,
          arrayPath: 'spouseMarriageHistory',
          uiSchema: spouseMarriageHistoryDetailsPartTwo.uiSchema,
          schema: spouseMarriageHistoryDetailsPartTwo.schema,
        },
        spouseMarriageHistoryDetailsPartThree: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
            formData?.spouseWasMarriedBefore,
          title:
            'Information about your spouse’s former marriage(s): Marriage history details',
          path:
            'current-spouse-marriage-history/previous-marriage/:index/date-marriage-ended',
          showPagePerItem: true,
          arrayPath: 'spouseMarriageHistory',
          uiSchema: spouseMarriageHistoryDetailsPartThree.uiSchema,
          schema: spouseMarriageHistoryDetailsPartThree.schema,
        },
        spouseMarriageHistoryDetailsPartFour: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
            formData?.spouseWasMarriedBefore,
          title:
            'Information about your spouse’s former marriage(s): Marriage history details',
          path:
            'current-spouse-marriage-history/previous-marriage/:index/location-where-marriage-started',
          showPagePerItem: true,
          arrayPath: 'spouseMarriageHistory',
          uiSchema: spouseMarriageHistoryDetailsPartFour.uiSchema,
          schema: spouseMarriageHistoryDetailsPartFour.schema,
        },
        spouseMarriageHistoryDetailsPartFive: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
            formData?.spouseWasMarriedBefore,
          title:
            'Information about your spouse’s former marriage(s): Marriage history details',
          path:
            'current-spouse-marriage-history/previous-marriage/:index/location-where-marriage-ended',
          showPagePerItem: true,
          arrayPath: 'spouseMarriageHistory',
          uiSchema: spouseMarriageHistoryDetailsPartFive.uiSchema,
          schema: spouseMarriageHistoryDetailsPartFive.schema,
        },
        veteranMarriageHistory: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse),
          title:
            'Information about your former marriage(s): Veteran marriage history',
          path: 'veteran-marriage-history/marital-status',
          uiSchema: veteranMarriageHistory.uiSchema,
          schema: veteranMarriageHistory.schema,
        },
        veteranMarriageHistoryPartTwo: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
            formData?.veteranWasMarriedBefore,
          title:
            'Information about your former marriage(s): Veteran marriage history',
          path: 'veteran-marriage-history',
          uiSchema: veteranMarriageHistoryPartTwo.uiSchema,
          schema: veteranMarriageHistoryPartTwo.schema,
        },
        veteranAdditionalQuestionsView: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
            formData?.veteranWasMarriedBefore,
          title:
            'Information about your former marriage(s): Marriage history details',
          path: 'veteran-marriage-history/additional-information',
          uiSchema: veteranAdditionalQuestionsView.uiSchema,
          schema: veteranAdditionalQuestionsView.schema,
        },
        veteranMarriageHistoryDetails: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
            formData?.veteranWasMarriedBefore,
          title:
            'Information about your former marriage(s): Veteran marriage history details',
          path: 'veteran-marriage-history/:index/how-marriage-ended',
          showPagePerItem: true,
          arrayPath: 'veteranMarriageHistory',
          uiSchema: veteranMarriageHistoryDetails.uiSchema,
          schema: veteranMarriageHistoryDetails.schema,
        },
        veteranMarriageHistoryDetailsPartTwo: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
            formData?.veteranWasMarriedBefore,
          title:
            'Information about your former marriage(s): Veteran marriage history details',
          path: 'veteran-marriage-history/:index/date-marriage-started',
          showPagePerItem: true,
          arrayPath: 'veteranMarriageHistory',
          uiSchema: veteranMarriageHistoryDetailsPartTwo.uiSchema,
          schema: veteranMarriageHistoryDetailsPartTwo.schema,
        },
        veteranMarriageHistoryDetailsPartThree: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
            formData?.veteranWasMarriedBefore,
          title:
            'Information about your former marriage(s): Veteran marriage history details',
          path: 'veteran-marriage-history/:index/date-marriage-ended',
          showPagePerItem: true,
          arrayPath: 'veteranMarriageHistory',
          uiSchema: veteranMarriageHistoryDetailsPartThree.uiSchema,
          schema: veteranMarriageHistoryDetailsPartThree.schema,
        },
        veteranMarriageHistoryDetailsPartFour: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
            formData?.veteranWasMarriedBefore,
          title:
            'Information about your former marriage(s): Veteran marriage history details',
          path:
            'veteran-marriage-history/:index/location-where-marriage-started',
          showPagePerItem: true,
          arrayPath: 'veteranMarriageHistory',
          uiSchema: veteranMarriageHistoryDetailsPartFour.uiSchema,
          schema: veteranMarriageHistoryDetailsPartFour.schema,
        },
        veteranMarriageHistoryDetailsPartFive: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
            formData?.veteranWasMarriedBefore,
          title:
            'Information about your former marriage(s): Veteran marriage history details',
          path: 'veteran-marriage-history/:index/location-where-marriage-ended',
          showPagePerItem: true,
          arrayPath: 'veteranMarriageHistory',
          uiSchema: veteranMarriageHistoryDetailsPartFive.uiSchema,
          schema: veteranMarriageHistoryDetailsPartFive.schema,
        },
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

    addChild: {
      title: 'Information needed to add children',
      pages: {
        addChildInformation: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addChild),
          title: 'Information needed to add your child: Basic information',
          path: 'add-child',
          uiSchema: children.uiSchema,
          schema: children.schema,
        },
        addChildPlaceOfBirth: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addChild),
          title: 'Information needed to add your child: Place of birth',
          path: 'add-child/:index',
          showPagePerItem: true,
          arrayPath: 'childrenToAdd',
          uiSchema: childPlaceOfBirth.uiSchema,
          schema: childPlaceOfBirth.schema,
        },
        addChildAdditionalInformation: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addChild),
          title: 'Information needed to add your child: Additional information',
          path: 'add-child/:index/additional-information',
          showPagePerItem: true,
          arrayPath: 'childrenToAdd',
          uiSchema: childAdditionalInformation.uiSchema,
          schema: childAdditionalInformation.schema,
          updateFormData: childAdditionalInformation.updateFormData,
        },
        childAdditionalEvidence: {
          depends: formData =>
            formData?.childrenToAdd?.some(
              child =>
                child?.childStatus?.stepchild === true ||
                child?.childStatus?.adopted === true ||
                child?.childStatus?.notCapable === true,
            ) && isChapterFieldRequired(formData, TASK_KEYS.addChild),
          title: 'Additional evidence needed to add child',
          path: 'add-child-evidence',
          uiSchema: childAdditionalEvidence.uiSchema,
          schema: childAdditionalEvidence.schema,
        },
      },
    },

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
        dependentInformation: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.reportDeath),
          title: 'Report the death of a dependent: Basic information',
          path: '686-report-dependent-death',
          uiSchema: deceasedDependentInformation.uiSchema,
          schema: deceasedDependentInformation.schema,
        },
        dependentAdditionalInformation: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.reportDeath),
          title: 'Report the death of a dependent: Additional information',
          path: '686-report-dependent-death/:index/additional-information',
          showPagePerItem: true,
          arrayPath: 'deaths',
          uiSchema: deceasedDependentAdditionalInformation.uiSchema,
          schema: deceasedDependentAdditionalInformation.schema,
        },
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
