import React from 'react';
import VaTextareaField from 'platform/forms-system/src/js/web-component-fields/VaTextareaField';
import {
  titleUI,
  titleSchema,
  textUI,
  textSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  yesNoUI,
  yesNoSchema,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { nameWording } from '../helpers/utilities';
import { fileUploadUi as fileUploadUI } from '../../shared/components/fileUploads/upload';
import {
  fileWithMetadataSchema,
  fileUploadBlurb,
} from '../../shared/components/fileUploads/attachments';

// TODO put in /shared
const additionalFilesHint =
  'Depending on your response, you may need to submit additional documents with this application.';

const effectiveDateHint =
  'You may find your effective date on the front of your Medicare card near "Coverage starts" or "Effective date."';

export const blankSchema = { type: 'object', properties: {} };

export const applicantHasMedicareSchema = {
  uiSchema: {
    ...titleUI(
      ({ formData }) =>
        `${nameWording(formData, undefined, undefined, true)} Medicare status`,
    ),
    applicantMedicareStatus: {
      ...yesNoUI({
        updateUiSchema: formData => {
          return {
            'ui:title': `Does ${nameWording(
              formData,
              false,
              undefined,
              true,
            )} need to provide or update Medicare coverage?`,
            'ui:options': { hint: additionalFilesHint },
          };
        },
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['applicantMedicareStatus'],
    properties: {
      applicantMedicareStatus: yesNoSchema,
    },
  },
};

export const applicantMedicareClassSchema = {
  uiSchema: {
    ...titleUI(
      ({ formData }) =>
        `${nameWording(
          formData,
          undefined,
          undefined,
          true,
        )} Medicare coverage`,
    ),
    applicantMedicareClass: {
      ...radioUI({
        required: () => true,
        labels: {
          ab: 'Original Medicare Parts A and B (hospital and medical coverage)',
          advantage: 'Medicare Advantage Plan (Part C)',
          other: 'Other Medicare plan',
        },
        updateUiSchema: formData => {
          return {
            'ui:title': `Which Medicare plan is ${nameWording(
              formData,
              false,
              false,
              true,
            )} enrolled in?`,
            'ui:options': {
              hint:
                'You can find this information on the front of your Medicare card.',
            },
          };
        },
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['applicantMedicareClass'],
    properties: {
      applicantMedicareClass: radioSchema(['ab', 'advantage', 'other']),
    },
  },
};

export const applicantMedicarePharmacySchema = {
  uiSchema: {
    ...titleUI(
      ({ formData }) =>
        `${nameWording(
          formData,
          undefined,
          undefined,
          true,
        )} Medicare pharmacy benefits`,
    ),
    applicantMedicarePharmacyBenefits: {
      ...yesNoUI({
        updateUiSchema: formData => {
          return {
            'ui:title': `Does ${nameWording(
              formData,
              undefined,
              undefined,
              true,
            )} Medicare plan provide pharmacy benefits?`,
            'ui:options': {
              hint:
                'You can find this information on the front of your Medicare card.',
            },
          };
        },
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['applicantMedicarePharmacyBenefits'],
    properties: {
      applicantMedicarePharmacyBenefits: yesNoSchema,
    },
  },
};

export const applicantMedicarePartACarrierSchema = {
  uiSchema: {
    ...titleUI(
      ({ formData }) =>
        `${nameWording(
          formData,
          undefined,
          undefined,
          true,
        )} Medicare Part A carrier`,
    ),
    applicantMedicarePartACarrier: textUI({
      title: 'Name of insurance carrier',
      hint:
        'Your insurance is "Medicare Health Insurance" or your insurance company.',
    }),
    applicantMedicarePartAEffectiveDate: currentOrPastDateUI({
      title: 'Medicare Part A effective date',
      hint: effectiveDateHint,
    }),
  },
  schema: {
    type: 'object',
    required: [
      'applicantMedicarePartACarrier',
      'applicantMedicarePartAEffectiveDate',
    ],
    properties: {
      titleSchema,
      applicantMedicarePartACarrier: textSchema,
      applicantMedicarePartAEffectiveDate: currentOrPastDateSchema,
    },
  },
};

export const applicantMedicarePartBCarrierSchema = {
  uiSchema: {
    ...titleUI(
      ({ formData }) =>
        `${nameWording(
          formData,
          undefined,
          undefined,
          true,
        )} Medicare Part B carrier`,
    ),
    applicantMedicarePartBCarrier: textUI({
      title: 'Name of insurance carrier',
      hint:
        'Your insurance is "Medicare Health Insurance" or your insurance company.',
    }),
    applicantMedicarePartBEffectiveDate: currentOrPastDateUI({
      title: 'Medicare Part B effective date',
      hint: effectiveDateHint,
    }),
  },
  schema: {
    type: 'object',
    required: [
      'applicantMedicarePartBCarrier',
      'applicantMedicarePartBEffectiveDate',
    ],
    properties: {
      titleSchema,
      applicantMedicarePartBCarrier: textSchema,
      applicantMedicarePartBEffectiveDate: currentOrPastDateSchema,
    },
  },
};

export const applicantMedicareABUploadSchema = {
  uiSchema: {
    ...titleUI(
      'Upload Medicare card for hospital and medical coverage',
      ({ formData }) => {
        const appName = nameWording(formData, undefined, undefined, true);
        return (
          <>
            You’ll need to submit a copy of the front and back of {appName}{' '}
            Medicare card for hospital and medical coverage.
            <br />
            <br />
            Upload a copy of one of these documents:
            <ul>
              <li>
                Medicare Parts A and B card, <b>or</b>
              </li>
              <li>
                Medicare Advantage card, <b>or</b>
              </li>
              <li>Medicare PACE card</li>
            </ul>
            You can also upload any other supporting documents you may have for
            this Medicare plan.
            <br />
            <br />
            If you don’t have a copy to upload now, you can send it by mail or
            fax.
          </>
        );
      },
    ),
    ...fileUploadBlurb,
    applicantMedicarePartAPartBCard: fileUploadUI({
      label: 'Upload Medicare card',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      titleSchema,
      'view:fileUploadBlurb': blankSchema,
      applicantMedicarePartAPartBCard: fileWithMetadataSchema([
        'Front of Medicare card',
        'Back of Medicare card',
        'Other supporting document',
      ]),
    },
  },
};

export const applicantHasMedicareDSchema = {
  uiSchema: {
    ...titleUI(
      ({ formData }) =>
        `${nameWording(
          formData,
          undefined,
          undefined,
          true,
        )} Medicare Part D status`,
    ),
    applicantMedicareStatusD: {
      ...yesNoUI({
        updateUiSchema: formData => {
          return {
            'ui:title': `Does ${nameWording(
              formData,
              false,
              undefined,
              true,
            )} need to provide or update Medicare Part D coverage?`,
            'ui:options': { hint: additionalFilesHint },
          };
        },
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['applicantMedicareStatusD'],
    properties: {
      applicantMedicareStatusD: yesNoSchema,
    },
  },
};

export const applicantMedicarePartDCarrierSchema = {
  uiSchema: {
    ...titleUI(
      ({ formData }) => `${nameWording(formData)} Medicare Part D carrier`,
    ),
    applicantMedicarePartDCarrier: textUI({
      title: 'Name of insurance carrier',
      hint: 'Your insurance carrier is your insurance company.',
    }),
    applicantMedicarePartDEffectiveDate: currentOrPastDateUI({
      title: 'Medicare Part D effective date',
      hint: effectiveDateHint,
    }),
  },
  schema: {
    type: 'object',
    required: [
      'applicantMedicarePartDCarrier',
      'applicantMedicarePartDEffectiveDate',
    ],
    properties: {
      titleSchema,
      applicantMedicarePartDCarrier: textSchema,
      applicantMedicarePartDEffectiveDate: currentOrPastDateSchema,
    },
  },
};

export const applicantMedicareDUploadSchema = {
  uiSchema: {
    ...titleUI('Upload Medicare Part D card', ({ formData }) => {
      const appName = nameWording(formData, undefined, undefined, true);
      return (
        <>
          You’ll need to submit a copy of the front and back of {appName}{' '}
          Medicare Part D card.
          <br />
          <br />
          You can also upload any other supporting documents you may have for
          this Medicare plan.
          <br />
          <br />
          If you don’t have a copy to upload now, you can send it by mail or
          fax.
        </>
      );
    }),
    ...fileUploadBlurb,
    applicantMedicarePartDCard: fileUploadUI({
      label: 'Upload Medicare Part D card',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      titleSchema,
      'view:fileUploadBlurb': blankSchema,
      applicantMedicarePartDCard: fileWithMetadataSchema([
        'Front of Medicare Part D card',
        'Back of Medicare Part D card',
        'Other supporting document',
      ]),
    },
  },
};

export const applicantMedicareAdditionalCommentsSchema = {
  uiSchema: {
    ...titleUI(
      ({ formData }) =>
        `${nameWording(
          formData,
          undefined,
          undefined,
          true,
        )} Medicare additional comments`,
    ),
    applicantMedicareAdditionalComments: {
      'ui:title': 'Any additional comments about this Medicare plan?',
      'ui:webComponentField': VaTextareaField,
    },
  },
  schema: {
    type: 'object',
    properties: {
      titleSchema,
      applicantMedicareAdditionalComments: { type: 'string' },
    },
  },
};
