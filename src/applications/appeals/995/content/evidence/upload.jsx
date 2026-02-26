import React from 'react';

export const promptContent = {
  title: 'Do you want to upload evidence to support your claim?',
  description: (
    <p>
      Supporting evidence can include private medical records or a lay/witness
      statement (sometimes called a “buddy statement”). A lay/witness statement
      is a written statement from family, friends, or coworkers to help support
      your claim.
    </p>
  ),
};

export const summaryContent = {
  summaryTitle: 'Review the evidence you’re submitting',
  options: {
    Y: 'Yes',
    N: 'No',
  },
  requiredError: 'Select if you want to upload evidence',
};

export const detailsContent = {
  title: 'Upload your supporting evidence',
  inputLabel: 'Upload your files',
  description: (
    <>
      <p className="vads-u-margin-top--0">
        You’ll need to upload new and relevant evidence for your Supplemental
        Claim. This may include supporting evidence like lay/witness statements.
      </p>
      <p>
        You may need to scan your evidence first using our file upload
        instructions.
      </p>
      <h4>File upload instructions</h4>
      <p>
        Follow these steps if you have access to a computer connected to a
        scanner:{' '}
      </p>
      <ul>
        <li>Scan each file onto the computer</li>
        <li>Save the file as a PDF, GIF, JPG, JPEG, BMP, or TXT file</li>
      </ul>
      <p>Follow these steps if you have access to a smartphone: </p>
      <ul>
        <li>
          Download and use the Notes app (for an iPhone) or the Google Drive app
          (for an Android phone) to scan each file onto the phone
        </li>
        <li>
          The file will automatically save as a PDF when you’re done scanning
        </li>
      </ul>
      <p>Make sure your files:</p>
      <ul>
        <li>Total 100MB or less</li>
        <li>Are no larger than 78 inches x 101 inches</li>
      </ul>
      <p>
        <strong>Note:</strong> A 1MB file is about 500 pages of text. A photo is
        about 6MB. Large files can take longer to upload with a slow Internet
        connection.{' '}
      </p>
    </>
  ),
};
