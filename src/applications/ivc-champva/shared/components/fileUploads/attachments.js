import React from 'react';

// Schema for use with fileUploadUI

// Images + pdf
export const fileTypes = ['jpeg', 'jpg', 'png', 'pdf'];
export const maxSize = '20MB'; // This appears to be the current limit
export const minSize = '1.0KB';

export const fileWithMetadataSchema = possibleFiles => {
  let enu = possibleFiles || [];
  // If we have nested elements in format [{text: 'File Name', ...}]
  // grab the content we care about rendering:
  enu = enu.map(
    el => (typeof el === 'string' || el.text ? el.text || el : undefined),
  );
  return {
    type: 'array',
    minItems: 1,
    items: {
      type: 'object',
      required: ['attachmentId', 'name'],
      properties: {
        name: {
          type: 'string',
        },
        attachmentId: {
          type: 'string',
          enum: enu,
          enumNames: enu,
        },
      },
    },
  };
};

export const fileUploadBlurb = {
  'view:fileUploadBlurb': {
    'ui:description': (
      <>
        <div className="vads-u-margin-bottom--4">
          <b>How to upload files</b>
          <ul>
            <li>
              Format the file as a .{fileTypes.slice(0, -1).join(', .')}, or .
              {fileTypes.slice(-1)} file
            </li>
            <li>Make sure that file size is {maxSize} or less</li>
            <li>
              If you don’t have a digital copy of your document, you can scan or
              take a photo of it and then upload the image from your computer or
              phone
            </li>
          </ul>
          <p>
            If you don’t want to upload your supporting files now, you’ll have
            the option to upload them again at the end of this application.
          </p>
        </div>
      </>
    ),
  },
};
