import {
  evidenceUploadIntroTitle,
  evidenceUploadIntroDescription,
  evidenceUploadIntroLabel,
} from '../content/evidenceIntro';

const contactInfo = {
  uiSchema: {
    'ui:title': evidenceUploadIntroTitle,
    'ui:description': evidenceUploadIntroDescription,
    'ui:options': {
      forceDivWrapper: true,
      showFieldLabel: 'no-wrap', // new option
      hideDuplicateDescription: true, // new option
    },
    'view:additionalEvidence': {
      'ui:title': evidenceUploadIntroLabel,
      'ui:widget': 'yesNo',
      'ui:options': {
        labels: {
          N: 'No, I’ll submit it later.',
        },
        enableAnalytics: true,
        classNames: 'vads-u-margin-top--0',
        widgetProps: {
          // ID from evidenceUploadIntroDescription
          Y: { 'aria-describedby': 'additional-evidence-description' },
          N: { 'aria-describedby': 'additional-evidence-description' },
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

  review: data => ({
    'Evidence submission': data['view:additionalEvidence']
      ? 'Yes'
      : 'No, I’ll submit it later',
  }),
};

export default contactInfo;
