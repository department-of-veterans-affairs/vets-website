import React from 'react';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import {
  titleUI,
  titleSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { requiredFiles } from '../config/constants';
import { isRequiredFile, nameWording } from '../helpers/utilities';
import { fileUploadUi as fileUploadUI } from '../../shared/components/fileUploads/upload';
import {
  fileWithMetadataSchema,
  fileUploadBlurb,
} from '../../shared/components/fileUploads/attachments';

// TODO put in /shared
const additionalFilesHint =
  'Depending on your response, you may need to submit additional documents with this application.';

export const blankSchema = { type: 'object', properties: {} };

export const applicantHasMedicareABSchema = {
  uiSchema: {
    ...titleUI(({ formData }) => `${nameWording(formData)} Medicare status`),
    applicantMedicareStatus: {
      ...yesNoUI({
        updateUiSchema: formData => {
          let title = 'Do you have Medicare Parts A & B to add or update?';
          if (formData?.certifierRole !== 'applicant') {
            title = `Does ${nameWording(
              formData,
              false,
            )} have Medicare Parts A & B to add or update?`;
          }
          return {
            'ui:title': title,
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

export const applicantMedicarePartACarrierSchema = {
  uiSchema: {
    ...titleUI(
      ({ formData }) => `${nameWording(formData)} Medicare Part A carrier`,
    ),
    applicantMedicarePartACarrier: {
      'ui:title': 'Carrier’s name',
      'ui:webComponentField': VaTextInputField,
    },
    applicantMedicarePartAEffectiveDate: currentOrPastDateUI(
      'Medicare Part A effective date',
    ),
  },
  schema: {
    type: 'object',
    required: [
      'applicantMedicarePartACarrier',
      'applicantMedicarePartAEffectiveDate',
    ],
    properties: {
      titleSchema,
      applicantMedicarePartACarrier: { type: 'string' },
      applicantMedicarePartAEffectiveDate: currentOrPastDateSchema,
    },
  },
};

export const applicantMedicarePartBCarrierSchema = {
  uiSchema: {
    ...titleUI(
      ({ formData }) => `${nameWording(formData)} Medicare Part B carrier`,
    ),
    applicantMedicarePartBCarrier: {
      'ui:title': 'Carrier’s name',
      'ui:webComponentField': VaTextInputField,
    },
    applicantMedicarePartBEffectiveDate: currentOrPastDateUI(
      'Medicare Part B effective date',
    ),
  },
  schema: {
    type: 'object',
    required: [
      'applicantMedicarePartBCarrier',
      'applicantMedicarePartBEffectiveDate',
    ],
    properties: {
      titleSchema,
      applicantMedicarePartBCarrier: { type: 'string' },
      applicantMedicarePartBEffectiveDate: currentOrPastDateSchema,
    },
  },
};

export const applicantMedicarePharmacySchema = {
  uiSchema: {
    ...titleUI(
      ({ formData }) => `${nameWording(formData)} Medicare pharmacy benefits`,
    ),
    applicantMedicarePharmacyBenefits: {
      ...yesNoUI({
        updateUiSchema: formData => {
          const useFirstPerson = formData?.certifierRole === 'applicant';
          return {
            'ui:title': `${
              useFirstPerson ? 'Do your' : `Does ${nameWording(formData)}`
            } Medicare parts A & B provide pharmacy benefits?`,
            'ui:options': {
              hint:
                'You can find this information ont he front of your Medicare card.',
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

export const applicantMedicareAdvantageSchema = {
  uiSchema: {
    ...titleUI(({ formData }) => `${nameWording(formData)} Medicare coverage`),
    applicantMedicareAdvantage: {
      ...yesNoUI({
        updateUiSchema: formData => {
          return {
            'ui:title': `Did ${nameWording(
              formData,
              false,
              false,
            )} choose the advantage plan for coverage?`,
            'ui:options': {
              hint:
                'You can find this information ont he front of your Medicare card.',
            },
          };
        },
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['applicantMedicareAdvantage'],
    properties: {
      applicantMedicareAdvantage: yesNoSchema,
    },
  },
};

export const applicantMedicareABUploadSchema = {
  uiSchema: {
    ...titleUI(
      ({ _formData, formContext }) =>
        `Upload Medicare card ${isRequiredFile(formContext, requiredFiles)}`,
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
        'Front of Medicare Parts A or B card',
        'Back of Medicare Parts A or B card',
      ]),
    },
  },
};

export const applicantHasMedicareDSchema = {
  uiSchema: {
    ...titleUI(({ formData }) => `${nameWording(formData)} Medicare status`),
    applicantMedicareStatusD: {
      ...yesNoUI({
        updateUiSchema: formData => {
          let title = 'Are you enrolled in Medicare Part D?';
          if (formData?.certifierRole !== 'applicant') {
            title = `Is ${nameWording(
              formData,
              false,
            )} enrolled in Medicare Part D?`;
          }
          return {
            'ui:title': title,
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
    applicantMedicarePartDCarrier: {
      'ui:title': 'Carrier’s name',
      'ui:webComponentField': VaTextInputField,
    },
    applicantMedicarePartDEffectiveDate: currentOrPastDateUI(
      'Medicare Part D effective date',
    ),
  },
  schema: {
    type: 'object',
    required: [
      'applicantMedicarePartDCarrier',
      'applicantMedicarePartDEffectiveDate',
    ],
    properties: {
      titleSchema,
      applicantMedicarePartDCarrier: { type: 'string' },
      applicantMedicarePartDEffectiveDate: currentOrPastDateSchema,
    },
  },
};

export const applicantMedicareDUploadSchema = {
  uiSchema: {
    ...titleUI(
      ({ _formData, formContext }) =>
        `Upload Medicare card ${isRequiredFile(formContext, requiredFiles)}`,
      ({ formData }) => {
        const appName = nameWording(formData);
        return (
          <>
            You’ll need to submit a copy of the front and back of {appName}{' '}
            Medicare Part D card.
            <br />
            If you don’t have a copy to upload now, you can send it by mail or
            fax
          </>
        );
      },
    ),
    ...fileUploadBlurb,
    applicantMedicarePartDCard: fileUploadUI({
      label: 'Upload Medicare card',
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
      ]),
    },
  },
};
