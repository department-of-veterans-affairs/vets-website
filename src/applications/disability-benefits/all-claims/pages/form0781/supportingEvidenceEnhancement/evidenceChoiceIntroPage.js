import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  standardTitle,
  mentalHealthSupportAlert,
} from '../../../content/form0781';
import {
  evidenceChoiceIntroTitle,
  evidenceChoiceIntroDescriptionContent,
  evidenceChoiceIntroQuestion,
} from '../../../content/form0781/supportingEvidenceEnhancement/evidenceChoiceIntroPage';

export const uiSchema = {
  'ui:title': standardTitle(evidenceChoiceIntroTitle),
  'ui:description': evidenceChoiceIntroDescriptionContent,
  'view:hasEvidenceChoice': yesNoUI({
    title: evidenceChoiceIntroQuestion,
  }),
  'view:mentalHealthSupportAlert': {
    'ui:description': mentalHealthSupportAlert,
  },
};

export const schema = {
  type: 'object',
  required: ['view:hasEvidenceChoice'],
  properties: {
    'view:hasEvidenceChoice': yesNoSchema,
    'view:mentalHealthSupportAlert': {
      type: 'object',
      properties: {},
    },
  },
};
