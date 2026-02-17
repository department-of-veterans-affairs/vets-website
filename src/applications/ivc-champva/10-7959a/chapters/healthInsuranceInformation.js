import get from 'platform/utilities/data/get';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import {
  titleUI,
  descriptionUI,
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
import { privWrapper } from '../../shared/utilities';
import { validFieldCharsOnly } from '../../shared/validations';
import {
  hasOhi,
  personalizeTitleByName,
  replaceStrValues,
} from '../utils/helpers';
import content from '../locales/en/content.json';

const INSURANCE_TYPE_LABELS = {
  group: content['health-insurance--type-label--group'],
  nonGroup: content['health-insurance--type-label--nongroup'],
  medicare: content['health-insurance--type-label--medicare'],
  other: content['health-insurance--type-label--other'],
};

const yesNoOptions = {
  title: content['health-insurance--yes-no-label-more'],
  hint: content['health-insurance--yes-no-hint'],
  labelHeaderLevel: '2',
  labelHeaderLevelStyle: '4',
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
        : `${INSURANCE_TYPE_LABELS[item?.type]}`,
    cancelAddTitle: () => content['health-insurance--cancel-add-title'],
    cancelAddDescription: () =>
      content['health-insurance--cancel-add-description'],
    cancelAddNo: () => content['arraybuilder--button-cancel-no'],
    cancelAddYes: () => content['arraybuilder--button-cancel-yes'],
    cancelEditTitle: props => {
      const itemName = props.getItemName(
        props.itemData,
        props.index,
        props.formData,
      );
      return itemName
        ? replaceStrValues(
            content['health-insurance--cancel-edit-item-title'],
            itemName,
          )
        : replaceStrValues(
            content['health-insurance--cancel-edit-noun-title'],
            props.nounSingular,
          );
    },
    cancelEditDescription: () =>
      content['health-insurance--cancel-edit-description'],
    cancelEditNo: () => content['arraybuilder--button-delete-no'],
    cancelEditYes: () => content['arraybuilder--button-cancel-yes'],
    deleteDescription: props => {
      const itemName = props.getItemName(
        props.itemData,
        props.index,
        props.formData,
      );
      return itemName
        ? replaceStrValues(
            content['health-insurance--delete-item-description'],
            itemName,
          )
        : replaceStrValues(
            content['health-insurance--delete-noun-description'],
            props.nounSingular,
          );
    },
    deleteNo: () => content['arraybuilder--button-delete-no'],
    deleteYes: () => content['arraybuilder--button-delete-yes'],
    summaryTitle: props =>
      privWrapper(
        personalizeTitleByName(
          props.formData,
          content['health-insurance--summary-title'],
        ),
      ),
    summaryDescription: null,
    cancelAddButtonText: content['health-insurance--button--cancel-add'],
  },
};

export const insuranceStatusSchema = {
  uiSchema: {
    ...titleUI(({ formData }) =>
      privWrapper(
        personalizeTitleByName(
          formData,
          content['health-insurance--summary-title-no-items'],
        ),
      ),
    ),
    hasOhi: {
      ...yesNoUI({
        title: content['health-insurance--yes-no-label'],
        hint: content['health-insurance--yes-no-hint'],
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['hasOhi'],
    properties: {
      hasOhi: yesNoSchema,
    },
  },
};

const policyPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Policy information',
      showEditExplanationText: false,
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
        labels: INSURANCE_TYPE_LABELS,
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
      type: radioSchema(Object.keys(INSURANCE_TYPE_LABELS)),
      otherType: textSchema,
    },
  },
};

const summaryPage = {
  uiSchema: {
    'view:hasPolicies': arrayBuilderYesNoUI(
      insuranceOptions,
      yesNoOptions,
      yesNoOptions,
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
      depends: hasOhi,
      uiSchema: {
        ...titleUI(content['health-insurance--intro-title']),
        ...descriptionUI(content['health-insurance--intro-desc']),
      },
      schema: {
        type: 'object',
        properties: {},
      },
    }),
    insuranceSummary: pageBuilder.summaryPage({
      title: 'Review your [noun plural]',
      path: 'insurance-review',
      depends: hasOhi,
      ...summaryPage,
    }),
    insurancePolicy: pageBuilder.itemPage({
      title: 'Policy information',
      path: 'policy-info/:index',
      depends: hasOhi,
      ...policyPage,
    }),
    insuranceType: pageBuilder.itemPage({
      title: 'Type',
      path: 'insurance-type/:index',
      depends: hasOhi,
      ...insuranceProviderPage,
    }),
  }),
);
