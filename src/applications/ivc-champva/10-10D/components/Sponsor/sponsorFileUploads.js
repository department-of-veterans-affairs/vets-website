import React from 'react';
import { fileTypes, maxSize } from '../../config/attachments';

export const blankSchema = { type: 'object', properties: {} };

function acceptableFileList(list) {
  return {
    'view:acceptableFilesList': {
      'ui:description': (
        <>
          <p>
            <b>Acceptable files include:</b>
          </p>
          <ul>
            {list.map((item, index) => (
              <li key={`file-${item}-${index}`}>{item}</li>
            ))}
          </ul>
        </>
      ),
    },
  };
}

const fileUploadBlurb = {
  'view:fileUploadBlurb': {
    'ui:description': (
      <>
        <va-alert status="info" visible uswds>
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

const optionalFileUploadMessage = {
  'view:optionalFileUploadMessage': {
    'ui:description': (
      <p>
        This file is not required for your application, but
        <b>
          not uploading this optional file will delay your application’s
          processing time.
        </b>
      </p>
    ),
  },
};

export const sponsorCasualtyReportConfig = {
  uiSchema: {
    ...acceptableFileList(['Casualty report', 'Death certificate']),
    'view:additionalResources': {
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
    'view:additionalResources': blankSchema,
    'view:requiredFileUploadMessage': blankSchema,
    'view:fileUploadBlurb': blankSchema,
  },
};

export const sponsorDisabilityRatingConfig = {
  uiSchema: {
    ...acceptableFileList(['VBA rating decision']),
    'view:additionalResources': {
      'ui:description': (
        <>
          <p>
            <b>Resources regarding disability rating</b>
          </p>
          <ul>
            <li>
              <p>Resources coming soon</p>
            </li>
          </ul>
        </>
      ),
    },
    ...optionalFileUploadMessage,
    ...fileUploadBlurb,
  },
  schema: {
    'view:acceptableFilesList': blankSchema,
    'view:additionalResources': blankSchema,
    'view:optionalFileUploadMessage': blankSchema,
    'view:fileUploadBlurb': blankSchema,
  },
};

export const sponsorDischargePapersConfig = {
  uiSchema: {
    ...acceptableFileList(['DD214']),
    'view:additionalResources': {
      'ui:description': (
        <>
          <p>
            <b>Resources regarding discharge papers</b>
          </p>
          <ul>
            <li>
              <p>Resources coming soon</p>
            </li>
          </ul>
        </>
      ),
    },
    ...optionalFileUploadMessage,
    ...fileUploadBlurb,
  },
  schema: {
    'view:acceptableFilesList': blankSchema,
    'view:additionalResources': blankSchema,
    'view:optionalFileUploadMessage': blankSchema,
    'view:fileUploadBlurb': blankSchema,
  },
};
