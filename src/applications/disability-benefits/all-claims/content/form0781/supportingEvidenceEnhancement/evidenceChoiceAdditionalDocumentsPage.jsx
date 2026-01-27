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
  <div>
    {uploadTitle && (
      <p className="vads-u-margin-top--3">
        {uploadTitle}{' '}
        <span className="schemaform-required-span vads-u-font-weight--normal">
          (*Required)
        </span>
      </p>
    )}
    <p>
      You can upload your file in a .pdf, .jpg, .jpeg, .png, .gif, .bmp, or .txt
      format. You’ll first need to scan a copy of your file onto your computer
      or mobile phone. You can then upload the file from there.
    </p>
    <p>Guidelines for uploading a file:</p>
    <ul>
      <li>
        File types you can upload: .pdf, .jpg, .jpeg, .png, .gif, .bmp, or .txt
      </li>
    </ul>
    <p>
      <em>
        A 1MB file equals about 500 pages of text. A photo is usually about 6MB.
        Large files can take longer to upload with a slow Internet connection.
      </em>
    </p>
  </div>
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
      uploadTitle: 'Upload your documents',
    })}
    {evidenceChoiceAdditionalDocumentsNote}
  </>
);

// Backwards-compatible alias used by page imports.
export const evidenceChoiceAdditionalDocuments = evidenceChoiceAdditionalDocumentsContent;
