import React from 'react';
import { fileTypes, maxSize } from '../../config/attachments';

const marriagePapers = [
  'Marriage certificate',
  'Civil union papers',
  'Affidavit of common law marriage',
];

export const acceptableFiles = {
  casualtyCert: ['Casualty report', 'Death certificate'],
  dischargeCert: ['DD214'],
  disabilityCert: ['VBA rating decision'],
  birthCert: ['Birth certificate', 'Social Security card'],
  schoolCert: ['School enrollment certification form', 'Enrollment letter'],
  spouseCert: marriagePapers,
  stepCert: marriagePapers,
  adoptionCert: ['Court ordered adoption papers'],
  helplessCert: ['VBA decision rating certificate of award'],
  medicareABCert: [
    'Front of Medicare Parts A or B card',
    'Back of Medicare Parts A or B card',
  ],
  medicareDCert: [
    'Front of Medicare Part D card',
    'Back of Medicare Part D card',
  ],
  ssIneligible: ['Letter from the SSA'],
  healthInsCert: [
    'Front of health insurance card',
    'Back of health insurance card',
  ],
  va7959cCert: ['VA form 10-7959c'],
};

export const blankSchema = { type: 'object', properties: {} };

export function acceptableFileList(list) {
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

export const fileUploadBlurb = {
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

export const requiredFileUploadMessage = {
  'ui:description': (
    <p>
      <b>This file is required for your application.</b>
      Your application will not be considered complete until we receive this
      file.
    </p>
  ),
};

export const optionalFileUploadMessage = {
  'ui:description': (
    <p>
      This file is not required for your application, but
      <b>
        {' '}
        not uploading this optional file will delay your application’s
        processing time.
      </b>
    </p>
  ),
};

/**
 * Builds a document upload page uiSchema and Schema.
 * @param {list of strings} fileList E.g., ['Birth certificate', 'Social security card']
 * @param {string} category E.g., 'school certificate'
 * @param {boolean} isOptional Whether or not this file upload is optional
 * @param {list of objects} resources E.g., [{href: "google.com", text: "Google"}]
 * @returns
 */
export function uploadWithInfoComponent(
  fileList,
  category,
  isOptional,
  resources,
) {
  return {
    uiSchema: {
      ...acceptableFileList(fileList || []),
      'view:additionalResources': {
        'ui:description': (
          <>
            <p>
              <b>Resources regarding {category}</b>
            </p>
            <ul>
              {resources &&
                resources.map((resource, index) => (
                  <li key={`link-${resource}-${index}`}>
                    <va-link href={resource.href} text={resource.text} />
                  </li>
                ))}
            </ul>
          </>
        ),
      },
      'view:fileUploadMessage': isOptional
        ? { ...optionalFileUploadMessage }
        : { ...requiredFileUploadMessage },
      ...fileUploadBlurb,
    },
    schema: {
      'view:acceptableFilesList': blankSchema,
      'view:additionalResources': blankSchema,
      'view:fileUploadMessage': blankSchema,
      'view:fileUploadBlurb': blankSchema,
    },
  };
}

export const sponsorDisabilityRatingConfig = uploadWithInfoComponent(
  acceptableFiles.disabilityCert,
  'disability rating',
  true,
);

export const sponsorDischargePapersConfig = uploadWithInfoComponent(
  acceptableFiles.dischargeCert,
  'discharge papers',
  true,
);

export const sponsorCasualtyReportConfig = uploadWithInfoComponent(
  acceptableFiles.casualtyCert,
  'casualty report',
  false,
);
