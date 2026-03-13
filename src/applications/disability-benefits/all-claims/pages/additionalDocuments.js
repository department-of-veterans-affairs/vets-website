import React from 'react';
import full526EZSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

import { UploadDescription } from '../content/fileUploadDescriptions';
import { ancillaryFormUploadUi } from '../utils/schemas';
import { selfAssessmentAlert } from '../content/selfAssessmentAlert';
import { isBDD } from '../utils';

const { attachments } = full526EZSchema.properties;

const shouldShowSelfAssessmentAlert = formData =>
  isBDD(formData) && !formData.disability526NewBddShaEnforcementWorkflowEnabled;

export const uiSchema = {
  // A separate view is added for the title because the file upload component co-opts the ui:title for the
  // required field * label.
  'view:additionalDocumentsTitle': {
    'ui:title': () => (
      <h3 className="vads-u-margin--0">
        Upload supporting statements or other evidence
      </h3>
    ),
  },
  'view:selfAssessmentAlert': {
    'ui:title': selfAssessmentAlert,
    'ui:options': {
      hideIf: formData => !shouldShowSelfAssessmentAlert(formData),
    },
  },
  additionalDocuments: {
    ...ancillaryFormUploadUi(
      'Supporting (lay) statements or other evidence',
      'Adding additional evidence:',
      {
        addAnotherLabel: 'Add another file',
        buttonText: 'Upload file',
      },
    ),
    'ui:description': UploadDescription,
    'ui:confirmationField': ({ formData }) => ({
      data: formData?.map(item => item.name || item.fileName),
      label: 'Uploaded file(s)',
    }),
  },
};

export const schema = {
  type: 'object',
  required: ['additionalDocuments'],
  properties: {
    'view:additionalDocumentsTitle': {
      type: 'object',
      properties: {},
    },
    'view:selfAssessmentAlert': {
      type: 'object',
      properties: {},
    },
    additionalDocuments: attachments,
  },
};
