import React from 'react';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  radioSchema,
  radioUI,
  selectSchema,
  selectUI,
  textareaUI,
  textUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import Autocomplete from '../components/Autocomplete';
import {
  AddConditionInstructions,
  ServiceConnectedDisabilityDescription,
} from '../content/newConditions';
import disabilityLabelsRevised from '../content/disabilityLabelsRevised';
import { missingConditionMessage, validateConditionName } from '../validations';

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

const createCauseFollowUpTitles = formData => {
  const { condition, cause } = formData;
  const conditionTitle = condition || 'condition';

  const causeTitle = {
    NEW: `Details of injury or exposure that caused ${conditionTitle}`,
    SECONDARY: `Details of the other condition that caused ${conditionTitle}`,
    WORSENED: `Details of the injury or exposure that worsened ${conditionTitle}`,
    VA: 'Details of the injury or event in VA care',
  };

  return causeTitle[cause];
};

const createCauseFollowUpConditional = (formData, index, causeType) => {
  const cause = formData?.newConditions
    ? formData.newConditions[index]?.cause
    : formData.cause;
  return cause !== causeType;
};

const createCauseDescriptions = condition => {
  return {
    NEW: 'Caused by an injury or exposure during my service.',
    SECONDARY: `Caused by ${condition}.`,
    WORSENED:
      'Existed before I served in the military, but got worse because of my military service.',
    VA:
      'Caused by an injury or event that happened when I was receiving VA care.',
  };
};

const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const causeFollowUpChecks = {
  NEW: item => !item?.primaryDescription,
  SECONDARY: item =>
    !item?.causedByCondition || !item?.causedByConditionDescription,
  WORSENED: item => !item?.worsenedDescription || !item?.worsenedEffects,
  VA: item => !item?.vaMistreatmentDescription || !item?.vaMistreatmentLocation,
};

/** @type {ArrayBuilderOptions} */
const arrayBuilderOptions = {
  arrayPath: 'newConditions',
  nounSingular: 'condition',
  nounPlural: 'conditions',
  required: true,
  isItemIncomplete: item =>
    !item?.condition ||
    !item?.date ||
    !item?.cause ||
    (causeFollowUpChecks[item.cause] && causeFollowUpChecks[item.cause](item)),
  maxItems: 100,
  text: {
    getItemName: item => capitalizeFirstLetter(item?.condition),
    cardDescription: item =>
      createCauseDescriptions(item?.causedByCondition)[(item?.cause)],
  },
};

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    ...titleUI(
      'New conditions',
      'In the next few screens, we’ll ask you about the new condition or conditions you’re filing for compensation.',
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

/** @returns {PageSchema} */
const addConditionPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Tell us the new condition you want to claim',
      nounSingular: arrayBuilderOptions.nounSingular,
      description: AddConditionInstructions,
    }),
    condition: {
      'ui:title': 'Enter your condition',
      'ui:field': data => (
        <Autocomplete
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
      'ui:validations': [validateConditionName],
      'ui:options': {
        useAllFormData: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      condition: {
        type: 'string',
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
const datePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) => `Date of ${formData.condition || 'condition'}`,
    ),
    date: textUI({
      title:
        'What is the approximate date this condition began? If you’re having trouble remembering the exact date you can provide a year.',
      hint: 'For example: January 2000 or simply 2000',
      charcount: true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      date: {
        type: 'string',
        maxLength: 25,
      },
    },
    required: ['date'],
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
    'view:serviceConnectedDisabilityDescription': {
      'ui:description': ServiceConnectedDisabilityDescription,
    },
  },
  schema: {
    type: 'object',
    properties: {
      cause: radioSchema(Object.keys(causeOptions)),
      'view:serviceConnectedDisabilityDescription': {
        type: 'object',
        properties: {},
      },
    },
    required: ['cause'],
  },
};

/** @returns {PageSchema} */
const causeFollowUpPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(({ formData }) =>
      createCauseFollowUpTitles(formData),
    ),
    primaryDescription: textareaUI({
      title:
        'Briefly describe the injury or exposure that caused your condition. For example, I operated loud machinery while in the service, and this caused me to lose my hearing.',
      hideIf: (formData, index) =>
        createCauseFollowUpConditional(formData, index, 'NEW'),
      required: (formData, index) =>
        !createCauseFollowUpConditional(formData, index, 'NEW'),
      charcount: true,
    }),
    causedByCondition: selectUI({
      title:
        'Choose the disability that caused the new disability you’re claiming here.',
      hideIf: (formData, index) =>
        createCauseFollowUpConditional(formData, index, 'SECONDARY'),
      required: (formData, index) =>
        !createCauseFollowUpConditional(formData, index, 'SECONDARY'),
    }),
    causedByConditionDescription: textareaUI({
      title:
        'Briefly describe how the disability you selected caused your new disability.',
      hideIf: (formData, index) =>
        createCauseFollowUpConditional(formData, index, 'SECONDARY'),
      required: (formData, index) =>
        !createCauseFollowUpConditional(formData, index, 'SECONDARY'),
      charcount: true,
    }),
    worsenedDescription: textUI({
      title:
        'Briefly describe the injury or exposure during your military service that caused your existing disability to get worse.',
      hideIf: (formData, index) =>
        createCauseFollowUpConditional(formData, index, 'WORSENED'),
      required: (formData, index) =>
        !createCauseFollowUpConditional(formData, index, 'WORSENED'),
      charcount: true,
    }),
    worsenedEffects: textareaUI({
      title:
        'Tell us how the disability affected you before your service, and how it affects you now after your service.',
      hideIf: (formData, index) =>
        createCauseFollowUpConditional(formData, index, 'WORSENED'),
      required: (formData, index) =>
        !createCauseFollowUpConditional(formData, index, 'WORSENED'),
      charcount: true,
    }),
    vaMistreatmentDescription: textareaUI({
      title:
        'Briefly describe the injury or event while you were under VA care that caused your disability.',
      hideIf: (formData, index) =>
        createCauseFollowUpConditional(formData, index, 'VA'),
      required: (formData, index) =>
        !createCauseFollowUpConditional(formData, index, 'VA'),
      charcount: true,
    }),
    vaMistreatmentLocation: textUI({
      title: 'Tell us where this happened.',
      hideIf: (formData, index) =>
        createCauseFollowUpConditional(formData, index, 'VA'),
      required: (formData, index) =>
        !createCauseFollowUpConditional(formData, index, 'VA'),
      charcount: true,
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
        hint: ' ', // Because there is maxItems: 100 if this empty string is not present the hint will count down from 100 which is a confusing user experience
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

const newConditionsPages = arrayBuilderPages(
  arrayBuilderOptions,
  pageBuilder => ({
    newConditionsIntro: pageBuilder.introPage({
      title: 'New conditions intro',
      path: 'new-conditions-intro',
      depends: formData => formData['view:showAddDisabilitiesEnhancement'],
      uiSchema: introPage.uiSchema,
      schema: introPage.schema,
    }),
    newConditionsSummary: pageBuilder.summaryPage({
      title: 'Review your new conditions',
      path: 'new-conditions-summary',
      depends: formData => formData['view:showAddDisabilitiesEnhancement'],
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    newConditionsAddCondition: pageBuilder.itemPage({
      title: 'Name of new condition',
      path: 'new-conditions/:index/add',
      depends: formData => formData['view:showAddDisabilitiesEnhancement'],
      uiSchema: addConditionPage.uiSchema,
      schema: addConditionPage.schema,
    }),
    newConditionsDate: pageBuilder.itemPage({
      title: 'Date of new condition',
      path: 'new-conditions/:index/date',
      depends: formData => formData['view:showAddDisabilitiesEnhancement'],
      uiSchema: datePage.uiSchema,
      schema: datePage.schema,
    }),
    newConditionsCause: pageBuilder.itemPage({
      title: 'Cause of new condition',
      path: 'new-conditions/:index/cause',
      depends: formData => formData['view:showAddDisabilitiesEnhancement'],
      uiSchema: causePage.uiSchema,
      schema: causePage.schema,
    }),
    newConditionsCauseFollowUp: pageBuilder.itemPage({
      title: 'Cause of new condition follow up',
      path: 'new-conditions/:index/cause-follow-up',
      depends: formData => formData['view:showAddDisabilitiesEnhancement'],
      uiSchema: causeFollowUpPage.uiSchema,
      schema: causeFollowUpPage.schema,
    }),
  }),
);

export default newConditionsPages;
