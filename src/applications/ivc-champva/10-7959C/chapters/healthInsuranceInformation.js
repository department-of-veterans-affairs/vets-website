import React from 'react';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import {
  titleUI,
  titleSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  radioUI,
  radioSchema,
  yesNoUI,
  yesNoSchema,
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { requiredFiles } from '../config/constants';
import { isRequiredFile, nameWording } from '../helpers/utilities';
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
  medigapPlanA: 'Medigap Plan A',
  medigapPlanB: 'Medigap Plan B',
  medigapPlanC: 'Medigap Plan C',
  medigapPlanD: 'Medigap Plan D',
  medigapPlanF: 'Medigap Plan F',
  medigapPlanG: 'Medigap Plan G',
  medigapPlanK: 'Medigap Plan K',
  medigapPlanL: 'Medigap Plan L',
  medigapPlanM: 'Medigap Plan M',
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
          `${nameWording(formData)} ${
            isPrimary ? 'primary' : 'secondary'
          } health insurance`,
      ),
      [keyname]: {
        ...yesNoUI({
          updateUiSchema: formData => {
            const useFirstPerson = formData.certifierRole === 'applicant';
            return {
              'ui:title': `${
                useFirstPerson
                  ? 'Do you'
                  : `Does ${nameWording(formData, false)}`
              } need to provide or update any other health insurance coverage?`,
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
          `${nameWording(formData)} health insurance information`,
      ),
      [keyname1]: {
        'ui:title': 'Provider’s name',
        'ui:webComponentField': VaTextInputField,
      },
      [keyname2]: currentOrPastDateUI('Health insurance effective date'),
      [keyname3]: currentOrPastDateUI('Health insurance expiration date'),
    },
    schema: {
      type: 'object',
      required: [keyname1, keyname2, keyname3],
      properties: {
        titleSchema,
        [keyname1]: { type: 'string' },
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
          `${nameWording(formData)} ${formData[provider]} type of insurance`,
      ),
      [keyname]: {
        ...yesNoUI({
          updateUiSchema: formData => {
            return {
              'ui:title': `Is this insurance through ${nameWording(
                formData,
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
          `${nameWording(formData)} ${
            formData[provider]
          } prescription coverage`,
      ),
      [keyname]: {
        ...yesNoUI({
          updateUiSchema: formData => {
            return {
              'ui:title': `Does ${nameWording(
                formData,
              )} health insurance cover prescriptions?`,
              'ui:options': {
                hint:
                  'You can find this information on the front of your health insurance card',
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
          `${nameWording(formData)} ${
            formData[provider]
          } explanation of benefits`,
      ),
      [keyname]: {
        ...radioUI({
          updateUiSchema: formData => {
            const labels = {
              hasEob: 'Yes',
              noEob: 'No',
              unknownEob: 'I don’t know',
            };

            return {
              'ui:title': `Does ${nameWording(
                formData,
                true,
                false,
              )} health insurance provide an explanation of benefits (EOB) for prescriptions?`,
              'ui:options': { labels, hint: additionalFilesHint },
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
        [keyname]: radioSchema(['hasEob', 'noEob', 'unknownEob']),
      },
    },
  };
}

export function applicantInsuranceTypeSchema(isPrimary) {
  const keyname = isPrimary
    ? 'applicantPrimaryInsuranceType'
    : 'applicantSecondaryInsuranceType';
  const provider = isPrimary
    ? 'applicantPrimaryProvider'
    : 'applicantSecondaryProvider';
  return {
    uiSchema: {
      ...titleUI(
        ({ formData }) =>
          `${nameWording(formData)} ${formData[provider]} insurance plan`,
      ),
      [keyname]: {
        ...checkboxGroupUI({
          labels: {
            hmo: 'Health Maintenance Organization (HMO) program',
            ppo: 'Preferred Provider Organization (PPO) program',
            medicaid: 'Medicaid or a State Assistance program',
            rxDiscount: 'PrescriptionDiscount',
            other:
              'Other (specialty, limited coverage, or exclusively CHAMPVA supplemental) insurance',
            medigap: 'Medigap program',
          },
          required: true,
          updateUiSchema: formData => {
            const useFirstPerson = formData.certifierRole === 'applicant';
            return {
              'ui:title': `What type of insurance ${
                useFirstPerson
                  ? 'are you'
                  : `is ${nameWording(formData, false)}`
              } enrolled in?`,
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
        [keyname]: checkboxGroupSchema([
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
          `${nameWording(formData)} ${
            isPrimary
              ? formData?.applicantPrimaryProvider
              : formData?.applicantSecondaryProvider
          } Medigap information`,
      ),
      [keyname]: {
        ...radioUI({
          title: 'Which type of Medigap plan is the applicant enrolled in?',
          required: () => true,
          labels: MEDIGAP,
          updateUiSchema: formData => {
            const useFirstPerson = formData.certifierRole === 'applicant';
            return {
              'ui:title': `What type of Medigap plan ${
                useFirstPerson
                  ? 'are you'
                  : `is ${nameWording(formData, false)}`
              } enrolled in?`,
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
  const val = isPrimary ? 'primary' : 'secondary';
  const keyname = isPrimary
    ? 'primaryAdditionalComments'
    : 'secondaryAdditionalComments';
  return {
    uiSchema: {
      ...titleUI(
        ({ formData }) =>
          `${nameWording(formData)} ${
            isPrimary
              ? formData?.applicantPrimaryProvider
              : formData?.applicantSecondaryProvider
          } ${val} health insurance additional comments`,
      ),
      [keyname]: {
        'ui:title':
          'Any additional comments about this applicant’s health insurance?',
        'ui:webComponentField': VaTextInputField,
      },
    },
    schema: {
      type: 'object',
      properties: {
        titleSchema,
        [keyname]: { type: 'string' },
      },
    },
  };
}

export function applicantInsuranceCardSchema(isPrimary) {
  const val = isPrimary ? 'primary' : 'secondary';
  const keyname = isPrimary ? 'primaryInsuranceCard' : 'secondaryInsuranceCard';
  return {
    uiSchema: {
      ...titleUI(
        ({ formData, formContext }) =>
          `Upload ${
            isPrimary
              ? formData?.applicantPrimaryProvider
              : formData?.applicantSecondaryProvider
          } ${val} health insurance cards ${isRequiredFile(
            formContext,
            requiredFiles,
          )}`,
        ({ formData }) => {
          const appName = nameWording(formData);
          return (
            <>
              You’ll need to submit a copy of the front and back of {appName}{' '}
              Medicare Part A & B card.
              <br />
              If you don’t have a copy to upload now, you can send it by mail or
              fax
            </>
          );
        },
      ),
      ...fileUploadBlurb,
      [keyname]: fileUploadUI({
        label: 'Upload other health insurance cards',
      }),
    },
    schema: {
      type: 'object',
      properties: {
        titleSchema,
        'view:fileUploadBlurb': blankSchema,
        [keyname]: fileWithMetadataSchema([
          `Front of ${val} insurance card`,
          `Back of ${val} insurance card`,
        ]),
      },
    },
  };
}
