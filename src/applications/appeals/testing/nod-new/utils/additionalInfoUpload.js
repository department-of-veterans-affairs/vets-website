import environment from 'platform/utilities/environment';
import fileUiSchema from 'platform/forms-system/src/js/definitions/file';
import { focusElement } from 'platform/utilities/ui';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';

import {
  SUPPORTED_UPLOAD_TYPES,
  MAX_FILE_SIZE_BYTES,
} from '../../../shared/constants';

import {
  AdditionalInfoUploadLabel,
  AdditionalInfoUploadDescription,
} from '../content/additionalInfoUpload';

import { createPayload } from '../../../shared/utils/upload';

const focusFileCard = name => {
  const target = $$('.schemaform-file-list li').find(entry =>
    entry.textContent?.trim().includes(name),
  );
  if (target) {
    focusElement(target);
  }
};

export const additionalInfoUploadUI = {
  ...fileUiSchema(AdditionalInfoUploadLabel, {
    fileUploadUrl: `${environment.API_URL}/v0/decision_review_evidence`,
    addAnotherLabel: 'Add another document',
    buttonText: 'Upload document',
    fileTypes: SUPPORTED_UPLOAD_TYPES,
    maxSize: MAX_FILE_SIZE_BYTES,
    minSize: 1024,
    createPayload,
    parseResponse: (response, { name }) => {
      setTimeout(() => {
        focusFileCard(name);
      });
      return {
        name,
        confirmationCode: response.data.attributes.guid,
      };
    },
    classNames: '',
    attachmentName: false,
    uswds: true,
  }),
  'ui:description': AdditionalInfoUploadDescription,
};
