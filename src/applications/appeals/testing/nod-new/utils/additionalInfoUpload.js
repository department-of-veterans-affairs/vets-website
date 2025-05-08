import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import fileUiSchema from '@department-of-veterans-affairs/platform-forms-system/definitions/file';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { $$ } from '@department-of-veterans-affairs/platform-forms-system/ui';

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
    fileUploadUrl: `${environment.API_URL}/v1/decision_review_evidence`,
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
