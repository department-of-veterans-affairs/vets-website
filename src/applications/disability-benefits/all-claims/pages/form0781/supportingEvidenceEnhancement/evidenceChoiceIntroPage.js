import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { titleWithTag, form0781HeadingTag } from '../../../content/form0781';
import {
  evidenceChoiceIntroTitle,
  evidenceChoiceIntroDescriptionContent,
} from '../../../content/form0781/supportingEvidenceEnhancement/evidenceChoiceIntroPage';

export const uiSchema = {
  'ui:title': titleWithTag(evidenceChoiceIntroTitle, form0781HeadingTag),
  'ui:description': evidenceChoiceIntroDescriptionContent,
  'view:hasEvidenceChoice': yesNoUI({
    title:
      'Are there any supporting documents or additional forms that you want us to review with your claim?',
  }),
};

export const schema = {
  type: 'object',
  required: ['view:hasEvidenceChoice'],
  properties: {
    'view:hasEvidenceChoice': yesNoSchema,
  },
};
