import { fileInputMultipleSchema } from '~/platform/forms-system/src/js/web-component-patterns';
import { burialUploadUI } from '../../../utils/upload';
import { validateFileUploads } from '../../../utils/validation';
import DeathCertificateUploadMessage from '../../../components/DeathCertificateUploadMessage';
import { generateTitle } from '../../../utils/helpers';

export default {
  uiSchema: {
    'ui:title': generateTitle('Death certificate'),
    'ui:description': DeathCertificateUploadMessage,
    deathCertificate: {
      ...burialUploadUI({
        title: 'Upload the Veteran’s death certificate',
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
      'ui:validations': [validateFileUploads()],
      // Empty items object required for confirmation page
      items: {},
    },
  },
  schema: {
    type: 'object',
    properties: {
      deathCertificate: fileInputMultipleSchema(),
    },
  },
};
