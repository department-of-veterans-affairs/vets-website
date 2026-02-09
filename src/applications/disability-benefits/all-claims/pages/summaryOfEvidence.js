import { summaryOfEvidenceDescription } from '../content/summaryOfEvidence';
import { standardTitle } from '../content/form0781';

export const uiSchema = {
  'ui:title': ({ formData }) => {
    return formData.disability526SupportingEvidenceEnhancement
      ? standardTitle(
          'Summary of supporting evidence for your disability claim',
        )
      : standardTitle('Summary of evidence');
  },
  'ui:description': summaryOfEvidenceDescription,
};

export const schema = {
  type: 'object',
  properties: {},
};
