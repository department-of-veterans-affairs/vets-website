import environment from '~/platform/utilities/environment';
import fileUiSchema from '~/platform/forms-system/src/js/definitions/file';
import VaSelectField from '~/platform/forms-system/src/js/web-component-fields/VaSelectField';

import { EVIDENCE_UPLOAD_API } from '../constants';

import {
  MAX_FILE_SIZE_MB,
  MAX_FILE_SIZE_BYTES,
  SUPPORTED_UPLOAD_TYPES,
} from '../../../shared/constants';

import FileField from '../../../shared/components/FileField';
import { createPayload, parseResponse } from '../../../shared/utils/upload';

export const fileUploadUi = content => ({
  ...fileUiSchema(content.label, {
    itemDescription: content.description,
    fileUploadUrl: `${environment.API_URL}${EVIDENCE_UPLOAD_API}`,
    fileTypes: SUPPORTED_UPLOAD_TYPES,
    maxSize: MAX_FILE_SIZE_BYTES,
    maxSizeText: `${MAX_FILE_SIZE_MB}MB`,
    minSize: 1024,
    createPayload,
    parseResponse,
    attachmentSchema: ({ fileName }) => ({
      'ui:title': 'Document type',
      'ui:disabled': false,
      'ui:webComponentField': VaSelectField,
      'ui:options': {
        messageAriaDescribedby: `Choose a document type for ${fileName}`,
      },
    }),
    hideLabelText: !content.label,
    hideOnReview: true,
    attachmentName: false,
  }),
  'ui:field': FileField,
  'ui:description': content.description,
});
