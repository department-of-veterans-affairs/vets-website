import {
  descriptionUI,
  radioSchema,
  radioUI,
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import MedicalClaimsDescription from '../components/FormDescriptions/MedicalClaimsDescription';
import MedicalEobDescription from '../components/FormDescriptions/MedicalEobDescription';
import PharmacyClaimsDescription from '../components/FormDescriptions/PharmacyClaimsDescription';
import {
  attachmentRequiredSchema,
  attachmentUI,
  llmResponseAlertSchema,
  llmResponseAlertUI,
  llmUploadAlertSchema,
  llmUploadAlertUI,
} from '../definitions';
import content from '../locales/en/content.json';

export const claimTypeSchema = {
  uiSchema: {
    ...titleUI('Claim type'),
    claimType: radioUI({
      title: 'What type of claim are you submitting?',
      labels: {
        medical: 'I’m submitting a claim for medical care from a provider',
        pharmacy: 'I’m submitting a claim for prescription medications',
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['claimType'],
    properties: {
      claimType: radioSchema(['medical', 'pharmacy']),
    },
  },
};

export const claimWorkSchema = {
  uiSchema: {
    ...titleUI(content['claim--work-title']),
    claimIsWorkRelated: yesNoUI({
      title: content['claim--work-label'],
      hint: content['claim--work-hint'],
    }),
  },
  schema: {
    type: 'object',
    required: ['claimIsWorkRelated'],
    properties: {
      claimIsWorkRelated: yesNoSchema,
    },
  },
};

export const claimAutoSchema = {
  uiSchema: {
    ...titleUI(content['claim--auto-title']),
    claimIsAutoRelated: yesNoUI({
      title: content['claim--auto-label'],
      hint: content['claim--auto-hint'],
    }),
  },
  schema: {
    type: 'object',
    required: ['claimIsAutoRelated'],
    properties: {
      claimIsAutoRelated: yesNoSchema,
    },
  },
};

export const medicalClaimUploadSchema = {
  uiSchema: {
    ...titleUI(content['claim--medical-title']),
    ...descriptionUI(MedicalClaimsDescription),
    ...llmUploadAlertUI,
    medicalUpload: attachmentUI({
      label: content['claim--medical-title'],
      attachmentId: 'medical invoice',
    }),
    ...llmResponseAlertUI,
  },
  schema: {
    type: 'object',
    required: ['medicalUpload'],
    properties: {
      ...llmUploadAlertSchema,
      medicalUpload: attachmentRequiredSchema,
      ...llmResponseAlertSchema,
    },
  },
};

export const eobUploadSchema = isPrimary => {
  const keyName = isPrimary ? 'primaryEob' : 'secondaryEob';
  return {
    uiSchema: {
      ...titleUI(({ formData }) => {
        // If `isPrimary`, show first health insurance co. name. Else, show 2nd.
        return `${content['claim--eob-title']} ${
          formData?.policies?.[isPrimary ? 0 : 1]?.name
        }`;
      }),
      ...descriptionUI(MedicalEobDescription),
      ...llmUploadAlertUI,
      [keyName]: attachmentUI({
        label: content['claim--eob-label'],
        attachmentId: 'EOB',
      }),
      ...llmResponseAlertUI,
    },
    schema: {
      type: 'object',
      required: [keyName],
      properties: {
        ...llmUploadAlertSchema,
        [keyName]: attachmentRequiredSchema,
        ...llmResponseAlertSchema,
      },
    },
  };
};

export const pharmacyClaimUploadSchema = {
  uiSchema: {
    ...titleUI(content['claim--prescription-title']),
    ...descriptionUI(PharmacyClaimsDescription),
    ...llmUploadAlertUI,
    pharmacyUpload: attachmentUI({
      label: content['claim--prescription-label'],
      attachmentId: 'pharmacy invoice',
    }),
    ...llmResponseAlertUI,
  },
  schema: {
    type: 'object',
    required: ['pharmacyUpload'],
    properties: {
      ...llmUploadAlertSchema,
      pharmacyUpload: attachmentRequiredSchema,
      ...llmResponseAlertSchema,
    },
  },
};
