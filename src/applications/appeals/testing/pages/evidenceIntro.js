import { yesNoUI } from 'platform/forms-system/src/js/web-component-patterns';

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
    },
    'view:additionalEvidence': yesNoUI({
      title: evidenceUploadIntroLabel,
      enableAnalytics: true,
      labelHeaderLevel: '2',
      uswds: true,
      labels: {
        N: 'No, I’ll submit it later.',
      },
    }),
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
