import React from 'react';
import PropTypes from 'prop-types';

export const evidenceChoiceAdditionalDocumentsTitle =
  'Upload supporting documents and additional forms';

export const evidenceChoiceAdditionalDocumentsDescription = (
  <p>
    Upload copies of your supporting documents or additional forms to support
    your claim.
  </p>
);

const evidenceChoiceAdditionalDocumentsAddtlInfo = (
  <va-additional-info trigger="How to prepare your files">
    <p className="vads-u-margin-top--0">
      If your document is digital, make sure it’s one of the accepted file
      types.
    </p>
    <p>
      Before you upload your files, make sure they’re saved on the device you’re
      using to submit this claim. You can do this in 1 of 2 ways:
    </p>
    <ul>
      <li>
        <p>
          On a computer connected to a scanner, scan each document and save the
          file as a PDF.
        </p>
      </li>
      <li>
        <p className="vads-u-margin-top--0">
          On a smartphone, take a photo of the document or use a scanning app to
          save it as a PDF.
        </p>
      </li>
    </ul>
  </va-additional-info>
);

const evidenceChoiceAdditionalDocumentsUploaderInfo = ({ uploadTitle }) => (
  <>
    {uploadTitle && (
      <p className="vads-u-margin--0">
        {uploadTitle}{' '}
        <span className="vads-u-color--secondary-dark">(*Required)</span>
      </p>
    )}
    <p className="vads-u-margin-top--0 vads-u-color--gray-medium">
      You can upload .pdf, .jpg, .jpeg, .png, .heic, .gif, .bmp, or .txt files.
      Each file should be no larger than 50MB for non-PDF files or 99 MB for PDF
      files. Larger files may take longer to upload, depending on the internet
      connection.
    </p>
  </>
);

evidenceChoiceAdditionalDocumentsUploaderInfo.propTypes = {
  uploadTitle: PropTypes.string,
};

const evidenceChoiceAdditionalDocumentsNote = (
  <p>
    <strong>Note:</strong> You only need to submit new evidence that we don’t
    already have.
  </p>
);

export const evidenceChoiceAdditionalDocumentsContent = (
  <>
    {evidenceChoiceAdditionalDocumentsDescription}
    {evidenceChoiceAdditionalDocumentsAddtlInfo}
    {evidenceChoiceAdditionalDocumentsUploaderInfo({
      uploadTitle: 'Select files to upload',
    })}
    {evidenceChoiceAdditionalDocumentsNote}
  </>
);

// Backwards-compatible alias used by page imports.
export const evidenceChoiceAdditionalDocuments = evidenceChoiceAdditionalDocumentsContent;
