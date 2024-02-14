import React from 'react';
import { fileTypes, maxSize } from '../../config/attachments';

const fileUploadBlurb = {
  'view:fileUploadBlurb': {
    'ui:description': (
      <>
        <va-alert status="info" visible>
          <h3 slot="headline">
            Upload your file now or at the end of your application
          </h3>
          <p>
            If you don’t want to upload your supporting files now, you’ll have
            the option to upload again at the end of this application. If you
            don’t upload your supporting files, we’ll provide you instructions
            for how to mail or fax in your file(s).
          </p>
        </va-alert>
        <p>
          <b>Tips for uploading:</b>
        </p>
        <ul>
          <li>
            You can upload your files as one of these file types:{' '}
            {fileTypes.join(', ')}
          </li>
          <li>
            Upload one or more files that add up to no more than {maxSize}{' '}
            total.
          </li>
          <li>
            If you don’t have a digital copy of a file, you can scan or take a
            photo of it and then upload the image from your computer or phone.
          </li>
        </ul>
      </>
    ),
  },
};

const requiredFileUploadMessage = {
  'view:requiredFileUploadMessage': {
    'ui:description': (
      <p>
        <b>This file is required for your application.</b>
        Your application will not be considered complete until we receive this
        file.
      </p>
    ),
  },
};

const blankSchema = { type: 'object', properties: {} };

export const sponsorCasualtyReportConfig = {
  uiSchema: {
    'view:acceptableFilesList': {
      'ui:description': (
        <>
          <p>
            <b>Acceptable files include:</b>
          </p>
          <ul>
            <li>Casualty report</li>
            <li>Death certificate</li>
          </ul>
        </>
      ),
    },
    'view:casualtyReportResource': {
      'ui:description': (
        <>
          <p>
            <b>Resources regarding casualty report</b>
          </p>
          <ul>
            <li>
              <p>Resources coming soon</p>
            </li>
          </ul>
        </>
      ),
    },
    ...requiredFileUploadMessage,
    ...fileUploadBlurb,
  },
  schema: {
    'view:acceptableFilesList': blankSchema,
    'view:casualtyReportResource': blankSchema,
    'view:requiredFileUploadMessage': blankSchema,
    'view:fileUploadBlurb': blankSchema,
  },
};
