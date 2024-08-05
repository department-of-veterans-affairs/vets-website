import {
  titleUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import fileUploadUI from 'platform/forms-system/src/js/definitions/file';
import environment from 'platform/utilities/environment';
import {
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE_BYTES,
} from '../../../utils/constants';
import {
  createPayload,
  parseResponse,
} from '../../../utils/helpers/form-config';
import CheckUploadWarning from '../../../components/FormAlerts/CheckUploadWarning';
import SupportingDocumentDescription from '../../../components/FormDescriptions/SupportingDocumentDescription';
import { emptySchema } from '../../../definitions/sharedSchema';
import { hideUploadWarningAlert } from '../../../utils/helpers';
import content from '../../../locales/en/content.json';

const uploadPoaDocument = {
  uiSchema: {
    ...titleUI(
      content['sign-as-rep-title--upload'],
      content['sign-as-rep-document-description'],
    ),
    ...descriptionUI(SupportingDocumentDescription),
    'view:uploadSuccessAlert': {
      'ui:description': CheckUploadWarning,
      'ui:options': {
        hideIf: hideUploadWarningAlert,
      },
    },
    signAsRepresentativeDocumentUpload: fileUploadUI(
      content['upload-doc-label'],
      {
        buttonText: content['button-upload'],
        classNames: 'poa-document-upload vads-u-margin-top--2',
        fileUploadUrl: `${environment.API_URL}/v0/form1010cg/attachments`,
        fileTypes: ALLOWED_FILE_TYPES,
        maxSize: MAX_FILE_SIZE_BYTES,
        hideLabelText: false,
        multiple: false,
        createPayload,
        parseResponse,
      },
    ),
  },
  schema: {
    type: 'object',
    required: ['signAsRepresentativeDocumentUpload'],
    properties: {
      'view:uploadSuccessAlert': emptySchema,
      signAsRepresentativeDocumentUpload: {
        type: 'array',
        minItems: 1,
        maxItems: 1,
        items: {
          type: 'object',
          required: ['guid', 'name'],
          properties: {
            guid: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
            },
          },
        },
      },
    },
  },
};

export default uploadPoaDocument;
