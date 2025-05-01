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
      ...burialUploadUI('Upload the Veteran’s death certificate', {
        fileUploadNetworkErrorMessage:
          'We’re sorry. There was problem with our system and we couldn’t upload your file. You can try again later.',
        fileUploadNetworkErrorAlert: {
          header: 'We couldn’t upload your file',
          body: [
            'We’re sorry. There was a problem with our system and we couldn’t upload your file. Try uploading your file again.',
            'If there are still issues uploading your file, you can submit your documents and a PDF version of this form by mail.',
          ],
          formName: 'Application for Burial Benefits',
          formLink: 'https://www.va.gov/find-forms/about-form-21p-530ez/',
          formNumber: '21P-530EZ',
          showMailingAddress: true,
          hideAlertIfLoggedIn: true,
        },
      }),
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
