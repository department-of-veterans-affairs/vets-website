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
      'ui:required': form => {
        const option1 = form?.burialAllowanceRequested?.service === true;
        const option2 = form?.locationOfDeath?.location !== 'vaMedicalCenter';
        const option3 = Boolean(
          form?.burialAllowanceRequested?.service === true &&
          form?.locationOfDeath?.location === 'vaMedicalCenter'
            ? 0
            : 1,
        );
        if (!option3) {
          return false;
        }
        return option1 || option2;
      },
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
