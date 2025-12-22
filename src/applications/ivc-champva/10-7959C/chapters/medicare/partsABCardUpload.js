import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { fileUploadBlurb } from '../../../shared/components/fileUploads/attachments';
import {
  fileUploadUi as fileUploadUI,
  singleFileSchema,
} from '../../../shared/components/fileUploads/upload';
import { blankSchema } from '../../definitions';

const PAGE_DESCRIPTION = (
  <>
    <p>
      You’ll need to submit a copy of the front and back of the beneficiary’s
      Medicare card for hospital and medical coverage.
    </p>
    <p>Upload a copy of one of these documents:</p>
    <ul>
      <li>Medicare Parts A and B card, or</li>
      <li>Medicare Advantage card, or</li>
      <li>Medicare PACE card</li>
    </ul>
  </>
);

export default {
  uiSchema: {
    ...titleUI(
      'Upload Medicare card for hospital and medical coverage',
      PAGE_DESCRIPTION,
    ),
    ...fileUploadBlurb,
    applicantMedicarePartAPartBCardFront: fileUploadUI({
      label: 'Upload front of Medicare card',
      attachmentId: 'Front of Medicare Parts A or B card',
    }),
    applicantMedicarePartAPartBCardBack: fileUploadUI({
      label: 'Upload back of Medicare card',
      attachmentId: 'Back of Medicare Parts A or B card',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:fileUploadBlurb': blankSchema,
      applicantMedicarePartAPartBCardFront: singleFileSchema,
      applicantMedicarePartAPartBCardBack: singleFileSchema,
    },
  },
};
