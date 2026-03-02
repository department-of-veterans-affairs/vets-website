import {
  descriptionUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  ProviderDocsDescription,
  SupportingDocsDescription,
  VeteranDocsDescription,
} from '../../components/FormDescriptions/SupportingDocsDescriptions';
import { attachmentSchema, attachmentUI } from '../../definitions';

const TITLE_TEXT = 'Upload billing statements and supporting documents';
const INPUT_LABEL = 'Upload supporting document(s)';

export default role => {
  const description =
    role === 'veteran' ? VeteranDocsDescription : ProviderDocsDescription;
  return {
    uiSchema: {
      ...titleUI(TITLE_TEXT, description),
      ...descriptionUI(SupportingDocsDescription),
      supportingDocs: attachmentUI({ label: INPUT_LABEL }),
    },
    schema: {
      type: 'object',
      required: ['supportingDocs'],
      properties: {
        supportingDocs: attachmentSchema,
      },
    },
  };
};
