import React from 'react';
import {
  titleUI,
  titleSchema,
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
import { nameWording } from '../helpers/utilities';
import {
  fileWithMetadataSchema,
  fileUploadBlurb,
} from '../../shared/components/fileUploads/attachments';
import { fileUploadUi as fileUploadUI } from '../../shared/components/fileUploads/upload';
import { blankSchema } from './applicantInformation';

// TODO: move to /shared
const additionalFilesHint =
  'Depending on your response, you may need to submit additional documents with this application.';

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
  return {
    uiSchema: {
      ...titleUI(
        ({ formData }) =>
          `${nameWording(formData, undefined, undefined, true)} ${
            isPrimary ? '' : 'additional'
          } health insurance`,
      ),
      [keyname]: {
        ...yesNoUI({
          updateUiSchema: formData => {
            return {
              'ui:title': `Does ${nameWording(
                formData,
                false,
                undefined,
                true,
              )} have ${
                isPrimary ? '' : 'any other'
              } medical health insurance information to provide or update at this time?`,
              'ui:options': {
                hint: additionalFilesHint,
              },
            };
          },
        }),
      },
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
      ...titleUI(
        ({ formData }) =>
          `${nameWording(
            formData,
            undefined,
            undefined,
            true,
          )} health insurance information`,
      ),
      [keyname1]: textUI('Name of insurance provider'),
      [keyname2]: currentOrPastDateUI({
        title: 'Insurance start date',
        hint:
          'You may find the start date on the declarations page of your insurance policy.',
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
        titleSchema,
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
        ({ formData }) =>
          `${nameWording(
            formData,
            undefined,
            undefined,
            true,
          )} type of insurance for ${formData[provider]}`,
      ),
      [keyname]: {
        ...yesNoUI({
          updateUiSchema: formData => {
            return {
              'ui:title': `Is this insurance through ${nameWording(
                formData,
                undefined,
                undefined,
                true,
              )} employer?`,
            };
          },
        }),
      },
    },
    schema: {
      type: 'object',
      required: [keyname],
      properties: {
        titleSchema,
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
        ({ formData }) =>
          `${nameWording(formData, undefined, undefined, true)} ${
            formData[provider]
          } prescription coverage`,
      ),
      [keyname]: {
        ...yesNoUI({
          updateUiSchema: formData => {
            return {
              'ui:title': `Does ${nameWording(
                formData,
                undefined,
                undefined,
                true,
              )} health insurance cover prescriptions?`,
              'ui:options': {
                hint:
                  'You may find this information on the front of your health insurance card. You can also contact the phone number listed on the back of the card.',
              },
            };
          },
        }),
      },
    },
    schema: {
      type: 'object',
      required: [keyname],
      properties: {
        titleSchema,
        [keyname]: yesNoSchema,
      },
    },
  };
}

export function applicantInsuranceEOBSchema(isPrimary) {
  const keyname = isPrimary ? 'applicantPrimaryEOB' : 'applicantSecondaryEOB';
  const provider = isPrimary
    ? 'applicantPrimaryProvider'
    : 'applicantSecondaryProvider';
  return {
    uiSchema: {
      ...titleUI(
        ({ formData }) =>
          `${nameWording(formData, undefined, undefined, true)} ${
            formData[provider]
          } explanation of benefits`,
      ),
      [keyname]: {
        ...yesNoUI({
          updateUiSchema: formData => {
            return {
              'ui:title': `Does ${nameWording(
                formData,
                undefined,
                undefined,
                true,
              )} health insurance have an explanation of benefits (EOB) for prescriptions?`,
              'ui:options': {
                hint:
                  "If you're not sure, you can call the phone number listed on the back of your health insurance card.",
              },
            };
          },
        }),
      },
    },
    schema: {
      type: 'object',
      required: [keyname],
      properties: {
        titleSchema,
        [keyname]: yesNoSchema,
      },
    },
  };
}

export function applicantInsuranceSOBSchema(isPrimary) {
  const keyname = isPrimary
    ? 'primaryInsuranceScheduleOfBenefits'
    : 'secondaryInsuranceScheduleOfBenefits';
  return {
    uiSchema: {
      ...titleUI(
        ({ formData }) =>
          `Upload ${
            isPrimary
              ? formData?.applicantPrimaryProvider
              : formData?.applicantSecondaryProvider
          } schedule of benefits`,
        () => {
          return (
            <>
              You’ll need to submit a copy of the card or document that shows
              the schedule of benefits that lists your co-payments.
              <br />
              <br />
              If you don’t have a copy to upload now, you can send it by mail or
              fax.
            </>
          );
        },
      ),
      ...fileUploadBlurb,
      [keyname]: fileUploadUI({
        label: 'Upload schedule of benefits document',
      }),
    },
    schema: {
      type: 'object',
      properties: {
        titleSchema,
        'view:fileUploadBlurb': blankSchema,
        [keyname]: fileWithMetadataSchema([`Schedule of benefits document`]),
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
      ...titleUI(
        ({ formData }) =>
          `${nameWording(formData, undefined, undefined, true)} ${
            isPrimary ? '' : 'additional'
          } insurance plan`,
      ),
      [keyname]: {
        ...radioUI({
          labels: {
            hmo: 'Health Maintenance Organization (HMO) program',
            ppo: 'Preferred Provider Organization (PPO) program',
            medicaid: 'Medicaid or a State Assistance program',
            rxDiscount: 'Prescription Discount program',
            other:
              'Other (specialty, limited coverage, or exclusively CHAMPVA supplemental) insurance',
            medigap: 'Medigap program',
          },
          required: () => true,
          updateUiSchema: formData => {
            return {
              'ui:title': `Select the type of insurance plan or program ${nameWording(
                formData,
                false,
                undefined,
                true,
              )} is enrolled in`,
              'ui:options': {
                hint:
                  'You may find this information on the front of your health insurance card.',
              },
            };
          },
        }),
      },
    },
    schema: {
      type: 'object',
      required: [keyname],
      properties: {
        titleSchema,
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
      ...titleUI(
        ({ formData }) =>
          `${nameWording(formData, undefined, undefined, true)} ${
            isPrimary ? '' : 'additional'
          } Medigap information`,
      ),
      [keyname]: {
        ...radioUI({
          title: 'Which type of Medigap plan is the applicant enrolled in?',
          required: () => true,
          labels: MEDIGAP,
          updateUiSchema: formData => {
            return {
              'ui:title': `Select the Medigap plan ${nameWording(
                formData,
                false,
                undefined,
                true,
              )} is enrolled in`,
            };
          },
        }),
      },
    },
    schema: {
      type: 'object',
      required: [keyname],
      properties: {
        titleSchema,
        [keyname]: radioSchema(Object.keys(MEDIGAP)),
      },
    },
  };
}

export function applicantInsuranceCommentsSchema(isPrimary) {
  const keyname = isPrimary
    ? 'primaryAdditionalComments'
    : 'secondaryAdditionalComments';
  return {
    uiSchema: {
      ...titleUI(
        ({ formData }) =>
          `${nameWording(formData, undefined, undefined, true)} ${
            isPrimary
              ? formData?.applicantPrimaryProvider
              : formData?.applicantSecondaryProvider
          } health insurance additional comments`,
      ),
      [keyname]: textareaUI({
        updateUiSchema: formData => {
          return {
            'ui:title': `Any additional comments about ${nameWording(
              formData,
              undefined,
              undefined,
              true,
            )} health insurance?`,
          };
        },
        charcount: true,
      }),
    },
    schema: {
      type: 'object',
      properties: {
        titleSchema,
        [keyname]: { type: 'string', maxLength: 200 },
      },
    },
  };
}

export function applicantInsuranceCardSchema(isPrimary) {
  const keyname = isPrimary ? 'primaryInsuranceCard' : 'secondaryInsuranceCard';
  return {
    uiSchema: {
      ...titleUI(
        ({ formData }) =>
          `Upload ${
            isPrimary
              ? formData?.applicantPrimaryProvider
              : formData?.applicantSecondaryProvider
          } health insurance card`,
        () => {
          return (
            <>
              You’ll need to submit a copy of the front and back of this health
              insurance card.
              <br />
              <br />
              If you don’t have a copy to upload now, you can send it by mail or
              fax.
            </>
          );
        },
      ),
      ...fileUploadBlurb,
      [keyname]: {
        ...fileUploadUI({
          label: 'Upload health insurance card',
        }),
        'ui:errorMessages': {
          minItems:
            'You must add both the front and back of your card as separate files.',
        },
      },
    },
    schema: {
      type: 'object',
      properties: {
        titleSchema,
        'view:fileUploadBlurb': blankSchema,
        [keyname]: fileWithMetadataSchema(
          [
            `Front of insurance card`,
            `Back of insurance card`,
            `Other insurance supporting document`,
          ],
          2,
        ),
      },
    },
  };
}
