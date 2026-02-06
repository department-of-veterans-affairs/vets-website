import get from '@department-of-veterans-affairs/platform-forms-system/get';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import {
  radioUI,
  descriptionUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  radioSchema,
  textUI,
  textSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  yesNoUI,
  yesNoSchema,
  textareaUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { validFieldCharsOnly } from '../../shared/validations';
import {
  replaceStrValues,
  validateHealthInsurancePlan,
  validateOHIDates,
} from '../helpers';
import { healthInsurancePageTitleUI } from '../helpers/titles';
import { attachmentUI, singleAttachmentSchema } from '../definitions';
import FileUploadDescription from '../components/FormDescriptions/FileUploadDescription';
import HealthInsuranceSummaryCard from '../components/FormDescriptions/HealthInsuranceSummaryCard';
import participants from './healthInsuranceInformation/participants';
import planTypes from './healthInsuranceInformation/planTypes';
import content from '../locales/en/content.json';

const MEDIGAP = {
  A: 'Medigap Plan A',
  B: 'Medigap Plan B',
  C: 'Medigap Plan C',
  D: 'Medigap Plan D',
  F: 'Medigap Plan F',
  G: 'Medigap Plan G',
  K: 'Medigap Plan K',
  L: 'Medigap Plan L',
  M: 'Medigap Plan M',
  N: 'Medigap Plan N',
};

const yesNoOptions = {
  title: content['health-insurance--yes-no-title'],
  hint: null,
  labelHeaderLevel: '2',
  labelHeaderLevelStyle: '4',
};
const yesNoOptionsMore = {
  title: content['health-insurance--yes-no-more-title'],
  hint: content['health-insurance--yes-no-hint'],
  labelHeaderLevel: '2',
  labelHeaderLevelStyle: '4',
};

export const healthInsuranceOptions = {
  arrayPath: 'healthInsurance',
  nounSingular: 'plan',
  nounPlural: 'plans',
  required: false,
  isItemIncomplete: validateHealthInsurancePlan,
  maxItems: 2,
  text: {
    getItemName: item => item?.provider,
    cardDescription: HealthInsuranceSummaryCard,
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
    summaryTitle: () => content['health-insurance--summary-title'],
    summaryTitleWithoutItems: () =>
      content['health-insurance--summary-title-no-items'],
  },
};

const healthInsuranceSummaryPage = {
  uiSchema: {
    'view:hasHealthInsurance': arrayBuilderYesNoUI(
      healthInsuranceOptions,
      yesNoOptions,
      yesNoOptionsMore,
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasHealthInsurance': arrayBuilderYesNoSchema,
    },
    required: ['view:hasHealthInsurance'],
  },
};

const medigapInformation = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Medigap information'),
    medigapPlan: {
      ...radioUI({
        title: 'Select the Medigap policy the applicant(s) are enrolled in',
        labels: MEDIGAP,
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['medigapPlan'],
    properties: {
      medigapPlan: radioSchema(Object.keys(MEDIGAP)),
    },
  },
};

const providerInformation = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Health insurance information'),
    provider: textUI('Name of insurance provider'),
    effectiveDate: currentOrPastDateUI({
      title: 'Insurance start date',
      hint: 'This information is on the insurance policy declarations page.',
    }),
    expirationDate: currentOrPastDateUI({
      title: 'Insurance termination date',
      hint: 'Only enter this date if the policy is inactive.',
    }),
    'ui:validations': [
      (errors, formData) =>
        validFieldCharsOnly(errors, null, formData, 'provider'),
      validateOHIDates,
    ],
  },
  schema: {
    type: 'object',
    required: ['provider', 'effectiveDate'],
    properties: {
      provider: textSchema,
      effectiveDate: currentOrPastDateSchema,
      expirationDate: currentOrPastDateSchema,
    },
  },
};

const employer = {
  uiSchema: {
    ...healthInsurancePageTitleUI('Type of insurance for', null, {
      position: 'suffix',
    }),
    throughEmployer: yesNoUI({
      title: 'Is this insurance through the applicant(s) employer?',
    }),
  },
  schema: {
    type: 'object',
    required: ['throughEmployer'],
    properties: {
      throughEmployer: yesNoSchema,
    },
  },
};

const prescriptionCoverage = {
  uiSchema: {
    ...healthInsurancePageTitleUI('prescription coverage'),
    eob: yesNoUI({
      title: 'Does the applicant(s) health insurance cover prescriptions?',
      hint:
        'You may find this information on the front of the health insurance card. You can also contact the phone number listed on the back of the card.',
    }),
  },
  schema: {
    type: 'object',
    required: ['eob'],
    properties: {
      eob: yesNoSchema,
    },
  },
};

const additionalComments = {
  uiSchema: {
    ...healthInsurancePageTitleUI('health insurance additional comments'),
    additionalComments: textareaUI({
      title:
        'Do you have any additional comments about the applicant(s) health insurance?',
      charcount: true,
    }),
    'ui:validations': [
      (errors, formData) =>
        validFieldCharsOnly(errors, null, formData, 'additionalComments'),
    ],
  },
  schema: {
    type: 'object',
    properties: {
      additionalComments: { type: 'string', maxLength: 200 },
    },
  },
};

const healthInsuranceCardUploadPage = {
  uiSchema: {
    ...healthInsurancePageTitleUI(
      'Upload %s health insurance card',
      'You’ll need to submit a copy of the front and back of this health insurance card.',
    ),
    ...descriptionUI(FileUploadDescription),
    insuranceCardFront: attachmentUI({
      label: 'Upload front of the health insurance card',
      attachmentId: 'Front of health insurance card',
    }),
    insuranceCardBack: attachmentUI({
      label: 'Upload back of the health insurance card',
      attachmentId: 'Back of health insurance card',
    }),
  },
  schema: {
    type: 'object',
    required: ['insuranceCardFront', 'insuranceCardBack'],
    properties: {
      insuranceCardFront: singleAttachmentSchema,
      insuranceCardBack: singleAttachmentSchema,
    },
  },
};

export const healthInsurancePages = arrayBuilderPages(
  healthInsuranceOptions,
  pageBuilder => ({
    healthInsuranceSummary: pageBuilder.summaryPage({
      path: 'other-health-insurance-plans',
      title: 'Other health insurance plans',
      uiSchema: healthInsuranceSummaryPage.uiSchema,
      schema: healthInsuranceSummaryPage.schema,
    }),
    healthInsuranceType: pageBuilder.itemPage({
      path: 'health-insurance-plan-type/:index',
      title: 'Plan type',
      ...planTypes,
    }),
    medigapType: pageBuilder.itemPage({
      path: 'health-insurance-medigap-information/:index',
      title: 'Plan type',
      depends: (formData, index) =>
        get('insuranceType', formData.healthInsurance?.[index]) === 'medigap',
      ...medigapInformation,
    }),
    provider: pageBuilder.itemPage({
      path: 'health-insurance-provider-information/:index',
      title: 'Health insurance information',
      ...providerInformation,
    }),
    throughEmployer: pageBuilder.itemPage({
      path: 'health-insurance-employer-sponsorship/:index',
      title: 'Type of insurance - through employer',
      ...employer,
    }),
    prescriptionCoverage: pageBuilder.itemPage({
      path: 'health-insurance-prescription-coverage/:index',
      title: 'Prescription coverage',
      ...prescriptionCoverage,
    }),
    comments: pageBuilder.itemPage({
      path: 'health-insurance-additional-comments/:index',
      title: 'Type of insurance',
      ...additionalComments,
    }),
    participants: pageBuilder.itemPage({
      path: 'health-insurance-participants/:index',
      title: 'Select healthcare participants',
      ...participants,
    }),
    insuranceCard: pageBuilder.itemPage({
      path: 'health-insurance-card/:index',
      title: 'Upload health insurance card',
      ...healthInsuranceCardUploadPage,
    }),
  }),
);
