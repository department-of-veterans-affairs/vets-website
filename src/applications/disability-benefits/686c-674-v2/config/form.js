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
import { formerSpouseInformation } from './chapters/report-divorce';
import {
  deceasedDependentInformation,
  deceasedDependentAdditionalInformation,
} from './chapters/report-dependent-death';
import { reportChildMarriage } from './chapters/report-marriage-of-child';
import { reportChildStoppedAttendingSchool } from './chapters/report-child-stopped-attending-school';
import {
  currentMarriageInformation,
  doesLiveWithSpouse,
  marriageAdditionalEvidence,
  spouseInformation,
  spouseInformationPartTwo,
  spouseInformationPartThree,
  spouseMarriageHistory,
  spouseMarriageHistoryDetails,
  veteranMarriageHistory,
  veteranMarriageHistoryDetails,
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
  studentNameAndSsn,
  studentAddressMarriageTuition,
  studentSchoolAddress,
  studentTermDates,
  studentLastTerm,
  studentIncomeInformation,
  studentNetworthInformation,
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
          // updateFormData: veteranAddress.updateFormData,
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
        currentMarriageInformation: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse),
          title: 'Information needed to add your spouse: Marriage information',
          path: 'current-marriage-information/type-of-marriage',
          uiSchema: currentMarriageInformation.uiSchema,
          schema: currentMarriageInformation.schema,
        },
        doesLiveWithSpouse: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse),
          title: 'Information needed to add your spouse: Address information',
          path: 'current-marriage-address',
          uiSchema: doesLiveWithSpouse.uiSchema,
          schema: doesLiveWithSpouse.schema,
          updateFormData: doesLiveWithSpouse.updateFormData,
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
        spouseMarriageHistoryDetails: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse),
          title:
            'Information about your spouse’s former marriage(s): Marriage history details',
          path: 'current-spouse-marriage-history/:index',
          showPagePerItem: true,
          arrayPath: 'spouseMarriageHistory',
          uiSchema: spouseMarriageHistoryDetails.uiSchema,
          schema: spouseMarriageHistoryDetails.schema,
        },
        veteranMarriageHistory: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse),
          title:
            'Information about your former marriage(s): Veteran marriage history',
          path: 'veteran-marriage-history',
          uiSchema: veteranMarriageHistory.uiSchema,
          schema: veteranMarriageHistory.schema,
        },
        veteranMarriageHistoryDetails: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse),
          title:
            'Information about your former marriage(s): Veteran marriage history details',
          path: 'veteran-marriage-history/:index',
          showPagePerItem: true,
          arrayPath: 'veteranMarriageHistory',
          uiSchema: veteranMarriageHistoryDetails.uiSchema,
          schema: veteranMarriageHistoryDetails.schema,
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
      title: 'Information needed to add a student 18 to 23 years old',
      pages: {
        studentNameAndSsn: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.report674),
          title:
            'Information needed to add a student 18 to 23 years old: Basic information',
          path: 'report-674',
          uiSchema: studentNameAndSsn.uiSchema,
          schema: studentNameAndSsn.schema,
        },
        studentAddressMarriageTuition: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.report674),
          title:
            'Information needed to add a student 18 to 23 years old: Additional information',
          path: 'report-674-student-address',
          uiSchema: studentAddressMarriageTuition.uiSchema,
          schema: studentAddressMarriageTuition.schema,
          updateFormData: studentAddressMarriageTuition.updateFormData,
        },
        studentSchoolAddress: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.report674),
          title:
            'Information needed to add a student 18 to 23 years old: School addresses',
          path: 'report-674-student-school-address',
          uiSchema: studentSchoolAddress.uiSchema,
          schema: studentSchoolAddress.schema,
        },
        studentTermDates: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.report674),
          title:
            'Information needed to add a student 18 to 23 years old: Student term dates',
          path: 'report-674-student-school-term-dates',
          uiSchema: studentTermDates.uiSchema,
          schema: studentTermDates.schema,
        },
        studentLastTerm: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.report674),
          title:
            'Information needed to add a student 18 to 23 years old: Last term date',
          path: 'report-674-student-last-term-information',
          uiSchema: studentLastTerm.uiSchema,
          schema: studentLastTerm.schema,
        },
        // NOTE: These are temporarily disabled, and will be reintroduced post-launch as part of 674 pension support.
        studentIncomeInformation: {
          depends: () => false,
          title:
            'Information needed to add a student 18 to 23 years old: Income information',
          path: 'report-674-student-income-information',
          uiSchema: studentIncomeInformation.uiSchema,
          schema: studentIncomeInformation.schema,
        },
        studentNetworthInformation: {
          depends: () => false,
          title:
            'Information needed to add a student 18 to 23 years old: Net worth information',
          path: 'report-674-student-networth-information',
          uiSchema: studentNetworthInformation.uiSchema,
          schema: studentNetworthInformation.schema,
        },
      },
    },
    reportDivorce: {
      title: 'Information needed to remove a divorced spouse',
      pages: {
        formerSpouseDetails: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.reportDivorce),
          title: 'Information needed to report a divorce',
          path: 'report-a-divorce',
          uiSchema: formerSpouseInformation.uiSchema,
          schema: formerSpouseInformation.schema,
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
      title: 'Information to remove a child under 18 who has married',
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
        'Information to remove a child 18 to 23 years old who has stopped attending school',
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
