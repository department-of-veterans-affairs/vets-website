/**
 * @file V1 fallback for the private medical records upload page.
 *
 * Uses the legacy FileField upload component instead of `va-file-input-multiple`.
 * Shown when the evidence enhancement toggle is ON but the FileInputV3 toggle
 * is OFF. Once FileInputV3 is fully rolled out, this page can be removed.
 */
import { standardTitle } from '../../../content/form0781';
import {
  pmrTitle,
  pmrDescription,
} from '../../../content/form0781/supportingEvidenceEnhancement/privateMedicalRecordsUpload';
import {
  uiSchema as legacyUiSchema,
  schema as legacySchema,
} from '../../privateMedicalRecordsAttachments';

/** @type {import('@rjsf/core').UiSchema} */
export const uiSchema = {
  'ui:title': standardTitle(pmrTitle),
  'ui:description': pmrDescription,
  privateMedicalRecordAttachments:
    legacyUiSchema.privateMedicalRecordAttachments,
};

export { legacySchema as schema };
