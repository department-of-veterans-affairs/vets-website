import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';

import CurrentSpouse from '../../components/CurrentSpouse';

import {
  currentMarriageInformation,
  currentMarriageInformationPartTwo,
  currentMarriageInformationPartThree,
  currentMarriageInformationPartFour,
  currentMarriageInformationPartFive,
  doesLiveWithSpouse,
  spouseInformation,
  spouseInformationPartTwo,
  spouseInformationPartThree,
} from './report-add-a-spouse';
import {
  spouseMarriageHistoryOptions,
  spouseMarriageHistorySummaryPage,
  formerMarriagePersonalInfoPage,
  formerMarriageEndReasonPage,
  formerMarriageStartDatePage,
  formerMarriageEndDatePage,
  formerMarriageStartLocationPage,
  formerMarriageEndLocationPage,
} from './report-add-a-spouse/spouseMarriageHistoryArrayPages';
import {
  veteranMarriageHistoryOptions,
  veteranMarriageHistorySummaryPage,
  vetFormerMarriagePersonalInfoPage,
  vetFormerMarriageEndReasonPage,
  vetFormerMarriageStartDatePage,
  vetFormerMarriageEndDatePage,
  vetFormerMarriageStartLocationPage,
  vetFormerMarriageEndLocationPage,
} from './report-add-a-spouse/veteranMarriageHistoryArrayPages';

import { TASK_KEYS } from '../constants';
import { isChapterFieldRequired } from '../helpers';
import { showPensionRelatedQuestions, isAddingDependents } from '../utilities';

export const addSpouse = {
  title: 'Add your spouse',
  pages: {
    spouseNameInformation: {
      depends: formData =>
        isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
        isAddingDependents(formData),
      title: 'Your spouse’s personal information',
      path: 'add-spouse/current-legal-name',
      CustomPage: CurrentSpouse,
      CustomPageReview: null,
      uiSchema: spouseInformation.uiSchema,
      schema: spouseInformation.schema,
    },
    spouseNameInformationPartTwo: {
      depends: formData =>
        isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
        isAddingDependents(formData),
      title: 'Spouse’s identification information',
      path: 'add-spouse/personal-information',
      uiSchema: spouseInformationPartTwo.uiSchema,
      schema: spouseInformationPartTwo.schema,
    },
    spouseNameInformationPartThree: {
      depends: formData =>
        isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
        isAddingDependents(formData) &&
        formData?.spouseInformation?.isVeteran,
      title: 'Your spouse’s military service information',
      path: 'add-spouse/military-service-information',
      uiSchema: spouseInformationPartThree.uiSchema,
      schema: spouseInformationPartThree.schema,
    },
    doesLiveWithSpouse: {
      depends: formData =>
        isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
        isAddingDependents(formData),
      title: 'Information about your marriage',
      path: 'current-marriage-information/living-together',
      uiSchema: doesLiveWithSpouse.uiSchema,
      schema: doesLiveWithSpouse.schema,
    },
    currentMarriageInformation: {
      depends: formData =>
        isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
        isAddingDependents(formData) &&
        !formData?.doesLiveWithSpouse?.spouseDoesLiveWithVeteran,
      title: 'Spouse’s address',
      path: 'current-marriage-information/spouse-address',
      uiSchema: currentMarriageInformation.uiSchema,
      schema: currentMarriageInformation.schema,
    },
    // TODO: Rename all of these files to be more dynamic in case we need to move pages around
    currentMarriageInformationPartFive: {
      depends: formData =>
        isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
        isAddingDependents(formData) &&
        !formData?.doesLiveWithSpouse?.spouseDoesLiveWithVeteran,
      title: 'Reason you live separately from your spouse',
      path: 'current-marriage-information/reason-for-living-separately',
      uiSchema: currentMarriageInformationPartFive.uiSchema,
      schema: currentMarriageInformationPartFive.schema,
    },
    currentMarriageInformationPartTwo: {
      depends: formData =>
        isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
        isAddingDependents(formData) &&
        showPensionRelatedQuestions(formData),
      title: 'Spouse’s income',
      path: 'current-marriage-information/spouse-income',
      uiSchema: currentMarriageInformationPartTwo.uiSchema,
      schema: currentMarriageInformationPartTwo.schema,
    },
    currentMarriageInformationPartThree: {
      depends: formData =>
        isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
        isAddingDependents(formData),
      title: 'Where did you get married?',
      path: 'current-marriage-information/location-of-marriage',
      uiSchema: currentMarriageInformationPartThree.uiSchema,
      schema: currentMarriageInformationPartThree.schema,
    },
    currentMarriageInformationPartFour: {
      depends: formData =>
        isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
        isAddingDependents(formData),
      title: 'How did you get married?',
      path: 'current-marriage-information/type-of-marriage',
      uiSchema: currentMarriageInformationPartFour.uiSchema,
      schema: currentMarriageInformationPartFour.schema,
    },

    ...arrayBuilderPages(spouseMarriageHistoryOptions, pageBuilder => ({
      spouseMarriageHistorySummary: pageBuilder.summaryPage({
        title: 'Spouse’s marital history',
        path: 'current-spouse-marriage-history',
        uiSchema: spouseMarriageHistorySummaryPage.uiSchema,
        schema: spouseMarriageHistorySummaryPage.schema,
        depends: formData =>
          isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
          isAddingDependents(formData),
      }),
      spouseMarriageHistoryPartOne: pageBuilder.itemPage({
        title:
          'Information needed to add your spouse: Former spouse information',
        path: 'current-spouse-marriage-history/:index/former-spouse-information',
        uiSchema: formerMarriagePersonalInfoPage.uiSchema,
        schema: formerMarriagePersonalInfoPage.schema,
        depends: formData =>
          isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
          isAddingDependents(formData),
      }),
      spouseMarriageHistoryPartTwo: pageBuilder.itemPage({
        title:
          'Information needed to add your spouse: Reason former marriage ended',
        path: 'current-spouse-marriage-history/:index/reason-former-marriage-ended',
        uiSchema: formerMarriageEndReasonPage.uiSchema,
        schema: formerMarriageEndReasonPage.schema,
        depends: formData =>
          isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
          isAddingDependents(formData),
      }),
      spouseMarriageHistoryPartThree: pageBuilder.itemPage({
        title:
          'Information needed to add your spouse: Date former marriage started',
        path: 'current-spouse-marriage-history/:index/date-marriage-started',
        uiSchema: formerMarriageStartDatePage.uiSchema,
        schema: formerMarriageStartDatePage.schema,
        depends: formData =>
          isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
          isAddingDependents(formData),
      }),
      spouseMarriageHistoryPartFour: pageBuilder.itemPage({
        title:
          'Information needed to add your spouse: Date former marriage ended',
        path: 'current-spouse-marriage-history/:index/date-marriage-ended',
        uiSchema: formerMarriageEndDatePage.uiSchema,
        schema: formerMarriageEndDatePage.schema,
        depends: formData =>
          isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
          isAddingDependents(formData),
      }),
      spouseMarriageHistoryPartFive: pageBuilder.itemPage({
        title:
          'Information needed to add your spouse: Location where former marriage started',
        path: 'current-spouse-marriage-history/:index/location-where-marriage-started',
        uiSchema: formerMarriageStartLocationPage.uiSchema,
        schema: formerMarriageStartLocationPage.schema,
        depends: formData =>
          isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
          isAddingDependents(formData),
      }),
      spouseMarriageHistoryPartSix: pageBuilder.itemPage({
        title:
          'Information needed to add your spouse: Location where former marriage ended',
        path: 'current-spouse-marriage-history/:index/location-where-marriage-ended',
        uiSchema: formerMarriageEndLocationPage.uiSchema,
        schema: formerMarriageEndLocationPage.schema,
        depends: formData =>
          isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
          isAddingDependents(formData),
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
          isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
          isAddingDependents(formData),
      }),
      veteranMarriageHistoryPartOne: pageBuilder.itemPage({
        title:
          'Information needed to add your spouse: Former spouse information',
        path: 'veteran-marriage-history/:index/former-spouse-information',
        uiSchema: vetFormerMarriagePersonalInfoPage.uiSchema,
        schema: vetFormerMarriagePersonalInfoPage.schema,
        depends: formData =>
          isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
          isAddingDependents(formData),
      }),
      veteranMarriageHistoryPartTwo: pageBuilder.itemPage({
        title:
          'Information needed to add your spouse: Reason former marriage ended',
        path: 'veteran-marriage-history/:index/reason-former-marriage-ended',
        uiSchema: vetFormerMarriageEndReasonPage.uiSchema,
        schema: vetFormerMarriageEndReasonPage.schema,
        depends: formData =>
          isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
          isAddingDependents(formData),
      }),
      veteranMarriageHistoryPartThree: pageBuilder.itemPage({
        title:
          'Information needed to add your spouse: Date former marriage started',
        path: 'veteran-marriage-history/:index/date-marriage-started',
        uiSchema: vetFormerMarriageStartDatePage.uiSchema,
        schema: vetFormerMarriageStartDatePage.schema,
        depends: formData =>
          isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
          isAddingDependents(formData),
      }),
      veteranMarriageHistoryPartFour: pageBuilder.itemPage({
        title:
          'Information needed to add your spouse: Date former marriage ended',
        path: 'veteran-marriage-history/:index/date-marriage-ended',
        uiSchema: vetFormerMarriageEndDatePage.uiSchema,
        schema: vetFormerMarriageEndDatePage.schema,
        depends: formData =>
          isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
          isAddingDependents(formData),
      }),
      veteranMarriageHistoryPartFive: pageBuilder.itemPage({
        title:
          'Information needed to add your spouse: Location where former marriage started',
        path: 'veteran-marriage-history/:index/location-where-marriage-started',
        uiSchema: vetFormerMarriageStartLocationPage.uiSchema,
        schema: vetFormerMarriageStartLocationPage.schema,
        depends: formData =>
          isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
          isAddingDependents(formData),
      }),
      veteranMarriageHistoryPartSix: pageBuilder.itemPage({
        title:
          'Information needed to add your spouse: Location where former marriage ended',
        path: 'veteran-marriage-history/:index/location-where-marriage-ended',
        uiSchema: vetFormerMarriageEndLocationPage.uiSchema,
        schema: vetFormerMarriageEndLocationPage.schema,
        depends: formData =>
          isChapterFieldRequired(formData, TASK_KEYS.addSpouse) &&
          isAddingDependents(formData),
      }),
    })),
  },
};
