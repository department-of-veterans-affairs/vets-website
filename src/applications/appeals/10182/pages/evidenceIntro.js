import {
  yesNoSchema,
  yesNoUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

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
    'view:additionalEvidence': yesNoUI({
      title: evidenceUploadIntroLabel,
      enableAnalytics: true,
      labels: {
        Y: 'Yes',
        N: 'No, I’ll submit it later.',
      },
      uswds: true,
    }),
  },

  schema: {
    type: 'object',
    properties: {
      'view:additionalEvidence': yesNoSchema,
    },
  },
};

export default contactInfo;
