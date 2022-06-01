import environment from 'platform/utilities/environment';
import fileUiSchema from 'platform/forms-system/src/js/definitions/file';
import { focusElement } from 'platform/utilities/ui';

import { SUPPORTED_UPLOAD_TYPES, MAX_FILE_SIZE_BYTES } from '../constants';
import { $$ } from './ui';

import {
  EvidenceUploadLabel,
  EvidenceUploadDescription,
} from '../content/EvidenceUpload';

const focusFileCard = name => {
  const target = $$('.schemaform-file-list li').find(entry =>
    entry.textContent?.trim().includes(name),
  );
  if (target) {
    focusElement(target);
  }
};

export const evidenceUploadUI = {
  ...fileUiSchema(EvidenceUploadLabel, {
    fileUploadUrl: `${environment.API_URL}/v0/decision_review_evidence`,
    addAnotherLabel: 'Add another document',
    buttonText: 'Upload',
    fileTypes: SUPPORTED_UPLOAD_TYPES,
    maxSize: MAX_FILE_SIZE_BYTES,
    minSize: 1024,
    createPayload: (file, _formId, password) => {
      const payload = new FormData();
      payload.append('decision_review_evidence_attachment[file_data]', file);
      if (password) {
        payload.append(
          'decision_review_evidence_attachment[password]',
          password,
        );
      }
      return payload;
    },
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
  }),
  'ui:description': EvidenceUploadDescription,
};
