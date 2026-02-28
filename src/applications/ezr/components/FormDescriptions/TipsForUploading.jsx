import React from 'react';

const TipsForUploading = () => (
  <va-additional-info
    trigger="Tips for uploading"
    class="vads-u-margin-bottom--3"
    uswds
  >
    <ul>
      <li>Use a .jpg, .png, .pdf, .doc, or .rtf file</li>
      <li>Upload 1 file at a time</li>
      <li>Upload files that add up to no more than 10MB total</li>
      <li>
        If you only have a paper copy, scan or take a photo and upload the image
      </li>
    </ul>
  </va-additional-info>
);

export const TipsForUploadingTeraOnly = () => (
  <va-additional-info
    trigger="How to upload files"
    class="vads-u-margin-bottom--3"
    uswds
  >
    <ul>
      <li>Use a .jpg, .png, .pdf, .doc, or .rtf file format</li>
      <li>Upload one file at a time</li>
      <li>Upload files that add up to no more than 10MB or less</li>
      <li>
        If you only have a paper copy, scan or take a photo and upload the image
      </li>
    </ul>
  </va-additional-info>
);
export default TipsForUploading;
