import React from 'react';

export const UploadDescription = ({ uploadTitle }) => (
  <div>
    {uploadTitle && <h3 className="vads-u-font-size--h5">{uploadTitle}</h3>}
    <p>
      You can upload your document in a .pdf (unlocked), .jpg, .jpeg, .png,
      .gif, .bmp, or .txt file format. You’ll first need to scan a copy of your
      document onto your computer or mobile phone. You can then upload the
      document from there.
      <br />
      Guidelines for uploading a file:
    </p>
    <ul>
      <li>
        File types you can upload: .pdf (unlocked), .jpg, .jpeg, .png, .gif,
        .bmp, or .txt
      </li>
      <li>Maximum file size: 50MB</li>
    </ul>
    <p>
      <em>
        A 1MB file equals about 500 pages of text. A photo is usually about 6MB.
        Large files can take longer to upload with a slow Internet connection.
      </em>
    </p>
  </div>
);
