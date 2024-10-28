import React from 'react';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currentOrPastMonthYearDateSchema,
  currentOrPastMonthYearDateUI,
  radioSchema,
  radioUI,
  selectSchema,
  selectUI,
  textareaUI,
  textUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import AutoComplete from '../components/Autocomplete';
import {
  addDisabilitiesInstructions,
  duplicateAlert,
  increaseAndNewAlertRevised,
  newOnlyAlertRevised,
} from '../content/addDisabilities';
import disabilityLabelsRevised from '../content/disabilityLabelsRevised';
import {
  claimingNew,
  hasClaimedConditions,
  newAndIncrease,
  newConditionsOnly,
} from '../utils';
import { missingConditionMessage } from '../validations';

const causeOptions = {
  NEW:
    'My condition was caused by an injury or exposure during my military service.',
  SECONDARY:
    'My condition was caused by another service-connected disability I already have. (For example, I have a limp that caused lower-back problems.)',
  WORSENED:
    'My condition existed before I served in the military, but it got worse because of my military service.',
  VA:
    'My condition was caused by an injury or event that happened when I was receiving VA care.',
};

const causeDescriptions = {
  NEW: 'Caused by an injury or exposure during my service.',
  SECONDARY: 'Caused by ',
  WORSENED:
    'Existed before I served in the military, but got worse because of my military service.',
  VA:
    'Caused by an injury or event that happened when I was receiving VA care.',
};

/** @type {ArrayBuilderOptions} */
const arrayBuilderOptions = {
  arrayPath: 'newConditions',
  nounSingular: 'condition',
  nounPlural: 'conditions',
  required: true,
  isItemIncomplete: item =>
    !item?.condition ||
    !item?.cause ||
    (item?.cause === 'NEW' && !item?.primaryDescription) ||
    (item?.cause === 'SECONDARY' &&
      (!item?.causedByCondition || !item?.causedByConditionDescription)) ||
    (item?.cause === 'WORSENED' &&
      (!item?.worsenedDescription || !item?.worsenedEffects)) ||
    (item?.cause === 'VA' &&
      (!item?.vaMistreatmentDescription ||
        !item?.vaMistreatmentLocation ||
        !item?.vaMistreatmentDate)),
  maxItems: 100,
  text: {
    getItemName: item => item?.condition,
    cardDescription: item => {
      if (item?.cause === 'SECONDARY') {
        return causeDescriptions[(item?.cause)] + item?.causedByCondition;
      }
      return causeDescriptions[(item?.cause)];
    },
  },
};

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    ...titleUI(
      'New conditions',
      'On the next few screens, we’ll ask you about the new conditions you’re claiming. You must add at least one condition.',
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

const isDuplicate = formData => {
  const { newConditions } = formData;

  if (!newConditions || newConditions.length < 2) {
    return false;
  }

  const conditionNames = newConditions.map(condition =>
    condition?.condition?.toLowerCase().trim(),
  );

  return new Set(conditionNames).size !== conditionNames.length;
};

/** @returns {PageSchema} */
const addConditionPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Name of new condition you want to claim',
      nounSingular: arrayBuilderOptions.nounSingular,
      description: addDisabilitiesInstructions,
    }),
    condition: {
      'ui:title': 'Enter your condition',
      'ui:field': data => (
        <AutoComplete
          availableResults={Object.values(disabilityLabelsRevised)}
          debounceDelay={200}
          id={data.idSchema.$id}
          formData={data.formData}
          onChange={data.onChange}
        />
      ),
      'ui:errorMessages': {
        required: missingConditionMessage,
      },
    },
    'view:newOnlyAlert': {
      'ui:description': newOnlyAlertRevised,
      'ui:options': {
        hideIf: formData =>
          !(newConditionsOnly(formData) && !claimingNew(formData)),
      },
    },
    'view:increaseAndNewAlert': {
      'ui:description': increaseAndNewAlertRevised,
      'ui:options': {
        hideIf: formData =>
          !(newAndIncrease(formData) && !hasClaimedConditions(formData)),
      },
    },
    'view:duplicateAlert': {
      'ui:description': duplicateAlert,
      'ui:options': {
        hideIf: formData => !isDuplicate(formData),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      condition: {
        type: 'string',
      },
      'view:newOnlyAlert': {
        type: 'object',
        properties: {},
      },
      'view:increaseAndNewAlert': {
        type: 'object',
        properties: {},
      },
      'view:duplicateAlert': {
        type: 'object',
        properties: {},
      },
    },
    required: ['condition'],
  },
};

/** @returns {PageSchema} */
const causePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) => `Cause of ${formData.condition || 'condition'}`,
    ),
    cause: radioUI({
      title: 'What caused your condition?',
      labels: causeOptions,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      cause: radioSchema(Object.keys(causeOptions)),
    },
    required: ['cause'],
  },
};

/** @returns {PageSchema} */
const causeFollowUpPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(({ formData }) => {
      const condition = formData.condition ? formData.condition : 'condition';

      if (formData?.cause === 'NEW') {
        return `Details of injury or exposure that caused ${condition}`;
      }
      if (formData?.cause === 'SECONDARY') {
        return `Details of the other condition that caused ${condition}`;
      }
      if (formData?.cause === 'WORSENED') {
        return `Details of the injury or exposure that worsened ${condition}`;
      }
      if (formData?.cause === 'VA') {
        return 'Details of the injury or event in VA care';
      }
      return '';
    }),
    primaryDescription: textareaUI({
      title:
        'Please briefly describe the injury or exposure that caused your condition. For example, I operated loud machinery while in the service, and this caused me to lose my hearing.',
      hideIf: (formData, index) =>
        formData?.newConditions?.[index]?.cause !== 'NEW',
      required: (formData, index) =>
        formData?.newConditions?.[index]?.cause === 'NEW',
      charcount: true,
    }),
    causedByCondition: selectUI({
      title:
        'Please choose the disability that caused the new disability you’re claiming here.',
      hideIf: (formData, index) =>
        formData?.newConditions?.[index]?.cause !== 'SECONDARY',
      required: (formData, index) =>
        formData?.newConditions?.[index]?.cause === 'SECONDARY',
    }),
    causedByConditionDescription: textareaUI({
      title:
        'Please briefly describe how the disability you selected caused your new disability.',
      hideIf: (formData, index) =>
        formData?.newConditions?.[index]?.cause !== 'SECONDARY',
      required: (formData, index) =>
        formData?.newConditions?.[index]?.cause === 'SECONDARY',
      charcount: true,
    }),
    worsenedDescription: textUI({
      title:
        'Please briefly describe the injury or exposure during your military service that caused your existing disability to get worse.',
      hideIf: (formData, index) =>
        formData?.newConditions?.[index]?.cause !== 'WORSENED',
      required: (formData, index) =>
        formData?.newConditions?.[index]?.cause === 'WORSENED',
      charcount: true,
    }),
    worsenedEffects: textareaUI({
      title:
        'Please tell us how the disability affected you before your service, and how it affects you now after your service.',
      hideIf: (formData, index) =>
        formData?.newConditions?.[index]?.cause !== 'WORSENED',
      required: (formData, index) =>
        formData?.newConditions?.[index]?.cause === 'WORSENED',
      charcount: true,
    }),
    vaMistreatmentDescription: textareaUI({
      title:
        'Please briefly describe the injury or event while you were under VA care that caused your disability.',
      hideIf: (formData, index) =>
        formData?.newConditions?.[index]?.cause !== 'VA',
      required: (formData, index) =>
        formData?.newConditions?.[index]?.cause === 'VA',
      charcount: true,
    }),
    vaMistreatmentLocation: textUI({
      title: 'Please tell us where this happened.',
      hideIf: (formData, index) =>
        formData?.newConditions?.[index]?.cause !== 'VA',
      required: (formData, index) =>
        formData?.newConditions?.[index]?.cause === 'VA',
      charcount: true,
    }),
    vaMistreatmentDate: currentOrPastMonthYearDateUI({
      title:
        'Please tell us when this happened. If you’re having trouble remembering, do your best to estimate.',
      hideIf: (formData, index) =>
        formData?.newConditions?.[index]?.cause !== 'VA',
      required: (formData, index) =>
        formData?.newConditions?.[index]?.cause === 'VA',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      primaryDescription: {
        type: 'string',
        maxLength: 400,
      },
      causedByCondition: selectSchema(Object.values(disabilityLabelsRevised)),
      causedByConditionDescription: {
        type: 'string',
        maxLength: 400,
      },
      worsenedDescription: {
        type: 'string',
        maxLength: 50,
      },
      worsenedEffects: {
        type: 'string',
        maxLength: 350,
      },
      vaMistreatmentDescription: {
        type: 'string',
        maxLength: 350,
      },
      vaMistreatmentLocation: {
        type: 'string',
        maxLength: 25,
      },
      vaMistreatmentDate: currentOrPastMonthYearDateSchema,
    },
  },
};

/**
 * This page is skipped on the first loop for required flow
 * Cards are populated on this page above the uiSchema if items are present
 *
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    'view:hasConditions': arrayBuilderYesNoUI(
      arrayBuilderOptions,
      {},
      {
        hint: ' ',
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasConditions': arrayBuilderYesNoSchema,
    },
    required: ['view:hasConditions'],
  },
};

const addConditionsPages = arrayBuilderPages(
  arrayBuilderOptions,
  pageBuilder => ({
    addConditionsIntro: pageBuilder.introPage({
      title: 'New conditions intro',
      path: 'new-conditions-intro',
      uiSchema: introPage.uiSchema,
      schema: introPage.schema,
    }),
    addConditionsSummary: pageBuilder.summaryPage({
      title: 'Review your new conditions',
      path: 'new-conditions-summary',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    addConditionsAddCondition: pageBuilder.itemPage({
      title: 'Name of new condition',
      path: 'new-conditions/:index/add',
      uiSchema: addConditionPage.uiSchema,
      schema: addConditionPage.schema,
    }),
    addConditionsCause: pageBuilder.itemPage({
      title: 'Cause of new condition',
      path: 'new-conditions/:index/cause',
      uiSchema: causePage.uiSchema,
      schema: causePage.schema,
    }),
    addConditionsCauseFollowUp: pageBuilder.itemPage({
      title: 'Cause of new condition follow up',
      path: 'new-conditions/:index/cause-follow-up',
      uiSchema: causeFollowUpPage.uiSchema,
      schema: causeFollowUpPage.schema,
    }),
  }),
);

export default addConditionsPages;
