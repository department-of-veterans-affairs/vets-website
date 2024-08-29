import React from 'react';

// Schema for use with fileUploadUI

// Images + pdf
export const fileTypes = ['jpeg', 'jpg', 'png', 'pdf'];
export const maxSize = '20MB'; // This appears to be the current limit
export const minSize = '1.0KB';

export const fileWithMetadataSchema = (possibleFiles, minItems = 1) => {
  let enu = possibleFiles || [];
  // If we have nested elements in format [{text: 'File Name', ...}]
  // grab the content we care about rendering:
  enu = enu.map(
    el => (typeof el === 'string' || el.text ? el.text || el : undefined),
  );
  return {
    type: 'array',
    minItems,
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

export const fileUploadBlurbCustom = (items, afterContent) => {
  return {
    'view:fileUploadBlurb': {
      'ui:description': (
        <>
          <div className="vads-u-margin-bottom--4">
            <b>How to upload files:</b>
            <ul>
              <li>
                Use a .{fileTypes.slice(0, -1).join(', .')}, or .
                {fileTypes.slice(-1)} file
              </li>
              <li>Make sure that file size is {maxSize} or less</li>
              <li>
                If you only have a paper copy, scan or take a photo and upload
                the image
              </li>
              {items}
            </ul>
          </div>
          {afterContent}
        </>
      ),
    },
  };
};

// Wrapper around the custom blurb fn preserves imports/usage of original
// fileUploadBlurb without having to update a bunch of places to use new fn call
export const fileUploadBlurb = {
  ...fileUploadBlurbCustom(),
};
