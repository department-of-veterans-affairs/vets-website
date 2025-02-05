import environment from '~/platform/utilities/environment';
import fileUiSchema from '~/platform/forms-system/src/js/definitions/file';
import {
  EvidenceUploadLabel,
  EvidenceUploadDescription,
} from '../content/EvidenceUpload';

import {
  NEW_API,
  EVIDENCE_UPLOAD_API,
  EVIDENCE_UPLOAD_API_NEW,
} from '../constants/apis';

import {
  SUPPORTED_UPLOAD_TYPES,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
} from '../../shared/constants';
import FileField from '../../shared/components/FileField';
import { createPayload, parseResponse } from '../../shared/utils/upload';

export const evidenceUploadUI = {
  ...fileUiSchema(EvidenceUploadLabel, {
    fileUploadUrl: `${environment.API_URL}${EVIDENCE_UPLOAD_API}`,
    fileTypes: SUPPORTED_UPLOAD_TYPES,
    maxSize: MAX_FILE_SIZE_BYTES,
    maxSizeText: `${MAX_FILE_SIZE_MB}MB`,
    minSize: 1024,
    createPayload,
    parseResponse,
    showFieldLabel: true,
    keepInPageOnReview: true,
    attachmentName: false,
    classNames: '',
    updateUiSchema: formData => ({
      'ui:options': {
        fileUploadUrl: `${environment.API_URL}${
          formData[NEW_API] ? EVIDENCE_UPLOAD_API_NEW : EVIDENCE_UPLOAD_API
        }`,
      },
    }),
  }),
  'ui:field': FileField,
  'ui:description': EvidenceUploadDescription,
};
