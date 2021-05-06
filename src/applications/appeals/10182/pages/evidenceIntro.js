import {
  evidenceUploadIntroTitle,
  evidenceUploadIntroDescription,
  evidenceUploadIntroLabel,
} from '../content/evidenceIntro';

const contactInfo = {
  uiSchema: {
    'ui:title': evidenceUploadIntroTitle,
    'ui:description': evidenceUploadIntroDescription,
    'view:additionalEvidence': {
      'ui:title': evidenceUploadIntroLabel,
      'ui:widget': 'yesNo',
      'ui:options': {
        labels: {
          N: 'No, I’ll submit it later.',
        },
      },
    },
  },

  schema: {
    type: 'object',
    properties: {
      'view:additionalEvidence': {
        type: 'boolean',
      },
    },
  },
};

export default contactInfo;
