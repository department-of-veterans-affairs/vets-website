import React from 'react';
import { additionalInfo } from '../../../components/fileInputComponent/AdditionalUploadInfo';

export const evidenceChoiceAdditionalDocumentsTitle =
  'Upload supporting documents and additional forms';

export const evidenceChoiceAdditionalDocumentsDescription = (
  <p>
    Upload copies of your supporting documents or additional forms to support
    your claim.
  </p>
);

export const evidenceChoiceAdditionalDocumentsContent = (
  <>
    {evidenceChoiceAdditionalDocumentsDescription}
    {additionalInfo}
  </>
);

// Backwards-compatible alias used by page imports.
export const evidenceChoiceAdditionalDocuments = evidenceChoiceAdditionalDocumentsContent;
