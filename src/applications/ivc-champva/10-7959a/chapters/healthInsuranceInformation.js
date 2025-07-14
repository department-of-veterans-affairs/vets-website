import get from 'platform/utilities/data/get';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import React from 'react';
import {
  titleUI,
  titleSchema,
  yesNoUI,
  yesNoSchema,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  phoneUI,
  phoneSchema,
  textUI,
  textSchema,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { nameWording, privWrapper } from '../../shared/utilities';
import { validFieldCharsOnly } from '../../shared/validations';

const radioLabels = {
  group: 'Employer sponsored insurance (group)',
  nonGroup: 'Individual or private insurance (non-group)',
  medicare: 'Medicare Part A or B (hospital and medical insurance)',
  other: 'Insurance type not listed',
};

const hintText =
  'This includes any coverage through a family member, health insurance from an employer, and supplemental or secondary insurance.';

const yesNoContent = {
  title:
    'Does the beneficiary have any other health insurance coverage that isn’t through CHAMPVA?',
  labels: {
    Y: 'Yes',
    N: 'No',
  },
  hint: hintText,
  labelHeaderLevel: '5',
};

/** @type {ArrayBuilderOptions} */
export const insuranceOptions = {
  arrayPath: 'policies',
  nounSingular: 'policy',
  nounPlural: 'policies',
  required: true,
  isItemIncomplete: item => !item?.name && !item?.type, // include all required fields here
  maxItems: 2,
  text: {
    getItemName: item => item.name,
    cardDescription: item =>
      item?.type === 'other'
        ? `${item?.otherType}`
        : `${radioLabels[(item?.type)]}`,
    summaryTitle: item => {
      return privWrapper(
        `${nameWording(item?.formData, true, true, true) ||
          'Beneficiary’s'} health insurance review`,
      );
    },
    summaryDescription: '',
    cancelAddButtonText: 'Cancel adding this insurance',
  },
};

export const insuranceStatusSchema = {
  uiSchema: {
    ...titleUI(({ formData }) => {
      return privWrapper(
        `${nameWording(formData, true, true, true)} health insurance status`,
      );
    }),
    hasOhi: {
      ...yesNoUI({
        type: 'radio',
        updateUiSchema: formData => {
          return {
            'ui:title': `${
              formData?.certifierRole === 'applicant' ? 'Do' : 'Does'
            } ${nameWording(
              formData,
              false,
              false,
              true,
            )} have health insurance coverage that isn’t through CHAMPVA?`,
            'ui:options': {
              classNames: ['dd-privacy-hidden'],
              hint: hintText,
            },
          };
        },
      }),
    },
    'ui:options': {
      itemAriaLabel: () => 'health insurance status',
    },
  },
  schema: {
    type: 'object',
    required: ['hasOhi'],
    properties: {
      titleSchema,
      hasOhi: yesNoSchema,
    },
  },
};

const policyPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Policy information',
      nounSingular: insuranceOptions.nounSingular,
    }),
    name: textUI('Name of insurance provider'),
    policyNum: textUI('Policy number'),
    providerPhone: phoneUI('Insurance provider phone number'),
    'ui:validations': [
      (errors, page, formData) =>
        validFieldCharsOnly(errors, page, formData, 'name'),
      (errors, page, formData) =>
        validFieldCharsOnly(errors, page, formData, 'policyNum'),
    ],
  },
  schema: {
    type: 'object',
    properties: {
      name: textSchema,
      policyNum: textSchema,
      providerPhone: phoneSchema,
    },
    required: ['name'],
  },
};

const insuranceProviderPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) => `${get('name', formData)} insurance type`,
      '',
      false,
    ),
    type: {
      ...radioUI({
        type: 'radio',
        title:
          'What type of insurance does the beneficiary have through this provider?',
        labels: radioLabels,
        errorMessages: {
          required: 'Please select an option',
        },
      }),
    },
    otherType: {
      'ui:title': `Since your insurance type was not listed, please describe it here`,
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        expandUnder: 'type',
        expandUnderCondition: 'other',
        expandedContentFocus: true,
      },
      'ui:errorMessages': {
        required: `Please enter your insurance type`,
      },
    },
    'ui:options': {
      updateSchema: (formData, formSchema) => {
        if (formSchema.properties.otherType['ui:collapsed']) {
          return { ...formSchema, required: ['type'] };
        }
        return {
          ...formSchema,
          required: ['type', 'otherType'],
        };
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      titleSchema,
      type: radioSchema(Object.keys(radioLabels)),
      otherType: textSchema,
    },
  },
};

const summaryPage = {
  uiSchema: {
    'view:hasPolicies': arrayBuilderYesNoUI(
      insuranceOptions,
      yesNoContent,
      yesNoContent,
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasPolicies': arrayBuilderYesNoSchema,
    },
    required: ['view:hasPolicies'],
  },
};

// Main pages object
export const insurancePages = arrayBuilderPages(
  insuranceOptions,
  pageBuilder => ({
    insuranceIntro: pageBuilder.introPage({
      path: 'insurance-intro',
      title: '[noun plural]',
      depends: formData =>
        get('hasOhi', formData) &&
        get('claimStatus', formData) !== 'resubmission',
      uiSchema: {
        ...titleUI('Health insurance information', ({ formData }) => (
          <p>
            Next we’ll ask you to enter information about{' '}
            {privWrapper(nameWording(formData, true, false, true))} health
            insurance.
            <br />
            <br />
            You can add up to two health insurances, but do not include CHAMPVA.
          </p>
        )),
      },
      schema: {
        type: 'object',
        properties: {
          titleSchema,
        },
      },
    }),
    insuranceSummary: pageBuilder.summaryPage({
      title: 'Review your [noun plural]',
      path: 'insurance-review',
      depends: formData =>
        get('hasOhi', formData) &&
        get('claimStatus', formData) !== 'resubmission',
      ...summaryPage,
    }),
    insurancePolicy: pageBuilder.itemPage({
      title: 'Policy information',
      path: 'policy-info/:index',
      depends: formData =>
        get('hasOhi', formData) &&
        get('claimStatus', formData) !== 'resubmission',
      ...policyPage,
    }),
    insuranceType: pageBuilder.itemPage({
      title: 'Type',
      path: 'insurance-type/:index',
      depends: formData =>
        get('hasOhi', formData) &&
        get('claimStatus', formData) !== 'resubmission',
      ...insuranceProviderPage,
    }),
  }),
);
