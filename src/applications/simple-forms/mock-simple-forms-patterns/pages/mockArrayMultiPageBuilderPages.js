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
  isItemIncomplete: (item, fullData) => {
    // Simple flow
    if (fullData?.arrayBuilderItemPages === 'simple') {
      return !item?.name;
    }
    // Complex flow
    return (
      !item?.name ||
      !item?.address?.country ||
      !item?.address?.city ||
      !item?.address?.street ||
      !item?.address?.postalCode
    );
  },
  maxItems: 5,
  text: {
    getItemName: item => item.name,
    cardDescription: item =>
      item?.dateRange?.from && item?.dateRange?.to
        ? `${item.dateRange.from} - ${item.dateRange.to}`
        : '',
  },
  // Show possible duplicate alert on summary page
  duplicateChecks: {
    // allowDuplicates: false, // Not enabled in MVP
    comparisonType: 'all',
    comparisons: ['name', 'address.street'],
    duplicateSummaryCardWarningOrErrorAlert: () => (
      <p className="vads-u-margin-top--0">
        You have entered multiple employers with the same name and address.
        Before continuing, review these entries and delete any duplicates.
      </p>
    ),
    itemPathModalChecks: {
      'name-and-address': {
        comparisons: ['name', 'address.street'],
      },
      dates: {
        // overrides
        comparisonType: 'external',
        comparisons: ['name', 'dateRange.from', 'dateRange.to'],
        externalComparisonData: () => [['test 3', '1997-01-03', '1999-01-03']],
      },
    },
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
export const employersIntroPageA = {
  uiSchema: {
    ...titleUI(
      'Your employers - Variation A',
      'Variation A: In the next few questions, we’ll ask you about your employers. You must add at least one employer. You may add up to 5 employers.',
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

/** @returns {PageSchema} */
export const employersIntroPageB = {
  uiSchema: {
    ...titleUI(
      'Your employers - Variation B',
      'Variation B: Tell us about your work history. We need information about your employers. At least one employer is required, up to 5 total.',
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

/** @returns {PageSchema} */
export const employersSummaryPageA = {
  uiSchema: {
    'view:hasEmployment': arrayBuilderYesNoUI(
      employersOptions,
      {
        title:
          'Variation A: Do you have any employment, including self-employment for the last 5 years to report?',
        hint:
          'Include self-employment and military duty (including inactive duty for training).',
        labels: {
          Y: 'Yes, I have employment to report',
          N: 'No, I don’t have employment to report',
        },
      },
      {
        title: 'Variation A: Do you have another employer to report?',
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
export const employersSummaryPageB = {
  uiSchema: {
    'view:hasEmployment': arrayBuilderYesNoUI(
      employersOptions,
      {
        title:
          'Variation B: Have you been employed or self-employed in the past 5 years?',
        hint:
          'This includes self-employment and all military service (active and inactive duty).',
        labels: {
          Y: 'Yes, I have work history',
          N: 'No, I have no work history',
        },
      },
      {
        title: 'Variation B: Would you like to add another employer?',
        labels: {
          Y: 'Yes, add another employer',
          N: 'No, I’m done adding employers',
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

/** @returns {PageSchema} - Simple single item page */
export const employersSimpleItemPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Employer name',
      nounSingular: employersOptions.nounSingular,
    }),
    name: {
      'ui:title': 'Name of employer',
      'ui:webComponentField': VaTextInputField,
    },
  },
  schema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
    },
    required: ['name'],
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
    // Intro Page Variation A - needed for "required" flow
    [`multiPageBuilderIntroA${pageKeySuffix}`]: pageBuilder.introPage({
      title: 'Your Employers - Variation A',
      path: `array-multiple-page-builder${pathSuffix}`,
      uiSchema: employersIntroPageA.uiSchema,
      schema: employersIntroPageA.schema,
      depends: formData =>
        formData?.chapterSelect?.arrayMultiPageBuilder &&
        formData?.arrayBuilderPatternInteractionType ===
          arrayBuilderPatternInteractionType &&
        formData?.arrayBuilderPatternFlowType === 'required' &&
        formData?.arrayBuilderSummaryIntroVariation === 'A',
    }),
    // Intro Page Variation B - needed for "required" flow
    [`multiPageBuilderIntroB${pageKeySuffix}`]: pageBuilder.introPage({
      title: 'Your Employers - Variation B',
      path: `array-multiple-page-builder${pathSuffix}-b`,
      uiSchema: employersIntroPageB.uiSchema,
      schema: employersIntroPageB.schema,
      depends: formData =>
        formData?.chapterSelect?.arrayMultiPageBuilder &&
        formData?.arrayBuilderPatternInteractionType ===
          arrayBuilderPatternInteractionType &&
        formData?.arrayBuilderPatternFlowType === 'required' &&
        formData?.arrayBuilderSummaryIntroVariation === 'B',
    }),
    // Summary Page Variation A
    [`multiPageBuilderSummaryA${pageKeySuffix}`]: pageBuilder.summaryPage({
      title: 'Array with multiple page builder summary - Variation A',
      path: `array-multiple-page-builder-summary${pathSuffix}`,
      uiSchema: summaryPageUsesSchemas ? employersSummaryPageA.uiSchema : {},
      schema: summaryPageUsesSchemas ? employersSummaryPageA.schema : {},
      depends: formData =>
        formData?.chapterSelect?.arrayMultiPageBuilder &&
        formData?.arrayBuilderPatternInteractionType ===
          arrayBuilderPatternInteractionType &&
        formData?.arrayBuilderSummaryIntroVariation === 'A',
    }),
    // Summary Page Variation B
    [`multiPageBuilderSummaryB${pageKeySuffix}`]: pageBuilder.summaryPage({
      title: 'Array with multiple page builder summary - Variation B',
      path: `array-multiple-page-builder-summary${pathSuffix}-b`,
      uiSchema: summaryPageUsesSchemas ? employersSummaryPageB.uiSchema : {},
      schema: summaryPageUsesSchemas ? employersSummaryPageB.schema : {},
      depends: formData =>
        formData?.chapterSelect?.arrayMultiPageBuilder &&
        formData?.arrayBuilderPatternInteractionType ===
          arrayBuilderPatternInteractionType &&
        formData?.arrayBuilderSummaryIntroVariation === 'B',
    }),
    // Simple item page (single page)
    [`multiPageBuilderSimpleItem${pageKeySuffix}`]: pageBuilder.itemPage({
      title: 'Employer name',
      path: `array-multiple-page-builder${pathSuffix}/:index/name`,
      uiSchema: employersSimpleItemPage.uiSchema,
      schema: employersSimpleItemPage.schema,
      depends: formData =>
        formData?.chapterSelect?.arrayMultiPageBuilder &&
        formData?.arrayBuilderPatternInteractionType ===
          arrayBuilderPatternInteractionType &&
        formData?.arrayBuilderItemPages === 'simple',
    }),
    // Complex item pages (multiple pages)
    [`multiPageBuilderStepOne${pageKeySuffix}`]: pageBuilder.itemPage({
      title: 'Employer name and address',
      path: `array-multiple-page-builder${pathSuffix}/:index/name-and-address`,
      uiSchema: employersPageNameAndAddressPage.uiSchema,
      schema: employersPageNameAndAddressPage.schema,
      depends: formData =>
        formData?.chapterSelect?.arrayMultiPageBuilder &&
        formData?.arrayBuilderPatternInteractionType ===
          arrayBuilderPatternInteractionType &&
        formData?.arrayBuilderItemPages === 'complex',
    }),
    [`multiPageBuilderStepTwo${pageKeySuffix}`]: pageBuilder.itemPage({
      title: 'Employer dates',
      path: `array-multiple-page-builder${pathSuffix}/:index/dates`,
      uiSchema: employersDatesPage.uiSchema,
      schema: employersDatesPage.schema,
      depends: formData =>
        formData?.chapterSelect?.arrayMultiPageBuilder &&
        formData?.arrayBuilderPatternInteractionType ===
          arrayBuilderPatternInteractionType &&
        formData?.arrayBuilderItemPages === 'complex',
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
          formData?.arrayBuilderItemPages === 'complex' &&
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
