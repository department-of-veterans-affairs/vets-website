import { TASK_KEYS, MARRIAGE_TYPES } from './constants';
import { isChapterFieldRequired } from './helpers';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

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
import { wizard } from './chapters/taskWizard';
import {
  veteranInformation,
  veteranAddress,
} from './chapters/veteran-information';
import {
  stepchildren,
  stepchildInformation,
} from './chapters/stepchild-no-longer-part-of-household';
import {
  studentNameAndSSN,
  studentAddressMarriageTuition,
  studentSchoolAddress,
  studentTermDates,
  studentLastTerm,
  studentIncomeInformation,
  studentNetworthInformation,
} from './chapters/674';

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/api',
  trackingPrefix: 'new-686-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '21-686',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for declare or remove a dependent.',
    noAuth:
      'Please sign in again to continue your application for declare or remove a dependent.',
  },
  title: 'New 686',
  defaultDefinitions: {},
  chapters: {
    optionSelection: {
      title: '686c Options',
      pages: {
        wizard: {
          title: '686c Options',
          path: '686-options-selection',
          uiSchema: wizard.uiSchema,
          schema: wizard.schema,
        },
      },
    },
    veteranInformation: {
      title: "Veteran's Information",
      pages: {
        veteranInformation: {
          path: 'veteran-information',
          title: 'Veteran Information',
          uiSchema: veteranInformation.uiSchema,
          schema: veteranInformation.schema,
        },
        veteranAddress: {
          path: 'veteran-address',
          title: 'Veteran Address',
          uiSchema: veteranAddress.uiSchema,
          schema: veteranAddress.schema,
        },
      },
    },
    addChild: {
      title: 'Information needed to add your child',
      pages: {
        addChildInformation: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addChild),
          title: 'Information needed to add your child',
          path: 'add-child',
          uiSchema: children.uiSchema,
          schema: children.schema,
        },
        addChildPlaceOfBirth: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addChild),
          title: 'Information needed to add your child',
          path: 'add-child/:index',
          showPagePerItem: true,
          arrayPath: 'childrenToAdd',
          uiSchema: childPlaceOfBirth.uiSchema,
          schema: childPlaceOfBirth.schema,
        },
        addChildAdditionalInformation: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addChild),
          title: 'Information needed to add your child',
          path: 'add-child/:index/additional-information',
          showPagePerItem: true,
          arrayPath: 'childrenToAdd',
          uiSchema: childAdditionalInformation.uiSchema,
          schema: childAdditionalInformation.schema,
        },
        childAdditionalEvidence: {
          depends: formData =>
            formData?.childrenToAdd?.some(
              child => child?.childStatus?.stepchild === true,
            ),
          title: 'Additional evidence needed to add child',
          path: 'add-child-evidence',
          uiSchema: childAdditionalEvidence.uiSchema,
          schema: childAdditionalEvidence.schema,
        },
      },
    },
    addSpouse: {
      title: 'Information needed to add your spouse',
      pages: {
        spouseNameInformation: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse),
          title: 'Information needed to add your spouse',
          path: 'add-spouse',
          uiSchema: spouseInformation.uiSchema,
          schema: spouseInformation.schema,
        },
        currentMarriageInformation: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse),
          title: 'Information needed to add your spouse',
          path: 'current-marriage-information',
          uiSchema: currentMarriageInformation.uiSchema,
          schema: currentMarriageInformation.schema,
        },
        doesLiveWithSpouse: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse),
          title: 'Information needed to add your spouse',
          path: 'current-marriage-address',
          uiSchema: doesLiveWithSpouse.uiSchema,
          schema: doesLiveWithSpouse.schema,
        },
        spouseMarriageHistory: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse),
          title: 'Information needed to add your spouse',
          path: 'current-spouse-marriage-history',
          uiSchema: spouseMarriageHistory.uiSchema,
          schema: spouseMarriageHistory.schema,
        },
        spouseMarriageHistoryDetails: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse),
          title: 'Information needed to add your spouse',
          path: 'current-spouse-marriage-history/:index',
          showPagePerItem: true,
          arrayPath: 'spouseMarriageHistory',
          uiSchema: spouseMarriageHistoryDetails.uiSchema,
          schema: spouseMarriageHistoryDetails.schema,
        },
        veteranMarriageHistory: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse),
          title: 'Information about your former marriage(s)',
          path: 'veteran-marriage-history',
          uiSchema: veteranMarriageHistory.uiSchema,
          schema: veteranMarriageHistory.schema,
        },
        veteranMarriageHistoryDetails: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse),
          title: 'Information about your former marriage(s)',
          path: 'veteran-marriage-history/:index',
          showPagePerItem: true,
          arrayPath: 'veteranMarriageHistory',
          uiSchema: veteranMarriageHistoryDetails.uiSchema,
          schema: veteranMarriageHistoryDetails.schema,
        },
        marriageAdditionalEvidence: {
          depends: formData =>
            typeof formData.marriageType === 'string' &&
            formData.marriageType !== MARRIAGE_TYPES.ceremonial,
          title: 'Additional evidence needed to add spouse',
          path: 'add-spouse-evidence',
          uiSchema: marriageAdditionalEvidence.uiSchema,
          schema: marriageAdditionalEvidence.schema,
        },
      },
    },
    reportDivorce: {
      title: 'Information needed to report a divorce',
      pages: {
        formerSpouseDetails: {
          depends: formData =>
            // if addSpouse is selected, divorce should not appear since the information is the same.
            // otherwise, show reportDivorce.
            isChapterFieldRequired(formData, TASK_KEYS.addSpouse)
              ? false
              : isChapterFieldRequired(formData, TASK_KEYS.reportDivorce),
          title: 'Information needed to report a divorce',
          path: 'report-a-divorce',
          uiSchema: formerSpouseInformation.uiSchema,
          schema: formerSpouseInformation.schema,
        },
      },
    },
    deceasedDependents: {
      title: 'Report the death of a dependent',
      pages: {
        dependentInformation: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.reportDeath),
          title: 'Report the death of a dependent',
          path: '686-report-dependent-death',
          uiSchema: deceasedDependentInformation.uiSchema,
          schema: deceasedDependentInformation.schema,
        },
        dependentAdditionalInformation: {
          title: 'Report the death of a dependent',
          path: '686-report-dependent-death/:index/additional-information',
          showPagePerItem: true,
          arrayPath: 'deaths',
          uiSchema: deceasedDependentAdditionalInformation.uiSchema,
          schema: deceasedDependentAdditionalInformation.schema,
        },
      },
    },
    reportChildMarriage: {
      title: 'Information needed to report the marriage of a child under 18',
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
        'Information needed to report a child 18-23 years old stopped attending school',
      pages: {
        childNoLongerInSchool: {
          depends: formData =>
            isChapterFieldRequired(
              formData,
              TASK_KEYS.reportChild18orOlderIsNotAttendingSchool,
            ),
          title:
            'Information needed to report a child 18-23 years old stopped attending school',
          path: 'report-child-stopped-attending-school',
          uiSchema: reportChildStoppedAttendingSchool.uiSchema,
          schema: reportChildStoppedAttendingSchool.schema,
        },
      },
    },
    reportStepchildNotInHousehold: {
      title:
        'Information needed to report a stepchild is no longer part of your household',
      pages: {
        stepchildren: {
          depends: formData =>
            isChapterFieldRequired(
              formData,
              TASK_KEYS.reportStepchildNotInHousehold,
            ),
          title:
            'Information needed to report a stepchild is no longer part of your household',
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
            'Information needed to report a stepchild is no longer part of your household',
          path: '686-stepchild-no-longer-part-of-household/:index',
          showPagePerItem: true,
          arrayPath: 'stepChildren',
          uiSchema: stepchildInformation.uiSchema,
          schema: stepchildInformation.schema,
        },
      },
    },
    report674: {
      title:
        'Information needed to add a student 18 to 23 years old (VA 21-674)',
      pages: {
        studentNameAndSSN: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.report674),
          title:
            'Information needed to add a student 18 to 23 years old (VA 21-674)',
          path: 'report-674',
          uiSchema: studentNameAndSSN.uiSchema,
          schema: studentNameAndSSN.schema,
        },
        studentAddressMarriageTuition: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.report674),
          title:
            'Information needed to add a student 18 to 23 years old (VA 21-674)',
          path: 'report-674-student-address',
          uiSchema: studentAddressMarriageTuition.uiSchema,
          schema: studentAddressMarriageTuition.schema,
        },
        studentSchoolAddress: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.report674),
          title:
            'Information needed to add a student 18 to 23 years old (VA 21-674)',
          path: 'report-674-student-school-address',
          uiSchema: studentSchoolAddress.uiSchema,
          schema: studentSchoolAddress.schema,
        },
        studentTermDates: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.report674),
          title:
            'Information needed to add a student 18 to 23 years old (VA 21-674)',
          path: 'report-674-student-school-term-dates',
          uiSchema: studentTermDates.uiSchema,
          schema: studentTermDates.schema,
        },
        studentLastTerm: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.report674),
          title:
            'Information needed to add a student 18 to 23 years old (VA 21-674)',
          path: 'report-674-student-last-term-information',
          uiSchema: studentLastTerm.uiSchema,
          schema: studentLastTerm.schema,
        },
        studentIncomeInformation: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.report674),
          title:
            'Information needed to add a student 18 to 23 years old (VA 21-674)',
          path: 'report-674-student-income-information',
          uiSchema: studentIncomeInformation.uiSchema,
          schema: studentIncomeInformation.schema,
        },
        studentNetworthInformation: {
          depends: formData =>
            isChapterFieldRequired(formData, TASK_KEYS.report674),
          title:
            'Information needed to add a student 18 to 23 years old (VA 21-674)',
          path: 'report-674-student-networth-information',
          uiSchema: studentNetworthInformation.uiSchema,
          schema: studentNetworthInformation.schema,
        },
      },
    },
  },
};

export default formConfig;
