import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';

import {
  formerSpouseInformation,
  formerSpouseInformationPartThree,
  formerSpouseInformationPartTwo,
} from './report-divorce';

import {
  childAddressPage,
  householdChildInfoPage,
  parentOrGuardianPage,
  removeChildHouseholdIntroPage,
  removeChildHouseholdOptions,
  removeChildHouseholdSummaryPage,
  stepchildLeftHouseholdDatePage,
  supportAmountPage,
  veteranSupportsChildPage,
} from './stepchild-no-longer-part-of-household/removeChildHouseholdArrayPages';

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
} from './report-dependent-death/deceasedDependentArrayPages';

import {
  removeChildStoppedAttendingSchoolOptions,
  removeChildStoppedAttendingSchoolIntroPage,
  removeChildStoppedAttendingSchoolSummaryPage,
  childInformationPage,
  dateChildLeftSchoolPage,
  childIncomeQuestionPage,
} from './report-child-stopped-attending-school/removeChildStoppedAttendingSchoolArrayPages';
import {
  removeMarriedChildIntroPage,
  removeMarriedChildOptions,
  removeMarriedChildSummaryPage,
  marriedChildInformationPage,
  marriedChildIncomeQuestionPage,
  dateChildMarriedPage,
} from './report-marriage-of-child/removeMarriedChildArrayPages';

import { TASK_KEYS } from '../constants';
import { isChapterFieldRequired } from '../helpers';
import { isRemovingDependents, noV3Picklist } from '../utilities';

export const reportDivorce = {
  title: 'Remove a divorced spouse',
  pages: {
    formerSpouseInformation: {
      depends: formData =>
        noV3Picklist(formData) &&
        isChapterFieldRequired(formData, TASK_KEYS.reportDivorce) &&
        isRemovingDependents(formData),
      title: 'Divorced spouse’s information',
      path: 'report-a-divorce/former-spouse-information',
      uiSchema: formerSpouseInformation.uiSchema,
      schema: formerSpouseInformation.schema,
    },
    formerSpouseInformationPartTwo: {
      depends: formData =>
        noV3Picklist(formData) &&
        isChapterFieldRequired(formData, TASK_KEYS.reportDivorce) &&
        isRemovingDependents(formData),
      title: 'When, where, and why did this marriage end?',
      path: 'report-a-divorce/divorce-information',
      uiSchema: formerSpouseInformationPartTwo.uiSchema,
      schema: formerSpouseInformationPartTwo.schema,
    },
    formerSpouseInformationPartThree: {
      depends: formData =>
        noV3Picklist(formData) &&
        isChapterFieldRequired(formData, TASK_KEYS.reportDivorce) &&
        isRemovingDependents(formData) &&
        !formData?.vaDependentsNetWorthAndPension,
      title: 'Divorced spouse’s income',
      path: 'report-a-divorce/former-spouse-income',
      uiSchema: formerSpouseInformationPartThree.uiSchema,
      schema: formerSpouseInformationPartThree.schema,
    },
  },
};

export const reportStepchildNotInHousehold = {
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
          noV3Picklist(formData) &&
          isChapterFieldRequired(
            formData,
            TASK_KEYS.reportStepchildNotInHousehold,
          ) &&
          isRemovingDependents(formData),
      }),
      removeChildHouseholdSummary: pageBuilder.summaryPage({
        title:
          'Information needed to report a stepchild is no longer part of your household',
        path: '686-stepchild-no-longer-part-of-household/summary',
        uiSchema: removeChildHouseholdSummaryPage.uiSchema,
        schema: removeChildHouseholdSummaryPage.schema,
        depends: formData =>
          noV3Picklist(formData) &&
          isChapterFieldRequired(
            formData,
            TASK_KEYS.reportStepchildNotInHousehold,
          ) &&
          isRemovingDependents(formData),
      }),
      removeChildHouseholdPartOne: pageBuilder.itemPage({
        title:
          'Information needed to report a stepchild is no longer part of your household',
        path:
          '686-stepchild-no-longer-part-of-household/:index/child-information',
        uiSchema: householdChildInfoPage.uiSchema,
        schema: householdChildInfoPage.schema,
        depends: formData =>
          noV3Picklist(formData) &&
          isChapterFieldRequired(
            formData,
            TASK_KEYS.reportStepchildNotInHousehold,
          ) &&
          isRemovingDependents(formData),
      }),
      stepchildLeftHouseholdDate: pageBuilder.itemPage({
        title:
          'Information needed to report a stepchild is no longer part of your household',
        path:
          '686-stepchild-no-longer-part-of-household/:index/date-child-left-household',
        uiSchema: stepchildLeftHouseholdDatePage.uiSchema,
        schema: stepchildLeftHouseholdDatePage.schema,
        depends: formData =>
          noV3Picklist(formData) &&
          isChapterFieldRequired(
            formData,
            TASK_KEYS.reportStepchildNotInHousehold,
          ) &&
          isRemovingDependents(formData),
      }),
      removeChildHouseholdPartTwo: pageBuilder.itemPage({
        title:
          'Information needed to report a stepchild is no longer part of your household',
        path:
          '686-stepchild-no-longer-part-of-household/:index/veteran-supports-child',
        uiSchema: veteranSupportsChildPage.uiSchema,
        schema: veteranSupportsChildPage.schema,
        depends: formData =>
          noV3Picklist(formData) &&
          isChapterFieldRequired(
            formData,
            TASK_KEYS.reportStepchildNotInHousehold,
          ) &&
          isRemovingDependents(formData),
      }),
      removeChildHouseholdPartThree: pageBuilder.itemPage({
        title:
          'Information needed to report a stepchild is no longer part of your household',
        path:
          '686-stepchild-no-longer-part-of-household/:index/child-support-amount',
        uiSchema: supportAmountPage.uiSchema,
        schema: supportAmountPage.schema,
        depends: (formData, index) =>
          noV3Picklist(formData) &&
          isChapterFieldRequired(
            formData,
            TASK_KEYS.reportStepchildNotInHousehold,
          ) &&
          isRemovingDependents(formData) &&
          formData?.stepChildren?.[index]?.supportingStepchild,
      }),
      removeChildHouseholdPartFour: pageBuilder.itemPage({
        title:
          'Information needed to report a stepchild is no longer part of your household',
        path: '686-stepchild-no-longer-part-of-household/:index/child-address',
        uiSchema: childAddressPage.uiSchema,
        schema: childAddressPage.schema,
        depends: formData =>
          noV3Picklist(formData) &&
          isChapterFieldRequired(
            formData,
            TASK_KEYS.reportStepchildNotInHousehold,
          ) &&
          isRemovingDependents(formData),
      }),
      removeChildHouseholdPartFive: pageBuilder.itemPage({
        title:
          'Information needed to report a stepchild is no longer part of your household',
        path:
          '686-stepchild-no-longer-part-of-household/:index/parent-or-guardian',
        uiSchema: parentOrGuardianPage.uiSchema,
        schema: parentOrGuardianPage.schema,
        depends: formData =>
          noV3Picklist(formData) &&
          isChapterFieldRequired(
            formData,
            TASK_KEYS.reportStepchildNotInHousehold,
          ) &&
          isRemovingDependents(formData),
      }),
    })),
  },
};

export const deceasedDependents = {
  title: 'Remove one or more dependents who have died',
  pages: {
    ...arrayBuilderPages(deceasedDependentOptions, pageBuilder => ({
      dependentAdditionalInformationIntro: pageBuilder.introPage({
        depends: formData =>
          noV3Picklist(formData) &&
          isChapterFieldRequired(formData, TASK_KEYS.reportDeath) &&
          isRemovingDependents(formData),
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
          noV3Picklist(formData) &&
          isChapterFieldRequired(formData, TASK_KEYS.reportDeath) &&
          isRemovingDependents(formData),
      }),
      dependentAdditionalInformationPartOne: pageBuilder.itemPage({
        title: 'Information needed to remove a dependent who has died',
        path: '686-report-dependent-death/:index/dependent-information',
        uiSchema: deceasedDependentPersonalInfoPage.uiSchema,
        schema: deceasedDependentPersonalInfoPage.schema,
        depends: formData =>
          noV3Picklist(formData) &&
          isChapterFieldRequired(formData, TASK_KEYS.reportDeath) &&
          isRemovingDependents(formData),
      }),
      dependentAdditionalInformationPartTwo: pageBuilder.itemPage({
        title: 'Information needed to remove a dependent who has died',
        path: '686-report-dependent-death/:index/dependent-type',
        uiSchema: deceasedDependentTypePage.uiSchema,
        schema: deceasedDependentTypePage.schema,
        depends: formData =>
          noV3Picklist(formData) &&
          isChapterFieldRequired(formData, TASK_KEYS.reportDeath) &&
          isRemovingDependents(formData),
      }),
      dependentAdditionalInformationPartThree: pageBuilder.itemPage({
        title: 'Information needed to remove a dependent who has died',
        path: '686-report-dependent-death/:index/child-type',
        uiSchema: deceasedDependentChildTypePage.uiSchema,
        schema: deceasedDependentChildTypePage.schema,
        depends: (formData, index) =>
          noV3Picklist(formData) &&
          isChapterFieldRequired(formData, TASK_KEYS.reportDeath) &&
          isRemovingDependents(formData) &&
          formData?.deaths?.[index]?.dependentType === 'CHILD',
      }),
      dependentAdditionalInformationPartFour: pageBuilder.itemPage({
        title: 'Information needed to remove a dependent who has died',
        path: '686-report-dependent-death/:index/date-of-death',
        uiSchema: deceasedDependentDateOfDeathPage.uiSchema,
        schema: deceasedDependentDateOfDeathPage.schema,
        depends: formData =>
          noV3Picklist(formData) &&
          isChapterFieldRequired(formData, TASK_KEYS.reportDeath) &&
          isRemovingDependents(formData),
      }),
      dependentAdditionalInformationPartFive: pageBuilder.itemPage({
        title: 'Information needed to remove a dependent who has died',
        path: '686-report-dependent-death/:index/location-of-death',
        uiSchema: deceasedDependentLocationOfDeathPage.uiSchema,
        schema: deceasedDependentLocationOfDeathPage.schema,
        depends: formData =>
          noV3Picklist(formData) &&
          isChapterFieldRequired(formData, TASK_KEYS.reportDeath) &&
          isRemovingDependents(formData),
      }),
      dependentAdditionalInformationPartSix: pageBuilder.itemPage({
        title: 'Information needed to remove a dependent who has died',
        path: '686-report-dependent-death/:index/dependent-income',
        uiSchema: deceasedDependentIncomePage.uiSchema,
        schema: deceasedDependentIncomePage.schema,
        depends: formData =>
          noV3Picklist(formData) &&
          isChapterFieldRequired(formData, TASK_KEYS.reportDeath) &&
          isRemovingDependents(formData) &&
          !formData?.vaDependentsNetWorthAndPension,
      }),
    })),
  },
};

export const reportChildMarriage = {
  title: 'Remove one or more children who got married',
  pages: {
    ...arrayBuilderPages(removeMarriedChildOptions, pageBuilder => ({
      removeMarriedChildIntro: pageBuilder.introPage({
        title: 'Information needed to report the marriage of a child under 18',
        path: '686-report-marriage-of-child',
        uiSchema: removeMarriedChildIntroPage.uiSchema,
        schema: removeMarriedChildIntroPage.schema,
        depends: formData =>
          noV3Picklist(formData) &&
          isChapterFieldRequired(
            formData,
            TASK_KEYS.reportMarriageOfChildUnder18,
          ) &&
          isRemovingDependents(formData),
      }),
      removeMarriedChildSummary: pageBuilder.summaryPage({
        title: 'Information needed to report the marriage of a child under 18',
        path: '686-report-marriage-of-child/summary',
        uiSchema: removeMarriedChildSummaryPage.uiSchema,
        schema: removeMarriedChildSummaryPage.schema,
        depends: formData =>
          noV3Picklist(formData) &&
          isChapterFieldRequired(
            formData,
            TASK_KEYS.reportMarriageOfChildUnder18,
          ) &&
          isRemovingDependents(formData),
      }),
      removeMarriedChildPartOne: pageBuilder.itemPage({
        title: 'Information needed to report the marriage of a child under 18',
        path: '686-report-marriage-of-child/:index/child-information',
        uiSchema: marriedChildInformationPage.uiSchema,
        schema: marriedChildInformationPage.schema,
        depends: formData =>
          noV3Picklist(formData) &&
          isChapterFieldRequired(
            formData,
            TASK_KEYS.reportMarriageOfChildUnder18,
          ) &&
          isRemovingDependents(formData),
      }),
      removeMarriedChildPartTwo: pageBuilder.itemPage({
        title: 'Information needed to report the marriage of a child under 18',
        path: '686-report-marriage-of-child/:index/date-child-married',
        uiSchema: dateChildMarriedPage.uiSchema,
        schema: dateChildMarriedPage.schema,
        depends: formData =>
          noV3Picklist(formData) &&
          isChapterFieldRequired(
            formData,
            TASK_KEYS.reportMarriageOfChildUnder18,
          ) &&
          isRemovingDependents(formData),
      }),
      removeMarriedChildPartThree: pageBuilder.itemPage({
        title: 'Information needed to report the marriage of a child under 18',
        path: '686-report-marriage-of-child/:index/child-income',
        uiSchema: marriedChildIncomeQuestionPage.uiSchema,
        schema: marriedChildIncomeQuestionPage.schema,
        depends: formData =>
          noV3Picklist(formData) &&
          isChapterFieldRequired(
            formData,
            TASK_KEYS.reportMarriageOfChildUnder18,
          ) &&
          isRemovingDependents(formData) &&
          !formData?.vaDependentsNetWorthAndPension,
      }),
    })),
  },
};

export const reportChildStoppedAttendingSchool = {
  title: 'Remove one or more children between ages 18 and 23 who left school',
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
            noV3Picklist(formData) &&
            isChapterFieldRequired(
              formData,
              TASK_KEYS.reportChild18OrOlderIsNotAttendingSchool,
            ) &&
            isRemovingDependents(formData),
        }),
        childNoLongerInSchoolSummary: pageBuilder.summaryPage({
          title:
            'Information needed to report a child 18-23 years old stopped attending school',
          path: 'report-child-stopped-attending-school/summary',
          uiSchema: removeChildStoppedAttendingSchoolSummaryPage.uiSchema,
          schema: removeChildStoppedAttendingSchoolSummaryPage.schema,
          depends: formData =>
            noV3Picklist(formData) &&
            isChapterFieldRequired(
              formData,
              TASK_KEYS.reportChild18OrOlderIsNotAttendingSchool,
            ) &&
            isRemovingDependents(formData),
        }),
        childNoLongerInSchoolPartOne: pageBuilder.itemPage({
          title:
            'Information needed to report a child 18-23 years old stopped attending school',
          path:
            'report-child-stopped-attending-school/:index/child-information',
          uiSchema: childInformationPage.uiSchema,
          schema: childInformationPage.schema,
          depends: formData =>
            noV3Picklist(formData) &&
            isChapterFieldRequired(
              formData,
              TASK_KEYS.reportChild18OrOlderIsNotAttendingSchool,
            ) &&
            isRemovingDependents(formData),
        }),
        childNoLongerInSchoolPartTwo: pageBuilder.itemPage({
          title:
            'Information needed to report a child 18-23 years old stopped attending school',
          path:
            'report-child-stopped-attending-school/:index/date-child-left-school',
          uiSchema: dateChildLeftSchoolPage.uiSchema,
          schema: dateChildLeftSchoolPage.schema,
          depends: formData =>
            noV3Picklist(formData) &&
            isChapterFieldRequired(
              formData,
              TASK_KEYS.reportChild18OrOlderIsNotAttendingSchool,
            ) &&
            isRemovingDependents(formData),
        }),
        childNoLongerInSchoolPartThree: pageBuilder.itemPage({
          title:
            'Information needed to report a child 18-23 years old stopped attending school',
          path: 'report-child-stopped-attending-school/:index/child-income',
          uiSchema: childIncomeQuestionPage.uiSchema,
          schema: childIncomeQuestionPage.schema,
          depends: formData =>
            noV3Picklist(formData) &&
            isChapterFieldRequired(
              formData,
              TASK_KEYS.reportChild18OrOlderIsNotAttendingSchool,
            ) &&
            isRemovingDependents(formData) &&
            !formData?.vaDependentsNetWorthAndPension,
        }),
      }),
    ),
  },
};
