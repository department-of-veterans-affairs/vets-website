import React from 'react';
import get from '@department-of-veterans-affairs/platform-forms-system/get';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { blankSchema } from 'platform/forms-system/src/js/utilities/data/profile';
import {
  titleSchema,
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
import { toHash, nameWording, fmtDate } from '../../shared/utilities';

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
  ppo: 'Preferred Provider Organization (PPO) program',
  medicaid: 'Medicaid or a State Assistance program',
  rxDiscount: 'Prescription Discount program',
  other:
    'Other (specialty, limited coverage, or exclusively CHAMPVA supplemental) insurance',
  medigap: 'Medigap program',
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
  title:
    'Do you have any other health insurance to report for one or more applicants?',
  labelHeaderLevel: '2',
  labelHeaderLevelStyle: '5',
  hint:
    'If any applicants have other health insurance, it is required to report it to process your application for CHAMPVA benefits.',
};
const yesNoOptionsMore = {
  title: 'Do you have any other health insurance to report?',
  labelHeaderLevel: '2',
  labelHeaderLevelStyle: '5',
  hint:
    'If any applicants have other health insurance, it is required to report it to process your application for CHAMPVA benefits.',
};
export const healthInsuranceOptions = {
  arrayPath: 'healthInsurance',
  nounSingular: 'plan',
  nounPlural: 'plans',
  required: false,
  isItemIncomplete: item =>
    !(item.provider && item.insuranceType && item.effectiveDate),
  text: {
    summaryTitle: 'Report other health insurance',
    summaryTitleWithoutItems: 'Report other health insurance',
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
  },
  reviewPanelHeadingLevel: '3',
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
        title:
          'Select the type of insurance plan or program the applicant(s) are enrolled in',
        hint:
          'You may find this information on the front of the health insurance card.',
        required: () => true,
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['insuranceType'],
    properties: {
      titleSchema,
      insuranceType: radioSchema([
        'hmo',
        'ppo',
        'medicaid',
        'rxDiscount',
        'other',
        'medigap',
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
        title: 'Which type of Medigap plan are the applicant(s) enrolled in?',
        required: () => true,
        labels: MEDIGAP,
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['medigapPlan'],
    properties: {
      titleSchema,
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
      hint:
        'You may find the start date on the declarations page of your insurance policy.',
    }),
    expirationDate: currentOrPastDateUI({
      title: 'Insurance termination date',
      hint: 'Only enter this date if the policy is inactive.',
    }),
    'ui:validations': [
      (errors, formData) =>
        validFieldCharsOnly(errors, null, formData, 'provider'),
    ],
  },
  schema: {
    type: 'object',
    required: ['provider', 'effectiveDate'],
    properties: {
      titleSchema,
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
      titleSchema,
      throughEmployer: yesNoSchema,
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
      title: 'Any additional comments about the applicant(s) health insurance?',
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
      titleSchema,
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
    }),
    insuranceCardBack: fileUploadUI({
      label: 'Upload back of the health insurance card',
    }),
  },
  schema: {
    type: 'object',
    required: ['insuranceCardFront', 'insuranceCardBack'],
    properties: {
      titleSchema,
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
      path: 'health-insurance-summary',
      title: 'Review your plans',
      uiSchema: healthInsuranceSummaryPage.uiSchema,
      schema: healthInsuranceSummaryPage.schema,
    }),
    healthInsuranceType: pageBuilder.itemPage({
      path: 'health-insurance-type/:index',
      title: 'Plan type',
      ...healthInsuranceIntroPage,
    }),
    medigapType: pageBuilder.itemPage({
      path: 'medigap-type/:index',
      title: 'Plan type',
      depends: (formData, index) =>
        get('insuranceType', formData.healthInsurance?.[index]) === 'medigap',
      ...medigapInformation,
    }),
    provider: pageBuilder.itemPage({
      path: 'insurance-info/:index',
      title: 'Health insurance information',
      ...providerInformation,
    }),
    throughEmployer: pageBuilder.itemPage({
      path: 'through-employer/:index',
      title: 'Type of insurance - through employer',
      ...employer,
    }),
    comments: pageBuilder.itemPage({
      path: 'insurance-comments/:index',
      title: 'Type of insurance',
      ...additionalComments,
    }),
    participants: pageBuilder.itemPage({
      path: 'select-participants/:index',
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
