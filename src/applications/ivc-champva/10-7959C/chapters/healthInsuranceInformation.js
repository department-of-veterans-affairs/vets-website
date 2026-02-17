import {
  titleUI,
  textUI,
  textSchema,
  textareaUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  radioUI,
  radioSchema,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { fileUploadBlurb } from '../../shared/components/fileUploads/attachments';
import { validateChars } from '../utils/validation';
import {
  attachmentUI,
  blankSchema,
  singleAttachmentSchema,
  textareaSchema,
} from '../definitions';

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

/*
Primary health insurance and secondary health insurance information use
the same set of questions. This schema works for either depending on
the boolean passed in (if true, we generate the primary schema, if false
we generate the secondary schema). Using this pattern for all primary/secondary
schemas
*/
export function applicantHasInsuranceSchema(isPrimary) {
  const keyname = isPrimary ? 'applicantHasPrimary' : 'applicantHasSecondary';
  const pageTitle = `Report ${
    !isPrimary ? 'additional ' : ''
  }other health insurance`;
  const inputLabel = `Do you have ${
    isPrimary ? 'any' : 'additional'
  } other health insurance information to report?`;
  return {
    uiSchema: {
      ...titleUI(pageTitle),
      [keyname]: yesNoUI(inputLabel),
    },
    schema: {
      type: 'object',
      required: [keyname],
      properties: {
        [keyname]: yesNoSchema,
      },
    },
  };
}

export function applicantProviderSchema(isPrimary) {
  const keyname1 = isPrimary
    ? 'applicantPrimaryProvider'
    : 'applicantSecondaryProvider';
  const keyname2 = isPrimary
    ? 'applicantPrimaryEffectiveDate'
    : 'applicantSecondaryEffectiveDate';
  const keyname3 = isPrimary
    ? 'applicantPrimaryExpirationDate'
    : 'applicantSecondaryExpirationDate';
  return {
    uiSchema: {
      ...titleUI('Health insurance information'),
      [keyname1]: textUI({
        title: 'Name of insurance provider',
        validations: [validateChars],
      }),
      [keyname2]: currentOrPastDateUI({
        title: 'Insurance start date',
        hint: 'This information is on the insurance policy declaration page.',
      }),
      [keyname3]: currentOrPastDateUI({
        title: 'Insurance termination date',
        hint: 'Only enter this date if the policy is inactive.',
      }),
    },
    schema: {
      type: 'object',
      required: [keyname1, keyname2],
      properties: {
        [keyname1]: textSchema,
        [keyname2]: currentOrPastDateSchema,
        [keyname3]: currentOrPastDateSchema,
      },
    },
  };
}

export function applicantInsuranceThroughEmployerSchema(isPrimary) {
  const keyname = isPrimary
    ? 'applicantPrimaryThroughEmployer'
    : 'applicantSecondaryThroughEmployer';
  const provider = isPrimary
    ? 'applicantPrimaryProvider'
    : 'applicantSecondaryProvider';
  return {
    uiSchema: {
      ...titleUI(
        ({ formData }) => `Type of insurance for ${formData[provider]}`,
      ),
      [keyname]: yesNoUI(
        'Is this insurance through the beneficiary’s employer?',
      ),
    },
    schema: {
      type: 'object',
      required: [keyname],
      properties: {
        [keyname]: yesNoSchema,
      },
    },
  };
}

export function applicantInsurancePrescriptionSchema(isPrimary) {
  const keyname = isPrimary
    ? 'applicantPrimaryHasPrescription'
    : 'applicantSecondaryHasPrescription';
  const provider = isPrimary
    ? 'applicantPrimaryProvider'
    : 'applicantSecondaryProvider';
  return {
    uiSchema: {
      ...titleUI(
        ({ formData }) => `${formData[provider]} prescription coverage`,
      ),
      [keyname]: yesNoUI({
        title: 'Does the beneficiary’s health insurance cover prescriptions?',
        hint:
          'You may find this information on the front of the health insurance card. You can also contact the phone number listed on the back of the card.',
      }),
    },
    schema: {
      type: 'object',
      required: [keyname],
      properties: {
        [keyname]: yesNoSchema,
      },
    },
  };
}

export function applicantInsuranceEobSchema(isPrimary) {
  const keyname = isPrimary ? 'applicantPrimaryEob' : 'applicantSecondaryEob';
  const provider = isPrimary
    ? 'applicantPrimaryProvider'
    : 'applicantSecondaryProvider';
  return {
    uiSchema: {
      ...titleUI(
        ({ formData }) => `${formData[provider]} explanation of benefits`,
      ),
      [keyname]: yesNoUI({
        title:
          'Does the beneficiary’s health insurance have an explanation of benefits (EOB) for prescriptions?',
        hint:
          'If you’re not sure, you can call the phone number listed on the back of the health insurance card.',
      }),
    },
    schema: {
      type: 'object',
      required: [keyname],
      properties: {
        [keyname]: yesNoSchema,
      },
    },
  };
}

export function applicantInsuranceSOBSchema(isPrimary) {
  const keyname = isPrimary
    ? 'primaryInsuranceScheduleOfBenefits'
    : 'secondaryInsuranceScheduleOfBenefits';
  const provider = isPrimary
    ? 'applicantPrimaryProvider'
    : 'applicantSecondaryProvider';
  return {
    uiSchema: {
      ...titleUI(
        ({ formData }) => `Upload ${formData[provider]} schedule of benefits`,
        'You’ll need to submit a copy of the card or document that shows the schedule of benefits that lists the beneficiary’s co-payments.',
      ),
      ...fileUploadBlurb,
      [keyname]: attachmentUI({
        label: 'Upload schedule of benefits document',
        attachmentId: 'Schedule of benefits document',
      }),
    },
    schema: {
      type: 'object',
      required: [keyname],
      properties: {
        'view:fileUploadBlurb': blankSchema,
        [keyname]: singleAttachmentSchema,
      },
    },
  };
}

export function applicantInsuranceTypeSchema(isPrimary) {
  const keyname = isPrimary
    ? 'applicantPrimaryInsuranceType'
    : 'applicantSecondaryInsuranceType';
  return {
    uiSchema: {
      ...titleUI('Private or employer-sponsored insurance plan'),
      [keyname]: radioUI({
        title:
          'Which type of insurance plan or program is the beneficiary enrolled in?',
        hint: 'This information is on the front of the health insurance card',
        labels: {
          hmo: 'Health Maintenance Organization (HMO) program',
          ppo: 'Preferred Provider Organization (PPO) program',
          medicaid: 'Medicaid or a State Assistance program',
          medigap: 'Medigap program',
          rxDiscount: 'Prescription Discount program',
          other:
            'Other (specialty, limited coverage, or exclusively CHAMPVA supplemental) insurance',
        },
      }),
    },
    schema: {
      type: 'object',
      required: [keyname],
      properties: {
        [keyname]: radioSchema([
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
}

export function applicantMedigapSchema(isPrimary) {
  const keyname = isPrimary ? 'primaryMedigapPlan' : 'secondaryMedigapPlan';
  return {
    uiSchema: {
      ...titleUI('Medigap information'),
      [keyname]: radioUI({
        title: 'Select the Medigap policy the beneficiary is enrolled in.',
        labels: MEDIGAP,
      }),
    },
    schema: {
      type: 'object',
      required: [keyname],
      properties: {
        [keyname]: radioSchema(Object.keys(MEDIGAP)),
      },
    },
  };
}

export function applicantInsuranceCommentsSchema(isPrimary) {
  const keyname = isPrimary
    ? 'primaryAdditionalComments'
    : 'secondaryAdditionalComments';
  const provider = isPrimary
    ? 'applicantPrimaryProvider'
    : 'applicantSecondaryProvider';
  return {
    uiSchema: {
      ...titleUI(
        ({ formData }) =>
          `${formData[provider]} health insurance additional comments`,
      ),
      [keyname]: textareaUI({
        title:
          'Do you have any additional comments about the beneficiary’s health insurance?',
        validations: [validateChars],
        charcount: true,
      }),
    },
    schema: {
      type: 'object',
      properties: {
        [keyname]: textareaSchema,
      },
    },
  };
}

export function applicantInsuranceCardSchema(isPrimary) {
  const keyname = isPrimary ? 'primaryInsuranceCard' : 'secondaryInsuranceCard';
  const provider = isPrimary
    ? 'applicantPrimaryProvider'
    : 'applicantSecondaryProvider';
  return {
    uiSchema: {
      ...titleUI(
        ({ formData }) => `Upload ${formData[provider]} health insurance card`,
        'You’ll need to submit a copy of the front and back of this health insurance card.',
      ),
      ...fileUploadBlurb,
      [`${keyname}Front`]: attachmentUI({
        label: 'Upload front of insurance card',
        attachmentId: 'Front of insurance card', // used behind the scenes
      }),
      [`${keyname}Back`]: attachmentUI({
        label: 'Upload back of insurance card',
        attachmentId: 'Back of insurance card', // used behind the scenes
      }),
    },
    schema: {
      type: 'object',
      required: [`${keyname}Front`, `${keyname}Back`],
      properties: {
        'view:fileUploadBlurb': blankSchema,
        [`${keyname}Front`]: singleAttachmentSchema,
        [`${keyname}Back`]: singleAttachmentSchema,
      },
    },
  };
}
