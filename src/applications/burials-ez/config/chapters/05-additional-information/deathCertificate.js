import fullSchemaBurials from 'vets-json-schema/dist/21P-530EZ-schema.json';
import DeathCertificateUploadMessage from '../../../components/DeathCertificateUploadMessage';
import { generateTitle } from '../../../utils/helpers';
import { burialUploadUI } from '../../../utils/upload';

const { files } = fullSchemaBurials.definitions;

export default {
  uiSchema: {
    'ui:title': generateTitle('Death certificate'),
    'ui:description': DeathCertificateUploadMessage,
    deathCertificate: {
      ...burialUploadUI('Upload the Veteran’s death certificate'),
      'ui:required': form => {
        const isClaimingBurialAllowance =
          form['view:claimedBenefits']?.burialAllowance;
        const serviceRequested =
          form.burialAllowanceRequested?.service === true;
        const locationIsVaMedicalCenter =
          form.locationOfDeath?.location === 'vaMedicalCenter';
        return !(
          isClaimingBurialAllowance &&
          serviceRequested &&
          locationIsVaMedicalCenter
        );
      },
      // Empty items object required for confirmation page
      items: {},
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
