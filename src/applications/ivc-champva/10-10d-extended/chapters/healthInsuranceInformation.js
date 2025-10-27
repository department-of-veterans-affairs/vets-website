import React from 'react';
import get from '@department-of-veterans-affairs/platform-forms-system/get';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { blankSchema } from 'platform/forms-system/src/js/utilities/data/profile';
import {
  radioUI,
  arrayBuilderItemFirstPageTitleUI,
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
import { fileUploadBlurb } from '../../shared/components/fileUploads/attachments';
import { fileUploadUi as fileUploadUI } from '../../shared/components/fileUploads/upload';
import FileFieldCustom from '../../shared/components/fileUploads/FileUpload';
import { validFieldCharsOnly } from '../../shared/validations';
import { validateOHIDates } from '../helpers/validations';
import { replaceStrValues } from '../helpers/formatting';
import { toHash, nameWording, fmtDate } from '../../shared/utilities';
import content from '../locales/en/content.json';

import {
  selectHealthcareParticipantsPage,
  SelectHealthcareParticipantsPage,
} from './SelectHealthcareParticipantsPage';

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

const INSURANCE_TYPE_LABELS = {
  hmo: 'Health Maintenance Organization (HMO) program',
  ppo: 'Preferred Provider Organization (PPO) plan',
  medicaid: 'Medicaid or a state assistance program',
  medigap: 'Medigap policy',
  other:
    'Other (specialty, limited coverage, or exclusively CHAMPVA supplemental) insurance',
};

export function generateParticipantNames(item) {
  if (item) {
    const healthcareParticipants = item.healthcareParticipants || {};
    const applicantObjects = item['view:applicantObjects'] || [];
    const matches = applicantObjects.filter(app =>
      Object.keys(healthcareParticipants)
        .filter(e => healthcareParticipants[e] === true)
        .includes(toHash(app.applicantSSN)),
    );
    const names = matches?.map(n => nameWording(n, false, false, false));
    return names.length > 0 ? names.join(', ') : 'No members specified';
  }
  return 'No participants';
}

/**
 * Options for the yes/no text on summary page:
 */
const yesNoOptions = {
  title: content['health-insurance--yes-no-title'],
  hint: content['health-insurance--yes-no-hint'],
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
  isItemIncomplete: item =>
    !(item.provider && item.insuranceType && item.effectiveDate),
  text: {
    getItemName: item => item?.provider,
    cardDescription: item => (
      <ul className="no-bullets">
        <li>
          <b>Type:</b> {INSURANCE_TYPE_LABELS[(item?.insuranceType)]}
        </li>
        <li>
          <b>Dates:</b>{' '}
          {item?.effectiveDate ? fmtDate(item?.effectiveDate) : 'present'}
          {' - '}
          {item?.expirationDate ? fmtDate(item?.expirationDate) : 'present'}
        </li>
        <li>
          <b>Policy members:</b> {generateParticipantNames(item)}
        </li>
      </ul>
    ),
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
    summaryTitle: () => content['health-insurance--intro-title'],
    summaryTitleWithoutItems: () => content['health-insurance--intro-title'],
  },
};

const healthInsuranceIntroPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Private or employer-sponsored insurance plan',
      nounSingular: healthInsuranceOptions.nounSingular,
    }),
    insuranceType: {
      ...radioUI({
        labels: INSURANCE_TYPE_LABELS,
        title: `Which type of insurance plan or program are the applicant(s) enrolled in?`,
        hint: 'This information is on the front of the health insurance card.',
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['insuranceType'],
    properties: {
      insuranceType: radioSchema([
        'hmo',
        'ppo',
        'medicaid',
        'medigap',
        'other',
      ]),
    },
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
        title: 'Select the Medigap policy the applicants are enrolled in',
        required: () => true,
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
      hint: 'This information is on the insurance policy declarations pages.',
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
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) => `Type of insurance for ${formData?.provider}`,
    ),
    throughEmployer: yesNoUI({
      title: 'Is this insurance through the applicant(s) employer?',
      required: () => true,
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
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) => `${formData?.provider} prescription coverage`,
    ),
    eob: yesNoUI({
      title: 'Does the applicant(s) health insurance cover prescriptions?',
      hint:
        'You may find this information on the front of your health insurance card. You can also contact the phone number listed on the back of the card.',
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
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `${formData?.provider} health insurance additional comments`,
    ),
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
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) => `Upload ${formData?.provider} health insurance card`,
      'You’ll need to submit a copy of the front and back of this health insurance card.',
    ),
    ...fileUploadBlurb,
    insuranceCardFront: fileUploadUI({
      label: 'Upload front of the health insurance card',
      attachmentId: 'Front of health insurance card',
      'ui:hint': 'Upload front and back as separate files.',
    }),
    insuranceCardBack: fileUploadUI({
      label: 'Upload back of the health insurance card',
      attachmentId: 'Back of health insurance card',
    }),
  },
  schema: {
    type: 'object',
    required: ['insuranceCardFront', 'insuranceCardBack'],
    properties: {
      'view:fileUploadBlurb': blankSchema,
      insuranceCardFront: {
        type: 'array',
        maxItems: 1,
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
          },
        },
      },
      insuranceCardBack: {
        type: 'array',
        maxItems: 1,
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
          },
        },
      },
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
      ...healthInsuranceIntroPage,
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
      ...selectHealthcareParticipantsPage,
      CustomPage: props =>
        SelectHealthcareParticipantsPage({
          ...props,
          // resolve prop warning that the index is a string rather than a number:
          pagePerItemIndex: +props.pagePerItemIndex,
        }),
      CustomPageReview: () => <></>,
    }),
    insuranceCard: pageBuilder.itemPage({
      path: 'health-insurance-card/:index',
      title: 'Upload health insurance card',
      CustomPage: FileFieldCustom,
      ...healthInsuranceCardUploadPage,
    }),
  }),
);
