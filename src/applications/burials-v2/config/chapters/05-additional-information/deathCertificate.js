import React from 'react';
import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';
import DeathCertificateUploadMessage from '../../../components/DeathCertificateUploadMessage';
import { generateTitle } from '../../../utils/helpers';
import { burialUploadUI } from '../../../utils/upload';

const { files } = fullSchemaBurials.definitions;

export default {
  uiSchema: {
    'ui:title': generateTitle('Death certificate'),
    'ui:description': ({ formData }) => (
      <DeathCertificateUploadMessage form={formData} />
    ),
    deathCertificate: {
      ...burialUploadUI('Upload the Veteran’s death certificate'),
      'ui:required': form =>
        form?.burialAllowanceRequested?.service === true ||
        form?.locationOfDeath?.location === 'vaMedicalCenter',
    },
  },
  schema: {
    type: 'object',
    properties: {
      deathCertificate: {
        ...files,
        min: 1,
      },
    },
  },
};
