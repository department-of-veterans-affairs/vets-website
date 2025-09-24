import React from 'react';
import {
  addressNoMilitarySchema,
  addressNoMilitaryUI,
  currentOrPastDateRangeSchema,
  currentOrPastDateRangeUI,
  titleUI,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  arrayBuilderItemSubsequentPageTitleUI,
  textUI,
  textSchema,
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';

/** @type {ArrayBuilderOptions} */
const employersOptions = {
  arrayPath: 'employers',
  nounSingular: 'employer',
  nounPlural: 'employers',
  required: formData => formData?.arrayBuilderPatternFlowType === 'required',
  isItemIncomplete: item =>
    !item?.name ||
    !item?.address?.country ||
    !item?.address?.city ||
    !item?.address?.street ||
    !item?.address?.postalCode,
  maxItems: 5,
  text: {
    getItemName: item => item.name,
    cardDescription: item =>
      `${item?.dateRange?.from} - ${item?.dateRange?.to}`,
  },
};

const sampleDescription = (
  <>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Urna.
    </p>
    <p>Luctus venenatis lectus magna fringilla urna.</p>
  </>
);

const buttonOrLinkOptions = {
  ...employersOptions,
  text: {
    ...employersOptions.text,
    summaryTitle: 'Your employers',
    summaryTitleWithoutItems: 'Your employers',
    summaryDescription: sampleDescription,
    summaryDescriptionWithoutItems: sampleDescription,
  },
};

/**
 * @param {"yesNoQuestion" | "addLink" | "addButton"} interactionType
 * @returns {ArrayBuilderOptions}
 */
const getOptions = interactionType => {
  let options = employersOptions;

  if (interactionType !== 'yesNoQuestion') {
    options = { ...buttonOrLinkOptions };

    const formattedInteractionType =
      interactionType.charAt(0).toUpperCase() + interactionType.slice(1);

    if (interactionType === 'addButton') {
      options.arrayPath = `employers${formattedInteractionType}`;
      options.useButtonInsteadOfYesNo = true;
    } else if (interactionType === 'addLink') {
      options.arrayPath = `employers${formattedInteractionType}`;
      options.useLinkInsteadOfYesNo = true;
    }
  }

  return options;
};

/** @returns {PageSchema} */
export const employersIntroPage = {
  uiSchema: {
    ...titleUI(
      'Your employers',
      'In the next few questions, we’ll ask you about your employers. You must add at least one employer. You may add up to 5 employers.',
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

/** @returns {PageSchema} */
export const employersSummaryPage = {
  uiSchema: {
    'view:hasEmployment': arrayBuilderYesNoUI(
      employersOptions,
      {
        title:
          'Do you have any employment, including self-employment for the last 5 years to report?',
        hint:
          'Include self-employment and military duty (including inactive duty for training).',
        labels: {
          Y: 'Yes, I have employment to report',
          N: 'No, I don’t have employment to report',
        },
      },
      {
        title: 'Do you have another employer to report?',
        labels: {
          Y: 'Yes, I have another employer to report',
          N: 'No, I don’t have another employer to report',
        },
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasEmployment': arrayBuilderYesNoSchema,
    },
    required: ['view:hasEmployment'],
  },
};

/** @returns {PageSchema} */
export const employersPageNameAndAddressPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Name and address of employer',
      nounSingular: employersOptions.nounSingular,
    }),
    name: {
      'ui:title': 'Name of employer',
      'ui:webComponentField': VaTextInputField,
    },
    address: addressNoMilitaryUI({ omit: ['street2', 'street3'] }),
  },
  schema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
      address: addressNoMilitarySchema({ omit: ['street2', 'street3'] }),
    },
    required: ['name'],
  },
};

/** @returns {PageSchema} */
export const employersDatesPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        formData?.name
          ? `Dates you were employed at ${formData.name}`
          : 'Dates you were employed',
    ),
    dateRange: currentOrPastDateRangeUI(
      'Start date of employment',
      'End date of employment',
      'End date must be after start date',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      dateRange: currentOrPastDateRangeSchema,
    },
  },
};

/** @returns {PageSchema} */
export const employersOptionalPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      'Optional page',
      'This page depends on the address state is from CA',
    ),
    weather: textUI('How is the weather today?'),
    raining: radioUI({
      title: 'Is it raining?',
      hideIf: (formData, index, fullData) => {
        return !/rain|wet/.test(fullData?.employers?.[index]?.weather);
      },
      labels: {
        Y: 'Yes',
        N: 'No',
      },
    }),
    umbrella: textUI({
      title: 'Do you have an umbrella?',
      expandUnder: 'raining',
      expandUnderCondition: (value, formData, index, fullData) => {
        return fullData?.employers?.[index]?.raining === 'Y';
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      weather: textSchema,
      raining: radioSchema(['Y', 'N']),
      umbrella: textSchema,
    },
  },
};

/**
 * Dynamic pages for testing variations in array builder patterns.
 * @param {"yesNoQuestion" | "addLink" | "addButton"} arrayBuilderPatternInteractionType
 * @param {string} pathSuffix - Suffix for the path of the pages
 * @param {string} pageKeySuffix - Suffix for the page keys
 * @returns {Object} - Object containing the page schemas
 */
const createDynamicArrayBuilderPages = ({
  arrayBuilderPatternInteractionType,
  pathSuffix,
  pageKeySuffix,
}) => {
  const summaryPageUsesSchemas =
    arrayBuilderPatternInteractionType === 'yesNoQuestion';

  const options = getOptions(arrayBuilderPatternInteractionType);

  return arrayBuilderPages(options, pageBuilder => ({
    // introPage needed for "required" flow
    [`multiPageBuilderIntro${pageKeySuffix}`]: pageBuilder.introPage({
      title: 'Your Employers',
      path: `array-multiple-page-builder${pathSuffix}`,
      uiSchema: employersIntroPage.uiSchema,
      schema: employersIntroPage.schema,
      depends: formData =>
        formData?.chapterSelect?.arrayMultiPageBuilder &&
        // normally you don't need this kind of check,
        // but this is so we can test the 2 different styles
        // of array builder pattern - "required" and "optional".
        // "introPage" is needed in the "required" flow,
        // but unnecessary in the "optional" flow
        formData?.arrayBuilderPatternInteractionType ===
          arrayBuilderPatternInteractionType &&
        formData?.arrayBuilderPatternFlowType === 'required',
    }),
    [`multiPageBuilderSummary${pageKeySuffix}`]: pageBuilder.summaryPage({
      title: 'Array with multiple page builder summary',
      path: `array-multiple-page-builder-summary${pathSuffix}`,
      uiSchema: summaryPageUsesSchemas ? employersSummaryPage.uiSchema : {},
      schema: summaryPageUsesSchemas ? employersSummaryPage.schema : {},
      depends: formData =>
        formData?.chapterSelect?.arrayMultiPageBuilder &&
        formData?.arrayBuilderPatternInteractionType ===
          arrayBuilderPatternInteractionType,
    }),
    [`multiPageBuilderStepOne${pageKeySuffix}`]: pageBuilder.itemPage({
      title: 'Employer name and address',
      path: `array-multiple-page-builder${pathSuffix}/:index/name-and-address`,
      uiSchema: employersPageNameAndAddressPage.uiSchema,
      schema: employersPageNameAndAddressPage.schema,
      depends: formData =>
        formData?.chapterSelect?.arrayMultiPageBuilder &&
        formData?.arrayBuilderPatternInteractionType ===
          arrayBuilderPatternInteractionType,
    }),
    [`multiPageBuilderStepTwo${pageKeySuffix}`]: pageBuilder.itemPage({
      title: 'Employer dates',
      path: `array-multiple-page-builder${pathSuffix}/:index/dates`,
      uiSchema: employersDatesPage.uiSchema,
      schema: employersDatesPage.schema,
      depends: formData =>
        formData?.chapterSelect?.arrayMultiPageBuilder &&
        formData?.arrayBuilderPatternInteractionType ===
          arrayBuilderPatternInteractionType,
    }),
    [`multiPageBuilderOptional${pageKeySuffix}`]: pageBuilder.itemPage({
      title: 'Optional page',
      path: `array-multiple-page-builder${pathSuffix}/:index/optional`,
      uiSchema: employersOptionalPage.uiSchema,
      schema: employersOptionalPage.schema,
      depends: (formData, index) => {
        return (
          formData?.chapterSelect?.arrayMultiPageBuilder &&
          formData?.arrayBuilderPatternInteractionType ===
            arrayBuilderPatternInteractionType &&
          formData?.[options.arrayPath]?.[index]?.address?.state === 'CA'
        );
      },
    }),
  }));
};

export const arrayBuilderPagesYesNoQuestion = createDynamicArrayBuilderPages({
  arrayBuilderPatternInteractionType: 'yesNoQuestion',
  pathSuffix: '',
  pageKeySuffix: '',
});

export const arrayBuilderPagesAddButton = createDynamicArrayBuilderPages({
  arrayBuilderPatternInteractionType: 'addButton',
  pathSuffix: '-add-button',
  pageKeySuffix: 'AddButton',
});

export const arrayBuilderPagesAddLink = createDynamicArrayBuilderPages({
  arrayBuilderPatternInteractionType: 'addLink',
  pathSuffix: '-add-link',
  pageKeySuffix: 'AddLink',
});
