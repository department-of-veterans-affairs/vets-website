/**
 * @file V1 fallback for the additional documents upload page.
 *
 * Uses the legacy FileField upload component instead of `va-file-input-multiple`.
 * Shown when the evidence enhancement toggle is ON but the FileInputV3 toggle
 * is OFF. Once FileInputV3 is fully rolled out, this page can be removed.
 */
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import {
  standardTitle,
  mentalHealthSupportAlert,
} from '../../../content/form0781';
import { additionalSupportAccordion } from '../../../content/supportingEvidenceOrientation';
import {
  evidenceChoiceAdditionalDocumentsTitle,
  evidenceChoiceAdditionalDocuments,
} from '../../../content/form0781/supportingEvidenceEnhancement/evidenceChoiceAdditionalDocumentsPage';
import { uiSchema as legacyUiSchema } from '../../additionalDocuments';

const { attachments } = fullSchema.properties;

/** @type {import('@rjsf/core').UiSchema} */
export const uiSchema = {
  'ui:title': standardTitle(evidenceChoiceAdditionalDocumentsTitle),
  'ui:description': evidenceChoiceAdditionalDocuments,
  'ui:order': [
    'additionalDocuments',
    'view:additionalSupportAccordionV1',
    'view:mentalHealthSupportAlertV1',
  ],
  additionalDocuments: legacyUiSchema.additionalDocuments,
  'view:additionalSupportAccordionV1': {
    'ui:description': additionalSupportAccordion,
  },
  'view:mentalHealthSupportAlertV1': {
    'ui:description': mentalHealthSupportAlert,
  },
};

/** @type {import('@rjsf/core').JSONSchema7} */
export const schema = {
  type: 'object',
  required: ['additionalDocuments'],
  properties: {
    additionalDocuments: attachments,
    'view:additionalSupportAccordionV1': { type: 'object', properties: {} },
    'view:mentalHealthSupportAlertV1': { type: 'object', properties: {} },
  },
};
