import { standardTitle } from '../../../content/form0781';
import {
  pmrTitle,
  pmrDescription,
} from '../../../content/form0781/supportingEvidenceEnhancement/privateMedicalRecordsUpload';
import {
  uiSchema as legacyUiSchema,
  schema as legacySchema,
} from '../../privateMedicalRecordsAttachments';

export const uiSchema = {
  'ui:title': standardTitle(pmrTitle),
  'ui:description': pmrDescription,
  privateMedicalRecordAttachments:
    legacyUiSchema.privateMedicalRecordAttachments,
};

export { legacySchema as schema };
