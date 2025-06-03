import { summaryOfEvidenceDescription } from '../content/summaryOfEvidence';
import { standardTitle } from '../content/form0781';

export const uiSchema = {
  'ui:title': standardTitle('Summary of evidence'),
  'ui:description': summaryOfEvidenceDescription,
};

export const schema = {
  type: 'object',
  properties: {},
};
