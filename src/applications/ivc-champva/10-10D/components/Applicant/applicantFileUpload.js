import React from 'react';
import {
  blankSchema,
  acceptableFileList,
  fileUploadBlurb,
  requiredFileUploadMessage,
} from '../Sponsor/sponsorFileUploads';

export const applicantBirthCertConfig = {
  uiSchema: {
    ...acceptableFileList(['Birth certificate', 'Social Security card']),
    'view:additionalResources': {
      'ui:description': (
        <>
          <p>
            <b>Resources regarding birth certificates</b>
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

export const applicantSchoolCertConfig = {
  uiSchema: {
    ...acceptableFileList(['School certification']),
    'view:additionalResources': {
      'ui:description': (
        <>
          <p>
            <b>Resources regarding school certifications</b>
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
