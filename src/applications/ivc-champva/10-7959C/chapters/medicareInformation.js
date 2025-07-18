import React from 'react';
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
import {
  nameWording,
  privWrapper,
  PrivWrappedReview,
} from '../../shared/utilities';
import {
  fileUploadUi as fileUploadUI,
  singleFileSchema,
} from '../../shared/components/fileUploads/upload';
import { fileUploadBlurb } from '../../shared/components/fileUploads/attachments';
import { ADDITIONAL_FILES_HINT } from '../../shared/constants';
import { validFieldCharsOnly } from '../../shared/validations';

const effectiveDateHint =
  'You may find your effective date on the front of your Medicare card near "Coverage starts" or "Effective date."';

export const blankSchema = { type: 'object', properties: {} };

export const applicantHasMedicareSchema = {
  uiSchema: {
    ...titleUI(({ formData }) =>
      privWrapper(
        `${nameWording(formData, undefined, undefined, true)} Medicare status`,
      ),
    ),
    applicantMedicareStatus: {
      ...yesNoUI({
        updateUiSchema: formData => {
          return {
            'ui:title': `${
              formData.certifierRole === 'applicant' ? 'Do' : 'Does'
            } ${nameWording(
              formData,
              false,
              false,
              true,
            )} have Medicare information to provide or update at this time?`,
            'ui:options': {
              classNames: ['dd-privacy-hidden'],
              hint: ADDITIONAL_FILES_HINT,
            },
          };
        },
      }),
    },
    'ui:options': { itemAriaLabel: () => 'Medicare status' },
    'ui:objectViewField': props => PrivWrappedReview(props),
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
    ...titleUI(({ formData }) =>
      privWrapper(
        `${nameWording(
          formData,
          undefined,
          undefined,
          true,
        )} Medicare coverage`,
      ),
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
            'ui:title': `Which Medicare plan ${
              formData.certifierRole === 'applicant' ? 'are' : 'is'
            } ${nameWording(formData, false, false, true)} enrolled in?`,
            'ui:options': {
              classNames: ['dd-privacy-hidden'],
              hint:
                'You can find this information on the front of your Medicare card.',
            },
          };
        },
      }),
    },
    'ui:options': { itemAriaLabel: () => 'Medicare coverage' },
    'ui:objectViewField': props => PrivWrappedReview(props),
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
    ...titleUI(({ formData }) =>
      privWrapper(
        `${nameWording(
          formData,
          undefined,
          undefined,
          true,
        )} Medicare pharmacy benefits`,
      ),
    ),
    applicantMedicarePharmacyBenefits: {
      ...yesNoUI({
        updateUiSchema: formData => {
          return {
            'ui:title': `Does ${nameWording(
              formData,
              undefined,
              false,
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
    'ui:options': {
      itemAriaLabel: () => 'Medicare pharmacy benefits',
      classNames: ['dd-privacy-hidden'],
    },
    'ui:objectViewField': props => PrivWrappedReview(props),
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
    ...titleUI(({ formData }) =>
      privWrapper(
        `${nameWording(
          formData,
          undefined,
          undefined,
          true,
        )} Medicare Part A carrier`,
      ),
    ),
    applicantMedicarePartACarrier: textUI({
      title: 'Name of insurance carrier',
      hint:
        'Your insurance carrier may be listed as "Medicare Health Insurance" on your insurance card.',
    }),
    applicantMedicarePartAEffectiveDate: currentOrPastDateUI({
      title: 'Medicare Part A effective date',
      hint: effectiveDateHint,
    }),
    'ui:validations': [
      (errors, formData) =>
        validFieldCharsOnly(
          errors,
          null,
          formData,
          'applicantMedicarePartACarrier',
        ),
    ],
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
    ...titleUI(({ formData }) =>
      privWrapper(
        `${nameWording(
          formData,
          undefined,
          undefined,
          true,
        )} Medicare Part B carrier`,
      ),
    ),
    applicantMedicarePartBCarrier: textUI({
      title: 'Name of insurance carrier',
      hint:
        'Your insurance carrier may be listed as "Medicare Health Insurance" on your insurance card.',
    }),
    applicantMedicarePartBEffectiveDate: currentOrPastDateUI({
      title: 'Medicare Part B effective date',
      hint: effectiveDateHint,
    }),
    'ui:validations': [
      (errors, formData) =>
        validFieldCharsOnly(
          errors,
          null,
          formData,
          'applicantMedicarePartBCarrier',
        ),
    ],
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
        const appName = nameWording(formData, undefined, false, true);
        return (
          <>
            You’ll need to submit a copy of the front and back of{' '}
            {privWrapper(appName)} Medicare card for hospital and medical
            coverage.
            <br />
            <br />
            Upload a copy of one of these documents:
            <ul>
              <li>Medicare Parts A and B card, or</li>
              <li>Medicare Advantage card, or</li>
              <li>Medicare PACE card</li>
            </ul>
            If you don’t have a copy to upload now, you can send it by mail or
            fax.
          </>
        );
      },
    ),
    ...fileUploadBlurb,
    applicantMedicarePartAPartBCardFront: fileUploadUI({
      label: 'Upload front of Medicare card',
      attachmentId: 'Front of Medicare card', // used behind the scenes
    }),
    applicantMedicarePartAPartBCardBack: fileUploadUI({
      label: 'Upload back of Medicare card',
      attachmentId: 'Back of Medicare card', // used behind the scenes
    }),
  },
  schema: {
    type: 'object',
    properties: {
      titleSchema,
      'view:fileUploadBlurb': blankSchema,
      applicantMedicarePartAPartBCardFront: singleFileSchema,
      applicantMedicarePartAPartBCardBack: singleFileSchema,
    },
  },
};

export const applicantHasMedicareDSchema = {
  uiSchema: {
    ...titleUI(({ formData }) =>
      privWrapper(
        `${nameWording(
          formData,
          undefined,
          undefined,
          true,
        )} Medicare Part D status`,
      ),
    ),
    applicantMedicareStatusD: {
      ...yesNoUI({
        updateUiSchema: formData => {
          return {
            'ui:title': `${
              formData.certifierRole === 'applicant' ? 'Do' : 'Does'
            } ${nameWording(
              formData,
              false,
              false,
              true,
            )} have Medicare Part D information to provide or update at this time?`,
            'ui:options': {
              classNames: ['dd-privacy-hidden'],
              hint: ADDITIONAL_FILES_HINT,
            },
          };
        },
      }),
    },
    'ui:options': { itemAriaLabel: () => 'Medicare part D status' },
    'ui:objectViewField': props => PrivWrappedReview(props),
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
    ...titleUI(({ formData }) =>
      privWrapper(`${nameWording(formData)} Medicare Part D carrier`),
    ),
    applicantMedicarePartDCarrier: textUI({
      title: 'Name of insurance carrier',
      hint: 'Your insurance carrier is your insurance company.',
    }),
    applicantMedicarePartDEffectiveDate: currentOrPastDateUI({
      title: 'Medicare Part D effective date',
      hint: effectiveDateHint,
    }),
    'ui:validations': [
      (errors, formData) =>
        validFieldCharsOnly(
          errors,
          null,
          formData,
          'applicantMedicarePartDCarrier',
        ),
    ],
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
      const appName = nameWording(formData, undefined, false, true);
      return (
        <>
          You’ll need to submit a copy of the front and back of{' '}
          {privWrapper(appName)} Medicare Part D card.
          <br />
          <br />
          If you don’t have a copy to upload now, you can send it by mail or
          fax.
        </>
      );
    }),
    ...fileUploadBlurb,
    applicantMedicarePartDCardFront: fileUploadUI({
      label: 'Upload front of Medicare Part D card',
      attachmentId: 'Front of Medicare Part D card', // used behind the scenes
    }),
    applicantMedicarePartDCardBack: fileUploadUI({
      label: 'Upload back of Medicare Part D card',
      attachmentId: 'Back of Medicare Part D card', // used behind the scenes
    }),
  },
  schema: {
    type: 'object',
    properties: {
      titleSchema,
      'view:fileUploadBlurb': blankSchema,
      applicantMedicarePartDCardFront: singleFileSchema,
      applicantMedicarePartDCardBack: singleFileSchema,
    },
  },
};
