import React from 'react';

export const manualUploadPageTitle = 'Upload VA Form 21 -0781';

export const manualUploadPageDescription = (
  <>
    <h4 className="vads-u-font-size--h4">How to upload a file</h4>
    <p>
      If your file isn’t already saved on the device you’re using to submit this
      application, you’ll need to scan your file. Then you can upload it on this
      screen.
    </p>
  </>
);

export const howToScanFileInfo = (
  <va-additional-info trigger="How to scan a file">
    <div>
      <p>You can do this one of 2 ways:</p>

      <p>
        If you have access to a computer connected to a scanner, you can scan
        each document onto the computer. Save the file as a PDF.
      </p>

      <p>
        If you have access to a smartphone, you can download or use the Notes
        app (for an iPhone) or the Google Drive app (for an Android phone) to
        scan each document onto the phone. The file will automatically save as a
        PDF when you’re done scanning.
      </p>
    </div>
  </va-additional-info>
);

export const manualUploadRequirementsTextTitle = (
  <>
    <h4 className="vads-u-font-size--h4">Select a file to upload</h4>
  </>
);

export const manualUploadRequirementsText = (
  <div>
    <p className="usa-hint">
      You can upload a .pdf, .jpg, .jpeg, .png, .gif, .bmp, or .txt file. Your
      file should be no larger than 50 MB (non-PDF) or 99 MB (PDF only).
    </p>
  </div>
);
